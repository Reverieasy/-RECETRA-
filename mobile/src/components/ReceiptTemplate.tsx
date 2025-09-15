import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, ScrollView } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

// Get screen dimensions for responsive design
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

/**
 * RECETRA Receipt Template Component
 * Displays receipts in a professional format similar to official acknowledgment receipts
 * 
 * @param {Object} receipt - The receipt data object
 * @param {string} organization - The organization name
 * @param {string} paymentMethod - The payment method ('Cash' or 'Online')
 */
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
              <Text style={styles.noLabel}>NO:</Text>
              <Text style={styles.receiptNumberValue}>{receipt.receiptNumber}</Text>
            </View>
            <View style={styles.receiptDate}>
              <Text style={styles.dateLabel}>Date:</Text>
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
              <Text style={styles.checkbox}>{paymentMethod === 'Cash' ? '☑' : '☐'}</Text>
              <Text style={styles.paymentOption}> Cash</Text>
              <Text style={styles.checkbox}>{paymentMethod === 'Online' ? '☑' : '☐'}</Text>
              <Text style={styles.paymentOption}> Online</Text>
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
                  size={Math.min(screenWidth * 0.1, 50)}
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
    justifyContent: 'center',
    padding: screenWidth * 0.01, // Minimal padding to maximize space
    backgroundColor: '#f5f5f5',
  },
  receipt: {
    backgroundColor: 'white',
    paddingVertical: screenHeight * 0.01, // 1% of screen height
    paddingHorizontal: screenWidth * 0.02, // 2% of screen width
    borderRadius: 0,
    margin: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: screenHeight * 0.45, // Slightly smaller height
    width: screenWidth * 0.98, // 98% of screen width for more space
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 0,
    marginTop: 0,
    borderBottomWidth: 0,
  },
  logoSection: {
    marginBottom: 0,
  },
  logo: {
    height: Math.min(screenWidth * 0.15, 80), // Much smaller logo for landscape rectangle
    width: Math.min(screenWidth * 0.15, 80),
    marginBottom: 0,
    resizeMode: 'contain',
  },
  logoPlaceholder: {
    height: Math.min(screenWidth * 0.4, 200),
    width: Math.min(screenWidth * 0.4, 200),
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
  },
  logoText: {
    color: 'white',
    fontSize: Math.min(screenWidth * 0.08, 28),
    fontWeight: 'bold',
    letterSpacing: 3,
  },
  titleSection: {
    alignItems: 'center',
    marginTop: screenHeight * 0.005, // Minimal margin
    marginBottom: screenHeight * 0.01, // Minimal margin
  },
  receiptTitle: {
    fontSize: Math.min(screenWidth * 0.04, 16), // Smaller font for landscape
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 1,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  receiptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: screenHeight * 0.005, // Minimal margin for landscape
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  receiptNumber: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4, // Reduced gap
    flex: 1,
    minWidth: screenWidth * 0.35, // Reduced minimum width
  },
  receiptDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4, // Reduced gap
    flex: 1,
    minWidth: screenWidth * 0.35, // Reduced minimum width
  },
  noLabel: {
    fontSize: Math.min(screenWidth * 0.035, 14), // Slightly smaller
    color: '#d32f2f',
    fontWeight: 'bold',
  },
  receiptNumberValue: {
    fontSize: Math.min(screenWidth * 0.035, 14), // Slightly smaller
    color: '#000',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    flex: 1,
  },
  dateLabel: {
    fontSize: Math.min(screenWidth * 0.035, 14), // Slightly smaller
    color: '#000',
    fontWeight: 'bold',
  },
  dateValue: {
    fontSize: Math.min(screenWidth * 0.035, 14), // Slightly smaller
    color: '#000',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    flex: 1,
  },
  acknowledgmentText: {
    marginBottom: screenHeight * 0.01, // Minimal margin for landscape
  },
  acknowledgmentParagraph: {
    fontSize: Math.min(screenWidth * 0.03, 12), // Much smaller font for landscape
    color: '#000',
    lineHeight: Math.min(screenWidth * 0.035, 14), // Tighter line height
    textAlign: 'left',
  },
  underlinedSpace: {
    fontSize: Math.min(screenWidth * 0.03, 12), // Much smaller font for landscape
    color: '#000',
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 1,
    minWidth: Math.min(screenWidth * 0.1, 40), // Much smaller min width
    textAlign: 'center',
  },
  underlinedName: {
    fontSize: Math.min(screenWidth * 0.03, 12), // Much smaller font for landscape
    color: '#000',
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 1,
    minWidth: Math.min(screenWidth * 0.15, 60), // Much smaller min width
    textAlign: 'center',
  },
  paymentDetailsSection: {
    marginBottom: screenHeight * 0.01, // Minimal margin for landscape
  },
  paymentDetailsLabel: {
    fontSize: Math.min(screenWidth * 0.03, 11), // Much smaller font
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 0,
    marginTop: 0,
    margin: 0,
    lineHeight: 1,
  },
  checkbox: {
    fontSize: Math.min(screenWidth * 0.03, 11), // Much smaller font
    color: '#000',
    fontWeight: 'bold',
    marginLeft: 10, // Reduced margin
  },
  paymentOptions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  paymentOption: {
    fontSize: Math.min(screenWidth * 0.03, 11), // Much smaller font
    color: '#000',
    marginLeft: 5,
  },
  receivedBySection: {
    marginTop: screenHeight * 0.01, // Minimal margin for landscape
    marginBottom: screenHeight * 0.005, // Minimal margin
  },
  receivedByRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: screenHeight * 0.005, // Minimal margin
  },
  receivedByLabel: {
    fontSize: Math.min(screenWidth * 0.03, 11), // Much smaller font
    color: '#000',
    fontWeight: 'bold',
  },
  receivedByValue: {
    fontSize: Math.min(screenWidth * 0.03, 11), // Much smaller font
    color: '#000',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    flex: 1,
    textAlign: 'right',
  },

  // QR Code Section Styles
  qrCodeSection: {
    alignItems: 'center',
    marginTop: screenHeight * 0.005, // Minimal margin for landscape
    padding: screenWidth * 0.02, // Minimal padding
    borderWidth: 1, // Thinner border
    borderStyle: 'dashed',
    borderColor: '#ccc',
    borderRadius: 4, // Smaller border radius
    backgroundColor: '#f9f9f9',
  },
  qrCodeContainer: {
    alignItems: 'center',
    marginBottom: 4, // Minimal margin
  },
  qrCodeNote: {
    fontSize: Math.min(screenWidth * 0.02, 8), // Much smaller font
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingHorizontal: 2, // Minimal padding
  },
});

export default ReceiptTemplate;