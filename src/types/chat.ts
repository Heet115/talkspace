export interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  timestamp: Date;
  // Encryption fields
  isEncrypted?: boolean;
  encryptedData?: string;
  encryptedKey?: string;
  iv?: string;
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessage?: Message;
  lastMessageTime?: Date;
}

export interface User {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  // Encryption fields
  publicKey?: string;
  hasEncryptionEnabled?: boolean;
}

// New types for encryption
export interface EncryptedMessageData {
  encryptedData: string;
  encryptedKey: string;
  iv: string;
}

export interface KeyPair {
  publicKey: string;
  privateKey: string;
}
