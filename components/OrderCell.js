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
import numeral from 'numeral';
import Decimal from 'decimal.js-light';
import moment from 'moment';

// FIXME: move to some other place.
moment.locale('ko', {
  relativeTime : {
    future : "%s 후",
    past : "%s 전",
    s : "몇초",
    m : "일분",
    mm : "%d분",
    h : "한시간",
    hh : "%d시간",
    d : "하루",
    dd : "%d일",
    M : "한달",
    MM : "%d달",
    y : "일년",
    yy : "%d년"
  },
});

export default React.createClass({
  render() {
    const TouchableElement = Platform.OS === 'android' ?
      TouchableNativeFeedback : TouchableHighlight;
    const { order: { id, orderProducts, orderedAt, orderName }, status } = this.props;
    const totalQuantity = _.sumBy(orderProducts, (o) => _.get(o, 'data.stock.quantity', o.quantity));
    const totalKRW = _.reduce(orderProducts,
      (sum, o) => sum.add(Decimal(o.KRW || 0).mul(_.get(o, 'data.stock.quantity', o.quantity))), new Decimal(0)).toNumber();

    const name = () => {
      if (orderProducts.length === 1) {
        return `${orderProducts[0].name} ${numeral(totalQuantity).format('0,0')}개 주문내역`;
      } else {
        return `${orderProducts[0].name} 외 ${orderProducts.length - 1} 종 ${numeral(totalQuantity).format('0,0')}개 주문내역`;
      }
    };

    const date = () => {
      if (orderedAt) {
        const at = moment(orderedAt);
        if (moment().diff(at, 'hours') > 23) {
          return <Text style={styles.dateText}>{at.format('YYYY.MM.DD')}</Text>
        }
        return <Text style={styles.dateText}>{at.fromNow()}</Text>
      }
    };

    const price = () => {
      if (status === 'awaiting') {
        return (
          <Text>
            <Text style={styles.annotText}>입금예정금액: </Text>
            <Text style={styles.awaitingPriceText}>{`${numeral(totalKRW).format('0,0')}원`}</Text>
          </Text>
        );
      }
      return <Text style={styles.descText}>{`${numeral(totalKRW).format('0,0')}원`}</Text>;
    }

    return (
      <View>
        <TouchableElement
          onPress={this.props.onSelect}
          onShowUnderlay={this.props.onHighlight}
          onHideUnderlay={this.props.onUnhighlight}
        >
          <View style={styles.container}>
            <View style={[styles.orderNumContainer, { backgroundColor: status === 'new' ? '#1F3A4A' : '#F2F2F2' }]}>
              <Text style={[styles.orderNumText, { color: status === 'new' ? 'white' : '#4C4C4C' }]}>링크#</Text>
              <Text style={[styles.orderNumText, { color: status === 'new' ? 'white' : '#4C4C4C' }]}>{orderName || _.padStart(id, 3, '0').substr(-3)}</Text>
            </View>
            <View style={styles.descContainer}>
              <Text style={styles.descText} numberOfLines={1}>{name()}</Text>
              {price()}
              {status === 'awaiting' && <Text style={[styles.annotText, { color: '#999999' }]}>(매출수수료, VAT포함)</Text>}
            </View>
            <View style={styles.dateContainer}>
              {date()}
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
    borderRadius: 30,
    height: 60,
    justifyContent: 'center',
    marginRight: 10,
    width: 60,
  },
  orderNumText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  descContainer: {
    flex: 1,
  },
  descText: {
    fontSize: 12,
    color: '#4C4C4C',
    marginVertical: 2,
  },
  annotText: {
    fontSize: 11,
    color: '#4C4C4C',
    marginVertical: 2,
  },
  dateText: {
    fontSize: 11,
    color: '#4C4C4C',
    textAlign: 'center',
    marginVertical: 2,
  },
  awaitingPriceText: {
    color: '#ff6c00',
    fontWeight: 'bold',
    fontSize: 12
  },
  dateContainer: {
    width: 80,
  },
});
