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
import OrderStatCell from '../components/OrderStatCell';
import routes from '../routes';

const OrderStats = React.createClass({
  componentDidMount() {
    this.props.loadBrandOrderStats(this.props.brandId);
  },
  dataSource: new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
  }),
  renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    var style = styles.rowSeparator;
    if (adjacentRowHighlighted) {
        style = [style, styles.rowSeparatorHide];
    }
    return (
      <View key={'SEP_' + sectionID + '_' + rowID}  style={style}/>
    );
  },
  renderRow(stat, sectionID, rowID, highlightRow) {
    const { brandId, push } = this.props;
    const date = (stat.date && stat.date.substr(0, 10)) || 'EMPTY';
    return  (
      <OrderStatCell
        key={date}
        stat={stat}
        onHighlight={() => highlightRow(sectionID, rowID)}
        onUnhighlight={() => highlightRow(null, null)}
        onSelect={() => push(routes.orders({ brandId, date }))}
      />
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
        renderRow={this.renderRow}
        renderSeparator={this.renderSeparator}
      />
    );
  }
});

const styles = StyleSheet.create({
  date: {
    fontSize: 25,
    marginBottom: 8,
    textAlign: 'center',
  },
  row: {
    padding: 5,
  },
  rowSeparator: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: 1,
    marginLeft: 4,
  },
  rowSeparatorHide: {
    opacity: 0.0,
  },
});

export default connect(
  (state, ownProps) => {
    const { brandId } = ownProps;
    const { key } = orderActions.loadBrandOrderStats(brandId);
    return { stats: state.order[key] };
  }, orderActions
)(OrderStats);
