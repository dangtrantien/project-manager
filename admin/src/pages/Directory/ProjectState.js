import Header from '../../component/Layout/Main/Header';
import ProjectStateList from '../../component/Directory/ProjectState/ProjectStateList';

// ==================================================

const ProjectStatePage = () => {
  return (
    <>
      <Header title='Trạng thái dự án' linkTo='/new-project-state' />

      <ProjectStateList />
    </>
  );
};

export default ProjectStatePage;
