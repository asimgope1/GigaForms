import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React, {Fragment} from 'react';
import TitleHeader from './TitleHeader';
import {MyStatusBar, WIDTH} from '../../constants/config';
import {DARKGREEN} from '../../constants/color';
import {splashStyles} from '../Splash/SplashStyles';

const FormsTemplates = ({navigation}) => {
  return (
    <Fragment>
      <MyStatusBar backgroundColor={DARKGREEN} barStyle="light-content" />
      <SafeAreaView style={[splashStyles.maincontainer]}>
        {/* back and page header */}
        <TitleHeader
          title="Forms Templates"
          left={WIDTH * 0.3}
          onPress={() => navigation.navigate('Forms')}
        />
      </SafeAreaView>
    </Fragment>
  );
};

export default FormsTemplates;

const styles = StyleSheet.create({});
