'use strict';

import React, {
  AsyncStorage,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { connect } from 'react-redux'
import { authActions } from 'goommerce-redux';

const Signin = React.createClass({
  getInitialState() {
    return {};
  },
  signin() {
    const { email, password } = this.state;
    this.props.login(email, password).then(
      (auth) => AsyncStorage.setItem('bearer', auth.bearer)
    );
  },
  render() {
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

export default connect(undefined, authActions)(Signin);
