import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

/**
 * RECETRA Receipt Template Component
 * Displays receipts in a professional format similar to official acknowledgment receipts
 * 
 * @param {Object} receipt - The receipt data object
 * @param {string} organization - The organization name
 */
const ReceiptTemplate = ({ receipt, organization }) => {
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
    <View style={styles.receiptContainer}>
      <View style={styles.receipt}>
        {/* Header with RECETRA Logo Only */}
        <View style={styles.header}>
          <View style={styles.logoSection}>
            <Image 
              source={require('../../assets/Logo_with_Color.png')}
              style={styles.logo}
              onError={() => {}}
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
          <Text style={styles.checkbox}>☑</Text> Cash
          <Text style={styles.checkbox}>☐</Text> Online
        </View>


      </View>

      {/* Separate Details Card */}
      <View style={styles.detailsCard}>
        <Text style={styles.detailsHeading}>Details</Text>
        <View style={styles.detailsSection}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Organization</Text>
            <Text style={styles.detailValue}>{orgDetails.fullName}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Received From</Text>
            <Text style={styles.detailValue}>{receipt.payer}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Amount (in words)</Text>
            <Text style={styles.detailValue}>{amountInWords}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Amount (in figures)</Text>
            <Text style={styles.detailValue}>P {receipt.amount.toLocaleString()}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Purpose</Text>
            <Text style={styles.detailValue}>{receipt.purpose}</Text>
          </View>
        </View>

        {/* QR Code Section */}
        {receipt.qrCode && (
          <View style={styles.qrCodeSection}>
            <View style={styles.qrCodeContainer}>
              <QRCode 
                value={receipt.qrCode} 
                size={120}
              />
            </View>
            <Text style={styles.qrCodeNote}>
              Scan this QR code to verify receipt authenticity
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  receiptContainer: {
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  receipt: {
    backgroundColor: 'white',
    paddingVertical: 50,
    paddingHorizontal: 50,
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
    height: 220,
    width: 220,
    marginBottom: 0,
  },
  logoPlaceholder: {
    height: 220,
    width: 220,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
  },
  logoText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 3,
  },
  titleSection: {
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 30,
  },
  receiptTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 1,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  receiptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    alignItems: 'flex-start',
  },
  receiptNumber: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  receiptDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  noLabel: {
    fontSize: 16,
    color: '#d32f2f',
    fontWeight: 'bold',
  },
  receiptNumberValue: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  dateLabel: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  dateValue: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  acknowledgmentText: {
    marginBottom: 40,
  },
  acknowledgmentParagraph: {
    fontSize: 16,
    color: '#000',
    lineHeight: 20,
    textAlign: 'left',
  },
  detailsCard: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
    padding: 16,
    marginTop: 12,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailsHeading: {
    marginBottom: 12,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111',
  },
  detailsSection: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    width: 160,
    fontSize: 15,
    color: '#111',
    fontWeight: 'bold',
  },
  detailValue: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  highlightedText: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  underlinedSpace: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 2,
    minWidth: 80,
    textAlign: 'center',
  },
  underlinedName: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 2,
    minWidth: 120,
    textAlign: 'center',
  },
  amountFigures: {
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  paymentDetailsSection: {
    marginBottom: 40,
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
    gap: 20,
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 0,
    margin: 0,
  },
  paymentOption: {
    fontSize: 15,
    color: '#000',
    marginLeft: 20,
  },
  checkbox: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
    marginLeft: 20,
  },

  // QR Code Section Styles
  qrCodeSection: {
    alignItems: 'center',
    marginTop: 30,
    padding: 20,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  qrCodeContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  qrCodeNote: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default ReceiptTemplate;