import { departmentActions } from './slice';
import axios from 'axios';

import { host } from '../index';

// ==================================================

export const getDepartmentData = () => {
  return async (dispatch) => {
    const response = await axios.get(
      `${host}/api/admin/department/get-active-list`
    );

    const dataList = response.data.data.map((val, i) => {
      return { ...val, key: val._id, index: i + 1 };
    });

    return dispatch(
      departmentActions.replaceDepartmentState({
        data: dataList,
        total: response.data.total,
      })
    );
  };
};
