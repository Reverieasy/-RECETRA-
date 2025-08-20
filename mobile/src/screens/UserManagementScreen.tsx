import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

const UserManagementScreen = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([
    {
      id: '1',
      username: 'admin',
      fullName: 'Admin User',
      email: 'admin@example.com',
      role: 'Admin',
      organization: 'NU Dasma',
      isActive: true,
    },
    {
      id: '2',
      username: 'encoder',
      fullName: 'Encoder User',
      email: 'encoder@example.com',
      role: 'Encoder',
      organization: 'NU Dasma',
      isActive: true,
    },
    {
      id: '3',
      username: 'viewer',
      fullName: 'Viewer User',
      email: 'viewer@example.com',
      role: 'Viewer',
      organization: 'NU Dasma',
      isActive: true,
    },
  ]);

  const [newUser, setNewUser] = useState({
    username: '',
    fullName: '',
    email: '',
    role: 'Viewer',
    organization: '',
  });

  const [isAddingUser, setIsAddingUser] = useState(false);

  const handleAddUser = () => {
    if (!newUser.username || !newUser.fullName || !newUser.email || !newUser.organization) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (users.find(u => u.username === newUser.username)) {
      Alert.alert('Error', 'Username already exists');
      return;
    }

    if (users.find(u => u.email === newUser.email)) {
      Alert.alert('Error', 'Email already exists');
      return;
    }

    const userToAdd = {
      ...newUser,
      id: Date.now().toString(),
      isActive: true,
    };

    setUsers([...users, userToAdd]);
    setNewUser({
      username: '',
      fullName: '',
      email: '',
      role: 'Viewer',
      organization: '',
    });
    setIsAddingUser(false);

    Alert.alert('Success', 'User added successfully');
  };

  const handleEditUser = (userId: string) => {
    const userToEdit = users.find(u => u.id === userId);
    if (userToEdit) {
      Alert.alert(
        'Edit User',
        `Edit user: ${userToEdit.fullName}`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Edit',
            onPress: () => {
              Alert.alert('Edit User', 'Edit functionality would be implemented here');
            },
          },
        ]
      );
    }
  };

  const handleRemoveUser = (userId: string) => {
    const userToRemove = users.find(u => u.id === userId);
    if (userToRemove) {
      Alert.alert(
        'Remove User',
        `Are you sure you want to remove ${userToRemove.fullName}?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Remove',
            style: 'destructive',
            onPress: () => {
              setUsers(users.filter(u => u.id !== userId));
              Alert.alert('Success', 'User removed successfully');
            },
          },
        ]
      );
    }
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, isActive: !u.isActive } : u
    ));
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return '#ef4444';
      case 'Encoder':
        return '#f59e0b';
      case 'Viewer':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>User Management</Text>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Users</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setIsAddingUser(!isAddingUser)}
            >
              <Text style={styles.addButtonText}>
                {isAddingUser ? 'Cancel' : 'Add User'}
              </Text>
            </TouchableOpacity>
          </View>

          {isAddingUser && (
            <View style={styles.addUserForm}>
              <TextInput
                style={styles.input}
                placeholder="Username"
                value={newUser.username}
                onChangeText={(text) => setNewUser({ ...newUser, username: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={newUser.fullName}
                onChangeText={(text) => setNewUser({ ...newUser, fullName: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={newUser.email}
                onChangeText={(text) => setNewUser({ ...newUser, email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Organization"
                value={newUser.organization}
                onChangeText={(text) => setNewUser({ ...newUser, organization: text })}
              />
              <TouchableOpacity style={styles.submitButton} onPress={handleAddUser}>
                <Text style={styles.submitButtonText}>Add User</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.usersList}>
            {users.map((userItem) => (
              <View key={userItem.id} style={styles.userCard}>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{userItem.fullName}</Text>
                  <Text style={styles.userUsername}>@{userItem.username}</Text>
                  <Text style={styles.userEmail}>{userItem.email}</Text>
                  <View style={styles.userDetails}>
                    <View style={[styles.roleBadge, { backgroundColor: getRoleColor(userItem.role) }]}>
                      <Text style={styles.roleText}>{userItem.role}</Text>
                    </View>
                    <Text style={styles.userOrganization}>{userItem.organization}</Text>
                  </View>
                </View>
                
                <View style={styles.userActions}>
                  <TouchableOpacity
                    style={[styles.statusButton, { backgroundColor: userItem.isActive ? '#10b981' : '#6b7280' }]}
                    onPress={() => handleToggleUserStatus(userItem.id)}
                  >
                    <Text style={styles.statusButtonText}>
                      {userItem.isActive ? 'Active' : 'Inactive'}
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEditUser(userItem.id)}
                  >
                    <Text style={styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveUser(userItem.id)}
                  >
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  addUserForm: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: '#34C759',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  usersList: {
    gap: 15,
  },
  userCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userInfo: {
    marginBottom: 15,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userUsername: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  userDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  userOrganization: {
    fontSize: 14,
    color: '#666',
  },
  userActions: {
    flexDirection: 'row',
    gap: 10,
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  editButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  removeButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default UserManagementScreen;
