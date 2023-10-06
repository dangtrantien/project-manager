import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import axios from 'axios';

// ==================================================

const MiniLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('/api/user', { withCredentials: true })
      .then(() => navigate('/dashboard', { replace: true }))
      .catch((error) => {
        console.log(error);

        if (error.response.status === 401) {
          return navigate('/login', { replace: true });
        }
      });
  }, [navigate]);

  return (
    <div className='mini-container'>
      <Outlet />
    </div>
  );
};

export default MiniLayout;
