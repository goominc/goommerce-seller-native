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
        {brands.map((b, idx) => (
          <View key={idx}>
            <Text onPress={() => push(routes.stats({ brandId: b.id }))}>
              {b.id}
            </Text>
            <Text onPress={() => push(routes.list({ brandId: b.id }))}>
              New Orders
            </Text>
          </View>
        ))}
      </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    flex: 1,
    justifyContent: 'center',
  },
});

export default connect(
  (state) => ({ auth: state.auth }) , authActions
)(Home);
