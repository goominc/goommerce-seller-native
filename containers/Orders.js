'use strict';

import React, {
  StyleSheet,
  View,
} from 'react-native';
import Button from 'react-native-button';

import OrderList from './OrderList';

export default React.createClass({
  getInitialState() {
    return { activeStatus: 'new' };
  },
  render() {
    const { activeStatus } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.statusContainer}>
          <Button
            style={activeStatus === 'new' ? styles.activeStatus : styles.inactiveStatus}
            onPress={() => this.setState({ activeStatus: 'new' })}
          >
            신규주문
          </Button>
          <Button
            style={activeStatus === 'pending' ? styles.activeStatus : styles.inactiveStatus}
            onPress={() => this.setState({ activeStatus: 'pending' })}
          >
            출고대기
          </Button>
          <Button
            style={activeStatus === 'settled' ? styles.activeStatus : styles.inactiveStatus}
            onPress={() => this.setState({ activeStatus: 'settled' })}
          >
            정산완료
          </Button>
        </View>
        <OrderList key={activeStatus} status={activeStatus} {...this.props} />
      </View>
    );
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#3f4c5d',
    paddingVertical: 5,
  },
  activeStatus: {
    color: '#23bcee',
  },
  inactiveStatus: {
    color: 'white',
  },
});
