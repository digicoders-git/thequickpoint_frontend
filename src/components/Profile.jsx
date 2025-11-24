import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { MdEdit, MdSave, MdCancel, MdPerson, MdEmail, MdKey, MdCalendarToday, MdLogout } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import API from '../api/axios';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'admin'
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setProfileData({
      name: user?.name || '',
      email: user?.email || '',
      role: user?.role || 'admin'
    });
  };

  const handleSave = async () => {
    try {
      const result = await Swal.fire({
        title: 'Update Profile?',
        text: 'Are you sure you want to update your profile?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#667eea',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Update!'
      });

      if (result.isConfirmed) {
        await API.put('/admin/profile', profileData);
        setIsEditing(false);
        Swal.fire('Updated!', 'Profile updated successfully.', 'success');
      }
    } catch (error) {
      // console.error('Error updating profile:', error);
      Swal.fire('Error!', 'Failed to update profile.', 'error');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleChangePassword = async () => {
    // Check if dark theme is active
    const isDarkTheme = document.body.classList.contains('dark-theme') || 
                       document.documentElement.classList.contains('dark-theme') ||
                       document.querySelector('.dark-theme');
    
    const { value: formValues } = await Swal.fire({
      title: 'Change Password',
      html:
        '<input id="current-password" type="password" class="swal2-input" placeholder="Current Password" style="background: ' + (isDarkTheme ? '#000000' : '#ffffff') + '; color: ' + (isDarkTheme ? '#ffffff' : '#000000') + '; border: 2px solid ' + (isDarkTheme ? '#333333' : '#e2e8f0') + ';">' +
        '<input id="new-password" type="password" class="swal2-input" placeholder="New Password" style="background: ' + (isDarkTheme ? '#000000' : '#ffffff') + '; color: ' + (isDarkTheme ? '#ffffff' : '#000000') + '; border: 2px solid ' + (isDarkTheme ? '#333333' : '#e2e8f0') + ';">' +
        '<input id="confirm-password" type="password" class="swal2-input" placeholder="Confirm New Password" style="background: ' + (isDarkTheme ? '#000000' : '#ffffff') + '; color: ' + (isDarkTheme ? '#ffffff' : '#000000') + '; border: 2px solid ' + (isDarkTheme ? '#333333' : '#e2e8f0') + ';">',
      background: isDarkTheme ? '#000000' : '#ffffff',
      color: isDarkTheme ? '#ffffff' : '#000000',
      confirmButtonColor: '#fd7e14',
      cancelButtonColor: '#6c757d',
      showCancelButton: true,
      focusConfirm: false,
      customClass: {
        popup: isDarkTheme ? 'dark-swal-popup' : '',
        title: isDarkTheme ? 'dark-swal-title' : '',
        htmlContainer: isDarkTheme ? 'dark-swal-content' : ''
      },
      preConfirm: () => {
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        if (!currentPassword || !newPassword || !confirmPassword) {
          Swal.showValidationMessage('Please fill all fields');
          return false;
        }
        
        if (newPassword !== confirmPassword) {
          Swal.showValidationMessage('New passwords do not match');
          return false;
        }
        
        if (newPassword.length < 6) {
          Swal.showValidationMessage('Password must be at least 6 characters');
          return false;
        }
        
        return { currentPassword, newPassword };
      }
    });

    if (formValues) {
      try {
        await API.put('/admin/change-password', {
          currentPassword: formValues.currentPassword,
          newPassword: formValues.newPassword
        });
        Swal.fire('Success!', 'Password changed successfully.', 'success');
      } catch (error) {
        // console.error('Error changing password:', error);
        Swal.fire('Error!', error.response?.data?.message || 'Failed to change password.', 'error');
      }
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Logout Account?',
      text: 'Are you sure you want to logout from your account?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Logout!'
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate('/login');
        Swal.fire('Logged Out!', 'You have been logged out successfully.', 'success');
      }
    });
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>👤 Admin Profile</h2>
        <div className="profile-actions">
          {!isEditing ? (
            <button onClick={handleEdit} className="edit-btn">
              <MdEdit /> Edit Profile
            </button>
          ) : (
            <div className="edit-actions">
              <button onClick={handleSave} className="save-btn">
                <MdSave /> Save
              </button>
              <button onClick={handleCancel} className="cancel-btn">
                <MdCancel /> Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <h3>{user?.name || 'Admin'}</h3>
            <span className="role-badge">{user?.role || 'Administrator'}</span>
          </div>

          <div className="profile-details">
            <div className="detail-group">
              <label>
                <MdPerson className="detail-icon" />
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  className="profile-input"
                />
              ) : (
                <div className="detail-value">{user?.name || 'Not provided'}</div>
              )}
            </div>

            <div className="detail-group">
              <label>
                <MdEmail className="detail-icon" />
                Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  className="profile-input"
                />
              ) : (
                <div className="detail-value">{user?.email || 'Not provided'}</div>
              )}
            </div>

            <div className="detail-group">
              <label>
                <MdKey className="detail-icon" />
                Role
              </label>
              <div className="detail-value">
                <span className="role-tag">{user?.role || 'Administrator'}</span>
              </div>
            </div>

            <div className="detail-group">
              <label>
                <MdCalendarToday className="detail-icon" />
                Member Since
              </label>
              <div className="detail-value">
                {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>

            <div className="detail-group">
              <label>
                <MdKey className="detail-icon" />
                Change Password
              </label>
              <button 
                onClick={() => handleChangePassword()} 
                className="change-password-btn"
              >
                Update Password
              </button>
            </div>

            <div className="detail-group">
              <label>
                <MdLogout className="detail-icon" />
                Account Actions
              </label>
              <button 
                onClick={() => handleLogout()} 
                className="logout-profile-btn"
              >
                Logout Account
              </button>
            </div>
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-item">
            <div className="stat-number">1</div>
            <div className="stat-label">Admin Account</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">∞</div>
            <div className="stat-label">Full Access</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Active Status</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;