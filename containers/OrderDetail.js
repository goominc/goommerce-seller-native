import React, {
  ListView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import { orderActions } from 'goommerce-redux';

import EmptyView from '../components/EmptyView';
import OrderProductCell from '../components/OrderProductCell';
import RefreshableList from '../components/RefreshableList';

const OrderDetail = React.createClass({
  statics: {
    rightButton() {
      return (
        <TouchableOpacity
          style={styles.navBarRightButton}>
          <Text style={styles.navBarButtonText}>
            포장완료
          </Text>
        </TouchableOpacity>
      );
    },
  },
  componentDidMount() {
    const { loadBrandOrder, brandId, orderId } = this.props;
    loadBrandOrder(brandId, orderId);
  },
  dataSource: new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
    sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
  }),
  onRefresh() {
    const { loadBrandOrder, brandId, orderId } = this.props;
    return loadBrandOrder(brandId, orderId);
  },
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
  renderSectionHeader(sectionData, sectionID) {
    return (
      <View style={styles.section}>
        <Text style={{ fontSize: 17 }}>
          {sectionData[0].product.name.ko}
        </Text>
      </View>
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
    const dataBlob = _.groupBy(orderProducts, (o) => o.product.id);
    const dataSource = this.dataSource.cloneWithRowsAndSections(dataBlob);
    return (
      <View style={styles.container}>
        <RefreshableList
          dataSource={dataSource}
          renderRow={this.renderRow}
          renderSectionHeader={this.renderSectionHeader}
          renderSeparator={this.renderSeparator}
          onRefresh={this.onRefresh}
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
  section: {
    marginTop: 10,
  },
  navBarRightButton: {
    paddingRight: 10,
  },
  navBarButtonText: {
    fontSize: 16,
    marginVertical: 10,
    color: '#5890FF',
  },
});

export default connect(
  (state, ownProps) => {
    const { key } = orderActions.loadBrandOrder(ownProps.brandId, ownProps.orderId);
    return { reduxKey: key, order: state.order[key] };
  }, orderActions
)(OrderDetail);
