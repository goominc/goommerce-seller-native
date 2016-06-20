import React from 'react';
import { Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import _ from 'lodash';

export default React.createClass({
  render() {
    const name = () => {
      if (_.startsWith(this.props.name, 'md-') || _.startsWith(this.props.name, 'ios-')) {
        return this.props.name;
      }
      return `${Platform.OS === 'ios' ? 'ios' : 'md'}-${this.props.name}`;
    }
    return (<Ionicons {...this.props} name={name()} />);
  }
});
