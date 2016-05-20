'use strict';

import React from 'react';
import { AsyncStorage, TabBarIOS } from 'react-native';
import { connect } from 'react-redux'
import { authActions } from 'goommerce-redux';
import OneSignal from 'react-native-onesignal';

import EmptyView from '../components/EmptyView';
import Navigator from '../components/Navigator';
import Signin from '../components/Signin';
import routes from '../routes';

const App = React.createClass({
  getInitialState: function() {
    return {
      selectedTab: 'orders',
    };
  },
  componentDidMount() {
    const { auth, whoami } = this.props;
    if (auth.bearer && !auth.email) {
      whoami();
    }
  },
  signin(email, password) {
    OneSignal.idsAvailable(({ pushToken, playerId, userId }) => {
      this.props.login(email, password, pushToken && (playerId || userId)).then(
        (auth) => AsyncStorage.setItem('bearer', auth.bearer)
      );
    });
  },
  render() {
    const { auth: { bearer, email, roles } } = this.props;
    if (!bearer) {
      return (<Signin signin={this.signin} />);
    }
    if (!email) {
      return <EmptyView text={'Loading...'} />;
    }

    const brands = _.filter(roles,
      (r) => r.type === 'owner' || r.type === 'staff').map((r) => r.brand);
    if (brands.length === 0) {
      return <EmptyView text={'Not brand owner...'} />;
    }

    const brandId = brands[0].id;
    return (
      <TabBarIOS
        barTintColor="white">
        <TabBarIOS.Item
          icon={require('./images/tab_order.png')}
          title="주문조회"
          selected={this.state.selectedTab === 'orders'}
          onPress={() => {
            this.setState({ selectedTab: 'orders' });
          }}>
          <Navigator initialRoute={routes.orders({ brandId })} />
        </TabBarIOS.Item>
        <TabBarIOS.Item
          icon={require('./images/tab_product.png')}
          title="상품관리"
          selected={this.state.selectedTab === 'products'}
          onPress={() => {
            this.setState({ selectedTab: 'products' });
          }}>
          <Navigator initialRoute={routes.products({ brandId })} />
        </TabBarIOS.Item>
        <TabBarIOS.Item
          icon={require('./images/tab_profile.png')}
          title="내 정보"
          selected={this.state.selectedTab === 'profile'}
          onPress={() => {
            this.setState({ selectedTab: 'profile' });
          }}>
          <Navigator initialRoute={routes.profile()} />
        </TabBarIOS.Item>
      </TabBarIOS>
    );
  }
});

export default connect(
  (state) => ({ auth: state.auth }) , authActions
)(App);
