import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../context/AuthContext';
import { mockApi } from '../services/mockApi';

const IssueReceiptScreen = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    customerName: '',
    amount: '',
    description: '',
    paymentMethod: 'cash',
    email: '',
    phone: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleIssueReceipt = async () => {
    if (!formData.customerName || !formData.amount || !formData.description) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    try {
      const receipt = await mockApi.issueReceipt({
        customerName: formData.customerName,
        amount: parseFloat(formData.amount),
        description: formData.description,
        paymentMethod: formData.paymentMethod,
        email: formData.email,
        phone: formData.phone,
        issuedBy: user?.username || 'Unknown',
      });

      Alert.alert(
        'Receipt Issued Successfully!',
        `Receipt ID: ${receipt.id}\nAmount: $${receipt.amount}\nCustomer: ${receipt.customerName}`,
        [
          {
            text: 'View Details',
            onPress: () => {
              Alert.alert(
                'Receipt Details',
                `Receipt ID: ${receipt.id}\nCustomer: ${receipt.customerName}\nAmount: $${receipt.amount}\nDescription: ${receipt.description}\nPayment Method: ${receipt.paymentMethod}\nDate: ${new Date(receipt.issuedAt).toLocaleDateString()}\nIssued By: ${receipt.issuedBy}\nStatus: ${receipt.status}`
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
      setFormData({
        customerName: '',
        amount: '',
        description: '',
        paymentMethod: 'cash',
        email: '',
        phone: '',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to issue receipt. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Issue Receipt</Text>
        
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Customer Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.customerName}
              onChangeText={(value) => handleInputChange('customerName', value)}
              placeholder="Enter customer name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Amount *</Text>
            <TextInput
              style={styles.input}
              value={formData.amount}
              onChangeText={(value) => handleInputChange('amount', value)}
              placeholder="Enter amount"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={styles.input}
              value={formData.description}
              onChangeText={(value) => handleInputChange('description', value)}
              placeholder="Enter description"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Payment Method</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.paymentMethod}
                onValueChange={(value) => handleInputChange('paymentMethod', value)}
                style={styles.picker}
              >
                <Picker.Item label="Cash" value="cash" />
                <Picker.Item label="Credit Card" value="credit_card" />
                <Picker.Item label="Debit Card" value="debit_card" />
                <Picker.Item label="Bank Transfer" value="bank_transfer" />
                <Picker.Item label="Digital Wallet" value="digital_wallet" />
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email (Optional)</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              placeholder="Enter customer email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone (Optional)</Text>
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
              placeholder="Enter customer phone"
              keyboardType="phone-pad"
            />
          </View>

          <TouchableOpacity style={styles.issueButton} onPress={handleIssueReceipt}>
            <Text style={styles.issueButtonText}>Issue Receipt</Text>
          </TouchableOpacity>
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  picker: {
    height: 50,
  },
  issueButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  issueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default IssueReceiptScreen;
