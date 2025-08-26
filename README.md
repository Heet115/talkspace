# TalkSpace - Secure Real-time Chat Application

A modern, secure real-time chat application built with React, TypeScript, and Firebase, featuring end-to-end encryption for private messaging.

## Features

- 🔐 **End-to-End Encryption**: AES + RSA hybrid encryption for secure messaging
- 🔑 **Key Management**: Generate and manage RSA key pairs for encryption
- 💬 **Real-time Messaging**: Instant message delivery using Firestore
- 👥 **User Management**: Create chats with other users
- 🎨 **Modern UI**: Beautiful interface built with shadcn/ui components
- 📱 **Responsive Design**: Works on desktop and mobile devices
- ⚡ **Real-time Updates**: Messages appear instantly without page refresh
- 🛡️ **Security**: Message encryption with visual indicators
- 🔒 **Privacy**: Server cannot decrypt your messages

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd talkspace
```

2. Install dependencies:
```bash
npm install
```

3. Configure Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Update the Firebase configuration in `src/lib/firebase.ts`

4. Set up Firestore Security Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read all user documents (for chat creation)
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can read/write chats they participate in
    match /chats/{chatId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in resource.data.participants;
    }
    
    // Users can read/write messages in chats they participate in
    match /chats/{chatId}/messages/{messageId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in get(/databases/$(database)/documents/chats/$(chatId)).data.participants;
    }
  }
}
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:5173](http://localhost:5173) in your browser.

## How to Use

### Authentication
1. Sign up with your email and password
2. Or log in if you already have an account

### Setting Up Encryption
1. Click the settings icon (⚙️) in the top-right corner
2. Click "Generate Keys" to create your RSA key pair
3. Toggle "Enable Encryption" to activate secure messaging
4. Your messages will now be encrypted before sending

### Creating Chats
1. Click the "New Chat" button in the sidebar
2. Search for users by name or email
3. Click on a user to start a conversation

### Sending Messages
1. Select a chat from the sidebar
2. Type your message in the input field
3. Look for the lock icon (🔒) indicating encryption is active
4. Press Enter or click the send button

### Features
- **End-to-End Encryption**: Messages are encrypted with AES and RSA
- **Real-time Updates**: Messages appear instantly for all participants
- **User Avatars**: Display user profile pictures and initials
- **Message Timestamps**: See when messages were sent
- **Encryption Indicators**: Visual feedback for encrypted messages
- **Responsive Design**: Works seamlessly on mobile and desktop
- **Loading States**: Visual feedback during operations

## Project Structure

```
src/
├── components/
│   ├── auth/          # Authentication components
│   ├── chat/          # Chat interface components
│   └── ui/            # Reusable UI components (shadcn/ui)
├── contexts/          # React contexts for state management
├── hooks/             # Custom React hooks
├── lib/               # Firebase and encryption configuration
├── types/             # TypeScript type definitions
└── App.tsx            # Main application component
```

## Technologies Used

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Firebase** - Backend services (Auth, Firestore)
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Lucide React** - Icons
- **Crypto-js** - AES encryption
- **Node-forge** - RSA key generation and encryption

## Security Features

### Encryption System
- **Hybrid Encryption**: AES for message content, RSA for key exchange
- **Key Management**: Automatic RSA key pair generation
- **End-to-End**: Server cannot decrypt messages
- **Visual Indicators**: Lock icons show encryption status

### Security Considerations
- Private keys are stored locally (demo implementation)
- Messages are encrypted before transmission
- No server-side message decryption
- Secure key exchange using RSA

## Testing

For detailed testing instructions, see [TESTING_GUIDE.md](./TESTING_GUIDE.md).

### Quick Test Setup
1. Open the app in two browser windows
2. Create accounts for both users
3. Generate encryption keys and enable encryption
4. Start a chat and send encrypted messages
5. Verify messages are properly encrypted/decrypted

## Documentation

- [Encryption Guide](./ENCRYPTION_GUIDE.md) - Detailed encryption implementation
- [Testing Guide](./TESTING_GUIDE.md) - How to test the application

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
