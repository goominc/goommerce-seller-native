'use strict';

import React, {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default React.createClass({
  render() {
    const { onNewOrders, onOrderStats } = this.props;
    return (
      <View>
        <Icon.Button name="calendar" onPress={onOrderStats} style={styles.button}>
          <Text style={styles.text}>Order Stats</Text>
        </Icon.Button>
        <Icon.Button name="shopping-cart" onPress={onNewOrders} style={styles.button}>
          <Text style={styles.text}>New Orders</Text>
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
