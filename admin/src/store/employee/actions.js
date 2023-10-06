import { employeeActions } from './slice';
import axios from 'axios';

// ==================================================

export const getEmployeeData = () => {
  return async (dispatch) => {
    const response = await axios.get('/api/admin/employee/get-active-list');

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
