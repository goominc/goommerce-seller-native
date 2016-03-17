/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { Provider, connect } from 'react-redux'
import { config as configApiClient } from 'goommerce-api-client';
import configureStore, { authActions } from 'goommerce-redux';

configApiClient({ apiRoot: 'http://localhost:8080'})
const store = configureStore();

class Signin extends Component {
  componentDidMount() {
    this.props.login('ss@gmail.com', 'ss').then((res) => console.log(res));
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.instructions}>
         {this.props.auth.email}
        </Text>
      </View>
    );
  }
}
const SigninWrap = connect((state) => ({ auth: state.auth }), authActions)(Signin);

class GoommerceSeller extends Component {
  render() {
    return (
      <Provider store={store}>
        <SigninWrap />
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('GoommerceSeller', () => GoommerceSeller);
