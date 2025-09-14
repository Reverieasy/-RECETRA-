/**
 * PayMongo Service for Mobile Application
 * Handles real PayMongo payment gateway integration
 */

class PayMongoService {
  private baseURL: string;
  private secretKey: string | undefined;
  private publicKey: string | undefined;

  constructor() {
    this.baseURL = 'https://api.paymongo.com/v1';
    this.secretKey = process.env.EXPO_PUBLIC_PAYMONGO_SECRET_KEY;
    this.publicKey = process.env.EXPO_PUBLIC_PAYMONGO_PUBLIC_KEY;
    
    if (!this.secretKey || !this.publicKey) {
      console.warn('⚠️ PayMongo API keys not found. Please set EXPO_PUBLIC_PAYMONGO_SECRET_KEY and EXPO_PUBLIC_PAYMONGO_PUBLIC_KEY in your environment variables.');
    }
    
    console.log('💳 PayMongo Service initialized');
  }

  /**
   * Makes authenticated API request to PayMongo
   * @param endpoint - API endpoint
   * @param data - Request data
   * @param method - HTTP method
   * @returns API response
   */
  private async makeRequest(endpoint: string, data: any = null, method: string = 'GET'): Promise<any> {
    if (!this.secretKey) {
      throw new Error('PayMongo secret key not configured');
    }

    const url = `${this.baseURL}${endpoint}`;
    const options: RequestInit = {
      method,
      headers: {
        'Authorization': `Basic ${btoa ? btoa(this.secretKey + ':') : Buffer.from(this.secretKey + ':').toString('base64')}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    if (data && method !== 'GET') {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.errors?.[0]?.detail || 'PayMongo API error');
      }

      return result;
    } catch (error) {
      console.error('PayMongo API Error:', error);
      throw error;
    }
  }

  /**
   * Creates a payment intent
   * @param paymentData - Payment data
   * @returns Payment intent result
   */
  async createPaymentIntent(paymentData: any): Promise<{
    success: boolean;
    paymentIntent?: any;
    clientKey?: string;
    error?: string;
  }> {
    console.log('💳 PayMongo Service: Creating payment intent', paymentData);
    
    try {
      const data = {
        data: {
          attributes: {
            amount: Math.round(parseFloat(paymentData.amount) * 100), // Convert to centavos
            currency: 'PHP',
            description: paymentData.purpose,
            metadata: {
              organization: paymentData.organization,
              category: paymentData.category,
              payer_name: paymentData.payerName,
              payer_email: paymentData.payerEmail
            }
          }
        }
      };

      const result = await this.makeRequest('/payment_intents', data, 'POST');
      
      return {
        success: true,
        paymentIntent: result.data,
        clientKey: result.data.attributes.client_key,
        error: undefined
      };
    } catch (error: any) {
      console.error('Error creating payment intent:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Creates a payment method (placeholder)
   * @param paymentMethodData - Payment method data
   * @returns Payment method result
   */
  async createPaymentMethod(paymentMethodData: any): Promise<{
    success: boolean;
    paymentMethod?: any;
    error?: string;
  }> {
    console.log('💳 PayMongo Service: Creating payment method', paymentMethodData);
    
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return {
      success: true,
      paymentMethod: {
        id: `pm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        attributes: {
          type: paymentMethodData.type,
          details: paymentMethodData.details
        }
      },
      error: undefined
    };
  }

  /**
   * Attaches payment method to payment intent (placeholder)
   * @param paymentIntentId - Payment intent ID
   * @param paymentMethodId - Payment method ID
   * @returns Attachment result
   */
  async attachPaymentMethod(paymentIntentId: string, paymentMethodId: string): Promise<{
    success: boolean;
    paymentIntent?: any;
    error?: string;
  }> {
    console.log('💳 PayMongo Service: Attaching payment method', { paymentIntentId, paymentMethodId });
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      paymentIntent: {
        id: paymentIntentId,
        attributes: {
          status: 'requires_confirmation'
        }
      },
      error: undefined
    };
  }

  /**
   * Confirms a payment intent (placeholder)
   * @param paymentIntentId - Payment intent ID
   * @returns Confirmation result
   */
  async confirmPaymentIntent(paymentIntentId: string): Promise<{
    success: boolean;
    paymentIntent?: any;
    error?: string;
  }> {
    console.log('💳 PayMongo Service: Confirming payment intent', { paymentIntentId });
    
    await new Promise(resolve => setTimeout(resolve, 700));
    
    return {
      success: true,
      paymentIntent: {
        id: paymentIntentId,
        attributes: {
          status: 'succeeded'
        }
      },
      error: undefined
    };
  }

  /**
   * Processes a complete payment flow
   * @param paymentData - Complete payment information
   * @returns Payment result
   */
  async processPayment(paymentData: any): Promise<{
    success: boolean;
    paymentIntent?: any;
    paymentMethod?: any;
    clientKey?: string;
    error?: string;
  }> {
    console.log('💳 PayMongo Service: Processing payment', paymentData);
    
    try {
      // Step 1: Create payment intent
      const intentResult = await this.createPaymentIntent(paymentData);
      if (!intentResult.success) {
        return intentResult;
      }

      // For now, return the payment intent with client key
      // In a real implementation, you would redirect to PayMongo's payment page
      // or use their JavaScript SDK to handle payment method selection
      return {
        success: true,
        paymentIntent: intentResult.paymentIntent,
        clientKey: intentResult.clientKey,
        error: undefined
      };
    } catch (error: any) {
      console.error('PayMongo processPayment error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Export singleton instance
export const paymongoService = new PayMongoService();

// Export class for testing or custom instances
export { PayMongoService };
