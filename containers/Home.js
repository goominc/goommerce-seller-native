'use strict';

import React, {
  AsyncStorage,
  ListView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { connect } from 'react-redux'
import { authActions } from 'goommerce-redux';
import OneSignal from 'react-native-onesignal';
import Icon from 'react-native-vector-icons/FontAwesome';

import BrandItem from '../components/BrandItem';
import Signin from '../components/Signin';

import routes from '../routes';

const _ = require('lodash');

const Home = React.createClass({
  getInitialState() {
    return {};
  },
  componentDidMount() {
    const { auth, whoami } = this.props;
    if (auth.bearer && !auth.email) {
      whoami();
    }
  },
  signin(email, password) {
    OneSignal.idsAvailable(({ pushToken, playerId, userId }) => {
      this.props.login(email, password, pushToken && (playerId || userId)).then(
        (auth) => AsyncStorage.setItem('bearer', auth.bearer)
      );
    });
  },
  signout() {
    OneSignal.idsAvailable(({ pushToken, playerId, userId }) => {
      this.props.logout(pushToken && (playerId || userId)).then(
        () => AsyncStorage.removeItem('bearer')
      );
    });
  },
  render() {
    const { auth: { bearer, roles, email }, push } = this.props;
    if (!bearer) {
      return (<Signin signin={this.signin} />);
    }

    const brands = _.filter(roles,
      (r) => r.type === 'owner' || r.type === 'staff').map((r) => r.brand);
    return (
      <View style={styles.container}>
        <Text>{email}</Text>
        <Icon.Button name="sign-out" onPress={this.signout}>
          <Text style={styles.signout}>Sign Out</Text>
        </Icon.Button>
        {brands.map((b, idx) => (
          <BrandItem key={idx} brand={b}
            onOrderStats={() => push(routes.stats({ brandId: b.id }))}
            onNewOrders={() => push(routes.list({
              brandId: b.id,
              filter: (o) => o.status === 1,
            }))}
          />
      ))}
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
  signout: {
    fontSize: 20,
  },
});

export default connect(
  (state) => ({ auth: state.auth }) , authActions
)(Home);
