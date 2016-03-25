'use strict';

import React, {
  BackAndroid,
  Navigator,
  StyleSheet,
  View
} from 'react-native';

import routes from '../routes';

// FIXME: Uses NavigatorExperimental when it's ready.
let _navigator;
BackAndroid.addEventListener('hardwareBackPress', () => {
  if (_navigator && _navigator.getCurrentRoutes().length > 1) {
    _navigator.pop();
    return true;
  }
  return false;
});

export default React.createClass({
  renderScene(route, navigator) {
    _navigator = navigator;
    return (
      <View style={styles.scene}>
        <route.component {...route.props} push={navigator.push} />
      </View>
    );
  },
  render() {
    return (
      <Navigator
        initialRoute={routes.home()}
        renderScene={this.renderScene}
        style={styles.container}
      />
    );
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scene: {
    flex: 1,
    backgroundColor: 'white',
  },
});
