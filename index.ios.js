/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, {
  AppRegistry,
  Component,
  StyleSheet,
} from 'react-native';

import { Provider } from 'react-redux'
import { config as configApiClient } from 'goommerce-api-client';
import configureStore from 'goommerce-redux';

import Signin from './containers/Signin';

configApiClient({ apiRoot: 'http://localhost:8080'})
const store = configureStore();

class GoommerceSeller extends Component {
  render() {
    return (
      <Provider store={store}>
        <Signin />
      </Provider>
    );
  }
}

AppRegistry.registerComponent('GoommerceSeller', () => GoommerceSeller);
