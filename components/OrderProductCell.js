'use strict';

import React, {
  Image,
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
import _ from 'lodash';

import CountPicker from './CountPicker';

function getInitialState(props) {
  const { orderProduct } = props;
  const quantity = _.get(orderProduct, "data.stock.quantity", orderProduct.quantity);
  return {
    quantity: quantity.toString(),
    confirmed: orderProduct.status !== 101,
  };
}

export default React.createClass({
  getInitialState() {
    return getInitialState(this.props);
  },
  popupReasonModal() {
  },
  toggleConfirm(confirmed) {
    this.setState({confirmed});
    if (confirmed) {
      this.props.confirm(+this.state.quantity).then(
        () => this.setState(getInitialState(this.props))
      );
    }
  },
  renderThumbnail({ product, productVariant }) {
    const image = _.get(productVariant, 'appImages.default.0');
    if (image) {
      return (
        <CloudinaryImageNative
          publicId={image.publicId}
          options={{ width: 100, height: 100 }}
          style={styles.thumbnail}
        />
      );
    }
  },
  render() {
    const { orderProduct } = this.props;
    const { product, productVariant } = orderProduct;
    const { name } = product;
    const { color, size } = productVariant.data;
    const image = _.get(productVariant, 'appImages.default.0');
    return (
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <Text>{name.ko}</Text>
          <Text>{color} / {size}</Text>
          <Text>{`${numeral(orderProduct.KRW).format('0,0')}원`}</Text>
          {this.renderThumbnail(orderProduct)}
        </View>
        <View style={{ flex: 1 }}>
          <Text>주문수량: {numeral(orderProduct.quantity).format('0,0')}</Text>
          <TextInput
            autoCapitalize='none'
            autoCorrect={false}
            keyboardType='number-pad'
            onChangeText={(quantity) => this.setState({quantity})}
            value={this.state.quantity}
            style={styles.quantityInput}
            editable={!this.state.confirmed}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text>수량 변경 사유</Text>
          <Button
            style={{color: 'black'}}
            styleDisabled={{color: 'red'}}
            containerStyle={styles.popupButton}
            onPress={this.popupReasonModal}
            disabled={this.state.confirmed || this.state.quantity == orderProduct.quantity}
          >
            재입고예정
          </Button>
        </View>
        <View style={{ marginHorizontal: 5 }}>
          <Text>주문확인</Text>
          <Switch
            onValueChange={this.toggleConfirm}
            value={this.state.confirmed}
            disabled={orderProduct.status !== 101 &&
              orderProduct.status !== 102 && orderProduct.status !== 104}
          />
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
  thumbnail: {
    backgroundColor: '#dddddd',
    borderColor: 'gray',
    borderWidth: 1,
    height: 50,
    width: 50,
  },
  quantityInput: {
    borderColor: 'gray',
    borderRadius: 6,
    borderWidth: 1,
    height: 45,
    marginHorizontal: 5,
    textAlign: 'center',
  },
  popupButton: {
    borderColor: 'gray',
    borderRadius: 6,
    borderWidth: 1,
    overflow:'hidden',
    height: 45,
    marginHorizontal: 5,
    justifyContent:'center',
  },
});
