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
    const { order: { buyer, itemCount, count, totalKRW } } = this.props;
    return (
      <View>
        <TouchableElement
          onPress={this.props.onSelect}
          onShowUnderlay={this.props.onHighlight}
          onHideUnderlay={this.props.onUnhighlight}
        >
          <View style={styles.container}>
            <View style={styles.descContainer}>
              <DefaultText text={`BUYER: ${buyer.name || buyer.id}`} />
              <DefaultText text={`COUNT: ${count} / ${itemCount}`} />
              <DefaultText text={`TOTAL: ₩${totalKRW}`} />
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
});
