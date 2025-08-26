import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './AuthContext';
import { 
  generateKeyPair, 
  encryptMessage, 
  decryptMessage, 
  keyToBase64, 
  keyFromBase64,
  type EncryptedMessage
} from '@/lib/encryption';

interface EncryptionContextType {
  hasKeys: boolean;
  isEncryptionEnabled: boolean;
  generateKeys: () => Promise<void>;
  encryptMessageForUser: (message: string, recipientUserId: string) => Promise<EncryptedMessage>;
  decryptMessage: (encryptedMessage: EncryptedMessage) => Promise<string>;
  toggleEncryption: (enabled: boolean) => Promise<void>;
  getPublicKey: (userId: string) => Promise<string | null>;
}

const EncryptionContext = createContext<EncryptionContextType | undefined>(undefined);

export function useEncryption() {
  const context = useContext(EncryptionContext);
  if (context === undefined) {
    throw new Error('useEncryption must be used within an EncryptionProvider');
  }
  return context;
}

export function EncryptionProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const [hasKeys, setHasKeys] = useState(false);
  const [isEncryptionEnabled, setIsEncryptionEnabled] = useState(false);
  const [privateKey, setPrivateKey] = useState<string | null>(null);

  // Load user's encryption keys on mount
  useEffect(() => {
    if (!currentUser) return;

    const loadKeys = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          const hasEncryptionEnabled = data.hasEncryptionEnabled || false;
          setIsEncryptionEnabled(hasEncryptionEnabled);

          if (hasEncryptionEnabled && data.privateKey) {
            // In a real app, you'd want to decrypt this with a user password
            // For demo purposes, we'll store it in base64
            setPrivateKey(keyFromBase64(data.privateKey));
            setHasKeys(true);
          }
        }
      } catch (error) {
        console.error('Error loading encryption keys:', error);
      }
    };

    loadKeys();
  }, [currentUser]);

  const generateKeys = useCallback(async () => {
    if (!currentUser) throw new Error('User not authenticated');

    try {
      const keyPair = generateKeyPair();
      
      // Store keys in Firestore (in production, encrypt private key with user password)
      await updateDoc(doc(db, 'users', currentUser.uid), {
        publicKey: keyPair.publicKey,
        privateKey: keyToBase64(keyPair.privateKey), // Store in base64
        hasEncryptionEnabled: true
      });

      setPrivateKey(keyPair.privateKey);
      setHasKeys(true);
      setIsEncryptionEnabled(true);
    } catch (error) {
      console.error('Error generating keys:', error);
      throw error;
    }
  }, [currentUser]);

  const getPublicKey = useCallback(async (userId: string): Promise<string | null> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const data = userDoc.data();
        return data.publicKey || null;
      }
      return null;
    } catch (error) {
      console.error('Error getting public key:', error);
      return null;
    }
  }, []);

  const encryptMessageForUser = useCallback(async (message: string, recipientUserId: string): Promise<EncryptedMessage> => {
    if (!isEncryptionEnabled) {
      throw new Error('Encryption is not enabled');
    }

    const recipientPublicKey = await getPublicKey(recipientUserId);
    if (!recipientPublicKey) {
      throw new Error('Recipient does not have encryption enabled');
    }

    return encryptMessage(message, recipientPublicKey);
  }, [isEncryptionEnabled, getPublicKey]);

  const decryptMessageWithPrivateKey = useCallback(async (encryptedMessage: EncryptedMessage): Promise<string> => {
    if (!privateKey) {
      throw new Error('Private key not available');
    }

    return decryptMessage(encryptedMessage, privateKey);
  }, [privateKey]);

  const toggleEncryption = useCallback(async (enabled: boolean) => {
    if (!currentUser) throw new Error('User not authenticated');

    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        hasEncryptionEnabled: enabled
      });
      setIsEncryptionEnabled(enabled);
    } catch (error) {
      console.error('Error toggling encryption:', error);
      throw error;
    }
  }, [currentUser]);

  const value: EncryptionContextType = {
    hasKeys,
    isEncryptionEnabled,
    generateKeys,
    encryptMessageForUser,
    decryptMessage: decryptMessageWithPrivateKey,
    toggleEncryption,
    getPublicKey
  };

  return (
    <EncryptionContext.Provider value={value}>
      {children}
    </EncryptionContext.Provider>
  );
}
