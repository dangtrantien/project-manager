import { useNavigate, Link } from 'react-router-dom';
import { Button, Form, Input, message, notification } from 'antd';
import axios from 'axios';

import style from './AuthWrapper.module.css';

// ==================================================

const RegisterForm = () => {
  const navigate = useNavigate();

  const [messageApi, messageContextHolder] = message.useMessage();
  const [notificationApi, notificationContextHolder] =
    notification.useNotification();

  const submitHandler = (formValue) => {
    axios
      .post('/api/register', JSON.stringify(formValue), {
        headers: {
          'Content-Type': 'application/json',
        },
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

        setTimeout(() => navigate('/login', { replace: true }), 3000);
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
          label='Tên hiển thị'
          name='displayName'
          rules={[
            {
              required: true,
              message: 'Tên hiển thị không được để trống!',
            },
          ]}
        >
          <Input allowClear />
        </Form.Item>

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
            {
              min: 6,
              message: 'Mật khẩu phải có ít nhất 6 ký tự!',
            },
          ]}
          hasFeedback
        >
          <Input.Password allowClear />
        </Form.Item>

        <Form.Item>
          <Button
            className={style['form-button']}
            type='primary'
            htmlType='submit'
          >
            Đăng ký
          </Button>
        </Form.Item>

        <div className={style['form-link']}>
          <Link to='/login'>Đã có tài khoản?</Link>
        </div>
      </Form>
    </>
  );
};

export default RegisterForm;
