import { useLocation } from 'react-router-dom';

import style from './AuthWrapper.module.css';

// ==================================================

const AuthWrapper = ({ children }) => {
  const pathName = useLocation().pathname.split('/')[1];

  return (
    <div className={style.container}>
      <h1>{pathName === 'login' ? 'Đăng nhập' : 'Đăng ký'}</h1>

      {children}
    </div>
  );
};

export default AuthWrapper;
