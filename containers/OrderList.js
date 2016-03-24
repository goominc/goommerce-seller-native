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
import OrderItem from '../components/OrderItem';

function loadOrders(props) {
  const { brandId, date } = props;
  const { loadBrandOrders, loadBrandPendingOrders } = orderActions;
  return date ? loadBrandOrders(brandId, date) : loadBrandPendingOrders(brandId);
}

const OrderList = React.createClass({
  componentDidMount() {
    this.props.loadOrders(this.props);
  },
  dataSource: new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
  }),
  renderOrder(order) {
    const { brandId, updateStock, removeBrandPendingOrder } = this.props;
    return (
      <OrderItem
        order={order}
        confirm={(cnt) => updateStock(order.id, cnt).then(
          () => removeBrandPendingOrder(brandId, order.id))}
      />
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
  (state, ownProps) => ({ orders: state.order[loadOrders(ownProps).key] }),
  Object.assign({ loadOrders }, orderActions)
)(OrderList);
