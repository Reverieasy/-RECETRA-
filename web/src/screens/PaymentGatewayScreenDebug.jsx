import React, { useState } from 'react';
import Layout from '../components/Layout';

const PaymentGatewayScreenDebug = () => {
  console.log('PaymentGatewayScreenDebug: Starting...');
  
  try {
    console.log('PaymentGatewayScreenDebug: Inside try block...');
    
    const [paymentData, setPaymentData] = useState({
      organization: '',
      category: '',
      amount: '',
      purpose: '',
      payerName: '',
      payerEmail: '',
    });
    
    console.log('PaymentGatewayScreenDebug: State initialized...');
    
    const handleInputChange = (field, value) => {
      console.log('PaymentGatewayScreenDebug: handleInputChange called', field, value);
      setPaymentData(prev => ({ ...prev, [field]: value }));
    };
    
    console.log('PaymentGatewayScreenDebug: About to return JSX...');
    
    return (
      <Layout title="Payment Gateway Debug" showBackButton={true}>
        <div className="innerContainer">
          <div style={{ padding: '20px' }}>
            <h2>Payment Gateway Debug</h2>
            <p>This is a debug version to test step by step.</p>
            
            <div style={{ marginTop: '20px' }}>
              <label>Organization:</label>
              <input 
                type="text" 
                value={paymentData.organization}
                onChange={(e) => handleInputChange('organization', e.target.value)}
                style={{ marginLeft: '10px', padding: '5px' }}
              />
            </div>
            
            <div style={{ marginTop: '10px' }}>
              <label>Amount:</label>
              <input 
                type="number" 
                value={paymentData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                style={{ marginLeft: '10px', padding: '5px' }}
              />
            </div>
            
            <div style={{ marginTop: '20px' }}>
              <p>Current data: {JSON.stringify(paymentData)}</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  } catch (error) {
    console.error('PaymentGatewayScreenDebug: Error caught:', error);
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h2>Error in PaymentGatewayScreenDebug</h2>
        <p>Error: {error.message}</p>
        <pre>{error.stack}</pre>
      </div>
    );
  }
};

export default PaymentGatewayScreenDebug;
