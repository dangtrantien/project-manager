import Header from '../../component/Layout/Main/Header';
import TechStackList from '../../component/Directory/TechStack/TechStackList';

// ==================================================

const TechStackPage = () => {
  return (
    <>
      <Header title='Tech stack' linkTo='/new-tech-stack' />

      <TechStackList />
    </>
  );
};

export default TechStackPage;
