<<<<<<< HEAD
# RECETRA 

A comprehensive receipt management system for NU Dasma student organizations, featuring both web and mobile applications with role-based access control, QR code verification, and payment gateway integration.

## 🏗 Project Structure Overview

This project contains **two separate applications** - a **web application** and a **mobile application** - both designed to work together as a complete receipt management system.

```
Recetra_/
├── assets/                     # Shared assets folder
├── mobile/                     # React Native Mobile Application
├── web/                        # React Web Application
└── batch script/               # Windows batch scripts for easy startup
```

##  Web Application (`/web`)

**Purpose**: Desktop/web-based interface for administrators and encoders to manage the receipt system from computers.

**What it's for**:
- **Admin Management**: Full system control, user management, analytics
- **Encoder Operations**: Receipt issuance, template management, bulk operations
- **Desktop Access**: Better for data entry, reporting, and administrative tasks
- **Cross-Platform**: Works on Windows, Mac, Linux through web browsers

**Technology Stack**:
- React.js with JSX
- Vite build system
- CSS3 with modern styling
- Responsive design for different screen sizes

##  Mobile Application (`/mobile`)

**Purpose**: Mobile-first interface for encoders and viewers to use the system on-the-go.

**What it's for**:
- **Field Operations**: Issue receipts during events, meetings, or on-site
- **QR Code Scanning**: Use device camera for receipt verification
- **Mobile Payments**: Process payments through mobile payment gateways
- **Portable Access**: Work from anywhere with mobile devices

**Technology Stack**:
- React Native with Expo
- TypeScript for type safety
- React Navigation for mobile navigation
- Native device features (camera, storage, etc.)

##  Key Features

### **Role-Based Access Control**
- **Admin Role**: Full system access, user management, analytics
- **Encoder Role**: Receipt issuance, template management, transaction processing
- **Viewer Role**: Receipt verification, payment gateway access, read-only operations

### **Receipt Management System**
- **Digital Receipts**: Generate official receipts with unique numbers
- **QR Code Integration**: Each receipt gets a scannable QR code for verification
- **Template System**: Customizable receipt templates for different purposes
- **Transaction Archive**: Complete history of all receipts and payments

### **Payment Gateway**
- **PayMongo Integration**: Secure online payment processing
- **Multiple Payment Methods**: Credit cards, digital wallets, bank transfers
- **Automatic Receipt Generation**: Receipts created automatically after successful payments

### **User Experience Features**
- **FAQ Chatbot**: Interactive help system for users
- **Responsive Design**: Works on all device sizes
- **Intuitive Navigation**: Easy-to-use interface for all user types
- **Real-time Updates**: Live data synchronization across platforms

##  Getting Started

### **Prerequisites**
- Node.js (v16 or higher)
- npm or yarn package manager
- Git for version control

### **Quick Start**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Recetra_
   ```

2. **Start Web Application**
   ```bash
   cd web
   npm install
   npm run dev
   ```
   Web app will be available at `http://localhost:5173`

3. **Start Mobile Application**
   ```bash
   cd mobile
   npm install
   npx expo start
   ```
   Use Expo Go app to scan QR code and run on mobile device

### **Using Batch Scripts (Windows)**
- **`Start Both Servers.bat`**: Starts both web and mobile servers simultaneously
- **`Start Web Server.bat`**: Starts only the web application
- **`Start Mobile Server.bat`**: Starts only the mobile application
- **`start-dev.bat`**: Alternative startup script with development settings


## Development Workflow

### **Web Development**
- Edit files in `/web/src/`
- Use `.jsx` extension for React components
- Styles in `/web/src/styles/`
- Run `npm run build` for production build

### **Mobile Development**
- Edit files in `/mobile/src/`
- Use `.tsx` extension for TypeScript components
- Assets in `/mobile/assets/`
- Run `npx expo start` for development

### **Shared Assets**
- Place common images, icons, and resources in root `/assets/` folder
- Both applications reference this shared folder
- Maintains consistency across platforms

## 🧪 Testing

### **Test Accounts**
| Role | Username | Password | Access Level |
|------|----------|----------|--------------|
| Admin | admin | password | Full system access |
| Encoder | encoder | password | Receipt management |
| Viewer | viewer | password | Read-only access |

### **Testing Scenarios**
- **Receipt Issuance**: Create receipts with different templates
- **QR Code Verification**: Scan generated QR codes
- **Payment Processing**: Test payment gateway integration
- **User Management**: Add, edit, and manage user accounts
- **Role Permissions**: Verify access control for different roles

##  Platform-Specific Features

### **Web Application**
- **Large Screen Optimization**: Better for data entry and management
- **Keyboard Navigation**: Full keyboard support for power users
- **Print Support**: Print receipts and reports directly
- **Multi-tab Support**: Work with multiple sections simultaneously

### **Mobile Application**
- **Camera Integration**: QR code scanning and photo capture
- **Touch Optimization**: Mobile-first interface design
- **Offline Capability**: Basic functionality without internet
- **Push Notifications**: Real-time updates and alerts

