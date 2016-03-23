'use strict';

import React, {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default React.createClass({
  render() {
    const { order } = this.props;
    return (
      <View>
        <Text>id: {order.id}</Text>
        <Text>Unit Price(KRW): {order.KRW}</Text>
        <Text>Count: {order.orderedCount}</Text>
        <Text>Total(KRW): {order.totalKRW}</Text>
        <Text>Total(USD): {order.totalUSD}</Text>
        <Icon.Button name="check">
          <Text style={styles.signin}>In Stock</Text>
        </Icon.Button>
        <Icon.Button name="times">
          <Text style={styles.signin}>Out Of Stock</Text>
        </Icon.Button>
      </View>
    );
  }
});

const styles = StyleSheet.create({
});
