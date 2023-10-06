import { Link } from 'react-router-dom';
import { Result } from 'antd';

// ==================================================

const ErrorPage = () => {
  return (
    <Result
      status='404'
      title='404'
      subTitle='Trang bạn tìm kiếm không tồn tại.'
      extra={
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Link className='button' to='/dashboard'>
            Trở về trang chủ
          </Link>
        </div>
      }
    />
  );
};

export default ErrorPage;
