'use strict';

import React, {
  ListView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { connect } from 'react-redux'
import { orderActions } from 'goommerce-redux';

import EmptyView from '../components/EmptyView';
import routes from '../routes';

const OrderStats = React.createClass({
  componentDidMount() {
    this.props.loadBrandOrderStats(this.props.brandId);
  },
  dataSource: new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
  }),
  renderStat(stat) {
    const { brandId } = this.props;
    const date = stat.data && stat.date.substr(0, 10);
    return  (
      <View onPress={() => push(routes.list({ brandId, date }))}>
        <Text style={styles.date}>Date: {date}</Text>
        <Text style={styles.count}>Count: {stat.count}</Text>
      </View>
    );
  },
  render() {
    const { stats } = this.props;
    if (!stats) {
      return <EmptyView text='Loading...' />;
    }
    if (!stats.length) {
      return <EmptyView text='No orders...' />;
    }
    const dataSource = this.dataSource.cloneWithRows(stats);
    return (
      <ListView
        dataSource={dataSource}
        renderRow={this.renderStat}
        style={styles.listView}
      />
    );
  }
});

const styles = StyleSheet.create({
  date: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  count: {
    textAlign: 'center',
  },
  listView: {
    backgroundColor: '#F5FCFF',
  },
});

export default connect(
  (state, ownProps) => {
    const { brandId } = ownProps;
    const { key } = orderActions.loadBrandOrderStats(brandId);
    return { stats: state.order[key] };
  }, orderActions
)(OrderStats);
