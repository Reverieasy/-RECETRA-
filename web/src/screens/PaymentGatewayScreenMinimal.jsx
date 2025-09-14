import React from 'react';
import Layout from '../components/Layout';

/**
 * Minimal Payment Gateway Screen for testing
 */
const PaymentGatewayScreenMinimal = () => {
  console.log('PaymentGatewayScreenMinimal: Rendering...');
  
  return (
    <Layout title="Payment Gateway Test" showBackButton={true}>
      <div className="innerContainer">
        <div style={{ padding: '20px' }}>
          <h2>Payment Gateway Test</h2>
          <p>If you can see this, the component is rendering correctly.</p>
          <p>This is a minimal test version to check if the issue is with the component or the app structure.</p>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentGatewayScreenMinimal;
