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
import OrderProductCell from '../components/OrderProductCell';

const OrderDetail = React.createClass({
  componentDidMount() {
    const { loadBrandOrder, brandId, orderId } = this.props;
    loadBrandOrder(brandId, orderId);
  },
  dataSource: new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
  }),
  renderRow(orderProduct) {
    const { reduxKey, createOrderProductLog } = this.props;
    return (
      <OrderProductCell
        key={orderProduct.id}
        orderProduct={orderProduct}
        confirm={(cnt) => {
          createOrderProductLog(orderProduct.id, reduxKey, {
            type: 1101,
            data: { quantity: cnt },
          });
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
    const { order } = this.props;
    if (!order) {
      return <EmptyView text='Loading...' />;
    }
    const { orderProducts } = order;
    if (!orderProducts.length) {
      return <EmptyView text='No orders...' />;
    }
    // FIXME: possible performance issue...
    const dataSource = this.dataSource.cloneWithRows(orderProducts);
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
  (state, ownProps) => {
    const { key } = orderActions.loadBrandOrder(ownProps.brandId, ownProps.orderId);
    return { reduxKey: key, order: state.order[key] };
  }, orderActions
)(OrderDetail);
