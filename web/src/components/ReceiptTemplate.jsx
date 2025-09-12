import React from 'react';

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
        name: 'RECETRA',
        subtitle: 'RECEIPT MANAGEMENT SYSTEM',
        code: 'RECETRA',
        fullName: 'RECETRA Receipt Management System'
      },
      'Student Council': {
        name: 'RECETRA',
        subtitle: 'RECEIPT MANAGEMENT SYSTEM',
        code: 'RECETRA',
        fullName: 'RECETRA Receipt Management System'
      },
      'Engineering Society': {
        name: 'RECETRA',
        subtitle: 'RECEIPT MANAGEMENT SYSTEM',
        code: 'RECETRA',
        fullName: 'RECETRA Receipt Management System'
      },
      'NU Dasma Admin': {
        name: 'RECETRA',
        subtitle: 'RECEIPT MANAGEMENT SYSTEM',
        code: 'RECETRA',
        fullName: 'RECETRA Receipt Management System'
      }
    };
    return orgs[orgName] || {
      name: 'RECETRA',
      subtitle: 'RECEIPT MANAGEMENT SYSTEM',
      code: 'RECETRA',
      fullName: 'RECETRA Receipt Management System'
    };
  };

  const orgDetails = getOrganizationDetails(organization || receipt.organization);
  const amountInWords = convertAmountToWords(receipt.amount) + ' Pesos';

  return (
    <div style={styles.receiptContainer}>
      <div className="receipt" style={styles.receipt}>
        {/* Header with RECETRA Logo Only */}
        <div style={styles.header}>
          <div style={styles.logoSection}>
            <img 
              src="/assets/Logo_with_Color.png" 
              alt="RECETRA Logo" 
              style={styles.logo}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <div style={{...styles.logoPlaceholder, display: 'none'}}>
              <div style={styles.logoText}>RECETRA</div>
            </div>
          </div>
        </div>

        {/* Receipt Title */}
        <div style={styles.titleSection}>
          <h2 style={styles.receiptTitle}>ACKNOWLEDGMENT RECEIPT</h2>
        </div>

        {/* Receipt Header */}
        <div style={styles.receiptHeader}>
          <div style={styles.receiptNumber}>
            <span style={styles.noLabel}>NO:</span>
            <span style={styles.receiptNumberValue}>{receipt.receiptNumber}</span>
          </div>
          <div style={styles.receiptDate}>
            <span style={styles.dateLabel}>Date:</span>
            <span style={styles.dateValue}>{formatDate(receipt.issuedAt)}</span>
          </div>
        </div>

        {/* Main Acknowledgment Text */}
        <div style={styles.acknowledgmentText}>
          <p style={styles.acknowledgmentParagraph}>
            This is to acknowledge that{' '}
            <span style={styles.underlinedSpace}>{orgDetails.fullName}</span>{' '}
            received from{' '}
            <span style={styles.underlinedName}>{receipt.payer}</span>{' '}
            the amount of{' '}
            <span style={styles.underlinedSpace}>{amountInWords}</span>{' '}
            <span style={styles.underlinedSpace}>(P {receipt.amount.toLocaleString()})</span>{' '}
            as payment for{' '}
            <span style={styles.underlinedSpace}>{receipt.purpose}</span>.
          </p>
        </div>

        {/* Payment Details */}
        <div style={styles.paymentDetailsSection}>
          <span style={styles.paymentDetailsLabel}>Payment Details: </span>
          <span style={styles.checkbox}>☑</span> Cash
          <span style={styles.checkbox}>☐</span> Online
        </div>

        {/* Received By Section */}
        <div style={styles.receivedBySection}>
          <div style={styles.receivedByRow}>
            <span style={styles.receivedByLabel}>Received By:</span>
            <span style={styles.receivedByValue}>{receipt.issuedBy || 'System'}</span>
          </div>
          <div style={styles.signatureLine}>
            <span style={styles.signatureLabel}>Signature:</span>
            <div style={styles.signatureSpace}></div>
          </div>
        </div>

      </div>
    </div>
  );
};

