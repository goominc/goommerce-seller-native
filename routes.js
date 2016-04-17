'use strict';
import Home from './containers/Home';
import OrderDetail from './containers/OrderDetail';
import OrderList from './containers/OrderList';
import ProductDetail from './containers/ProductDetail';
import ProductList from './containers/ProductList';
import Profile from './containers/Profile';

export default {
  home: (props) => ({ title: 'Home', component: Home, props }),
  order: (props) => ({ title: 'Order List', component: OrderDetail, props }),
  orders: (props) => ({ title: 'Order List', component: OrderList, props }),
  product: (props) => ({ title: 'Product Detail', component: ProductDetail, props }),
  products: (props) => ({ title: 'Product List', component: ProductList, props }),
  profile: (props) => ({ title: 'Profile', component: Profile, props }),
};
