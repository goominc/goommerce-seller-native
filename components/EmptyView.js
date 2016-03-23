'use strict';

import React, {
  StyleSheet,
  Text,
  View,
} from 'react-native';

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
});
