import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  Platform,
  StatusBar,
} from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import Layout from '../components/Layout';
import ReceiptTemplate from '../components/ReceiptTemplate';
import { mockReceipts } from '../data/mockData';
import QRCode from 'react-native-qrcode-svg';


/**
 * Receipt Verification Screen Component
 * Allows users to verify receipt authenticity through QR scanning or manual entry
 * 
 * Features:
 * - QR code scanning with camera
 * - Manual receipt number entry
 * - Complete receipt details display
 * - Payment and notification status tracking
 * - Interactive verification process
 */
const ReceiptVerificationScreen: React.FC = () => {
    const [receiptNumber, setReceiptNumber] = useState('');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  
  // QR Scanner state
  const [showScanner, setShowScanner] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showQRPopup, setShowQRPopup] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);

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
   * Opens the QR code scanner
   */
  const handleQRScan = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      
      if (status === 'granted') {
        setShowScanner(true);
      } else {
        Alert.alert(
          'Camera Permission',
          'Camera access is required to scan QR codes. Please enable it in Settings.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.log('Permission request failed:', error);
      Alert.alert('Error', 'Failed to request camera permission');
    }
  };

  /**
   * Handles successful QR code scan
   */
  const handleBarCodeScanned = ({ data }: { data: string }) => {
    // Prevent multiple scans
    if (isScanning) return;
    
    setIsScanning(true);
    setShowScanner(false);
    setReceiptNumber(data);
    
    Alert.alert(
      'QR Code Scanned!',
      `Receipt number: ${data}`,
      [
        { text: 'Cancel', style: 'cancel', onPress: () => setIsScanning(false) },
        { text: 'Verify', onPress: () => {
          setIsScanning(false);
          handleManualVerification();
        }}
      ]
    );
  };

  /**
   * Shows QR code popup for a receipt
   */
  const showReceiptQR = (receipt: any) => {
    setSelectedReceipt(receipt);
    setShowQRPopup(true);
  };

  /**
   * Closes the QR popup
   */
  const closeQRPopup = () => {
    setShowQRPopup(false);
    setSelectedReceipt(null);
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
      
      {/* Display the receipt using the same template as issued receipts */}
      <View style={styles.receiptDisplay}>
        <ReceiptTemplate 
          receipt={receipt} 
          organization={receipt.organization} 
        />
      </View>
      
      {/* Additional verification details */}
      <View style={styles.verificationDetails}>
        <Text style={styles.verificationTitle}>Verification Details</Text>
        <View style={styles.verificationRow}>
          <Text style={styles.verificationLabel}>Payment Status:</Text>
          <View style={[
            styles.statusBadge, 
            { backgroundColor: receipt.paymentStatus === 'completed' ? '#10b981' : 
              receipt.paymentStatus === 'pending' ? '#f59e0b' : '#ef4444' }
          ]}>
            <Text style={styles.statusText}>{receipt.paymentStatus}</Text>
          </View>
        </View>
        
        <View style={styles.verificationRow}>
          <Text style={styles.verificationLabel}>Email Status:</Text>
          <View style={[
            styles.statusBadge, 
            { backgroundColor: receipt.emailStatus === 'sent' ? '#10b981' : 
              receipt.emailStatus === 'pending' ? '#f59e0b' : '#ef4444' }
          ]}>
            <Text style={styles.statusText}>{receipt.emailStatus}</Text>
          </View>
        </View>
        
        <View style={styles.verificationRow}>
          <Text style={styles.verificationLabel}>Verification Date:</Text>
          <Text style={styles.verificationValue}>
            {new Date().toLocaleString()}
          </Text>
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



          {/* QR Scanner Modal */}
          <Modal
            animationType="slide"
            transparent={false}
            visible={showScanner}
            onRequestClose={() => {
              setShowScanner(false);
              setIsScanning(false);
            }}
          >
            <View style={{ flex: 1, backgroundColor: 'black' }}>
              {hasPermission === null ? (
                <Text style={{ textAlign: 'center', marginTop: 40, color: 'white' }}>Requesting camera permission...</Text>
              ) : hasPermission === false ? (
                <Text style={{ textAlign: 'center', marginTop: 40, color: 'red' }}>
                  No access to camera. Please allow camera permissions in settings.
                </Text>
              ) : (
                <View style={{ flex: 1 }}>
                  <CameraView
                    style={{ flex: 1 }}
                    facing="back"
                    onBarcodeScanned={handleBarCodeScanned}
                  />
                  {/* Scanning overlay */}
                  <View style={styles.scanningOverlay}>
                    <View style={styles.scanningFrame}>
                      <View style={[styles.scanningCorner, styles.scanningCornerTopLeft]} />
                      <View style={[styles.scanningCorner, styles.scanningCornerTopRight]} />
                      <View style={[styles.scanningCorner, styles.scanningCornerBottomLeft]} />
                      <View style={[styles.scanningCorner, styles.scanningCornerBottomRight]} />
                    </View>
                    <Text style={styles.scanningText}>Point camera at QR code</Text>
                  </View>
                </View>
              )}
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  top: 40,
                  right: 24,
                  backgroundColor: '#1e3a8a',
                  padding: 12,
                  borderRadius: 24,
                  zIndex: 999,
                }}
                onPress={() => {
                  setShowScanner(false);
                  setIsScanning(false);
                }}
              >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Close</Text>
              </TouchableOpacity>
            </View>
          </Modal>

          {/* QR Code Popup Modal */}
          <Modal
            animationType="fade"
            transparent={true}
            visible={showQRPopup}
            onRequestClose={closeQRPopup}
          >
            <View style={styles.qrPopupOverlay}>
              <View style={styles.qrPopupContent}>
                <View style={styles.qrPopupHeader}>
                  <Text style={styles.qrPopupTitle}>Receipt QR Code</Text>
                  <TouchableOpacity style={styles.qrPopupCloseButton} onPress={closeQRPopup}>
                    <Text style={styles.qrPopupCloseText}>✕</Text>
                  </TouchableOpacity>
                </View>
                
                {selectedReceipt && (
                  <View style={styles.qrPopupBody}>
                    <Text style={styles.qrPopupReceiptTitle}>{selectedReceipt.receiptNumber}</Text>
                    <Text style={styles.qrPopupReceiptDetails}>
                      {selectedReceipt.payer} • ₱{selectedReceipt.amount.toLocaleString()}
                    </Text>
                    
                    <View style={styles.qrPopupCodeWrapper}>
                      <QRCode 
                        value={selectedReceipt.receiptNumber}
                        size={120}
                        color="black"
                        backgroundColor="white"
                      />
                    </View>
                    
                    <Text style={styles.qrPopupNote}>
                      Scan this QR code to verify receipt authenticity
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </Modal>

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
  
  // Scanning overlay styles
  scanningOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanningFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#4f46e5',
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  scanningCorner: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: '#4f46e5',
    borderRadius: 10,
  },
  scanningCornerTopLeft: {
    top: -10,
    left: -10,
  },
  scanningCornerTopRight: {
    top: -10,
    right: -10,
  },
  scanningCornerBottomLeft: {
    bottom: -10,
    left: -10,
  },
  scanningCornerBottomRight: {
    bottom: -10,
    right: -10,
  },
  scanningText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    textAlign: 'center',
  },
  
  // QR Popup styles
  qrPopupOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrPopupContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 350,
    alignItems: 'center',
  },
  qrPopupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  qrPopupTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e3a8a',
  },
  qrPopupCloseButton: {
    backgroundColor: '#ef4444',
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrPopupCloseText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  qrPopupBody: {
    alignItems: 'center',
    width: '100%',
  },
  qrPopupReceiptTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e3a8a',
    marginBottom: 8,
    textAlign: 'center',
  },
  qrPopupReceiptDetails: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
    textAlign: 'center',
  },
  qrPopupCodeWrapper: {
    marginBottom: 20,
  },
  qrPopupNote: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    fontStyle: 'italic',
  },

  // New styles for receipt display
  receiptDisplay: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // Verification details styles
  verificationDetails: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  verificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },

  verificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  verificationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },

  verificationValue: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },

});

export default ReceiptVerificationScreen;