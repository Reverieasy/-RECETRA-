import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { mockOrganizations, mockCategories, addReceipt } from '../data/mockData';

/**
 * Payment Gateway Screen Component
 * Allows viewers to make payments through Paymongo and receive digital receipts automatically
 * 
 * Features:
 * - Payment form with Paymongo integration
 * - Organization and category selection
 * - Payment method selection (card, e-wallet, etc.)
 * - Automatic receipt generation and notifications
 * - Payment status tracking
 */
const PaymentGatewayScreen: React.FC = () => {
  const { user } = useAuth();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState({
    amount: '',
    organization: '',
    category: '',
    purpose: '',
    payerName: '',
    payerEmail: '',
    payerPhone: '',
    paymentMethod: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState<any>(null);

  /**
   * Handles payment submission
   * Processes payment through Paymongo and generates receipt
   */
  const handlePaymentSubmit = async () => {
    if (!paymentData.amount || !paymentData.organization || !paymentData.payerName) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsProcessing(true);
    
    // Simulate Paymongo payment processing
    setTimeout(() => {
      const amount = parseFloat(paymentData.amount);
      const receiptNumber = `OR-${Date.now()}`;
      
      // Create receipt data
      const receipt = {
        id: `receipt_${Date.now()}`,
        receiptNumber,
        payer: paymentData.payerName,
        amount,
        purpose: paymentData.purpose || 'Payment via Paymongo',
        category: paymentData.category || 'Online Payment',
        organization: paymentData.organization,
        issuedBy: 'Paymongo Gateway',
        issuedAt: new Date().toISOString(),
        paymentStatus: 'completed',
        emailStatus: 'sent',
        smsStatus: 'sent',
        paymentMethod: 'Paymongo',
        payerEmail: paymentData.payerEmail,
        payerPhone: paymentData.payerPhone,
      };

      // Add receipt to mock data
      addReceipt(receipt);

      // Simulate sending notifications
      setTimeout(() => {
        Alert.alert(
          'Payment Successful!',
          `Receipt ${receiptNumber} has been generated and sent to your email/SMS.`,
          [
            {
              text: 'View Receipt',
              onPress: () => {
                setPaymentResult(receipt);
                setShowPaymentModal(false);
              }
            },
            { text: 'OK' }
          ]
        );
      }, 1000);

      setIsProcessing(false);
    }, 2000);
  };

  /**
   * Handles payment method selection
   * @param method - Selected payment method
   */
  const handlePaymentMethodSelect = (method: string) => {
    setPaymentData({ ...paymentData, paymentMethod: method });
  };

  /**
   * Component to display payment result
   * Shows receipt details after successful payment
   */
  const PaymentResult: React.FC<{ receipt: any }> = ({ receipt }) => (
    <View style={styles.resultContainer}>
      <View style={styles.resultHeader}>
        <Text style={styles.resultTitle}>Payment Successful!</Text>
        <View style={[styles.statusBadge, { backgroundColor: '#10b981' }]}>
          <Text style={styles.statusText}>Completed</Text>
        </View>
      </View>
      
      <View style={styles.resultContent}>
        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Receipt Number:</Text>
          <Text style={styles.resultValue}>{receipt.receiptNumber}</Text>
        </View>
        
        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Amount:</Text>
          <Text style={styles.resultValue}>₱{receipt.amount.toLocaleString()}</Text>
        </View>
        
        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Organization:</Text>
          <Text style={styles.resultValue}>{receipt.organization}</Text>
        </View>
        
        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Purpose:</Text>
          <Text style={styles.resultValue}>{receipt.purpose}</Text>
        </View>
        
        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Payment Method:</Text>
          <Text style={styles.resultValue}>{receipt.paymentMethod}</Text>
        </View>
        
        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Date:</Text>
          <Text style={styles.resultValue}>
            {new Date(receipt.issuedAt).toLocaleDateString()}
          </Text>
        </View>
        
        <View style={styles.notificationStatus}>
          <Text style={styles.notificationTitle}>Notifications Sent:</Text>
          <View style={styles.notificationRow}>
            <View style={[styles.notificationBadge, { backgroundColor: receipt.emailStatus === 'sent' ? '#10b981' : '#ef4444' }]}>
              <Text style={styles.notificationText}>Email: {receipt.emailStatus}</Text>
            </View>
            <View style={[styles.notificationBadge, { backgroundColor: receipt.smsStatus === 'sent' ? '#10b981' : '#ef4444' }]}>
              <Text style={styles.notificationText}>SMS: {receipt.smsStatus}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <Layout title="Payment Gateway" showBackButton={true}>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          {/* Payment Information */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Make a Payment</Text>
            <Text style={styles.sectionSubtitle}>
              Pay securely through Paymongo and receive digital receipts automatically
            </Text>
          </View>

          {/* Payment Form */}
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Payment Details</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Amount (₱)</Text>
              <TextInput
                style={styles.input}
                value={paymentData.amount}
                onChangeText={(text) => setPaymentData({...paymentData, amount: text})}
                placeholder="Enter amount"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Organization</Text>
              <View style={styles.selectContainer}>
                {mockOrganizations.map(org => (
                  <TouchableOpacity
                    key={org.name}
                    style={[
                      styles.selectOption,
                      paymentData.organization === org.name && styles.selectOptionActive
                    ]}
                    onPress={() => setPaymentData({...paymentData, organization: org.name})}
                  >
                    <Text style={[
                      styles.selectOptionText,
                      paymentData.organization === org.name && styles.selectOptionTextActive
                    ]}>
                      {org.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Category (Optional)</Text>
              <View style={styles.selectContainer}>
                {mockCategories.map(category => (
                  <TouchableOpacity
                    key={category.name}
                    style={[
                      styles.selectOption,
                      paymentData.category === category.name && styles.selectOptionActive
                    ]}
                    onPress={() => setPaymentData({...paymentData, category: category.name})}
                  >
                    <Text style={[
                      styles.selectOptionText,
                      paymentData.category === category.name && styles.selectOptionTextActive
                    ]}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Purpose (Optional)</Text>
              <TextInput
                style={styles.input}
                value={paymentData.purpose}
                onChangeText={(text) => setPaymentData({...paymentData, purpose: text})}
                placeholder="Enter purpose of payment"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Payer Name</Text>
              <TextInput
                style={styles.input}
                value={paymentData.payerName}
                onChangeText={(text) => setPaymentData({...paymentData, payerName: text})}
                placeholder="Enter your full name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email (for receipt)</Text>
              <TextInput
                style={styles.input}
                value={paymentData.payerEmail}
                onChangeText={(text) => setPaymentData({...paymentData, payerEmail: text})}
                placeholder="Enter your email address"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone (for SMS receipt)</Text>
              <TextInput
                style={styles.input}
                value={paymentData.payerPhone}
                onChangeText={(text) => setPaymentData({...paymentData, payerPhone: text})}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Payment Method</Text>
              <View style={styles.paymentMethods}>
                {['card', 'gcash', 'paymaya', 'bank_transfer'].map(method => (
                  <TouchableOpacity
                    key={method}
                    style={[
                      styles.paymentMethod,
                      paymentData.paymentMethod === method && styles.paymentMethodActive
                    ]}
                    onPress={() => handlePaymentMethodSelect(method)}
                  >
                    <Text style={[
                      styles.paymentMethodText,
                      paymentData.paymentMethod === method && styles.paymentMethodTextActive
                    ]}>
                      {method === 'card' ? 'Credit/Debit Card' :
                       method === 'gcash' ? 'GCash' :
                       method === 'paymaya' ? 'PayMaya' :
                       'Bank Transfer'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Card Details (if card payment selected) */}
            {paymentData.paymentMethod === 'card' && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Card Number</Text>
                  <TextInput
                    style={styles.input}
                    value={paymentData.cardNumber}
                    onChangeText={(text) => setPaymentData({...paymentData, cardNumber: text})}
                    placeholder="1234 5678 9012 3456"
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.cardRow}>
                  <View style={styles.cardInput}>
                    <Text style={styles.inputLabel}>Expiry Date</Text>
                    <TextInput
                      style={styles.input}
                      value={paymentData.expiryDate}
                      onChangeText={(text) => setPaymentData({...paymentData, expiryDate: text})}
                      placeholder="MM/YY"
                    />
                  </View>
                  <View style={styles.cardInput}>
                    <Text style={styles.inputLabel}>CVV</Text>
                    <TextInput
                      style={styles.input}
                      value={paymentData.cvv}
                      onChangeText={(text) => setPaymentData({...paymentData, cvv: text})}
                      placeholder="123"
                      keyboardType="numeric"
                      maxLength={3}
                    />
                  </View>
                </View>
              </>
            )}

            <TouchableOpacity
              style={[styles.payButton, isProcessing && styles.payButtonDisabled]}
              onPress={handlePaymentSubmit}
              disabled={isProcessing}
            >
              <Text style={styles.payButtonText}>
                {isProcessing ? 'Processing Payment...' : 'Pay with Paymongo'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Payment Result */}
          {paymentResult && <PaymentResult receipt={paymentResult} />}

          {/* Information */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>About Paymongo Payments</Text>
            <Text style={styles.infoText}>
              • Secure payment processing through Paymongo{'\n'}
              • Automatic receipt generation{'\n'}
              • Email and SMS notifications{'\n'}
              • Multiple payment methods supported{'\n'}
              • Real-time payment status tracking
            </Text>
          </View>
        </View>
      </ScrollView>
    </Layout>
  );
};

/**
 * Styles for the PaymentGatewayScreen component
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
  
  // Information section
  infoSection: {
    marginBottom: 24,
  },
  
  // Section title
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 8,
  },
  
  // Section subtitle
  sectionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  
  // Form container
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
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
  
  // Form title
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 20,
  },
  
  // Input group
  inputGroup: {
    marginBottom: 16,
  },
  
  // Input label
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  
  // Input field
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  
  // Select container
  selectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  
  // Select option
  selectOption: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  
  // Active select option
  selectOptionActive: {
    backgroundColor: '#1e3a8a',
  },
  
  // Select option text
  selectOptionText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  
  // Active select option text
  selectOptionTextActive: {
    color: 'white',
  },
  
  // Payment methods
  paymentMethods: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  
  // Payment method
  paymentMethod: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  
  // Active payment method
  paymentMethodActive: {
    backgroundColor: '#1e3a8a',
  },
  
  // Payment method text
  paymentMethodText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  
  // Active payment method text
  paymentMethodTextActive: {
    color: 'white',
  },
  
  // Card row
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  // Card input
  cardInput: {
    flex: 1,
    marginRight: 8,
  },
  
  // Pay button
  payButton: {
    backgroundColor: '#10b981',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  
  // Disabled pay button
  payButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  
  // Pay button text
  payButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Result container
  resultContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
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
  
  // Result header
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  
  // Result title
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
  },
  
  // Result content
  resultContent: {
    padding: 16,
  },
  
  // Result row
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  
  // Result label
  resultLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    flex: 1,
  },
  
  // Result value
  resultValue: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
    textAlign: 'right',
  },
  
  // Status badge
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  
  // Status text
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  
  // Notification status
  notificationStatus: {
    marginTop: 16,
  },
  
  // Notification title
  notificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  
  // Notification row
  notificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  // Notification badge
  notificationBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 4,
  },
  
  // Notification text
  notificationText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
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

export default PaymentGatewayScreen;
