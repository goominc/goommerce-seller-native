'use strict';

import React, {
  Image,
  Picker,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { CloudinaryImageNative } from 'react-cloudinary';

import CountPicker from './CountPicker';

const _ = require('lodash');

export default React.createClass({
  getInitialState() {
    return { count: this.props.order.orderedCount };
  },
  render() {
    const { order } = this.props;
    const { product, productVariant } = order;
    const { nickname } = product.data;
    const { color, size } = productVariant.data;
    const image = productVariant.appImages.default[0];
    return (
      <View style={styles.container}>
        <CloudinaryImageNative
          publicId={image.publicId}
          options={{ width: 100, height: 100 }}
          style={styles.thumbnail}
        />
        <View style={styles.descContainer}>
          <Text>#: {order.id}</Text>
          <Text>{nickname.ko}: {color}-{size}</Text>
          <CountPicker
            prefix={`₩${order.KRW} X `}
            start={1}
            end={order.orderedCount}
            value={order.orderedCount}
          />
          <View style={styles.confirmContainer}>
            <Icon.Button name="check">
              <Text style={styles.signin}>In Stock</Text>
            </Icon.Button>
            <Icon.Button name="times">
              <Text style={styles.signin}>Out Of Stock</Text>
            </Icon.Button>
          </View>
        </View>
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
    backgroundColor: '#F5FCFF',
  },
  descContainer: {
    flex: 1,
  },
  counterContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  confirmContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumbnail: {
    width: 90,
    height: 90,
  },
});
