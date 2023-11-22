import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Table, Tooltip } from 'antd';
import axios from 'axios';

import useFilterSearch from '../../../hooks/useFilterSearch';
import { host } from '../../../store';

import { BsEyeFill } from 'react-icons/bs';

// ==================================================

const EmployeeList = ({ data }) => {
  const [employeeList, setEmployeeList] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const fetchData = useCallback(() => {
    setLoading(true);

    axios
      .get(`${host}/api/admin/employee/get-active-list`, {
        withCredentials: true,
      })
      .then((res) => {
        const resList = res.data.data.map((val, i) => {
          return { ...val, key: val._id, index: i + 1 };
        });

        const dataList = resList.filter((val) => data?.indexOf(val._id) > -1);

        setEmployeeList(dataList);
        setTotalData(dataList.length);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  }, [data]);

  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      className: 'index-col',
    },
    {
      title: 'Employee',
      key: 'fullName',
      dataIndex: 'fullName',
      ...useFilterSearch('fullName', 'Search employee'),
    },
    {
      title: 'Day of birth',
      key: 'dob',
      dataIndex: 'dob',
      ...useFilterSearch('dob', 'Search birthday'),
      responsive: ['xl'],
    },
    {
      title: 'Phone number',
      key: 'phone',
      dataIndex: 'phone',
      ...useFilterSearch('phone', 'Search phone'),
      responsive: ['xl'],
    },
    {
      title: 'Teck stack',
      key: 'techStacks',
      render: (_, { techStacks }) => (
        <Tooltip
          placement='topLeft'
          title={techStacks.map((ts) => (
            <div key={ts._id}>
              <span>{ts.techStack.name}</span>

              <br />
            </div>
          ))}
        >
          {techStacks.map((ts) => ts.techStack.name).join(', ')}
        </Tooltip>
      ),
      ellipsis: {
        showTitle: false,
      },
      responsive: ['xl'],
    },
    {
      title: 'Project in charge',
      key: 'projects',
      render: (_, { projects }) => (
        <>
          {projects.length !== 0 ? (
            <Tooltip
              placement='topLeft'
              title={projects.map((p) => (
                <div key={p._id}>
                  <span>{p.name}</span>

                  <br />
                </div>
              ))}
            >
              {projects.map((p) => p.name).join(', ')}
            </Tooltip>
          ) : (
            <p>Currently free</p>
          )}
        </>
      ),
      responsive: ['md'],
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Link
          to={`/e/${record._id}`}
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
      dataSource={employeeList}
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

export default EmployeeList;
