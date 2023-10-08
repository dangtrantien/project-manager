import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import EmployeeList from '../DetailList/EmployeeList';
import ProjectList from '../DetailList/ProjectList';
import { host } from '../../../store';

import style from './DepartmentDetail.module.css';

// ==================================================

const DepartmentDetail = () => {
  const { departmentId } = useParams();

  const [department, setDepartment] = useState({});

  useEffect(() => {
    axios
      .get(`${host}/api/admin/department/get-detail/${departmentId}`)
      .then((res) => setDepartment(res.data))
      .catch((error) => console.log(error));
  }, [departmentId]);

  return (
    <div className={style.container}>
      <h2>{department.name}</h2>

      <div className={style['content-container']}>
        <div className={style['control-container']}>
          <p className={style.label}>Nhiệm vụ :</p>

          <span className={style.content}>{department.mission}</span>
        </div>

        <div className={style['control-container']}>
          <p className={style.label}>Tech stack :</p>

          <span className={style.content}>
            {department.techStacks?.map((ts) => ts.name).join(', ')}
          </span>
        </div>
      </div>

      <EmployeeList data={department.employees} />

      <ProjectList data={department.projects} />
    </div>
  );
};

export default DepartmentDetail;
