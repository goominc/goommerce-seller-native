'use strict';

import React, {
  Picker,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default React.createClass({
  getInitialState() {
    const { value } = this.props;
    return { show: false, value };
  },
  toggle() {
    console.log('toggle');
    this.setState({ show: !this.state.show });
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
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          onPress={this.toggle}
        >
          <View style={styles.container}>
            <Text>{this.props.prefix}</Text>
            <Text>{this.state.value}</Text>
          </View>
        </TouchableOpacity>
        {this.state.show && this.renderPicker()}
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
});
