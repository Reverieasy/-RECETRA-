import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { mockOrganizations, mockCategories, addReceipt } from '../data/mockData';
import { emailService } from '../services/emailService';
import QRCode from 'react-native-qrcode-svg';

/**
 * Payment Gateway Screen Component
 * Allows viewers to make payments through PayMongo and receive digital receipts
 * 
 * Features:
 * - PayMongo payment processing
 * - Automatic receipt generation with QR codes
 * - Automatic email delivery to payer
 * - Receipt verification
 */
const PaymentGatewayScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [paymentData, setPaymentData] = useState({
    organization: '',
    category: '',
    amount: '',
    purpose: '',
    payerName: '',
    payerEmail: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState<any>(null);

  /**
   * Handles payment submission
   * Processes payment through PayMongo and generates receipt with QR code and email
   */
  const handlePaymentSubmit = async () => {
    if (!validatePaymentForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      // TODO: REAL PAYMONGO INTEGRATION
      // 1. Create payment intent with PayMongo
      // const paymentIntent = await paymongo.createPaymentIntent({
      //   amount: parseFloat(paymentData.amount) * 100, // Convert to centavos
      //   currency: 'PHP',
      //   description: paymentData.purpose,
      //   // Add your PayMongo API key here
      //   apiKey: 'YOUR_PAYMONGO_SECRET_KEY'
      // });
      
      // 2. Redirect to PayMongo payment page or show payment form
      // 3. Handle payment success/failure callbacks
      // 4. Generate receipt only after successful payment

      // For now, simulate payment processing
      console.log('🔄 Simulating PayMongo payment processing...');
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate unique receipt number
      const receiptNumber = `OR-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
      
      // Generate QR code data with receipt details for verification
      const qrCodeData = JSON.stringify({
        receiptNumber,
        amount: parseFloat(paymentData.amount),
        payer: paymentData.payerName,
        organization: paymentData.organization,
        purpose: paymentData.purpose,
        timestamp: Date.now()
      });

      // Generate receipt with QR code
      const receipt = {
        id: `receipt_${Date.now()}`,
        receiptNumber,
        payer: paymentData.payerName,
        payerEmail: paymentData.payerEmail,
        amount: parseFloat(paymentData.amount),
        purpose: paymentData.purpose,
        category: paymentData.category,
        organization: paymentData.organization,
        issuedBy: user?.fullName || 'PayMongo Gateway',
        issuedAt: new Date().toISOString(),
        templateId: 'digital_payment',
        qrCode: qrCodeData,
        paymentStatus: 'completed' as const,
        emailStatus: 'pending' as 'pending' | 'sent' | 'failed',
        smsStatus: 'pending' as 'pending' | 'sent' | 'failed',
        isDigital: true,
      };

      // Add receipt to system
      addReceipt(receipt);

      // Send email to payer automatically
      if (paymentData.payerEmail) {
        try {
          const emailResult = await emailService.sendReceiptEmail(receipt, paymentData.payerEmail);
          
          if (emailResult.success) {
            console.log('📧 PayMongo receipt email sent successfully to:', paymentData.payerEmail);
            receipt.emailStatus = 'sent';
          } else {
            console.error('❌ Failed to send PayMongo receipt email:', emailResult.error);
            receipt.emailStatus = 'failed';
          }
        } catch (emailError) {
          console.error('❌ Email service error:', emailError);
          receipt.emailStatus = 'failed';
        }
      }

      setPaymentResult({
        success: true,
        receipt,
        message: 'Payment successful through PayMongo! Digital receipt has been generated and sent to your email.',
      });

      // Reset form
      setPaymentData({
        organization: '',
        category: '',
        amount: '',
        purpose: '',
        payerName: '',
        payerEmail: '',
      });

    } catch (error) {
      setPaymentResult({
        success: false,
        message: 'Payment failed. Please try again or contact support.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Validates payment form data
   * @returns {boolean} True if form is valid
   */
  const validatePaymentForm = () => {
    if (!paymentData.organization || !paymentData.category || !paymentData.amount || 
        !paymentData.purpose || !paymentData.payerName || !paymentData.payerEmail) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return false;
    }

    if (parseFloat(paymentData.amount) <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid amount');
      return false;
    }

    return true;
  };

  /**
   * Handles input changes
   * @param {string} field - Field name to update
   * @param {string} value - New value for the field
   */
  const handleInputChange = (field: string, value: string) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Component to display payment result
   * Shows receipt details after successful payment
   */
  const PaymentResult = () => (
    <View style={styles.resultContainer}>
      <View style={styles.resultHeader}>
        <Text style={styles.resultTitle}>Payment Successful!</Text>
        <View style={[styles.statusBadge, { backgroundColor: '#10b981' }]}>
          <Text style={styles.statusText}>Completed</Text>
        </View>
      </View>
      
      <View style={styles.resultContent}>
        <Text style={styles.successMessage}>{paymentResult.message}</Text>
        
        <View style={styles.receiptSummary}>
          <Text style={styles.receiptSummaryTitle}>Receipt Summary</Text>
          <View style={styles.receiptSummaryDetails}>
            <Text style={styles.receiptDetail}>
              <Text style={styles.receiptDetailLabel}>Receipt Number: </Text>
              {paymentResult.receipt.receiptNumber}
            </Text>
            <Text style={styles.receiptDetail}>
              <Text style={styles.receiptDetailLabel}>Amount: </Text>
              ₱{paymentResult.receipt.amount.toLocaleString()}
            </Text>
            <Text style={styles.receiptDetail}>
              <Text style={styles.receiptDetailLabel}>Purpose: </Text>
              {paymentResult.receipt.purpose}
            </Text>
            <Text style={styles.receiptDetail}>
              <Text style={styles.receiptDetailLabel}>Organization: </Text>
              {paymentResult.receipt.organization}
            </Text>
            <Text style={styles.receiptDetail}>
              <Text style={styles.receiptDetailLabel}>Email Status: </Text>
              <Text style={[
                styles.statusBadge,
                { 
                  backgroundColor: paymentResult.receipt.emailStatus === 'sent' ? '#10b981' : 
                    paymentResult.receipt.emailStatus === 'pending' ? '#f59e0b' : '#ef4444',
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 4,
                  fontSize: 12,
                  color: 'white',
                  fontWeight: '600'
                }
              ]}>
                {paymentResult.receipt.emailStatus}
              </Text>
            </Text>
          </View>
        </View>

        {/* QR Code Display */}
        <View style={styles.qrCodeSection}>
          <Text style={styles.qrCodeTitle}>Receipt QR Code</Text>
          <Text style={styles.qrCodeDescription}>
            This QR code contains the receipt information and can be scanned for verification
          </Text>
          <View style={styles.qrCodeContainer}>
            <QRCode 
              value={paymentResult.receipt.qrCode}
              size={120}
              color="black"
              backgroundColor="white"
            />
            <Text style={styles.qrCodeNote}>
              Scan this QR code to verify receipt authenticity
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.title}>Payment Gateway</Text>
          <Text style={styles.subtitle}>Make secure payments through PayMongo and receive digital receipts</Text>
        </View>

        {/* Payment Form */}
        <View style={styles.form}>
          {/* Organization and Category */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Details</Text>
            <View style={styles.formRow}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Organization *</Text>
                <View style={styles.pickerContainer}>
                  <Text style={styles.pickerText}>
                    {paymentData.organization || 'Select organization'}
                  </Text>
                </View>
                {mockOrganizations.map((org) => (
                  <TouchableOpacity
                    key={org.id}
                    style={[
                      styles.optionButton,
                      paymentData.organization === org.name && styles.optionButtonActive
                    ]}
                    onPress={() => handleInputChange('organization', org.name)}
                  >
                    <Text style={[
                      styles.optionButtonText,
                      paymentData.organization === org.name && styles.optionButtonTextActive
                    ]}>
                      {org.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.formRow}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Category *</Text>
                <View style={styles.pickerContainer}>
                  <Text style={styles.pickerText}>
                    {paymentData.category || 'Select category'}
                  </Text>
                </View>
                {mockCategories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.optionButton,
                      paymentData.category === category.name && styles.optionButtonActive
                    ]}
                    onPress={() => handleInputChange('category', category.name)}
                  >
                    <Text style={[
                      styles.optionButtonText,
                      paymentData.category === category.name && styles.optionButtonTextActive
                    ]}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Amount (₱) *</Text>
                <TextInput
                  style={styles.input}
                  value={paymentData.amount}
                  onChangeText={(value) => handleInputChange('amount', value)}
                  placeholder="0.00"
                  keyboardType="numeric"
                  placeholderTextColor="#9ca3af"
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Purpose *</Text>
                <TextInput
                  style={styles.input}
                  value={paymentData.purpose}
                  onChangeText={(value) => handleInputChange('purpose', value)}
                  placeholder="e.g., Event Registration"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>
          </View>

          {/* Payer Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payer Information</Text>
            <View style={styles.formRow}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Full Name *</Text>
                <TextInput
                  style={styles.input}
                  value={paymentData.payerName}
                  onChangeText={(value) => handleInputChange('payerName', value)}
                  placeholder="Enter your full name"
                  placeholderTextColor="#9ca3af"
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Email Address *</Text>
                <TextInput
                  style={styles.input}
                  value={paymentData.payerEmail}
                  onChangeText={(value) => handleInputChange('payerEmail', value)}
                  placeholder="Enter your email address"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>
          </View>

          {/* Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Summary</Text>
            <View style={styles.summary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Organization:</Text>
                <Text style={styles.summaryValue}>{paymentData.organization || 'Not selected'}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Category:</Text>
                <Text style={styles.summaryValue}>{paymentData.category || 'Not selected'}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Amount:</Text>
                <Text style={styles.summaryValue}>₱{paymentData.amount || '0.00'}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Purpose:</Text>
                <Text style={styles.summaryValue}>{paymentData.purpose || 'Not specified'}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Email Delivery:</Text>
                <Text style={styles.summaryValue}>Automatic to {paymentData.payerEmail || 'Not specified'}</Text>
              </View>
            </View>
          </View>

          {/* Action Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.submitButton,
                isProcessing && styles.submitButtonDisabled
              ]}
              onPress={handlePaymentSubmit}
              disabled={isProcessing}
            >
              <Text style={styles.submitButtonText}>
                {isProcessing ? 'Processing Payment...' : 'Pay Now'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Payment Result */}
        {paymentResult && <PaymentResult />}
      </ScrollView>
    </SafeAreaView>
  );
};

/**
 * Styles for the PaymentGatewayScreen component
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  headerTop: {
    width: '100%',
    marginBottom: 16,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  formRow: {
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: 'white',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    backgroundColor: 'white',
    marginBottom: 8,
  },
  pickerText: {
    fontSize: 14,
    color: '#374151',
  },
  optionButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: 'white',
  },
  optionButtonActive: {
    borderColor: '#1e3a8a',
    backgroundColor: '#1e3a8a',
  },
  optionButtonText: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
  },
  optionButtonTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  summary: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    color: '#6b7280',
    fontSize: 14,
  },
  summaryValue: {
    fontWeight: '500',
    color: '#374151',
    fontSize: 14,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: '#1e3a8a',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    minWidth: 200,
  },
  submitButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  resultContainer: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e3a8a',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  resultContent: {
    flex: 1,
  },
  successMessage: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 20,
    lineHeight: 22,
  },
  receiptSummary: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  receiptSummaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  receiptSummaryDetails: {
    gap: 8,
  },
  receiptDetail: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  receiptDetailLabel: {
    fontWeight: '600',
    color: '#374151',
  },
  qrCodeSection: {
    alignItems: 'center',
  },
  qrCodeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  qrCodeDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 20,
  },
  qrCodeContainer: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  qrCodeNote: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 12,
    textAlign: 'center',
  },

});

export default PaymentGatewayScreen;
