'use strict';

import React from 'react';
import { Navigator, ListView, Platform, StyleSheet, Text, TouchableHighlight, TouchableNativeFeedback, View } from 'react-native';
import { connect } from 'react-redux';
import { orderActions } from 'goommerce-redux';
import Button from 'react-native-button';
import _ from 'lodash';
import moment from 'moment';
import numeral from 'numeral';
import DatePicker from 'react-native-datepicker';
import * as Animatable from 'react-native-animatable';

import Icon from '../components/Icon';
import OrderCell from '../components/OrderCell';
import RefreshableList from '../components/RefreshableList';
import routes from '../routes';

const TouchableElement = Platform.OS === 'android' ? TouchableNativeFeedback : TouchableHighlight;

const Settled = React.createClass({
  statics: {
    rightButton: ({ route, navigator }) => {
      return (
        <Button
          style={{ fontSize: 11, color: 'white', margin: 5, paddingVertical: 2 }}
          containerStyle={{ marginTop: Platform.OS === 'android' ? 5 : 3 }}
          onPress={() => navigator.push(routes.awaiting(_.assign({}, route.props, {
            showTabBar: false,
            sceneConfig: Navigator.SceneConfigs.VerticalDownSwipeJump,
          })))}
        >
          입금대기내역
        </Button>
      );
    },
  },
  dataSource: new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
  }),
  componentDidMount() {
    this.onRefresh();
  },
  getInitialState() {
    const now = moment();
    return {
      start: now.startOf('month').format('YYYY.MM.DD'),
      end: now.endOf('month').format('YYYY.MM.DD'),
      showSelector: false,
    };
  },
  onRefresh(hideSelector) {
    const { loadBrandOrders, brandId } = this.props;
    loadBrandOrders(brandId, 'settled', {
      start: moment(this.state.start, 'YYYY.MM.DD').format('YYYY-MM-DD'),
      end: moment(this.state.end, 'YYYY.MM.DD').format('YYYY-MM-DD'),
    }).then(() => hideSelector && this.refs.selector.bounceOutUp());
  },
  renderRow({ orders, date }, sectionID, rowID, highlightRow) {
    const { brandId, push } = this.props;
    return (
      <TouchableElement
        onPress={() => push(routes.settledOrders(`${date} 주문내역`, { orders, brandId }))}
        onShowUnderlay={() => highlightRow(sectionID, rowID)}
        onHideUnderlay={() => highlightRow(null, null)}
      >
        <View style={styles.rowContainer}>
          <Text style={styles.rowText}>{date}</Text>
          <Text style={[styles.rowText, { flex: 1, marginHorizontal: 12 }]}>총 {numeral(_.size(orders)).format('0,0')}개의 주문</Text>
          <Text style={styles.rowPriceText}>{numeral(_.sumBy(orders, (o) => _.toInteger(o.settledKRW))).format('0,0')}원</Text>
          <Icon name='ios-arrow-forward' size={17} color='#999999' style={{ marginLeft: 12 }}/>
        </View>
      </TouchableElement>
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
  renderDatePicker(props) {
    return (
      <DatePicker
        {...props}
        customStyles={{
          dateInput: styles.button,
          dateTouchBody: { height: null },
          dateText: styles.headerText,
        }}
        showIcon={false}
        style={{ width: null, flex: 1 }}
        mode='date'
        format='YYYY.MM.DD'
        confirmBtnText='확인'
        cancelBtnText='취소'
      />
    );
  },
  renderSelector() {
    const { start, end } = this.state;
    return (
      <Animatable.View style={styles.selectorContainer} animation='bounceInDown' ref='selector'>
        <View style={styles.headerContainer}>
          <View style={styles.headerRow}>
            <Text style={[styles.selectorFirstColumn, { fontSize: 11, fontWeight: 'bold', fontColor: '#4C4C4C' }]}>
              조회기간 설정
            </Text>
            {this.renderDatePicker({ date: start, onDateChange: (start) => {this.setState({ start })} })}
            <Text style={[styles.headerText, { marginHorizontal: 4 }]}>-</Text>
            {this.renderDatePicker({ date: end, onDateChange: (end) => {this.setState({ end })} })}
            <Button
              style={{color: 'white', fontSize: 12 }}
              containerStyle={{
                backgroundColor: '#1fcbf6',
                borderRadius: 3,
                padding: 4,
                marginLeft: 4,
                marginRight: 2,
              }}
              onPress={() => this.onRefresh(true)}
            >
              조회
            </Button>
            <View style={styles.selectorLastColumn}>
              <Button onPress={() => this.refs.selector.bounceOutUp()}>
                <Icon name='close' size={23} style={{ padding: 4 }}/>
              </Button>
            </View>
          </View>
          <View style={[styles.headerRow, { marginTop: 0 }]}>
            <View style={styles.selectorFirstColumn} />
            <Button
              style={styles.headerText}
              containerStyle={[styles.button, { flex: 1 }]}
              onPress={() => {
                const at = moment().subtract(1, 'd');
                this.setState({
                  start: at.format('YYYY.MM.DD'),
                  end: at.format('YYYY.MM.DD'),
                });
                this.onRefresh(true);
              }}
            >
              하루전
            </Button>
            <Button
              style={styles.headerText}
              containerStyle={[styles.button, { flex: 1 }]}
              onPress={() => {
                const at = moment();
                this.setState({
                  start: at.startOf('month').format('YYYY.MM.DD'),
                  end: at.endOf('month').format('YYYY.MM.DD'),
                });
                this.onRefresh(true);
              }}
            >
              이번달
            </Button>
            <Button
              style={styles.headerText}
              containerStyle={[styles.button, { flex: 1 }]}
              onPress={() => {
                const at = moment().subtract(1, 'months');
                this.setState({
                  start: at.startOf('month').format('YYYY.MM.DD'),
                  end: at.endOf('month').format('YYYY.MM.DD'),
                });
                this.onRefresh(true);
              }}
            >
              지난달
            </Button>
            <View style={styles.selectorLastColumn} />
          </View>
        </View>
      </Animatable.View>
    );
  },
  renderRange() {
    const { start, end, showSelector } = this.state;
    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.headerText}>{start} - {end}</Text>
          <Button
            style={[styles.headerText, { color: 'white', fontWeight: 'bold' }]}
            containerStyle={{
              backgroundColor: '#1fcbf6',
              borderRadius: 12,
              padding: 6,
            }}
            onPress={() => {
              if (showSelector) {
                this.refs.selector.bounceInDown();
              } else {
                this.setState({ showSelector: true });
              }
            }}
          >
            조회기간변경
          </Button>
        </View>
        <View style={{ height: 1, backgroundColor: '#E7E7E7' }}/>
        <View style={styles.headerRow}>
          <Text style={styles.boldOrange}>정산금액(VAT포함)</Text>
          <Text style={styles.boldOrange}>{numeral(_.sumBy(this.props.orders, (o) => _.toInteger(o.settledKRW))).format('0,0')}원</Text>
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
      <View style={{ flexDirection: 'column', flex: 1 }}>
        {this.renderRange()}
        <RefreshableList
          dataSource={dataSource}
          renderRow={this.renderRow}
          renderSeparator={this.renderSeparator}
          onRefresh={this.onRefresh}
          enableEmptySections
        />
        {this.state.showSelector && this.renderSelector()}
      </View>
    );
  },
});

