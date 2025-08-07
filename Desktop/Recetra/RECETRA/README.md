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
