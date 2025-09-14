import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  Image,
} from 'react-native';
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
const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    organization: user?.organization || '',
  });

  /**
   * Handles change password action
   */
  const handleChangePassword = () => {
  };

  /**
   * Handles edit profile action
   */
  const handleEditProfile = () => {
  };

  /**
   * Handles change profile photo action
   */
  const handleChangePhoto = () => {
  };

  /**
   * Gets the role display name based on user role
   * @param role - User's role
   * @returns Formatted role display name
   */
  const getRoleDisplayName = (role: string) => {
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

  return (
    <Layout title="Profile" showBackButton={true}>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          {/* Profile Photo Section */}
          <View style={styles.photoSection}>
            <TouchableOpacity onPress={handleChangePhoto}>
              <View style={styles.photoContainer}>
                <Image
                  source={{ uri: 'https://via.placeholder.com/120x120/1e3a8a/ffffff?text=U' }}
                  style={styles.profilePhoto}
                />
                <View style={styles.photoOverlay}>
                  <Text style={styles.photoOverlayText}>Change</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Profile Information */}
          <View style={styles.infoSection}>
            <View style={styles.infoHeader}>
              <Text style={styles.infoTitle}>Personal Information</Text>
              <TouchableOpacity
                style={styles.editButton}
                onPress={handleEditProfile}
              >
                <Text style={styles.editButtonText}>
                  {isEditing ? 'Cancel' : 'Edit'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.infoContainer}>
              {/* Full Name */}
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Full Name</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.infoInput}
                    value={profileData.fullName}
                    onChangeText={(text) => setProfileData({...profileData, fullName: text})}
                    placeholder="Enter full name"
                  />
                ) : (
                  <Text style={styles.infoValue}>{user?.fullName}</Text>
                )}
              </View>

              {/* Email */}
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Email</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.infoInput}
                    value={profileData.email}
                    onChangeText={(text) => setProfileData({...profileData, email: text})}
                    placeholder="Enter email"
                    keyboardType="email-address"
                  />
                ) : (
                  <Text style={styles.infoValue}>{user?.email}</Text>
                )}
              </View>

              {/* Phone */}
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Phone</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.infoInput}
                    value={profileData.phone}
                    onChangeText={(text) => setProfileData({...profileData, phone: text})}
                    placeholder="Enter phone number"
                    keyboardType="phone-pad"
                  />
                ) : (
                  <Text style={styles.infoValue}>{user?.phone || 'Not provided'}</Text>
                )}
              </View>

              {/* Organization */}
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Organization</Text>
                <Text style={styles.infoValue}>{user?.organization}</Text>
              </View>

              {/* Role */}
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Role</Text>
                <View style={styles.roleContainer}>
                  <Text style={styles.roleText}>{getRoleDisplayName(user?.role || '')}</Text>
                  <View style={[styles.roleBadge, { backgroundColor: 
                    user?.role === 'Admin' ? '#ef4444' : 
                    user?.role === 'Encoder' ? '#f59e0b' : '#10b981' 
                  }]}>
                    <Text style={styles.roleBadgeText}>{user?.role}</Text>
                  </View>
                </View>
              </View>

              {/* Status */}
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Status</Text>
                <View style={[styles.statusBadge, { backgroundColor: user?.isActive ? '#10b981' : '#ef4444' }]}>
                  <Text style={styles.statusText}>{user?.isActive ? 'Active' : 'Inactive'}</Text>
                </View>
              </View>
            </View>

            {/* Save Button */}
            {isEditing && (
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleEditProfile}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Account Actions */}
          <View style={styles.actionsSection}>
            <Text style={styles.sectionTitle}>Account Actions</Text>
            
            <TouchableOpacity style={styles.actionButton} onPress={handleChangePassword}>
              <Text style={styles.actionButtonText}>Change Password</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.dangerButton]} 
              onPress={logout}
            >
              <Text style={styles.dangerButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>

          {/* Role Information */}
          <View style={styles.roleInfoSection}>
            <Text style={styles.sectionTitle}>Role Information</Text>
            <View style={styles.roleInfoContainer}>
              {user?.role === 'Admin' && (
                <Text style={styles.roleInfoText}>
                  • Full system access and management{'\n'}
                  • User and organization management{'\n'}
                  • Template and receipt oversight{'\n'}
                  • System configuration and reports
                </Text>
              )}
              {user?.role === 'Encoder' && (
                <Text style={styles.roleInfoText}>
                  • Issue and manage receipts{'\n'}
                  • Customize receipt templates{'\n'}
                  • Track payment status{'\n'}
                  • Generate QR codes for receipts
                </Text>
              )}
              {user?.role === 'Viewer' && (
                <Text style={styles.roleInfoText}>
                  • View organization receipts{'\n'}
                  • Verify receipt authenticity{'\n'}
                  • Search and filter receipts{'\n'}
                  • Export receipt data
                </Text>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </Layout>
  );
};

/**
 * Styles for the ProfileScreen component
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
  
  // Profile photo section
  photoSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  
  // Photo container
  photoContainer: {
    position: 'relative',
  },
  
  // Profile photo
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#1e3a8a',
  },
  
  // Photo overlay for change button
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#1e3a8a',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  
  // Photo overlay text
  photoOverlayText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  
  // Information section
  infoSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  // Information header
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  
  // Information title
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
  },
  
  // Edit button
  editButton: {
    backgroundColor: '#1e3a8a',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  
  // Edit button text
  editButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  
  // Information container
  infoContainer: {
    marginBottom: 16,
  },
  
  // Information row
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  
  // Information label
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    flex: 1,
  },
  
  // Information value
  infoValue: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
    textAlign: 'right',
  },
  
  // Information input (for editing)
  infoInput: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
    textAlign: 'right',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'white',
  },
  
  // Role container
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  
  // Role text
  roleText: {
    fontSize: 14,
    color: '#374151',
    marginRight: 8,
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
  
  // Status badge
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  
  // Status text
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  
  // Save button
  saveButton: {
    backgroundColor: '#10b981',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  
  // Save button text
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Actions section
  actionsSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
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
  
  // Action button
  actionButton: {
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  
  // Action button text
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  
  // Danger button
  dangerButton: {
    backgroundColor: '#fee2e2',
  },
  
  // Danger button text
  dangerButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#dc2626',
  },
  
  // Role information section
  roleInfoSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  // Role information container
  roleInfoContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 16,
  },
  
  // Role information text
  roleInfoText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
});

export default ProfileScreen;
