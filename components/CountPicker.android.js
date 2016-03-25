'use strict';

import React, {
  Picker,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import DefaultText from './DefaultText';

export default React.createClass({
  renderPicker() {
    const { start, end, selectedValue, enabled, onValueChange } = this.props;
    if (enabled) {
      return (
        <View style={{ flex: 1 }}>
          <Picker
            selectedValue={selectedValue}
            onValueChange={onValueChange}
          >
            {_.range(start, end + 1).map((c) =>
              (<Picker.Item key={c} label={c.toString()} value={c} />)
            )}
          </Picker>
        </View>
      );
    }

    return (
      <DefaultText text={this.props.selectedValue} style={styles.text} />
    );
  },
  render() {
    return (
      <View style={styles.container}>
        <DefaultText text={this.props.prefix} style={styles.text} />
        {this.renderPicker()}
      </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 25,
    fontWeight: 'bold',
  },
});
