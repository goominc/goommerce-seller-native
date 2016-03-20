import React, {
  ListView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { connect } from 'react-redux';

import { orderActions } from 'goommerce-redux';

const OrderList = React.createClass({
  componentDidMount() {
    const { brandId, date, loadBrandOrders } = this.props;
    loadBrandOrders(brandId, date);
  },
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
      return (
        <View>
          <Text>
            Loading...
          </Text>
        </View>
      );
    }
    if (!orders.length) {
      return (
        <View>
          <Text>
            No orders...
          </Text>
        </View>
      );
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
    paddingTop: 20,
    backgroundColor: '#F5FCFF',
  },
});

export default connect(
  (state, ownProps) => {
    const { brandId, date } = ownProps;
    const { key } = orderActions.loadBrandOrders(brandId, date);
    return { orders: state.order[key] };
  }, orderActions
)(OrderList);
