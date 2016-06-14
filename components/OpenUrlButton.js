'use strict';

import React from 'react';
import { Linking } from 'react-native';
import Button from 'react-native-button';

export default React.createClass({
  handleClick() {
    Linking.canOpenURL(this.props.url).then(supported => {
      if (supported) {
        Linking.openURL(this.props.url);
      } else {
        console.log('Don\'t know how to open URI: ' + this.props.url);
      }
    });
  },
  render() {
    return (
      <Button onPress={this.handleClick}>
        {this.props.children}
      </Button>
    );
  }
});
