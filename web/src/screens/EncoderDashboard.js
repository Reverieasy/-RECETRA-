import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { getReceiptsByUser } from '../data/mockData';

/**
 * Encoder Dashboard Component
 * Provides personal statistics and receipt management tools for encoders
 * 
 * Features:
 * - Personal receipt statistics
 * - Recent receipts list
 * - Quick actions
 * - Helpful tips and guidance
 * 
 * This dashboard is only accessible to users with 'Encoder' role
 */
const EncoderDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userReceipts = user ? getReceiptsByUser(user.fullName) : [];

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

  /**
   * Calculates personal statistics for the encoder
   * @returns {Object} Object containing various statistics
   */
  const calculateStats = () => {
    const totalReceipts = userReceipts.length;
    const totalAmount = userReceipts.reduce((sum, receipt) => sum + receipt.amount, 0);
    const thisMonth = userReceipts.filter(receipt => {
      const receiptDate = new Date(receipt.issuedAt);
      const now = new Date();
      return receiptDate.getMonth() === now.getMonth() && receiptDate.getFullYear() === now.getFullYear();
    });
    const thisMonthAmount = thisMonth.reduce((sum, receipt) => sum + receipt.amount, 0);

    return {
      totalReceipts,
      totalAmount,
      thisMonthReceipts: thisMonth.length,
      thisMonthAmount,
    };
  };

  const stats = calculateStats();

  return (
    <Layout title="Encoder Dashboard">
      <div style={styles.container}>
        {/* Personal Statistics */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>My Statistics</h2>
          <div style={styles.statsGrid}>
            <StatCard
              title="Total Receipts"
              value={stats.totalReceipts}
              subtitle="Issued by me"
            />
            <StatCard
              title="Total Amount"
              value={`₱${stats.totalAmount.toLocaleString()}`}
              subtitle="All time"
            />
            <StatCard
              title="This Month"
              value={stats.thisMonthReceipts}
              subtitle={`₱${stats.thisMonthAmount.toLocaleString()}`}
            />
            <StatCard
              title="Organization"
              value={user?.organization || 'N/A'}
              subtitle="Current org"
            />
          </div>
        </div>

        {/* Recent Receipts */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Recent Receipts</h2>
          <div style={styles.listContainer}>
            {userReceipts.slice(0, 5).map((receipt) => (
              <div 
                key={receipt.id} 
                style={styles.listItem}
                onClick={() => {
                  alert(`Receipt: ${receipt.receiptNumber}\nPayer: ${receipt.payer}\nAmount: ₱${receipt.amount}\nPurpose: ${receipt.purpose}`);
                }}
              >
                <div style={styles.listItemContent}>
                  <h4 style={styles.listItemTitle}>{receipt.receiptNumber}</h4>
                  <p style={styles.listItemSubtitle}>
                    {receipt.payer} • {receipt.purpose}
                  </p>
                  <p style={styles.listItemDate}>
                    {new Date(receipt.issuedAt).toLocaleDateString()}
                  </p>
                </div>
                <div style={styles.listItemRight}>
                  <p style={styles.listItemAmount}>₱{receipt.amount.toLocaleString()}</p>
                  <div style={{
                    ...styles.statusBadge, 
                    backgroundColor: receipt.paymentStatus === 'completed' ? '#10b981' : 
                      receipt.paymentStatus === 'pending' ? '#f59e0b' : '#ef4444'
                  }}>
                    <span style={styles.statusText}>{receipt.paymentStatus}</span>
                  </div>
                </div>
              </div>
            ))}
            {userReceipts.length === 0 && (
              <div style={styles.emptyState}>
                <p style={styles.emptyStateText}>No receipts issued yet</p>
                <p style={styles.emptyStateSubtext}>Start by issuing your first receipt</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Quick Actions</h2>
          <div style={styles.actionGrid}>
            <button
              style={styles.actionButton}
              onClick={() => navigate('/encoder/issue')}
            >
              <span style={styles.actionButtonText}>Issue New Receipt</span>
            </button>
            <button
              style={styles.actionButton}
              onClick={() => navigate('/encoder/archive')}
            >
              <span style={styles.actionButtonText}>View Archive</span>
            </button>
            <button
              style={styles.actionButton}
              onClick={() => navigate('/encoder/verify')}
            >
              <span style={styles.actionButtonText}>Verify Receipt</span>
            </button>
          </div>
        </div>

        {/* Quick Tips */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Quick Tips</h2>
          <div style={styles.tipsContainer}>
            <div style={styles.tipItem}>
              <h4 style={styles.tipTitle}>Receipt Numbers</h4>
              <p style={styles.tipText}>Always use the format OR-YYYY-XXX for consistency</p>
            </div>
            <div style={styles.tipItem}>
              <h4 style={styles.tipTitle}>📧 Email Notifications</h4>
              <p style={styles.tipText}>Double-check email addresses before sending receipts</p>
            </div>
            <div style={styles.tipItem}>
              <h4 style={styles.tipTitle}>QR Codes</h4>
              <p style={styles.tipText}>QR codes are automatically generated for verification</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

/**
 * Styles for the EncoderDashboard component
 */
const styles = {
  container: {
    backgroundColor: '#f5f5f5',
    minHeight: '100%',
  },
  
  section: {
    marginBottom: '24px',
  },
  
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: '16px',
    margin: '0 0 16px 0',
  },
  
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '8px',
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
    marginBottom: '4px',
    margin: '0 0 4px 0',
  },
  
  statSubtitle: {
    fontSize: '12px',
    color: '#9ca3af',
    margin: 0,
  },
  
  listContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  
  listItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderBottom: '1px solid #f3f4f6',
    cursor: 'pointer',
  },
  
  listItemContent: {
    flex: 1,
  },
  
  listItemTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '4px',
    margin: '0 0 4px 0',
  },
  
  listItemSubtitle: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '2px',
    margin: '0 0 2px 0',
  },
  
  listItemDate: {
    fontSize: '12px',
    color: '#9ca3af',
    margin: 0,
  },
  
  listItemRight: {
    textAlign: 'right',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '4px',
  },
  
  listItemAmount: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#374151',
    margin: 0,
  },
  
  statusBadge: {
    padding: '4px 8px',
    borderRadius: '12px',
    minWidth: '70px',
    textAlign: 'center',
  },
  
  statusText: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'white',
    textTransform: 'capitalize',
  },
  
  emptyState: {
    padding: '40px 20px',
    textAlign: 'center',
  },
  
  emptyStateText: {
    fontSize: '16px',
    color: '#6b7280',
    marginBottom: '4px',
    margin: '0 0 4px 0',
  },
  
  emptyStateSubtext: {
    fontSize: '14px',
    color: '#9ca3af',
    margin: 0,
  },

  actionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '16px',
  },

  actionButton: {
    backgroundColor: '#1e3a8a',
    color: 'white',
    padding: '16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
  },

  actionButtonText: {
    color: 'white',
  },
  
  tipsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
  },
  
  tipItem: {
    backgroundColor: 'white',
    padding: '16px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  
  tipTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px',
    margin: '0 0 8px 0',
  },
  
  tipText: {
    fontSize: '12px',
    color: '#6b7280',
    lineHeight: '1.4',
    margin: 0,
  },
};

export default EncoderDashboard;