const styles = {
  receiptContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: '0px',
    backgroundColor: '#ffffff',
    minHeight: 'auto'
  },
  receipt: {
    width: '100%',
    maxWidth: '600px',
    backgroundColor: 'white',
    padding: '20px 50px',
    borderRadius: '0px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Arial, sans-serif',
    lineHeight: '1.3',
    margin: '0'
  },
  header: {
    textAlign: 'center',
    marginBottom: '0px',
    marginTop: '-65px',
    borderBottom: 'none',
    paddingBottom: '0px',
    padding: '0px',
    height: 'auto'
  },
  logoSection: {
    marginBottom: '0px',
    padding: '0px',
    height: 'auto'
  },
  logo: {
    height: '280px',
    width: '280px',
    marginBottom: '0px',
    marginTop: '0px'
  },
  logoPlaceholder: {
    height: '280px',
    width: '280px',
    backgroundColor: '#4CAF50',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    marginTop: '0px'
  },
  logoText: {
    color: 'white',
    fontSize: '28px',
    fontWeight: 'bold',
    letterSpacing: '3px'
  },
  tagline: {
    fontSize: '14px',
    color: '#666',
    textAlign: 'center',
    marginTop: '5px',
    fontStyle: 'italic'
  },
  titleSection: {
    textAlign: 'center',
    marginTop: '-120px',
    marginBottom: '30px'
  },
  receiptTitle: {
    fontSize: '22px',
    fontWeight: 'bold',
    margin: '0',
    color: '#000',
    letterSpacing: '1px',
    textDecoration: 'underline'
  },
  receiptHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '40px',
    alignItems: 'flex-start'
  },
  receiptNumber: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  receiptDate: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  noLabel: {
    fontSize: '16px',
    color: '#d32f2f',
    fontWeight: 'bold'
  },
  receiptNumberValue: {
    fontSize: '16px',
    color: '#000',
    fontWeight: 'bold',
    textDecoration: 'underline'
  },
  dateLabel: {
    fontSize: '16px',
    color: '#000',
    fontWeight: 'bold'
  },
  dateValue: {
    fontSize: '16px',
    color: '#000',
    fontWeight: 'bold',
    textDecoration: 'underline'
  },
  acknowledgmentText: {
    marginBottom: '40px',
    lineHeight: '1.2'
  },
  acknowledgmentParagraph: {
    fontSize: '16px',
    color: '#000',
    margin: '0',
    textAlign: 'left',
    lineHeight: '1.2'
  },
  underlinedSpace: {
    fontSize: '16px',
    color: '#000',
    fontWeight: 'bold',
    borderBottom: '1px solid #000',
    paddingBottom: '2px',
    display: 'inline-block',
    minWidth: '80px',
    textAlign: 'center'
  },
  underlinedName: {
    fontSize: '16px',
    color: '#000',
    fontWeight: 'bold',
    borderBottom: '1px solid #000',
    paddingBottom: '2px',
    display: 'inline-block',
    minWidth: '120px',
    textAlign: 'center'
  },
  paymentDetailsSection: {
    marginBottom: '40px'
  },
  paymentDetailsLabel: {
    fontSize: '15px',
    color: '#000',
    fontWeight: 'bold',
    marginBottom: '0px',
    marginTop: '0px',
    margin: '0px',
    lineHeight: '1',
    display: 'inline'
  },
  checkbox: {
    fontSize: '16px',
    color: '#000',
    fontWeight: 'bold',
    marginLeft: '20px'
  },
  receivedBySection: {
    marginTop: '40px',
    marginBottom: '20px'
  },
  receivedByRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  receivedByLabel: {
    fontSize: '16px',
    color: '#000',
    fontWeight: 'bold'
  },
  receivedByValue: {
    fontSize: '16px',
    color: '#000',
    fontWeight: 'bold',
    textDecoration: 'underline'
  },
  signatureLine: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  signatureLabel: {
    fontSize: '16px',
    color: '#000',
    fontWeight: 'bold'
  },
  signatureSpace: {
    flex: 1,
    height: '1px',
    borderBottom: '1px solid #000',
    marginTop: '10px'
  },
};

export default ReceiptTemplate;