'use strict';

import React from 'react';
import { ListView, StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { orderActions } from 'goommerce-redux';
import Button from 'react-native-button';
import _ from 'lodash';
import moment from 'moment';
import numeral from 'numeral';
import DatePicker from 'react-native-datepicker';

import OrderCell from '../components/OrderCell';
import RefreshableList from '../components/RefreshableList';
import routes from '../routes';

const Settled = React.createClass({
  dataSource: new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
  }),
  componentDidMount() {
    const { loadBrandOrders, brandId } = this.props;
    loadBrandOrders(brandId, 'settled');
  },
  getInitialState() {
    const now = moment();
    return {
      start: now.startOf('month').format('YYYY.MM.DD'),
      end: now.endOf('month').format('YYYY.MM.DD'),
      showSelector: false,
    };
  },
  renderRow({ orders, date }, sectionID, rowID, highlightRow) {
    function onSelect() {
      push(routes.order(title, { brandId, orderId: order.id }));
    }

    return (
      <View style={{ flexDirection: 'row', paddingVertical: 15, justifyContent: 'space-between' }}>
        <Text style={styles.rowText}>{date}</Text>
        <Text style={[styles.rowText, { flex: 1 }]}>총 {numeral(_.size(orders)).format('0,0')}개의 주문</Text>
        <Text style={[styles.rowText, { fontWeight: 'bold' }]}>{numeral(_.sumBy(orders, (o) => _.toInteger(o.settledKRW))).format('0,0')}원</Text>
      </View>
    );
  },
  renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    var style = styles.rowSeparator;
    if (adjacentRowHighlighted) {
        style = [style, styles.rowSeparatorHide];
    }
    return (
      <View key={'SEP_' + sectionID + '_' + rowID}  style={style}/>
    );
  },
  renderRange() {
    const { start, end, showSelector } = this.state;
    if (showSelector) {
      return (
        <View style={{ flexDirection: 'row', padding: 10 }}>
          <Text>조회기간 설정</Text>
          <View style={{ flexDirection: 'column' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <DatePicker
                customStyles={{
                  dateIcon: {
                    width: 0,
                    height: 0,
                  },
                }}
                style={{ width: null }}
                date={start}
                mode='date'
                format='YYYY.MM.DD'
                confirmBtnText='확인'
                cancelBtnText='취소'
                onDateChange={(start) => {this.setState({ start })}}
              />
              <DatePicker
                customStyles={{
                  dateIcon: {
                    width: 0,
                    height: 0,
                  },
                }}
                style={{ width: null }}
                date={end}
                mode='date'
                format='YYYY.MM.DD'
                confirmBtnText='확인'
                cancelBtnText='취소'
                onDateChange={(end) => {this.setState({ end })}}
              />
              <Button>조회</Button>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Button>하루전</Button>
              <Button>이번달</Button>
              <Button>지난달</Button>
            </View>
          </View>
          <Button>X</Button>
        </View>
      );
    }
    return (
      <View style={{ flexDirection: 'column', padding: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text>{start} - {end}</Text>
          <Button onPress={() => this.setState({ showSelector: true })}>조회기간변경</Button>
        </View>
        <View style={{ height: 1, backgroundColor: 'red' }}/>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text>정산금액(VAT포함)</Text>
          <Text style={[{ fontWeight: 'bold' }]}>{numeral(_.sumBy(this.props.orders, (o) => _.toInteger(o.settledKRW))).format('0,0')}원</Text>
        </View>
      </View>
    );
  },
  render() {
    const rows = _.chain(this.props.orders)
      .groupBy((o) => moment(o.orderedAt).format('YYYY.MM.DD'))
      .map((orders, date) => ({ orders, date }))
      .orderBy('date', 'desc').value();
    // FIXME: possible performance issue...
    const dataSource = this.dataSource.cloneWithRows(rows);
    return (
      <View>
        {this.renderRange()}
        <RefreshableList
          dataSource={dataSource}
          renderRow={this.renderRow}
          renderSeparator={this.renderSeparator}
          onRefresh={this.props.onRefresh}
          enableEmptySections
        />
      </View>
    );
  },
});

const styles = StyleSheet.create({
  rowSeparator: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: 1,
    marginLeft: 4,
  },
  rowSeparatorHide: {
    opacity: 0.0,
  },
  rowText: {
    color: '#4B4B4B',
    marginHorizontal: 7,
  },
});

export default connect((state, ownProps) => {
  const { key } = orderActions.loadBrandOrders(ownProps.brandId, 'settled');
  return { orders: _.get(state.order[key], 'list') };
}, orderActions)(Settled);
