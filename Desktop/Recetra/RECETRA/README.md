# RECETRA - NU Dasma Receipt Management System

A comprehensive receipt management system designed exclusively for NU Dasma student organizations to manage Official Receipts (OR) for donations, membership fees, and purchases.

## Features

### 🔐 Role-Based Access Control
- **Admin**: Full system access with user and template management
- **Encoder**: Can issue receipts and manage their own receipts
- **Viewer**: Read-only access to view and verify receipts

### 📄 Receipt Management
- Create and issue official receipts
- Automatic receipt number generation
- QR code generation for each receipt
- Receipt verification system
- Customizable receipt templates

### 📊 Dashboard & Analytics
- Role-specific dashboards
- Real-time statistics and reports
- Organization-specific data views
- System-wide analytics (Admin only)

### 🔍 Receipt Verification
- QR code scanning capability
- Manual receipt number entry
- Complete receipt details display
- Payment and notification status tracking

### 💬 FAQ Chatbot
- Interactive chat interface
- Quick question buttons
- Intelligent response system
- Help and support integration

### 📧 Notifications
- Email notifications for receipts
- SMS notifications
- Payment status updates
- Automated delivery tracking

## Test Accounts

Use these credentials to test different user roles:

| Username | Password | Role | Organization |
|----------|----------|------|--------------|
| admin | password | Admin | NU Dasma Admin |
| encoder | password | Encoder | Computer Science Society |
| viewer | password | Viewer | Student Council |

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (optional)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd RECETRA
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your phone

## Project Structure

```
RECETRA/
├── src/
│   ├── components/
│   │   └── Layout.tsx              # Main layout with sidebar
│   ├── context/
│   │   └── AuthContext.tsx         # Authentication context
│   ├── data/
│   │   └── mockData.ts             # Mock data and interfaces
│   ├── screens/
│   │   ├── LoginScreen.tsx         # Login screen
│   │   ├── AdminDashboard.tsx      # Admin dashboard
│   │   ├── EncoderDashboard.tsx    # Encoder dashboard
│   │   ├── ViewerDashboard.tsx     # Viewer dashboard
│   │   ├── IssueReceiptScreen.tsx  # Receipt creation form
│   │   ├── ReceiptVerificationScreen.tsx # Receipt verification
│   │   └── FAQChatbotScreen.tsx    # FAQ chatbot
│   └── services/
│       └── mockApi.ts              # Mock API services
├── App.tsx                         # Main app component
└── package.json
```

## Key Components

### Authentication System
- Secure login with role-based access
- Session management with AsyncStorage
- Automatic redirection based on user role

### Dashboard System
- **Admin Dashboard**: System statistics, user management, template management
- **Encoder Dashboard**: Personal statistics, receipt issuance, recent receipts
- **Viewer Dashboard**: Organization statistics, receipt viewing, verification

### Receipt Management
- Comprehensive receipt creation form
- Automatic QR code generation
- Receipt verification with detailed results
- Payment and notification status tracking

### Mock Services
- Payment gateway integration simulation
- Email and SMS service simulation
- QR code generation and verification
- Report generation and analytics

## Technology Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation
- **State Management**: React Context API
- **Storage**: AsyncStorage
- **UI**: Custom components with consistent blue/white theme

## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow React Native best practices
- Maintain consistent component structure
- Use proper error handling

### Adding New Features
1. Create new screen components in `src/screens/`
2. Add navigation routes in `App.tsx`
3. Update mock data in `src/data/mockData.ts`
4. Add mock services in `src/services/mockApi.ts`

### Testing
- Test all user roles and their specific functionalities
- Verify receipt creation and verification
- Test QR code functionality
- Validate form inputs and error handling

## Future Enhancements

### Phase 2 Features
- Real backend API integration
- Database implementation
- Push notifications
- Advanced reporting
- Multi-language support

### Phase 3 Features
- Mobile app deployment
- Web dashboard
- Advanced analytics
- Integration with payment gateways
- Bulk operations

## Troubleshooting

### Common Issues

1. **Metro bundler issues**
   ```bash
   npx expo start --clear
   ```

2. **Dependencies issues**
   ```bash
   npm install --force
   ```

3. **iOS build issues**
   ```bash
   cd ios && pod install
   ```

### Performance Tips
- Use FlatList for large data sets
- Implement proper loading states
- Optimize images and assets
- Use React.memo for expensive components

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is developed for NU Dasma student organizations. All rights reserved.

## Support

For technical support or questions:
- Contact the development team
- Check the FAQ chatbot in the app
- Review the documentation

---

**RECETRA** - Empowering NU Dasma student organizations with efficient receipt management.
