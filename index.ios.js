/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, {
  AppRegistry,
  AsyncStorage,
  Component,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Provider } from 'react-redux'
import { config as configApiClient } from 'goommerce-api-client';
import configureStore from 'goommerce-redux';

import Root from './containers/Root';

configApiClient({ apiRoot: 'http://localhost:8080'})
const store = configureStore();

const GoommerceSeller = React.createClass({
  getInitialState() {
    return { loading: true };
  },
  componentDidMount() {
    AsyncStorage.getItem('bearer').then(
      (bearer) => {
        store.dispatch({ type: 'LOGIN', payload: { bearer } });
        this.setState({ loading: false });
      }
    );
  },
  render() {
    if (this.state.loading) {
      return (
        <View>
          <Text>
            Loading...
          </Text>
        </View>
      );
    }
    return (
      <Provider store={store}>
        <Root />
      </Provider>
    );
  }
});

AppRegistry.registerComponent('GoommerceSeller', () => GoommerceSeller);
