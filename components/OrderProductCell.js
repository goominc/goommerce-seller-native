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
import Icon from 'react-native-vector-icons/Ionicons';
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
        {this.state.reason !== 0 && !disabled && <Icon name='arrow-down-b' />}
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
  renderConfirm() {
    const { orderProduct: { status } } = this.props;
    if (status !== 101 && status !== 102 && status !== 104) {
      return undefined;
    }
    return (
      <View style={styles.columnContainer}>
        <Text>주문확인</Text>
        <View style={styles.columnMainContainer}>
          <Switch onValueChange={this.toggleConfirm} value={this.state.confirmed} />
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
        <View style={styles.columnContainer}>
          <Text>{name.ko}</Text>
          <View style={styles.columnMainContainer}>
            <Text>{color} / {size}</Text>
            <Text>{`${numeral(orderProduct.KRW).format('0,0')}원`}</Text>
            {this.renderThumbnail(orderProduct)}
          </View>
        </View>
        <View style={styles.columnContainer}>
          <Text>주문수량: {numeral(orderProduct.quantity).format('0,0')}</Text>
          <View style={styles.columnMainContainer}>
            <Button
              containerStyle={styles.quantityButton}
              onPress={() => this.setQuantity(this.state.quantity + 1)}
              disabled={confirmed}
            >
              <Icon name='arrow-up-b' size={20} color={confirmed ? 'grey' : 'orange' }/>
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
              onPress={() => this.setQuantity(this.state.quantity - 1)}
              disabled={confirmed}
            >
              <Icon name='arrow-down-b' size={20} color={confirmed ? 'grey' : 'orange' }/>
            </Button>
          </View>
        </View>
        <View style={styles.columnContainer}>
            <Text>수량 변경 사유</Text>
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
    flexDirection: 'row',
    borderColor: 'gray',
    borderRadius: 6,
    borderWidth: 1,
    height: 45,
    width: 80,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reasonButtonText: {
    textAlign: 'center',
    marginRight: 3,
  },
});
