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

import style from './NewClient.module.css';
import Meeting from '../../../asset/images/Lovepik_com-400396590-staff-in-workplace-materials.webp';

// ==================================================

const NewClient = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const { Option } = Select;
  const [notificationApi, notificationContextHolder] =
    notification.useNotification();
  const [messageApi, messageContextHolder] = message.useMessage();

  const submitHandler = (value) => {
    let url = '/api/admin/client/create';
    let method = 'post';

    if (state?.isEdit) {
      url = `/api/admin/client/edit/${state._id}`;
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

        setTimeout(() => navigate('/client', { replace: true }), 3000);
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

      <h2>Khách hàng mới</h2>

      <div className='form-container'>
        <Form
          className={`form ${style.form}`}
          form={form}
          onFinish={submitHandler}
          layout='vertical'
        >
          <Form.Item
            name='name'
            label='Tên khách hàng'
            rules={[
              {
                required: true,
                message: 'Tên khách hàng không được để trống!',
              },
            ]}
          >
            <Input allowClear placeholder='Mời nhập tên khách hàng' />
          </Form.Item>

          <Form.Item
            name='short_desc'
            label='Mô tả ngắn gọn'
            rules={[
              {
                required: true,
                message: 'Mô tả ngắn gọn không được để trống!',
              },
            ]}
          >
            <Input allowClear placeholder='Mô tả ngắn gọn về khách hàng' />
          </Form.Item>

          <Form.Item
            name='long_desc'
            label='Mô tả chi tiết'
            rules={[
              {
                required: true,
                message: 'Mô tả chi tiết không được để trống!',
              },
            ]}
          >
            <Input.TextArea
              rows={4}
              allowClear
              placeholder='Mô tả chi tiết về khách hàng'
            />
          </Form.Item>

          <div className={style['flex-container']}>
            <Form.Item
              name='priority'
              label='Mức độ ưu tiên'
              rules={[
                {
                  required: true,
                  message: 'Trong khoảng từ 1-5',
                },
              ]}
            >
              <InputNumber min={1} max={5} />
            </Form.Item>

            <Form.Item
              name='state'
              label='Trạng thái'
              rules={[
                {
                  required: true,
                  message: 'Trạng thái không được để trống!',
                },
              ]}
              className={style['state-container']}
            >
              <Select placeholder='Mời lựa chọn trạng thái'>
                <Option value='active'>Active</Option>
                <Option value='inactive'>Inactive</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item>
            <div className='button-container'>
              <Button type='primary' htmlType='submit'>
                Lưu
              </Button>

              <Button onClick={() => navigate('/client', { replace: true })}>
                Hủy
              </Button>
            </div>
          </Form.Item>
        </Form>

        <div className='img-container'>
          <img src={Meeting} alt='Meeting' />
        </div>
      </div>
    </>
  );
};

export default NewClient;
