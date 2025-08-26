import CryptoJS from 'crypto-js';
import forge from 'node-forge';

// Types for encryption
export interface EncryptedMessage {
  encryptedData: string;
  encryptedKey: string;
  iv: string;
}

export interface KeyPair {
  publicKey: string;
  privateKey: string;
}

// Generate RSA key pair
export function generateKeyPair(): KeyPair {
  const keys = forge.pki.rsa.generateKeyPair({ bits: 2048 });
  
  return {
    publicKey: forge.pki.publicKeyToPem(keys.publicKey),
    privateKey: forge.pki.privateKeyToPem(keys.privateKey)
  };
}

// Generate AES key
export function generateAESKey(): string {
  return CryptoJS.lib.WordArray.random(32).toString();
}

// Encrypt message with AES
export function encryptWithAES(message: string, key: string): { encryptedData: string; iv: string } {
  const iv = CryptoJS.lib.WordArray.random(16);
  const encrypted = CryptoJS.AES.encrypt(message, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  
  return {
    encryptedData: encrypted.toString(),
    iv: iv.toString()
  };
}

// Decrypt message with AES
export function decryptWithAES(encryptedData: string, key: string, iv: string): string {
  const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
    iv: CryptoJS.enc.Hex.parse(iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  
  return decrypted.toString(CryptoJS.enc.Utf8);
}

// Encrypt AES key with RSA public key
export function encryptAESKeyWithRSA(aesKey: string, publicKeyPem: string): string {
  const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
  const encrypted = publicKey.encrypt(aesKey, 'RSAES-PKCS1-V1_5');
  return forge.util.encode64(encrypted);
}

// Decrypt AES key with RSA private key
export function decryptAESKeyWithRSA(encryptedAESKey: string, privateKeyPem: string): string {
  const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
  const encrypted = forge.util.decode64(encryptedAESKey);
  const decrypted = privateKey.decrypt(encrypted, 'RSAES-PKCS1-V1_5');
  return decrypted;
}

// Full encryption process: encrypt message with AES, then encrypt AES key with RSA
export function encryptMessage(message: string, recipientPublicKey: string): EncryptedMessage {
  // Generate AES key
  const aesKey = generateAESKey();
  
  // Encrypt message with AES
  const { encryptedData, iv } = encryptWithAES(message, aesKey);
  
  // Encrypt AES key with recipient's RSA public key
  const encryptedKey = encryptAESKeyWithRSA(aesKey, recipientPublicKey);
  
  return {
    encryptedData,
    encryptedKey,
    iv
  };
}

// Full decryption process: decrypt AES key with RSA, then decrypt message with AES
export function decryptMessage(encryptedMessage: EncryptedMessage, privateKey: string): string {
  // Decrypt AES key with RSA private key
  const aesKey = decryptAESKeyWithRSA(encryptedMessage.encryptedKey, privateKey);
  
  // Decrypt message with AES key
  const decryptedMessage = decryptWithAES(encryptedMessage.encryptedData, aesKey, encryptedMessage.iv);
  
  return decryptedMessage;
}

// Validate if a string is a valid PEM format
export function isValidPEM(pem: string): boolean {
  try {
    return pem.includes('-----BEGIN') && pem.includes('-----END');
  } catch {
    return false;
  }
}

// Convert key to base64 for storage
export function keyToBase64(key: string): string {
  return btoa(key);
}

// Convert key from base64 for usage
export function keyFromBase64(base64Key: string): string {
  return atob(base64Key);
}
