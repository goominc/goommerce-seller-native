'use strict';

import React from 'react';
import { Alert, ListView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { orderActions } from 'goommerce-redux';
import Button from 'react-native-button';
import Decimal from 'decimal.js-light';
import numeral from 'numeral';
import _ from 'lodash';

import EmptyView from '../components/EmptyView';
import OrderProductCell from '../components/OrderProductCell';
import RefreshableList from '../components/RefreshableList';

const OrderDetail = React.createClass({
  componentDidMount() {
    const { loadBrandOrder, brandId, orderId } = this.props;
    loadBrandOrder(brandId, orderId);
  },
  dataSource: new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
    sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
  }),
  onConfirm() {
    const { brandId, reduxKey, order, brandOrderReadyToPickUp, loadBrandOrders, pop } = this.props;
    const map = _.groupBy(order.orderProducts, 'status');
    if (map[101] && map[101].length) {
      Alert.alert(
        '확인되지 않은 주문이 있습니다.',
      );
    } else if (!map[102]) {
      Alert.alert(
        '출고가능 상품이 없습니다.',
        '주문확인 감사합니다.',
      );
    } else {
      const readyToPickup = () => {
        const orderProducts = map[102].map((o) => _.pick(o, 'id'));
        brandOrderReadyToPickUp(brandId, order.id, reduxKey, orderProducts).then(() => pop());
      };

      Alert.alert(
        '주문확인 및 포장이 완료되었습니까?',
        `"링크# ${order.orderName || _.padStart(order.id, 3, '0').substr(-3)}" 봉투에 적으셨나요?`,
        [ { text: '확인', onPress: readyToPickup }, { text: '취소' } ]
      );
    }
  },
  onRefresh() {
    const { loadBrandOrder, brandId, orderId } = this.props;
    return loadBrandOrder(brandId, orderId);
  },
  renderRow(orderProduct) {
    const { reduxKey, brandId, order, updateOrderProductStock, deleteOrderProductStock, changeable } = this.props;
    return (
      <View style={{ marginHorizontal: 8 }}>
        <OrderProductCell
          key={orderProduct.id}
          orderProduct={orderProduct}
          order={order}
          changeable={changeable}
          confirm={(quantity, reason, data) => updateOrderProductStock(orderProduct.id, reduxKey, quantity, reason, data)}
          unconfirm={() => deleteOrderProductStock(orderProduct.id, reduxKey)}
        />
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
  renderConfirmButton() {
    const { order } = this.props;
    return (
      <View style={{ paddingVertical: 15 }}>
        <Button
          style={{color: 'white', fontSize: 14 }}
          styleDisabled={{color: 'red'}}
          containerStyle={styles.confirmButton}
          onPress={this.onConfirm}
        >
          포장완료
        </Button>
      </View>
    );
  },
  renderFooter() {
    const { order, changeable } = this.props;
    const { orderProducts } = order;
    const quantity = (o) => _.get(o, 'finalQuantity', _.get(o, 'data.stock.quantity', o.quantity));
    const totalQuantity = _.sumBy(orderProducts, quantity);
    const totalKRW = _.reduce(orderProducts,
      (sum, o) => sum.add(Decimal(o.KRW || 0).mul(quantity(o))), new Decimal(0)).toNumber();
    return (
      <View style={styles.footer}>
        <View style={styles.footerDescContainer}>
          <View style={{ flex: 1, flexDirection: 'column', marginHorizontal: 10 }}>
            <Text style={{ fontSize: 11, color: '#4C4C4C' }}>총 출고수량</Text>
            <Text style={{ fontSize: 11, color: '#4C4C4C', fontWeight: 'bold' }}>{numeral(totalQuantity).format('0,0')}개</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'column', marginHorizontal: 10 }}>
            <Text style={{ fontSize: 12, color: '#FF6C00', textAlign: 'right', fontWeight: 'bold' }}>입금예정금액(VAT불포함)</Text>
            <Text style={{ fontSize: 12, color: '#FF6C00', textAlign: 'right', fontWeight: 'bold' }}>{numeral(totalKRW).format('0,0')}원</Text>
          </View>
        </View>
        {changeable && this.renderConfirmButton()}
      </View>
    );
  },
  render() {
    const { order } = this.props;
    if (!order) {
      return <EmptyView text='Loading...' />;
    }
    // FIXME: possible performance issue...
    const dataSource = this.dataSource.cloneWithRows(order.orderProducts || []);
    return (
      <View style={styles.container}>
        <RefreshableList
          dataSource={dataSource}
          renderRow={this.renderRow}
          renderSeparator={this.renderSeparator}
          renderFooter={this.renderFooter}
          onRefresh={this.onRefresh}
        />
      </View>
    );
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    paddingTop: 8,
  },
  rowSeparator: {
    backgroundColor: '#F2F2F2',
    height: 8,
  },
  rowSeparatorHide: {
    opacity: 0.0,
  },
  section: {
    marginTop: 10,
  },
  navBarRightButton: {
    paddingRight: 10,
  },
  navBarButtonText: {
    fontSize: 16,
    marginVertical: 10,
    color: '#5890FF',
  },
  footer: {
    backgroundColor: 'white',
    marginHorizontal: 8,
    marginBottom: 8,
  },
  footerDescContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#1fcbf6',
    borderRadius: 6,
    overflow:'hidden',
    marginHorizontal: 60,
    paddingVertical: 15,
    justifyContent:'center',
  },
});

export default connect(
  (state, ownProps) => {
    const { key } = orderActions.loadBrandOrder(ownProps.brandId, ownProps.orderId);
    const order = state.order[key];
    const changeable = _.get(order, 'status') === 100 && _.get(order, 'settlementStatus') === 0 &&
      _.some(_.get(order, 'orderProducts'), (p) => _.includes([100, 101, 102, 103], p.status));
    return { reduxKey: key, order, changeable };
  }, orderActions
)(OrderDetail);
