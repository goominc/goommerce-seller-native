'use strict';

import React from 'react';
import { ListView, StyleSheet, Text, View } from 'react-native';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import { productActions } from 'goommerce-redux';

import EmptyView from '../components/EmptyView';
import ProductVariantCell from '../components/ProductVariantCell';

const ProductDetail = React.createClass({
  componentDidMount() {
    const { productId, loadProduct } = this.props;
    loadProduct(productId);
  },
  dataSource: new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
  }),
  renderRow(productVariant) {
    const { product } = this.props;
    return (
      <ProductVariantCell
        key={productVariant.id}
        product={product}
        productVariant={productVariant}
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
    const { product } = this.props;
    if (!product) {
      return <EmptyView text='Loading...' />;
    }
    // FIXME: possible performance issue...
    const dataSource = this.dataSource.cloneWithRows(product.productVariants);
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
    const { productId } = ownProps;
    const { key } = productActions.loadProduct(productId);
    return { product: state.product[key] };
  },
  productActions
)(ProductDetail);
