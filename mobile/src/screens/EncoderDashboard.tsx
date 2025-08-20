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
import { useAuth } from '../context/AuthContext';
import { mockReceipts, getReceiptsByUser } from '../data/mockData';

/**
 * Encoder Dashboard Component
 * Provides personal statistics and receipt management tools for encoders
 * 
 * Features:
 * - Personal receipt statistics
 * - Recent receipts list
 * - Helpful tips and guidance
 * 
 * This dashboard is only accessible to users with 'Encoder' role
 */
const EncoderDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const userReceipts = user ? getReceiptsByUser(user.fullName) : [];

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

  /**
   * Calculates personal statistics for the encoder
   * @returns Object containing various statistics
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
      <ScrollView style={styles.container}>
        {/* Performance Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Statistics</Text>
          <View style={styles.statsGrid}>
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
          </View>
        </View>

        {/* Recent Receipts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Receipts</Text>
          <View style={styles.listContainer}>
            {userReceipts.slice(0, 5).map((receipt, index) => (
              <TouchableOpacity 
                key={receipt.id} 
                style={styles.listItem}
                onPress={() => {
                  alert(`Receipt: ${receipt.receiptNumber}\nPayer: ${receipt.payer}\nAmount: ₱${receipt.amount}\nPurpose: ${receipt.purpose}`);
                }}
              >
                <View style={styles.listItemContent}>
                  <Text style={styles.listItemTitle}>{receipt.receiptNumber}</Text>
                  <Text style={styles.listItemSubtitle}>
                    {receipt.payer} • {receipt.purpose}
                  </Text>
                  <Text style={styles.listItemDate}>
                    {new Date(receipt.issuedAt).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.listItemRight}>
                  <Text style={styles.listItemAmount}>₱{receipt.amount.toLocaleString()}</Text>
                  <View style={[
                    styles.statusBadge, 
                    { backgroundColor: receipt.paymentStatus === 'completed' ? '#10b981' : 
                      receipt.paymentStatus === 'pending' ? '#f59e0b' : '#ef4444' }
                  ]}>
                    <Text style={styles.statusText}>{receipt.paymentStatus}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
            {userReceipts.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No receipts issued yet</Text>
                <Text style={styles.emptyStateSubtext}>Start by issuing your first receipt</Text>
              </View>
            )}
          </View>
        </View>

        {/* Quick Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Tips</Text>
          <View style={styles.tipsContainer}>
            <View style={styles.tipItem}>
              <Text style={styles.tipTitle}>Always verify payer information</Text>
              <Text style={styles.tipText}>Double-check the payer's name and contact details</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipTitle}>Select appropriate template</Text>
              <Text style={styles.tipText}>Choose the right template for the transaction type</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipTitle}>Generate QR codes</Text>
              <Text style={styles.tipText}>Each receipt gets a unique QR code for verification</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </Layout>
  );
};

/**
 * Styles for the EncoderDashboard component
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
  
  // List container for receipts
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
    marginBottom: 2,
  },
  
  // List item date
  listItemDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  
  // List item right side (amount and status)
  listItemRight: {
    alignItems: 'flex-end',
  },
  
  // List item amount
  listItemAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 4,
  },
  
  // Status badge for payment status
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
  
  // Empty state when no receipts
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  
  // Tips container
  tipsContainer: {
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
  
  // Individual tip item
  tipItem: {
    marginBottom: 16,
  },
  
  // Tip title
  tipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  
  // Tip text
  tipText: {
    fontSize: 12,
    color: '#6b7280',
  },
});

export default EncoderDashboard;
