import { useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";
import "./ChangePass.css";

export default function ChangePass() {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      setLoading(false);
      return;
    }

    // Check if dark theme is active
    const isDarkTheme = document.body.classList.contains('dark-theme') || 
                       document.documentElement.classList.contains('dark-theme') ||
                       document.querySelector('.dark-theme');

    const result = await Swal.fire({
      title: 'Change Password?',
      text: 'Are you sure you want to change your password?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#fd7e14',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, Change!',
      background: isDarkTheme ? '#000000' : '#ffffff',
      color: isDarkTheme ? '#ffffff' : '#000000',
      customClass: {
        popup: isDarkTheme ? 'dark-swal-popup' : '',
        title: isDarkTheme ? 'dark-swal-title' : '',
        content: isDarkTheme ? 'dark-swal-content' : ''
      }
    });

    if (result.isConfirmed) {
      try {
        await API.put('/admin/change-password', {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        });
        Swal.fire({
          title: 'Success!',
          text: 'Password changed successfully!',
          icon: 'success',
          confirmButtonColor: '#28a745',
          background: isDarkTheme ? '#000000' : '#ffffff',
          color: isDarkTheme ? '#ffffff' : '#000000',
          customClass: {
            popup: isDarkTheme ? 'dark-swal-popup' : ''
          }
        });
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } catch (err) {
        Swal.fire({
          title: 'Error!',
          text: err.response?.data?.message || 'Failed to change password',
          icon: 'error',
          confirmButtonColor: '#e53e3e',
          background: isDarkTheme ? '#000000' : '#ffffff',
          color: isDarkTheme ? '#ffffff' : '#000000',
          customClass: {
            popup: isDarkTheme ? 'dark-swal-popup' : ''
          }
        });
      }
    }
    setLoading(false);
  };

  return (
    <div className="change-password-container">
      <div className="change-password-form">
        <h2>Change Password</h2>
        <p>Update your password for user: <strong>{user?.name}</strong></p>
        
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Current Password</label>
            <input
              type="password"
              value={formData.currentPassword}
              onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              value={formData.newPassword}
              onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              required
            />
          </div>
          
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
}