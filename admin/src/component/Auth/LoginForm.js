import { useNavigate, Link } from 'react-router-dom';
import {
  Button,
  Checkbox,
  Form,
  Input,
  Space,
  message,
  notification,
} from 'antd';
import axios from 'axios';

import style from './AuthWrapper.module.css';

// ==================================================

const LoginForm = () => {
  const navigate = useNavigate();

  const [messageApi, messageContextHolder] = message.useMessage();
  const [notificationApi, notificationContextHolder] =
    notification.useNotification();

  const submitHandler = (formValue) => {
    axios
      .post('/api/login', JSON.stringify(formValue), {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
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

        setTimeout(() => navigate('/dashboard', { replace: true }), 3000);
      })
      .catch((error) => {
        console.log(error);

        if (error.response.status === 422 || error.response.status === 404) {
          notificationApi['error']({
            message: error.response.data.message,
            placement: 'top',
          });
        }
      });
  };

  return (
    <>
      {messageContextHolder}
      {notificationContextHolder}

      <Form
        className={style['form-container']}
        layout='vertical'
        onFinish={submitHandler}
      >
        <Form.Item
          label='Email'
          name='email'
          rules={[
            {
              type: 'email',
              message: 'Địa chỉ email không hợp lệ! VD: example@example.com',
            },
            {
              required: true,
              message: 'Địa chỉ email không được để trống!',
            },
          ]}
          hasFeedback
        >
          <Input allowClear />
        </Form.Item>

        <Form.Item
          label='Mật khẩu'
          name='password'
          rules={[
            { required: true, message: 'Mật khẩu không được để trống!' },
            () => ({
              validator(_, value) {
                if (!value || value.length >= 6) {
                  return Promise.resolve();
                }

                return Promise.reject(
                  new Error('Mật khẩu phải có ít nhất 6 ký tự!')
                );
              },
            }),
          ]}
          hasFeedback
        >
          <Input.Password allowClear />
        </Form.Item>

        <Form.Item name='remember' valuePropName='checked' noStyle>
          <Checkbox>Lưu thông tin đăng nhập</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button
            className={style['form-button']}
            type='primary'
            htmlType='submit'
          >
            Đăng nhập
          </Button>
        </Form.Item>

        <Space style={{ justifyContent: 'space-between' }}>
          <div className={style['form-link']}>
            <Link to='/register'>Chưa có tài khoản?</Link>
          </div>

          <div className={style['form-link']}>
            <Link to='#top'>Quên mật khẩu!</Link>
          </div>
        </Space>
      </Form>
    </>
  );
};

export default LoginForm;
