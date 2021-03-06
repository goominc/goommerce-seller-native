'use strict';

import React from 'react';
import { Alert, AsyncStorage, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import Button from 'react-native-button';
import { connect } from 'react-redux'
import { authActions, errorActions } from 'goommerce-redux';
import OneSignal from 'react-native-onesignal';
import _ from 'lodash';

const Signin = React.createClass({
  getInitialState() {
    return {};
  },
  signin() {
    const { email, password } = this.state;
    const { login, resetError } = this.props;
    // Getting idsAvailable
    OneSignal.configure({
      onIdsAvailable({ userId, pushToken }) {
        login(email, password, pushToken && userId).then(
          (auth) => auth && AsyncStorage.setItem('bearer', auth.bearer),
          (err) => Alert.alert(
            '에러',
            '아이디 / 비밀번호가 일치하지 않습니다.',
            [{ text: '확인', onPress: () => resetError() }],
          ),
        );
      },
    });
  },
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.desc}>
          <Image source={require('./images/logo.png')} style={{ height: 40, width: 160, resizeMode: 'contain' }}/>
          <Text style={{ fontSize: 12, color: '#b2b2b2' }}>링크샵스 판매자 전용App 입니다.</Text>
        </View>
        <TextInput
          autoCapitalize='none'
          autoCorrect={false}
          keyboardType='email-address'
          onChangeText={(email) => this.setState({ email })}
          placeholder='e-mail'
          placeholderTextColor='#B2B2B2'
          style={styles.input}
          value={this.state.email}
        />
        <TextInput
          autoCapitalize='none'
          autoCorrect={false}
          onChangeText={(password) => this.setState({ password })}
          placeholder='password'
          placeholderTextColor='#B2B2B2'
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
    color: '#4C4C4C',
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
  (state) => ({ auth: state.auth }), _.assign({}, authActions, errorActions)
)(Signin);
