'use strict';

import React from 'react';
import { Image, StyleSheet, Text, TextInput, Switch, View } from 'react-native';
import { CloudinaryImageNative } from 'react-cloudinary';
import _ from 'lodash';
import Button from 'react-native-button';
import ModalPicker from 'react-native-modal-picker';
import numeral from 'numeral';

import Icon from './Icon';
import OpenUrlButton from './OpenUrlButton';

function getInitialState(props) {
  const { orderProduct, order } = props;
  const quantity = (() => {
    const stock = _.get(orderProduct, 'data.stock.quantity', orderProduct.quantity);
    if (order.status === 100) {
      return stock;
    }
    return _.get(orderProduct, 'finalQuantity', stock);
  })();
  return {
    quantity: quantity.toString(),
    reason: _.get(orderProduct, 'data.stock.reason', 0),
    data: _.get(orderProduct, 'data.stock.data'),
    confirmed: orderProduct.status !== 101 || order.status !== 100,
  };
}

export default React.createClass({
  getInitialState() {
    return getInitialState(this.props);
  },
  toggleConfirm(confirmed) {
    this.setState({confirmed});
    if (confirmed) {
      const { quantity, reason, data } = this.state;
      this.props.confirm(+quantity, reason, data).then(
        () => this.setState(getInitialState(this.props))
      );
    } else {
      this.props.unconfirm();
    }
  },
  setQuantity(quantity) {
    const { orderProduct } = this.props;
    if (quantity) {
      quantity = _.clamp(_.toSafeInteger(quantity), 0, orderProduct.quantity);
    }
    const reason = quantity == orderProduct.quantity ? 0 : (this.state.reason || 10);
    const data = reason === 10 ? (this.state.data || 1) : undefined;
    this.setState({ reason, data, quantity: quantity.toString() });
  },
  renderThumbnail({ product, productVariant }) {
    const image = _.get(productVariant, 'appImages.default.0');
    if (image) {
      return (
        <OpenUrlButton url={`https://m.linkshops.com/products/${product.id}`}>
          <CloudinaryImageNative
            publicId={image.publicId}
            options={{ width: 100, height: 100 }}
            style={styles.thumbnail}
          />
        </OpenUrlButton>
      );
    }
  },
  renderReasonModal() {
    const { orderProduct } = this.props;
    const { reason, data } = this.state;
    const disabled= this.state.confirmed || this.state.quantity == orderProduct.quantity;
    const labels = {
      '0': { key: '0', label: '재고 있음', reason: 0 },
      '10:1': { key: '10:1', label: '1일내 재입고 예정', display: '1일내 재입고', reason: 10, data: 1 },
      '10:2': { key: '10:2', label: '2일내 재입고 예정', display: '2일내 재입고', reason: 10, data: 2 },
      '10:3': { key: '10:3', label: '3일내 재입고 예정', display: '3일내 재입고', reason: 10, data: 3 },
      '10:4': { key: '10:4', label: '4일내 재입고 예정', display: '4일내 재입고', reason: 10, data: 4 },
      '10:5': { key: '10:5', label: '5일내 재입고 예정', display: '5일내 재입고', reason: 10, data: 5 },
      '10:6': { key: '10:6', label: '6일내 재입고 예정', display: '6일내 재입고', reason: 10, data: 6 },
      '10:7': { key: '10:7', label: '7일내 재입고 예정', display: '7일내 재입고', reason: 10, data: 7 },
      '30': { key: '30', label: '품절', reason: 30 },
    };
    const key = `${reason}${reason === 10 ? `:${(data || 1)}` : ''}`;
    const selected = labels[key];
    const button = (
      <View style={styles.reasonButton}>
        <Text style={styles.reasonButtonText}>{selected.display || selected.label}</Text>
        {reason !== 0 && !disabled && <Icon name='arrow-down' />}
      </View>
    );
    if (disabled) {
      return button;
    }
    return (
      <ModalPicker
        data={_.values(labels).slice(1)}
        initValue={selected.label}
        onChange={(option)=> this.setState({ reason: option.reason, data: option.data })}
      >
        {button}
      </ModalPicker>
    );
  },
  renderConfirm() {
    const { order } = this.props;
    if (order.status !== 100) {
      return undefined;
    }
    const { confirmed } = this.state;
    return (
      <View style={styles.columnContainer}>
        <Text style={styles.headerText}>주문확인</Text>
        <View style={styles.columnMainContainer}>
          <Button onPress={() => this.toggleConfirm(!confirmed)}>
            <Icon name='checkbox' size={35} color={confirmed ? '#1fcbfb' : 'grey' } />
          </Button>
        </View>
      </View>
    );
  },
  render() {
    const { orderProduct } = this.props;
    const { product, productVariant } = orderProduct;
    const { name } = product;
    const { color, size } = productVariant.data;
    const { confirmed } = this.state;
    const image = _.get(productVariant, 'appImages.default.0');
    return (
      <View style={styles.container}>
        <View style={[styles.columnContainer, { alignItems: 'flex-start', marginLeft: 4 }]}>
          <Text style={styles.headerText}>{name.ko}</Text>
          <View style={[styles.columnMainContainer, { alignItems: 'flex-start'}]}>
            <Text style={styles.colorSizeText}>{color} / {size}</Text>
            <Text style={styles.priceText}>{`${numeral(orderProduct.KRW).format('0,0')}원`}</Text>
            {this.renderThumbnail(orderProduct)}
          </View>
        </View>
        <View style={styles.columnContainer}>
          <Text style={styles.headerText}>주문수량: {numeral(orderProduct.quantity).format('0,0')}</Text>
          <View style={styles.columnMainContainer}>
            <Button
              containerStyle={styles.quantityButton}
              onPress={() => this.setQuantity(+this.state.quantity + 1)}
              disabled={confirmed}
            >
              <Icon name='arrow-up' size={20} color={confirmed ? 'grey' : 'orange' }/>
            </Button>
            <TextInput
              autoCapitalize='none'
              autoCorrect={false}
              keyboardType='number-pad'
              onChangeText={this.setQuantity}
              value={this.state.quantity}
              style={styles.quantityInput}
              editable={!confirmed}
            />
            <Button
              containerStyle={styles.quantityButton}
              onPress={() => this.setQuantity(+this.state.quantity - 1)}
              disabled={confirmed}
            >
              <Icon name='arrow-down' size={20} color={confirmed ? 'grey' : 'orange' }/>
            </Button>
          </View>
        </View>
        <View style={styles.columnContainer}>
            <Text style={styles.headerText}>수량 변경 사유</Text>
          <View style={styles.columnMainContainer}>
            {this.renderReasonModal()}
          </View>
        </View>
        {this.renderConfirm()}
      </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    flexDirection: 'row',
    justifyContent:'space-between',
    paddingHorizontal: 3,
    paddingVertical: 5,
  },
  columnContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
  },
  columnMainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent:'center',
  },
  thumbnail: {
    backgroundColor: '#dddddd',
    borderColor: '#dcdcdc',
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
    flexDirection: 'row',
    borderColor: 'gray',
    borderRadius: 6,
    borderWidth: 1,
    height: 45,
    width: 90,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reasonButtonText: {
    textAlign: 'center',
    marginRight: 3,
  },
  headerText: {
    color: '#666',
    fontSize: 12,
  },
  priceText: {
    fontWeight: 'bold',
    color: '#333',
  },
  colorSizeText: {
    fontWeight: 'bold',
    color: '#666',
  },
});
