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

const EmployeeList = () => {
  const [employeeList, setEmployeeList] = useState([]);
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
      .get(`${host}/api/admin/employee/get-active-list`, {
        withCredentials: true,
      })
      .then((res) => {
        const dataList = res.data.data.map((val, i) => {
          return { ...val, key: val._id, index: i + 1 };
        });

        setEmployeeList(dataList);
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
        let url = `${host}/api/admin/employee/delete-one/${id}`;
        let data = null;

        if (multiple === 'multiple') {
          url = `${host}/api/admin/employee/delete-many`;
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

            const updateList = employeeList.filter(
              (c) => id.indexOf(c._id) === -1
            );

            setSelectedRows([]);
            setEmployeeList(updateList);
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
      title: 'Họ tên',
      key: 'fullName',
      dataIndex: 'fullName',
      ...useFilterSearch('fullName', 'Tìm kiếm theo họ tên'),
    },
    {
      title: 'Ngày sinh',
      key: 'dob',
      dataIndex: 'dob',
      ...useFilterSearch('dob', 'Tìm kiếm theo ngày sinh'),
      responsive: ['xl'],
    },
    {
      title: 'Số điện thoại',
      key: 'phone',
      dataIndex: 'phone',
      ...useFilterSearch('phone', 'Tìm kiếm theo số điện thoại'),
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
      title: 'Các dự án tham gia',
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
      responsive: ['md'],
    },
    {
      title: '',
      key: 'action',
      render: (_, record) => (
        <Space style={{ width: '100%', justifyContent: 'space-evenly' }}>
          <Link to={`/e/${record._id}`} className='list-button detail-button'>
            <BsEyeFill />
          </Link>

          <Link
            to='/new-employee'
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

export default EmployeeList;
