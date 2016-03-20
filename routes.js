'use strict';
import Home from './containers/Home';
import OrderStats from './containers/OrderStats';

export default {
  home: (props) => ({ title: 'Home', component: Home, props }),
  stats: (props) => ({ title: 'Order Stats', component: OrderStats, props }),
};
