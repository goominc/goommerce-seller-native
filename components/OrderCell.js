'use strict';

import _ from 'lodash';
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
    const { order: { quantity, totalKRW, orderProducts } } = this.props;
    const status = _.countBy(orderProducts, 'status');
    return (
      <View>
        <TouchableElement
          onPress={this.props.onSelect}
          onShowUnderlay={this.props.onHighlight}
          onHideUnderlay={this.props.onUnhighlight}
        >
          <View style={styles.container}>
            <View style={styles.descContainer}>
              <DefaultText text={`QUANTITY: ${quantity}`} />
              <DefaultText text={`TOTAL: ₩${totalKRW}`} />
              {status[100] && <DefaultText text={'!!NEW!!'} />}
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
