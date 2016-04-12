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
import DefaultText from './DefaultText';

const _ = require('lodash');

export default React.createClass({
  getInitialState() {
    return { quantity: this.props.orderProduct.quantity };
  },
  renderButtons() {
    const { confirm } = this.props;
    return (
      <View style={styles.confirmContainer}>
        <Icon.Button name="check" onPress={() => confirm(this.state.quantity)}>
          <Text style={styles.signin}>In Stock</Text>
        </Icon.Button>
        <Icon.Button name="times" onPress={() => confirm(0)}>
          <Text style={styles.signin}>Out Of Stock</Text>
        </Icon.Button>
      </View>
    );
  },
  render() {
    const { orderProduct } = this.props;
    const { product, productVariant } = orderProduct;
    const { name } = product;
    const { color, size } = productVariant.data;
    const image = productVariant.appImages.default[0];
    return (
      <View style={styles.container}>
        <CloudinaryImageNative
          publicId={image.publicId}
          options={{ width: 200, height: 200 }}
          style={styles.thumbnail}
        />
        <View style={styles.descContainer}>
          <DefaultText text={`#: ${orderProduct.id}`} />
          <DefaultText text={`${name.ko}: ${color}-${size}`} />
          <CountPicker
            prefix={`₩${orderProduct.KRW} X `}
            start={1}
            end={orderProduct.count}
            selectedValue={this.state.quantity}
            onValueChange={(value) => this.setState({ quantity: value })}
            enabled={orderProduct.status === 101}
          />
          {orderProduct.status === 101 && this.renderButtons()}
        </View>
      </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  descContainer: {
    flex: 1,
  },
  confirmContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  thumbnail: {
    width: 90,
    height: 90,
    marginRight: 10,
    backgroundColor: '#dddddd',
  },
});
