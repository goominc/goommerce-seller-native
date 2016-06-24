'use strict';

import React from 'react';
import { StyleSheet, View } from 'react-native';
import Button from 'react-native-button';
import { connect } from 'react-redux';
import { orderActions } from 'goommerce-redux';
import _ from 'lodash';

import EmptyView from '../components/EmptyView';
import OrderList from './OrderList';

const Orders = React.createClass({
  statics: {
    onDidFocus(props, dispatch) {
      dispatch(orderActions.loadBrandOrders(props.brandId, 'not_settled'));
    },
  },
  getInitialState() {
    return { activeStatus: 'new' };
  },
  filter() {
    const { orders } = this.props;
    const { activeStatus } = this.state;
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
    }[activeStatus]();
  },
  render() {
    const { activeStatus } = this.state;
    const { loadBrandOrders, brandId, orders, push } = this.props;
    if (_.isNil(orders)) {
      return <EmptyView text='Loading...' />
    }
    return (
      <View style={styles.container}>
        <View style={styles.statusContainer}>
          <Button
            style={activeStatus === 'new' ? styles.activeStatus : styles.inactiveStatus}
            onPress={() => this.setState({ activeStatus: 'new' })}
          >
            신규주문
          </Button>
          <Button
            style={activeStatus === 'ready' ? styles.activeStatus : styles.inactiveStatus}
            onPress={() => this.setState({ activeStatus: 'ready' })}
          >
            포장완료
          </Button>
          <Button
            style={activeStatus === 'awaiting' ? styles.activeStatus : styles.inactiveStatus}
            onPress={() => this.setState({ activeStatus: 'awaiting' })}
          >
            입금대기
          </Button>
        </View>
        <OrderList
          key={activeStatus}
          brandId={brandId}
          push={push}
          orders={this.filter()}
          status={activeStatus}
          onRefresh={() => loadBrandOrders(brandId, 'not_settled')}
        />
      </View>
    );
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#1F3A4A',
    paddingVertical: 15,
  },
  activeStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0dcff2',
  },
  inactiveStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#999999',
  },
});

export default connect((state, ownProps) => {
  const { key } = orderActions.loadBrandOrders(ownProps.brandId, 'not_settled');
  return { orders: _.get(state.order[key], 'list') };
}, orderActions)(Orders);
