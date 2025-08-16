import React, { useState, useRef } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

/**
 * Profile Screen Component
 * Allows users to view and edit their profile information
 * 
 * Features:
 * - Profile photo upload/change
 * - Edit personal information
 * - View role and organization details
 * - Change password functionality
 * - Profile customization options
 */
const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    organization: user?.organization || '',
  });

  // New: State for profile photo preview
  const [profilePhoto, setProfilePhoto] = useState('https://via.placeholder.com/120x120/1e3a8a/ffffff?text=👤');
  const fileInputRef = useRef(null);

  // New: State for password change modal
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  /**
   * Handles change password action
   */
  const handleChangePassword = () => {
    setPasswordModalOpen(true);
  };

  const handleSubmitPassword = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('Please fill all fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    // Here, you would call your API to change the password.
    setPasswordModalOpen(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    alert('Password changed successfully!');
  };

  /**
   * Handles edit profile action
   */
  const handleEditProfile = () => {
    if (isEditing) {
      // Save changes
      alert('Profile Updated\n\nYour profile changes have been saved successfully.');
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  /**
   * Handles change profile photo action
   */
  const handleChangePhoto = () => {
    fileInputRef.current.click();
  };

  // New: Handler for file input
  const handlePhotoSelected = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfilePhoto(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * Gets the role display name based on user role
   * @param {string} role - User's role
   * @returns {string} Formatted role display name
   */
  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'Admin':
        return 'System Administrator';
      case 'Encoder':
        return 'Receipt Encoder';
      case 'Viewer':
        return 'Organization Member';
      default:
        return role;
    }
  };

  /**
   * Handles logout confirmation
   */
  const handleLogout = async () => {
    const confirmed = window.confirm('Are you sure you want to log out?');
    if (confirmed) {
      await logout();
    }
  };

  return (
    <Layout title="Profile" showBackButton={true}>
      <div style={styles.container}>
        <div style={styles.content}>
          {/* Profile Photo Section */}
          <div style={styles.photoSection}>
            <div style={styles.photoContainer} onClick={handleChangePhoto}>
              <img
                src={profilePhoto}
                alt="Profile"
                style={styles.profilePhoto}
              />
              <div style={styles.photoOverlay}>
                <span style={styles.photoOverlayText}>Change</span>
              </div>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handlePhotoSelected}
              />
            </div>
          </div>

          {/* Profile Information */}
          <div style={styles.infoSection}>
            <div style={styles.infoHeader}>
              <h3 style={styles.infoTitle}>Personal Information</h3>
              <button
                style={styles.editButton}
                onClick={handleEditProfile}
              >
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </button>
            </div>

            <div style={styles.infoContainer}>
              {/* Full Name */}
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Full Name</span>
                {isEditing ? (
                  <input
                    type="text"
                    style={styles.infoInput}
                    value={profileData.fullName}
                    onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                    placeholder="Enter full name"
                  />
                ) : (
                  <span style={styles.infoValue}>{user?.fullName}</span>
                )}
              </div>

              {/* Email */}
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Email</span>
                {isEditing ? (
                  <input
                    type="email"
                    style={styles.infoInput}
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    placeholder="Enter email"
                  />
                ) : (
                  <span style={styles.infoValue}>{user?.email}</span>
                )}
              </div>

              {/* Phone */}
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Phone</span>
                {isEditing ? (
                  <input
                    type="tel"
                    style={styles.infoInput}
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    placeholder="Enter phone number"
                  />
                ) : (
                  <span style={styles.infoValue}>{user?.phone || 'Not provided'}</span>
                )}
              </div>

              {/* Role (Read-only) */}
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Role</span>
                <span style={styles.infoValue}>{getRoleDisplayName(user?.role)}</span>
              </div>

              {/* Organization (Read-only) */}
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Organization</span>
                <span style={styles.infoValue}>{user?.organization}</span>
              </div>

              {/* Account Status (Read-only) */}
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Account Status</span>
                <div style={styles.statusBadge}>
                  <span style={styles.statusText}>
                    {user?.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div style={styles.actionsSection}>
            <h3 style={styles.actionsTitle}>Account Actions</h3>
            
            <div style={styles.actionsList}>
              <button style={styles.actionButton} onClick={handleChangePassword}>
                <span style={styles.actionButtonText}>🔒 Change Password</span>
              </button>
              
              <button style={styles.actionButton} onClick={handleChangePhoto}>
                <span style={styles.actionButtonText}>📸 Update Profile Photo</span>
              </button>
              
              <button style={styles.logoutButton} onClick={handleLogout}>
                <span style={styles.logoutButtonText}>🚪 Logout</span>
              </button>
            </div>
          </div>

          {/* Password Change Modal */}
          {isPasswordModalOpen && (
            <div style={modalStyles.overlay}>
              <div style={modalStyles.modal}>
                <h3 style={{ marginBottom: 10 }}>Change Password</h3>
                <form onSubmit={handleSubmitPassword}>
                  <div style={modalStyles.formRow}>
                    <label style={modalStyles.label}>Current Password</label>
                    <input
                      type="password"
                      style={modalStyles.input}
                      value={currentPassword}
                      onChange={e => setCurrentPassword(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <div style={modalStyles.formRow}>
                    <label style={modalStyles.label}>New Password</label>
                    <input
                      type="password"
                      style={modalStyles.input}
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div style={modalStyles.formRow}>
                    <label style={modalStyles.label}>Confirm New Password</label>
                    <input
                      type="password"
                      style={modalStyles.input}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <div style={modalStyles.buttonRow}>
                    <button
                      type="submit"
                      style={modalStyles.saveButton}
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      style={modalStyles.cancelButton}
                      onClick={() => setPasswordModalOpen(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Role Information */}
          <div style={styles.roleSection}>
            <h3 style={styles.roleTitle}>Role Information</h3>
            <div style={styles.roleContainer}>
              <div style={styles.roleItem}>
                <h4 style={styles.roleItemTitle}>Current Role</h4>
                <p style={styles.roleItemText}>{getRoleDisplayName(user?.role)}</p>
              </div>
              
              <div style={styles.roleItem}>
                <h4 style={styles.roleItemTitle}>Permissions</h4>
                <div style={styles.permissionsList}>
                  {user?.role === 'Admin' && (
                    <>
                      <span style={styles.permissionItem}>• Manage users and organizations</span>
                      <span style={styles.permissionItem}>• View all receipts and statistics</span>
                      <span style={styles.permissionItem}>• Manage receipt templates</span>
                      <span style={styles.permissionItem}>• Access system settings</span>
                    </>
                  )}
                  {user?.role === 'Encoder' && (
                    <>
                      <span style={styles.permissionItem}>• Issue new receipts</span>
                      <span style={styles.permissionItem}>• View transaction archive</span>
                      <span style={styles.permissionItem}>• Verify receipts</span>
                      <span style={styles.permissionItem}>• Access FAQ and support</span>
                    </>
                  )}
                  {user?.role === 'Viewer' && (
                    <>
                      <span style={styles.permissionItem}>• View organization receipts</span>
                      <span style={styles.permissionItem}>• Process payments</span>
                      <span style={styles.permissionItem}>• Verify receipts</span>
                      <span style={styles.permissionItem}>• Access FAQ and support</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Modal styles for the password change dialog
const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
    zIndex: 1000,
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  modal: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
    minWidth: '320px',
    maxWidth: '90vw'
  },
  formRow: {
    marginBottom: '14px'
  },
  label: {
    display: 'block',
    marginBottom: '4px',
    fontSize: '14px',
    color: '#374151',
    fontWeight: 600
  },
  input: {
    width: '100%',
    padding: '8px 10px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px'
  },
  buttonRow: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end',
    marginTop: '20px'
  },
  saveButton: {
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 18px',
    fontWeight: 600,
    cursor: 'pointer'
  },
  cancelButton: {
    backgroundColor: '#9ca3af',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 18px',
    fontWeight: 600,
    cursor: 'pointer'
  }
};

/**
 * Styles for the ProfileScreen component
 */
const styles = {
  container: {
    backgroundColor: '#f5f5f5',
    minHeight: '100%',
  },
  
  content: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  
  photoSection: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  
  photoContainer: {
    position: 'relative',
    display: 'inline-block',
    cursor: 'pointer',
  },
  
  profilePhoto: {
    width: '120px',
    height: '120px',
    borderRadius: '60px',
    border: '4px solid #1e3a8a',
    objectFit: 'cover',
  },
  
  photoOverlay: {
    position: 'absolute',
    bottom: '0',
    left: '0',
    right: '0',
    backgroundColor: 'rgba(30, 58, 138, 0.8)',
    color: 'white',
    padding: '8px',
    borderBottomLeftRadius: '60px',
    borderBottomRightRadius: '60px',
    textAlign: 'center',
  },
  
  photoOverlayText: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'white',
  },
  
  infoSection: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  
  infoHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    paddingBottom: '12px',
    borderBottom: '2px solid #e5e7eb',
  },
  
  infoTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#374151',
    margin: 0,
  },
  
  editButton: {
    backgroundColor: '#1e3a8a',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  
  infoContainer: {
    display: 'grid',
    gap: '16px',
  },
  
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid #f3f4f6',
  },
  
  infoLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#6b7280',
    minWidth: '120px',
  },
  
  infoValue: {
    fontSize: '14px',
    color: '#374151',
    fontWeight: '500',
  },
  
  infoInput: {
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    padding: '8px 12px',
    fontSize: '14px',
    backgroundColor: 'white',
    minWidth: '200px',
  },
  
  statusBadge: {
    backgroundColor: '#10b981',
    padding: '4px 12px',
    borderRadius: '12px',
    textAlign: 'center',
  },
  
  statusText: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'white',
  },
  
  actionsSection: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  
  actionsTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '16px',
    margin: '0 0 16px 0',
  },
  
  actionsList: {
    display: 'grid',
    gap: '12px',
  },
  
  actionButton: {
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '16px',
    cursor: 'pointer',
    textAlign: 'left',
    fontSize: '16px',
    fontWeight: '500',
    color: '#374151',
  },
  
  actionButtonText: {
    color: '#374151',
  },
  
  logoutButton: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    padding: '16px',
    cursor: 'pointer',
    textAlign: 'left',
    fontSize: '16px',
    fontWeight: '500',
    color: '#dc2626',
  },
  
  logoutButtonText: {
    color: '#dc2626',
  },
  
  roleSection: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  
  roleTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '16px',
    margin: '0 0 16px 0',
  },
  
  roleContainer: {
    display: 'grid',
    gap: '20px',
  },
  
  roleItem: {
    padding: '16px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
  },
  
  roleItemTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px',
    margin: '0 0 8px 0',
  },
  
  roleItemText: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
  },
  
  permissionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  
  permissionItem: {
    fontSize: '14px',
    color: '#6b7280',
    lineHeight: '1.4',
  },
};

export default ProfileScreen;