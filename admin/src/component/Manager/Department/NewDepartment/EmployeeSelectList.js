import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Modal, Table, Tooltip } from 'antd';
import axios from 'axios';

import useFilterSearch from '../../../../hooks/useFilterSearch';
import { host } from '../../../../store';

// ==================================================

const EmployeeSelectList = ({ open, onClose, selected, onSelect, isEdit }) => {
  const departments = useSelector((state) => state.department.data);

  const [employeeList, setEmployeeList] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
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
        const resData = res.data.data.map((val, i) => {
          return { ...val, key: val._id };
        });

        const existed = [];

        departments.map((d) => {
          d.employees.map((e) => {
            const existedEmployee = resData.find((val) => val._id === e._id);

            existed.push(existedEmployee._id);

            return e;
          });

          return d;
        });

        let dataList = resData.filter((val) => existed.indexOf(val._id) === -1);

        if (isEdit) {
          const currentEmployee = resData.filter(
            (val) => selected.indexOf(val._id) > -1
          );
          const employee = resData.filter(
            (val) => existed.indexOf(val._id) === -1
          );

          dataList = [...new Set([currentEmployee, employee].flat())];
        }

        setEmployeeList(dataList);
        setTotalData(dataList.length);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  }, [departments, isEdit, selected]);

  const columns = [
    {
      title: 'Employee',
      key: 'fullName',
      dataIndex: 'fullName',
      ...useFilterSearch('fullName', 'Search employee'),
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
    },
  ];

  useEffect(() => {
    if (selected.length !== 0) {
      setSelectedRows(selected);
    }

    fetchData();
  }, [selected, fetchData]);

  return (
    <Modal
      title='Employee'
      style={{
        top: 20,
      }}
      open={open}
      onCancel={() => {
        if (selected.length !== 0) {
          setSelectedRows(selected);
        }

        onClose();
      }}
      onOk={() => onSelect(selectedRows)}
      className='modal'
    >
      <Table
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
      />
    </Modal>
  );
};

export default EmployeeSelectList;
