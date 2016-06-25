'use strict';

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import _ from 'lodash';

export default React.createClass({
  render() {
    const { order: { id, orderProducts, orderName }, status } = this.props;

    const badge = () => {
      if (status === 'new' && _.find(orderProducts, { status: 100 })) {
        return <View style={styles.badgeContainer}><Text style={styles.badgetText}>N</Text></View>;
      }
    }
    return (
      <View style={[styles.orderNumContainer, { backgroundColor: status === 'new' ? '#1F3A4A' : '#F2F2F2' }]}>
        <Text style={[styles.orderNumText, { color: status === 'new' ? 'white' : '#4C4C4C' }]}>링크#</Text>
        <Text style={[styles.orderNumText, { color: status === 'new' ? 'white' : '#4C4C4C' }]}>{orderName || _.padStart(id, 3, '0').substr(-3)}</Text>
        {badge()}
      </View>
    );
  }
});

const styles = StyleSheet.create({
  orderNumContainer: {
    alignItems: 'center',
    borderRadius: 30,
    height: 60,
    justifyContent: 'center',
    width: 60,
  },
  orderNumText: {
    fontSize: 12,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  },
  badgeContainer: {
    backgroundColor: '#FB6D21',
    width: 18,
    height: 18,
    borderRadius: 9,
    left: 42,
    top: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgetText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: 'white'
  },
});
