'use strict';

import React from 'react';
import { AsyncStorage, StyleSheet, Text, TextInput, View } from 'react-native';
import Button from 'react-native-button';
import { connect } from 'react-redux'
import { authActions } from 'goommerce-redux';
import OneSignal from 'react-native-onesignal';

const Signin = React.createClass({
  getInitialState() {
    return {};
  },
  signin() {
    const { email, password } = this.state;
    OneSignal.idsAvailable(({ pushToken, userId }) => {
      this.props.login(email, password, pushToken && userId).then(
        (auth) => AsyncStorage.setItem('bearer', auth.bearer)
      );
    });
  },
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.desc}>
          <Text style={{ fontSize: 30, fontWeight: '400' }}>Link<Text style={{ fontWeight: '900' }}>Shop</Text>s</Text>
          <Text style={{ fontSize: 12, color: '#b2b2b2' }}>링크샵스 판매자 전용App 입니다.</Text>
        </View>
        <TextInput
          autoCapitalize='none'
          autoCorrect={false}
          keyboardType='email-address'
          onChangeText={(email) => this.setState({ email })}
          placeholder='e-mail'
          style={styles.input}
          value={this.state.email}
        />
        <TextInput
          autoCapitalize='none'
          autoCorrect={false}
          onChangeText={(password) => this.setState({ password })}
          placeholder='password'
          secureTextEntry={true}
          style={styles.input}
          value={this.state.password}
        />
        <Button
          style={{color: 'white'}}
          styleDisabled={{color: 'red'}}
          containerStyle={styles.signinContainer}
          onPress={this.signin}
        >
          Login
        </Button>
        <Text style={styles.registeration}>입점신청 하기</Text>
      </View>
    );
  },
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
  },
  desc: {
    alignItems: 'center',
    marginBottom: 40,
  },
  input: {
    backgroundColor: '#eeeeee',
    borderRadius: 6,
    color: '#b2b2b2',
    fontSize: 12,
    height: 50,
    marginHorizontal: 20,
    marginVertical: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  signinContainer: {
    backgroundColor: '#1fcbf6',
    borderRadius: 6,
    marginTop: 20,
    overflow:'hidden',
    paddingHorizontal: 60,
    paddingVertical: 10,
  },
  registeration: {
    color: '#b2b2b2',
    fontSize: 12,
    marginTop: 25,
    textDecorationLine: 'underline',
  }
});

export default connect(
  (state) => ({ auth: state.auth }), authActions
)(Signin);
