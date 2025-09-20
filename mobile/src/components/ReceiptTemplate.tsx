import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, ScrollView } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const ReceiptTemplate = ({ receipt, organization, paymentMethod = 'Cash' }) => {
  // Convert amount to words (simplified version)
  const convertAmountToWords = (amount) => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    if (amount === 0) return 'Zero';
    if (amount < 10) return ones[amount];
    if (amount < 20) return teens[amount - 10];
    if (amount < 100) return tens[Math.floor(amount / 10)] + (amount % 10 ? '-' + ones[amount % 10] : '');
    if (amount < 1000) {
      const hundreds = Math.floor(amount / 100);
      const remainder = amount % 100;
      return ones[hundreds] + ' Hundred' + (remainder ? ' ' + convertAmountToWords(remainder) : '');
    }
    if (amount < 1000000) {
      const thousands = Math.floor(amount / 1000);
      const remainder = amount % 1000;
      return convertAmountToWords(thousands) + ' Thousand' + (remainder ? ' ' + convertAmountToWords(remainder) : '');
    }
    return 'Amount too large';
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'numeric', 
      day: 'numeric', 
      year: '2-digit' 
    });
  };

  // Get organization details
  const getOrganizationDetails = (orgName) => {
    const orgs = {
      'Computer Science Society': {
        name: 'Computer Science Society',
        subtitle: 'NU DASMA',
        code: 'CSS',
        fullName: 'Computer Science Society - NU Dasma'
      },
      'Student Council': {
        name: 'Student Council',
        subtitle: 'NU DASMA',
        code: 'SC',
        fullName: 'Student Council - NU Dasma'
      },
      'Engineering Society': {
        name: 'Engineering Society',
        subtitle: 'NU DASMA',
        code: 'ES',
        fullName: 'Engineering Society - NU Dasma'
      },
      'NU Dasma Admin': {
        name: 'NU Dasma Admin',
        subtitle: 'ADMINISTRATION',
        code: 'NU',
        fullName: 'NU Dasma Administration'
      }
    };
    return orgs[orgName] || {
      name: orgName || 'Organization',
      subtitle: 'NU DASMA',
      code: 'ORG',
      fullName: `${orgName || 'Organization'} - NU Dasma`
    };
  };

  const orgDetails = getOrganizationDetails(organization || receipt.organization);
  const amountInWords = convertAmountToWords(receipt.amount) + ' Pesos';

  return (
    <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.receiptContainer}>
        <View style={styles.receipt}>
          {/* Header with RECETRA Logo Only */}
          <View style={styles.header}>
            <View style={styles.logoSection}>
              <Image 
                source={require('../../assets/Logo_with_Color.png')}
                style={styles.logo}
                onError={() => {}}
                fadeDuration={0}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Receipt Title */}
          <View style={styles.titleSection}>
            <Text style={styles.receiptTitle}>ACKNOWLEDGMENT RECEIPT</Text>
          </View>

          {/* Receipt Header */}
          <View style={styles.receiptHeader}>
            <View style={styles.receiptNumber}>
              <Text style={styles.noLabel}>NO: </Text>
              <Text style={styles.receiptNumberValue}>{receipt.receiptNumber}</Text>
            </View>
            <View style={styles.receiptDate}>
              <Text style={styles.dateLabel}>Date: </Text>
              <Text style={styles.dateValue}>{formatDate(receipt.issuedAt)}</Text>
            </View>
          </View>

          {/* Main Acknowledgment Text */}
          <View style={styles.acknowledgmentText}>
            <Text style={styles.acknowledgmentParagraph}>
              This is to acknowledge that{' '}
              <Text style={styles.underlinedSpace}>{orgDetails.fullName}</Text>{' '}
              received from{' '}
              <Text style={styles.underlinedName}>{receipt.payer}</Text>{' '}
              the amount of{' '}
              <Text style={styles.underlinedSpace}>{amountInWords}</Text>{' '}
              <Text style={styles.underlinedSpace}>(P {receipt.amount.toLocaleString()})</Text>{' '}
              as payment for{' '}
              <Text style={styles.underlinedSpace}>{receipt.purpose}</Text>.
            </Text>
          </View>

          {/* Payment Details */}
          <View style={styles.paymentDetailsSection}>
            <Text style={styles.paymentDetailsLabel}>Payment Details: </Text>
            <View style={styles.paymentOptions}>
              <Text style={styles.checkbox}>
                {paymentMethod === 'Cash' ? '☑' : '☐'} Cash
              </Text>
              <Text style={[styles.checkbox, {marginLeft: 20}]}>
                {paymentMethod === 'Online' ? '☑' : '☐'} Online
              </Text>
            </View>
          </View>

          {/* Received By Section */}
          <View style={styles.receivedBySection}>
            <View style={styles.receivedByRow}>
              <Text style={styles.receivedByLabel}>Received By:</Text>
              <Text style={styles.receivedByValue}>{receipt.issuedBy || 'System'}</Text>
            </View>
          </View>

          {/* QR Code Section */}
          {receipt.qrCode && (
            <View style={styles.qrCodeSection}>
              <View style={styles.qrCodeContainer}>
                <QRCode 
                  value={receipt.qrCode} 
                  size={60}
                />
              </View>
              <Text style={styles.qrCodeNote}>
                Scan this QR code to verify receipt authenticity
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  receiptContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 0,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
  },
  receipt: {
    backgroundColor: 'white',
    paddingHorizontal: 8,
    paddingVertical: 16,
    borderRadius: 12,
    margin: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 0,
    borderBottomWidth: 0,
  },
  logoSection: {
    marginBottom: 0,
  },
  logo: {
    height: 50,
    width: 110,
    marginBottom: 0,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  titleSection: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  receiptTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 1,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  receiptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    alignItems: 'center',
    width: '100%',
  },
  receiptNumber: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  receiptDate: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  noLabel: {
    fontSize: 16,
    color: '#d32f2f',
    fontWeight: 'bold',
    marginRight: 4,
  },
  receiptNumberValue: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    flexShrink: 1,
  },
  dateLabel: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
    marginRight: 4,
  },
  dateValue: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    flexShrink: 1,
  },
  acknowledgmentText: {
    marginBottom: 8,
    marginTop: 8,
    width: '100%',
  },
  acknowledgmentParagraph: {
    fontSize: 15,
    color: '#000',
    lineHeight: 22,
    textAlign: 'left',
  },
  underlinedSpace: {
    fontSize: 15,
    color: '#000',
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 1,
    textAlign: 'center',
  },
  underlinedName: {
    fontSize: 15,
    color: '#000',
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 1,
    textAlign: 'center',
  },
  paymentDetailsSection: {
    marginBottom: 8,
    width: '100%',
  },
  paymentDetailsLabel: {
    fontSize: 15,
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 0,
    marginTop: 0,
    margin: 0,
    lineHeight: 1,
  },
  paymentOptions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 8,
  },
  checkbox: {
    fontSize: 15,
    color: '#000',
    fontWeight: 'bold',
    marginLeft: 10,
    marginRight: 10,
  },
  receivedBySection: {
    marginTop: 8,
    marginBottom: 8,
    width: '100%',
  },
  receivedByRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 8,
  },
  receivedByLabel: {
    fontSize: 15,
    color: '#000',
    fontWeight: 'bold',
  },
  receivedByValue: {
    fontSize: 15,
    color: '#000',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    textAlign: 'right',
    flexShrink: 1,
  },
  qrCodeSection: {
    alignItems: 'center',
    marginTop: 8,
    padding: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    width: '100%',
  },
  qrCodeContainer: {
    alignItems: 'center',
    marginBottom: 4,
  },
  qrCodeNote: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingHorizontal: 2,
  },
});

export default ReceiptTemplate;