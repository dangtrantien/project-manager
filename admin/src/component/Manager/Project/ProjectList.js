import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button, Modal, Space, Table, Tooltip, message } from 'antd';
import axios from 'axios';

import useFilterSearch from '../../../hooks/useFilterSearch';
import { host } from '../../../store';

import { BiSolidEditAlt } from 'react-icons/bi';
import { BsEyeFill, BsFillTrash3Fill } from 'react-icons/bs';

// ==================================================

const ProjectList = () => {
  const [projectList, setProjectList] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const { confirm } = Modal;
  const [messageApi, contextHolder] = message.useMessage();

  const fetchData = useCallback(() => {
    setLoading(true);

    axios
      .get(`${host}/api/admin/project/get-active-list`, {
        withCredentials: true,
      })
      .then((res) => {
        const dataList = res.data.data.map((val, i) => {
          return { ...val, key: val._id, index: i + 1 };
        });

        setProjectList(dataList);
        setTotalData(res.data.total);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  }, []);

  // Xóa data
  const deleteHandler = (id, multiple) => {
    confirm({
      title: 'Bạn có chắc chắn muốn xóa dữ liệu?',
      okType: 'danger',
      onOk() {
        let url = `${host}/api/admin/project/delete-one/${id}`;
        let data = null;

        if (multiple === 'multiple') {
          url = `${host}/api/admin/project/delete-many`;
          data = id;
        }

        axios
          .delete(url, {
            data: JSON.stringify({ ids: data }),
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          })
          .then((res) => {
            messageApi.open({
              type: 'success',
              content: res.data.message,
            });

            const updateList = projectList.filter(
              (p) => id.indexOf(p._id) === -1
            );

            setSelectedRows([]);
            setProjectList(updateList);
          })
          .catch((error) => console.log(error));
      },
    });
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      className: 'index-col',
    },
    {
      title: 'Tên',
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
        <Space style={{ width: '100%', justifyContent: 'space-evenly' }}>
          <Link to={`/p/${record._id}`} className='list-button detail-button'>
            <BsEyeFill />
          </Link>

          <Link
            to='/new-project'
            state={{ ...record, isEdit: true }}
            className='list-button edit-button'
          >
            <BiSolidEditAlt />
          </Link>

          <button
            type='button'
            className='list-button delete-button'
            onClick={deleteHandler.bind(null, record._id)}
          >
            <BsFillTrash3Fill />
          </button>
        </Space>
      ),
      width: '15rem',
    },
  ];

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      {contextHolder}

      <Space direction='vertical' size='large'>
        <Space>
          <Button
            type='primary'
            onClick={deleteHandler.bind(null, selectedRows, 'multiple')}
            disabled={selectedRows.length === 0}
          >
            Xóa dữ liệu
          </Button>

          <Button
            onClick={() => setSelectedRows([])}
            disabled={selectedRows.length === 0}
          >
            Bỏ chọn
          </Button>

          <span style={{ color: '#adb5bd' }}>
            {selectedRows.length > 0
              ? `Đã lựa chọn ${selectedRows.length} dòng`
              : ''}
          </span>
        </Space>

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
          rowSelection={{
            selectedRowKeys: selectedRows,
            onChange: (rowkeys) => setSelectedRows(rowkeys),
          }}
          onChange={(p, f, s, { currentDataSource }) => {
            setTotalData(currentDataSource.length);
          }}
        />
      </Space>
    </>
  );
};

export default ProjectList;
