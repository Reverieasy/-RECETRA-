import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
} from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import Layout from '../components/Layout';
import { useInlineNotification } from '../components/InlineNotificationSystem';
import ReceiptTemplate from '../components/ReceiptTemplate';
import { mockReceipts } from '../data/mockData';
import QRCode from 'react-native-qrcode-svg';

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
  const { showSuccess, showError, showWarning } = useInlineNotification();

  const handleManualVerification = () => {
    if (!receiptNumber.trim()) {
      showError('Please enter a receipt number', 'Error');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      const receipt = mockReceipts.find(r => r.receiptNumber === receiptNumber.trim());
      setVerificationResult(receipt || null);
      setIsVerifying(false);
    }, 1000);
  };

  const handleQRScan = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      if (status === 'granted') {
        setShowScanner(true);
      } else {
        showWarning('Camera access is required to scan QR codes. Please enable it in Settings.', 'Camera Permission');
      }
    } catch (error) {
      console.log('Permission request failed:', error);
      showError('Failed to request camera permission', 'Error');
    }
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (isScanning) return;
    setIsScanning(true);
    setShowScanner(false);
    setReceiptNumber(data);
    showSuccess(`QR Code scanned: ${data}`, 'QR Code Scanned');
    setTimeout(() => {
      setIsScanning(false);
      handleManualVerification();
    }, 1000);
  };

  const showReceiptQR = (receipt: any) => {
    setSelectedReceipt(receipt);
    setShowQRPopup(true);
  };

  const closeQRPopup = () => {
    setShowQRPopup(false);
    setSelectedReceipt(null);
  };

  const VerificationResult: React.FC<{ receipt: any }> = ({ receipt }) => (
    <View style={styles.resultContainer}>
      <View style={styles.resultHeader}>
        <Text style={styles.resultTitle}>Receipt Verified</Text>
        <View style={[styles.statusBadge, { backgroundColor: '#10b981' }]}>
          <Text style={styles.statusText}>Valid</Text>
        </View>
      </View>
      <View style={styles.receiptDisplay}>
        <ReceiptTemplate 
          receipt={receipt} 
          organization={receipt.organization}
        />
      </View>
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
          {verificationResult && <VerificationResult receipt={verificationResult} />}
          {verificationResult === null && receiptNumber && !isVerifying && <InvalidResult />}
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

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 8 },
  sectionTitle: { fontSize: 24, fontWeight: 'bold', color: '#1e3a8a', marginBottom: 14, textAlign: 'center' },
  methodsContainer: { flexDirection: 'row', marginBottom: 18 },
  methodCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  methodTitle: { fontSize: 15, fontWeight: '600', color: '#1e3a8a', marginBottom: 2 },
  methodSubtitle: { fontSize: 12, color: '#6b7280' },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  formTitle: { fontSize: 17, fontWeight: '600', color: '#374151', marginBottom: 12 },
  inputContainer: { marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    backgroundColor: 'white',
  },
  verifyButton: {
    backgroundColor: '#1e3a8a',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  verifyButtonDisabled: { backgroundColor: '#9ca3af' },
  verifyButtonText: { color: 'white', fontSize: 15, fontWeight: '600' },
  resultContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  resultTitle: { fontSize: 17, fontWeight: 'bold', color: '#374151' },
  resultContent: { padding: 12 },
  statusBadge: { paddingHorizontal: 6, paddingVertical: 3, borderRadius: 11 },
  statusText: { fontSize: 12, fontWeight: '600', color: 'white' },
  invalidMessage: { fontSize: 13, color: '#6b7280', lineHeight: 20, marginBottom: 12 },
  suggestionsContainer: { backgroundColor: '#f3f4f6', borderRadius: 8, padding: 8 },
  suggestionsTitle: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  suggestionText: { fontSize: 12, color: '#6b7280', marginBottom: 2 },
  infoContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoTitle: { fontSize: 15, fontWeight: '600', color: '#374151', marginBottom: 7 },
  infoText: { fontSize: 12, color: '#6b7280', lineHeight: 18 },
  scanningOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanningFrame: {
    width: 220,
    height: 220,
    borderWidth: 2,
    borderColor: '#4f46e5',
    borderRadius: 18,
    backgroundColor: 'transparent',
  },
  scanningCorner: {
    position: 'absolute',
    width: 18,
    height: 18,
    backgroundColor: '#4f46e5',
    borderRadius: 9,
  },
  scanningCornerTopLeft: { top: -9, left: -9 },
  scanningCornerTopRight: { top: -9, right: -9 },
  scanningCornerBottomLeft: { bottom: -9, left: -9 },
  scanningCornerBottomRight: { bottom: -9, right: -9 },
  scanningText: { color: 'white', fontSize: 16, fontWeight: '600', marginTop: 18, textAlign: 'center' },
  qrPopupOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrPopupContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 350,
    alignItems: 'center',
  },
  qrPopupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
  },
  qrPopupTitle: { fontSize: 18, fontWeight: '600', color: '#1e3a8a' },
  qrPopupCloseButton: {
    backgroundColor: '#ef4444',
    borderRadius: 20,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrPopupCloseText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  qrPopupBody: { alignItems: 'center', width: '100%' },
  qrPopupReceiptTitle: { fontSize: 16, fontWeight: '600', color: '#1e3a8a', marginBottom: 6, textAlign: 'center' },
  qrPopupReceiptDetails: { fontSize: 13, color: '#6b7280', marginBottom: 14, textAlign: 'center' },
  qrPopupCodeWrapper: { marginBottom: 14 },
  qrPopupNote: { fontSize: 13, color: '#6b7280', textAlign: 'center', fontStyle: 'italic' },
  receiptDisplay: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 0,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
    width: '100%',
  },
  verificationDetails: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  verificationTitle: { fontSize: 15, fontWeight: '600', color: '#374151', marginBottom: 10 },
  verificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 7,
  },
  verificationLabel: { fontSize: 13, fontWeight: '600', color: '#6b7280' },
  verificationValue: { fontSize: 13, color: '#374151', fontWeight: '500' },
});

export default ReceiptVerificationScreen;