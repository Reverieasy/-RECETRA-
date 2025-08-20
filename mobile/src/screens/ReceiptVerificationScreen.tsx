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

const ReceiptVerificationScreen = () => {
  const [receiptId, setReceiptId] = useState('');
  const [verificationResult, setVerificationResult] = useState<any>(null);

  const handleManualVerification = () => {
    if (!receiptId.trim()) {
      Alert.alert('Error', 'Please enter a receipt ID');
      return;
    }

    // Simulate verification
    const mockResult = {
      id: receiptId,
      isValid: Math.random() > 0.3,
      amount: Math.floor(Math.random() * 1000) + 100,
      customerName: 'John Doe',
      date: new Date().toLocaleDateString(),
      status: 'verified',
    };

    setVerificationResult(mockResult);

    if (mockResult.isValid) {
      Alert.alert(
        'Receipt Verified',
        `Receipt ID: ${mockResult.id}\nAmount: $${mockResult.amount}\nCustomer: ${mockResult.customerName}\nDate: ${mockResult.date}\nStatus: ${mockResult.status}`
      );
    } else {
      Alert.alert('Receipt Not Found', 'The receipt ID you entered could not be verified.');
    }
  };

  const handleQRScan = () => {
    Alert.alert(
      'QR Code Scanner',
      'Camera functionality would be implemented here to scan QR codes on receipts.',
      [
        {
          text: 'OK',
          onPress: () => {
            // Simulate QR scan result
            const mockQRResult = {
              id: 'QR_' + Date.now(),
              isValid: true,
              amount: Math.floor(Math.random() * 1000) + 100,
              customerName: 'Jane Smith',
              date: new Date().toLocaleDateString(),
              status: 'verified',
            };

            setVerificationResult(mockQRResult);
            Alert.alert(
              'QR Code Scanned',
              `Receipt ID: ${mockQRResult.id}\nAmount: $${mockQRResult.amount}\nCustomer: ${mockQRResult.customerName}\nDate: ${mockQRResult.date}\nStatus: ${mockQRResult.status}`
            );
          },
        },
      ]
    );
  };

  const handleCameraPermission = () => {
    Alert.alert(
      'Camera Permission',
      'This app needs camera access to scan QR codes. Please grant camera permission in your device settings.',
      [
        {
          text: 'Settings',
          onPress: () => {
            // In a real app, this would open device settings
            Alert.alert('Settings', 'Device settings would open here');
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Receipt Verification</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Manual Verification</Text>
          <View style={styles.formContainer}>
            <Text style={styles.label}>Receipt ID</Text>
            <TextInput
              style={styles.input}
              value={receiptId}
              onChangeText={setReceiptId}
              placeholder="Enter receipt ID"
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.verifyButton} onPress={handleManualVerification}>
              <Text style={styles.verifyButtonText}>Verify Receipt</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>QR Code Scanner</Text>
          <View style={styles.formContainer}>
            <TouchableOpacity style={styles.scanButton} onPress={handleQRScan}>
              <Text style={styles.scanButtonText}>Scan QR Code</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.permissionButton} onPress={handleCameraPermission}>
              <Text style={styles.permissionButtonText}>Camera Permission</Text>
            </TouchableOpacity>
          </View>
        </View>

        {verificationResult && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Verification Result</Text>
            <View style={styles.resultContainer}>
              <Text style={styles.resultText}>
                Receipt ID: {verificationResult.id}
              </Text>
              <Text style={styles.resultText}>
                Valid: {verificationResult.isValid ? 'Yes' : 'No'}
              </Text>
              <Text style={styles.resultText}>
                Amount: ${verificationResult.amount}
              </Text>
              <Text style={styles.resultText}>
                Customer: {verificationResult.customerName}
              </Text>
              <Text style={styles.resultText}>
                Date: {verificationResult.date}
              </Text>
              <Text style={styles.resultText}>
                Status: {verificationResult.status}
              </Text>
            </View>
          </View>
        )}
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
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  formContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
    marginBottom: 15,
  },
  verifyButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scanButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  permissionButton: {
    backgroundColor: '#FF9500',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  resultText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
});

export default ReceiptVerificationScreen;