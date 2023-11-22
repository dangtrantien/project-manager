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

import { host } from '../../store';

import style from './AuthWrapper.module.css';

// ==================================================

const LoginForm = () => {
  const navigate = useNavigate();

  const [messageApi, messageContextHolder] = message.useMessage();
  const [notificationApi, notificationContextHolder] =
    notification.useNotification();

  const submitHandler = (formValue) => {
    axios
      .post(`${host}/api/login`, JSON.stringify(formValue), {
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

        <Form.Item name='remember' valuePropName='checked' noStyle>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button
            className={style['form-button']}
            type='primary'
            htmlType='submit'
          >
            Submit
          </Button>
        </Form.Item>

        <Space style={{ justifyContent: 'space-between' }}>
          <div className={style['form-link']}>
            <Link to='/register'>Not register?</Link>
          </div>

          <div className={style['form-link']}>
            <Link to='#top'>Lost your password?</Link>
          </div>
        </Space>
      </Form>
    </>
  );
};

export default LoginForm;
