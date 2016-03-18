'use strict';

import React, {
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { connect } from 'react-redux'

const _ = require('lodash');

const SelectBrand = React.createClass({
  render() {
    const { auth } = this.props;
    const brands = _.filter(auth.roles,
      (r) => r.type === 'owner' || r.type === 'staff').map((r) => r.brand);
    return (
      <View style={styles.container}>
        {brands.map((b, idx) => (<Text key={idx}>{b.id}</Text>))}
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
});

export default connect(
  (state) => ({ auth: state.auth })
)(SelectBrand);
