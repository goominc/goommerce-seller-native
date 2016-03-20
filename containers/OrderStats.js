'use strict';

import React, {
  ListView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { connect } from 'react-redux'
import { orderActions } from 'goommerce-redux';

const OrderStats = React.createClass({
  componentDidMount() {
    this.props.loadBrandOrderStats(this.props.brandId);
  },
  dataSource: new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
  }),
  renderStat(stat) {
    const { date, count } = stat;
    return  (
      <View>
        <Text style={styles.title}>Date: {date && date.substr(0, 10)}</Text>
        <Text style={styles.year}>Count: {count}</Text>
      </View>
    );
  },
  render() {
    const { stats } = this.props;
    if (!stats) {
      return (
        <View>
          <Text>
            Loading...
          </Text>
        </View>
      );
    }
    if (!stats.length) {
      return (
        <View>
          <Text>
            No orders...
          </Text>
        </View>
      );
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
  title: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  year: {
    textAlign: 'center',
  },
  listView: {
    paddingTop: 20,
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
