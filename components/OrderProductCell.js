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
      '0': { key: '0', label: '출고수량 변경없음', reason: 0 },
      '10:1': { key: '10:1', label: '1일내 재입고 예정', reason: 10, data: 1 },
      '10:2': { key: '10:2', label: '2일내 재입고 예정', reason: 10, data: 2 },
      '10:3': { key: '10:3', label: '3일내 재입고 예정', reason: 10, data: 3 },
      '10:4': { key: '10:4', label: '4일내 재입고 예정', reason: 10, data: 4 },
      '10:5': { key: '10:5', label: '5일내 재입고 예정', reason: 10, data: 5 },
      '10:6': { key: '10:6', label: '6일내 재입고 예정', reason: 10, data: 6 },
      '10:7': { key: '10:7', label: '7일내 재입고 예정', reason: 10, data: 7 },
      '30': { key: '30', label: '품절', reason: 30 },
    };
    const key = `${reason}${reason === 10 ? `:${(data || 1)}` : ''}`;
    const selected = labels[key];
    if (reason === 0) {
      return (
        <View style={[styles.reasonButton, { borderWidth: 0 }]}>
          <Text style={styles.reasonButtonText}>{selected.label}</Text>
        </View>
      );
    }

    const button = (
      <View style={styles.reasonButton}>
        <Text style={styles.reasonButtonText}>{selected.label}</Text>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Icon name='md-arrow-dropdown' size={20} style={{ textAlign: 'right', marginRight: 5 }}/>
        </View>
      </View>
    );
    if (disabled) {
      return button;
    }
    return (
      <ModalPicker
        data={_.values(labels).slice(1)}
        style={{ flex: 1 }}
        initValue={selected.label}
        onChange={(option)=> this.setState({ reason: option.reason, data: option.data })}
      >
        {button}
      </ModalPicker>
    );
  },
  renderConfirm() {
    const { order, changeable } = this.props;
    const { confirmed } = this.state;
    return (
      <Button
        onPress={() => changeable && this.toggleConfirm(!confirmed)}
        containerStyle={styles.confirmButton}
        style={{ color: 'white', fontSize: 11, fontWeight: 'bold' }}
        disabled={!changeable}
      >
        {changeable ? (confirmed ? '확인해제' : '주문확인') : '주문완료'}
      </Button>
    );
  },
  renderQuantity() {
    const { confirmed } = this.state;
    return (
      <View style={styles.quantityContainer}>
        <Button
          onPress={() => this.setQuantity(+this.state.quantity + 1)}
          disabled={confirmed}
          containerStyle={{ justifyContent: 'center' }}
        >
          <Icon name='add' style={styles.quantityButton}/>
        </Button>
        <View style={{ width: 1, backgroundColor: '#D7D7D7' }}/>
        <TextInput
          autoCapitalize='none'
          autoCorrect={false}
          keyboardType='number-pad'
          onChangeText={this.setQuantity}
          value={this.state.quantity}
          style={styles.quantityInput}
          editable={!confirmed}
        />
        <View style={{ width: 1, backgroundColor: '#D7D7D7' }}/>
        <Button
          onPress={() => this.setQuantity(+this.state.quantity - 1)}
          disabled={confirmed}
          containerStyle={{ justifyContent: 'center' }}
        >
        <Icon name='remove' style={styles.quantityButton}/>
        </Button>
      </View>
    );
  },
  render() {
    const { orderProduct, changeable } = this.props;
    const { product, productVariant } = orderProduct;
    const { name } = product;
    const { color, size } = productVariant.data;
    const { confirmed } = this.state;
    const image = _.get(productVariant, 'appImages.default.0');
    const opacity = confirmed ? 0.4 : 1;
    return (
      <View style={[styles.container, { backgroundColor: confirmed ? '#F7F7F7' : 'white' }]}>
        <View style={{ marginRight: 8, opacity }}>
          {this.renderThumbnail(orderProduct)}
        </View>
        <View style={{ flex: 1, flexDirection: 'column', marginVertical: 3 }}>
          <View style={{ opacity }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#4C4C4C' }}>{name.ko}</Text>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#4C4C4C', flex: 1 }}>{color} / {size}</Text>
              <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#999999', textAlign: 'right', flex: 1 }}>{`${numeral(orderProduct.KRW).format('0,0')}원`}</Text>
            </View>
          </View>
          <View style={{ height: 1, backgroundColor: '#F2F2F2', marginVertical: 10 }}></View>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flexDirection: 'column', flex: 1, opacity }}>
              <View style={styles.descRow}>
                <Text style={styles.labelText}>주문수량: </Text>
                <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#999999', textAlign: 'center', flex: 1 }}>
                  {numeral(orderProduct.quantity).format('0,0')}개
                </Text>
              </View>
              <View style={styles.descRow}>
                <Text style={styles.labelText}>출고수량: </Text>
                <View style={{ flex: 1 }}>
                  {this.renderQuantity()}
                </View>
              </View>
              <View style={styles.descRow}>
                {this.renderReasonModal()}
              </View>
            </View>
            <View style={{ marginLeft: 6, marginBottom: 3, justifyContent: 'flex-end', opacity: (changeable ? 1 : opacity) }}>
                {this.renderConfirm()}
            </View>
          </View>
        </View>
      </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: 'white',
    padding: 8,
  },
  thumbnail: {
    backgroundColor: '#F2F2F2',
    borderColor: '#EBEBEB',
    borderWidth: 1,
    height: 104,
    width: 80,
  },
  descRow: {
    flexDirection: 'row',
    marginVertical: 3,
    alignItems: 'center',
  },
  quantityContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    borderColor: '#D7D7D7',
    borderRadius: 5,
    borderWidth: 1,
  },
  quantityInput: {
    width: 40,
    fontSize: 12,
    padding: 0,
    color: '#ff6c00',
    textAlign: 'center',
  },
  quantityButton: {
    marginHorizontal: 5,
    backgroundColor: 'rgba(0,0,0,0)',
    fontSize: 20,
    color: '#D7D7D7',
  },
  reasonButton: {
    flex: 1,
    flexDirection: 'row',
    borderColor: '#D7D7D7',
    borderRadius: 5,
    borderWidth: 1,
  },
  reasonButtonText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#4C4C4C',
    textAlign: 'center',
    margin: 5,
  },
  labelText: {
    fontSize: 11,
    color: '#4C4C4C',
  },
  confirmButton: {
    backgroundColor: '#1F3A4A',
    borderRadius: 5,
    overflow:'hidden',
    padding: 5,
  },
});