const styles = StyleSheet.create({
  rowSeparator: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: 1,
  },
  rowSeparatorHide: {
    opacity: 0.0,
  },
  rowContainer: {
    height: 90,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingHorizontal: 12,
  },
  rowText: {
    fontSize: 11,
    color: '#4C4C4C',
  },
  rowPriceText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4C4C4C',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 7,
  },
  headerContainer: {
    flexDirection: 'column',
    paddingHorizontal: 10,
    backgroundColor: '#F7F7F7',
    height: 90,
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 11,
    color: '#999999',
  },
  boldOrange: {
    fontSize: 12,
    color: '#ff6c00',
    fontWeight: 'bold',
  },
  button: {
    borderWidth: 1,
    borderRadius: 3,
    borderColor: '#D9D9D9',
    padding: 4,
    height: null,
    marginHorizontal: 2,
  },
  selectorContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  selectorFirstColumn: {
    width: 70,
  },
  selectorLastColumn: {
    width: Platform.OS === 'ios' ? 20 : 25,
    alignItems: 'flex-end',
    justifyContent: 'center',
  }
});

export default connect((state, ownProps) => {
  const { key } = orderActions.loadBrandOrders(ownProps.brandId, 'settled');
  return { orders: _.get(state.order[key], 'list') };
}, orderActions)(Settled);