##  Security Features

- **Role-based Authentication**: Users can only access features for their role
- **Session Management**: Secure login/logout with token validation
- **Input Validation**: Prevents malicious data entry
- **Secure API Calls**: Protected endpoints for sensitive operations

##  Future Enhancements

- **Backend Integration**: Replace mock data with real database
- **Real-time Sync**: Live updates across all devices
- **Advanced Analytics**: Detailed reporting and insights
- **API Documentation**: Comprehensive API reference
- **Automated Testing**: Unit and integration tests

##  Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/new-feature`
3. **Make your changes**: Follow the existing code style
4. **Test thoroughly**: Ensure both web and mobile work correctly
5. **Submit a pull request**: Include detailed description of changes

### **Code Style Guidelines**
- **Web**: Use `.jsx` extension, follow React best practices
- **Mobile**: Use `.tsx` extension, follow TypeScript conventions
- **Assets**: Place in appropriate folders, use descriptive names
- **Documentation**: Update README and add inline comments

##  Support

- **Technical Issues**: Check existing issues or create new ones
- **Feature Requests**: Submit through GitHub issues
- **Documentation**: Refer to this README and inline code comments
- **Community**: Join discussions in project forums

=======
# RECETRA - NU Dasma Receipt Management System

A comprehensive React Native mobile application for NU Dasma student organizations to manage official receipts, donations, and membership fees with role-based access control.

## 🚀 Features

### **Authentication & Authorization**
- Secure login/signup system
- Role-based access control (Admin, Encoder, Viewer)
- Session management with AsyncStorage
- Input validation and error handling

### **Role-Based Dashboards**

#### **Admin Dashboard**
- System statistics overview
- User management capabilities
- Template management
- Receipt verification tools
- FAQ chatbot access

#### **Encoder Dashboard**
- Personal receipt statistics
- Receipt issuance functionality
- Transaction archive
- Quick tips and guidance
- Receipt verification access

#### **Viewer Dashboard**
- Organization statistics
- Payment gateway access
- Receipt verification
- Read-only receipt viewing

### **Core Functionality**
- **Receipt Management**: Issue, verify, and track official receipts
- **QR Code System**: Unique QR codes for each receipt
- **Payment Gateway**: Paymongo integration for online payments
- **User Management**: Add, edit, and manage user accounts
- **Template Management**: Customize receipt templates
- **Transaction Archive**: Track all transactions and payments
- **FAQ Chatbot**: Interactive help system


## 🛠️ Technology Stack

- **React Native** with Expo SDK 53
- **TypeScript** for type safety
- **React Navigation** for navigation
- **AsyncStorage** for session management
- **Context API** for state management

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (optional)
- Expo Go app for mobile testing

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/JOMPOGI/-RECETRA-.git
   cd -RECETRA-
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on your device**
   - Install Expo Go from App Store/Google Play
   - Scan the QR code with Expo Go
   - Or press 'i' for iOS simulator, 'a' for Android emulator

## 👥 Test Accounts

Use these accounts to test different roles:

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | password |
| Encoder | encoder | password |
| Viewer | viewer | password |

## 📁 Project Structure

```
RECETRA/
├── src/
│   ├── components/
│   │   └── Layout.tsx            #  Main layout with sidebar
│   ├── context/
│   │   └── AuthContext.tsx       #  Authentication context
│   ├── data/
│   │   └── mockData.ts               # Mock data and interfaces
│   ├── screens/
│   │   ├── LoginScreen.tsx                # Login screen
│   │   ├── SignupScreen.tsx               # Signup screen
│   │   ├── AdminDashboard.tsx             # Admin dashboard
│   │   ├── EncoderDashboard.tsx           # Encoder dashboard
│   │   ├── ViewerDashboard.tsx            # Viewer dashboard
│   │   ├── IssueReceiptScreen.tsx         # Receipt issuance
│   │   ├── ReceiptVerificationScreen.tsx  # QR verification
│   │   ├── PaymentGatewayScreen.tsx       # Paymongo integration
│   │   ├── UserManagementScreen.tsx       # User management
│   │   ├── TemplateManagementScreen.tsx   # Template management
│   │   ├── TransactionArchiveScreen.tsx   # Transaction history
│   │   ├── ProfileScreen.tsx              # User profile
│   │   └── FAQChatbotScreen.tsx           # Help system
│   └── services/
│       └── mockApi.ts          # Mock API services
├── assets/                     # App icons and images
├── App.tsx                     # Main application entry
├── package.json                # Dependencies
└── README.md                   # This file
```

## 🔧 Development

### **Available Scripts**

- `npx expo start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run in web browseR


## Data Management

- Mock data system for development
- Structured interfaces for type safety
- Helper functions for data manipulation
- Ready for backend integration

##  UI/UX Design
- Responsive layouts
- Intuitive navigation
- Loading states and error handling

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


---

**RECETRA** 
>>>>>>> 87811f0882420dd10fd96353bdc64435115bb3d5
