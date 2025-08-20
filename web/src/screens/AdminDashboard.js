import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { mockSystemStats, mockUsers, mockReceiptTemplates } from '../data/mockData';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const StatCard = ({ title, value, subtitle }) => (
    <div style={styles.statCard} className="statCard">
      <div style={styles.statTitle} className="statTitle">{title}</div>
      <div style={styles.statValue} className="statValue">{value}</div>
      <div style={styles.statSubtitle} className="statSubtitle">{subtitle}</div>
    </div>
  );

  return (
    <Layout title="Admin Dashboard">
      <div style={styles.pageContainer}>
        
        {/* Header Section */}
        <div style={styles.headerCard}>
          <h2 style={styles.headerTitle}>Welcome back, Admin</h2>
          <p style={styles.headerSubtitle}>Here’s what’s happening in your system today</p>
        </div>

        {/* System Analytics */}
        <div style={styles.section} className="section">
          <h2 style={styles.sectionTitle} className="sectionTitle">System Analytics</h2>
          <div style={styles.statsGrid} className="statsGrid">
            <StatCard title="Total Receipts" value={mockSystemStats.totalReceipts} subtitle="All time" />
            <StatCard title="Total Amount" value={`₱${mockSystemStats.totalAmount.toLocaleString()}`} subtitle="All time" />
            <StatCard title="This Month" value={mockSystemStats.receiptsThisMonth} subtitle={`₱${mockSystemStats.amountThisMonth.toLocaleString()}`} />
            <StatCard title="Active Users" value={mockSystemStats.activeUsers} subtitle="Currently online" />
          </div>
        </div>

        {/* Recent Users */}
        <div style={styles.section} className="section">
          <h2 style={styles.sectionTitle} className="sectionTitle">Recent Users</h2>
          <div style={styles.card} className="card">
            {mockUsers.slice(0, 3).map((user) => (
              <div 
                key={user.id} 
                style={styles.listItem}
                className="listItem"
                onClick={() => {
                  alert(`User: ${user.fullName}\nRole: ${user.role}\nOrganization: ${user.organization}`);
                }}
              >
                <div>
                  <h4 style={styles.listItemTitle} className="listItemTitle">{user.fullName}</h4>
                  <p style={styles.listItemSubtitle} className="listItemSubtitle">{user.role} • {user.organization}</p>
                </div>
                <div style={{
                  ...styles.statusBadge,
                  backgroundColor: user.isActive ? '#10b981' : '#ef4444'
                }} className="statusBadge">
                  <span style={styles.statusText} className="statusText">{user.isActive ? 'Active' : 'Inactive'}</span>
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
                  alert(`Template: ${template.name}\nDescription: ${template.description}\nOrganization: ${template.organization}`);
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
        <div style={styles.section} className="section">
          <h2 style={styles.sectionTitle} className="sectionTitle">Quick Actions</h2>
          <div style={styles.actionGrid} className="actionGrid">
            <button style={styles.actionButton} className="actionButton" onClick={() => navigate('/admin/users')}>
              Manage Users
            </button>
            <button style={styles.actionButton} className="actionButton" onClick={() => navigate('/admin/templates')}>
              Manage Templates
            </button>
            <button style={styles.actionButton} className="actionButton" onClick={() => navigate('/admin/verify')}>
              Verify Receipts
            </button>
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
    marginBottom: '24px',
    '@media (min-width: 768px)': {
      marginBottom: '32px',
    },
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '12px',
    '@media (min-width: 768px)': {
      fontSize: '18px',
      marginBottom: '16px',
    },
  },

  statsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '16px',
  },
  statCard: {
    backgroundColor: 'white',
    padding: '16px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    textAlign: 'center',
  },
  statTitle: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: '6px',
  },
  statValue: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#111827',
  },
  statSubtitle: {
    fontSize: '11px',
    color: '#9ca3af',
  },

  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    overflow: 'hidden',
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    borderBottom: '1px solid #e5e7eb',
    cursor: 'pointer',
  },
  listItemTitle: {
    fontSize: '15px',
    fontWeight: '600',
    margin: 0,
    color: '#111827',
  },
  listItemSubtitle: {
    fontSize: '13px',
    color: '#6b7280',
    margin: 0,
  },

  statusBadge: {
    padding: '4px 8px',
    borderRadius: '16px',
    minWidth: '60px',
    textAlign: 'center',
  },
  statusText: {
    fontSize: '11px',
    fontWeight: '600',
    color: 'white',
  },

  actionGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '16px',
  },
  actionButton: {
    backgroundColor: '#1e3a8a',
    color: 'white',
    padding: '14px',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: '0.2s',
  },
};

export default AdminDashboard;
