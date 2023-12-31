import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import EmployeeList from '../DetailList/EmployeeList';
import { host } from '../../../store';

import style from './ProjectDetail.module.css';

// ==================================================

const ProjectDetail = () => {
  const { projectId } = useParams();

  const [project, setProject] = useState({});

  useEffect(() => {
    axios
      .get(`${host}/api/admin/project/get-detail/${projectId}`, {
        withCredentials: true,
      })
      .then((res) => setProject(res.data))
      .catch((error) => console.log(error));
  }, [projectId]);

  return (
    <div className={style.container}>
      <h2>{project.name}</h2>

      <div className={style['content-container']}>
        <div className={style['control-container']}>
          <p className={style.label}>Category :</p>

          <span className={style.content}>{project.category?.name}</span>
        </div>

        <div className={style['control-container']}>
          <p className={style.label}>State :</p>

          <span className={style.content}>{project.projectState?.name}</span>
        </div>

        <div className={style['control-container']}>
          <p className={style.label}>Tech stack :</p>

          <span className={style.content}>
            {project.techStacks?.map((ts) => ts.name).join(', ')}
          </span>
        </div>
      </div>

      <EmployeeList data={project.employees} />
    </div>
  );
};

export default ProjectDetail;
