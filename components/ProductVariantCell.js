'use strict';

import React from 'react';
import { Image, Picker, StyleSheet, Text, View } from 'react-native';
import { CloudinaryImageNative } from 'react-cloudinary/lib/native';
import numeral from 'numeral';
import _ from 'lodash';

import DefaultText from './DefaultText';
import OpenUrlButton from './OpenUrlButton';

export default React.createClass({
  renderThumbnail() {
    const image = _.get(this.props.productVariant, 'appImages.default.0', {});
    if (image.publicId) {
      return (
        <CloudinaryImageNative
          publicId={image.publicId}
          options={{ width: 200, height: 200 }}
          style={styles.thumbnail}
        />
      );
    } else {
      return (
        <View style={[styles.thumbnail, { alignItems: 'center', justifyContent: 'center' }]}>
          <Text style={{ fontSize: 11, color: '#999999' }}>No Image</Text>
        </View>
      );
    }
  },
  render() {
    const { product, productVariant } = this.props;
    const { color, size } = productVariant.data;
    const KRW = productVariant.KRW || product.KRW;
    return (
      <View style={styles.container}>
        <OpenUrlButton url={`https://m.linkshops.com/products/${product.id}`}>
          {this.renderThumbnail()}
        </OpenUrlButton>
        <View style={styles.descContainer}>
          <Text style={{ fontSize: 14, color: '#4c4c4c' }}>{color}</Text>
          <Text style={{ fontSize: 14, color: '#4c4c4c' }}>{size}</Text>
          <Text style={{ fontSize: 12, color: '#4c4c4c' }}>{`${numeral(KRW).format('0,0')}원`}</Text>
        </View>
      </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginVertical: 15,
  },
  descContainer: {
    flex: 1,
  },
  thumbnail: {
    width: 60,
    height: 78,
    marginRight: 10,
    backgroundColor: '#F2F2F2',
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
});
