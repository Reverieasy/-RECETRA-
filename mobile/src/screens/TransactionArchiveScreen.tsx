import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native';

const TransactionArchiveScreen = () => {
  const [transactions] = useState([
    {
      id: '1',
      receiptNumber: 'OR-2024-001',
      customerName: 'John Doe',
      amount: 1500,
      date: '2024-01-15',
      status: 'completed',
      paymentMethod: 'Cash',
    },
    {
      id: '2',
      receiptNumber: 'OR-2024-002',
      customerName: 'Jane Smith',
      amount: 2300,
      date: '2024-01-16',
      status: 'completed',
      paymentMethod: 'Credit Card',
    },
    {
      id: '3',
      receiptNumber: 'OR-2024-003',
      customerName: 'Bob Johnson',
      amount: 800,
      date: '2024-01-17',
      status: 'pending',
      paymentMethod: 'Bank Transfer',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const handleViewTransaction = (transaction: any) => {
    Alert.alert(
      'Transaction Details',
      `Receipt Number: ${transaction.receiptNumber}\nCustomer: ${transaction.customerName}\nAmount: $${transaction.amount}\nDate: ${transaction.date}\nStatus: ${transaction.status}\nPayment Method: ${transaction.paymentMethod}`,
      [
        {
          text: 'Resend Notification',
          onPress: () => {
            Alert.alert('Success', 'Notification resent successfully');
          },
        },
        {
          text: 'OK',
          style: 'default',
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Choose export format:',
      [
        {
          text: 'CSV',
          onPress: () => {
            Alert.alert('Success', 'Data exported to CSV successfully');
          },
        },
        {
          text: 'PDF',
          onPress: () => {
            Alert.alert('Success', 'Data exported to PDF successfully');
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const getFilteredTransactions = () => {
    let filtered = transactions;

    if (searchQuery) {
      filtered = filtered.filter(transaction =>
        transaction.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.customerName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(transaction => transaction.status === filterStatus);
    }

    return filtered;
  };

  const getTransactionType = (transaction: any) => {
    if (transaction.paymentMethod === 'Credit Card' || transaction.paymentMethod === 'Debit Card') {
      return 'Card Payment';
    } else if (transaction.paymentMethod === 'Bank Transfer') {
      return 'Bank Transfer';
    } else {
      return 'Cash Payment';
    }
  };

  const getTransactionTypeColor = (transaction: any) => {
    if (transaction.paymentMethod === 'Credit Card' || transaction.paymentMethod === 'Debit Card') {
      return '#007AFF';
    } else if (transaction.paymentMethod === 'Bank Transfer') {
      return '#34C759';
    } else {
      return '#FF9500';
    }
  };

  const filteredTransactions = getFilteredTransactions();

  const totalAmount = filteredTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const completedTransactions = filteredTransactions.filter(transaction => transaction.status === 'completed').length;
  const pendingTransactions = filteredTransactions.filter(transaction => transaction.status === 'pending').length;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Transaction Archive</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{filteredTransactions.length}</Text>
            <Text style={styles.statLabel}>Total Transactions</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>${totalAmount}</Text>
            <Text style={styles.statLabel}>Total Amount</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{completedTransactions}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{pendingTransactions}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search transactions..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Filter by Status:</Text>
          <View style={styles.filterButtons}>
            {['all', 'completed', 'pending'].map(status => (
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
                  {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.transactionsContainer}>
          <View style={styles.transactionsHeader}>
            <Text style={styles.transactionsTitle}>Transactions</Text>
            <TouchableOpacity style={styles.exportButton} onPress={handleExportData}>
              <Text style={styles.exportButtonText}>Export</Text>
            </TouchableOpacity>
          </View>

          {filteredTransactions.map((transaction) => (
            <TouchableOpacity
              key={transaction.id}
              style={styles.transactionCard}
              onPress={() => handleViewTransaction(transaction)}
            >
              <View style={styles.transactionHeader}>
                <Text style={styles.receiptNumber}>{transaction.receiptNumber}</Text>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: transaction.status === 'completed' ? '#10b981' : '#f59e0b' }
                ]}>
                  <Text style={styles.statusText}>{transaction.status}</Text>
                </View>
              </View>
              
              <View style={styles.transactionDetails}>
                <Text style={styles.customerName}>{transaction.customerName}</Text>
                <Text style={styles.amount}>${transaction.amount}</Text>
              </View>
              
              <View style={styles.transactionFooter}>
                <Text style={styles.date}>{transaction.date}</Text>
                <View style={[
                  styles.typeBadge,
                  { backgroundColor: getTransactionTypeColor(transaction) }
                ]}>
                  <Text style={styles.typeText}>{getTransactionType(transaction)}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}

          {filteredTransactions.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No transactions found</Text>
              <Text style={styles.emptyStateSubtext}>
                Try adjusting your search or filters
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  filterContainer: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  filterButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: 'white',
  },
  transactionsContainer: {
    marginBottom: 20,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  transactionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  exportButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  exportButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  transactionCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  receiptNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  transactionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  customerName: {
    fontSize: 14,
    color: '#666',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  transactionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 5,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default TransactionArchiveScreen;
