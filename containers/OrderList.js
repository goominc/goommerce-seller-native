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
import OrderCell from '../components/OrderCell';

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
  renderRow(order) {
    const { brandId, updateStock } = this.props;
    return (
      <OrderCell
        key={order.id}
        order={order}
        confirm={(cnt) => {
          const { key } = loadOrders(this.props);
          updateStock(order.id, cnt, key);
        }}
      />
    );
  },
  renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    var style = styles.rowSeparator;
    if (adjacentRowHighlighted) {
        style = [style, styles.rowSeparatorHide];
    }
    return (
      <View key={'SEP_' + sectionID + '_' + rowID}  style={style}/>
    );
  },
  render() {
    const { orders, filter } = this.props;
    if (!orders) {
      return <EmptyView text='Loading...' />;
    }
    if (!orders.length) {
      return <EmptyView text='No orders...' />;
    }
    // FIXME: possible performance issue...
    const dataSource = this.dataSource.cloneWithRows(
      filter ? orders.filter(filter) : orders);
    return (
      <View style={styles.container}>
        <ListView
          dataSource={dataSource}
          renderRow={this.renderRow}
          renderSeparator={this.renderSeparator}
        />
      </View>
    );
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  rowSeparator: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: 1,
    marginLeft: 4,
  },
  rowSeparatorHide: {
    opacity: 0.0,
  },
});

export default connect(
  (state, ownProps) => ({ orders: state.order[loadOrders(ownProps).key] }),
  Object.assign({ loadOrders }, orderActions)
)(OrderList);
