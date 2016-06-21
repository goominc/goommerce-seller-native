'use strict';

import React from 'react';
import { ListView, StyleSheet, Text, View } from 'react-native';
import _ from 'lodash';

import EmptyView from '../components/EmptyView';
import OrderCell from '../components/OrderCell';
import RefreshableList from '../components/RefreshableList';
import RefreshableView from '../components/RefreshableView';
import routes from '../routes';

export default React.createClass({
  dataSource: new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
  }),
  filter() {
    const { orders, status } = this.props;
    return {
      new() {
        return _.filter(orders, (o) => (o.status === 100 &&
          _.every(o.orderProducts, (p) => _.includes([100, 101, 102], p.status))));
      },
      ready() {
        return _.filter(orders, (o) => (o.status === 100 &&
          _.every(o.orderProducts, (p) => p.status === 103)));
      },
      awaiting() {
        return _.filter(orders, (o) => (o.status !== 100 ||
          _.every(o.orderProducts, (p) => p.status === 200)));
      },
    }[status]();
  },
  renderRow(order, sectionID, rowID, highlightRow) {
    const { brandId, push, status, updateBrandOrderStatus } = this.props;

    function onSelect() {
      const title = `링크# ${order.orderName || _.padStart(order.id, 3, '0').substr(-3)} 주문내역`;
      if (_.find(order.orderProducts, { status: 100 })) {
        updateBrandOrderStatus(brandId, order.id, 100, 101).then(
          () => push(routes.order(title, { brandId, orderId: order.id }))
        );
      } else {
        push(routes.order(title, { brandId, orderId: order.id }));
      }
    }

    return (
      <OrderCell
        key={order.id}
        order={order}
        status={status}
        onHighlight={() => highlightRow(sectionID, rowID)}
        onUnhighlight={() => highlightRow(null, null)}
        onSelect={onSelect}
      />
    );
  },
  renderSectionHeader(sectionData, sectionID) {
    return (
      <View style={styles.section}>
        <Text style={[styles.sectionText, { width: 60 }]}>
          주문자명
        </Text>
        <Text style={[styles.sectionText, { flex: 1} ]}>
          주문내용
        </Text>
        <Text style={[styles.sectionText, { width: 80} ]}>
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
    const list = this.filter();
    if (_.isEmpty(list)) {
      return (
        <RefreshableView onRefresh={this.props.onRefresh} contentContainerStyle={{ flex: 1 }}>
          <EmptyView text='No orders...' />
        </RefreshableView>
      );
    }
    // FIXME: possible performance issue...
    const dataSource = this.dataSource.cloneWithRows(list);
    return (
      <RefreshableList
        dataSource={dataSource}
        renderRow={this.renderRow}
        renderSectionHeader={this.renderSectionHeader}
        renderSeparator={this.renderSeparator}
        onRefresh={this.props.onRefresh}
      />
    );
  },
});

const styles = StyleSheet.create({
  rowSeparator: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: 1,
    marginLeft: 4,
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
  },
  sectionText: {
    color: '#4B4B4B',
    textAlign: 'center',
  },
});
