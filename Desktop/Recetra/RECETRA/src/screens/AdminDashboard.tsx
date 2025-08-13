import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Layout from '../components/Layout';
import { mockSystemStats, mockUsers, mockReceiptTemplates } from '../data/mockData';

/**
 * Admin Dashboard Component
 * Provides comprehensive system overview and management tools for administrators
 * 
 * Features:
 * - System statistics overview
 * - Recent users list
 * - Receipt templates overview
 * - Role-based access control
 * 
 * This dashboard is only accessible to users with 'Admin' role
 */
const AdminDashboard: React.FC = () => {
  const navigation = useNavigation();

  /**
   * StatCard Component
   * Reusable component for displaying statistics in a card format
   * @param title - The title of the statistic
   * @param value - The value to display
   * @param subtitle - Optional subtitle for additional context
   */
  const StatCard: React.FC<{ title: string; value: string | number; subtitle?: string }> = ({ 
    title, 
    value, 
    subtitle 
  }) => (
    <View style={styles.statCard}>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statValue}>{value}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  return (
    <Layout title="Admin Dashboard">
      
      <ScrollView style={styles.container}>
        {/* System Statistics Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Statistics</Text>
          
          <View style={styles.statsGrid}>
            <StatCard
              title="Total Receipts"
              value={mockSystemStats.totalReceipts}
              subtitle="All time"
             
            />
            {/* Total Amount Card */}
            <StatCard
              title="Total Amount"
              value={`₱${mockSystemStats.totalAmount.toLocaleString()}`}
              subtitle="All time"
            />
            
            {/* This Month Card */}
            <StatCard
              title="This Month"
              value={mockSystemStats.receiptsThisMonth}
              subtitle={`₱${mockSystemStats.amountThisMonth.toLocaleString()}`}
            />
            
            {/* Active Users Card */}
            <StatCard
              title="Active Users"
              value={mockSystemStats.activeUsers}
              subtitle="Currently online"
            />
          </View>
        </View>

        {/* Recent Users Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Users</Text>
          <View style={styles.listContainer}>
            {mockUsers.slice(0, 3).map((user, index) => (
              <TouchableOpacity 
                key={user.id} 
                style={styles.listItem}
                onPress={() => {
                  alert(`User: ${user.fullName}\nRole: ${user.role}\nOrganization: ${user.organization}`);
                }}
              >
                <View style={styles.listItemContent}>
                  <Text style={styles.listItemTitle}>{user.fullName}</Text>
                  <Text style={styles.listItemSubtitle}>{user.role} • {user.organization}</Text>
                </View>
                {/* Status Badge - Green for active, red for inactive */}
                <View style={[styles.statusBadge, { backgroundColor: user.isActive ? '#10b981' : '#ef4444' }]}>
                  <Text style={styles.statusText}>{user.isActive ? 'Active' : 'Inactive'}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Receipt Templates Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Receipt Templates</Text>
          <View style={styles.listContainer}>
            {mockReceiptTemplates.slice(0, 3).map((template, index) => (
              <TouchableOpacity 
                key={template.id} 
                style={styles.listItem}
                onPress={() => {
                  alert(`Template: ${template.name}\nDescription: ${template.description}\nOrganization: ${template.organization}`);
                }}
              >
                <View style={styles.listItemContent}>
                  <Text style={styles.listItemTitle}>{template.name}</Text>
                  <Text style={styles.listItemSubtitle}>{template.organization}</Text>
                </View>
                {/* Status Badge - Green for active, red for inactive */}
                <View style={[styles.statusBadge, { backgroundColor: template.isActive ? '#10b981' : '#ef4444' }]}>
                  <Text style={styles.statusText}>{template.isActive ? 'Active' : 'Inactive'}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </Layout>
  );
};

/**
 * Styles for the AdminDashboard component
 * Uses a clean, professional design with blue/white theme
 */
const styles = StyleSheet.create({
  // Main container
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  


  // Section container with bottom margin
  section: {
    marginBottom: 24,
  },
  
  // Section title styling
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e3a8a',  // Primary blue color
    marginBottom: 16,
  },
  
  // Statistics grid layout
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  
  // Individual statistic card
  statCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    width: '48%',  // Two cards per row
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  // Statistic title
  statTitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  
  // Statistic value (main number)
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 4,
  },
  
  // Statistic subtitle
  statSubtitle: {
    fontSize: 12,
    color: '#9ca3af',
  },
  
  // List container for users and templates
  listContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  // Individual list item
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  
  // List item content (left side)
  listItemContent: {
    flex: 1,
  },
  
  // List item title
  listItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  
  // List item subtitle
  listItemSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  
  // Status badge for active/inactive indicators
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  
  // Status badge text
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },

  totalReceiptsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    width: '48%',  // Two cards per row
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default AdminDashboard;
