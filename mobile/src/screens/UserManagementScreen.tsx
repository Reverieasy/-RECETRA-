import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import Layout from '../components/Layout';
import { useInlineNotification } from '../components/InlineNotificationSystem';
import { mockUsers, mockOrganizations } from '../data/mockData';

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
const UserManagementScreen: React.FC = () => {
  const { showSuccess, showError, showWarning } = useInlineNotification();
  const [users, setUsers] = useState(mockUsers);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
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

  /**
   * Filters users based on selected role and organization
   * @returns Filtered list of users
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
      showError('Please fill in all required fields', 'Validation Error');
      return;
    }

    const user = {
      id: `user_${Date.now()}`,
      username: newUser.email.split('@')[0],
      password: 'password123', // Default password
      ...newUser,
      role: newUser.role as 'Admin' | 'Encoder' | 'Viewer',
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
    showSuccess('User added successfully!', 'Success');
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
  const handleRemoveUser = (user: any) => {
    showWarning(
      `Are you sure you want to remove ${user.fullName}? This action cannot be undone.`,
      'Remove User'
    );
    // For now, just show warning. In a real app, you'd implement proper confirmation
    const updatedUsers = users.filter(u => u.id !== user.id);
    setUsers(updatedUsers);
    showSuccess('User removed successfully!', 'Success');
  };

  /**
   * Opens the edit modal for a specific user
   * @param user - User to edit
   */
  const openEditModal = (user: any) => {
    setSelectedUser({ ...user });
    setShowEditModal(true);
  };

  /**
   * Gets the role display name with color coding
   * @param role - User's role
   * @returns Formatted role display
   */
  const getRoleDisplay = (role: string) => {
    const colors = {
      Admin: '#ef4444',
      Encoder: '#f59e0b',
      Viewer: '#10b981',
    };
    
    return (
      <View style={[styles.roleBadge, { backgroundColor: colors[role as keyof typeof colors] }]}>
        <Text style={styles.roleBadgeText}>{role}</Text>
      </View>
    );
  };

  const filteredUsers = getFilteredUsers();

  return (
    <Layout title="User Management" showBackButton={true}>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          {/* Header Actions */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddModal(true)}
            >
              <Text style={styles.addButtonText}>Add New User</Text>
            </TouchableOpacity>
          </View>

          {/* Filters */}
          <View style={styles.filtersContainer}>
            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Filter by Role:</Text>
              <View style={styles.filterButtons}>
                {['all', 'Admin', 'Encoder', 'Viewer'].map(role => (
                  <TouchableOpacity
                    key={role}
                    style={[
                      styles.filterButton,
                      filterRole === role && styles.filterButtonActive
                    ]}
                    onPress={() => setFilterRole(role)}
                  >
                    <Text style={[
                      styles.filterButtonText,
                      filterRole === role && styles.filterButtonTextActive
                    ]}>
                      {role === 'all' ? 'All' : role}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Filter by Organization:</Text>
              <View style={styles.filterButtons}>
                {['all', ...mockOrganizations.map(org => org.name)].map(org => (
                  <TouchableOpacity
                    key={org}
                    style={[
                      styles.filterButton,
                      filterOrg === org && styles.filterButtonActive
                    ]}
                    onPress={() => setFilterOrg(org)}
                  >
                    <Text style={[
                      styles.filterButtonText,
                      filterOrg === org && styles.filterButtonTextActive
                    ]}>
                      {org === 'all' ? 'All' : org}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Users List */}
          <View style={styles.usersContainer}>
            <Text style={styles.sectionTitle}>
              Users ({filteredUsers.length})
            </Text>
            
            {filteredUsers.map(user => (
              <TouchableOpacity
                key={user.id}
                style={styles.userCard}
                onPress={() => openEditModal(user)}
              >
                <View style={styles.userInfo}>
                  <View style={styles.userHeader}>
                    <Text style={styles.userName}>{user.fullName}</Text>
                    {getRoleDisplay(user.role)}
                  </View>
                  
                  <Text style={styles.userEmail}>{user.email}</Text>
                  <Text style={styles.userOrg}>{user.organization}</Text>
                  
                  <View style={styles.userStatus}>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: user.isActive ? '#10b981' : '#ef4444' }
                    ]}>
                      <Text style={styles.statusText}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.userActions}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => openEditModal(user)}
                  >
                    <Text style={styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveUser(user)}
                  >
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
            
            {filteredUsers.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No users found</Text>
                <Text style={styles.emptyStateSubtext}>
                  Try adjusting your filters or add a new user
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Add User Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New User</Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Full Name"
              value={newUser.fullName}
              onChangeText={(text) => setNewUser({...newUser, fullName: text})}
            />
            
            <TextInput
              style={styles.modalInput}
              placeholder="Email"
              value={newUser.email}
              onChangeText={(text) => setNewUser({...newUser, email: text})}
              keyboardType="email-address"
            />
            
            <TextInput
              style={styles.modalInput}
              placeholder="Phone (optional)"
              value={newUser.phone}
              onChangeText={(text) => setNewUser({...newUser, phone: text})}
              keyboardType="phone-pad"
            />
            
            <View style={styles.modalRow}>
              <Text style={styles.modalLabel}>Organization:</Text>
              <View style={styles.modalSelect}>
                {mockOrganizations.map(org => (
                  <TouchableOpacity
                    key={org.name}
                    style={[
                      styles.selectOption,
                      newUser.organization === org.name && styles.selectOptionActive
                    ]}
                    onPress={() => setNewUser({...newUser, organization: org.name})}
                  >
                    <Text style={[
                      styles.selectOptionText,
                      newUser.organization === org.name && styles.selectOptionTextActive
                    ]}>
                      {org.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.modalRow}>
              <Text style={styles.modalLabel}>Role:</Text>
              <View style={styles.modalSelect}>
                {['Viewer', 'Encoder', 'Admin'].map(role => (
                  <TouchableOpacity
                    key={role}
                    style={[
                      styles.selectOption,
                      newUser.role === role && styles.selectOptionActive
                    ]}
                    onPress={() => setNewUser({...newUser, role})}
                  >
                    <Text style={[
                      styles.selectOptionText,
                      newUser.role === role && styles.selectOptionTextActive
                    ]}>
                      {role}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButtonCancel}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.modalButtonTextCancel}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.modalButtonSave}
                onPress={handleAddUser}
              >
                <Text style={styles.modalButtonTextSave}>Add User</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit User</Text>
            
            {selectedUser && (
              <>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Full Name"
                  value={selectedUser.fullName}
                  onChangeText={(text) => setSelectedUser({...selectedUser, fullName: text})}
                />
                
                <TextInput
                  style={styles.modalInput}
                  placeholder="Email"
                  value={selectedUser.email}
                  onChangeText={(text) => setSelectedUser({...selectedUser, email: text})}
                  keyboardType="email-address"
                />
                
                <TextInput
                  style={styles.modalInput}
                  placeholder="Phone"
                  value={selectedUser.phone}
                  onChangeText={(text) => setSelectedUser({...selectedUser, phone: text})}
                  keyboardType="phone-pad"
                />
                
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Organization:</Text>
                  <View style={styles.modalSelect}>
                    {mockOrganizations.map(org => (
                      <TouchableOpacity
                        key={org.name}
                        style={[
                          styles.selectOption,
                          selectedUser.organization === org.name && styles.selectOptionActive
                        ]}
                        onPress={() => setSelectedUser({...selectedUser, organization: org.name})}
                      >
                        <Text style={[
                          styles.selectOptionText,
                          selectedUser.organization === org.name && styles.selectOptionTextActive
                        ]}>
                          {org.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Role:</Text>
                  <View style={styles.modalSelect}>
                    {['Viewer', 'Encoder', 'Admin'].map(role => (
                      <TouchableOpacity
                        key={role}
                        style={[
                          styles.selectOption,
                          selectedUser.role === role && styles.selectOptionActive
                        ]}
                        onPress={() => setSelectedUser({...selectedUser, role})}
                      >
                        <Text style={[
                          styles.selectOptionText,
                          selectedUser.role === role && styles.selectOptionTextActive
                        ]}>
                          {role}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Status:</Text>
                  <TouchableOpacity
                    style={[
                      styles.statusToggle,
                      { backgroundColor: selectedUser.isActive ? '#10b981' : '#ef4444' }
                    ]}
                    onPress={() => setSelectedUser({...selectedUser, isActive: !selectedUser.isActive})}
                  >
                    <Text style={styles.statusToggleText}>
                      {selectedUser.isActive ? 'Active' : 'Inactive'}
                    </Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.modalButtonCancel}
                    onPress={() => setShowEditModal(false)}
                  >
                    <Text style={styles.modalButtonTextCancel}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.modalButtonSave}
                    onPress={handleEditUser}
                  >
                    <Text style={styles.modalButtonTextSave}>Save Changes</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </Layout>
  );
};

/**
 * Styles for the UserManagementScreen component
 * Uses a clean, professional design with consistent spacing and colors
 */
const styles = StyleSheet.create({
  // Main container
  container: {
    flex: 1,
  },
  
  // Content area
  content: {
    padding: 16,
  },
  
  // Header section
  header: {
    marginBottom: 20,
  },
  
  // Add button
  addButton: {
    backgroundColor: '#10b981',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  
  // Add button text
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Filters container
  filtersContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  // Filter row
  filterRow: {
    marginBottom: 12,
  },
  
  // Filter label
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  
  // Filter buttons container
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  
  // Filter button
  filterButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  
  // Active filter button
  filterButtonActive: {
    backgroundColor: '#1e3a8a',
  },
  
  // Filter button text
  filterButtonText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  
  // Active filter button text
  filterButtonTextActive: {
    color: 'white',
  },
  
  // Users container
  usersContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  // Section title
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 16,
  },
  
  // User card
  userCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  
  // User info
  userInfo: {
    flex: 1,
  },
  
  // User header
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  
  // User name
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  
  // Role badge
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  
  // Role badge text
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
  
  // User email
  userEmail: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  
  // User organization
  userOrg: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 8,
  },
  
  // User status
  userStatus: {
    marginTop: 4,
  },
  
  // Status badge
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  
  // Status text
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
  
  // User actions
  userActions: {
    flexDirection: 'row',
  },
  
  // Edit button
  editButton: {
    backgroundColor: '#1e3a8a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 8,
  },
  
  // Edit button text
  editButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Remove button
  removeButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  
  // Remove button text
  removeButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Empty state
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  
  // Empty state text
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
  },
  
  // Empty state subtitle
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  
  // Modal overlay
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Modal content
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  
  // Modal title
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 20,
    textAlign: 'center',
  },
  
  // Modal input
  modalInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: 'white',
  },
  
  // Modal row
  modalRow: {
    marginBottom: 16,
  },
  
  // Modal label
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  
  // Modal select
  modalSelect: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  
  // Select option
  selectOption: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  
  // Active select option
  selectOptionActive: {
    backgroundColor: '#1e3a8a',
  },
  
  // Select option text
  selectOptionText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  
  // Active select option text
  selectOptionTextActive: {
    color: 'white',
  },
  
  // Status toggle
  statusToggle: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  
  // Status toggle text
  statusToggleText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  
  // Modal buttons
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  
  // Modal button cancel
  modalButtonCancel: {
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  
  // Modal button save
  modalButtonSave: {
    backgroundColor: '#10b981',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  
  // Modal button text cancel
  modalButtonTextCancel: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Modal button text save
  modalButtonTextSave: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default UserManagementScreen;
