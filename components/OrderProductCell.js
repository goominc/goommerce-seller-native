'use strict';

import React, {
  Image,
  StyleSheet,
  Text,
  TextInput,
  Switch,
  View,
} from 'react-native';
import { CloudinaryImageNative } from 'react-cloudinary';
import _ from 'lodash';
import Button from 'react-native-button';
import Icon from 'react-native-vector-icons/FontAwesome';
import ModalPicker from 'react-native-modal-picker'
import numeral from 'numeral';

import CountPicker from './CountPicker';

function getInitialState(props) {
  const { orderProduct } = props;
  const quantity = _.get(orderProduct, 'data.stock.quantity', orderProduct.quantity);
  return {
    quantity: quantity.toString(),
    reason: _.get(orderProduct, 'data.stock.reason', 0),
    confirmed: orderProduct.status !== 101,
  };
}

export default React.createClass({
  getInitialState() {
    return getInitialState(this.props);
  },
  toggleConfirm(confirmed) {
    this.setState({confirmed});
    if (confirmed) {
      const { quantity, reason } = this.state;
      this.props.confirm(+quantity, reason).then(
        () => this.setState(getInitialState(this.props))
      );
    }
  },
  setQuantity(quantity) {
    const { orderProduct } = this.props;
    if (quantity) {
      quantity = _.clamp(_.toSafeInteger(quantity), 0, orderProduct.quantity);
    }
    this.setState({
      quantity: quantity.toString(),
      reason: quantity == orderProduct.quantity ? 0 : (this.state.reason || 10),
    });
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
  renderReasonModal() {
    const { orderProduct } = this.props;
    const disabled= this.state.confirmed || this.state.quantity == orderProduct.quantity;
    const data = {
      0: { key: 0, label: '재고 있음' },
      10: { key: 10, label: '재입고 예정' },
      30: { key: 30, label: '품절' },
    };
    const selected = data[this.state.reason].label;
    const button = (
      <View style={styles.reasonButton}>
        <Text style={styles.reasonButtonText}>{selected}</Text>
      </View>
    );
    if (disabled) {
      return button;
    }
    return (
      <ModalPicker
        data={_.values(data).slice(1)}
        initValue={selected}
        onChange={(option)=> this.setState({ reason: option.key })}
      >
        {button}
      </ModalPicker>
    );
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
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text>주문수량: {numeral(orderProduct.quantity).format('0,0')}</Text>
          <Button
            containerStyle={styles.quantityButton}
            onPress={() => this.setQuantity(this.state.quantity + 1)}
          >
            <Icon name='chevron-up' size={20} />
          </Button>
          <TextInput
            autoCapitalize='none'
            autoCorrect={false}
            keyboardType='number-pad'
            onChangeText={this.setQuantity}
            value={this.state.quantity}
            style={styles.quantityInput}
            editable={!this.state.confirmed}
          />
          <Button
            containerStyle={styles.quantityButton}
            onPress={() => this.setQuantity(this.state.quantity - 1)}
          >
            <Icon name='chevron-down' size={20} />
          </Button>
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text>수량 변경 사유</Text>
          {this.renderReasonModal()}
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
  quantityButton: {
    paddingHorizontal: 15,
  },
  quantityInput: {
    borderColor: 'gray',
    borderRadius: 6,
    borderWidth: 1,
    height: 45,
    textAlign: 'center',
  },
  reasonButton: {
    borderColor: 'gray',
    borderRadius: 6,
    borderWidth: 1,
    height: 45,
    width: 80,
    marginHorizontal: 5,
    justifyContent:'center',
  },
  reasonButtonText: {
    textAlign: 'center',
  },
});
