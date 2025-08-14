# RECETRA - Receipt Management System

A comprehensive receipt management system built with React Native (mobile) and React.js (web), designed for educational institutions like NU Dasma.

## 🚀 Features

- **Multi-Platform**: React Native mobile app + React.js web application
- **Role-Based Access**: Admin, Encoder, and Viewer roles with different permissions
- **Receipt Management**: Issue, verify, and archive receipts with QR code generation
- **User Management**: Complete user administration and role management
- **Template System**: Customizable receipt templates
- **FAQ Chatbot**: AI-powered support system
- **Payment Gateway**: Integrated payment processing
- **Real-time Verification**: QR code scanning and receipt validation

## 📱 Mobile App (React Native)

### Prerequisites
- Node.js (v18+)
- Expo CLI
- Android Studio / Xcode (for device testing)

### Installation
```bash
cd mobile
npm install
```

### Running the Mobile App
```bash
npm start
```

**Note**: The mobile app has been fixed to resolve navigation errors and TypeScript compilation issues.

## 🌐 Web App (React.js)

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
```bash
cd web
npm install
```

### Running the Web App
```bash
npm run dev
```

**Note**: The web app has been fixed to resolve white screen issues and style compatibility problems.

## 🛠️ Development Server Management

We've created convenient scripts to manage your development servers without typing commands repeatedly.

### PowerShell Script (Recommended)
```powershell
# Show server status
.\start-dev.ps1

# Start web server only
.\start-dev.ps1 web

# Start mobile server only
.\start-dev.ps1 mobile

# Start both servers
.\start-dev.ps1 both

# Stop all servers
.\start-dev.ps1 stop
```

### Batch Files (Quick Start)
- **`Start Both Servers.bat`** - Double-click to start both servers
- **`Start Web Server.bat`** - Double-click to start web server only
- **`Start Mobile Server.bat`** - Double-click to start mobile server only

### Manual Commands
```bash
# Web Server
cd web && npm run dev

# Mobile Server
cd mobile && npm start
```

## 🔧 Recent Fixes Applied

### Mobile App Fixes
- ✅ **Navigation Error Fixed**: Resolved "property navigation doesn't exist" error
- ✅ **TypeScript Issues**: Fixed navigation type definitions
- ✅ **User Interface**: Added missing `createdAt` property to User interface

### Web App Fixes
- ✅ **White Screen Issue**: Fixed SignupScreen and FAQ Chatbot white screen problems
- ✅ **Style Compatibility**: Converted React Native array styles to React.js compatible syntax
- ✅ **Layout Issues**: Resolved component dependency and rendering problems

## 📁 Project Structure

```
RECETRA_/
├── mobile/                 # React Native mobile app
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── screens/        # App screens
│   │   ├── context/        # Authentication context
│   │   ├── data/          # Mock data and interfaces
│   │   └── services/      # API services
│   ├── App.tsx            # Main app component
│   └── package.json       # Mobile dependencies
├── web/                    # React.js web app
│   ├── src/
│   │   ├── components/     # Web components
│   │   ├── screens/        # Web screens
│   │   ├── context/        # Auth context
│   │   ├── data/          # Mock data
│   │   └── services/      # API services
│   ├── App.js             # Main web app
│   └── package.json       # Web dependencies
├── start-dev.ps1          # PowerShell server manager
├── start-dev.bat          # Batch file server manager
├── Start Both Servers.bat # Quick start both servers
├── Start Web Server.bat   # Quick start web server
├── Start Mobile Server.bat # Quick start mobile server
└── README.md              # This file
```

## 👥 User Roles

### Admin
- Full system access
- User management
- Template management
- System administration

### Encoder
- Issue receipts
- Manage transactions
- Receipt verification
- Archive management

### Viewer
- Read-only access
- Receipt verification
- Payment gateway access
- FAQ support

## 🚀 Quick Start Guide

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd RECETRA_
   ```

2. **Install dependencies**
   ```bash
   # Install web dependencies
   cd web && npm install && cd ..
   
   # Install mobile dependencies
   cd mobile && npm install && cd ..
   ```

3. **Start development servers**
   ```bash
   # Use the convenient script
   .\start-dev.ps1 both
   
   # Or double-click the batch files
   # Start Both Servers.bat
   ```

4. **Access your apps**
   - **Web App**: http://localhost:5173
   - **Mobile App**: Scan QR code from Expo terminal

## 🛠️ Development Workflow

### Daily Development
1. **Morning**: Run `.\start-dev.ps1 both` or double-click `Start Both Servers.bat`
2. **During work**: Keep terminal windows open (minimize, don't close)
3. **Evening**: Use `.\start-dev.ps1 stop` to clean up

### Quick Restarts
- **Web only**: `.\start-dev.ps1 web` or double-click `Start Web Server.bat`
- **Mobile only**: `.\start-dev.ps1 mobile` or double-click `Start Mobile Server.bat`

## 🔍 Troubleshooting

### Common Issues
- **Port already in use**: Use `.\start-dev.ps1 stop` then restart
- **White screens**: Check browser console for errors
- **Navigation errors**: Ensure servers are running

### Server Management
```bash
# Check what's running
.\start-dev.ps1 status

# Stop everything
.\start-dev.ps1 stop

# Restart both
.\start-dev.ps1 both
```

## 📚 Technologies Used

- **Mobile**: React Native, Expo, TypeScript
- **Web**: React.js, Vite, JavaScript
- **Navigation**: React Navigation (mobile), React Router (web)
- **State Management**: React Context API
- **Styling**: StyleSheet (mobile), Inline styles (web)
- **Development**: PowerShell scripts, Batch files

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For technical support or questions:
- Check the FAQ Chatbot in the application
- Review the troubleshooting section above
- Contact the development team

---

**Happy coding! 🚀**
