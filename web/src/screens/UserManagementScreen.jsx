import React, { useState } from 'react';
import Layout from '../components/Layout';
import { mockUsers, mockOrganizations } from '../data/mockData';
import { useInlineNotification } from '../components/InlineNotificationSystem';

/**
 * User Management Screen Component
 * Allows administrators to manage users, assign roles, and remove users
 * 
 * Features:
 * - View all users in the system
 * - Add new users
 * - Edit user roles and permissions
 * - Remove users from the system
 * - Filter users by organization or role
 * - User status management
 */
const UserManagementScreen = () => {
  const { showSuccess, showError, showWarning } = useInlineNotification();
  const [users, setUsers] = useState(mockUsers);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filterRole, setFilterRole] = useState('all');
  const [filterOrg, setFilterOrg] = useState('all');
  const [newUser, setNewUser] = useState({
    fullName: '',
    email: '',
    phone: '',
    organization: '',
    role: 'Viewer',
    isActive: true,
  });
  const [addUserErrorModal, setAddUserErrorModal] = useState(false);
  const [addUserSuccessModal, setAddUserSuccessModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userToRemove, setUserToRemove] = useState(null);

  /**
   * Filters users based on selected role and organization
   * @returns {Array} Filtered list of users
   */
  const getFilteredUsers = () => {
    return users.filter(user => {
      const roleMatch = filterRole === 'all' || user.role === filterRole;
      const orgMatch = filterOrg === 'all' || user.organization === filterOrg;
      return roleMatch && orgMatch;
    });
  };

  /**
   * Handles adding a new user
   * Validates input and adds user to the list
   */
  const handleAddUser = () => {
    if (!newUser.fullName.trim() || !newUser.email.trim() || !newUser.organization.trim()) {
      setAddUserErrorModal(true);
      return;
    }

    const user = {
      id: `user_${Date.now()}`,
      username: newUser.email.split('@')[0],
      password: 'password123', // Default password
      ...newUser,
    };

    setUsers([...users, user]);
    setNewUser({
      fullName: '',
      email: '',
      phone: '',
      organization: '',
      role: 'Viewer',
      isActive: true,
    });
    setShowAddModal(false);
    setAddUserSuccessModal(true);
      {/* Success Modal for Add User */}
      {addUserSuccessModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: '#fff', borderRadius: 12, padding: '32px 24px', minWidth: 320, boxShadow: '0 4px 24px rgba(0,0,0,0.18)', textAlign: 'center', position: 'relative'
          }}>
            <div style={{ fontSize: 24, fontWeight: 600, color: '#10b981', marginBottom: 12 }}>User Added Successfully</div>
            <div style={{ color: '#555', marginBottom: 24 }}>The new user has been added to the system.</div>
            <button
              onClick={() => setAddUserSuccessModal(false)}
              style={{
                background: '#10b981', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 28px', fontWeight: 500, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px rgba(16,185,129,0.08)'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
  };

  /**
   * Handles editing an existing user
   * Updates user information in the list
   */
  const handleEditUser = () => {
    if (!selectedUser) return;

    const updatedUsers = users.map(user =>
      user.id === selectedUser.id ? { ...user, ...selectedUser } : user
    );
    setUsers(updatedUsers);
    setShowEditModal(false);
    setSelectedUser(null);
    showSuccess('User updated successfully!', 'Success');
  };

  /**
   * Handles removing a user from the system
   * Shows confirmation dialog before removal
   */
  const handleRemoveUser = (user) => {
    setUserToRemove(user);
    setShowConfirmModal(true);
  };

  /**
   * Confirms user removal
   */
  const confirmRemoveUser = () => {
    if (userToRemove) {
      const updatedUsers = users.filter(u => u.id !== userToRemove.id);
      setUsers(updatedUsers);
      showSuccess('User removed successfully!', 'Success');
    }
    setShowConfirmModal(false);
    setUserToRemove(null);
  };

  /**
   * Cancels user removal
   */
  const cancelRemoveUser = () => {
    setShowConfirmModal(false);
    setUserToRemove(null);
  };

  /**
   * Opens the edit modal for a specific user
   * @param {Object} user - User to edit
   */
  const openEditModal = (user) => {
    setSelectedUser({ ...user });
    setShowEditModal(true);
  };

  /**
   * Toggles user active status
   * @param {Object} user - User to toggle status for
   */
  const toggleUserStatus = (user) => {
    const updatedUsers = users.map(u =>
      u.id === user.id ? { ...u, isActive: !u.isActive } : u
    );
    setUsers(updatedUsers);
    showSuccess(`User ${user.isActive ? 'deactivated' : 'activated'} successfully!`, 'Success');
  };

  /**
   * Gets role color for display
   * @param {string} role - User role
   * @returns {string} Color for role badge
   */
  const getRoleColor = (role) => {
    const colors = {
      Admin: '#ef4444',
      Encoder: '#f59e0b',
      Viewer: '#10b981',
    };
    return colors[role] || '#6b7280';
  };

  /**
   * Handles input changes for forms
   * @param {string} field - Field name to update
   * @param {any} value - New value for the field
   * @param {string} target - Target object to update (newUser or selectedUser)
   */
  const handleInputChange = (field, value, target = 'new') => {
    if (target === 'new') {
      setNewUser(prev => ({ ...prev, [field]: value }));
    } else {
      setSelectedUser(prev => ({ ...prev, [field]: value }));
    }
  };

  const filteredUsers = getFilteredUsers();

  /**
   * Add User Modal Component
   */
  const AddUserModal = () => (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <div style={styles.modalHeader}>
          <h3 style={styles.modalTitle}>Add New User</h3>
          <button 
            style={styles.closeButton}
            onClick={() => setShowAddModal(false)}
          >
            X
          </button>
        </div>
        
        <div style={styles.modalBody}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name *</label>
            <input
              type="text"
              style={styles.input}
              value={newUser.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder="Enter full name"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email *</label>
            <input
              type="email"
              style={styles.input}
              value={newUser.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter email address"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Phone Number</label>
            <input
              type="tel"
              style={styles.input}
              value={newUser.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="Enter phone number"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Organization *</label>
            <select
              style={styles.select}
              value={newUser.organization}
              onChange={(e) => handleInputChange('organization', e.target.value)}
            >
              <option value="">Select organization</option>
              {mockOrganizations.map((org) => (
                <option key={org.id} value={org.name}>
                  {org.name}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Role</label>
            <select
              style={styles.select}
              value={newUser.role}
              onChange={(e) => handleInputChange('role', e.target.value)}
            >
              <option value="Viewer">Viewer</option>
              <option value="Encoder">Encoder</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div style={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="isActive"
              checked={newUser.isActive}
              onChange={(e) => handleInputChange('isActive', e.target.checked)}
            />
            <label htmlFor="isActive" style={styles.checkboxLabel}>Active User</label>
          </div>
        </div>
        
        <div style={styles.modalFooter}>
          <button
            style={styles.cancelButton}
            onClick={() => setShowAddModal(false)}
          >
            Cancel
          </button>
          <button
            style={styles.saveButton}
            onClick={handleAddUser}
          >
            Add User
          </button>
        </div>
      </div>
    </div>
  );

  /**
   * Edit User Modal Component
   */
  const EditUserModal = () => (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <div style={styles.modalHeader}>
          <h3 style={styles.modalTitle}>Edit User</h3>
          <button 
            style={styles.closeButton}
            onClick={() => setShowEditModal(false)}
          >
            X
          </button>
        </div>
        
        <div style={styles.modalBody}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name *</label>
            <input
              type="text"
              style={styles.input}
              value={selectedUser?.fullName || ''}
              onChange={(e) => handleInputChange('fullName', e.target.value, 'edit')}
              placeholder="Enter full name"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email *</label>
            <input
              type="email"
              style={styles.input}
              value={selectedUser?.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value, 'edit')}
              placeholder="Enter email address"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Phone Number</label>
            <input
              type="tel"
              style={styles.input}
              value={selectedUser?.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value, 'edit')}
              placeholder="Enter phone number"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Organization *</label>
            <select
              style={styles.select}
              value={selectedUser?.organization || ''}
              onChange={(e) => handleInputChange('organization', e.target.value, 'edit')}
            >
              <option value="">Select organization</option>
              {mockOrganizations.map((org) => (
                <option key={org.id} value={org.name}>
                  {org.name}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Role</label>
            <select
              style={styles.select}
              value={selectedUser?.role || ''}
              onChange={(e) => handleInputChange('role', e.target.value, 'edit')}
            >
              <option value="Viewer">Viewer</option>
              <option value="Encoder">Encoder</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div style={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="editIsActive"
              checked={selectedUser?.isActive || false}
              onChange={(e) => handleInputChange('isActive', e.target.checked, 'edit')}
            />
            <label htmlFor="editIsActive" style={styles.checkboxLabel}>Active User</label>
          </div>
        </div>
        
        <div style={styles.modalFooter}>
          <button
            style={styles.cancelButton}
            onClick={() => setShowEditModal(false)}
          >
            Cancel
          </button>
          <button
            style={styles.saveButton}
            onClick={handleEditUser}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <Layout title="User Management" showBackButton={true}>
      <div className="innerContainer">
        <div style={styles.container}>
          <div style={styles.content}>
          {/* Header */}
          <div style={styles.header}>
            <h2 style={styles.title}>User Management</h2>
            <p style={styles.subtitle}>Manage users, roles, and permissions</p>
          </div>

          {/* Controls */}
          <div style={styles.controls}>
            <div style={styles.filters}>
              <select
                style={styles.filterSelect}
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="Encoder">Encoder</option>
                <option value="Viewer">Viewer</option>
              </select>

              <select
                style={styles.filterSelect}
                value={filterOrg}
                onChange={(e) => setFilterOrg(e.target.value)}
              >
                <option value="all">All Organizations</option>
                {mockOrganizations.map((org) => (
                  <option key={org.id} value={org.name}>
                    {org.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              style={styles.addButton}
              onClick={() => setShowAddModal(true)}
            >
              + Add User
            </button>
          </div>

          {/* Statistics */}
          <div style={styles.statsContainer}>
            <div style={styles.statCard}>
              <h4 style={styles.statTitle}>Total Users</h4>
              <p style={styles.statValue}>{filteredUsers.length}</p>
            </div>
            <div style={styles.statCard}>
              <h4 style={styles.statTitle}>Active Users</h4>
              <p style={styles.statValue}>
                {filteredUsers.filter(u => u.isActive).length}
              </p>
            </div>
            <div style={styles.statCard}>
              <h4 style={styles.statTitle}>Admins</h4>
              <p style={styles.statValue}>
                {filteredUsers.filter(u => u.role === 'Admin').length}
              </p>
            </div>
            <div style={styles.statCard}>
              <h4 style={styles.statTitle}>Encoders</h4>
              <p style={styles.statValue}>
                {filteredUsers.filter(u => u.role === 'Encoder').length}
              </p>
            </div>
          </div>

          {/* Users List */}
          <div style={styles.usersContainer}>
            <h3 style={styles.sectionTitle}>
              Users ({filteredUsers.length})
            </h3>
            
            {filteredUsers.length === 0 ? (
              <div style={styles.emptyState}>
                <p style={styles.emptyStateText}>No users found</p>
                <p style={styles.emptyStateSubtext}>
                  {filterRole !== 'all' || filterOrg !== 'all' 
                    ? 'Try adjusting your filters'
                    : 'Add your first user to get started'
                  }
                </p>
              </div>
            ) : (
              <div style={styles.usersList}>
                {filteredUsers.map((user) => (
                  <div key={user.id} style={styles.userCard}>
                    <div style={styles.userHeader}>
                      <div style={styles.userInfo}>
                        <h4 style={styles.userName}>{user.fullName}</h4>
                        <p style={styles.userEmail}>{user.email}</p>
                        <p style={styles.userOrg}>{user.organization}</p>
                      </div>
                      <div style={styles.userBadges}>
                        <div style={{
                          ...styles.roleBadge,
                          backgroundColor: getRoleColor(user.role)
                        }}>
                          <span style={styles.roleBadgeText}>{user.role}</span>
                        </div>
                        <div style={{
                          ...styles.statusBadge,
                          backgroundColor: user.isActive ? '#10b981' : '#ef4444'
                        }}>
                          <span style={styles.statusText}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={styles.userBody}>
                      <div style={styles.userDetail}>
                        <span style={styles.detailLabel}>Username:</span>
                        <span style={styles.detailValue}>{user.username}</span>
                      </div>
                      {user.phone && (
                        <div style={styles.userDetail}>
                          <span style={styles.detailLabel}>Phone:</span>
                          <span style={styles.detailValue}>{user.phone}</span>
                        </div>
                      )}
                    </div>

                    <div style={styles.userActions}>
                      <button
                        style={styles.editButton}
                        onClick={() => openEditModal(user)}
                      >
                        Edit
                      </button>
                      <button
                        style={user.isActive ? styles.deactivateButton : styles.activateButton}
                        onClick={() => toggleUserStatus(user)}
                      >
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        style={styles.removeButton}
                        onClick={() => handleRemoveUser(user)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        </div>

        {/* Modals */}
        {showAddModal && <AddUserModal />}
        {showEditModal && <EditUserModal />}
        
        {/* Confirmation Modal for User Removal */}
        {showConfirmModal && userToRemove && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
              <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>Confirm User Removal</h3>
                <button 
                  style={styles.closeButton}
                  onClick={cancelRemoveUser}
                >
                  X
                </button>
              </div>
              
              <div style={styles.modalBody}>
                <div style={styles.confirmMessage}>
                  <p style={styles.confirmText}>
                    Are you sure you want to remove <strong>"{userToRemove.fullName}"</strong>?
                  </p>
                  <p style={styles.confirmSubtext}>
                    This action cannot be undone. The user will be permanently removed from the system.
                  </p>
                </div>
              </div>
              
              <div style={styles.modalFooter}>
                <button
                  style={styles.cancelButton}
                  onClick={cancelRemoveUser}
                >
                  Cancel
                </button>
                <button
                  style={styles.removeConfirmButton}
                  onClick={confirmRemoveUser}
                >
                  Remove User
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Modal for Add User Required Fields */}
        {addUserErrorModal && (
          <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <div style={{
              background: '#fff', borderRadius: 12, padding: '32px 24px', minWidth: 320, boxShadow: '0 4px 24px rgba(0,0,0,0.18)', textAlign: 'center', position: 'relative'
            }}>
              <div style={{ fontSize: 24, fontWeight: 600, color: '#1e3a8a', marginBottom: 12 }}>Missing Required Fields</div>
              <div style={{ color: '#000000ff', marginBottom: 24 }}>Please fill in all required fields before adding a new user.</div>
              <button
                onClick={() => setAddUserErrorModal(false)}
                style={{
                  background: '#1e3a8a', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 28px', fontWeight: 500, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px rgba(211,47,47,0.08)'
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

/**
 * Styles for the UserManagementScreen component
 */
const styles = {
  container: {
    backgroundColor: '#f5f5f5',
    minHeight: '100%',
  },
  
  content: {
    maxWidth: '1000px',
    margin: '0 auto',
  },
  
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: '8px',
    margin: '0 0 8px 0',
  },
  
  subtitle: {
    fontSize: '16px',
    color: '#6b7280',
    margin: 0,
  },
  
  controls: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  
  filters: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  
  filterSelect: {
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '14px',
    backgroundColor: 'white',
  },
  
  addButton: {
    backgroundColor: '#1e3a8a',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  
  statCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  
  statTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: '8px',
    margin: '0 0 8px 0',
  },
  
  statValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1e3a8a',
    margin: 0,
  },
  
  usersContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '20px',
    margin: '0 0 20px 0',
  },
  
  usersList: {
    display: 'grid',
    gap: '16px',
  },
  
  userCard: {
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '20px',
    backgroundColor: '#f9fafb',
  },
  
  userHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
  
  userInfo: {
    flex: 1,
  },
  
  userName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '4px',
    margin: '0 0 4px 0',
  },
  
  userEmail: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '2px',
    margin: '0 0 2px 0',
  },
  
  userOrg: {
    fontSize: '12px',
    color: '#9ca3af',
    margin: 0,
  },
  
  userBadges: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  
  roleBadge: {
    padding: '4px 8px',
    borderRadius: '12px',
    textAlign: 'center',
  },
  
  roleBadgeText: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'white',
  },
  
  statusBadge: {
    padding: '4px 8px',
    borderRadius: '12px',
    textAlign: 'center',
  },
  
  statusText: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'white',
  },
  
  userBody: {
    marginBottom: '16px',
  },
  
  userDetail: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px',
  },
  
  detailLabel: {
    fontSize: '12px',
    fontWeight: '500',
    color: '#6b7280',
  },
  
  detailValue: {
    fontSize: '12px',
    color: '#374151',
    fontWeight: '500',
  },
  
  userActions: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
  },
  
  editButton: {
    backgroundColor: '#f59e0b',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  
  activateButton: {
    backgroundColor: '#10b981',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  
  deactivateButton: {
    backgroundColor: '#f59e0b',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  
  removeButton: {
    backgroundColor: '#ef4444',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
  },
  
  emptyStateText: {
    fontSize: '16px',
    color: '#6b7280',
    marginBottom: '8px',
    margin: '0 0 8px 0',
  },
  
  emptyStateSubtext: {
    fontSize: '14px',
    color: '#9ca3af',
    margin: 0,
  },
  
  // Modal styles (same as previous modals)
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '500px',
    maxHeight: '80vh',
    overflow: 'auto',
  },
  
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    borderBottom: '1px solid #e5e7eb',
  },
  
  modalTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#374151',
    margin: 0,
  },
  
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#6b7280',
  },
  
  modalBody: {
    padding: '20px',
  },
  
  inputGroup: {
    marginBottom: '20px',
  },
  
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px',
    display: 'block',
  },
  
  input: {
    width: '100%',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    padding: '10px 12px',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  
  select: {
    width: '100%',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    padding: '10px 12px',
    fontSize: '14px',
    backgroundColor: 'white',
    boxSizing: 'border-box',
  },
  
  checkboxGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  
  checkboxLabel: {
    fontSize: '14px',
    color: '#374151',
    cursor: 'pointer',
  },
  
  modalFooter: {
    display: 'flex',
    gap: '12px',
    padding: '20px',
    borderTop: '1px solid #e5e7eb',
    justifyContent: 'flex-end',
  },
  
  cancelButton: {
    backgroundColor: '#6b7280',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  
  saveButton: {
    backgroundColor: '#1e3a8a',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },

  // Confirmation modal styles
  confirmMessage: {
    textAlign: 'center',
    padding: '20px 0',
  },

  confirmText: {
    fontSize: '16px',
    color: '#374151',
    marginBottom: '12px',
    margin: '0 0 12px 0',
  },

  confirmSubtext: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
  },

  removeConfirmButton: {
    backgroundColor: '#1e3a8a',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    marginRight: '10px',
  },
};

export default UserManagementScreen;