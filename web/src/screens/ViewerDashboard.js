import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { getReceiptsByOrganization } from '../data/mockData';

const ViewerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const organizationReceipts = user ? getReceiptsByOrganization(user.organization) : [];

  const StatCard = ({ title, value, subtitle }) => (
    <div style={styles.statCard}>
      <h3 style={styles.statTitle}>{title}</h3>
      <p style={styles.statValue}>{value}</p>
      {subtitle && <p style={styles.statSubtitle}>{subtitle}</p>}
    </div>
  );

  const calculateStats = () => {
    const totalReceipts = organizationReceipts.length;
    const totalAmount = organizationReceipts.reduce((sum, receipt) => sum + receipt.amount, 0);
    const thisMonth = organizationReceipts.filter(receipt => {
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
    <Layout title="Viewer Dashboard">
      <div style={styles.container}>
        {/* Transaction Records */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Transaction Records</h2>
          <div style={styles.statsGrid}>
            <StatCard title="Total Receipts" value={stats.totalReceipts} subtitle="My receipts" />
            <StatCard title="Total Amount" value={`₱${stats.totalAmount.toLocaleString()}`} subtitle="My payments" />
            <StatCard title="This Month" value={stats.thisMonthReceipts} subtitle={`₱${stats.thisMonthAmount.toLocaleString()}`} />
            <StatCard title="Organization" value={user?.organization || 'N/A'} subtitle="My org" />
          </div>
        </div>

        {/* Recent Receipts */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Recent Receipts</h2>
          <div style={styles.card}>
            {organizationReceipts.slice(0, 5).map((receipt) => (
              <div 
                key={receipt.id} 
                style={styles.listItem}
                onClick={() => {
                  alert(`Receipt: ${receipt.receiptNumber}\nPayer: ${receipt.payer}\nAmount: ₱${receipt.amount}\nPurpose: ${receipt.purpose}\nIssued by: ${receipt.issuedBy}`);
                }}
              >
                <div style={styles.listItemContent}>
                  <h4 style={styles.listItemTitle}>{receipt.receiptNumber}</h4>
                  <p style={styles.listItemSubtitle}>
                    {receipt.payer} • {receipt.purpose}
                  </p>
                  <p style={styles.listItemDate}>
                    {new Date(receipt.issuedAt).toLocaleDateString()} • {receipt.issuedBy}
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
            {organizationReceipts.length === 0 && (
              <div style={styles.emptyState}>
                <p style={styles.emptyStateText}>No receipts found</p>
                <p style={styles.emptyStateSubtext}>No receipts have been issued for this organization yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Quick Actions</h2>
          <div style={styles.actionGrid}>
            <button style={styles.actionButton} onClick={() => navigate('/viewer/payment')}>
              Payment Gateway
            </button>
            <button style={styles.actionButton} onClick={() => navigate('/viewer/verify')}>
              Verify Receipt
            </button>
            <button style={styles.actionButton} onClick={() => navigate('/viewer/faq')}>
              Get Help
            </button>
          </div>
        </div>

        {/* Information */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Viewer Information</h2>
          <div style={styles.infoGrid}>
            <div style={styles.infoCard}>
              <h4 style={styles.infoTitle}>View Only Access</h4>
              <p style={styles.infoText}>You can view receipts and statistics but cannot create or modify them</p>
            </div>
            <div style={styles.infoCard}>
              <h4 style={styles.infoTitle}>Payment Processing</h4>
              <p style={styles.infoText}>Use the payment gateway to process payments for existing receipts</p>
            </div>
            <div style={styles.infoCard}>
              <h4 style={styles.infoTitle}>Receipt Verification</h4>
              <p style={styles.infoText}>Verify receipt authenticity using QR codes or receipt numbers</p>
            </div>
            <div style={styles.infoCard}>
              <h4 style={styles.infoTitle}>Need Help?</h4>
              <p style={styles.infoText}>Contact your organization's admin or use the FAQ chatbot for assistance</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const styles = {
  container: {
    backgroundColor: '#f9fafb',
    minHeight: '100vh',
    padding: '32px',
  },
  section: {
    marginBottom: '32px',
  },
  sectionTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '16px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
  },
  statCard: {
    backgroundColor: '#ffffff',
    padding: '24px',
    borderRadius: '16px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
    textAlign: 'center',
  },
  statTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: '8px',
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: '4px',
  },
  statSubtitle: {
    fontSize: '12px',
    color: '#9ca3af',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
    overflow: 'hidden',
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px',
    borderBottom: '1px solid #f3f4f6',
    cursor: 'pointer',
  },
  listItemContent: { flex: 1 },
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
    gap: '4px',
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
  },
  actionButton: {
    backgroundColor: '#1e3a8a',
    color: 'white',
    padding: '16px',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'background 0.2s',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '20px',
  },
  infoCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '16px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
  },
  infoTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px',
  },
  infoText: {
    fontSize: '13px',
    color: '#6b7280',
    lineHeight: '1.5',
  },
};

export default ViewerDashboard;
