'use strict';

import React, {
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default React.createClass({
  render() {
    const { text, style } = this.props;
    return (
      <Text style={[styles.default, style]}>{text}</Text>
    );
  }
});

const styles = StyleSheet.create({
  default: {
    fontSize: 17,
  },
});
