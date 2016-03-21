'use strict';

import React, {
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

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
        <Icon.Button name="sign-in" backgroundColor="#3b5998" onPress={this.signin}>
          <Text style={styles.signin}>Sign In</Text>
        </Icon.Button>
      </View>
    );
  },
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    flex: 1,
    justifyContent: 'center',
  },
  signin: {
    fontSize: 15,
  },
});
