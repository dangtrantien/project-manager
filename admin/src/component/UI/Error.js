import { Link } from 'react-router-dom';
import { Result } from 'antd';

// ==================================================

const ErrorPage = () => {
  return (
    <Result
      status='404'
      title='404'
      subTitle='Sorry, the page you visited does not exist.'
      extra={
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Link className='button' to='/dashboard'>
            Back home
          </Link>
        </div>
      }
    />
  );
};

export default ErrorPage;
