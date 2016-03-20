'use strict';
import Home from './containers/Home';
import OrderStats from './containers/OrderStats';
import OrderList from './containers/OrderList';

export default {
  home: (props) => ({ title: 'Home', component: Home, props }),
  stats: (props) => ({ title: 'Order Stats', component: OrderStats, props }),
  list: (props) => ({ title: 'Order List', component: OrderList, props }),
};
