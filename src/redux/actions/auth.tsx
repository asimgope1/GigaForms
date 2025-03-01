import {getObjByKey} from '../../utils/Storage';
import {AUTH_STATUS} from '../types';

export const checkuserToken = () => {
  return async (
    dispatch: (action: {type: string; payload: boolean}) => void,
  ) => {
    getObjByKey('loginResponse').then(res => {
      res
        ? dispatch({
            type: AUTH_STATUS,
            payload: true,
          })
        : dispatch({
            type: AUTH_STATUS,
            payload: false,
          });
    });
  };
};
