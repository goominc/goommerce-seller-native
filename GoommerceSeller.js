'use strict';
import React, {
  Alert,
  AsyncStorage,
  Component,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Provider } from 'react-redux'
import { config as configApiClient } from 'goommerce-api-client';
import configureStore, { errorActions } from 'goommerce-redux';
import { cloudinaryConfig } from 'react-cloudinary';

import App from './containers/App';

cloudinaryConfig({ cloud_name: 'linkshops', crop: 'limit' });

configApiClient({ apiRoot: (Platform.OS === 'ios') ? 'http://localhost:8080' : 'http://10.0.3.2:8080' });
const store = configureStore();

store.subscribe(() => {
  const { error: { message } } = store.getState();
  if (message) {
    Alert.alert(
      'Error',
      message,
      [{ text: 'OK', onPress: () => errorActions.resetError()(store.dispatch) }],
    );
  }
});

export default React.createClass({
  getInitialState() {
    return { loaded: false };
  },
  componentDidMount() {
    AsyncStorage.getItem('bearer').then(
      (bearer) => {
        store.dispatch({ type: 'LOGIN', payload: { bearer } });
        this.setState({ loaded: true });
      }
    );
  },
  render() {
    if (!this.state.loaded) {
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
        <App />
      </Provider>
    );
  }
});
