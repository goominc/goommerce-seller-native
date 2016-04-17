'use strict';

import React, {
  AsyncStorage,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { connect } from 'react-redux'
import OneSignal from 'react-native-onesignal';
import Button from 'react-native-button';
import { authActions } from 'goommerce-redux';

const _ = require('lodash');

const Profile = React.createClass({
  signout() {
    OneSignal.idsAvailable(({ pushToken, playerId, userId }) => {
      this.props.logout(pushToken && (playerId || userId)).then(
        () => AsyncStorage.removeItem('bearer')
      );
    });
  },
  render() {
    const { auth: { roles = [] } } = this.props;

    const brands = _.filter(roles,
      (r) => r.type === 'owner' || r.type === 'staff').map((r) => r.brand);
    return (
      <View style={styles.container}>
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
});

export default connect(
  (state) => ({ auth: state.auth }) , authActions
)(Profile);
