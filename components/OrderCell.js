'use strict';

import _ from 'lodash';
import React, {
  Image,
  Picker,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import { CloudinaryImageNative } from 'react-cloudinary';
import numeral from 'numeral';

import DefaultText from './DefaultText';

export default React.createClass({
  render() {
    const TouchableElement = Platform.OS === 'android' ?
      TouchableNativeFeedback : TouchableHighlight;
    const { order: { id, totalQuantity, totalKRW, orderProducts } } = this.props;
    const status = _.countBy(orderProducts, 'status');
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
              <DefaultText text={id} />
            </View>
            <View style={styles.descContainer}>
              <DefaultText text={name()} />
              <DefaultText text={`${numeral(totalQuantity).format('0,0')}개`} />
              <DefaultText text={`${numeral(totalKRW).format('0,0')}원`} />
            </View>
            <View>
              {status[100] && <DefaultText text={'신규주문'} />}
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
    backgroundColor: '#dddddd',
    borderRadius: 45,
    height: 90,
    justifyContent: 'center',
    marginRight: 10,
    width: 90,
  },
  descContainer: {
    flex: 1,
  },
});
