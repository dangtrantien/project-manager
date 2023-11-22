import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button, Modal, Space, Table, Tag, message } from 'antd';
import axios from 'axios';

import useFilterSearch from '../../../hooks/useFilterSearch';
import CategoryDetail from './CategoryDetail';
import { host } from '../../../store';

import { BiSolidEditAlt } from 'react-icons/bi';
import { BsEyeFill, BsFillTrash3Fill } from 'react-icons/bs';

// ==================================================

const CategoryList = () => {
  const [projectCategoryList, setProjectCategoryList] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [modalDetail, setModalDetail] = useState({
    open: false,
    data: null,
  });

  const { confirm } = Modal;
  const [messageApi, contextHolder] = message.useMessage();

  const fetchData = useCallback(() => {
    setLoading(true);

    axios
      .get(`${host}/api/admin/project-category/get-active-list`, {
        withCredentials: true,
      })
      .then((res) => {
        const dataList = res.data.data.map((val, i) => {
          return { ...val, key: val._id, index: i + 1 };
        });

        setProjectCategoryList(dataList);
        setTotalData(res.data.total);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  }, []);

  // Xóa data
  const deleteHandler = (id, multiple) => {
    confirm({
      title: 'Are you sure delete this task?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        let url = `${host}/api/admin/project-category/delete-one/${id}`;
        let data = null;

        if (multiple === 'multiple') {
          url = `${host}/api/admin/project-category/delete-many`;
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

            const updateList = projectCategoryList.filter(
              (c) => id.indexOf(c._id) === -1
            );

            setSelectedRows([]);
            setProjectCategoryList(updateList);
          })
          .catch((error) => console.log(error));
      },
    });
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      className: 'index-col',
    },
    {
      title: 'Name',
      key: 'name',
      dataIndex: 'name',
      ...useFilterSearch('name', 'Search name'),
    },
    {
      title: 'Description',
      key: 'short_desc',
      dataIndex: 'short_desc',
      responsive: ['xl'],
      className: 'short-desc-col',
    },
    {
      title: 'Priority',
      key: 'priority',
      dataIndex: 'priority',
      textAlign: 'center',
      sorter: (a, b) => a.priority - b.priority,
      responsive: ['md'],
      className: 'priority-col',
    },
    {
      title: 'State',
      key: 'state',
      render: (_, { state }) => (
        <Tag color={state === 'active' ? 'green' : 'volcano'}>
          {state.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Inactive', value: 'inactive' },
      ],
      onFilter: (value, record) => value === record.state,
      responsive: ['md'],
      className: 'state-col',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space style={{ width: '100%', justifyContent: 'space-evenly' }}>
          <button
            type='button'
            className='list-button detail-button'
            onClick={() => setModalDetail({ open: true, data: record })}
          >
            <BsEyeFill />
          </button>

          <Link
            to='/new-category'
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
            Delete selected
          </Button>

          <Button
            onClick={() => setSelectedRows([])}
            disabled={selectedRows.length === 0}
          >
            Deselect All
          </Button>

          <span style={{ color: '#adb5bd' }}>
            {selectedRows.length > 0
              ? `Selected ${selectedRows.length} items`
              : ''}
          </span>
        </Space>

        <Table
          size='small'
          bordered
          columns={columns}
          dataSource={projectCategoryList}
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

      <CategoryDetail
        open={modalDetail.open}
        data={modalDetail.data}
        onClose={() => setModalDetail({ open: false, data: null })}
      />
    </>
  );
};

export default CategoryList;
