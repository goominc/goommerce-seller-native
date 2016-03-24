'use strict';

import React, {
  Image,
  Picker,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { CloudinaryImageNative } from 'react-cloudinary';

const _ = require('lodash');

export default React.createClass({
  getInitialState() {
    return { count: this.props.order.orderedCount };
  },
  render() {
    const { order } = this.props;
    const { product, productVariant } = order;
    const { nickname } = product.data;
    const { color, size } = productVariant.data;
    const image = productVariant.appImages.default[0];
    return (
      <View style={styles.container}>
        <CloudinaryImageNative
          publicId={image.publicId}
          options={{ width: 100, height: 100 }}
          style={styles.thumbnail}
        />
        <View style={styles.descContainer}>
          <Text>#: {order.id}</Text>
          <Text>{nickname.ko}: {color}-{size}</Text>
          <View style={styles.counterContainer}>
            <Text>₩{order.KRW} X </Text>
            <View style={{ flex: 1 }}>
              <Picker
                selectedValue={this.state.count}
                onValueChange={(count) => this.setState({ count })}
              >
                {_.range(1, order.orderedCount + 1).map((c) =>
                  (<Picker.Item key={c} label={c.toString()} value={c} />)
                )}
              </Picker>
            </View>
          </View>
          <View style={styles.confirmContainer}>
            <Icon.Button name="check">
              <Text style={styles.signin}>In Stock</Text>
            </Icon.Button>
            <Icon.Button name="times">
              <Text style={styles.signin}>Out Of Stock</Text>
            </Icon.Button>
          </View>
        </View>
      </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  descContainer: {
    flex: 1,
  },
  counterContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  confirmContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumbnail: {
    width: 90,
    height: 90,
  },
});
