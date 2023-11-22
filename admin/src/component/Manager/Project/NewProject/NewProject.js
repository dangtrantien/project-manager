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

import { getCategoryData } from '../../../../store/project-category/actions';
import { getProjectStateData } from '../../../../store/project-state/actions';
import { getTechStackData } from '../../../../store/tech-stack/actions';
import { getDepartmentData } from '../../../../store/department/actions';
import EmployeeSelectList from './EmployeeSelectList';
import { host } from '../../../../store';

// ==================================================

const NewProject = () => {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const projectCategoryList = useSelector(
    (state) => state.projectCategory.data
  );
  const projectStateList = useSelector((state) => state.projectState.data);
  const techStackList = useSelector((state) => state.techStack.data);
  const departmentList = useSelector((state) => state.department.data);

  const [openModal, setOpenModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState([]);

  const [form] = Form.useForm();
  const [notificationApi, notificationContextHolder] =
    notification.useNotification();
  const [messageApi, messageContextHolder] = message.useMessage();

  const openModalHandler = () => {
    if (!form.getFieldValue(['departments'])) {
      notificationApi['warning']({
        message: 'Please select department before select employee!',
        placement: 'top',
      });
    } else {
      setOpenModal(true);
    }
  };

  const selectEmployeeHandler = (value) => {
    setSelectedEmployee(value);
    setOpenModal(false);
  };

  const submitHandler = (value) => {
    let url = `${host}/api/admin/project/create`;
    let method = 'post';

    if (state?.isEdit) {
      url = `${host}/api/admin/project/edit/${state._id}`;
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
      data: JSON.stringify({
        ...value,
        employees: selectedEmployee,
      }),
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

        setTimeout(() => navigate('/project', { replace: true }), 3000);
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
    dispatch(getCategoryData());
    dispatch(getProjectStateData());
    dispatch(getTechStackData());
    dispatch(getDepartmentData());

    if (state) {
      const projectTechStackList = state.techStacks.map((ts) => ts._id);
      const projectDepartmentList = state.departments.map((d) => d._id);
      const projectEmployeeList = state.employees.map((e) => e._id);

      setSelectedEmployee(projectEmployeeList);

      form.setFieldsValue({
        ...state,
        category: state.category._id,
        projectState: state.projectState._id,
        techStacks: projectTechStackList,
        departments: projectDepartmentList,
      });
    }
  }, [dispatch, state, form]);

  return (
    <>
      {notificationContextHolder}

      {messageContextHolder}

      <h2>New project</h2>

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
            label="Project's name"
            rules={[
              {
                required: true,
                message: "Please enter project's name",
              },
            ]}
          >
            <Input allowClear />
          </Form.Item>

          <Form.Item
            name='category'
            label='Category'
            rules={[
              {
                required: true,
                message: "Please select project's category",
              },
            ]}
          >
            <Select
              allowClear
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
              options={projectCategoryList
                .filter((c) => c.state === 'active')
                .map((c) => {
                  return {
                    name: c.name,
                    label: c.name,
                    value: c._id,
                  };
                })}
              style={{
                width: '25rem',
              }}
            />
          </Form.Item>

          <Form.Item
            name='projectState'
            label="Project's state"
            rules={[
              {
                required: true,
                message: "Please select project's state",
              },
            ]}
          >
            <Select
              allowClear
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
              options={projectStateList
                .filter((pS) => pS.state === 'active')
                .map((pS) => {
                  return {
                    name: pS.name,
                    label: pS.name,
                    value: pS._id,
                  };
                })}
              style={{
                width: '25rem',
              }}
            />
          </Form.Item>

          <Form.Item
            name='techStacks'
            label='Tech stack'
            rules={[
              {
                required: true,
                message: 'Please select tech stack!',
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

          <Form.Item
            name='departments'
            label='Department in charge'
            rules={[
              {
                required: true,
                message: 'Please select department!',
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
              options={departmentList.map((d) => {
                return {
                  name: d.name,
                  label: d.name,
                  value: d._id,
                };
              })}
              style={{
                width: '25rem',
              }}
            />
          </Form.Item>

          <Form.Item label='Employee' required>
            <Space direction='vertical'>
              <Button onClick={openModalHandler}>Select employee</Button>

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
              departments={form.getFieldValue('departments')}
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

              <Button onClick={() => navigate('/project', { replace: true })}>
                Cancel
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default NewProject;
