import * as React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {checkuserToken} from '../redux/actions/auth';
import HomeStack from './HomeStack';
import LoginStack from './LoginStack';

const Appnavigator = () => {
  const dispatch = useDispatch();
  dispatch(checkuserToken());
  const authStatus = useSelector(
    (state: {authStatus: boolean}) => state.authStatus,
  );
  return authStatus ? <HomeStack /> : <LoginStack />;
};

export default Appnavigator;
