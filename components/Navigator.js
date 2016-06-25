import _ from 'lodash';
import React from 'react';
import { BackAndroid, Navigator, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from 'react-native-button';
import { connect } from 'react-redux'

import Icon from './Icon';

let _navigator;
if (Platform.OS === 'android') {
  // FIXME: Uses NavigatorExperimental when it's ready.
  BackAndroid.addEventListener('hardwareBackPress', () => {
    if (_navigator && _navigator.getCurrentRoutes().length > 1) {
      _navigator.pop();
      return true;
    }
    return false;
  });
}

export default connect()(React.createClass({
  configureScene(route) {
    return route.props.sceneConfig || Navigator.SceneConfigs.PushFromRight;
  },
  renderScene(route, navigator) {
    if (Platform.OS === 'android') {
      _navigator = navigator;
    }
    return (
      <View style={styles.scene}>
        <route.component {...route.props} {...this.props.childProps} push={navigator.push} pop={navigator.pop} />
      </View>
    );
  },
  routeMapper() {
    const { dispatch } = this.props;
    return {
      LeftButton(route, navigator, index, navState) {
        const { component } = route;
        const leftButton = component.leftButton || _.get(component, 'WrappedComponent.leftButton');
        if (leftButton) {
          return (
            <View style={styles.navBarButton}>
              {leftButton(navigator, route)}
            </View>
          );
        }

        // default back button.
        if (index === 0) {
          return null;
        }
        return (
          <Button onPress={() => navigator.pop()} containerStyle={styles.navBarButton}>
            <View style={{ padding: 5 }}>
              <Icon name='arrow-back' size={23} color='white' />
            </View>
          </Button>
        );
      },
      RightButton(route, navigator, index, navState) {
        const { component, props } = route;
        const rightButton = props.rightButton || component.rightButton || _.get(component, 'WrappedComponent.rightButton');
        if (rightButton) {
          return (
            <View style={styles.navBarButton}>
              {rightButton(route, navigator, index, navState)}
            </View>
          );
        }
      },
      Title(route, navigator, index, navState) {
        const { title, component } = route;
        if (_.isNil(title)) {
          const componentTitle = component.title || _.get(component, 'WrappedComponent.title');
          if (componentTitle) return componentTitle(dispatch);
        } else {
          return (
            <Text style={styles.navBarTitleText}>
              {title}
            </Text>
          );
        }
      },
    };
  },
  render() {
    const { showTabBar } = this.props;
    return (
      <Navigator
        initialRoute={this.props.initialRoute}
        navigationBar={
          <Navigator.NavigationBar
            routeMapper={this.routeMapper()}
            style={styles.navBar}
          />
        }
        configureScene={this.configureScene}
        renderScene={this.renderScene}
        style={styles.container}
        onDidFocus={({component, props}) => {
          showTabBar && showTabBar(props.showTabBar !== false);
          const onDidFocus = component.onDidFocus || _.get(component, 'WrappedComponent.onDidFocus');
          if (onDidFocus) onDidFocus(props, this.props.dispatch);
        }}
      />
    );
  }
}));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scene: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 64 : 56, // NavigationBar
    backgroundColor: 'white',
  },
  navBar: {
    backgroundColor: '#1F3A4A',
  },
  navBarTitleText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginVertical: Platform.OS === 'ios' ? 9 : 15,
  },
  navBarButton: {
    marginVertical: Platform.OS === 'ios' ? 4 : 8,
    paddingLeft: 5,
    paddingRight: 5,
  },
});
