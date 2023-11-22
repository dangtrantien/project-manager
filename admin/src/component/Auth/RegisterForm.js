import { useNavigate, Link } from 'react-router-dom';
import { Button, Form, Input, message, notification } from 'antd';
import axios from 'axios';

import { host } from '../../store';

import style from './AuthWrapper.module.css';

// ==================================================

const RegisterForm = () => {
  const navigate = useNavigate();

  const [messageApi, messageContextHolder] = message.useMessage();
  const [notificationApi, notificationContextHolder] =
    notification.useNotification();

  const submitHandler = (formValue) => {
    axios
      .post(`${host}/api/register`, JSON.stringify(formValue), {
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
          label='Display Name'
          name='displayName'
          rules={[
            {
              required: true,
              message: 'Please enter your display name!',
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
            },
            {
              required: true,
            },
          ]}
          hasFeedback
        >
          <Input allowClear />
        </Form.Item>

        <Form.Item
          label='Password'
          name='password'
          rules={[
            {
              required: true,
            },
            {
              min: 6,
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
            Create Account
          </Button>
        </Form.Item>

        <div className={style['form-link']}>
          <Link to='/login'>Already have an account?</Link>
        </div>
      </Form>
    </>
  );
};

export default RegisterForm;
