import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { mockCategories, mockReceiptTemplates, addReceipt } from '../data/mockData';

/**
 * Issue Receipt Screen Component
 * Allows encoders to manually issue receipts for cash transactions
 * 
 * Features:
 * - Manual receipt issuance for cash payments
 * - Optional category and purpose fields
 * - Template selection
 * - QR code generation
 * - Email/SMS notifications
 * - Receipt customization
 */
const IssueReceiptScreen: React.FC = () => {
  const { user } = useAuth();
  const [receiptData, setReceiptData] = useState({
    payer: '',
    amount: '',
    purpose: '',
    category: '',
    template: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handles receipt submission
   * Validates input and creates new receipt
   */
  const handleSubmit = () => {
    if (!receiptData.payer.trim() || !receiptData.amount.trim()) {
      Alert.alert('Error', 'Payer name and amount are required');
      return;
    }

    const amount = parseFloat(receiptData.amount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setIsSubmitting(true);

    // Generate unique receipt number
    const receiptNumber = `OR-${Date.now()}`;
    
    // Create receipt data
    const receipt = {
      id: `receipt_${Date.now()}`,
      receiptNumber,
      payer: receiptData.payer,
      amount,
      purpose: receiptData.purpose || 'Cash Payment',
      category: receiptData.category || 'Manual Receipt',
      organization: user?.organization || '',
      issuedBy: user?.fullName || '',
      issuedAt: new Date().toISOString(),
      paymentStatus: 'completed',
      emailStatus: 'pending',
      smsStatus: 'pending',
      paymentMethod: 'Cash',
      template: receiptData.template || 'Standard Receipt',
    };

    // Add receipt to mock data
    addReceipt(receipt);

    // Simulate QR code generation and notifications
    setTimeout(() => {
      Alert.alert(
        'Receipt Issued Successfully!',
        `Receipt ${receiptNumber} has been created.\n\nQR Code generated and notifications sent.`,
        [
          {
            text: 'View Receipt',
            onPress: () => {
              Alert.alert(
                'Receipt Details',
                `Receipt Number: ${receiptNumber}\n` +
                `Payer: ${receipt.payer}\n` +
                `Amount: ₱${receipt.amount.toLocaleString()}\n` +
                `Purpose: ${receipt.purpose}\n` +
                `Category: ${receipt.category}\n` +
                `Template: ${receipt.template}\n` +
                `Issued By: ${receipt.issuedBy}\n` +
                `Date: ${new Date(receipt.issuedAt).toLocaleDateString()}`,
                [{ text: 'OK' }]
              );
            }
          },
          { text: 'OK' }
        ]
      );

      // Reset form
      setReceiptData({
        payer: '',
        amount: '',
        purpose: '',
        category: '',
        template: '',
      });

      setIsSubmitting(false);
    }, 1500);
  };

  /**
   * Gets available templates for the user's organization
   * @returns Array of templates
   */
  const getAvailableTemplates = () => {
    if (!user) return [];
    return mockReceiptTemplates.filter(template => 
      template.organization === user.organization && template.isActive
    );
  };

  return (
    <Layout title="Issue Receipt" showBackButton={true}>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          {/* Header Information */}
          <View style={styles.headerSection}>
            <Text style={styles.sectionTitle}>Manual Receipt Issuance</Text>
            <Text style={styles.sectionSubtitle}>
              Issue receipts for cash transactions. All fields marked with * are required.
            </Text>
          </View>

          {/* Receipt Form */}
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Receipt Details</Text>
            
            {/* Payer Name - Required */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Payer Name *</Text>
              <TextInput
                style={styles.input}
                value={receiptData.payer}
                onChangeText={(text) => setReceiptData({...receiptData, payer: text})}
                placeholder="Enter payer's full name"
              />
            </View>

            {/* Amount - Required */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Amount (₱) *</Text>
              <TextInput
                style={styles.input}
                value={receiptData.amount}
                onChangeText={(text) => setReceiptData({...receiptData, amount: text})}
                placeholder="Enter amount"
                keyboardType="numeric"
              />
            </View>

            {/* Purpose - Optional */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Purpose (Optional)</Text>
              <TextInput
                style={styles.input}
                value={receiptData.purpose}
                onChangeText={(text) => setReceiptData({...receiptData, purpose: text})}
                placeholder="Enter purpose of payment"
                multiline
                numberOfLines={2}
              />
            </View>

            {/* Category - Optional */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Category (Optional)</Text>
              <View style={styles.selectContainer}>
                {mockCategories.map(category => (
                  <TouchableOpacity
                    key={category.name}
                    style={[
                      styles.selectOption,
                      receiptData.category === category.name && styles.selectOptionActive
                    ]}
                    onPress={() => setReceiptData({...receiptData, category: category.name})}
                  >
                    <Text style={[
                      styles.selectOptionText,
                      receiptData.category === category.name && styles.selectOptionTextActive
                    ]}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Template Selection - Optional */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Receipt Template (Optional)</Text>
              <View style={styles.selectContainer}>
                {getAvailableTemplates().map(template => (
                  <TouchableOpacity
                    key={template.id}
                    style={[
                      styles.selectOption,
                      receiptData.template === template.name && styles.selectOptionActive
                    ]}
                    onPress={() => setReceiptData({...receiptData, template: template.name})}
                  >
                    <Text style={[
                      styles.selectOptionText,
                      receiptData.template === template.name && styles.selectOptionTextActive
                    ]}>
                      {template.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? 'Issuing Receipt...' : 'Issue Receipt'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Information */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>Manual Receipt Issuance</Text>
            <Text style={styles.infoText}>
              • Issue receipts for cash transactions{'\n'}
              • QR codes are automatically generated{'\n'}
              • Email and SMS notifications sent{'\n'}
              • Receipts are stored in transaction archive{'\n'}
              • Templates can be customized per organization
            </Text>
          </View>

          {/* Quick Tips */}
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>Quick Tips</Text>
            <Text style={styles.tipsText}>
              • Always verify payer information{'\n'}
              • Use appropriate templates for your organization{'\n'}
              • Category and purpose help with reporting{'\n'}
              • Receipts are automatically archived{'\n'}
              • QR codes enable easy verification
            </Text>
          </View>
        </View>
      </ScrollView>
    </Layout>
  );
};

/**
 * Styles for the IssueReceiptScreen component
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
  headerSection: {
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
  
  // Submit button
  submitButton: {
    backgroundColor: '#10b981',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  
  // Disabled submit button
  submitButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  
  // Submit button text
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Information container
  infoContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
  
  // Tips container
  tipsContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#1e3a8a',
  },
  
  // Tips title
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  
  // Tips text
  tipsText: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 18,
  },
});

export default IssueReceiptScreen;
