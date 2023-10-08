import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Outlet, ScrollRestoration } from 'react-router-dom';
import axios from 'axios';

import { userActions } from '../../store/user/slice';
import Sidebar from '../../component/Layout/Sidebar';
import { host } from '../../store';

// ==================================================

const MainLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${host}/api/user`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.data);
        dispatch(userActions.replaceUserState(res.data));
      })
      .catch((error) => {
        console.log(error);

        if (error.response.status === 401) {
          return navigate('/login', { replace: true });
        }
      });
  }, [dispatch, navigate]);

  return (
    <div className='main-container'>
      <Sidebar />

      <main>
        <Outlet />
      </main>

      <ScrollRestoration />
    </div>
  );
};

export default MainLayout;
