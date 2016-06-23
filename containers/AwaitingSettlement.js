'use strict';

import React from 'react';
import { StyleSheet, View } from 'react-native';
import Button from 'react-native-button';
import { connect } from 'react-redux';
import { orderActions } from 'goommerce-redux';
import _ from 'lodash';

import EmptyView from '../components/EmptyView';
import OrderList from './OrderList';

const AwaitingSettlement = React.createClass({
  render() {
    const { loadBrandOrders, brandId, orders, push } = this.props;

    if (_.isNil(orders)) {
      return <EmptyView text='Loading...' />
    }

    const filtered = _.filter(orders, (o) => (o.status !== 100 ||
      _.every(o.orderProducts, (p) => p.status === 200)));

    return (
      <OrderList
        brandId={brandId}
        push={push}
        orders={filtered}
        status={'awaiting'}
        onRefresh={() => loadBrandOrders(brandId, 'not_settled')}
      />
    );
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default connect((state, ownProps) => {
  const { key } = orderActions.loadBrandOrders(ownProps.brandId, 'not_settled');
  return { orders: _.get(state.order[key], 'list') };
}, orderActions)(AwaitingSettlement);
