import React, { useState, useRef, useEffect } from 'react';
import Layout from '../components/Layout';
import { mockReceipts } from '../data/mockData';
import QRCode from 'qrcode.react';
import { Html5QrcodeScanner } from 'html5-qrcode';

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
const ReceiptVerificationScreen = () => {
  const [receiptNumber, setReceiptNumber] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showQRPopup, setShowQRPopup] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const scannerRef = useRef(null);

  /**
   * Handles manual receipt verification
   * Validates input and searches for receipt in mock data
   */
  const handleManualVerification = () => {
    if (!receiptNumber.trim()) {
      alert('Error: Please enter a receipt number');
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
   * Handles QR code scanning functionality
   * Opens camera to scan QR codes using Html5QrcodeScanner
   */
  const handleQRScan = () => {
    setShowQRScanner(true);
  };

  /**
   * Handles when a QR code is detected
   */
  const handleQRDetected = (qrValue) => {
    // Find receipt by QR value
    const receipt = mockReceipts.find(r => r.receiptNumber === qrValue);
    if (receipt) {
      setVerificationResult(receipt);
      setShowQRScanner(false);
      alert(`QR Code Scanned!\n\nReceipt: ${receipt.receiptNumber}\nPayer: ${receipt.payer}\nAmount: ₱${receipt.amount.toLocaleString()}`);
    } else {
      alert('QR Code scanned but receipt not found. Please try again.');
    }
  };

  /**
   * Closes the QR scanner modal
   */
  const closeQRScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.clear();
      scannerRef.current = null;
    }
    setShowQRScanner(false);
  };

  /**
   * Shows QR code popup for a receipt
   */
  const showReceiptQR = (receipt) => {
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
   * Initialize Html5QrcodeScanner when modal opens
   */
  useEffect(() => {
    if (showQRScanner && !scannerRef.current) {
      const scanner = new Html5QrcodeScanner('reader', {
        qrbox: { width: 250, height: 250 },
        fps: 10,
      });
      
      scanner.render((decodedText) => {
        handleQRDetected(decodedText);
      }, (error) => {
        console.warn(error);
      });
      
      scannerRef.current = scanner;
    }
    
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
        scannerRef.current = null;
      }
    };
  }, [showQRScanner]);

  /**
   * Handles escape key to close modal
   */
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showQRScanner) {
        closeQRScanner();
      }
    };

    if (showQRScanner) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [showQRScanner]);

  /**
   * Resets the verification form and results
   */
  const handleReset = () => {
    setReceiptNumber('');
    setVerificationResult(null);
  };

  /**
   * Component to display successful verification results
   * Shows complete receipt details with status indicators
   */
  const VerificationResult = ({ receipt }) => (
    <div style={styles.resultContainer}>
      <div style={styles.resultHeader}>
        <h3 style={styles.resultTitle}>Receipt Verified</h3>
        <div style={{...styles.statusBadge, backgroundColor: '#10b981'}}>
          <span style={styles.statusText}>Valid</span>
        </div>
      </div>
      
      <div style={styles.resultContent}>
        <div style={styles.resultRow}>
          <span style={styles.resultLabel}>Receipt Number:</span>
          <span style={styles.resultValue}>{receipt.receiptNumber}</span>
        </div>
        
        <div style={styles.resultRow}>
          <span style={styles.resultLabel}>Payer:</span>
          <span style={styles.resultValue}>{receipt.payer}</span>
        </div>
        
        <div style={styles.resultRow}>
          <span style={styles.resultLabel}>Amount:</span>
          <span style={styles.resultValue}>₱{receipt.amount.toLocaleString()}</span>
        </div>
        
        <div style={styles.resultRow}>
          <span style={styles.resultLabel}>Purpose:</span>
          <span style={styles.resultValue}>{receipt.purpose}</span>
        </div>
        
        <div style={styles.resultRow}>
          <span style={styles.resultLabel}>Category:</span>
          <span style={styles.resultValue}>{receipt.category}</span>
        </div>
        
        <div style={styles.resultRow}>
          <span style={styles.resultLabel}>Organization:</span>
          <span style={styles.resultValue}>{receipt.organization}</span>
        </div>
        
        <div style={styles.resultRow}>
          <span style={styles.resultLabel}>Issued By:</span>
          <span style={styles.resultValue}>{receipt.issuedBy}</span>
        </div>
        
        <div style={styles.resultRow}>
          <span style={styles.resultLabel}>Date Issued:</span>
          <span style={styles.resultValue}>
            {new Date(receipt.issuedAt).toLocaleDateString()}
          </span>
        </div>
        
        <div style={styles.resultRow}>
          <span style={styles.resultLabel}>Payment Status:</span>
          <div style={{
            ...styles.statusBadge, 
            backgroundColor: receipt.paymentStatus === 'completed' ? '#10b981' : 
              receipt.paymentStatus === 'pending' ? '#f59e0b' : '#ef4444'
          }}>
            <span style={styles.statusText}>{receipt.paymentStatus}</span>
          </div>
        </div>
        
        <div style={styles.resultRow}>
          <span style={styles.resultLabel}>Email Status:</span>
          <div style={{
            ...styles.statusBadge, 
            backgroundColor: receipt.emailStatus === 'sent' ? '#10b981' : 
              receipt.emailStatus === 'pending' ? '#f59e0b' : '#ef4444'
          }}>
            <span style={styles.statusText}>{receipt.emailStatus}</span>
          </div>
        </div>
        
        <div style={styles.resultRow}>
          <span style={styles.resultLabel}>SMS Status:</span>
          <div style={{
            ...styles.statusBadge, 
            backgroundColor: receipt.smsStatus === 'sent' ? '#10b981' : 
              receipt.smsStatus === 'pending' ? '#f59e0b' : '#ef4444'
          }}>
            <span style={styles.statusText}>{receipt.smsStatus}</span>
          </div>
        </div>
      </div>
      
      {/* QR Code Section */}
      <div style={styles.qrCodeSection}>
        <h4 style={styles.qrCodeTitle}>Receipt QR Code</h4>
        <p style={styles.qrCodeDescription}>
          This QR code contains the receipt information and can be scanned for verification
        </p>
        <div style={styles.qrCodeContainer}>
          <QRCode 
            value={receipt.receiptNumber}
            size={120}
            level="M"
            includeMargin={true}
            style={styles.qrCode}
          />
          <p style={styles.qrCodeNote}>
            Scan this QR code to verify receipt authenticity
          </p>
        </div>
      </div>
    </div>
  );

  /**
   * Component to display verification failure
   */
  const VerificationFailure = () => (
    <div style={styles.resultContainer}>
      <div style={styles.resultHeader}>
        <h3 style={styles.resultTitle}>Receipt Not Found</h3>
        <div style={{...styles.statusBadge, backgroundColor: '#ef4444'}}>
          <span style={styles.statusText}>Invalid</span>
        </div>
      </div>
      
      <div style={styles.resultContent}>
        <p style={styles.failureText}>
          The receipt number "{receiptNumber}" could not be found in our system.
        </p>
        <p style={styles.failureSubtext}>
          Please check the receipt number and try again, or contact the issuing organization for assistance.
        </p>
      </div>
    </div>
  );

  return (
    <Layout title="Receipt Verification" showBackButton={true}>
      <div className="innerContainer">
        <div style={styles.container}>
          <div style={styles.content}>
          {/* Header */}
          <div style={styles.header}>
            <h2 style={styles.title}>Verify Receipt</h2>
            <p style={styles.subtitle}>Verify receipt authenticity using QR code or receipt number</p>
          </div>

          {/* Verification Methods */}
          <div style={styles.methodsContainer}>
            <div style={styles.method}>
              <h3 style={styles.methodTitle}>Manual Entry</h3>
              <p style={styles.methodDescription}>Enter the receipt number manually</p>
              
              <div style={styles.inputContainer}>
                <input
                  type="text"
                  style={styles.input}
                  value={receiptNumber}
                  onChange={(e) => setReceiptNumber(e.target.value)}
                  placeholder="Enter receipt number (e.g., OR-2024-001)"
                  onKeyPress={(e) => e.key === 'Enter' && handleManualVerification()}
                />
                <button
                  style={isVerifying ? {...styles.verifyButton, ...styles.verifyButtonDisabled} : styles.verifyButton}
                  onClick={handleManualVerification}
                  disabled={isVerifying}
                >
                  {isVerifying ? 'Verifying...' : 'Verify'}
                </button>
              </div>
            </div>

            <div style={styles.method}>
              <h3 style={styles.methodTitle}>QR Code Scanner</h3>
              <p style={styles.methodDescription}>Scan QR code from receipt</p>
              
              <button style={styles.qrButton} onClick={handleQRScan}>
                <span style={styles.qrButtonText}>Scan QR Code</span>
              </button>
              

            </div>
          </div>

          {/* Verification Results */}
          {verificationResult !== null && (
            <div style={styles.resultsSection}>
              {verificationResult ? (
                <VerificationResult receipt={verificationResult} />
              ) : (
                <VerificationFailure />
              )}
              
              <button style={styles.resetButton} onClick={handleReset}>
                Verify Another Receipt
              </button>
            </div>
          )}

          {/* QR Scanner Modal */}
          {showQRScanner && (
            <div style={styles.modalOverlay}>
              <div style={styles.modalContent}>
                <div style={styles.modalHeader}>
                  <h3 style={styles.modalTitle}>QR Code Scanner</h3>
                  <button style={styles.closeButton} onClick={closeQRScanner}>
                    X
                  </button>
                </div>
                
                <div style={styles.modalBody}>
                  <p style={styles.modalDescription}>
                    Point your camera at a QR code to scan it automatically.
                  </p>
                  
                  {/* Html5QrcodeScanner */}
                  <div id="reader" style={styles.scannerContainer}></div>
                  
                  <div style={styles.cameraInstructions}>
                    <p style={styles.instructionText}>
                      - Hold your device steady
                    </p>
                    <p style={styles.instructionText}>
                      - Point camera at QR code
                    </p>
                    <p style={styles.instructionText}>
                      - QR code will be detected automatically
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}



          {/* QR Code Popup Modal */}
          {showQRPopup && selectedReceipt && (
            <div style={styles.modalOverlay}>
              <div style={styles.modalContent}>
                <div style={styles.modalHeader}>
                  <h3 style={styles.modalTitle}>Receipt QR Code</h3>
                  <button style={styles.closeButton} onClick={closeQRPopup}>
                    X
                  </button>
                </div>
                
                <div style={styles.modalBody}>
                  <div style={styles.qrPopupContent}>
                    <h4 style={styles.qrPopupReceiptTitle}>{selectedReceipt.receiptNumber}</h4>
                    <p style={styles.qrPopupReceiptDetails}>
                      {selectedReceipt.payer} - ₱{selectedReceipt.amount.toLocaleString()}
                    </p>
                    
                    <div style={styles.qrPopupCodeWrapper}>
                      <QRCode 
                        value={selectedReceipt.receiptNumber}
                        size={200}
                        level="M"
                        includeMargin={true}
                      />
                    </div>
                    
                    <p style={styles.qrPopupNote}>
                      Scan this QR code to verify receipt authenticity
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}



          {/* Instructions */}
          <div style={styles.instructionsContainer}>
            <h3 style={styles.instructionsTitle}>How to Verify</h3>
            <ul style={styles.instructionsList}>
              <li style={styles.instructionItem}>
                <strong>QR Code:</strong> Use your device camera to scan the QR code on the receipt
              </li>
              <li style={styles.instructionItem}>
                <strong>Manual Entry:</strong> Type the receipt number exactly as shown on the receipt
              </li>
              <li style={styles.instructionItem}>
                <strong>Verification:</strong> Valid receipts will show complete details and status
              </li>
              <li style={styles.instructionItem}>
                <strong>Issues:</strong> Contact the issuing organization if verification fails
              </li>
            </ul>
          </div>
        </div>
        </div>
      </div>
    </Layout>
  );
};

/**
 * Styles for the ReceiptVerificationScreen component
 */
const styles = {
  container: {
    backgroundColor: '#f5f5f5',
    minHeight: '100%',
  },
  
  content: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: '8px',
    margin: '0 0 8px 0',
  },
  
  subtitle: {
    fontSize: '16px',
    color: '#6b7280',
    margin: 0,
  },
  
  methodsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
    marginBottom: '32px',
  },
  
  method: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  
  methodTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px',
    margin: '0 0 8px 0',
  },
  
  methodDescription: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '20px',
    margin: '0 0 20px 0',
  },
  
  inputContainer: {
    display: 'flex',
    gap: '12px',
  },
  
  input: {
    flex: 1,
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    padding: '12px',
    fontSize: '16px',
    backgroundColor: 'white',
  },
  
  verifyButton: {
    backgroundColor: '#1e3a8a',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    minWidth: '100px',
  },
  
  verifyButtonDisabled: {
    backgroundColor: '#9ca3af',
    cursor: 'not-allowed',
  },
  
  qrButton: {
    backgroundColor: '#059669',
    color: 'white',
    padding: '16px 32px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  
  qrButtonText: {
    color: 'white',
  },
  
  resultsSection: {
    marginBottom: '32px',
  },
  
  resultContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '16px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  
  resultHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '12px',
    borderBottom: '2px solid #e5e7eb',
  },
  
  resultTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#374151',
    margin: 0,
  },
  
  resultContent: {
    display: 'grid',
    gap: '12px',
  },
  
  resultRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px solid #f3f4f6',
  },
  
  resultLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#6b7280',
  },
  
  resultValue: {
    fontSize: '14px',
    color: '#374151',
    fontWeight: '500',
  },
  
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '12px',
    textAlign: 'center',
  },
  
  statusText: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'white',
    textTransform: 'capitalize',
  },
  
  failureText: {
    fontSize: '16px',
    color: '#374151',
    marginBottom: '12px',
    margin: '0 0 12px 0',
  },
  
  failureSubtext: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
  },
  
  resetButton: {
    backgroundColor: '#6b7280',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'block',
    margin: '0 auto',
  },
  

   
   instructionsContainer: {
     backgroundColor: 'white',
     borderRadius: '12px',
     padding: '24px',
     boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
   },
  
  instructionsTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '16px',
    margin: '0 0 16px 0',
  },
  
  instructionsList: {
    paddingLeft: '20px',
    margin: 0,
  },
  
  instructionItem: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '8px',
    lineHeight: '1.5',
  },

  // New styles for QR Scanner Modal
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '32px',
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    position: 'relative',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '2px solid #e5e7eb',
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#374151',
    margin: 0,
  },
  closeButton: {
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '20px',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBody: {
    marginBottom: '24px',
    paddingBottom: '24px',
    borderBottom: '2px solid #e5e7eb',
  },
  modalDescription: {
    fontSize: '16px',
    color: '#6b7280',
    marginBottom: '16px',
    margin: '0 0 16px 0',
  },
  scannerContainer: {
    width: '100%',
    minHeight: '300px',
    marginBottom: '20px',
  },

  cameraInstructions: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: '14px',
    marginTop: '10px',
  },
  
  // CSS Animation for loading spinner
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
  

  qrPopupContent: {
    textAlign: 'center',
  },
  qrPopupReceiptTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1e3a8a',
    marginBottom: '8px',
    margin: '0 0 8px 0',
  },
  qrPopupReceiptDetails: {
    fontSize: '16px',
    color: '#6b7280',
    marginBottom: '20px',
    margin: '0 0 20px 0',
  },
  qrPopupCodeWrapper: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  qrPopupNote: {
    fontSize: '14px',
    color: '#6b7280',
    margin: '0',
    fontStyle: 'italic',
  },
  instructionText: {
    marginBottom: '5px',
  },

  // New styles for QR Code Section
  qrCodeSection: {
    marginTop: '24px',
    paddingTop: '24px',
    borderTop: '2px solid #e5e7eb',
  },
  qrCodeTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '12px',
    margin: '0 0 12px 0',
  },
  qrCodeDescription: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '16px',
    margin: '0 0 16px 0',
  },
  qrCodeContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '20px',
  },
  qrCode: {
    marginBottom: '10px',
  },
  qrCodeNote: {
    fontSize: '12px',
    color: '#6b7280',
    textAlign: 'center',
  },
};

// Add CSS keyframes for loading animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.2); }
  }
  
  .scanning-dot-1 { animation: pulse 1.2s ease-in-out infinite; }
  .scanning-dot-2 { animation: pulse 1.2s ease-in-out infinite 0.2s; }
  .scanning-dot-3 { animation: pulse 1.2s ease-in-out infinite 0.4s; }
`;
document.head.appendChild(styleSheet);

export default ReceiptVerificationScreen;