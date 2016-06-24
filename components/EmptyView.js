'use strict';

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default React.createClass({
  render() {
    const { text } = this.props;
    return (
      <View style={styles.container}>
        <Text> {text} </Text>
      </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#B2B2B2',
    fontSize: 12,
  },
});
