'use strict';

import React, {
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { CloudinaryImageNative } from 'react-cloudinary';

const _ = require('lodash');

export default React.createClass({
  render() {
    const { order } = this.props;
    const { product, productVariant } = order;
    const image = productVariant.appImages.default[0];
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
        <CloudinaryImageNative
          publicId={image.publicId}
          options={{ width: 100, height: 100 }}
          style={styles.image}
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
