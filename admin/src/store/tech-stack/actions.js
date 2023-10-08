import { techStackActions } from './slice';
import axios from 'axios';

import { host } from '../index';

// ==================================================

export const getTechStackData = () => {
  return async (dispatch) => {
    const response = await axios.get(
      `${host}/api/admin/tech-stack/get-active-list`
    );

    const dataList = response.data.data.map((val, i) => {
      return { ...val, key: val._id, index: i + 1 };
    });

    return dispatch(
      techStackActions.replaceTechStackState({
        data: dataList,
        total: response.data.total,
      })
    );
  };
};
