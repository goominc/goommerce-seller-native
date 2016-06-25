'use strict';

import React from 'react';
import { ListView, Platform, StyleSheet, Text, TouchableHighlight, TouchableNativeFeedback, View } from 'react-native';
import _ from 'lodash';

import OrderNumber from '../components/OrderNumber';
import routes from '../routes';

const TouchableElement = Platform.OS === 'android' ? TouchableNativeFeedback : TouchableHighlight;

export default React.createClass({
  dataSource: new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
  }),
  onSelect(order) {
    const { brandId, push } = this.props;

    const title = `링크# ${order.orderName || _.padStart(order.id, 3, '0').substr(-3)} 주문내역`;
    push(routes.order(title, { brandId, orderId: order.id }));
  },
  renderDetail(orderProducts) {
    const totalQuantity = _.sumBy(orderProducts, (o) => (o.finalQuantity || o.quantity));

    if (orderProducts.length === 1) {
      return `${orderProducts[0].name}\n${numeral(totalQuantity).format('0,0')}개 주문내역`;
    } else {
      return `${orderProducts[0].name} 외 ${orderProducts.length - 1} 종\n${numeral(totalQuantity).format('0,0')}개 주문내역`;
    }
  },
  renderRow(order, sectionID, rowID, highlightRow) {
    return (
      <TouchableElement
        onPress={() => this.onSelect(order)}
        onShowUnderlay={() => highlightRow(sectionID, rowID)}
        onHideUnderlay={() => highlightRow(null, null)}
      >
        <View style={styles.rowContainer}>
          <OrderNumber order={order} status={'settled'}/>
          <Text style={[styles.rowText, { flex: 1, marginHorizontal: 12 }]}>
            {this.renderDetail(order.orderProducts)}
          </Text>
          <Text style={[styles.rowText, { fontWeight: 'bold' }]}>
            {numeral(order.settledKRW).format('0,0')}원
          </Text>
        </View>
      </TouchableElement>
    );
  },
  renderSectionHeader(sectionData, sectionID) {
    return (
      <View style={styles.section}>
        <Text style={[styles.sectionText, { width: 60 }]}>
          주문자명
        </Text>
        <Text style={[styles.sectionText, { flex: 1 }]}>
          주문내용
        </Text>
        <Text style={[styles.sectionText, { width: 80 }]}>
          정산금액
        </Text>
      </View>
    );
  },
  renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    var style = styles.rowSeparator;
    if (adjacentRowHighlighted) {
        style = [style, styles.rowSeparatorHide];
    }
    return (
      <View key={'SEP_' + sectionID + '_' + rowID}  style={style}/>
    );
  },
  render() {
    const { orders } = this.props;
    // FIXME: possible performance issue...
    const dataSource = this.dataSource.cloneWithRows(orders);
    return (
      <ListView
        dataSource={dataSource}
        renderRow={this.renderRow}
        renderSectionHeader={this.renderSectionHeader}
        renderSeparator={this.renderSeparator}
      />
    );
  },
});

const styles = StyleSheet.create({
  rowSeparator: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: 1,
  },
  rowSeparatorHide: {
    opacity: 0.0,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    backgroundColor: 'white',
    paddingVertical: 7,
    paddingHorizontal: 12,
  },
  sectionText: {
    fontSize: 11,
    color: '#4C4C4C',
    textAlign: 'center',
  },
  rowContainer: {
    height: 90,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingHorizontal: 12,
  },
  rowText: {
    fontSize: 12,
    color: '#4C4C4C',
  },
});
