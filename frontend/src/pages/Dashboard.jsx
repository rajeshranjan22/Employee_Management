import React, { useContext } from 'react';
import { EmployeeContext } from '../context/EmployeeContext';
import PeopleAlt from '@mui/icons-material/PeopleAlt';
import WorkOutlinedIcon from '@mui/icons-material/WorkOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';

const StatCard = ({ title, value, icon, color }) => (
  <div className="glass-panel hover-scale" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1 }}>
    <div style={{
      background: `rgba(${color}, 0.1)`,
      padding: '1rem',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: `rgb(${color})`
    }}>
      {icon}
    </div>
    <div>
      <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '500' }}>{title}</h3>
      <div style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--text-main)' }}>{value}</div>
    </div>
  </div>
);

const Dashboard = () => {
  const { employees } = useContext(EmployeeContext);

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(emp => emp.status === 'Active').length;
  const departments = new Set(employees.map(emp => emp.department)).size;

  return (
    <div>
      <h1 style={{ marginBottom: '2rem', fontSize: '2rem', fontWeight: '600' }}>Overview</h1>
      
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <StatCard 
          title="Total Employees" 
          value={totalEmployees} 
          icon={<PeopleAlt fontSize="large" />} 
          color="59, 130, 246" // Blue
        />
        <StatCard 
          title="Active Employees" 
          value={activeEmployees} 
          icon={<CheckCircleOutlinedIcon fontSize="large" />} 
          color="16, 185, 129" // Green
        />
        <StatCard 
          title="Departments" 
          value={departments} 
          icon={<WorkOutlinedIcon fontSize="large" />} 
          color="245, 158, 11" // Amber
        />
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', color: 'var(--text-main)' }}>Recent Activity</h2>
        <div style={{ color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {employees.slice(-3).reverse().map((emp, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1rem', borderBottom: idx !== 2 ? '1px solid var(--border-color)' : 'none' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-color)' }}></div>
              <p>New employee <strong style={{ color: 'var(--text-main)' }}>{emp.name}</strong> added to <strong style={{ color: 'var(--text-main)' }}>{emp.department}</strong></p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
