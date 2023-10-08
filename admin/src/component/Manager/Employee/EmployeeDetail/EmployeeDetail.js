import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, Space, Tabs } from 'antd';
import axios from 'axios';

import Profile from './Profile';
import ProjectList from '../../DetailList/ProjectList';
import { host } from '../../../../store';

import style from './EmployeeDetail.module.css';

// ==================================================

const EmployeeDetail = () => {
  const { employeeId } = useParams();

  const [employee, setEmployee] = useState({});

  useEffect(() => {
    axios
      .get(`${host}/api/admin/employee/get-detail/${employeeId}`, {
        withCredentials: true,
      })
      .then((res) => setEmployee(res.data))
      .catch((error) => console.log(error));
  }, [employeeId]);

  return (
    <>
      <div className={style.heading}>
        <Avatar
          size={{
            xs: 64,
            sm: 80,
            md: 80,
            lg: 100,
            xl: 120,
          }}
          src={employee.avatar}
          alt={employee.fullName}
        />

        <Space direction='vertical'>
          <h2>{employee.fullName}</h2>

          <span className={style.experience}>{employee.experience}</span>
        </Space>
      </div>

      <Tabs
        defaultActiveKey='1'
        centered
        items={[
          {
            label: 'Thông tin cá nhân',
            key: 1,
            children: <Profile data={employee} />,
          },
          {
            label: 'Dự án tham gia',
            key: 2,
            children: <ProjectList data={employee.projects} />,
          },
        ]}
      />
    </>
  );
};

export default EmployeeDetail;
