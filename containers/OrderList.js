import React, {
  ListView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import { orderActions } from 'goommerce-redux';

import EmptyView from '../components/EmptyView';

const OrderList = React.createClass({
  componentDidMount() {
    const { loadOrders, dispatch } = this.props;
    bindActionCreators(loadOrders, dispatch)();
  },
  dataSource: new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
  }),
  renderOrder(order) {
    return  (
      <View>
        <Text>id: {order.id}</Text>
        <Text>Unit Price(KRW): {order.KRW}</Text>
        <Text>Count: {order.orderedCount}</Text>
        <Text>Total(KRW): {order.totalKRW}</Text>
        <Text>Total(USD): {order.totalUSD}</Text>
      </View>
    );
  },
  render() {
    const { orders } = this.props;
    if (!orders) {
      return <EmptyView text='Loading...' />;
    }
    if (!orders.length) {
      return <EmptyView text='No orders...' />;
    }
    const dataSource = this.dataSource.cloneWithRows(orders);
    return (
      <ListView
        dataSource={dataSource}
        renderRow={this.renderOrder}
        style={styles.listView}
      />
    );
  },
});

const styles = StyleSheet.create({
  listView: {
    backgroundColor: '#F5FCFF',
  },
});

export default connect(
  (state, ownProps) => {
    const { brandId, date } = ownProps;
    const { loadBrandOrders, loadBrandPendingOrders } = orderActions;
    const loadOrders = () =>
      date ? loadBrandOrders(brandId, date) : loadBrandPendingOrders(brandId);
    const { key } = loadOrders();
    return { loadOrders, orders: state.order[key] };
  }
)(OrderList);
