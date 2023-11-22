import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Form,
  Input,
  Select,
  Space,
  message,
  notification,
} from 'antd';
import axios from 'axios';

import { getDepartmentData } from '../../../../store/department/actions';
import { getTechStackData } from '../../../../store/tech-stack/actions';
import { getProjectData } from '../../../../store/project/actions';
import EmployeeSelectList from './EmployeeSelectList';
import { host } from '../../../../store';

// ==================================================

const NewDepartment = () => {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const techStackList = useSelector((state) => state.techStack.data);
  const projectList = useSelector((state) => state.project.data);

  const [openModal, setOpenModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState([]);

  const [form] = Form.useForm();
  const [notificationApi, notificationContextHolder] =
    notification.useNotification();
  const [messageApi, messageContextHolder] = message.useMessage();

  const selectEmployeeHandler = (value) => {
    setSelectedEmployee(value);
    setOpenModal(false);
  };

  const submitHandler = (value) => {
    let url = `${host}/api/admin/department/create`;
    let method = 'post';

    if (state?.isEdit) {
      url = `${host}/api/admin/department/edit/${state._id}`;
      method = 'put';
    }

    if (selectedEmployee.length === 0) {
      return notificationApi['warning']({
        placement: 'top',
        message: 'Please select employee!',
      });
    }

    axios({
      url: url,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      data: JSON.stringify({ ...value, employees: selectedEmployee }),
    })
      .then((res) => {
        messageApi.open({
          key: 'updatable',
          type: 'loading',
          content: 'Loading...',
        });

        setTimeout(() => {
          messageApi.open({
            key: 'updatable',
            type: 'success',
            content: res.data.message,
          });
        }, 2000);

        setTimeout(() => navigate('/department', { replace: true }), 3000);
      })
      .catch((error) => {
        console.log(error);

        if (error.response.status === 422) {
          notificationApi['error']({
            message: error.response.data.message,
            placement: 'top',
          });
        }
      });
  };

  useEffect(() => {
    dispatch(getDepartmentData());
    dispatch(getTechStackData());
    dispatch(getProjectData());

    if (state) {
      const departmentTechStackList = state.techStacks.map((ts) => ts._id);
      const departmentProjectList = state.projects.map((p) => p._id);
      const departmentEmployeeList = state.employees.map((e) => e._id);

      setSelectedEmployee(departmentEmployeeList);

      form.setFieldsValue({
        ...state,
        techStacks: departmentTechStackList,
        projects: departmentProjectList,
      });
    }
  }, [dispatch, state, form]);

  return (
    <>
      {notificationContextHolder}

      {messageContextHolder}

      <h2>New department</h2>

      <div className='form-container' style={{ paddingTop: '4rem' }}>
        <Form
          className='form'
          form={form}
          onFinish={submitHandler}
          labelCol={{
            sm: {
              span: 7,
            },
            md: {
              span: 8,
            },
          }}
          wrapperCol={{
            sm: {
              span: 17,
            },
            md: {
              span: 13,
            },
            lg: {
              span: 12,
            },
            xl: {
              span: 10,
            },
          }}
        >
          <Form.Item
            name='name'
            label="Department's name"
            rules={[
              {
                required: true,
                message: "Please enter department's name!",
              },
            ]}
          >
            <Input allowClear />
          </Form.Item>

          <Form.Item
            name='mission'
            label='Mission'
            rules={[
              {
                required: true,
                message: "Please enter department's mission!",
              },
            ]}
          >
            <Input allowClear />
          </Form.Item>

          <Form.Item
            name='techStacks'
            label='Tech stack'
            rules={[
              {
                required: true,
                message: "Please select department's tech stack",
              },
            ]}
          >
            <Select
              mode='multiple'
              allowClear
              maxTagCount='responsive'
              filterOption={(inputValue, option) => {
                if (
                  option.name
                    .toLocaleLowerCase()
                    .includes(inputValue.toLocaleLowerCase())
                ) {
                  return true;
                }

                return false;
              }}
              options={techStackList
                .filter((ts) => ts.state === 'active')
                .map((ts) => {
                  return {
                    name: ts.name,
                    label: ts.name,
                    value: ts._id,
                  };
                })}
              style={{
                width: '25rem',
              }}
            />
          </Form.Item>

          <Form.Item name='projects' label='Project in charge'>
            <Select
              mode='multiple'
              allowClear
              maxTagCount='responsive'
              filterOption={(inputValue, option) => {
                if (
                  option.name
                    .toLocaleLowerCase()
                    .includes(inputValue.toLocaleLowerCase())
                ) {
                  return true;
                }

                return false;
              }}
              options={projectList.map((p) => {
                return {
                  name: p.name,
                  label: p.name,
                  value: p._id,
                };
              })}
              style={{
                width: '25rem',
              }}
            />
          </Form.Item>

          <Form.Item label='Employee' required>
            <Space direction='vertical'>
              <Button onClick={() => setOpenModal(true)}>
                Select employee
              </Button>

              <span style={{ color: '#adb5bd' }}>
                {selectedEmployee.length > 0
                  ? `Selected ${selectedEmployee.length} employee${
                      selectedEmployee.length === 1 ? '' : 's'
                    }`
                  : ''}
              </span>
            </Space>

            <EmployeeSelectList
              open={openModal}
              onClose={() => setOpenModal(false)}
              selected={selectedEmployee}
              onSelect={selectEmployeeHandler}
              isEdit={state?.isEdit}
            />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              xs: {
                offset: 0,
              },
              sm: {
                offset: 7,
              },
              md: {
                offset: 8,
              },
            }}
          >
            <div className='button-container'>
              <Button type='primary' htmlType='submit'>
                Save
              </Button>

              <Button
                onClick={() => navigate('/department', { replace: true })}
              >
                Cancel
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default NewDepartment;
