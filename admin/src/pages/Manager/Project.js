import Header from '../../component/Layout/Main/Header';
import ProjectList from '../../component/Manager/Project/ProjectList';

// ==================================================

const ProjectPage = () => {
  return (
    <>
      <Header title='Dự án' linkTo='/new-project' />

      <ProjectList />
    </>
  );
};

export default ProjectPage;
