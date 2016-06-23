'use strict';

import React from 'react';
import { AsyncStorage, StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux'
import OneSignal from 'react-native-onesignal';
import Button from 'react-native-button';
import { authActions, brandActions } from 'goommerce-redux';

import _ from 'lodash';

const Profile = React.createClass({
  componentDidMount() {
    const { loadBrand, brandId } = this.props;
    loadBrand(brandId);
  },
  signout() {
    OneSignal.idsAvailable(({ pushToken, userId }) => {
      this.props.logout(pushToken && userId).then(
        () => AsyncStorage.removeItem('bearer')
      );
    });
  },
  render() {
    const { brand } = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.name} numberOfLines={1}>{_.get(brand, 'name.ko')}</Text>
        <Text style={styles.main}>{'http://www.linkshops.com/'}</Text>
        <Text style={styles.main}>{_.toLower(_.get(brand, 'pathname'))}</Text>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#4C4C4C' }}>{_.get(brand, 'data.location.building.name.ko')}</Text>
        <Text style={styles.main}>{_.get(brand, 'data.location.floor')} {_.get(brand, 'data.location.flatNumber')}</Text>
        <Text style={styles.footer}>친절하고 빠른 서비스 / 이용문의</Text>
        <Text style={styles.footer}>02-2272-1122</Text>
        <Text style={styles.footer}>카카오톡: @링크샵스 판매자 센터</Text>
        <Button
          style={{color: 'white'}}
          styleDisabled={{color: 'red'}}
          containerStyle={styles.signoutContainer}
          onPress={this.signout}
        >
          Logout
        </Button>
      </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  signoutContainer: {
    backgroundColor: '#1fcbf6',
    borderRadius: 6,
    marginTop: 20,
    overflow:'hidden',
    paddingHorizontal: 60,
    paddingVertical: 10,
  },
  name: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4C4C4C',
  },
  main: {
    fontSize: 11,
    color: '#4C4C4C',
  },
  footer: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#999999',
  },
});

export default connect(
  (state, ownProps) => {
    const { key } = brandActions.loadBrand(ownProps.brandId);
    return { brand: state.brand[key] };
  }, _.assign({}, authActions, brandActions)
)(Profile);
