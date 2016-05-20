'use strict';

import React from 'react';
import { Alert, ListView, StyleSheet, Text, View } from 'react-native';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import { orderActions } from 'goommerce-redux';
import Button from 'react-native-button';

import EmptyView from '../components/EmptyView';
import OrderCell from '../components/OrderCell';
import RefreshableList from '../components/RefreshableList';
import RefreshableView from '../components/RefreshableView';
import routes from '../routes';

const OrderList = React.createClass({
  getDefaultProps() {
    return { limit: 20 };
  },
  getInitialState() {
    // TODO: move this into redux?
    return { isLoadingTail: false };
  },
  componentDidMount() {
    const { brandId, status, limit, loadBrandOrders } = this.props;
    loadBrandOrders(brandId, status, 0, limit);
  },
  dataSource: new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
  }),
  onEndReached() {
    const { brandId, status, limit, pagination, loadBrandOrders } = this.props;
    if (!pagination.hasMore || this.state.isLoadingTail) {
      return;
    }
    this.setState({ isLoadingTail: true });
    loadBrandOrders(brandId, status, pagination.offset + pagination.limit, limit).then(
      () => this.setState({ isLoadingTail: false })
    );
  },
  onRefresh() {
    const { brandId, status, limit, loadBrandOrders } = this.props;
    return loadBrandOrders(brandId, status, 0, limit);
  },
  renderRow(order, sectionID, rowID, highlightRow) {
    const { brandId, push, reduxKey, updateBrandOrderStatus } = this.props;

    function onSelect() {
      function onConfirm() {
        updateBrandOrderStatus(brandId, order.id, reduxKey, 100, 101).then(
          () => push(routes.order({ brandId, orderId: order.id }))
        );
      }
      if (_.find(order.orderProducts, { status: 100 })) {
        Alert.alert(
          '알림',
          '주문을 확인하시겠습니까?',
          [ { text: '확인', onPress: onConfirm }, { text: '취소' } ]
        );
      } else {
        push(routes.order({ brandId, orderId: order.id }));
      }
    }

    return (
      <OrderCell
        key={order.id}
        order={order}
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
    const { list } = this.props;
    const { activeStatus } = this.state;
    if (!list) {
      return <EmptyView text='Loading...' />;
    }
    if (!list.length) {
      return (
        <RefreshableView onRefresh={this.onRefresh} contentContainerStyle={{ flex: 1 }}>
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
        onEndReached={this.onEndReached}
        onRefresh={this.onRefresh}
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
    paddingVertical: 3,
  },
  sectionText: {
    textAlign: 'center',
  },
});

export default connect(
  (state, ownProps) => {
    const { key } = orderActions.loadBrandOrders(ownProps.brandId, ownProps.status);
    return { reduxKey: key, ...state.order[key] };
  }, orderActions
)(OrderList);
