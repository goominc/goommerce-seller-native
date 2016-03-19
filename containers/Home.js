'use strict';

import React, {
  ListView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { connect } from 'react-redux'

const _ = require('lodash');

const Home = React.createClass({
  render() {
    const { auth: { roles, email }, navigator } = this.props;
    const brands = _.filter(roles,
      (r) => r.type === 'owner' || r.type === 'staff').map((r) => r.brand);
    return (
      <View style={styles.container}>
        <Text>{email}</Text>
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
)(Home);
