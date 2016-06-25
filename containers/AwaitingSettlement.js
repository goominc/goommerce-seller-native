'use strict';

import React from 'react';
import { Navigator, StyleSheet, View } from 'react-native';
import Button from 'react-native-button';
import { connect } from 'react-redux';
import { orderActions } from 'goommerce-redux';
import _ from 'lodash';

import Icon from '../components/Icon';
import EmptyView from '../components/EmptyView';
import OrderList from './OrderList';
import routes from '../routes';

const AwaitingSettlement = React.createClass({
  statics: {
    leftButton() {
      return null;
    },
    rightButton: (route, navigator) => {
      return (
        <Button onPress={() => navigator.pop()}>
          <View style={{ padding: 5 }}>
            <Icon name='close' size={23} color='white' />
          </View>
        </Button>
      );
    },
  },
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
        onSelect={(order) => {
          const title = `링크# ${order.orderName || _.padStart(order.id, 3, '0').substr(-3)} 주문내역`;
          push(routes.order(title, {
            brandId,
            orderId: order.id,
            showTabBar: false,
            sceneConfig: Navigator.SceneConfigs.VerticalDownSwipeJump,
            rightButton(route, navigator, index, navState) {
              return (
                <Button onPress={() => navigator.popToRoute(navState.routeStack[index - 2])}>
                  <View style={{ padding: 5 }}>
                    <Icon name='close' size={23} color='white' />
                  </View>
                </Button>
              );
            },
          }));
        }}
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
