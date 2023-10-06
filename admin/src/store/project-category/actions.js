import { projectCategoryActions } from './slice';
import axios from 'axios';

// ==================================================

export const getCategoryData = () => {
  return async (dispatch) => {
    const response = await axios.get(
      '/api/admin/project-category/get-active-list'
    );

    const dataList = response.data.data.map((val, i) => {
      return { ...val, key: val._id, index: i + 1 };
    });

    return dispatch(
      projectCategoryActions.replaceCategoryState({
        data: dataList,
        total: response.data.total,
      })
    );
  };
};
