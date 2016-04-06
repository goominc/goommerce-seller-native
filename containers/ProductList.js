import React, {
  ListView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import { productActions } from 'goommerce-redux';

import EmptyView from '../components/EmptyView';
import ProductCell from '../components/ProductCell';

const ProductList = React.createClass({
  getDefaultProps() {
    return { limit: 20 };
  },
  getInitialState() {
    // TODO: move this into redux?
    return { isLoadingTail: false };
  },
  componentDidMount() {
    const { brandId, limit, loadBrandProducts } = this.props;
    loadBrandProducts(brandId, 0, limit);
  },
  dataSource: new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
  }),
  onEndReached() {
    console.log('onEndReached');
    const { brandId, limit, pagination, loadBrandProducts } = this.props;
    if (!pagination.hasMore || this.state.isLoadingTail) {
      return;
    }
    this.setState({ isLoadingTail: true });
    loadBrandProducts(brandId, pagination.offset + pagination.limit, limit).then(
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
  renderRow(product) {
    const { brandId, updateStock } = this.props;
    return (
      <ProductCell
        key={product.id}
        product={product}
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
      return <EmptyView text='No products...' />;
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
    const { brandId } = ownProps;
    const { key } = productActions.loadBrandProducts(brandId);
    return { ...state.product[key] };
  },
  productActions
)(ProductList);
