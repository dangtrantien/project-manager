import Header from '../../component/Layout/Main/Header';
import CategoryList from '../../component/Directory/Dashboard/CategoryList';

// ==================================================

const DashboardPage = () => {
  return (
    <>
      <Header title='Loại dự án' linkTo='/new-category' />

      <CategoryList />
    </>
  );
};

export default DashboardPage;
