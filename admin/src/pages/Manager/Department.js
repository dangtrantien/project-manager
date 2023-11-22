import Header from '../../component/Layout/Main/Header';
import DepartmentList from '../../component/Manager/Department/DepartmentList';

// ==================================================

const DepartmentPage = () => {
  return (
    <>
      <Header title='Department' linkTo='/new-department' />

      <DepartmentList />
    </>
  );
};

export default DepartmentPage;
