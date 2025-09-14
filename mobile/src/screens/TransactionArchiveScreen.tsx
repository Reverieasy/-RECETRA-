import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useInlineNotification } from '../components/InlineNotificationSystem';
import { mockReceipts, getReceiptsByOrganization } from '../data/mockData';

/**
 * Transaction Archive Screen Component
 * Allows encoders to view and track all transactions including Paymongo payments and manual receipts
 * 
 * Features:
 * - View all transactions for the organization
 * - Filter by transaction type (Paymongo vs Manual)
 * - Filter by payment status
 * - View transaction details
 * - Track notification status
 * - Export transaction data
 */
const TransactionArchiveScreen: React.FC = () => {
  const { user } = useAuth();
  const { showSuccess, showError, showWarning } = useInlineNotification();
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

  /**
   * Gets all transactions for the user's organization
   * @returns Array of transactions
   */
  const getTransactions = () => {
    if (!user) return [];
    return getReceiptsByOrganization(user.organization);
  };

  /**
   * Filters transactions based on selected filters
   * @returns Filtered list of transactions
   */
  const getFilteredTransactions = () => {
    const transactions = getTransactions();
    
    return transactions.filter(transaction => {
      const typeMatch = filterType === 'all' || 
        (filterType === 'paymongo' && transaction.paymentMethod === 'Paymongo') ||
        (filterType === 'manual' && transaction.paymentMethod !== 'Paymongo');
      
      const statusMatch = filterStatus === 'all' || transaction.paymentStatus === filterStatus;
      
      return typeMatch && statusMatch;
    });
  };

  /**
   * Gets transaction type display name
   * @param transaction - Transaction object
   * @returns Formatted transaction type
   */
  const getTransactionType = (transaction: any) => {
    return transaction.paymentMethod === 'Paymongo' ? 'Paymongo Payment' : 'Manual Receipt';
  };

  /**
   * Gets transaction type color
   * @param transaction - Transaction object
   * @returns Color for transaction type badge
   */
  const getTransactionTypeColor = (transaction: any) => {
    return transaction.paymentMethod === 'Paymongo' ? '#10b981' : '#f59e0b';
  };

  /**
   * Handles viewing transaction details
   * @param transaction - Transaction to view
   */
  const handleViewTransaction = (transaction: any) => {
    setSelectedTransaction(transaction);
    Alert.alert(
      'Transaction Details',
      `Receipt: ${transaction.receiptNumber}\n` +
      `Payer: ${transaction.payer}\n` +
      `Amount: ₱${transaction.amount.toLocaleString()}\n` +
      `Purpose: ${transaction.purpose}\n` +
      `Category: ${transaction.category}\n` +
      `Payment Method: ${transaction.paymentMethod}\n` +
      `Status: ${transaction.paymentStatus}\n` +
      `Issued By: ${transaction.issuedBy}\n` +
      `Date: ${new Date(transaction.issuedAt).toLocaleDateString()}\n` +
      `Email Status: ${transaction.emailStatus}\n` +
      `SMS Status: ${transaction.smsStatus}`,
      [{ text: 'OK' }]
    );
  };

  /**
   * Handles resending notifications
   * @param transaction - Transaction to resend notifications for
   */
  const handleResendNotifications = (transaction: any) => {
    Alert.alert(
      'Resend Notifications',
      `Resend email and SMS notifications for receipt ${transaction.receiptNumber}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Resend',
          onPress: () => {
            // Simulate resending notifications
            setTimeout(() => {
              showSuccess('Notifications have been resent successfully!', 'Success');
            }, 1000);
          },
        },
      ]
    );
  };

  /**
   * Handles exporting transaction data
   */
  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Export transaction data to CSV format?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Export',
          onPress: () => {
            showSuccess('Transaction data has been exported successfully!', 'Success');
          },
        },
      ]
    );
  };

  /**
   * Component to display transaction item
   * @param transaction - Transaction to display
   */
  const TransactionItem: React.FC<{ transaction: any }> = ({ transaction }) => (
    <TouchableOpacity
      style={styles.transactionItem}
      onPress={() => handleViewTransaction(transaction)}
    >
      <View style={styles.transactionHeader}>
        <Text style={styles.transactionNumber}>{transaction.receiptNumber}</Text>
        <View style={[
          styles.typeBadge,
          { backgroundColor: getTransactionTypeColor(transaction) }
        ]}>
          <Text style={styles.typeBadgeText}>
            {getTransactionType(transaction)}
          </Text>
        </View>
      </View>
      
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionPayer}>{transaction.payer}</Text>
        <Text style={styles.transactionAmount}>₱{transaction.amount.toLocaleString()}</Text>
      </View>
      
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionPurpose}>{transaction.purpose}</Text>
        <Text style={styles.transactionDate}>
          {new Date(transaction.issuedAt).toLocaleDateString()}
        </Text>
      </View>
      
      <View style={styles.transactionStatus}>
        <View style={[
          styles.statusBadge,
          { backgroundColor: transaction.paymentStatus === 'completed' ? '#10b981' : 
            transaction.paymentStatus === 'pending' ? '#f59e0b' : '#ef4444' }
        ]}>
          <Text style={styles.statusText}>{transaction.paymentStatus}</Text>
        </View>
        
        <View style={styles.notificationStatus}>
          <View style={[
            styles.notificationDot,
            { backgroundColor: transaction.emailStatus === 'sent' ? '#10b981' : '#ef4444' }
          ]} />
          <View style={[
            styles.notificationDot,
            { backgroundColor: transaction.smsStatus === 'sent' ? '#10b981' : '#ef4444' }
          ]} />
        </View>
      </View>
    </TouchableOpacity>
  );

  const filteredTransactions = getFilteredTransactions();

  return (
    <Layout title="Transaction Archive" showBackButton={true}>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          {/* Header Actions */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.exportButton}
              onPress={handleExportData}
            >
              <Text style={styles.exportButtonText}>Export Data</Text>
            </TouchableOpacity>
          </View>

          {/* Filters */}
          <View style={styles.filtersContainer}>
            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Filter by Type:</Text>
              <View style={styles.filterButtons}>
                {['all', 'paymongo', 'manual'].map(type => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.filterButton,
                      filterType === type && styles.filterButtonActive
                    ]}
                    onPress={() => setFilterType(type)}
                  >
                    <Text style={[
                      styles.filterButtonText,
                      filterType === type && styles.filterButtonTextActive
                    ]}>
                      {type === 'all' ? 'All' : 
                       type === 'paymongo' ? 'Paymongo' : 'Manual'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Filter by Status:</Text>
              <View style={styles.filterButtons}>
                {['all', 'completed', 'pending', 'failed'].map(status => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.filterButton,
                      filterStatus === status && styles.filterButtonActive
                    ]}
                    onPress={() => setFilterStatus(status)}
                  >
                    <Text style={[
                      styles.filterButtonText,
                      filterStatus === status && styles.filterButtonTextActive
                    ]}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Statistics */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{filteredTransactions.length}</Text>
              <Text style={styles.statLabel}>Total Transactions</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                ₱{filteredTransactions.reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
              </Text>
              <Text style={styles.statLabel}>Total Amount</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {filteredTransactions.filter(t => t.paymentMethod === 'Paymongo').length}
              </Text>
              <Text style={styles.statLabel}>Paymongo Payments</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {filteredTransactions.filter(t => t.paymentMethod !== 'Paymongo').length}
              </Text>
              <Text style={styles.statLabel}>Manual Receipts</Text>
            </View>
          </View>

          {/* Transactions List */}
          <View style={styles.transactionsContainer}>
            <Text style={styles.sectionTitle}>
              Transactions ({filteredTransactions.length})
            </Text>
            
            {filteredTransactions.map(transaction => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
            
            {filteredTransactions.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No transactions found</Text>
                <Text style={styles.emptyStateSubtext}>
                  Try adjusting your filters or check back later
                </Text>
              </View>
            )}
          </View>

          {/* Information */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>Transaction Archive</Text>
            <Text style={styles.infoText}>
              • View all transactions for your organization{'\n'}
              • Track Paymongo payments and manual receipts{'\n'}
              • Monitor notification status (email/SMS){'\n'}
              • Export transaction data for reporting{'\n'}
              • Filter by transaction type and status
            </Text>
          </View>
        </View>
      </ScrollView>
    </Layout>
  );
};

/**
 * Styles for the TransactionArchiveScreen component
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
  
  // Header section
  header: {
    marginBottom: 20,
  },
  
  // Export button
  exportButton: {
    backgroundColor: '#1e3a8a',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  
  // Export button text
  exportButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Filters container
  filtersContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  // Filter row
  filterRow: {
    marginBottom: 12,
  },
  
  // Filter label
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  
  // Filter buttons container
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  
  // Filter button
  filterButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  
  // Active filter button
  filterButtonActive: {
    backgroundColor: '#1e3a8a',
  },
  
  // Filter button text
  filterButtonText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  
  // Active filter button text
  filterButtonTextActive: {
    color: 'white',
  },
  
  // Statistics container
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  
  // Stat card
  statCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  
  // Stat value
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 4,
  },
  
  // Stat label
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  
  // Transactions container
  transactionsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
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
  
  // Transaction item
  transactionItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  
  // Transaction header
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  // Transaction number
  transactionNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  
  // Type badge
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  
  // Type badge text
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
  
  // Transaction details
  transactionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  // Transaction payer
  transactionPayer: {
    fontSize: 14,
    color: '#6b7280',
  },
  
  // Transaction amount
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  
  // Transaction info
  transactionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  // Transaction purpose
  transactionPurpose: {
    fontSize: 12,
    color: '#9ca3af',
    flex: 1,
  },
  
  // Transaction date
  transactionDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  
  // Transaction status
  transactionStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  // Status badge
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  
  // Status text
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
  
  // Notification status
  notificationStatus: {
    flexDirection: 'row',
  },
  
  // Notification dot
  notificationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 4,
  },
  
  // Empty state
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  
  // Empty state text
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
  },
  
  // Empty state subtitle
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  
  // Information container
  infoContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  // Information title
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  
  // Information text
  infoText: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 18,
  },
});

export default TransactionArchiveScreen;
