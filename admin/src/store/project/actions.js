import { projectActions } from './slice';
import axios from 'axios';

// ==================================================

export const getProjectData = () => {
  return async (dispatch) => {
    const response = await axios.get('/api/admin/project/get-active-list');

    const dataList = response.data.data.map((val, i) => {
      return { ...val, key: val._id, index: i + 1 };
    });

    return dispatch(
      projectActions.replaceProjectState({
        data: dataList,
        total: response.data.total,
      })
    );
  };
};
