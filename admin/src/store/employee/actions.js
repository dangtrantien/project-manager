import { employeeActions } from './slice';
import axios from 'axios';

import { host } from '../index';

// ==================================================

export const getEmployeeData = () => {
  return async (dispatch) => {
    const response = await axios.get(
      `${host}/api/admin/employee/get-active-list`
    );

    const dataList = response.data.data.map((val, i) => {
      return { ...val, key: val._id, index: i + 1 };
    });

    return dispatch(
      employeeActions.replaceEmployeeState({
        data: dataList,
        total: response.data.total,
      })
    );
  };
};
