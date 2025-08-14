import React from 'react';
import { useNavigate } from 'react-router-dom';
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
const AdminDashboard = () => {
  const navigate = useNavigate();

  /**
   * StatCard Component
   * Reusable component for displaying statistics in a card format
   * @param {Object} props - Component props
   * @param {string} props.title - The title of the statistic
   * @param {string|number} props.value - The value to display
   * @param {string} props.subtitle - Optional subtitle for additional context
   */
  const StatCard = ({ title, value, subtitle }) => (
    <div style={styles.statCard}>
      <h3 style={styles.statTitle}>{title}</h3>
      <p style={styles.statValue}>{value}</p>
      {subtitle && <p style={styles.statSubtitle}>{subtitle}</p>}
    </div>
  );

  return (
    <Layout title="Admin Dashboard">
      <div style={styles.container}>
        {/* System Statistics Section */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>System Statistics</h2>
          
          <div style={styles.statsGrid}>
            {/* Total Receipts Card */}
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
          </div>
        </div>

        {/* Recent Users Section */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Recent Users</h2>
          <div style={styles.listContainer}>
            {mockUsers.slice(0, 3).map((user) => (
              <div 
                key={user.id} 
                style={styles.listItem}
                onClick={() => {
                  alert(`User: ${user.fullName}\nRole: ${user.role}\nOrganization: ${user.organization}`);
                }}
              >
                <div style={styles.listItemContent}>
                  <h4 style={styles.listItemTitle}>{user.fullName}</h4>
                  <p style={styles.listItemSubtitle}>{user.role} • {user.organization}</p>
                </div>
                {/* Status Badge - Green for active, red for inactive */}
                <div style={{...styles.statusBadge, backgroundColor: user.isActive ? '#10b981' : '#ef4444'}}>
                  <span style={styles.statusText}>{user.isActive ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Receipt Templates Section */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Receipt Templates</h2>
          <div style={styles.listContainer}>
            {mockReceiptTemplates.slice(0, 3).map((template) => (
              <div 
                key={template.id} 
                style={styles.listItem}
                onClick={() => {
                  alert(`Template: ${template.name}\nDescription: ${template.description}\nOrganization: ${template.organization}`);
                }}
              >
                <div style={styles.listItemContent}>
                  <h4 style={styles.listItemTitle}>{template.name}</h4>
                  <p style={styles.listItemSubtitle}>{template.organization}</p>
                </div>
                {/* Status Badge - Green for active, red for inactive */}
                <div style={{...styles.statusBadge, backgroundColor: template.isActive ? '#10b981' : '#ef4444'}}>
                  <span style={styles.statusText}>{template.isActive ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Quick Actions</h2>
          <div style={styles.actionGrid}>
            <button
              style={styles.actionButton}
              onClick={() => navigate('/admin/users')}
            >
              <span style={styles.actionButtonText}>Manage Users</span>
            </button>
            <button
              style={styles.actionButton}
              onClick={() => navigate('/admin/templates')}
            >
              <span style={styles.actionButtonText}>Manage Templates</span>
            </button>
            <button
              style={styles.actionButton}
              onClick={() => navigate('/admin/verify')}
            >
              <span style={styles.actionButtonText}>Verify Receipts</span>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

/**
 * Styles for the AdminDashboard component
 * Uses a clean, professional design with blue/white theme
 */
const styles = {
  // Main container
  container: {
    backgroundColor: '#f5f5f5',
    minHeight: '100%',
  },
  
  // Section
  section: {
    marginBottom: '24px',
  },
  
  // Section title
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: '16px',
    margin: '0 0 16px 0',
  },
  
  // Stats grid
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '8px',
  },
  
  // Stat card
  statCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  
  // Stat title
  statTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: '8px',
    margin: '0 0 8px 0',
  },
  
  // Stat value
  statValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: '4px',
    margin: '0 0 4px 0',
  },
  
  // Stat subtitle
  statSubtitle: {
    fontSize: '12px',
    color: '#9ca3af',
    margin: 0,
  },
  
  // List container
  listContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  
  // List item
  listItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderBottom: '1px solid #f3f4f6',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  
  // List item content
  listItemContent: {
    flex: 1,
  },
  
  // List item title
  listItemTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '4px',
    margin: '0 0 4px 0',
  },
  
  // List item subtitle
  listItemSubtitle: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
  },
  
  // Status badge
  statusBadge: {
    padding: '4px 8px',
    borderRadius: '12px',
    minWidth: '60px',
    textAlign: 'center',
  },
  
  // Status text
  statusText: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'white',
  },

  // Action grid
  actionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  },

  // Action button
  actionButton: {
    backgroundColor: '#1e3a8a',
    color: 'white',
    padding: '16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'background-color 0.2s',
  },

  // Action button text
  actionButtonText: {
    color: 'white',
  },
};

export default AdminDashboard;