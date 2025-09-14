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
import { mockReceipts } from '../data/mockData';

/**
 * Receipt Verification Screen Component
 * Allows users to verify receipt authenticity through QR scanning or manual entry
 * 
 * Features:
 * - QR code scanning simulation
 * - Manual receipt number entry
 * - Complete receipt details display
 * - Payment and notification status tracking
 * - Interactive verification process
 */
const ReceiptVerificationScreen: React.FC = () => {
  const [receiptNumber, setReceiptNumber] = useState('');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  /**
   * Handles manual receipt verification
   * Validates input and searches for receipt in mock data
   */
  const handleManualVerification = () => {
    if (!receiptNumber.trim()) {
      Alert.alert('Error', 'Please enter a receipt number');
      return;
    }

    setIsVerifying(true);
    // Simulate API call delay for realistic experience
    setTimeout(() => {
      const receipt = mockReceipts.find(r => r.receiptNumber === receiptNumber.trim());
      setVerificationResult(receipt || null);
      setIsVerifying(false);
    }, 1000);
  };

  /**
   * Simulates QR code scanning functionality
   * In a real app, this would open the camera and scan QR codes
   */
  const handleQRScan = () => {
    Alert.alert(
      'QR Code Scanner',
      'QR code scanning functionality would be implemented here. For now, please use manual entry.',
      [{ text: 'OK' }]
    );
  };

  /**
   * Component to display successful verification results
   * Shows complete receipt details with status indicators
   */
  const VerificationResult: React.FC<{ receipt: any }> = ({ receipt }) => (
    <View style={styles.resultContainer}>
      <View style={styles.resultHeader}>
        <Text style={styles.resultTitle}>Receipt Verified</Text>
        <View style={[styles.statusBadge, { backgroundColor: '#10b981' }]}>
          <Text style={styles.statusText}>Valid</Text>
        </View>
      </View>
      
      <View style={styles.resultContent}>
        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Receipt Number:</Text>
          <Text style={styles.resultValue}>{receipt.receiptNumber}</Text>
        </View>
        
        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Payer:</Text>
          <Text style={styles.resultValue}>{receipt.payer}</Text>
        </View>
        
        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Amount:</Text>
          <Text style={styles.resultValue}>₱{receipt.amount.toLocaleString()}</Text>
        </View>
        
        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Purpose:</Text>
          <Text style={styles.resultValue}>{receipt.purpose}</Text>
        </View>
        
        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Category:</Text>
          <Text style={styles.resultValue}>{receipt.category}</Text>
        </View>
        
        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Organization:</Text>
          <Text style={styles.resultValue}>{receipt.organization}</Text>
        </View>
        
        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Issued By:</Text>
          <Text style={styles.resultValue}>{receipt.issuedBy}</Text>
        </View>
        
        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Date Issued:</Text>
          <Text style={styles.resultValue}>
            {new Date(receipt.issuedAt).toLocaleDateString()}
          </Text>
        </View>
        
        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Payment Status:</Text>
          <View style={[
            styles.statusBadge, 
            { backgroundColor: receipt.paymentStatus === 'completed' ? '#10b981' : 
              receipt.paymentStatus === 'pending' ? '#f59e0b' : '#ef4444' }
          ]}>
            <Text style={styles.statusText}>{receipt.paymentStatus}</Text>
          </View>
        </View>
        
        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Email Status:</Text>
          <View style={[
            styles.statusBadge, 
            { backgroundColor: receipt.emailStatus === 'sent' ? '#10b981' : 
              receipt.emailStatus === 'pending' ? '#f59e0b' : '#ef4444' }
          ]}>
            <Text style={styles.statusText}>{receipt.emailStatus}</Text>
          </View>
        </View>
        
        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>SMS Status:</Text>
          <View style={[
            styles.statusBadge, 
            { backgroundColor: receipt.smsStatus === 'sent' ? '#10b981' : 
              receipt.smsStatus === 'pending' ? '#f59e0b' : '#ef4444' }
          ]}>
            <Text style={styles.statusText}>{receipt.smsStatus}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  /**
   * Component to display when receipt is not found
   * Provides helpful suggestions for troubleshooting
   */
  const InvalidResult: React.FC = () => (
    <View style={styles.resultContainer}>
      <View style={styles.resultHeader}>
        <Text style={styles.resultTitle}>Receipt Not Found</Text>
        <View style={[styles.statusBadge, { backgroundColor: '#ef4444' }]}>
          <Text style={styles.statusText}>Invalid</Text>
        </View>
      </View>
      
      <View style={styles.resultContent}>
        <Text style={styles.invalidMessage}>
          The receipt number "{receiptNumber}" was not found in our system. Please check the receipt number and try again.
        </Text>
        
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>Suggestions:</Text>
          <Text style={styles.suggestionText}>• Verify the receipt number is correct</Text>
          <Text style={styles.suggestionText}>• Check for any typos or extra spaces</Text>
          <Text style={styles.suggestionText}>• Ensure the receipt was issued recently</Text>
          <Text style={styles.suggestionText}>• Contact the issuing organization if needed</Text>
        </View>
      </View>
    </View>
  );

  return (
    <Layout title="Receipt Verification" showBackButton={true}>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Verify Receipt Authenticity</Text>
          
          {/* Verification Methods */}
          <View style={styles.methodsContainer}>
            <TouchableOpacity style={styles.methodCard} onPress={handleQRScan}>
              <Text style={styles.methodTitle}>Scan QR Code</Text>
              <Text style={styles.methodSubtitle}>Use camera to scan receipt QR code</Text>
            </TouchableOpacity>
            
            <View style={styles.methodCard}>
              <Text style={styles.methodTitle}>Manual Entry</Text>
              <Text style={styles.methodSubtitle}>Enter receipt number manually</Text>
            </View>
          </View>

          {/* Manual Entry Form */}
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Enter Receipt Number</Text>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={receiptNumber}
                onChangeText={setReceiptNumber}
                placeholder="e.g., OR-2024-001"
                autoCapitalize="characters"
                autoCorrect={false}
              />
            </View>
            
            <TouchableOpacity
              style={[styles.verifyButton, isVerifying && styles.verifyButtonDisabled]}
              onPress={handleManualVerification}
              disabled={isVerifying}
            >
              <Text style={styles.verifyButtonText}>
                {isVerifying ? 'Verifying...' : 'Verify Receipt'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Verification Result */}
          {verificationResult && <VerificationResult receipt={verificationResult} />}
          {verificationResult === null && receiptNumber && !isVerifying && <InvalidResult />}

          {/* Information */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>About Receipt Verification</Text>
            <Text style={styles.infoText}>
              • Verify the authenticity of official receipts{'\n'}
              • Check payment status and notification delivery{'\n'}
              • View complete receipt details{'\n'}
              • Ensure receipt is from authorized organizations
            </Text>
          </View>
        </View>
      </ScrollView>
    </Layout>
  );
};

/**
 * Styles for the ReceiptVerificationScreen component
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
  
  // Section title
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e3a8a',  // Primary blue color
    marginBottom: 20,
    textAlign: 'center',
  },
  
  // Verification methods container
  methodsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  
  // Individual method card
  methodCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  // Method title
  methodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e3a8a',
    marginBottom: 4,
  },
  
  // Method subtitle
  methodSubtitle: {
    fontSize: 12,
    color: '#6b7280',
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
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  
  // Input container
  inputContainer: {
    marginBottom: 16,
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
  
  // Verify button
  verifyButton: {
    backgroundColor: '#1e3a8a',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  
  // Disabled verify button
  verifyButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  
  // Verify button text
  verifyButtonText: {
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
  
  // Invalid message
  invalidMessage: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  
  // Suggestions container
  suggestionsContainer: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 12,
  },
  
  // Suggestions title
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  
  // Suggestion text
  suggestionText: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
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

export default ReceiptVerificationScreen;
