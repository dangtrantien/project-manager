import { useState, useEffect, useCallback } from 'react';
import { DatePicker, Space, Spin } from 'antd';
import { Column } from '@ant-design/plots';
import dayjs from 'dayjs';
import axios from 'axios';

import { host } from '../../../store';

import { LoadingOutlined } from '@ant-design/icons';

// ==================================================

const TotalProjectChart = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [projectStateData, setProjectStateData] = useState([]);
  const [techStackData, setTechStackData] = useState([]);
  const [year, setYear] = useState('2023');
  const [loading, setLoading] = useState(false);

  const getData = useCallback(async () => {
    setLoading(true);

    const category = await axios.get(
      `${host}/api/admin/report/project/category?year=${year}`,
      {
        withCredentials: true,
      }
    );

    const projectState = await axios.get(
      `${host}/api/admin/report/project/project-state?year=${year}`,
      {
        withCredentials: true,
      }
    );

    const techStack = await axios.get(
      `${host}/api/admin/report/project/tech-stack?year=${year}`,
      {
        withCredentials: true,
      }
    );

    setCategoryData(category.data);
    setProjectStateData(projectState.data);
    setTechStackData(techStack.data);
    setLoading(false);
  }, [year]);

  const configCategory = {
    data: categoryData,
    isStack: true,
    xField: 'month',
    yField: 'tổng dự án',
    seriesField: 'type',
    legend: {
      layout: 'horizontal',
      position: 'top',
      flipPage: true,
      maxRow: 2,
      pageNavigator: {
        marker: {
          style: {
            fill: 'rgba(0,0,0,0.65)',
          },
        },
      },
    },
    label: {
      position: 'middle',
      layout: [
        {
          type: 'interval-adjust-position',
        },
        {
          type: 'interval-hide-overlap',
        },
        {
          type: 'adjust-color',
        },
      ],
    },
    interactions: [
      {
        type: 'active-region',
        enable: false,
      },
    ],
    connectedArea: {
      style: (oldStyle, element) => {
        return {
          fill: 'rgba(0,0,0,0.25)',
          stroke: oldStyle.fill,
          lineWidth: 0.5,
        };
      },
    },
  };

  const configProjectState = {
    data: projectStateData,
    isStack: true,
    xField: 'month',
    yField: 'tổng dự án',
    seriesField: 'type',
    legend: {
      layout: 'horizontal',
      position: 'top',
      flipPage: true,
      maxRow: 2,
      pageNavigator: {
        marker: {
          style: {
            fill: 'rgba(0,0,0,0.65)',
          },
        },
      },
    },
    label: {
      position: 'middle',
      layout: [
        {
          type: 'interval-adjust-position',
        },
        {
          type: 'interval-hide-overlap',
        },
        {
          type: 'adjust-color',
        },
      ],
    },
    interactions: [
      {
        type: 'active-region',
        enable: false,
      },
    ],
    connectedArea: {
      style: (oldStyle, element) => {
        return {
          fill: 'rgba(0,0,0,0.25)',
          stroke: oldStyle.fill,
          lineWidth: 0.5,
        };
      },
    },
  };

  const configTechStack = {
    data: techStackData,
    isStack: true,
    xField: 'month',
    yField: 'tổng dự án',
    seriesField: 'type',
    legend: {
      layout: 'horizontal',
      position: 'top',
      flipPage: true,
      maxRow: 2,
      pageNavigator: {
        marker: {
          style: {
            fill: 'rgba(0,0,0,0.65)',
          },
        },
      },
    },
    label: {
      position: 'middle',
      layout: [
        {
          type: 'interval-adjust-position',
        },
        {
          type: 'interval-hide-overlap',
        },
        {
          type: 'adjust-color',
        },
      ],
    },
    interactions: [
      {
        type: 'active-region',
        enable: false,
      },
    ],
    connectedArea: {
      style: (oldStyle, element) => {
        return {
          fill: 'rgba(0,0,0,0.25)',
          stroke: oldStyle.fill,
          lineWidth: 0.5,
        };
      },
    },
  };

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <Space direction='vertical' size={50}>
      <Space direction='vertical' size={50} style={{ width: '100%' }}>
        <Space>
          <p className='label'>Lọc theo năm :</p>

          <DatePicker
            allowClear={false}
            value={dayjs(year)}
            onChange={(_, dateString) => setYear(dateString)}
            picker='year'
          />
        </Space>

        <Space direction='vertical' size='large' style={{ width: '100%' }}>
          <h3>Số lượng dự án với mỗi thể loại</h3>

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

          <Column {...configCategory} />
        </Space>

        <Space direction='vertical' size='large' style={{ width: '100%' }}>
          <h3>Số lượng dự án với mỗi trạng thái</h3>

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

          <Column {...configProjectState} />
        </Space>

        <Space direction='vertical' size='large' style={{ width: '100%' }}>
          <h3>Số lượng dự án với mỗi loại tech stack sử dụng</h3>

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
      </Space>
    </Space>
  );
};

export default TotalProjectChart;
