'use strict';

import React from 'react';
import { Alert, ListView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import { orderActions } from 'goommerce-redux';
import Button from 'react-native-button';
import Decimal from 'decimal.js-light';
import numeral from 'numeral';

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
        brandOrderReadyToPickUp(brandId, order.id, reduxKey, orderProducts).then(() => {
          pop();
          loadBrandOrders(brandId, 'new', 0, 20); // FIXME
        });
      };

      Alert.alert(
        '주문확인 및 포장이 완료되었습니까?',
        `"링크# ${_.padStart(order.id, 3, '0').substr(-3)}" 봉투에 적으셨나요?`,
        [ { text: '확인', onPress: readyToPickup }, { text: '취소' } ]
      );
    }
  },
  onRefresh() {
    const { loadBrandOrder, brandId, orderId } = this.props;
    return loadBrandOrder(brandId, orderId);
  },
  renderRow(orderProduct) {
    const { reduxKey, brandId, order, updateOrderProductStock, deleteOrderProductStock } = this.props;
    return (
      <OrderProductCell
        key={orderProduct.id}
        orderProduct={orderProduct}
        order={order}
        confirm={(quantity, reason, data) => updateOrderProductStock(orderProduct.id, reduxKey, quantity, reason, data)}
        unconfirm={() => deleteOrderProductStock(orderProduct.id, reduxKey)}
      />
    );
  },
  renderSectionHeader(sectionData, sectionID) {
    return (
      <View style={styles.section}>
        <Text style={{ fontSize: 17 }}>
          {sectionData[0].product.name.ko}
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
    const { order } = this.props;
    if (!order) {
      return <EmptyView text='Loading...' />;
    }
    const { orderProducts } = order;
    if (!orderProducts.length) {
      return <EmptyView text='No orders...' />;
    }
    // FIXME: possible performance issue...
    const dataSource = this.dataSource.cloneWithRows(orderProducts);
    // const dataBlob = _.groupBy(orderProducts, (o) => o.product.id);
    // const dataSource = this.dataSource.cloneWithRowsAndSections(dataBlob);
    const totalQuantity = _.sumBy(orderProducts, 'quantity');
    const totalKRW = _.reduce(orderProducts, (sum, o) => sum.add(o.totalKRW), new Decimal(0)).toNumber();
    return (
      <View style={styles.container}>
        <RefreshableList
          dataSource={dataSource}
          renderRow={this.renderRow}
          renderSeparator={this.renderSeparator}
          onRefresh={this.onRefresh}
        />
        <View style={styles.footer}>
          <View style={styles.footerDescContainer}>
            <Text style={{color: 'white', flex: 1}}>
              총 주문수량: {numeral(totalQuantity).format('0,0')}
            </Text>
            <Text style={{color: 'white', flex: 1}}>
              총 주문금액: {numeral(totalKRW).format('0,0')}원
            </Text>
          </View>
          <Button
            style={{color: 'white'}}
            styleDisabled={{color: 'red'}}
            containerStyle={styles.confirmButton}
            onPress={this.onConfirm}
          >
            포장완료
          </Button>
        </View>
      </View>
    );
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  rowSeparator: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: 1,
    marginLeft: 4,
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
    backgroundColor: '#3f4c5d',
    height: 80,
  },
  footerDescContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#1fcbf6',
    borderRadius: 6,
    overflow:'hidden',
    marginHorizontal: 60,
    justifyContent:'center',
  },
});

export default connect(
  (state, ownProps) => {
    const { key } = orderActions.loadBrandOrder(ownProps.brandId, ownProps.orderId);
    return { reduxKey: key, order: state.order[key] };
  }, orderActions
)(OrderDetail);
