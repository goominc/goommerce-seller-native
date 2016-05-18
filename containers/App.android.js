'use strict';

import React, {
  BackAndroid,
  Dimensions,
  DrawerLayoutAndroid,
  Navigator,
  StatusBar,
  StyleSheet,
  View
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import routes from '../routes';

const DRAWER_WIDTH_LEFT = 56;

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
  componentWillMount() {
    BackAndroid.addEventListener('hardwareBackPress', this.handleBackButtonPress);
  },
  handleBackButtonPress() {
    if (this._overrideBackPressForDrawerLayout) {
      // This hack is necessary because drawer layout provides an imperative API
      // with open and close methods. This code would be cleaner if the drawer
      // layout provided an `isOpen` prop and allowed us to pass a `onDrawerClose` handler.
      this.drawer && this.drawer.closeDrawer();
      return true;
    }
    return false;
  },
  renderScene(route, navigator) {
    _navigator = navigator;
    return (
      <View style={styles.scene}>
        <MaterialIcons.ToolbarAndroid
          navIconName="menu"
          onIconClicked={() => this.drawer.openDrawer()}
          style={styles.toolbar}
          title={route.title}
        />
        <route.component {...route.props} push={navigator.push} />
      </View>
    );
  },
  renderDrawerContent() {
    return (
      <View style={styles.drawerContentWrapper}>
      </View>
    );
  },
  render() {
    return (
      <DrawerLayoutAndroid
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        drawerWidth={Dimensions.get('window').width - DRAWER_WIDTH_LEFT}
        keyboardDismissMode="on-drag"
        onDrawerOpen={() => {
          this._overrideBackPressForDrawerLayout = true;
        }}
        onDrawerClose={() => {
          this._overrideBackPressForDrawerLayout = false;
        }}
        ref={(drawer) => { this.drawer = drawer; }}
        renderNavigationView={this.renderDrawerContent}
        statusBarBackgroundColor="#589c90">
        <Navigator
          initialRoute={routes.home()}
          renderScene={this.renderScene}
          style={styles.container}
        />
      </DrawerLayoutAndroid>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  toolbar: {
    backgroundColor: '#e9eaed',
    height: 56,
  },
  scene: {
    flex: 1,
    backgroundColor: 'white',
  },
  drawerContentWrapper: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: 'white',
  },
});
