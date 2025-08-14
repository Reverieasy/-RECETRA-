# RECETRA 
A comprehensive receipt management system built with React Native (mobile) and React.js (web), designed for NU Dasma orgs.

## Mobile App (React Native)
### Prerequisites
- Node.js (v18+)
- Expo CLI
- Android Studio / Xcode (for device testing)

##  Web App (React.js)
### Prerequisites
- Node.js (v18+)
- npm or yarn

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

##  Project Structure

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

##  User Roles

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

##  Quick Start Guide

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

### Quick Restarts
- **Web only**: `.\start-dev.ps1 web` or double-click `Start Web Server.bat`
- **Mobile only**: `.\start-dev.ps1 mobile` or double-click `Start Mobile Server.bat`

## Troubleshooting

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

##  Technologies Used

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
---

