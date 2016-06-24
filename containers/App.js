'use strict';

import React from 'react';
import { Image, StatusBar, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux'
import { authActions } from 'goommerce-redux';
import _ from 'lodash';
import TabNavigator from 'react-native-tab-navigator';

import Agreement from './Agreement';
import EmptyView from '../components/EmptyView';
import Navigator from '../components/Navigator';
import Signin from '../components/Signin';
import routes from '../routes';

const App = React.createClass({
  getInitialState: function() {
    return {
      selectedTab: 'orders',
      ordersNavigatorKey: Date.now(),
      settledNavigatorKey: Date.now(),
      productsNavigatorKey: Date.now(),
    };
  },
  componentDidMount() {
    const { auth, whoami } = this.props;
    if (auth.bearer && !auth.email) {
      whoami();
    }
  },
  render() {
    const { auth: { bearer, email, roles, data } } = this.props;
    if (!bearer) {
      return <Signin signin={this.signin} />;
    }
    if (!email) {
      return <EmptyView text={'Loading...'} />;
    }

    const brands = _.filter(roles,
      (r) => r.type === 'owner' || r.type === 'staff').map((r) => r.brand);
    if (brands.length === 0) {
      return <EmptyView text={'Not brand owner...'} />;
    }

    if (_.get(data, 'agreements.seller', 0) < 1 ||
        _.get(data, 'agreements.personalInfomation', 0) < 1) {
      return <Agreement />;
    }

    const brandId = brands[0].id;
    return (
      <View style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" />
        <TabNavigator tabBarStyle={styles.tabBarStyle}>
          <TabNavigator.Item
            renderIcon={() => <Image source={require('./images/tab_order.png')} style={styles.icon}/>}
            title="주문조회"
            selected={this.state.selectedTab === 'orders'}
            onPress={() => {
              this.setState({ selectedTab: 'orders', ordersNavigatorKey: Date.now() });
            }}>
            <Navigator key={this.state.ordersNavigatorKey} initialRoute={routes.orders({ brandId })} />
          </TabNavigator.Item>
          <TabNavigator.Item
            renderIcon={() => <Image source={require('./images/tab_settled.png')} style={styles.icon}/>}
            title="정산통계"
            selected={this.state.selectedTab === 'settled'}
            onPress={() => {
              this.setState({ selectedTab: 'settled', settledNavigatorKey: Date.now() });
            }}>
            <Navigator key={this.state.settledNavigatorKey} initialRoute={routes.settled({ brandId })} />
          </TabNavigator.Item>
          <TabNavigator.Item
            renderIcon={() => <Image source={require('./images/tab_product.png')} style={styles.icon}/>}
            title="상품관리"
            selected={this.state.selectedTab === 'products'}
            onPress={() => {
              this.setState({ selectedTab: 'products', productsNavigatorKey: Date.now() });
            }}>
            <Navigator key={this.state.productsNavigatorKey} initialRoute={routes.products({ brandId })} />
          </TabNavigator.Item>
          <TabNavigator.Item
            renderIcon={() => <Image source={require('./images/tab_profile.png')} style={styles.icon}/>}
            title="내 정보"
            selected={this.state.selectedTab === 'profile'}
            onPress={() => {
              this.setState({ selectedTab: 'profile' });
            }}>
            <Navigator initialRoute={routes.profile({ brandId })} />
          </TabNavigator.Item>
        </TabNavigator>
      </View>
    );
  }
});

const styles = StyleSheet.create({
  icon: {
    transform: [{ translateY: 7 }],
    tintColor: '#b2b2b2',
  },
  tabBarStyle: {
    backgroundColor: 'white',
  }
});

export default connect(
  (state) => ({ auth: state.auth }), authActions
)(App);
