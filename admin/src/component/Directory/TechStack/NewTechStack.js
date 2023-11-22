import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Input, Select, Button, message, notification } from 'antd';
import axios from 'axios';

import { host } from '../../../store';

import style from './NewTechStack.module.css';
import HiTechMobilePhone from '../../../asset/images/Lovepik_com-400275991-hi-tech-mobile-phone.webp';

// ==================================================

const NewTechStack = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const { Option } = Select;
  const [notificationApi, notificationContextHolder] =
    notification.useNotification();
  const [messageApi, messageContextHolder] = message.useMessage();

  const submitHandler = (value) => {
    let url = `${host}/api/admin/tech-stack/create`;
    let method = 'post';

    if (state?.isEdit) {
      url = `${host}/api/admin/tech-stack/edit/${state._id}`;
      method = 'put';
    }

    axios({
      url: url,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      data: JSON.stringify(value),
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

        setTimeout(() => navigate('/tech-stack', { replace: true }), 3000);
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
    if (state) {
      form.setFieldsValue(state);
    }
  }, [state, form]);

  return (
    <>
      {notificationContextHolder}

      {messageContextHolder}

      <h2>New tech stack</h2>

      <div className='form-container'>
        <Form
          className={`form ${style.form}`}
          form={form}
          onFinish={submitHandler}
          layout='vertical'
        >
          <Form.Item
            name='name'
            label='Tech stack'
            rules={[
              {
                required: true,
                message: 'Please enter tech stack!',
              },
            ]}
          >
            <Input allowClear />
          </Form.Item>

          <Form.Item
            name='short_desc'
            label='Short description'
            rules={[
              {
                required: true,
                message: 'Please describe shortly about the tech stack!',
              },
            ]}
          >
            <Input allowClear />
          </Form.Item>

          <Form.Item
            name='long_desc'
            label='Detail description'
            rules={[
              {
                required: true,
                message: 'Please describe in detail about the tech stack!',
              },
            ]}
          >
            <Input.TextArea rows={4} allowClear />
          </Form.Item>

          <Form.Item
            name='state'
            label='State'
            rules={[
              {
                required: true,
                message: 'Please select state!',
              },
            ]}
            className={style['state-container']}
          >
            <Select>
              <Option value='active'>Active</Option>
              <Option value='inactive'>Inactive</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <div className='button-container'>
              <Button type='primary' htmlType='submit'>
                Save
              </Button>

              <Button
                onClick={() => navigate('/tech-stack', { replace: true })}
              >
                Cancel
              </Button>
            </div>
          </Form.Item>
        </Form>

        <div className='img-container'>
          <img src={HiTechMobilePhone} alt='Hi tech mobile phone' />
        </div>
      </div>
    </>
  );
};

export default NewTechStack;
