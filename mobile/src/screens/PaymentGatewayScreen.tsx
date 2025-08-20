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
import { useAuth } from '../context/AuthContext';

const PaymentGatewayScreen = () => {
  const { user } = useAuth();
  const [paymentData, setPaymentData] = useState({
    amount: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    description: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setPaymentData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePayment = async () => {
    if (!paymentData.amount || !paymentData.customerName || !paymentData.customerEmail) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (isNaN(Number(paymentData.amount)) || Number(paymentData.amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate receipt
      const receipt = {
        id: `receipt_${Date.now()}`,
        receiptNumber: `OR-${Date.now()}`,
        customerName: paymentData.customerName,
        amount: parseFloat(paymentData.amount),
        description: paymentData.description || 'Payment',
        paymentMethod: 'Paymongo',
        status: 'completed',
        issuedBy: user?.username || 'Unknown',
        issuedAt: new Date().toISOString(),
      };

      Alert.alert(
        'Payment Successful!',
        `Receipt ID: ${receipt.id}\nAmount: $${receipt.amount}\nCustomer: ${receipt.customerName}`,
        [
          {
            text: 'View Receipt',
            onPress: () => {
              Alert.alert(
                'Receipt Details',
                `Receipt ID: ${receipt.id}\nReceipt Number: ${receipt.receiptNumber}\nCustomer: ${receipt.customerName}\nAmount: $${receipt.amount}\nDescription: ${receipt.description}\nPayment Method: ${receipt.paymentMethod}\nStatus: ${receipt.status}\nDate: ${new Date(receipt.issuedAt).toLocaleDateString()}\nIssued By: ${receipt.issuedBy}`
              );
            },
          },
          {
            text: 'OK',
            style: 'default',
          },
        ]
      );

      // Reset form
      setPaymentData({
        amount: '',
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        description: '',
      });
    } catch (error) {
      Alert.alert('Error', 'Payment failed. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Payment Gateway</Text>
        
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Amount *</Text>
            <TextInput
              style={styles.input}
              value={paymentData.amount}
              onChangeText={(value) => handleInputChange('amount', value)}
              placeholder="Enter amount"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Customer Name *</Text>
            <TextInput
              style={styles.input}
              value={paymentData.customerName}
              onChangeText={(value) => handleInputChange('customerName', value)}
              placeholder="Enter customer name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Customer Email *</Text>
            <TextInput
              style={styles.input}
              value={paymentData.customerEmail}
              onChangeText={(value) => handleInputChange('customerEmail', value)}
              placeholder="Enter customer email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Customer Phone (Optional)</Text>
            <TextInput
              style={styles.input}
              value={paymentData.customerPhone}
              onChangeText={(value) => handleInputChange('customerPhone', value)}
              placeholder="Enter customer phone"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description (Optional)</Text>
            <TextInput
              style={styles.input}
              value={paymentData.description}
              onChangeText={(value) => handleInputChange('description', value)}
              placeholder="Enter payment description"
              multiline
              numberOfLines={3}
            />
          </View>

          <TouchableOpacity style={styles.paymentButton} onPress={handlePayment}>
            <Text style={styles.paymentButtonText}>Process Payment</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Payment Information</Text>
          <Text style={styles.infoText}>
            • Secure payment processing through Paymongo{'\n'}
            • Automatic receipt generation{'\n'}
            • Email notifications sent to customers{'\n'}
            • Payment history tracked in transaction archive
          </Text>
        </View>
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
  formContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 15,
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
  },
  paymentButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  paymentButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoContainer: {
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
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default PaymentGatewayScreen;
