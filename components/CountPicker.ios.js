'use strict';

import React from 'react';
import { Picker, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import DefaultText from './DefaultText';

export default React.createClass({
  getInitialState() {
    return { show: false };
  },
  toggle() {
    if (this.props.enabled) {
      this.setState({ show: !this.state.show });
    }
  },
  renderPicker() {
    const { start, end, selectedValue, onValueChange } = this.props;
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
  },
  render() {
    return (
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          onPress={this.toggle}
        >
          <View style={styles.container}>
            <DefaultText text={this.props.prefix} style={styles.text} />
            <View style={styles.valueContainer}>
              <DefaultText text={this.props.selectedValue} style={styles.text} />
              {this.props.enabled && <Icon name='sort' />}
            </View>
          </View>
        </TouchableOpacity>
        {this.props.enabled && this.state.show && this.renderPicker()}
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
  valueContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  sortIcon: {
    paddingLeft: 30,
  },
});
