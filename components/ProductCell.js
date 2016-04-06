'use strict';

import React, {
  Image,
  Picker,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import { CloudinaryImageNative } from 'react-cloudinary';

import DefaultText from './DefaultText';

export default React.createClass({
  render() {
    const TouchableElement = Platform.OS === 'android' ?
      TouchableNativeFeedback : TouchableHighlight;
    const { product: { appImages, name } } = this.props;
    const image = appImages.default[0];
    return (
      <View>
        <TouchableElement
          onPress={this.props.onSelect}
          onShowUnderlay={this.props.onHighlight}
          onHideUnderlay={this.props.onUnhighlight}
        >
          <View style={styles.container}>
            <CloudinaryImageNative
              publicId={image.publicId}
              options={{ width: 200, height: 200 }}
              style={styles.thumbnail}
            />
            <View style={styles.descContainer}>
              <DefaultText text={name.ko} />
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
