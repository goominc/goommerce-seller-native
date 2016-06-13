'use strict';

import React from 'react';
import {
  Image,
  Picker,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import _ from 'lodash';
import { CloudinaryImageNative } from 'react-cloudinary';
import numeral from 'numeral';

import DefaultText from './DefaultText';

export default React.createClass({
  renderStatus() {
    const { status } = this.props;
    if (status === 'new') {
      return <Text style={[styles.descStatusText, { backgroundColor: '#23bcee'}]}>신규주문</Text>;
    } else if (status === 'pending') {
      return <Text style={[styles.descStatusText, { backgroundColor: '#3f4c5d'}]}>출고대기</Text>;
    } else if (status === 'settled') {
      return <Text style={[styles.descStatusText, { backgroundColor: '#3f4c5d'}]}>정산완료</Text>;
    }
  },
  render() {
    const TouchableElement = Platform.OS === 'android' ?
      TouchableNativeFeedback : TouchableHighlight;
    const { order: { id, totalQuantity, totalKRW, orderProducts, processedDate, orderName } } = this.props;
    const name = () => {
      if (orderProducts.length === 1) {
        return orderProducts[0].name;
      } else {
        return `${orderProducts[0].name} 외 ${orderProducts.length - 1} 종`;
      }
    };
    return (
      <View>
        <TouchableElement
          onPress={this.props.onSelect}
          onShowUnderlay={this.props.onHighlight}
          onHideUnderlay={this.props.onUnhighlight}
        >
          <View style={styles.container}>
            <View style={styles.orderNumContainer}>
              <Text style={styles.orderNumText}>링크#</Text>
              <Text style={styles.orderNumText}>{orderName || _.padStart(id, 3, '0').substr(-3)}</Text>
            </View>
            <View style={styles.descContainer}>
              <Text style={styles.descNameText}>{name()}</Text>
              <Text style={styles.descQuantityText}>{`${numeral(totalQuantity).format('0,0')}개`}</Text>
              <Text style={styles.descPriceText}>{`${numeral(totalKRW).format('0,0')}원`}</Text>
            </View>
            <View>
              <Text>{(processedDate || "").substring(5, 10)}</Text>
              {this.renderStatus()}
            </View>
          </View>
        </TouchableElement>
      </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 5,
  },
  orderNumContainer: {
    alignItems: 'center',
    backgroundColor: '#3f4c5d',
    borderRadius: 30,
    height: 60,
    justifyContent: 'center',
    marginRight: 10,
    width: 60,
  },
  orderNumText: {
    color: 'white',
    fontWeight: 'bold',
  },
  descContainer: {
    flex: 1,
  },
  descNameText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  descQuantityText: {
    color: 'grey',
  },
  descPriceText: {
    fontWeight: 'bold',
  },
  descStatusText: {
    borderRadius: 16,
    padding: 7,
    color: 'white',
  },
});
