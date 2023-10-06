import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getEmployeeData } from '../../../store/employee/actions';

import style from './Header.module.css';
import { FaUsers, FaMale, FaFemale, FaUserTie } from 'react-icons/fa';

// ==================================================

const Header = () => {
  const dispatch = useDispatch();

  const employee = useSelector((state) => state.employee);

  useEffect(() => {
    dispatch(getEmployeeData());
  }, [dispatch]);

  return (
    <div className={style.container}>
      <div className={style['card-container']}>
        <div className={style['content-container']}>
          <p className={style.content}>Tổng nhân viên</p>

          <p style={{ color: '#0ca678' }} className={style.number}>
            {employee.total}
          </p>
        </div>

        <div
          style={{
            backgroundColor: '#0ca678',
            boxShadow: '0 2px 16px rgb(12, 166, 120, 0.3)',
          }}
          className={style['icon-container']}
        >
          <FaUsers className={style.icon} />
        </div>
      </div>

      <div className={style['card-container']}>
        <div className={style['content-container']}>
          <p className={style.content}>Tổng nhân viên nam</p>

          <p style={{ color: '#4263eb' }} className={style.number}>
            {employee.data?.filter((e) => e.gender === 'male').length}
          </p>
        </div>

        <div
          style={{
            backgroundColor: '#4263eb',
            boxShadow: '0 2px 16px rgb(66, 99, 235, 0.3)',
          }}
          className={style['icon-container']}
        >
          <FaMale className={style.icon} />
        </div>
      </div>

      <div className={style['card-container']}>
        <div className={style['content-container']}>
          <p className={style.content}>Tổng nhân viên nữ</p>

          <p style={{ color: '#f76707' }} className={style.number}>
            {employee.data?.filter((e) => e.gender === 'female').length}
          </p>
        </div>

        <div
          style={{
            backgroundColor: '#f76707',
            boxShadow: '0 2px 16px rgb(247, 103, 7, 0.3)',
          }}
          className={style['icon-container']}
        >
          <FaFemale className={style.icon} />
        </div>
      </div>

      <div className={style['card-container']}>
        <div className={style['content-container']}>
          <p className={style.content}>Tổng nhân viên mới</p>

          <p style={{ color: '#ae3ec9' }} className={style.number}>
            {
              employee.data?.filter((e) =>
                new Date(e.createdAt).getMonth() === new Date().getMonth()
                  ? e
                  : null
              ).length
            }
          </p>
        </div>

        <div
          style={{
            backgroundColor: '#ae3ec9',
            boxShadow: '0 2px 16px rgb(174, 62, 201, 0.3)',
          }}
          className={style['icon-container']}
        >
          <FaUserTie className={style.icon} />
        </div>
      </div>
    </div>
  );
};

export default Header;
