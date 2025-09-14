import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useInlineNotification } from '../components/InlineNotificationSystem';
import { mockReceipts, getReceiptsByOrganization } from '../data/mockData';

/**
 * Transaction Archive Screen Component
 * Allows encoders to view and track all transactions including digital payments and manual receipts
 * 
 * Features:
 * - View all transactions for the organization
 * - Filter by transaction type (Digital vs Manual)
 * - Filter by payment status
 * - View transaction details
 * - Track notification status
 * - Export transaction data
 */
const TransactionArchiveScreen = () => {
  const { showSuccess, showError, showWarning } = useInlineNotification();
  const { user } = useAuth();
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showResendConfirm, setShowResendConfirm] = useState(false);
  const [transactionToResend, setTransactionToResend] = useState(null);

  /**
   * Gets all transactions for the user's organization
   * @returns {Array} Array of transactions
   */
  const getTransactions = () => {
    if (!user) return [];
    return getReceiptsByOrganization(user.organization);
  };

  /**
   * Filters transactions based on selected filters
   * @returns {Array} Filtered list of transactions
   */
  const getFilteredTransactions = () => {
    const transactions = getTransactions();
    
    return transactions.filter(transaction => {
      const typeMatch = filterType === 'all' || 
        (filterType === 'digital' && transaction.issuedBy === 'Payment Gateway') ||
        (filterType === 'manual' && transaction.issuedBy !== 'Payment Gateway');
      
      const statusMatch = filterStatus === 'all' || transaction.paymentStatus === filterStatus;
      
      return typeMatch && statusMatch;
    });
  };

  /**
   * Gets transaction type display name
   * @param {Object} transaction - Transaction object
   * @returns {string} Formatted transaction type
   */
  const getTransactionType = (transaction) => {
    return transaction.issuedBy === 'Payment Gateway' ? 'Digital Payment' : 'Manual Receipt';
  };

  /**
   * Gets transaction type color
   * @param {Object} transaction - Transaction object
   * @returns {string} Color for transaction type badge
   */
  const getTransactionTypeColor = (transaction) => {
    return transaction.issuedBy === 'Payment Gateway' ? '#10b981' : '#f59e0b';
  };

  /**
   * Handles viewing transaction details
   * @param {Object} transaction - Transaction to view
   */
  const handleViewTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDetails(true);
  };

  /**
   * Handles resending notifications
   * @param {Object} transaction - Transaction to resend notifications for
   */
  const handleResendNotifications = (transaction) => {
    setTransactionToResend(transaction);
    setShowResendConfirm(true);
  };

  /**
   * Confirms resending notifications
   */
  const confirmResendNotifications = () => {
    if (transactionToResend) {
      // Simulate resending notifications
      setTimeout(() => {
        showSuccess('Notifications have been resent successfully!', 'Success');
      }, 1000);
    }
    setShowResendConfirm(false);
    setTransactionToResend(null);
  };

  /**
   * Cancels resending notifications
   */
  const cancelResendNotifications = () => {
    setShowResendConfirm(false);
    setTransactionToResend(null);
  };

  /**
   * Handles exporting transaction data
   */
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const handleExportData = () => {
    setExportModalOpen(true);
  };
  const confirmExport = () => {
    // Simulate export
    const transactions = getFilteredTransactions();
    const csvData = transactions.map(t => 
      `${t.receiptNumber},${t.payer},${t.amount},${t.purpose},${t.paymentStatus},${new Date(t.issuedAt).toLocaleDateString()}`
    ).join('\n');
    const blob = new Blob([`Receipt Number,Payer,Amount,Purpose,Status,Date\n${csvData}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    setExportSuccess(true);
    setTimeout(() => {
      setExportModalOpen(false);
      setExportSuccess(false);
    }, 1200);
  };

  /**
   * Transaction Details Modal Component
   */
  const TransactionDetailsModal = () => (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <div style={styles.modalHeader}>
          <h3 style={styles.modalTitle}>Transaction Details</h3>
          <button 
            style={styles.closeButton}
            onClick={() => setShowDetails(false)}
          >
            X
          </button>
        </div>
        
        <div style={styles.modalBody}>
          {selectedTransaction && (
            <div style={styles.detailsContainer}>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Receipt Number:</span>
                <span style={styles.detailValue}>{selectedTransaction.receiptNumber}</span>
              </div>
              
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Payer:</span>
                <span style={styles.detailValue}>{selectedTransaction.payer}</span>
              </div>
              
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Amount:</span>
                <span style={styles.detailValue}>₱{selectedTransaction.amount.toLocaleString()}</span>
              </div>
              
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Purpose:</span>
                <span style={styles.detailValue}>{selectedTransaction.purpose}</span>
              </div>
              
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Category:</span>
                <span style={styles.detailValue}>{selectedTransaction.category}</span>
              </div>
              
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Transaction Type:</span>
                <span style={styles.detailValue}>{getTransactionType(selectedTransaction)}</span>
              </div>
              
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Payment Status:</span>
                <div style={{
                  ...styles.statusBadge,
                  backgroundColor: selectedTransaction.paymentStatus === 'completed' ? '#10b981' : 
                    selectedTransaction.paymentStatus === 'pending' ? '#f59e0b' : '#ef4444'
                }}>
                  <span style={styles.statusText}>{selectedTransaction.paymentStatus}</span>
                </div>
              </div>
              
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Issued By:</span>
                <span style={styles.detailValue}>{selectedTransaction.issuedBy}</span>
              </div>
              
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Date:</span>
                <span style={styles.detailValue}>
                  {new Date(selectedTransaction.issuedAt).toLocaleDateString()}
                </span>
              </div>
              
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Email Status:</span>
                <div style={{
                  ...styles.statusBadge,
                  backgroundColor: selectedTransaction.emailStatus === 'sent' ? '#10b981' : 
                    selectedTransaction.emailStatus === 'pending' ? '#f59e0b' : '#ef4444'
                }}>
                  <span style={styles.statusText}>{selectedTransaction.emailStatus}</span>
                </div>
              </div>
              
            </div>
          )}
        </div>
        
        <div style={styles.modalFooter}>
          <button
            style={styles.resendButton}
            onClick={() => handleResendNotifications(selectedTransaction)}
          >
            Resend Notifications
          </button>
          <button
            style={styles.closeModalButton}
            onClick={() => setShowDetails(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  /**
   * Component to display transaction item
   * @param {Object} props - Component props
   * @param {Object} props.transaction - Transaction to display
   */
  const TransactionItem = ({ transaction }) => (
    <div
      style={styles.transactionItem}
      onClick={() => handleViewTransaction(transaction)}
    >
      <div style={styles.transactionHeader}>
        <div style={styles.transactionInfo}>
          <h4 style={styles.receiptNumber}>{transaction.receiptNumber}</h4>
          <p style={styles.payerName}>{transaction.payer}</p>
        </div>
        <div style={styles.transactionBadges}>
          <div style={{
            ...styles.typeBadge,
            backgroundColor: getTransactionTypeColor(transaction)
          }}>
            <span style={styles.typeBadgeText}>
              {getTransactionType(transaction)}
            </span>
          </div>
          <div style={{
            ...styles.statusBadge,
            backgroundColor: transaction.paymentStatus === 'completed' ? '#10b981' : 
              transaction.paymentStatus === 'pending' ? '#f59e0b' : '#ef4444'
          }}>
            <span style={styles.statusText}>{transaction.paymentStatus}</span>
          </div>
        </div>
      </div>

      <div style={styles.transactionBody}>
        <div style={styles.transactionDetail}>
          <span style={styles.detailLabel}>Amount:</span>
          <span style={styles.detailValue}>₱{transaction.amount.toLocaleString()}</span>
        </div>
        <div style={styles.transactionDetail}>
          <span style={styles.detailLabel}>Purpose:</span>
          <span style={styles.detailValue}>{transaction.purpose}</span>
        </div>
        <div style={styles.transactionDetail}>
          <span style={styles.detailLabel}>Date:</span>
          <span style={styles.detailValue}>
            {new Date(transaction.issuedAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div style={styles.transactionFooter}>
        <div style={styles.notificationStatus}>
          <span style={styles.notificationLabel}>Email:</span>
          <span style={{
            ...styles.notificationBadge,
            backgroundColor: transaction.emailStatus === 'sent' ? '#10b981' : 
              transaction.emailStatus === 'pending' ? '#f59e0b' : '#ef4444'
          }}>
            {transaction.emailStatus}
          </span>
          
        </div>
      </div>
    </div>
  );

  const filteredTransactions = getFilteredTransactions();

  return (
    <Layout title="Transaction Archive" showBackButton={true}>
      <div className="innerContainer">
        <div style={styles.container}>
          <div style={styles.content}>
          {/* Header */}
          <div style={styles.header}>
            <h2 style={styles.title}>Transaction Archive</h2>
            <p style={styles.subtitle}>View and manage all transactions for {user?.organization}</p>
          </div>

          {/* Controls */}
          <div style={styles.controls}>
            <div style={styles.filters}>
              <select
                style={styles.filterSelect}
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="digital">Digital Payments</option>
                <option value="manual">Manual Receipts</option>
              </select>

              <select
                style={styles.filterSelect}
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <button
              style={styles.exportButton}
              onClick={handleExportData}
            >
              Export Data
            </button>
      {/* Export Data Modal */}
      {exportModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.modalContent, maxWidth: 400, textAlign: 'center' }}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Export Transactions</h3>
              <button style={styles.closeButton} onClick={() => { setExportModalOpen(false); setExportSuccess(false); }}>X</button>
            </div>
            <div style={styles.modalBody}>
              {exportSuccess ? (
                <div style={{ color: '#047857', fontWeight: 600, fontSize: 16, margin: '18px 0' }}>Exported successfully!</div>
              ) : (
                <>
                  <p style={{ fontSize: 15, color: '#374151', marginBottom: 18 }}>
                    Export transaction data to CSV format?<br />
                    <span style={{ color: '#6b7280', fontSize: 13 }}>(All filtered transactions will be included.)</span>
                  </p>
                  <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 10 }}>
                    <button
                      style={{ ...styles.exportButton, minWidth: 90, background: '#1e3a8a', color: 'white', border: 'none' }}
                      onClick={confirmExport}
                    >
                      Export
                    </button>
                    <button
                      style={{ ...styles.exportButton, minWidth: 90, background: '#9ca3af', color: 'white', border: 'none' }}
                      onClick={() => setExportModalOpen(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
          </div>

          {/* Statistics */}
          <div style={styles.statsContainer}>
            <div style={styles.statCard}>
              <h4 style={styles.statTitle}>Total Transactions</h4>
              <p style={styles.statValue}>{filteredTransactions.length}</p>
            </div>
            <div style={styles.statCard}>
              <h4 style={styles.statTitle}>Total Amount</h4>
              <p style={styles.statValue}>
                ₱{filteredTransactions.reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
              </p>
            </div>
            <div style={styles.statCard}>
              <h4 style={styles.statTitle}>Completed</h4>
              <p style={styles.statValue}>
                {filteredTransactions.filter(t => t.paymentStatus === 'completed').length}
              </p>
            </div>
            <div style={styles.statCard}>
              <h4 style={styles.statTitle}>Pending</h4>
              <p style={styles.statValue}>
                {filteredTransactions.filter(t => t.paymentStatus === 'pending').length}
              </p>
            </div>
          </div>

          {/* Transactions List */}
          <div style={styles.transactionsContainer}>
            <h3 style={styles.sectionTitle}>
              Transactions ({filteredTransactions.length})
            </h3>
            
            {filteredTransactions.length === 0 ? (
              <div style={styles.emptyState}>
                <p style={styles.emptyStateText}>No transactions found</p>
                <p style={styles.emptyStateSubtext}>
                  {filterType !== 'all' || filterStatus !== 'all' 
                    ? 'Try adjusting your filters'
                    : 'No transactions have been recorded yet'
                  }
                </p>
              </div>
            ) : (
              <div style={styles.transactionsList}>
                {filteredTransactions.map((transaction) => (
                  <TransactionItem key={transaction.id} transaction={transaction} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

        {/* Transaction Details Modal */}
        {showDetails && <TransactionDetailsModal />}

        {/* Resend Notifications Confirmation Modal */}
        {showResendConfirm && transactionToResend && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
              <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>Resend Notifications</h3>
                <button 
                  style={styles.closeButton}
                  onClick={cancelResendNotifications}
                >
                  X
                </button>
              </div>
              
              <div style={styles.modalBody}>
                <div style={styles.confirmMessage}>
                  <p style={styles.confirmText}>
                    Resend email notification for receipt <strong>"{transactionToResend.receiptNumber}"</strong>?
                  </p>
                  <p style={styles.confirmSubtext}>
                    This will send a new notification email to the payer.
                  </p>
                </div>
              </div>
              
              <div style={styles.modalFooter}>
                <button
                  style={styles.cancelButton}
                  onClick={cancelResendNotifications}
                >
                  Cancel
                </button>
                <button
                  style={styles.resendConfirmButton}
                  onClick={confirmResendNotifications}
                >
                  Resend Notifications
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

/**
 * Styles for the TransactionArchiveScreen component
 */
const styles = {
  container: {
    backgroundColor: '#f5f5f5',
    minHeight: '100%',
  },
  
  content: {
    maxWidth: '1000px',
    margin: '0 auto',
  },
  
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: '8px',
    margin: '0 0 8px 0',
  },
  
  subtitle: {
    fontSize: '16px',
    color: '#6b7280',
    margin: 0,
  },
  
  controls: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  
  filters: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  
  filterSelect: {
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '14px',
    backgroundColor: 'white',
  },
  
  exportButton: {
    backgroundColor: '#059669',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
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
    margin: 0,
  },
  
  transactionsContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '20px',
    margin: '0 0 20px 0',
  },
  
  transactionsList: {
    display: 'grid',
    gap: '16px',
  },
  
  transactionItem: {
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '20px',
    backgroundColor: '#f9fafb',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  
  transactionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
  },
  
  transactionInfo: {
    flex: 1,
  },
  
  receiptNumber: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '4px',
    margin: '0 0 4px 0',
  },
  
  payerName: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
  },
  
  transactionBadges: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  
  typeBadge: {
    padding: '4px 8px',
    borderRadius: '12px',
    textAlign: 'center',
  },
  
  typeBadgeText: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'white',
  },
  
  statusBadge: {
    padding: '4px 8px',
    borderRadius: '12px',
    textAlign: 'center',
  },
  
  statusText: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'white',
    textTransform: 'capitalize',
  },
  
  transactionBody: {
    marginBottom: '16px',
  },
  
  transactionDetail: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  
  detailLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#6b7280',
  },
  
  detailValue: {
    fontSize: '14px',
    color: '#374151',
    fontWeight: '500',
  },
  
  transactionFooter: {
    borderTop: '1px solid #e5e7eb',
    paddingTop: '12px',
  },
  
  notificationStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  
  notificationLabel: {
    fontSize: '12px',
    color: '#6b7280',
    fontWeight: '500',
  },
  
  notificationBadge: {
    padding: '2px 6px',
    borderRadius: '8px',
    fontSize: '10px',
    fontWeight: '600',
    color: 'white',
    textTransform: 'capitalize',
  },
  
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
  },
  
  emptyStateText: {
    fontSize: '16px',
    color: '#6b7280',
    marginBottom: '8px',
    margin: '0 0 8px 0',
  },
  
  emptyStateSubtext: {
    fontSize: '14px',
    color: '#9ca3af',
    margin: 0,
  },
  
  // Modal styles
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '600px',
    maxHeight: '80vh',
    overflow: 'auto',
  },
  
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    borderBottom: '1px solid #e5e7eb',
  },
  
  modalTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#374151',
    margin: 0,
  },
  
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#6b7280',
  },
  
  modalBody: {
    padding: '20px',
  },
  
  detailsContainer: {
    display: 'grid',
    gap: '12px',
  },
  
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px solid #f3f4f6',
  },
  
  modalFooter: {
    display: 'flex',
    gap: '12px',
    padding: '20px',
    borderTop: '1px solid #e5e7eb',
    justifyContent: 'flex-end',
  },
  
  resendButton: {
    backgroundColor: '#f59e0b',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  
  closeModalButton: {
    backgroundColor: '#6b7280',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },

  // Confirmation modal styles
  confirmMessage: {
    textAlign: 'center',
    padding: '20px 0',
  },

  confirmText: {
    fontSize: '16px',
    color: '#374151',
    marginBottom: '12px',
    margin: '0 0 12px 0',
  },

  confirmSubtext: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
  },

  cancelButton: {
    backgroundColor: '#6b7280',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },

  resendConfirmButton: {
    backgroundColor: '#1e3a8a',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default TransactionArchiveScreen;