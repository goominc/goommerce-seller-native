'use strict';

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default React.createClass({
  render() {
    const { onOrderList, onOrderStats, onProductList } = this.props;
    return (
      <View>
        <Icon.Button name="list" onPress={onProductList} style={styles.button}>
          <Text style={styles.text}>Products</Text>
        </Icon.Button>
        <Icon.Button name="shopping-cart" onPress={onOrderList} style={styles.button}>
          <Text style={styles.text}>Orders</Text>
        </Icon.Button>
      </View>
    );
  }
});

const styles = StyleSheet.create({
  button: {
  },
  text: {
    fontSize: 20,
  },
});
