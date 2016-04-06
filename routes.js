'use strict';
import Home from './containers/Home';
import OrderStats from './containers/OrderStats';
import OrderList from './containers/OrderList';
import ProductDetail from './containers/ProductDetail';
import ProductList from './containers/ProductList';

export default {
  home: (props) => ({ title: 'Home', component: Home, props }),
  stats: (props) => ({ title: 'Order Stats', component: OrderStats, props }),
  orders: (props) => ({ title: 'Order List', component: OrderList, props }),
  products: (props) => ({ title: 'Product List', component: ProductList, props }),
  product: (props) => ({ title: 'Product Detail', component: ProductDetail, props }),
};
