import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  message,
  notification,
} from 'antd';
import axios from 'axios';

import { host } from '../../../store';

import style from './NewCategory.module.css';
import PrototypeWithBulbConcept from '../../../asset/images/Prototype-with-bulb-concept-of-project-development.webp';

// ==================================================

const NewCategory = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const { Option } = Select;
  const [notificationApi, notificationContextHolder] =
    notification.useNotification();
  const [messageApi, messageContextHolder] = message.useMessage();

  const submitHandler = (value) => {
    let url = `${host}/api/admin/project-category/create`;
    let method = 'post';

    if (state?.isEdit) {
      url = `${host}/api/admin/project-category/edit/${state._id}`;
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

        setTimeout(() => navigate('/dashboard', { replace: true }), 3000);
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

      <h2>New category</h2>

      <div className='form-container'>
        <Form
          className={`form ${style.form}`}
          form={form}
          onFinish={submitHandler}
          layout='vertical'
        >
          <Form.Item
            name='name'
            label='Category'
            rules={[
              {
                required: true,
                message: 'Please enter category!',
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
                message: 'Please describe shortly about the category!',
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
                message: 'Please describe in detail about the category!',
              },
            ]}
          >
            <Input.TextArea rows={4} allowClear />
          </Form.Item>

          <div className={style['flex-container']}>
            <Form.Item
              name='priority'
              label='Priority'
              rules={[
                {
                  required: true,
                  message: 'From 1 to 5',
                },
              ]}
            >
              <InputNumber min={1} max={5} />
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
          </div>

          <Form.Item>
            <div className='button-container'>
              <Button type='primary' htmlType='submit'>
                Save
              </Button>

              <Button onClick={() => navigate('/dashboard', { replace: true })}>
                Cancel
              </Button>
            </div>
          </Form.Item>
        </Form>

        <div className='img-container'>
          <img
            src={PrototypeWithBulbConcept}
            alt='Prototype with bulb concept'
          />
        </div>
      </div>
    </>
  );
};

export default NewCategory;
