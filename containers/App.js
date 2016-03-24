'use strict';

import React, {
  Navigator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { connect } from 'react-redux'

import routes from '../routes';
import NavBarBack from '../components/NavBarBack'

const NavigationBarRouteMapper = {
  LeftButton(route, navigator, index, navState) {
    if (index === 0) {
      return null;
    }

    const { title } = navState.routeStack[index - 1];
    return (<NavBarBack title={index > 1 && title} pop={navigator.pop}/>);
  },
  RightButton(route, navigator, index, navState) {
    return undefined;
  },
  Title(route, navigator, index, navState) {
    return (
      <Text style={[styles.navBarText, styles.navBarTitleText]}>
        {route.title}
      </Text>
    );
  },
};

export default React.createClass({
  renderScene(route, navigator) {
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
        navigationBar={
          <Navigator.NavigationBar
            routeMapper={NavigationBarRouteMapper}
            style={styles.navBar}
          />
        }
        renderScene={this.renderScene}
      />
    );
  }
});

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#EAEAEA',
  },
  navBar: {
    backgroundColor: 'white',
  },
  navBarText: {
    fontSize: 16,
    marginVertical: 10,
  },
  navBarTitleText: {
    color: '#373E4D',
    fontWeight: '500',
    marginVertical: 9,
  },
  navBarLeftButton: {
    paddingLeft: 10,
  },
  navBarRightButton: {
    paddingRight: 10,
  },
  navBarButtonText: {
    color: '#5890FF',
  },
});
