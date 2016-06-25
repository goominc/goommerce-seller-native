'use strict';

import React from 'react';
import { ListView, StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { orderActions } from 'goommerce-redux';
import _ from 'lodash';

import EmptyView from '../components/EmptyView';
import OrderCell from '../components/OrderCell';
import RefreshableList from '../components/RefreshableList';
import RefreshableView from '../components/RefreshableView';
import routes from '../routes';

const OrderList = React.createClass({
  dataSource: new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
  }),
  onSelect(order) {
    const { brandId, push, status, updateBrandOrderStatus } = this.props;

    const title = `링크# ${order.orderName || _.padStart(order.id, 3, '0').substr(-3)} 주문내역`;
    if (status === 'new' && _.find(order.orderProducts, { status: 100 })) {
      updateBrandOrderStatus(brandId, order.id, 100, 101).then(
        () => push(routes.order(title, { brandId, orderId: order.id }))
      );
    } else {
      push(routes.order(title, { brandId, orderId: order.id }));
    }
  },
  renderRow(order, sectionID, rowID, highlightRow) {
    const { onSelect, status } = this.props;
    return (
      <OrderCell
        key={order.id}
        order={order}
        status={status}
        onHighlight={() => highlightRow(sectionID, rowID)}
        onUnhighlight={() => highlightRow(null, null)}
        onSelect={() => (onSelect ? onSelect(order) : this.onSelect(order))}
      />
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
        <Text style={[styles.sectionText, { width: 60 }]}>
          날짜
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
    const { orders, status, onRefresh } = this.props;
    if (_.isEmpty(orders)) {
      const text = _.get({
        new: '신규주문이 없습니다.',
        ready: '포장완료된 주문이 없습니다.',
        awaiting: '입금대기 주문이 없습니다.',
      }, status, '주문이 없습니다');
      return (
        <RefreshableView onRefresh={() => onRefresh && onRefresh()} contentContainerStyle={{ flex: 1 }}>
          <EmptyView text={text} />
        </RefreshableView>
      );
    }
    // FIXME: possible performance issue...
    const dataSource = this.dataSource.cloneWithRows(orders);
    return (
      <RefreshableList
        dataSource={dataSource}
        renderRow={this.renderRow}
        renderSectionHeader={this.renderSectionHeader}
        renderSeparator={this.renderSeparator}
        onRefresh={() => onRefresh && onRefresh()}
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
  scrollSpinner: {
    marginVertical: 20,
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
});

export default connect(null, orderActions)(OrderList);
