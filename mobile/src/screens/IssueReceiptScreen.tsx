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
import { useInlineNotification } from '../components/InlineNotificationSystem';
import { mockOrganizations, mockCategories, addReceipt } from '../data/mockData';
import { emailService } from '../services/emailService';
import ReceiptTemplate from '../components/ReceiptTemplate';

/**
 * Issue Receipt Screen Component
 * Allows encoders to manually issue receipts with QR codes and email delivery
 * 
 * Features:
 * - Manual receipt issuance
 * - Automatic QR code generation
 * - Automatic email delivery to payer
 * - Receipt verification
 */
const IssueReceiptScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const { showSuccess, showError, showWarning } = useInlineNotification();
  const [receiptData, setReceiptData] = useState({
    organization: user?.organization || '',
    category: '',
    amount: '',
    purpose: '',
    payerName: '',
    payerEmail: '',
    template: '',
  });
  const [generatedReceipt, setGeneratedReceipt] = useState<any>(null);

  // Organization mapping for auto-fill
  const organizationMapping = {
    'Computer Science Society': {
      purpose: 'Computer Science Society Activities',
      category: 'Student Organization',
      template: '1' // Student Organization Receipt
    },
    'Student Council': {
      purpose: 'Student Council Activities',
      category: 'Student Government',
      template: '2' // Student Government Receipt
    },
    'Engineering Society': {
      purpose: 'Engineering Society Activities',
      category: 'Student Organization',
      template: '1' // Student Organization Receipt
    },
    'NU Dasma Admin': {
      purpose: 'Administrative Services',
      category: 'Administration',
      template: '3' // Administrative Receipt
    }
  };

  // Category mapping for auto-fill
  const categoryMapping = {
    'Student Organization': {
      purpose: 'Student Organization Activities',
      template: '1' // Student Organization Receipt
    },
    'Student Government': {
      purpose: 'Student Government Activities',
      template: '2' // Student Government Receipt
    },
    'Administration': {
      purpose: 'Administrative Services',
      template: '3' // Administrative Receipt
    },
    'Event Registration': {
      purpose: 'Event Registration Fee',
      template: '4' // Event Registration Receipt
    },
    'Membership': {
      purpose: 'Membership Fee',
      template: '5' // Membership Fee Receipt
    }
  };

  // Purpose mapping for auto-fill
  const purposeMapping = {
    'Event Registration': {
      category: 'Event Registration',
      template: '4' // Event Registration Receipt
    },
    'Membership Fee': {
      category: 'Membership',
      template: '5' // Membership Fee Receipt
    },
    'Activity Fee': {
      category: 'Student Organization',
      template: '1' // Student Organization Receipt
    },
    'Administrative Services': {
      category: 'Administration',
      template: '3' // Administrative Receipt
    },
    'Computer Science Society Activities': {
      category: 'Student Organization',
      template: '1' // Student Organization Receipt
    },
    'Student Council Activities': {
      category: 'Student Government',
      template: '2' // Student Government Receipt
    },
    'Engineering Society Activities': {
      category: 'Student Organization',
      template: '1' // Student Organization Receipt
    }
  };

  // Template mapping for auto-fill
  const templateMapping = {
    '1': {
      category: 'Student Organization',
      purpose: 'Student Organization Activities'
    },
    '2': {
      category: 'Student Government',
      purpose: 'Student Government Activities'
    },
    '3': {
      category: 'Administration',
      purpose: 'Administrative Services'
    },
    '4': {
      category: 'Event Registration',
      purpose: 'Event Registration Fee'
    },
    '5': {
      category: 'Membership',
      purpose: 'Membership Fee'
    }
  };

  // Available organizations for dropdown
  const availableOrganizations = [
    'Computer Science Society',
    'Student Council', 
    'Engineering Society',
    'NU Dasma Admin'
  ];

  // Available purposes for dropdown
  const availablePurposes = [
    'Event Registration',
    'Membership Fee',
    'Activity Fee',
    'Administrative Services',
    'Computer Science Society Activities',
    'Student Council Activities',
    'Engineering Society Activities',
    'Other'
  ];

  /**
   * Handles organization change and auto-fills related fields
   */
  const handleOrganizationChange = (organization: string) => {
    const mapping = organizationMapping[organization] || {};
    setReceiptData(prev => ({
      ...prev,
      organization,
      purpose: mapping.purpose || prev.purpose,
      category: mapping.category || prev.category,
      template: mapping.template || prev.template
    }));
  };

  /**
   * Handles category change and auto-fills related fields
   */
  const handleCategoryChange = (category: string) => {
    const mapping = categoryMapping[category] || {};
    setReceiptData(prev => ({
      ...prev,
      category,
      purpose: mapping.purpose || prev.purpose,
      template: mapping.template || prev.template
    }));
  };

  /**
   * Handles purpose change and auto-fills related fields
   */
  const handlePurposeChange = (purpose: string) => {
    const mapping = purposeMapping[purpose] || {};
    setReceiptData(prev => ({
      ...prev,
      purpose,
      category: mapping.category || prev.category,
      template: mapping.template || prev.template
    }));
  };

  /**
   * Handles template change and auto-fills related fields
   */
  const handleTemplateChange = (template: string) => {
    const mapping = templateMapping[template] || {};
    setReceiptData(prev => ({
      ...prev,
      template,
      category: mapping.category || prev.category,
      purpose: mapping.purpose || prev.purpose
    }));
  };

  /**
   * Handles receipt submission
   * Generates receipt with QR code and sends email to payer
   */
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      // Generate unique receipt number
      const receiptNumber = `OR-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
      
      // Generate QR code data with receipt details for verification
      const qrCodeData = JSON.stringify({
        receiptNumber,
        amount: parseFloat(receiptData.amount),
        payer: receiptData.payerName,
        organization: receiptData.organization,
        purpose: receiptData.purpose,
        timestamp: Date.now()
      });

      // Generate receipt with QR code
      const receipt = {
        id: `receipt_${Date.now()}`,
        receiptNumber,
        payer: receiptData.payerName,
        payerEmail: receiptData.payerEmail,
        amount: parseFloat(receiptData.amount),
        purpose: receiptData.purpose,
        category: receiptData.category,
        organization: receiptData.organization,
        issuedBy: user?.fullName || 'Manual Issuance',
        issuedAt: new Date().toISOString(),
        templateId: 'manual_receipt',
        qrCode: qrCodeData,
        paymentStatus: 'completed' as const,
        emailStatus: 'pending' as 'pending' | 'sent' | 'failed',
        isDigital: true,
      };

      // Add receipt to system
      addReceipt(receipt);

      // Send email to payer automatically
      if (receiptData.payerEmail) {
        try {
          const emailResult = await emailService.sendReceiptEmail(receipt, receiptData.payerEmail);
          
          if (emailResult.success) {
            console.log('📧 Manual receipt email sent successfully to:', receiptData.payerEmail);
            receipt.emailStatus = 'sent';
          } else {
            console.error('❌ Failed to send manual receipt email:', emailResult.error);
            receipt.emailStatus = 'failed';
          }
        } catch (emailError) {
          console.error('❌ Email service error:', emailError);
          receipt.emailStatus = 'failed';
        }
      }

      // Set generated receipt for display
      setGeneratedReceipt(receipt);

      // Reset form
      setReceiptData({
        organization: '',
        category: '',
        amount: '',
        purpose: '',
        payerName: '',
        payerEmail: '',
        template: '',
      });

      showSuccess('Receipt generated successfully and email sent to payer!', 'Success');
    } catch (error) {
      showError('Failed to generate receipt. Please try again.', 'Error');
    }
  };

  /**
   * Validates form data
   * @returns {boolean} True if form is valid
   */
  const validateForm = () => {
    if (!receiptData.organization || !receiptData.category || !receiptData.amount || 
        !receiptData.purpose || !receiptData.payerName || !receiptData.payerEmail) {
      showError('Please fill in all required fields', 'Validation Error');
      return false;
    }

    if (parseFloat(receiptData.amount) <= 0) {
      showError('Please enter a valid amount', 'Validation Error');
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
    setReceiptData(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Resets form to initial state
   */
  const handleReset = () => {
    setReceiptData({
      organization: '',
      category: '',
      amount: '',
      purpose: '',
      payerName: '',
      payerEmail: '',
      template: '',
    });
    setGeneratedReceipt(null);
  };

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
          <Text style={styles.title}>Issue Receipt</Text>
          <Text style={styles.subtitle}>Generate digital receipts with QR codes and automatic email delivery</Text>
        </View>

        {/* Receipt Form */}
        <View style={styles.form}>
          {/* Organization and Category */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Receipt Details</Text>
            <View style={styles.formRow}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Organization *</Text>
                <View style={styles.pickerContainer}>
                  <Text style={styles.pickerText}>
                    {receiptData.organization || 'Select organization'}
                  </Text>
                </View>
                {availableOrganizations.map((org: string) => (
                  <TouchableOpacity
                    key={org}
                    style={[
                      styles.optionButton,
                      receiptData.organization === org && styles.optionButtonActive
                    ]}
                    onPress={() => handleOrganizationChange(org)}
                  >
                    <Text style={[
                      styles.optionButtonText,
                      receiptData.organization === org && styles.optionButtonTextActive
                    ]}>
                      {org}
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
                    {receiptData.category || 'Select category'}
                  </Text>
                </View>
                {mockCategories.map((category: any) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.optionButton,
                      receiptData.category === category.name && styles.optionButtonActive
                    ]}
                    onPress={() => handleCategoryChange(category.name)}
                  >
                    <Text style={[
                      styles.optionButtonText,
                      receiptData.category === category.name && styles.optionButtonTextActive
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
                  value={receiptData.amount}
                  onChangeText={(value) => handleInputChange('amount', value)}
                  placeholder="0.00"
                  keyboardType="numeric"
                  placeholderTextColor="#9ca3af"
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Purpose *</Text>
                <View style={styles.pickerContainer}>
                  <Text style={styles.pickerText}>
                    {receiptData.purpose || 'Select purpose'}
                  </Text>
                </View>
                {availablePurposes.map((purpose: string) => (
                  <TouchableOpacity
                    key={purpose}
                    style={[
                      styles.optionButton,
                      receiptData.purpose === purpose && styles.optionButtonActive
                    ]}
                    onPress={() => handlePurposeChange(purpose)}
                  >
                    <Text style={[
                      styles.optionButtonText,
                      receiptData.purpose === purpose && styles.optionButtonTextActive
                    ]}>
                      {purpose}
                    </Text>
                  </TouchableOpacity>
                ))}
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
                  value={receiptData.payerName}
                  onChangeText={(value) => handleInputChange('payerName', value)}
                  placeholder="Enter payer's full name"
                  placeholderTextColor="#9ca3af"
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Email Address *</Text>
                <TextInput
                  style={styles.input}
                  value={receiptData.payerEmail}
                  onChangeText={(value) => handleInputChange('payerEmail', value)}
                  placeholder="Enter payer's email address"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>
          </View>

          {/* Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Receipt Summary</Text>
            <View style={styles.summary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Organization:</Text>
                <Text style={styles.summaryValue}>{receiptData.organization || 'Not selected'}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Category:</Text>
                <Text style={styles.summaryValue}>{receiptData.category || 'Not selected'}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Amount:</Text>
                <Text style={styles.summaryValue}>₱{receiptData.amount || '0.00'}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Purpose:</Text>
                <Text style={styles.summaryValue}>{receiptData.purpose || 'Not specified'}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Email Delivery:</Text>
                <Text style={styles.summaryValue}>Automatic to {receiptData.payerEmail || 'Not specified'}</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Generate Receipt</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleReset}
            >
              <Text style={styles.resetButtonText}>Reset Form</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Generated Receipt */}
        {generatedReceipt && (
          <View style={styles.resultContainer}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>Receipt Generated!</Text>
              <View style={[styles.statusBadge, { backgroundColor: '#10b981' }]}>
                <Text style={styles.statusText}>Success</Text>
              </View>
            </View>
            
            {/* Display the receipt using the same template as verification */}
            <View style={styles.receiptDisplay}>
              <ReceiptTemplate 
                receipt={generatedReceipt} 
                organization={generatedReceipt.organization}
                paymentMethod="Cash"
              />
            </View>

            {/* Email Status */}
            <View style={styles.emailStatusContainer}>
              <Text style={styles.emailStatusLabel}>Email Status: </Text>
              <View style={[
                styles.statusBadge,
                { 
                  backgroundColor: generatedReceipt.emailStatus === 'sent' ? '#10b981' : 
                    generatedReceipt.emailStatus === 'pending' ? '#f59e0b' : '#ef4444',
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 4,
                }
              ]}>
                <Text style={styles.statusText}>
                  {generatedReceipt.emailStatus}
                </Text>
              </View>
            </View>
          </View>
        )}


      </ScrollView>
    </SafeAreaView>
  );
};

/**
 * Styles for the IssueReceiptScreen component
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
    gap: 12,
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: '#1e3a8a',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    minWidth: 200,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  resetButton: {
    backgroundColor: '#6b7280',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    minWidth: 200,
  },
  resetButtonText: {
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
  receiptDisplay: {
    marginTop: 16,
    marginBottom: 16,
  },
  emailStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 8,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  emailStatusLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginRight: 8,
  },

});

export default IssueReceiptScreen;
