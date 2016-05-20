'use strict';

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Button from 'react-native-button';

export default React.createClass({
  getInitialState() {
    return { agreement: false, personalInfo: false };
  },
  render() {
    const { agreement, personalInfo } = this.state;
    // <Ionicons name='android-checkbox' size={30} color='#1fcbf6' />
    return (
      <View style={styles.container}>
        <View style={styles.title}>
          <Text style={styles.titleText}>약관동의</Text>
        </View>
        <View style={styles.main}>
          <View style={styles.desc}>
            <Text>링크샵의 서비스를 이용하기 위해서는</Text>
            <Text>'이용약관 동의'와 '개인정보 수집방침 동의'가 필수입니다.</Text>
          </View>
          <View style={styles.buttonBox}>
            <Button
              onPress={() => this.setState({ agreement: !agreement })}
              containerStyle={styles.button}
            >
              <Ionicons name='android-checkbox' size={30} color={agreement ? '#1fcbfb' : 'grey' } />
              <Text style={styles.buttonText}>이용약관 동의</Text>
            </Button>
            <Button style={styles.detailText}>내용보기</Button>
          </View>
          <View style={styles.buttonBox}>
            <Button
              onPress={() => this.setState({ personalInfo: !personalInfo })}
              containerStyle={styles.button}
            >
              <Ionicons name='android-checkbox' size={30} color={personalInfo ? '#1fcbfb' : 'grey' } />
              <Text style={styles.buttonText}>개인정보 수집방침 동의</Text>
            </Button>
            <Button style={styles.detailText}>내용보기</Button>
          </View>
        </View>
      </View>
    );
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    paddingTop: 20, // FIXME: StatusBar iOS
  },
  title: {
    height: 44,
    justifyContent: 'center',
    alignSelf: 'stretch',
    alignItems: 'center',
    backgroundColor: '#3f4c5d',
  },
  titleText: {
    color: 'white',
    fontWeight: 'bold',
  },
  main: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  desc: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  buttonBox: {
    backgroundColor: 'white',
    alignItems: 'center',
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 50,
    marginVertical: 2,
    marginHorizontal: 10,
  },
  button: {
    marginLeft: 10,
  },
  buttonText: {
    marginHorizontal: 10,
    fontWeight: 'bold',
  },
  detailText: {
    fontSize: 12,
    marginHorizontal: 10,
    color: 'grey',
  },
});
