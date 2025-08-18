/**
 * RECETRA Mock Data Structure
 * This file contains all the mock data used throughout the application
 * In a real application, this would be replaced with actual API calls and database queries
 */

/**
 * Data Structure Definitions (converted from TypeScript interfaces):
 * 
 * User: {
 *   id: string,
 *   username: string,
 *   password: string,
 *   fullName: string,
 *   email: string,
 *   phone?: string,
 *   role: 'Admin' | 'Encoder' | 'Viewer',
 *   organization: string,
 *   isActive: boolean
 * }
 * 
 * Receipt: {
 *   id: string,
 *   receiptNumber: string,
 *   payer: string,
 *   amount: number,
 *   purpose: string,
 *   category: string,
 *   organization: string,
 *   issuedBy: string,
 *   issuedAt: string,
 *   templateId: string,
 *   qrCode: string,
 *   emailStatus: 'pending' | 'sent' | 'failed',
 *   smsStatus: 'pending' | 'sent' | 'failed',
 *   paymentStatus: 'pending' | 'completed' | 'failed'
 * }
 */

// ============================================================================
// MOCK DATA
// ============================================================================

/**
 * Mock user data for testing different roles
 * In a real application, this would come from a database
 */
export const mockUsers = [
  {
    id: '1',
    username: 'admin',
    password: 'password',
    role: 'Admin',
    organization: 'NU Dasma Admin',
    email: 'admin@nudasma.edu.ph',
    fullName: 'System Administrator',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    username: 'encoder',
    password: 'password',
    role: 'Encoder',
    organization: 'Computer Science Society',
    email: 'encoder@nudasma.edu.ph',
    fullName: 'John Encoder',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    username: 'viewer',
    password: 'password',
    role: 'Viewer',
    organization: 'Student Council',
    email: 'viewer@nudasma.edu.ph',
    fullName: 'Jane Viewer',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  }
];

/**
 * Mock organization data representing NU Dasma student organizations
 */
export const mockOrganizations = [
  {
    id: '1',
    name: 'Computer Science Society',
    code: 'CSS',
    description: 'Official organization for Computer Science students',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Student Council',
    code: 'SC',
    description: 'Student Council of NU Dasma',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Engineering Society',
    code: 'ES',
    description: 'Engineering students organization',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  }
];

/**
 * Mock category data for payment classification
 */
export const mockCategories = [
  {
    id: '1',
    name: 'Membership Fee',
    description: 'Annual membership fees',
    isActive: true
  },
  {
    id: '2',
    name: 'Event Registration',
    description: 'Event registration fees',
    isActive: true
  },
  {
    id: '3',
    name: 'Donation',
    description: 'Voluntary donations',
    isActive: true
  },
  {
    id: '4',
    name: 'Merchandise',
    description: 'Organization merchandise sales',
    isActive: true
  }
];

/**
 * Mock receipt template data
 * Templates define how receipts look when printed
 */
export const mockReceiptTemplates = [
  {
    id: '1',
    name: 'Standard Receipt',
    description: 'Standard receipt template for general use',
    organization: 'Computer Science Society',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Event Receipt',
    description: 'Specialized template for event registrations',
    organization: 'Student Council',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Donation Receipt',
    description: 'Template for donation receipts',
    organization: 'Engineering Society',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  }
];

/**
 * Mock receipt data for demonstration
 * In a real application, this would be stored in a database
 */
export const mockReceipts = [
  {
    id: '1',
    receiptNumber: 'OR-2024-001',
    payer: 'Juan Dela Cruz',
    amount: 500.00,
    purpose: 'Annual Membership Fee',
    category: 'Membership Fee',
    organization: 'Computer Science Society',
    issuedBy: 'John Encoder',
    issuedAt: '2024-01-15T10:30:00Z',
    templateId: '1',
    qrCode: 'OR-2024-001-QR',
    emailStatus: 'sent',
    smsStatus: 'sent',
    paymentStatus: 'completed'
  },
  {
    id: '2',
    receiptNumber: 'OR-2024-002',
    payer: 'Maria Santos',
    amount: 200.00,
    purpose: 'Tech Conference Registration',
    category: 'Event Registration',
    organization: 'Student Council',
    issuedBy: 'John Encoder',
    issuedAt: '2024-01-16T14:20:00Z',
    templateId: '2',
    qrCode: 'OR-2024-002-QR',
    emailStatus: 'sent',
    smsStatus: 'pending',
    paymentStatus: 'completed'
  },
  {
    id: '3',
    receiptNumber: 'OR-2024-003',
    payer: 'Pedro Reyes',
    amount: 1000.00,
    purpose: 'Charity Donation',
    category: 'Donation',
    organization: 'Engineering Society',
    issuedBy: 'John Encoder',
    issuedAt: '2024-01-17T09:15:00Z',
    templateId: '3',
    qrCode: 'OR-2024-003-QR',
    emailStatus: 'pending',
    smsStatus: 'failed',
    paymentStatus: 'pending'
  }
];

/**
 * Mock system statistics for dashboard displays
 */
export const mockSystemStats = {
  totalReceipts: 150,
  totalAmount: 75000.00,
  receiptsThisMonth: 25,
  amountThisMonth: 12500.00,
  activeUsers: 45,
  activeOrganizations: 8
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Adds a new receipt to the mock data
 * In a real application, this would save to a database
 * @param {Object} receipt - Receipt data without id and qrCode (these are auto-generated)
 * @returns {Object} The created receipt with generated id and qrCode
 */
export const addReceipt = (receipt) => {
  const newReceipt = {
    ...receipt,
    id: Date.now().toString(),
    qrCode: `${receipt.receiptNumber}-QR`
  };
  mockReceipts.push(newReceipt);
  return newReceipt;
};

/**
 * Finds a user by their login credentials
 * @param {string} username - User's username
 * @param {string} password - User's password
 * @returns {Object|null} User object if found and active, null otherwise
 */
export const findUserByCredentials = (username, password) => {
  return mockUsers.find(user => 
    user.username === username && 
    user.password === password && 
    user.isActive
  ) || null;
};

/**
 * Gets all receipts for a specific organization
 * @param {string} organization - Organization name to filter by
 * @returns {Array} Array of receipts for the organization
 */
export const getReceiptsByOrganization = (organization) => {
  return mockReceipts.filter(receipt => receipt.organization === organization);
};

/**
 * Gets all receipts issued by a specific user
 * @param {string} issuedBy - Name of the user who issued the receipts
 * @returns {Array} Array of receipts issued by the user
 */
export const getReceiptsByUser = (issuedBy) => {
  return mockReceipts.filter(receipt => receipt.issuedBy === issuedBy);
};

/**
 * Updates a user's profile information
 * @param {string} userId - User's ID
 * @param {Object} updates - Object containing fields to update
 * @returns {Object|null} Updated user object if successful, null otherwise
 */
export const updateUser = (userId, updates) => {
  const userIndex = mockUsers.findIndex(user => user.id === userId);
  if (userIndex === -1) return null;
  
  // Update the user with new data
  mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };
  
  // Also update localStorage if user exists there
  try {
    const localUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
    const localUserIndex = localUsers.findIndex(user => user.id === userId);
    if (localUserIndex !== -1) {
      localUsers[localUserIndex] = { ...localUsers[localUserIndex], ...updates };
      localStorage.setItem('mockUsers', JSON.stringify(localUsers));
    }
  } catch (error) {
    console.error('Error updating local user:', error);
  }
  
  return mockUsers[userIndex];
};