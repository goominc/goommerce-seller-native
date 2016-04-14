import React, {
  Alert,
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
import routes from '../routes';

const OrderList = React.createClass({
  getDefaultProps() {
    return { limit: 20 };
  },
  getInitialState() {
    // TODO: move this into redux?
    return { isLoadingTail: false };
  },
  componentDidMount() {
    const { brandId, limit, loadBrandOrders } = this.props;
    loadBrandOrders(brandId, 0, limit);
  },
  dataSource: new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
  }),
  onEndReached() {
    const { brandId, limit, pagination, loadBrandOrders } = this.props;
    if (!pagination.hasMore || this.state.isLoadingTail) {
      return;
    }
    this.setState({ isLoadingTail: true });
    loadBrandOrders(brandId, pagination.offset + pagination.limit, limit).then(
      () => this.setState({ isLoadingTail: false })
    );
  },
  renderFooter() {
    const { pagination } = this.props;
    if (!pagination.hasMore || !this.state.isLoadingTail) {
      return <View style={styles.scrollSpinner} />;
    }
    if (Platform.OS === 'ios') {
      return <ActivityIndicatorIOS style={styles.scrollSpinner} />;
    } else {
      return (
        <View  style={{alignItems: 'center'}}>
          <ProgressBarAndroid styleAttr="Large"/>
        </View>
      );
    }
  },
  renderRow(order, sectionID, rowID, highlightRow) {
    const { brandId, push, reduxKey, updateBrandOrderStatus } = this.props;

    function onSelect() {
      function onConfirm() {
        updateBrandOrderStatus(brandId, order.id, reduxKey, 100, 101);
        push(routes.order({ brandId, orderId: order.id }));
      }
      if (_.find(order.orderProducts, { status: 100 })) {
        Alert.alert(
          'Info',
          'Do you want to check this order?',
          [ { text: 'OK', onPress: onConfirm }, { text: 'CANCEL' } ]
        );
      } else {
        push(routes.order({ brandId, orderId: order.id }));
      }
    }

    return (
      <OrderCell
        key={order.id}
        order={order}
        onHighlight={() => highlightRow(sectionID, rowID)}
        onUnhighlight={() => highlightRow(null, null)}
        onSelect={onSelect}
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
    const { list } = this.props;
    if (!list) {
      return <EmptyView text='Loading...' />;
    }
    if (!list.length) {
      return <EmptyView text='No orders...' />;
    }
    // FIXME: possible performance issue...
    const dataSource = this.dataSource.cloneWithRows(list);
    return (
      <View style={styles.container}>
        <ListView
          dataSource={dataSource}
          renderRow={this.renderRow}
          renderSeparator={this.renderSeparator}
          onEndReached={this.onEndReached}
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
  scrollSpinner: {
    marginVertical: 20,
  },
});

export default connect(
  (state, ownProps) => {
    const { key } = orderActions.loadBrandOrders(ownProps.brandId);
    return { reduxKey: key, ...state.order[key] };
  }, orderActions
)(OrderList);
