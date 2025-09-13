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
  const { user, logout, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    organization: user?.organization || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Sync profileData with user data when user changes
  React.useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        organization: user.organization || '',
      });
    }
  }, [user]);

  // New: State for profile photo preview
  const [profilePhoto, setProfilePhoto] = useState('../../assets/LogoIcon.png');
  const fileInputRef = useRef(null);

  // New: State for password change modal
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  /**
   * Handles change password action
   */
  const handleChangePassword = () => {
    setPasswordModalOpen(true);
  };

  const handleSubmitPassword = (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill in all fields.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }
    // Here, you would call your API to change the password.
    setPasswordSuccess('Password changed successfully!');
    setTimeout(() => {
      setPasswordModalOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordSuccess('');
    }, 1200);
  };

  /**
   * Handles edit profile action
   */
  const handleEditProfile = async () => {
    if (isEditing) {
      // Save changes
      setIsLoading(true);
      setError('');
      setSuccessMessage('');
      
      try {
        // Validate required fields
        if (!profileData.fullName.trim()) {
          setError('Full name is required');
          return;
        }
        
        if (!profileData.email.trim()) {
          setError('Email is required');
          return;
        }
        
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(profileData.email)) {
          setError('Please enter a valid email address');
          return;
        }
        
        // Update profile
        const success = await updateProfile({
          fullName: profileData.fullName.trim(),
          email: profileData.email.trim(),
          phone: profileData.phone.trim() || undefined,
        });
        
        if (success) {
          setSuccessMessage('Profile updated successfully!');
          setIsEditing(false);
          // Clear success message after 3 seconds
          setTimeout(() => setSuccessMessage(''), 3000);
        } else {
          setError('Failed to update profile. Please try again.');
        }
      } catch (error) {
        setError('An error occurred while updating your profile.');
        console.error('Profile update error:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsEditing(true);
      setError('');
      setSuccessMessage('');
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
      <div className="innerContainer">
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
              <div style={styles.editButtons}>
                {isEditing ? (
                  <>
                    <button
                      style={isLoading ? styles.cancelButtonDisabled : styles.cancelButton}
                      onClick={() => {
                        setIsEditing(false);
                        setProfileData({
                          fullName: user?.fullName || '',
                          email: user?.email || '',
                          phone: user?.phone || '',
                          organization: user?.organization || '',
                        });
                        setError('');
                        setSuccessMessage(''); // Clear success message on cancel
                      }}
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      style={isLoading ? styles.editButtonDisabled : styles.editButton}
                      onClick={handleEditProfile}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </>
                ) : (
                  <button
                    style={styles.editButton}
                    onClick={handleEditProfile}
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div style={styles.errorContainer}>
                <span style={styles.errorText}>{error}</span>
              </div>
            )}

            {/* Success Message Display */}
            {successMessage && (
              <div style={styles.successContainer}>
                <span style={styles.successText}>{successMessage}</span>
              </div>
            )}

            <div style={styles.infoContainer}>
              {/* Full Name */}
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>
                  Full Name
                  <span style={styles.requiredIndicator}> *</span>
                </span>
                {isEditing ? (
                  <input
                    type="text"
                    style={styles.infoInput}
                    value={profileData.fullName}
                    onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                    placeholder="Enter full name"
                    required
                    onFocus={(e) => e.target.style.borderColor = '#1e3a8a'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                ) : (
                  <span style={styles.infoValue}>{user?.fullName}</span>
                )}
              </div>

              {/* Email */}
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>
                  Email
                  <span style={styles.requiredIndicator}> *</span>
                </span>
                {isEditing ? (
                  <input
                    type="email"
                    style={styles.infoInput}
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    placeholder="Enter email"
                    required
                    onFocus={(e) => e.target.style.borderColor = '#1e3a8a'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
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
                    onFocus={(e) => e.target.style.borderColor = '#1e3a8a'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
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
                <span style={styles.actionButtonText}>Change Password</span>
              </button>
              
              <button style={styles.actionButton} onClick={handleChangePhoto}>
                <span style={styles.actionButtonText}>Update Profile Photo</span>
              </button>
              
              <button style={styles.logoutButton} onClick={handleLogout}>
                <span style={styles.logoutButtonText}>Logout</span>
              </button>
            </div>
          </div>

          {/* Password Change Modal */}
          {isPasswordModalOpen && (
            <div style={modalStyles.overlay}>
              <div style={{ ...modalStyles.modal, maxWidth: 400, width: '100%' }}>
                <h3 style={{ marginBottom: 18, textAlign: 'center', color: '#1e3a8a', fontWeight: 700 }}>Change Password</h3>
                <form onSubmit={handleSubmitPassword} autoComplete="off">
                  {passwordError && (
                    <div style={{ background: '#fef3f2', color: '#b91c1c', border: '1px solid #fca5a5', borderRadius: 8, padding: '10px 14px', marginBottom: 12, fontSize: 14 }}>{passwordError}</div>
                  )}
                  {passwordSuccess && (
                    <div style={{ background: '#e0f2f7', color: '#047857', border: '1px solid #90cdf4', borderRadius: 8, padding: '10px 14px', marginBottom: 12, fontSize: 14 }}>{passwordSuccess}</div>
                  )}
                  <div style={modalStyles.formRow}>
                    <label style={modalStyles.label}>Current Password</label>
                    <input
                      type="password"
                      style={{ ...modalStyles.input, marginBottom: 6 }}
                      value={currentPassword}
                      onChange={e => setCurrentPassword(e.target.value)}
                      autoFocus
                      placeholder="Enter current password"
                    />
                  </div>
                  <div style={modalStyles.formRow}>
                    <label style={modalStyles.label}>New Password</label>
                    <input
                      type="password"
                      style={{ ...modalStyles.input, marginBottom: 6 }}
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="At least 8 characters"
                    />
                  </div>
                  <div style={modalStyles.formRow}>
                    <label style={modalStyles.label}>Confirm New Password</label>
                    <input
                      type="password"
                      style={modalStyles.input}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                    />
                  </div>
                  <div style={modalStyles.buttonRow}>
                    <button
                      type="submit"
                      style={{ ...modalStyles.saveButton, minWidth: 90 }}
                      disabled={!!passwordSuccess}
                    >
                      {passwordSuccess ? 'Saved' : 'Submit'}
                    </button>
                    <button
                      type="button"
                      style={modalStyles.cancelButton}
                      onClick={() => {
                        setPasswordModalOpen(false);
                        setPasswordError('');
                        setPasswordSuccess('');
                        setCurrentPassword('');
                        setNewPassword('');
                        setConfirmPassword('');
                      }}
                      disabled={!!passwordSuccess}
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
                                      <span style={styles.permissionItem}>- Manage users and organizations</span>
                <span style={styles.permissionItem}>- View all receipts and statistics</span>
                <span style={styles.permissionItem}>- Manage receipt templates</span>
                <span style={styles.permissionItem}>- Access system settings</span>
                    </>
                  )}
                  {user?.role === 'Encoder' && (
                    <>
                                      <span style={styles.permissionItem}>- Issue new receipts</span>
                <span style={styles.permissionItem}>- View transaction archive</span>
                <span style={styles.permissionItem}>- Verify receipts</span>
                <span style={styles.permissionItem}>- Access FAQ and support</span>
                    </>
                  )}
                  {user?.role === 'Viewer' && (
                    <>
                                      <span style={styles.permissionItem}>- View organization receipts</span>
                <span style={styles.permissionItem}>- Process payments</span>
                <span style={styles.permissionItem}>- Verify receipts</span>
                <span style={styles.permissionItem}>- Access FAQ and support</span>
                    </>
                  )}
                </div>
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
    padding: '10px 14px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    marginTop: '4px',
    marginBottom: '2px',
    boxSizing: 'border-box',
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
    transition: 'background-color 0.2s ease',
  },

  editButtonDisabled: {
    backgroundColor: '#9ca3af',
    color: '#6b7280',
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'not-allowed',
    transition: 'background-color 0.2s ease',
  },

  cancelButton: {
    backgroundColor: '#f3f4f6',
    color: '#374151',
    padding: '8px 16px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    marginRight: '10px',
    transition: 'background-color 0.2s ease',
  },

  cancelButtonDisabled: {
    backgroundColor: '#f3f4f6',
    color: '#9ca3af',
    padding: '8px 16px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'not-allowed',
    marginRight: '10px',
    transition: 'background-color 0.2s ease',
  },
  
  editButtons: {
    display: 'flex',
    gap: '10px',
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
    transition: 'border-color 0.2s ease',
    outline: 'none',
    ':focus': {
      borderColor: '#1e3a8a',
      boxShadow: '0 0 0 3px rgba(30, 58, 138, 0.1)',
    },
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

  errorContainer: {
    backgroundColor: '#fef3f2',
    border: '1px solid #fca5a5',
    borderRadius: '8px',
    padding: '12px 16px',
    marginTop: '16px',
    marginBottom: '16px',
  },

  errorText: {
    fontSize: '14px',
    color: '#991b1b',
    fontWeight: '500',
  },

  successContainer: {
    backgroundColor: '#e0f2f7',
    border: '1px solid #90cdf4',
    borderRadius: '8px',
    padding: '12px 16px',
    marginTop: '16px',
    marginBottom: '16px',
  },

  successText: {
    fontSize: '14px',
    color: '#2b6cb0',
    fontWeight: '500',
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

  requiredIndicator: {
    color: 'red',
    fontSize: '14px',
    fontWeight: '600',
  },
};

export default ProfileScreen;