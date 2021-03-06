'use strict';

import AwaitingSettlement from './containers/AwaitingSettlement';
import OrderDetail from './containers/OrderDetail';
import OrderList from './containers/OrderList';
import Orders from './containers/Orders';
import Settled from './containers/Settled';
import SettledOrderList from './containers/SettledOrderList';
import ProductDetail from './containers/ProductDetail';
import ProductList from './containers/ProductList';
import Profile from './containers/Profile';

export default {
  awaiting: (props) => ({ title: '입금대기 내역', component: AwaitingSettlement, props }),
  order: (title, props) => ({ title, component: OrderDetail, props }),
  orders: (props) => ({ title: '주문조회', component: Orders, props }),
  settled: (props) => ({ title: '정산통계', component: Settled, props }),
  settledOrders: (title, props) => ({ title, component: SettledOrderList, props }),
  product: (title, props) => ({ title, component: ProductDetail, props }),
  products: (props) => ({ title: '상품관리', component: ProductList, props }),
  profile: (props) => ({ title: '내 정보', component: Profile, props }),
};
