import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav style={{ padding: '10px', background: '#eee', display: 'flex', justifyContent: 'space-between' }}>
      <h3>CodeCollab</h3>
      <div>
        <span>Welcome, {user?.username || user?.email}</span>
        <button onClick={onLogout} style={{ marginLeft: '10px' }}>
          Logout
        </button>
      </div>
    </nav>
  );
};
export default Navbar;