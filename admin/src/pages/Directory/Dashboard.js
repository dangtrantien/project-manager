import Header from '../../component/Layout/Main/Header';
import CategoryList from '../../component/Directory/Dashboard/CategoryList';

// ==================================================

const DashboardPage = () => {
  return (
    <>
      <Header title='Project category' linkTo='/new-category' />

      <CategoryList />
    </>
  );
};

export default DashboardPage;
