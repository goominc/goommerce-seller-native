'use strict';

import React from 'react';
import { ListView, StyleSheet, Text, View } from 'react-native';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import { productActions } from 'goommerce-redux';
import _ from 'lodash';

import EmptyView from '../components/EmptyView';
import ProductCell from '../components/ProductCell';
import RefreshableList from '../components/RefreshableList';
import routes from '../routes';

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
    sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
  }),
  onEndReached() {
    const { brandId, limit, pagination, loadBrandProducts } = this.props;
    if (!pagination.hasMore || this.state.isLoadingTail) {
      return;
    }
    this.setState({ isLoadingTail: true });
    loadBrandProducts(brandId, pagination.offset + pagination.limit, limit).then(
      () => this.setState({ isLoadingTail: false })
    );
  },
  onRefresh() {
    const { brandId, limit, loadBrandProducts } = this.props;
    return loadBrandProducts(brandId, 0, limit);
  },
  listToDataBlob() {
    const { list } = this.props;
    return _.groupBy(list, (p) => new Date(p.createdAt).toDateString());
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
  renderRow(product, sectionID, rowID, highlightRow) {
    const { brandId, push } = this.props;
    return (
      <ProductCell
        key={product.id}
        product={product}
        onHighlight={() => highlightRow(sectionID, rowID)}
        onUnhighlight={() => highlightRow(null, null)}
        onSelect={() => push(routes.product({ productId: product.id }))}
      />
    );
  },
  renderSectionHeader(sectionData, sectionID) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionText}>
          {sectionID}
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
    const { list } = this.props;
    if (!list) {
      return <EmptyView text='Loading...' />;
    }
    if (!list.length) {
      return <EmptyView text='No products...' />;
    }
    // FIXME: possible performance issue...
    const dataSource = this.dataSource.cloneWithRowsAndSections(this.listToDataBlob());
    return (
      <View style={styles.container}>
        <RefreshableList
          dataSource={dataSource}
          renderRow={this.renderRow}
          renderSectionHeader={this.renderSectionHeader}
          renderSeparator={this.renderSeparator}
          onEndReached={this.onEndReached}
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
  scrollSpinner: {
    marginVertical: 20,
  },
  section: {
    alignItems: 'center',
  },
  sectionText: {
    width: 200,
    textAlign: 'center',
    paddingVertical: 6,
    borderRadius: 10,
    marginVertical: 6,
    backgroundColor: '#f2f2f2',
  },
});

export default connect(
  (state, ownProps) => {
    const { key } = productActions.loadBrandProducts(ownProps.brandId);
    return { ...state.product[key] };
  },
  productActions
)(ProductList);
