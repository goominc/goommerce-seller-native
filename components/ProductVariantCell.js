'use strict';

import React, {
  Image,
  Picker,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CloudinaryImageNative } from 'react-cloudinary';

import DefaultText from './DefaultText';

export default React.createClass({
  render() {
    const { product, productVariant } = this.props;
    const image = productVariant.appImages.default[0];
    const { color, size } = productVariant.data;
    const KRW = productVariant.KRW || product.KRW;
    return (
      <View style={styles.container}>
        <CloudinaryImageNative
          publicId={image.publicId}
          options={{ width: 200, height: 200 }}
          style={styles.thumbnail}
        />
        <View style={styles.descContainer}>
          <DefaultText text={`${color}-${size}`} />
          <DefaultText text={`₩${KRW}`} />
        </View>
      </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  descContainer: {
    flex: 1,
  },
  thumbnail: {
    width: 90,
    height: 90,
    marginRight: 10,
    backgroundColor: '#dddddd',
  },
});
