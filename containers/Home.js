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
  signin() {
    const { email, password } = this.state;
    OneSignal.idsAvailable(({ pushToken, playerId, userId }) => {
      this.props.login(email, password, pushToken && (playerId || userId)).then(
        (auth) => AsyncStorage.setItem('bearer', auth.bearer)
      );
    });
  },
  renderSignin() {
    return (
      <View style={styles.container}>
        <TextInput
          autoCapitalize='none'
          autoCorrect={false}
          keyboardType='email-address'
          onChangeText={(email) => this.setState({ email })}
          placeholder='Email address'
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          value={this.state.email}
        />
        <TextInput
          autoCapitalize='none'
          autoCorrect={false}
          onChangeText={(password) => this.setState({ password })}
          placeholder='Password'
          secureTextEntry={true}
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          value={this.state.password}
        />
        <Text style={styles.signin} onPress={this.signin}>
          Sign In
        </Text>
      </View>
    );
  },
  render() {
    const { auth: { bearer, roles, email }, push } = this.props;
    if (!bearer) {
      return this.renderSignin();
    }

    const brands = _.filter(roles,
      (r) => r.type === 'owner' || r.type === 'staff').map((r) => r.brand);
    return (
      <View style={styles.container}>
        <Text>{email}</Text>
        {brands.map((b, idx) => (
          <Text key={idx} onPress={() => push(routes.stats({ brandId: b.id }))}>
            {b.id}
          </Text>
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
  signin: {
    borderColor: '#00ff00',
    borderWidth: 2,
    color: '#333333',
    textAlign: 'center',
  },
});

export default connect(
  (state) => ({ auth: state.auth }) , authActions
)(Home);
