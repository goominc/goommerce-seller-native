'use strict';

import React, {
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { connect } from 'react-redux';

import Signin from './Signin';
import App from './App';

const Root = React.createClass({
  render() {
    const { auth } = this.props;
    if (auth.bearer) {
      return (<App />);
    }
    return (<Signin />);
  }
});

export default connect(
  (state) => ({ auth: state.auth })
)(Root);
