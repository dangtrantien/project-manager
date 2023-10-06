import { Link } from 'react-router-dom';

import { BiPlus } from 'react-icons/bi';

// ==================================================

const Header = ({ title, linkTo }) => {
  return (
    <div className='header-container'>
      <h2>{title}</h2>

      <Link className='button' to={linkTo}>
        <BiPlus /> Tạo mới
      </Link>
    </div>
  );
};

export default Header;
