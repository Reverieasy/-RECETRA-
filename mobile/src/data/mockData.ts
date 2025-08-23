/**
 * RECETRA Mock Data Structure
 * This file contains all the mock data and interfaces used throughout the application
 * In a real application, this would be replaced with actual API calls and database queries
 */

/**
 * User interface representing a system user
 * Contains all user information and authentication details
 */
export interface User {
  id: string;                    // Unique user identifier
  username: string;              // Login username
  password: string;              // Login password (hashed in real app)
  fullName: string;              // User's full name
  email: string;                 // User's email address
  phone?: string;                // User's phone number (optional)
  role: 'Admin' | 'Encoder' | 'Viewer';  // User's role in the system
  organization: string;          // Organization the user belongs to
  isActive: boolean;             // Whether the user account is active
  createdAt?: string;            // User creation timestamp (optional for backward compatibility)
}

/**
 * Receipt interface representing an official receipt
 * Contains all details about a financial transaction
 */
export interface Receipt {
  id: string;                                    // Unique receipt identifier
  receiptNumber: string;                         // Human-readable receipt number (e.g., OR-2024-001)
  payer: string;                                 // Name of the person who paid
  amount: number;                                // Payment amount in pesos
  purpose: string;                               // Purpose of the payment
  category: string;                              // Category of the payment (e.g., Membership Fee)
  organization: string;                          // Organization that issued the receipt
  issuedBy: string;                              // Name of the person who issued the receipt
  issuedAt: string;                              // Timestamp when receipt was issued
  templateId: string;                            // ID of the receipt template used
  qrCode: string;                                // QR code data for verification
  emailStatus: 'pending' | 'sent' | 'failed';   // Status of email notification
  smsStatus: 'pending' | 'sent' | 'failed';     // Status of SMS notification
  paymentStatus: 'pending' | 'completed' | 'failed'; // Status of payment processing
  paymentMethod?: 'Paymongo' | 'Manual';        // Method of payment (optional for backward compatibility)
}

/**
 * Receipt template interface
 * Templates define the layout and styling of receipts
 */
export interface ReceiptTemplate {
  id: string;                                    // Unique template identifier
  name: string;                                  // Template name
  description: string;                           // Template description
  organization: string;                          // Organization that owns this template
  isActive: boolean;                             // Whether template is available for use
  createdAt: string;                             // Template creation timestamp
  templateType?: string;                         // Type of template (optional for backward compatibility)
}

/**
 * Organization interface representing student organizations
 */
export interface Organization {
  id: string;                                    // Unique organization identifier
  name: string;                                  // Organization name
  code: string;                                  // Short organization code (e.g., CSS)
  description: string;                           // Organization description
  isActive: boolean;                             // Whether organization is active
  createdAt: string;                             // Organization creation timestamp
}

/**
 * Category interface for payment categorization
 */
export interface Category {
  id: string;                                    // Unique category identifier
  name: string;                                  // Category name
  description: string;                           // Category description
  isActive: boolean;                             // Whether category is active
}

/**
 * System statistics interface for dashboard displays
 */
export interface SystemStats {
  totalReceipts: number;                         // Total number of receipts in system
  totalAmount: number;                           // Total amount of all receipts
  receiptsThisMonth: number;                     // Number of receipts issued this month
  amountThisMonth: number;                       // Total amount of receipts this month
  activeUsers: number;                           // Number of active users
  activeOrganizations: number;                   // Number of active organizations
}

// ============================================================================
// MOCK DATA
// ============================================================================

/**
 * Mock user data for testing different roles
 * In a real application, this would come from a database
 */
export const mockUsers: User[] = [
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
export const mockOrganizations: Organization[] = [
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
export const mockCategories: Category[] = [
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
export const mockReceiptTemplates: ReceiptTemplate[] = [
  {
    id: '1',
    name: 'Standard Receipt',
    description: 'Standard receipt template for general use',
    organization: 'Computer Science Society',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    templateType: 'Standard'
  },
  {
    id: '2',
    name: 'Event Receipt',
    description: 'Specialized template for event registrations',
    organization: 'Student Council',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    templateType: 'Event'
  },
  {
    id: '3',
    name: 'Donation Receipt',
    description: 'Template for donation receipts',
    organization: 'Engineering Society',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    templateType: 'Donation'
  }
];

/**
 * Mock receipt data for demonstration
 * In a real application, this would be stored in a database
 */
export const mockReceipts: Receipt[] = [
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
    paymentStatus: 'completed',
    paymentMethod: 'Manual'
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
    paymentStatus: 'completed',
    paymentMethod: 'Manual'
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
    paymentStatus: 'pending',
    paymentMethod: 'Manual'
  }
];

/**
 * Mock system statistics for dashboard displays
 */
export const mockSystemStats: SystemStats = {
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
 * @param receipt - Receipt data without id and qrCode (these are auto-generated)
 * @returns The created receipt with generated id and qrCode
 */
export const addReceipt = (receipt: Omit<Receipt, 'id' | 'qrCode'>) => {
  const newReceipt: Receipt = {
    ...receipt,
    id: Date.now().toString(),
    qrCode: `${receipt.receiptNumber}-QR`
  };
  mockReceipts.push(newReceipt);
  return newReceipt;
};

/**
 * Finds a user by their login credentials
 * @param username - User's username
 * @param password - User's password
 * @returns User object if found and active, null otherwise
 */
export const findUserByCredentials = (username: string, password: string): User | null => {
  return mockUsers.find(user => 
    user.username === username && 
    user.password === password && 
    user.isActive
  ) || null;
};

/**
 * Adds a new user to the mock data
 * In a real application, this would save to a database
 * @param user - User data without id and createdAt (these are auto-generated)
 * @returns The created user with generated id and createdAt
 */
export const addUser = (user: Omit<User, 'id' | 'createdAt'>) => {
  const newUser: User = {
    ...user,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  };
  mockUsers.push(newUser);
  return newUser;
};

/**
 * Gets all receipts for a specific organization
 * @param organization - Organization name to filter by
 * @returns Array of receipts for the organization
 */
export const getReceiptsByOrganization = (organization: string): Receipt[] => {
  return mockReceipts.filter(receipt => receipt.organization === organization);
};

/**
 * Gets all receipts issued by a specific user
 * @param issuedBy - Name of the user who issued the receipts
 * @returns Array of receipts issued by the user
 */
export const getReceiptsByUser = (issuedBy: string): Receipt[] => {
  return mockReceipts.filter(receipt => receipt.issuedBy === issuedBy);
};
