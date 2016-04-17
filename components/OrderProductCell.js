'use strict';

import React, {
  Image,
  Picker,
  StyleSheet,
  Text,
  TextInput,
  Switch,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { CloudinaryImageNative } from 'react-cloudinary';
import numeral from 'numeral';
import Button from 'react-native-button';

import CountPicker from './CountPicker';

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
        <View style={{ flex: 1 }}>
          <Text>{color}</Text>
          <Text>{size}</Text>
          <Text>{`${numeral(orderProduct.KRW).format('0,0')}원`}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <TextInput
            autoCapitalize='none'
            autoCorrect={false}
            keyboardType='number-pad'
            value={orderProduct.quantity.toString()}
            style={{ height: 50 }}
          />
        </View>
        <View style={{ marginHorizontal: 5 }}>
          <Switch />
        </View>
        <View style={{ flex: 1 }}>
          <Button
            style={{color: 'blue'}}
            styleDisabled={{color: 'red'}}
            containerStyle={styles.signinContainer}
            onPress={this.signin}
          >
            Save
          </Button>
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
