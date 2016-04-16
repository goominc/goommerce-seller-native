'use strict';

import React, {
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import Button from 'react-native-button';

export default React.createClass({
  getInitialState() {
    return {};
  },
  signin() {
    const { email, password } = this.state;
    this.props.signin(email, password);
  },
  render() {
    return (
      <View style={styles.container}>
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
  input: {
    backgroundColor: '#eeeeee',
    borderRadius: 6,
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
});
