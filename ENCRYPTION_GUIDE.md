# Secure Messaging with AES + RSA Encryption

This web app now includes end-to-end encryption for secure messaging using a hybrid encryption approach:

## How It Works

### 1. **Hybrid Encryption System**
- **AES (Symmetric Encryption)**: Used to encrypt the actual message content
- **RSA (Asymmetric Encryption)**: Used to securely exchange the AES key

### 2. **Encryption Process**
1. When a user sends a message:
   - A random AES key is generated
   - The message is encrypted with AES using this key
   - The AES key is encrypted with the recipient's RSA public key
   - Both the encrypted message and encrypted key are sent

2. When a user receives a message:
   - Their RSA private key decrypts the AES key
   - The decrypted AES key decrypts the message content

### 3. **Key Management**
- Each user generates a public/private key pair
- Public keys are stored in the database and shared with other users
- Private keys are stored locally (in production, should be encrypted with user password)

## Features

### 🔐 **Encryption Settings**
- Generate RSA key pairs (2048-bit)
- Enable/disable encryption per user
- Visual indicators for encrypted messages

### 🛡️ **Security Features**
- End-to-end encryption
- No server-side message decryption
- Secure key exchange using RSA
- Message integrity verification

### 📱 **User Interface**
- Encryption status indicators
- Lock icons on encrypted messages
- Settings panel for key management
- Demo mode to test encryption

## Getting Started

### 1. **Generate Encryption Keys**
1. Click the settings icon (⚙️) in the top-right corner
2. Click "Generate Keys" to create your RSA key pair
3. Wait for key generation to complete

### 2. **Enable Encryption**
1. Toggle the "Enable Encryption" switch
2. Your messages will now be encrypted before sending

### 3. **Send Encrypted Messages**
1. Type your message in the input field
2. Look for the lock icon (🔒) indicating encryption is active
3. Send your message - it will be automatically encrypted

### 4. **Receive Encrypted Messages**
1. Encrypted messages show a lock icon
2. Messages are automatically decrypted using your private key
3. If decryption fails, you'll see "[DECRYPTION FAILED]"

## Technical Details

### **Dependencies**
- `crypto-js`: For AES encryption/decryption
- `node-forge`: For RSA key generation and encryption

### **Key Components**
- `EncryptionContext`: Manages encryption state and keys
- `encryption.ts`: Core encryption/decryption functions
- `EncryptionSettings`: UI for key management
- `EncryptionDemo`: Interactive demo of the encryption system

### **Database Schema Updates**
Messages now include encryption fields:
```typescript
interface Message {
  // ... existing fields
  isEncrypted?: boolean;
  encryptedData?: string;
  encryptedKey?: string;
  iv?: string;
}
```

Users now include encryption fields:
```typescript
interface User {
  // ... existing fields
  publicKey?: string;
  hasEncryptionEnabled?: boolean;
}
```

## Security Considerations

### **Current Implementation**
- Private keys are stored in base64 format (demo purposes)
- No password protection for private keys
- Keys are stored in Firestore

### **Production Recommendations**
- Encrypt private keys with user passwords
- Use secure key storage (e.g., browser's secure storage)
- Implement key rotation
- Add message signing for authenticity
- Use stronger key sizes (4096-bit RSA)

## Demo Mode

The app includes a demo mode that shows:
- Key generation process
- Encryption/decryption workflow
- Visual indicators for encrypted content
- Step-by-step explanation of the hybrid encryption system

## Troubleshooting

### **Common Issues**
1. **"Recipient does not have encryption enabled"**
   - The recipient needs to generate keys and enable encryption

2. **"[DECRYPTION FAILED]"**
   - Keys may be corrupted or missing
   - Try regenerating keys

3. **Messages not encrypting**
   - Check that encryption is enabled in settings
   - Verify keys are generated

### **Testing**
1. Open the app in two browser windows
2. Create accounts for both users
3. Generate keys and enable encryption for both
4. Start a chat and send encrypted messages
5. Verify messages are properly encrypted/decrypted

## Future Enhancements

- [ ] Password-protected private keys
- [ ] Key rotation and management
- [ ] Message signing and verification
- [ ] Perfect forward secrecy
- [ ] Group chat encryption
- [ ] File encryption support
