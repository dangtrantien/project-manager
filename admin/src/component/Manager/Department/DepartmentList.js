import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Modal,
  Space,
  Table,
  Tooltip,
  message,
  notification,
} from 'antd';
import axios from 'axios';

import useFilterSearch from '../../../hooks/useFilterSearch';
import { host } from '../../../store';

import { BiSolidEditAlt } from 'react-icons/bi';
import { BsEyeFill, BsFillTrash3Fill } from 'react-icons/bs';

// ==================================================

const DepartmentList = () => {
  const [departmentList, setDepartmentList] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const { confirm } = Modal;
  const [notificationApi, notificationContextHolder] =
    notification.useNotification();
  const [messageApi, messageContextHolder] = message.useMessage();

  const fetchData = useCallback(() => {
    setLoading(true);

    axios
      .get('/api/admin/department/get-active-list')
      .then((res) => {
        const dataList = res.data.data.map((val, i) => {
          return { ...val, key: val._id, index: i + 1 };
        });

        setDepartmentList(dataList);
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
        let url = `${host}/api/admin/department/delete-one/${id}`;
        let data = null;

        if (multiple === 'multiple') {
          url = `${host}/api/admin/department/delete-many`;
          data = id;
        }

        axios
          .delete(url, {
            data: JSON.stringify({ ids: data }),
            headers: {
              'Content-Type': 'application/json',
            },
          })
          .then((res) => {
            messageApi.open({
              type: 'success',
              content: res.data.message,
            });

            const updateList = departmentList.filter(
              (d) => id.indexOf(d._id) === -1
            );

            setSelectedRows([]);
            setDepartmentList(updateList);
          })
          .catch((error) => {
            console.log(error);

            if (error.response.status === 403) {
              notificationApi['error']({
                message: error.response.data.message,
                placement: 'top',
              });
            }
          });
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
      title: 'Chức năng, nhiệm vụ',
      key: 'mission',
      dataIndex: 'mission',
      ...useFilterSearch('mission', 'Tìm kiếm theo nhiệm vụ'),
      responsive: ['sm'],
    },
    {
      title: 'Các dự án',
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
            <p>Hiện chưa tham gia dự án nào</p>
          )}
        </>
      ),
      responsive: ['xl'],
    },
    {
      title: 'Nhân viên',
      key: 'projects',
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
          <Link to={`/d/${record._id}`} className='list-button detail-button'>
            <BsEyeFill />
          </Link>

          <Link
            to='/new-department'
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
      {notificationContextHolder}

      {messageContextHolder}

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
          dataSource={departmentList}
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

export default DepartmentList;
