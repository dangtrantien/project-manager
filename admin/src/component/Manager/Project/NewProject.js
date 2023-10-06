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

import { getCategoryData } from '../../../store/project-category/actions';
import { getProjectStateData } from '../../../store/project-state/actions';
import { getTechStackData } from '../../../store/tech-stack/actions';
import { getDepartmentData } from '../../../store/department/actions';
import EmployeeSelect from '../../UI/Button/EmployeeSelect';

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
  const [selectedDepartment, setSelectedDepartment] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState([]);

  const [form] = Form.useForm();
  const [notificationApi, notificationContextHolder] =
    notification.useNotification();
  const [messageApi, messageContextHolder] = message.useMessage();

  const openModalHandler = () => {
    if (!form.getFieldValue(['departments'])) {
      notificationApi['warning']({
        message: 'Mời lựa chọn trung tâm phụ trách trước!',
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
    let url = '/api/admin/project/create';
    let method = 'post';

    if (state?.isEdit) {
      url = `/api/admin/project/edit/${state._id}`;
      method = 'put';
    }

    if (selectedEmployee.length === 0) {
      return notificationApi['warning']({
        placement: 'top',
        message: 'Nhân viên không được để trống!',
      });
    }
    console.log({
      ...value,
      departments: selectedDepartment,
      employees: selectedEmployee,
    });
    // axios({
    //   url: url,
    //   method: method,
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   withCredentials: true,
    //   data: JSON.stringify({
    //     ...value,
    //     departments: selectedDepartment,
    //     employees: selectedEmployee,
    //   }),
    // })
    //   .then((res) => {
    //     messageApi.open({
    //       key: 'updatable',
    //       type: 'loading',
    //       content: 'Loading...',
    //     });

    //     setTimeout(() => {
    //       messageApi.open({
    //         key: 'updatable',
    //         type: 'success',
    //         content: res.data.message,
    //       });
    //     }, 2000);

    //     setTimeout(() => navigate('/project', { replace: true }), 3000);
    //   })
    //   .catch((error) => {
    //     console.log(error);

    //     if (error.response.status === 422) {
    //       notificationApi['error']({
    //         message: error.response.data.message,
    //         placement: 'top',
    //       });
    //     }
    //   });
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

      setSelectedDepartment(projectDepartmentList);
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

      <h2>Dự án mới</h2>

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
            label='Tên dự án'
            rules={[
              {
                required: true,
                message: 'Tên của dự án không được để trống!',
              },
            ]}
          >
            <Input allowClear placeholder='Mời nhập tên của dự án' />
          </Form.Item>

          <Form.Item
            name='category'
            label='Thể loại'
            rules={[
              {
                required: true,
                message: 'Thể loại dự án không được để trống!',
              },
            ]}
          >
            <Select
              allowClear
              placeholder='Mời lựa chọn thể loại'
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
            label='Trạng thái dự án'
            rules={[
              {
                required: true,
                message: 'Trạng thái dự án không được để trống!',
              },
            ]}
          >
            <Select
              allowClear
              placeholder='Mời lựa chọn trạng thái'
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
            label='Tech stack sử dụng'
            rules={[
              {
                required: true,
                message: 'Tech stack sử dụng không được để trống!',
              },
            ]}
          >
            <Select
              mode='multiple'
              allowClear
              placeholder='Mời lựa chọn tech stack'
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
            label='Trung tâm phụ trách'
            rules={[
              {
                required: true,
                message: 'Trung tâm phụ trách dự án không được để trống!',
              },
            ]}
          >
            <Select
              mode='multiple'
              allowClear
              placeholder='Mời lựa chọn trung tâm phụ trách'
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

          <Form.Item label='Nhân viên' required>
            <Space direction='vertical'>
              <Button onClick={openModalHandler}>Lựa chọn nhân viên</Button>

              <span style={{ color: '#adb5bd' }}>
                {selectedEmployee.length > 0
                  ? `Đã lựa chọn ${selectedEmployee.length} nhân viên`
                  : ''}
              </span>
            </Space>

            <EmployeeSelect
              open={openModal}
              onClose={() => setOpenModal(false)}
              selected={selectedEmployee}
              onSelect={selectEmployeeHandler}
              isEdit={state?.isEdit}
              department={form.getFieldValue(['departments'])}
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
                Lưu
              </Button>

              <Button onClick={() => navigate('/project', { replace: true })}>
                Hủy
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default NewProject;
