import React from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit';
import rootReducer from '../redux/reducers/index';
import Appnavigator from './Appnavigator';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {BOLD} from '../constants/fontfamily';

const store = configureStore({reducer: rootReducer});

// Custom Toast Configuration
const toastConfig = {
  success: props => (
    <BaseToast
      {...props}
      style={{borderLeftColor: 'green', borderLeftWidth: 5}}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontSize: RFPercentage(2),
        fontStyle: BOLD,
      }}
    />
  ),
  error: props => (
    <ErrorToast
      {...props}
      style={{borderLeftColor: 'red', borderLeftWidth: 5}}
      text1Style={{
        fontSize: RFPercentage(2),
        fontStyle: BOLD,
      }}
      text2Style={{
        fontSize: RFPercentage(2),
        fontStyle: BOLD,
      }}
    />
  ),
};

const Navigation = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Appnavigator />
        </NavigationContainer>
        <Toast config={toastConfig} />
      </SafeAreaProvider>
    </Provider>
  );
};

export default Navigation;
