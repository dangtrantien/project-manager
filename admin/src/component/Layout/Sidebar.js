import { useNavigate, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

import { host } from '../../store';

import style from './Sidebar.module.css';
import { GoProjectRoadmap } from 'react-icons/go';
import { BsListCheck, BsDatabase } from 'react-icons/bs';
import { RiHomeOfficeLine } from 'react-icons/ri';
import { GrClose } from 'react-icons/gr';
import { AiOutlineProject, AiOutlineMenu } from 'react-icons/ai';
import { TfiFiles } from 'react-icons/tfi';
import { FiUsers, FiUser } from 'react-icons/fi';
import { BiLogOut } from 'react-icons/bi';

// ==================================================

const Sidebar = () => {
  const navigate = useNavigate();

  const user = useSelector((state) => state.user);

  const logoutHandler = async () => {
    await axios.get(`${host}/api/logout`, {
      withCredentials: true,
    });

    return navigate('/login', { replace: true });
  };

  const toggleNavHandler = () => {
    document.querySelector('#sidebar').classList.toggle(`${style['nav-open']}`);
  };

  const closeNavHandler = () => {
    document.querySelector('#sidebar').classList.remove(`${style['nav-open']}`);
  };

  return (
    <div id='sidebar' className={style.container}>
      <div className={style['header-container']}>
        <div className={style['profile-container']}>
          <img
            className={style['profile-icon']}
            src='https://img.icons8.com/nolan/64/user-default.png'
            alt='user-default'
          />

          <p>{user.displayName}</p>
        </div>

        <div className={style['button-mobile-nav']} onClick={toggleNavHandler}>
          <AiOutlineMenu name='menu' className={style['icon-mobile']} />
          <GrClose name='close' className={style['icon-mobile']} />
        </div>
      </div>

      <div className={style.nav}>
        <div>
          <p>List</p>

          <ul>
            <li>
              <NavLink
                to='/dashboard'
                className={({ isActive }) => (isActive ? style.active : null)}
                onClick={closeNavHandler}
              >
                <GoProjectRoadmap /> Project category
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/project-state'
                className={({ isActive }) => (isActive ? style.active : null)}
                onClick={closeNavHandler}
              >
                <BsListCheck /> Project state
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/tech-stack'
                className={({ isActive }) => (isActive ? style.active : null)}
                onClick={closeNavHandler}
              >
                <BsDatabase /> Tech stack
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/client'
                className={({ isActive }) => (isActive ? style.active : null)}
                onClick={closeNavHandler}
              >
                <FiUsers /> Client
              </NavLink>
            </li>
          </ul>
        </div>

        <div>
          <p>Manage</p>

          <ul>
            <li>
              <NavLink
                to='/department'
                className={({ isActive }) => (isActive ? style.active : null)}
                onClick={closeNavHandler}
              >
                <RiHomeOfficeLine /> Department
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/employee'
                className={({ isActive }) => (isActive ? style.active : null)}
                onClick={closeNavHandler}
              >
                <FiUser /> Employee
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/project'
                className={({ isActive }) => (isActive ? style.active : null)}
                onClick={closeNavHandler}
              >
                <AiOutlineProject /> Project
              </NavLink>
            </li>
          </ul>
        </div>

        <div>
          <p>Report</p>

          <ul>
            <li>
              <NavLink
                to='/total-project'
                className={({ isActive }) => (isActive ? style.active : null)}
                onClick={closeNavHandler}
              >
                <TfiFiles /> Project quantity
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/total-employee'
                className={({ isActive }) => (isActive ? style.active : null)}
                onClick={closeNavHandler}
              >
                <FiUsers /> Employee quantity
              </NavLink>
            </li>
          </ul>
        </div>

        <button
          type='button'
          className={`button ${style['logout-button']}`}
          onClick={logoutHandler}
        >
          <BiLogOut /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
