import { projectStateActions } from './slice';
import axios from 'axios';

// ==================================================

export const getProjectStateData = () => {
  return async (dispatch) => {
    const response = await axios.get(
      '/api/admin/project-state/get-active-list'
    );

    const dataList = response.data.data.map((val, i) => {
      return { ...val, key: val._id, index: i + 1 };
    });

    return dispatch(
      projectStateActions.replaceProjectStateState({
        data: dataList,
        total: response.data.total,
      })
    );
  };
};
