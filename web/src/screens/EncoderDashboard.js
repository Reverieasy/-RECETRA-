import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { getReceiptsByUser } from '../data/mockData';

const EncoderDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userReceipts = user ? getReceiptsByUser(user.fullName) : [];

  const StatCard = ({ title, value, subtitle }) => (
    <div style={styles.statCard}>
      <h3 style={styles.statTitle}>{title}</h3>
      <p style={styles.statValue}>{value}</p>
      {subtitle && <p style={styles.statSubtitle}>{subtitle}</p>}
    </div>
  );

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
        <div style={styles.innerContainer}>
          {/* Performance Statistics */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Performance Statistics</h2>
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
                <h4 style={styles.tipTitle}>Email Notifications</h4>
                <p style={styles.tipText}>Double-check email addresses before sending receipts</p>
              </div>
              <div style={styles.tipItem}>
                <h4 style={styles.tipTitle}>QR Codes</h4>
                <p style={styles.tipText}>QR codes are automatically generated for verification</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const styles = {
  container: {
    backgroundColor: '#f5f6fa',
    minHeight: '100vh',
    padding: '24px',
  },
  innerContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
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
    '@media (min-width: 480px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '16px',
    },
    '@media (min-width: 768px)': {
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '20px',
    },
  },
  statCard: {
    backgroundColor: 'white',
    padding: '16px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    textAlign: 'center',
    '@media (min-width: 768px)': {
      padding: '20px',
      borderRadius: '16px',
    },
  },
  statTitle: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: '6px',
    '@media (min-width: 768px)': {
      fontSize: '14px',
      marginBottom: '8px',
    },
  },
  statValue: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#111827',
    '@media (min-width: 768px)': {
      fontSize: '22px',
    },
  },
  statSubtitle: {
    fontSize: '11px',
    color: '#9ca3af',
    '@media (min-width: 768px)': {
      fontSize: '12px',
    },
  },
  listContainer: {
    backgroundColor: 'white',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
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
  },
  listItemSubtitle: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '2px',
  },
  listItemDate: {
    fontSize: '12px',
    color: '#9ca3af',
  },
  listItemRight: {
    textAlign: 'right',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '6px',
  },
  listItemAmount: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#374151',
  },
  statusBadge: {
    padding: '4px 10px',
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
  },
  emptyStateSubtext: {
    fontSize: '14px',
    color: '#9ca3af',
  },
  actionGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '16px',
    '@media (min-width: 480px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '16px',
    },
    '@media (min-width: 768px)': {
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '20px',
    },
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
    '@media (min-width: 768px)': {
      padding: '16px',
      borderRadius: '16px',
      fontSize: '15px',
    },
  },
  actionButtonText: {
    color: 'white',
  },
  tipsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
  },
  tipItem: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '20px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
  },
  tipTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px',
  },
  tipText: {
    fontSize: '13px',
    color: '#6b7280',
    lineHeight: '1.5',
  },
};

export default EncoderDashboard;
