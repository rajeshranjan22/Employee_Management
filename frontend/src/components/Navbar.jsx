import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { EmployeeContext } from '../context/EmployeeContext';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { searchTerm, setSearchTerm } = useContext(EmployeeContext);

  return (
    <div style={{
      height: '70px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      borderBottom: '1px solid var(--border-color)',
      background: 'var(--primary-bg)',
      zIndex: 10
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: 'var(--secondary-bg)',
        padding: '0.5rem 1rem',
        borderRadius: '20px',
        width: '300px',
        border: '1px solid var(--border-color)'
      }}>
        <SearchIcon style={{ color: 'var(--text-muted)', marginRight: '10px' }} />
        <input 
          type="text" 
          placeholder="Search employees..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-main)',
            outline: 'none',
            width: '100%'
          }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <NotificationsIcon style={{ color: 'var(--text-muted)', cursor: 'pointer' }} className="hover-scale" />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} className="hover-scale">
          <AccountCircleIcon style={{ color: 'var(--accent-color)' }} fontSize="large" />
          <span style={{ fontWeight: '500' }}>{user?.name || 'Admin'}</span>
        </div>
        <div onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--danger-color)' }} className="hover-scale">
          <LogoutIcon />
          <span style={{ fontWeight: '500' }}>Logout</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
