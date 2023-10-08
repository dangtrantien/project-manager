import { useState, useEffect, useCallback } from 'react';
import { Space, Spin } from 'antd';
import { Pie, Column } from '@ant-design/plots';
import axios from 'axios';

import { host } from '../../../store';

import style from './TotalEmployeeChart.module.css';
import { LoadingOutlined } from '@ant-design/icons';

// ==================================================

const TotalEmployeeChart = () => {
  const [experienceData, setExperienceData] = useState([]);
  const [techStackData, setTechStackData] = useState([]);
  const [joinedProjectData, setJoinedProjectData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getData = useCallback(async () => {
    setLoading(true);

    const experience = await axios.get(
      `${host}/api/admin/report/employee/experience`,
      {
        withCredentials: true,
      }
    );

    const techStack = await axios.get(
      `${host}/api/admin/report/employee/tech-stack`,
      {
        withCredentials: true,
      }
    );

    const joinedProject = await axios.get(
      `${host}/api/admin/report/employee/joined-project`,
      {
        withCredentials: true,
      }
    );

    setExperienceData(experience.data);
    setTechStackData(techStack.data);
    setJoinedProjectData(joinedProject.data);
    setLoading(false);
  }, []);

  const configExperience = {
    appendPadding: 10,
    data: experienceData,
    colorField: 'type',
    angleField: 'tổng nhân viên',
    label: {
      type: 'inner',
      offset: '-30%',
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    interactions: [
      {
        type: 'pie-legend-active',
      },
      {
        type: 'element-active',
      },
    ],
  };

  const configTechStack = {
    data: techStackData,
    xField: 'type',
    yField: 'tổng nhân viên',
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
  };

  const configJoinedProject = {
    data: joinedProjectData,
    xField: 'type',
    yField: 'tổng nhân viên',
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
  };

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <Space direction='vertical' size={50}>
      <Space direction='vertical' size='large' style={{ width: '100%' }}>
        <h3>Số lượng nhân sự với mỗi loại kinh nghiệm</h3>

        {loading && (
          <Spin
            tip='Loading...'
            indicator={
              <LoadingOutlined
                style={{
                  fontSize: 24,
                }}
                spin
              />
            }
          >
            <div className='content' />
          </Spin>
        )}

        <div className={style['experience-container']}>
          <Pie {...configExperience} />
        </div>
      </Space>

      <Space direction='vertical' size='large' style={{ width: '100%' }}>
        <h3>Số lượng nhân sự với mỗi loại tech stack sử dụng</h3>

        {loading && (
          <Spin
            tip='Loading...'
            indicator={
              <LoadingOutlined
                style={{
                  fontSize: 24,
                }}
                spin
              />
            }
          >
            <div className='content' />
          </Spin>
        )}

        <Column {...configTechStack} />
      </Space>

      <Space direction='vertical' size='large' style={{ width: '100%' }}>
        <h3>Số lượng nhân sự tham gia dự án</h3>

        {loading && (
          <Spin
            tip='Loading...'
            indicator={
              <LoadingOutlined
                style={{
                  fontSize: 24,
                }}
                spin
              />
            }
          >
            <div className='content' />
          </Spin>
        )}

        <Column {...configJoinedProject} />
      </Space>
    </Space>
  );
};

export default TotalEmployeeChart;
