import * as React from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit';
import rootReducer from '../redux/reducers/index';
import Appnavigator from './Appnavigator';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const store = configureStore({reducer: rootReducer});
const Navigation = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Appnavigator />
      </NavigationContainer>
    </Provider>
  );
};
export default Navigation;
