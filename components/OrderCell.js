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
    return { orderedCount: this.props.order.orderedCount };
  },
  renderButtons() {
    const { confirm } = this.props;
    return (
      <View style={styles.confirmContainer}>
        <Icon.Button name="check" onPress={() => confirm(this.state.orderedCount)}>
          <Text style={styles.signin}>In Stock</Text>
        </Icon.Button>
        <Icon.Button name="times" onPress={() => confirm(0)}>
          <Text style={styles.signin}>Out Of Stock</Text>
        </Icon.Button>
      </View>
    );
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
          options={{ width: 200, height: 200 }}
          style={styles.thumbnail}
        />
        <View style={styles.descContainer}>
          <DefaultText text={`#: ${order.id}`} />
          <DefaultText text={`${nickname.ko}: ${color}-${size}`} />
          <CountPicker
            prefix={`₩${order.KRW} X `}
            start={1}
            end={order.orderedCount}
            selectedValue={this.state.orderedCount}
            onValueChange={(value) => this.setState({ orderedCount: value })}
            enabled={order.status === 1}
          />
          {order.status === 1 && this.renderButtons()}
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
