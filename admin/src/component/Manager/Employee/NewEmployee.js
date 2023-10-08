import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Avatar,
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Select,
  Upload,
  message,
  notification,
} from 'antd';
import dayjs from 'dayjs';
import axios from 'axios';

import { getTechStackData } from '../../../store/tech-stack/actions';
import { host } from '../../../store';

import style from './NewEmployee.module.css';
import {
  CloseOutlined,
  LoadingOutlined,
  PlusOutlined,
} from '@ant-design/icons';

// ==================================================

const getBase64 = (img, callback) => {
  const reader = new FileReader();

  reader.readAsDataURL(img);
  reader.onload = () => callback(reader.result);
};

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isJpgOrPng) {
    message.error('Chỉ có thể tải file JPG/PNG. Mời chọn lại!');
  }

  if (!isLt2M) {
    message.error('Ảnh phải có kích cỡ nhỏ hơn 2MB!');
  }

  return false;
};

const NewEmployee = () => {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const techStackList = useSelector((state) => state.techStack.data);

  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();

  const [form] = Form.useForm();
  const { Option } = Select;
  const [notificationApi, notificationContextHolder] =
    notification.useNotification();
  const [messageApi, messageContextHolder] = message.useMessage();

  const avatarChangeHandler = (info) => {
    setLoading(true);

    getBase64(info.file, (url) => {
      setLoading(false);
      setImageUrl(url);
    });
  };
  const submitHandler = (value) => {
    let url = `${host}/api/admin/employee/create`;
    let method = 'post';

    if (state?.isEdit) {
      url = `${host}/api/admin/employee/edit/${state._id}`;
      method = 'put';
    }

    if (!value.techStacks || value.techStacks?.length === 0) {
      return notificationApi['warning']({
        placement: 'top',
        message: 'Tech stack sử dụng không được để trống!',
      });
    }

    const formData = new FormData();

    formData.append('image', value.avatar);
    formData.append('fullName', value.fullName);
    formData.append('idCard', value.idCard);
    formData.append('dob', dayjs(value.dob).format('DD/MM/YYYY'));
    formData.append('gender', value.gender);
    formData.append('phone', value.phone);
    formData.append('experience', value.experience);
    formData.append(
      'certificate',
      JSON.stringify(value.certificate ? value.certificate.split('\n') : [])
    );
    formData.append('techStacks', JSON.stringify(value.techStacks));

    axios({
      url: url,
      method: method,
      withCredentials: true,
      data: formData,
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

        setTimeout(() => navigate('/employee', { replace: true }), 3000);
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
    dispatch(getTechStackData());

    if (state) {
      const employeeTechStackList = state.techStacks.map((ts) => {
        return {
          techStack: ts.techStack._id,
          techStackExperience: ts.techStackExperience,
          framework: ts.framework,
        };
      });

      setImageUrl(state.avatar);

      form.setFieldsValue({
        ...state,
        dob: dayjs(state.dob),
        certificate: state.certificate.join('\n'),
        techStacks: employeeTechStackList,
      });
    }
  }, [dispatch, state, form]);

  return (
    <>
      {notificationContextHolder}

      {messageContextHolder}

      <h2>Nhân viên mới</h2>

      <div className={`form-container ${style['form-container']}`}>
        <Form
          className='form'
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
          form={form}
          onFinish={submitHandler}
        >
          <Form.Item
            name='avatar'
            label='Ảnh'
            valuePropName='file'
            getValueFromEvent={(e) => e?.file}
            rules={[
              {
                required: true,
                message: 'Mời chọn ảnh đại diện của nhân viên!',
              },
            ]}
          >
            <Upload
              name='avatar'
              listType='picture-circle'
              className='avatar-uploader'
              showUploadList={false}
              beforeUpload={beforeUpload}
              onChange={avatarChangeHandler}
            >
              {imageUrl ? (
                <Avatar
                  src={imageUrl}
                  alt='avatar'
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                />
              ) : (
                <div>
                  {loading ? <LoadingOutlined /> : <PlusOutlined />}
                  <div
                    style={{
                      marginTop: 8,
                    }}
                  >
                    Upload
                  </div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item
            name='fullName'
            label='Họ tên'
            rules={[
              {
                required: true,
                message: 'Họ tên của nhân viên không được để trống!',
              },
            ]}
          >
            <Input allowClear placeholder='Mời nhập họ tên của nhân viên' />
          </Form.Item>

          <Form.Item
            name='idCard'
            label='Căn cước công dân'
            rules={[
              {
                required: true,
                message: 'CCCD của nhân viên không được để trống!',
              },
            ]}
          >
            <Input allowClear placeholder='Mời nhập CCCD của nhân viên' />
          </Form.Item>

          <Form.Item
            name='dob'
            label='Ngày sinh'
            rules={[
              {
                required: true,
                message: 'Ngày sinh của nhân viên không được để trống!',
              },
            ]}
          >
            <DatePicker format='DD/MM/YYYY' />
          </Form.Item>

          <Form.Item
            name='gender'
            label='Giới tính'
            rules={[
              {
                required: true,
                message: 'Giới tính của nhân viên không được để trống!',
              },
            ]}
          >
            <Select
              placeholder='Mời lựa chọn giới tính'
              style={{
                width: '25rem',
              }}
            >
              <Option value='male'>Nam</Option>
              <Option value='female'>Nữ</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name='phone'
            label='Số điện thoại'
            rules={[
              {
                required: true,
                message: 'Số điện thoại của nhân viên không được để trống!',
              },
            ]}
          >
            <Input
              allowClear
              placeholder='Mời nhập số điện thoại của nhân viên'
            />
          </Form.Item>

          <Form.Item
            name='experience'
            label='Kinh nghiệm'
            rules={[
              {
                required: true,
                message:
                  'Mức độ kinh nghiệm của nhân viên không được để trống!',
              },
            ]}
          >
            <Select
              placeholder='Mời lựa chọn kinh nghiệm'
              style={{
                width: '25rem',
              }}
            >
              <Option value='fresher'>Fresher</Option>
              <Option value='junior'>Junior</Option>
              <Option value='middle'>Middle</Option>
              <Option value='senior'>Senior</Option>
            </Select>
          </Form.Item>

          <Form.Item name='certificate' label='Chứng chỉ'>
            <Input.TextArea
              rows={4}
              allowClear
              placeholder='Xuống dòng với mỗi chứng chỉ'
            />
          </Form.Item>

          <Form.Item
            name='employeeTechStack'
            label='Tech stack sử dụng'
            required
          >
            <Form.List name='techStacks'>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }, index) => (
                    <Card
                      size='small'
                      title={`Tech stack ${index + 1}`}
                      key={key}
                      extra={
                        <CloseOutlined
                          onClick={() => {
                            remove(name);
                          }}
                        />
                      }
                      style={{
                        marginBottom: '1rem',
                      }}
                    >
                      <div className={style['card-form-controll-container']}>
                        <p className={style['card-form-label']}>Tech stack :</p>

                        <Form.Item
                          {...restField}
                          name={[name, 'techStack']}
                          validateTrigger={['onChange', 'onBlur']}
                          rules={[
                            {
                              required: true,
                              message: 'Tên tech stack không được để trống!',
                            },
                          ]}
                        >
                          <Select
                            allowClear
                            placeholder='Mời lựa chọn tech stack'
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
                      </div>

                      <div className={style['card-form-controll-container']}>
                        <p className={style['card-form-label']}>
                          Thời gian làm với tech stack :
                        </p>

                        <Form.Item
                          {...restField}
                          name={[name, 'techStackExperience']}
                          validateTrigger={['onChange', 'onBlur']}
                          rules={[
                            {
                              required: true,
                              message:
                                'Thời gian làm với tech stack không được để trống!',
                            },
                          ]}
                        >
                          <Input
                            allowClear
                            placeholder='Mời nhập thời gian làm với tech stack'
                          />
                        </Form.Item>
                      </div>

                      <div className={style['card-form-controll-container']}>
                        <p className={style['card-form-label']}>
                          Framework sử dụng :
                        </p>

                        <Form.Item
                          {...restField}
                          name={[name, 'framework']}
                          validateTrigger={['onChange', 'onBlur']}
                          rules={[
                            {
                              required: true,
                              message: 'Framework không được để trống!',
                            },
                          ]}
                        >
                          <Input
                            allowClear
                            placeholder='Mời nhập framework sử dụng'
                          />
                        </Form.Item>
                      </div>
                    </Card>
                  ))}

                  <Form.Item>
                    <Button
                      type='dashed'
                      onClick={() => add()}
                      icon={<PlusOutlined />}
                    >
                      Thêm dữ liệu
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
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

              <Button onClick={() => navigate('/employee', { replace: true })}>
                Hủy
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default NewEmployee;
