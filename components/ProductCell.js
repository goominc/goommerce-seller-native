'use strict';

import React from 'react';
import {
  Image,
  Picker,
  Platform,
  StyleSheet,
  Switch,
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import { CloudinaryImageNative } from 'react-cloudinary/lib/native';
import numeral from 'numeral';

import DefaultText from './DefaultText';
import OpenUrlButton from './OpenUrlButton';

export default React.createClass({
  render() {
    const TouchableElement = Platform.OS === 'android' ?
      TouchableNativeFeedback : TouchableHighlight;
    const { product: { id, appImages, name, KRW, isActive } } = this.props;
    const image = appImages.default[0];
    return (
      <View>
        <TouchableElement
          onPress={this.props.onSelect}
          onShowUnderlay={this.props.onHighlight}
          onHideUnderlay={this.props.onUnhighlight}
        >
          <View style={styles.container}>
            <OpenUrlButton url={`https://m.linkshops.com/products/${id}`}>
              <CloudinaryImageNative
                publicId={image.publicId}
                options={{ width: 200, height: 200 }}
                style={styles.thumbnail}
              />
            </OpenUrlButton>
            <View style={styles.descContainer}>
              <Text style={{ fontSize: 14, color: '#4c4c4c' }}>{name.ko}</Text>
              {KRW && <Text style={{ fontSize: 12, color: '#4c4c4c' }}>{`${numeral(KRW).format('0,0')}원`}</Text>}
            </View>
          </View>
        </TouchableElement>
      </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
    height: 90,
    marginHorizontal: 12,
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
