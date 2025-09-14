import React from 'react';
import Layout from '../components/Layout';

/**
 * Test Payment Gateway Screen Component
 * Minimal version to test if the issue is with the component or the app structure
 */
const PaymentGatewayScreenTest = () => {
  console.log('PaymentGatewayScreenTest: Component rendering...');
  
  return (
    <Layout title="Payment Gateway Test" showBackButton={true}>
      <div className="innerContainer">
        <div style={{ padding: '20px' }}>
          <h2>Payment Gateway Test</h2>
          <p>If you can see this, the component is rendering correctly.</p>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentGatewayScreenTest;
