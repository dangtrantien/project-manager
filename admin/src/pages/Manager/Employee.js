import Header from '../../component/Layout/Main/Header';
import EmployeeList from '../../component/Manager/Employee/EmployeeList';

// ==================================================

const EmployeePage = () => {
  return (
    <>
      <Header title='Nhân sự' linkTo='/new-employee' />

      <EmployeeList />
    </>
  );
};

export default EmployeePage;
