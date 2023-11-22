import Header from '../../component/Layout/Main/Header';
import ProjectList from '../../component/Manager/Project/ProjectList';

// ==================================================

const ProjectPage = () => {
  return (
    <>
      <Header title='Project' linkTo='/new-project' />

      <ProjectList />
    </>
  );
};

export default ProjectPage;
