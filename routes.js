'use strict';
import OrderDetail from './containers/OrderDetail';
import Orders from './containers/Orders';
import ProductDetail from './containers/ProductDetail';
import ProductList from './containers/ProductList';
import Profile from './containers/Profile';

export default {
  order: (title, props) => ({ title, component: OrderDetail, props }),
  orders: (props) => ({ title: '주문조회', component: Orders, props }),
  product: (props) => ({ title: '상품조회', component: ProductDetail, props }),
  products: (props) => ({ title: '상품관리', component: ProductList, props }),
  profile: (props) => ({ title: '내 정보', component: Profile, props }),
};
