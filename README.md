<video src="demo.mp4" controls width="600"></video>

# TalkSpace 🔐

A modern, secure real-time messaging application with end-to-end encryption built with React, TypeScript, and Firebase.

## 🌟 Features

### 🔒 Security & Encryption
- **End-to-End Encryption**: Messages are encrypted with AES-256 and RSA-2048
- **Hybrid Encryption**: Combines symmetric (AES) and asymmetric (RSA) encryption
- **Key Management**: Automatic key generation and secure key exchange
- **Privacy First**: Messages are encrypted before leaving the client

### 💬 Real-time Messaging
- **Instant Delivery**: Real-time message updates using Firebase
- **Live Status**: Online/offline indicators
- **Message History**: Persistent chat history
- **User Profiles**: Customizable display names and avatars

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Dark/Light Mode**: Automatic theme switching
- **Smooth Animations**: Modern micro-interactions and transitions
- **Glass Morphism**: Beautiful backdrop blur effects
- **Accessibility**: WCAG compliant design

### 🛠️ Developer Features
- **TypeScript**: Full type safety and better development experience
- **Component Library**: Built with Radix UI and custom components
- **State Management**: React Context for global state
- **Error Handling**: Comprehensive error boundaries and user feedback

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Firebase project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/talkspace.git
   cd talkspace
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password and Google)
   - Enable Firestore Database
   - Update `src/lib/firebase.ts` with your Firebase config

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📖 Usage Guide

### Getting Started

1. **Create Multiple Accounts**
   - Open the app in two different browser windows
   - Sign up with different email addresses
   - This allows you to test the chat functionality

2. **Start a Conversation**
   - Click "New Chat" in the sidebar
   - Search for other users by email
   - Select a user to start chatting

3. **Enable Encryption**
   - Go to Settings (gear icon) in the sidebar
   - Toggle encryption on/off
   - Generate new encryption keys if needed

### Testing the App

1. **Multi-User Testing**
   - Use different browsers or incognito windows
   - Create accounts with different email addresses
   - Start conversations between users

2. **Encryption Demo**
   - Use the encryption demo tools in the welcome screen
   - Test message encryption/decryption
   - Verify end-to-end security

## 🏗️ Project Structure

```
talkspace/
├── src/
│   ├── components/
│   │   ├── auth/           # Authentication components
│   │   ├── chat/           # Chat interface components
│   │   └── ui/             # Reusable UI components
│   ├── contexts/           # React Context providers
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries
│   ├── types/              # TypeScript type definitions
│   └── main.tsx           # Application entry point
├── public/                # Static assets
├── dist/                  # Build output
└── package.json           # Dependencies and scripts
```

## 🔧 Configuration

### Firebase Setup

1. **Authentication**
   ```javascript
   Enable in Firebase Console:
   - Email/Password authentication
   - Google authentication
   ```

2. **Firestore Rules**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       match /chats/{chatId} {
         allow read, write: if request.auth != null && 
           request.auth.uid in resource.data.participants;
       }
       match /messages/{messageId} {
         allow read, write: if request.auth != null && 
           request.auth.uid in get(/databases/$(database)/documents/chats/$(resource.data.chatId)).data.participants;
       }
     }
   }
   ```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 🔐 Encryption Details

### How It Works

1. **Key Generation**
   - Each user generates a RSA-2048 key pair
   - Public keys are shared with other users
   - Private keys remain on the user's device

2. **Message Encryption**
   - Generate a random AES-256 key for each message
   - Encrypt the message content with AES-256
   - Encrypt the AES key with the recipient's RSA public key
   - Send both encrypted message and encrypted key

3. **Message Decryption**
   - Decrypt the AES key using your RSA private key
   - Decrypt the message content using the AES key
   - Display the decrypted message

### Security Features

- **Perfect Forward Secrecy**: Each message uses a unique AES key
- **Asymmetric Encryption**: RSA-2048 for key exchange
- **Symmetric Encryption**: AES-256 for message content
- **Client-Side Only**: Encryption/decryption happens in the browser

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Code Style

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting with React and TypeScript rules
- **Prettier**: Automatic code formatting
- **Conventional Commits**: Standardized commit messages

### Testing

```bash
# Run tests (when implemented)
npm test

# Run tests in watch mode
npm run test:watch
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**
   - Push your code to GitHub
   - Connect your repository to Vercel

2. **Configure Environment Variables**
   - Add Firebase configuration in Vercel dashboard
   - Set all required environment variables

3. **Deploy**
   - Vercel will automatically deploy on push to main branch

### Netlify

1. **Build Command**: `npm run build`
2. **Publish Directory**: `dist`
3. **Environment Variables**: Add Firebase config

### Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure accessibility compliance

## 📝 License

This project is licensed under the MIT License

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Firebase** for backend services
- **Radix UI** for accessible components
- **Tailwind CSS** for styling
- **CryptoJS & Node-Forge** for encryption

## 🔄 Changelog

### v1.0.0 (Current)
- ✨ Initial release
- 🔒 End-to-end encryption
- 💬 Real-time messaging
- 🎨 Modern UI/UX
- 📱 Responsive design
- 🔧 TypeScript support

---

**Made with ❤️ by Heet Viradiya**
