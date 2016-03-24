'use strict';

import React, {
  Picker,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import DefaultText from './DefaultText';

export default React.createClass({
  getInitialState() {
    const { value } = this.props;
    return { value };
  },
  renderPicker() {
    const { start, end } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <Picker
          selectedValue={this.state.value}
          onValueChange={(value) => this.setState({ value })}
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
