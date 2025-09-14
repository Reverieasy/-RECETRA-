 import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useInlineNotification } from '../components/InlineNotificationSystem';
import { mockSystemStats, mockUsers, mockReceiptTemplates } from '../data/mockData';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { showSuccess, showError, showWarning } = useInlineNotification();

  const StatCard = ({ title, value, subtitle }) => (
    <div style={styles.statCard}>
      <h3 style={styles.statTitle}>{title}</h3>
      <p style={styles.statValue}>{value}</p>
      {subtitle && <p style={styles.statSubtitle}>{subtitle}</p>}
    </div>
  );

  return (
    <Layout title="Admin Dashboard">
      <div className="innerContainer">
        <div style={styles.pageContainer}>
        
        {/* Header Section */}
        <div style={styles.headerCard}>
          <h2 style={styles.headerTitle}>Welcome back, Admin</h2>
          <p style={styles.headerSubtitle}>Here’s what’s happening in your system today</p>
        </div>

        {/* System Statistics */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>System Statistics</h2>
          <div style={styles.statsGrid}>
            <StatCard
              title="Total Receipts"
              value={mockSystemStats.totalReceipts}
              subtitle="All time"
            />
            <StatCard
              title="Total Amount"
              value={`₱${mockSystemStats.totalAmount.toLocaleString()}`}
              subtitle="All time"
            />
            <StatCard
              title="This Month"
              value={mockSystemStats.receiptsThisMonth}
              subtitle={`₱${mockSystemStats.amountThisMonth.toLocaleString()}`}
            />
            <StatCard
              title="Active Users"
              value={mockSystemStats.activeUsers}
              subtitle="Currently online"
            />
          </div>
        </div>

        {/* Recent Users */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Recent Users</h2>
          <div style={styles.card}>
            {mockUsers.slice(0, 3).map((user) => (
              <div 
                key={user.id} 
                style={styles.listItem}
                onClick={() => {
                  showInfo(`User: ${user.fullName}\nRole: ${user.role}\nOrganization: ${user.organization}`, 'User Details');
                }}
              >
                <div>
                  <h4 style={styles.listItemTitle}>{user.fullName}</h4>
                  <p style={styles.listItemSubtitle}>{user.role} - {user.organization}</p>
                </div>
                <div style={{...styles.statusBadge, backgroundColor: user.isActive ? '#10b981' : '#ef4444'}}>
                  <span style={styles.statusText}>{user.isActive ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Receipt Templates */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Receipt Templates</h2>
          <div style={styles.card}>
            {mockReceiptTemplates.slice(0, 3).map((template) => (
              <div 
                key={template.id} 
                style={styles.listItem}
                onClick={() => {
                  showInfo(`Template: ${template.name}\nDescription: ${template.description}\nOrganization: ${template.organization}`, 'Template Details');
                }}
              >
                <div>
                  <h4 style={styles.listItemTitle}>{template.name}</h4>
                  <p style={styles.listItemSubtitle}>{template.organization}</p>
                </div>
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
              Manage Users
            </button>
            <button
              style={styles.actionButton}
              onClick={() => navigate('/admin/templates')}
            >
              Manage Templates
            </button>
            <button
              style={styles.actionButton}
              onClick={() => navigate('/admin/verify')}
            >
              Verify Receipts
            </button>
          </div>
        </div>
        </div>
      </div>
    </Layout>
  );
};

const styles = {
  pageContainer: {
    backgroundColor: '#f9fafb',
    minHeight: '100vh',
    padding: '32px',
  },

  headerCard: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '20px',
    marginBottom: '32px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  },
  headerTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: 0,
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: '14px',
    color: '#6b7280',
    marginTop: '8px',
  },

  section: {
    marginBottom: '32px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '16px',
  },

  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
  },
  statCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    textAlign: 'center',
  },
  statTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: '8px',
  },
  statValue: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#111827',
  },
  statSubtitle: {
    fontSize: '12px',
    color: '#9ca3af',
  },

  card: {
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    overflow: 'hidden',
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: '1px solid #f3f4f6',
    cursor: 'pointer',
  },
  listItemTitle: {
    fontSize: '16px',
    fontWeight: '600',
    margin: 0,
    color: '#111827',
  },
  listItemSubtitle: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
  },

  statusBadge: {
    padding: '6px 12px',
    borderRadius: '20px',
    minWidth: '70px',
    textAlign: 'center',
  },
  statusText: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'white',
  },

  actionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
  },
  actionButton: {
    backgroundColor: '#1e3a8a',
    color: 'white',
    padding: '16px',
    borderRadius: '16px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    transition: '0.2s',
  },
};

export default AdminDashboard;
