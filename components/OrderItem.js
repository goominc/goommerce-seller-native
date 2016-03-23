'use strict';

import React, {
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const _ = require('lodash');

export default React.createClass({
  render() {
    const { order } = this.props;
    const { product, productVariant } = order;
    return (
      <View>
        <Text>id: {order.id}</Text>
        <Text>nick: {product.data.nickname.ko}</Text>
        <Text>color: {productVariant.data.color}</Text>
        <Text>size: {productVariant.data.size}</Text>
        <Text>Unit Price(KRW): {order.KRW}</Text>
        <Icon.Button name="minus" />
        <Text>Count: {order.orderedCount}</Text>
        <Icon.Button name="plus" />
        <Text>Total(KRW): {order.totalKRW}</Text>
        <Text>Total(USD): {order.totalUSD}</Text>
        <Image
          style={styles.image}
          source={{ uri: `https://${_.get(productVariant.appImages.default, '0.url')}` }}
        />
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
  image: {
    width: 90,
    height: 90,
  },
});
