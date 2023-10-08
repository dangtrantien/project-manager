import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Table, Tooltip } from 'antd';
import axios from 'axios';

import useFilterSearch from '../../../hooks/useFilterSearch';
import { host } from '../../../store';

import { BsEyeFill } from 'react-icons/bs';

// ==================================================

const ProjectList = ({ data }) => {
  const [projectList, setProjectList] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const fetchData = useCallback(() => {
    setLoading(true);

    axios
      .get(`${host}/api/admin/project/get-active-list`, {
        withCredentials: true,
      })
      .then((res) => {
        const resList = res.data.data.map((val, i) => {
          return { ...val, key: val._id, index: i + 1 };
        });

        const dataList = resList.filter((val) => data?.indexOf(val._id) > -1);

        setProjectList(dataList);
        setTotalData(dataList.length);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  }, [data]);

  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      className: 'index-col',
    },
    {
      title: 'Tên dự án',
      key: 'name',
      dataIndex: 'name',
      ...useFilterSearch('name', 'Tìm kiếm theo tên'),
    },
    {
      title: 'Loại dự án',
      key: 'category',
      render: (_, { category }) => category.name,
      responsive: ['xl'],
    },
    {
      title: 'Tech stack',
      key: 'techStacks',
      render: (_, { techStacks }) => (
        <Tooltip
          placement='topLeft'
          title={techStacks.map((ts) => (
            <div key={ts._id}>
              <span>{ts.name}</span>

              <br />
            </div>
          ))}
        >
          {techStacks.map((ts) => ts.name).join(', ')}
        </Tooltip>
      ),
      responsive: ['xl'],
    },
    {
      title: 'Trung tâm phụ trách',
      key: 'departments',
      render: (_, { departments }) => (
        <Tooltip
          placement='topLeft'
          title={departments.map((d) => (
            <div key={d._id}>
              <span>{d.name}</span>

              <br />
            </div>
          ))}
        >
          {departments.map((d) => d.name).join(', ')}
        </Tooltip>
      ),
      responsive: ['xl'],
    },
    {
      title: 'Thành viên trong dự án',
      key: 'employee',
      render: (_, { employees }) => (
        <Tooltip
          placement='topLeft'
          title={employees.map((e) => (
            <div key={e._id}>
              <span>{e.fullName}</span>

              <br />
            </div>
          ))}
        >
          {employees.map((e) => e.fullName).join(', ')}
        </Tooltip>
      ),
      responsive: ['xl'],
    },
    {
      title: '',
      key: 'action',
      render: (_, record) => (
        <Link
          to={`/p/${record._id}`}
          style={{ width: 'fit-content' }}
          className='list-button detail-button'
        >
          <BsEyeFill />
        </Link>
      ),
      width: '5rem',
    },
  ];

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Table
      size='small'
      bordered
      columns={columns}
      dataSource={projectList}
      loading={loading}
      pagination={{
        ...pagination,
        total: totalData,
        position: ['bottomCenter'],
        size: 'default',
        onChange: (page, pageSize) =>
          setPagination({ current: page, pageSize: pageSize }),
      }}
      onChange={(p, f, s, { currentDataSource }) => {
        setTotalData(currentDataSource.length);
      }}
    />
  );
};

export default ProjectList;
