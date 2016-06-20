'use strict';

import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import Button from 'react-native-button';
import { connect } from 'react-redux'
import { authActions } from 'goommerce-redux';

import Icon from '../components/Icon';
import TermsAndConditions from '../components/TermsAndConditions';
import PersonalInfomation from '../components/PersonalInfomation';

const Agreement = React.createClass({
  getInitialState() {
    return {
      termsAndConditions: false,
      showTermsAndConditions: false,
      personalInfo: false,
      showPersonalInfo: false,
    };
  },
  render() {
    const { termsAndConditions, personalInfo } = this.state;
    if (this.state.showTermsAndConditions) {
      return (
        <View style={styles.container}>
          <View style={styles.title}>
            <Text style={styles.titleText}>이용약관</Text>
          </View>
          <TermsAndConditions style={{ backgroundColor: 'white' }}/>
          <View style={styles.popupButtonBox}>
            <Button
              containerStyle={styles.popupButton}
              style={styles.confirmText}
              onPress={() => this.setState({ showTermsAndConditions: false })}
            >
              확인
            </Button>
          </View>
        </View>
      );
    }
    if (this.state.showPersonalInfo) {
      return (
        <View style={styles.container}>
          <View style={styles.title}>
            <Text style={styles.titleText}>이용약관</Text>
          </View>
          <PersonalInfomation style={{ backgroundColor: 'white' }}/>
          <View style={styles.popupButtonBox}>
            <Button
              containerStyle={styles.popupButton}
              style={styles.confirmText}
              onPress={() => this.setState({ showPersonalInfo: false })}
            >
              확인
            </Button>
          </View>
        </View>
      );
    }
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
              onPress={() => this.setState({ termsAndConditions: !termsAndConditions })}
              containerStyle={styles.button}
            >
              <Icon name='checkbox' size={30} color={termsAndConditions ? '#1fcbfb' : 'grey' } />
              <Text style={styles.buttonText}>이용약관 동의</Text>
            </Button>
            <Button
              style={styles.detailText}
              onPress={() => this.setState({ showTermsAndConditions: true })}
            >
              내용보기
            </Button>
          </View>
          <View style={styles.buttonBox}>
            <Button
              onPress={() => this.setState({ personalInfo: !personalInfo })}
              containerStyle={styles.button}
            >
              <Icon name='checkbox' size={30} color={personalInfo ? '#1fcbfb' : 'grey' } />
              <Text style={styles.buttonText}>개인정보 수집방침 동의</Text>
            </Button>
            <Button
              style={styles.detailText}
              onPress={() => this.setState({ showPersonalInfo: true })}
            >
              내용보기
            </Button>
          </View>
          <Button
            containerStyle={styles.confirmButton}
            style={styles.confirmText}
            onPress={() => {
              if (!this.state.termsAndConditions) {
                Alert.alert('이용약관을 동의해 주세요.');
              } else if (!this.state.personalInfo) {
                Alert.alert('개인정보 수집방침을 동의해 주세요.');
              } else {
                this.props.updateAgreements({ seller: 1, personalInfomation: 1 });
              }
            }}
          >
            약관 동의하기
          </Button>
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
  confirmButton: {
    backgroundColor: '#1fcbf6',
    borderRadius: 6,
    marginTop: 20,
    overflow:'hidden',
    paddingHorizontal: 60,
    paddingVertical: 10,
  },
  confirmText: {
    color: 'white',
  },
  popupButtonBox: {
    height: 60,
    justifyContent: 'center',
    alignSelf: 'stretch',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  popupButton: {
    backgroundColor: '#1fcbf6',
    borderRadius: 6,
    overflow:'hidden',
    paddingHorizontal: 60,
    paddingVertical: 10,
  },
});

export default connect(
  (state) => ({ auth: state.auth }) , authActions
)(Agreement);
