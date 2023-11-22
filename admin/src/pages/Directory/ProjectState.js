import Header from '../../component/Layout/Main/Header';
import ProjectStateList from '../../component/Directory/ProjectState/ProjectStateList';

// ==================================================

const ProjectStatePage = () => {
  return (
    <>
      <Header title='Project state' linkTo='/new-project-state' />

      <ProjectStateList />
    </>
  );
};

export default ProjectStatePage;
