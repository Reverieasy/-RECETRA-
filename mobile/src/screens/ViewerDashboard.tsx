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
import { mockReceipts, getReceiptsByOrganization } from '../data/mockData';

/**
 * Viewer Dashboard Component
 * Provides read-only access to receipt information for viewers
 * 
 * Features:
 * - Organization statistics overview
 * - Recent receipts list (read-only)
 * - Information about viewer role capabilities
 * 
 * This dashboard is only accessible to users with 'Viewer' role
 */
const ViewerDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const organizationReceipts = user ? getReceiptsByOrganization(user.organization) : [];

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
   * Calculates organization statistics for the viewer
   * @returns Object containing various statistics
   */
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
      <ScrollView style={styles.container}>
        {/* Transaction Records */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transaction Records</Text>
          <View style={styles.statsGrid}>
            <StatCard
              title="Total Receipts"
              value={stats.totalReceipts}
              subtitle="Organization total"
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
            {organizationReceipts.slice(0, 5).map((receipt, index) => (
              <TouchableOpacity 
                key={receipt.id} 
                style={styles.listItem}
                onPress={() => {
                  alert(`Receipt: ${receipt.receiptNumber}\nPayer: ${receipt.payer}\nAmount: ₱${receipt.amount}\nPurpose: ${receipt.purpose}\nIssued by: ${receipt.issuedBy}`);
                }}
              >
                <View style={styles.listItemContent}>
                  <Text style={styles.listItemTitle}>{receipt.receiptNumber}</Text>
                  <Text style={styles.listItemSubtitle}>
                    {receipt.payer} • {receipt.purpose}
                  </Text>
                  <Text style={styles.listItemDate}>
                    {new Date(receipt.issuedAt).toLocaleDateString()} • {receipt.issuedBy}
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
            {organizationReceipts.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No receipts found</Text>
                <Text style={styles.emptyStateSubtext}>No receipts have been issued for this organization yet</Text>
              </View>
            )}
          </View>
        </View>

        {/* Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Information</Text>
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Text style={styles.infoTitle}>Viewer Role</Text>
              <Text style={styles.infoText}>
                You have read-only access to receipt information for your organization. You can view, search, and verify receipts but cannot create or modify them.
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoTitle}>Receipt Verification</Text>
              <Text style={styles.infoText}>
                Use the verification feature to scan QR codes or enter receipt numbers to verify the authenticity of receipts.
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoTitle}>Data Export</Text>
              <Text style={styles.infoText}>
                You can export receipt data for reporting and analysis purposes.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </Layout>
  );
};

/**
 * Styles for the ViewerDashboard component
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
  
  // Individual info item
  infoItem: {
    marginBottom: 16,
  },
  
  // Info title
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  
  // Info text
  infoText: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 18,
  },
});

export default ViewerDashboard;
