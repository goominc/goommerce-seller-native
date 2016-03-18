'use strict';

import React, {
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { connect } from 'react-redux'
import { orderActions } from 'goommerce-redux';

const OrderStats = React.createClass({
  getInitialState() {
    return {};
  },
  render() {
    return (
      <View style={styles.container}>
        <TextInput
          autoCapitalize='none'
          autoCorrect={false}
          keyboardType='email-address'
          onChangeText={(email) => this.setState({ email })}
          placeholder='Email address'
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          value={this.state.email}
        />
        <TextInput
          autoCapitalize='none'
          autoCorrect={false}
          onChangeText={(password) => this.setState({ password })}
          placeholder='Password'
          secureTextEntry={true}
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          value={this.state.password}
        />
        <Text style={styles.signin} onPress={this.signin}>
          Sign In
        </Text>
      </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    flex: 1,
    justifyContent: 'center',
  },
  signin: {
    borderColor: '#00ff00',
    borderWidth: 2,
    color: '#333333',
    textAlign: 'center',
  },
});

export default connect(
  (state, ownProps) => {
    const { brandId } = ownProps.params;
    const { key } = orderActions.loadBrandOrderStats(brandId);
    return { brandId, stats: state.order[key] };
  }, orderActions
)(OrderStats);