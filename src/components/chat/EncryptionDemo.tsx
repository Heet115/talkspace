import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEncryption } from '@/contexts/EncryptionContext';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, Lock, Unlock, Key } from 'lucide-react';

export function EncryptionDemo() {
  const { 
    hasKeys, 
    isEncryptionEnabled, 
    generateKeys, 
    toggleEncryption,
    encryptMessageForUser
  } = useEncryption();
  const { currentUser } = useAuth();
  const [demoMessage, setDemoMessage] = useState('Hello, this is a secret message!');
  const [encryptedMessage, setEncryptedMessage] = useState('');
  const [decryptedMessage, setDecryptedMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDemoEncryption = async () => {
    if (!hasKeys || !isEncryptionEnabled) {
      alert('Please generate keys and enable encryption first!');
      return;
    }

    setIsProcessing(true);
    try {
      // For demo purposes, we'll show how encryption works
      // In real usage, messages are encrypted with recipient's public key
      // and can only be decrypted with recipient's private key
      
      // Simulate encrypting a message for another user
      const encrypted = await encryptMessageForUser(demoMessage, currentUser?.uid || '');
      
      setEncryptedMessage(JSON.stringify(encrypted, null, 2));
      setDecryptedMessage('✓ Message encrypted successfully! (Only recipient can decrypt)');
    } catch (error) {
      console.error('Demo encryption failed:', error);
      setEncryptedMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setDecryptedMessage('Failed to encrypt');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Setup Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Step 1: Generate Keys */}
        <div className="bg-primary/5 p-6 rounded-xl border border-primary/20 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary/10 text-primary p-2 rounded-lg">
              <Key className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Step 1: Generate Keys</h3>
              <p className="text-sm text-muted-foreground">Create your encryption key pair</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-card/50 rounded-lg border border-border/50">
            <span className="text-sm font-medium text-foreground">
              {hasKeys ? '✓ Keys generated' : 'No keys generated'}
            </span>
            {!hasKeys && (
              <Button onClick={generateKeys} size="sm" className="bg-primary hover:bg-primary/90">
                Generate Keys
              </Button>
            )}
          </div>
        </div>

        {/* Step 2: Enable Encryption */}
        <div className="bg-green-500/5 p-6 rounded-xl border border-green-500/20 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-500/10 text-green-600 p-2 rounded-lg">
              {isEncryptionEnabled ? (
                <Lock className="h-5 w-5" />
              ) : (
                <Unlock className="h-5 w-5" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Step 2: Enable Encryption</h3>
              <p className="text-sm text-muted-foreground">Activate secure messaging</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-card/50 rounded-lg border border-border/50">
            <span className="text-sm font-medium text-foreground">
              {isEncryptionEnabled ? '✓ Encryption enabled' : 'Encryption disabled'}
            </span>
            <Button 
              onClick={() => toggleEncryption(!isEncryptionEnabled)}
              disabled={!hasKeys}
              size="sm"
              variant={isEncryptionEnabled ? "destructive" : "default"}
              className={isEncryptionEnabled ? "bg-destructive hover:bg-destructive/90" : "bg-green-600 hover:bg-green-700"}
            >
              {isEncryptionEnabled ? 'Disable' : 'Enable'}
            </Button>
          </div>
        </div>
      </div>

      {/* Step 3: Test Encryption */}
      <div className="bg-accent/30 p-6 rounded-xl border border-border/50 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-primary/10 text-primary p-2 rounded-lg">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Step 3: Test Encryption</h3>
            <p className="text-sm text-muted-foreground">Try the encryption system</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="demo-message" className="text-foreground font-medium">Original Message</Label>
            <Input
              id="demo-message"
              value={demoMessage}
              onChange={(e) => setDemoMessage(e.target.value)}
              placeholder="Enter a message to encrypt..."
              className="mt-2 bg-background/50 border-border/50 focus:border-ring transition-colors"
            />
          </div>
          
          <Button 
            onClick={handleDemoEncryption}
            disabled={!hasKeys || !isEncryptionEnabled || isProcessing}
            className="w-full bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground"
          >
            {isProcessing ? 'Processing...' : 'Encrypt Message'}
          </Button>

          {encryptedMessage && (
            <div className="space-y-2">
              <Label className="text-foreground font-medium">Encrypted Message (AES + RSA)</Label>
              <div className="p-4 bg-card/50 rounded-lg border border-border/50">
                <pre className="text-xs font-mono break-all text-muted-foreground overflow-auto max-h-32">
                  {encryptedMessage}
                </pre>
              </div>
            </div>
          )}

          {decryptedMessage && (
            <div className="space-y-2">
              <Label className="text-foreground font-medium">Result</Label>
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                  {decryptedMessage}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* How it works */}
      <div className="bg-primary/5 p-6 rounded-xl border border-primary/20 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-primary/10 text-primary p-2 rounded-lg">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">How it works:</h3>
            <p className="text-sm text-muted-foreground">Understanding the encryption process</p>
          </div>
        </div>
        <ul className="text-sm text-muted-foreground space-y-2">
          <li className="flex items-start gap-2">
            <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium mt-0.5">AES</span>
            <span><strong>Symmetric:</strong> Encrypts the actual message with a random key</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium mt-0.5">RSA</span>
            <span><strong>Asymmetric:</strong> Encrypts the AES key with recipient's public key</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium mt-0.5">Send</span>
            <span><strong>Transmission:</strong> Both encrypted message and encrypted key are sent</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium mt-0.5">Decrypt</span>
            <span><strong>Decryption:</strong> Recipient uses their private key to decrypt the AES key, then decrypts the message</span>
          </li>
        </ul>
      </div>

      {/* Important Note */}
      <div className="bg-yellow-500/5 p-6 rounded-xl border border-yellow-500/20 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-yellow-500/10 text-yellow-600 p-2 rounded-lg">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Important Note:</h3>
            <p className="text-sm text-muted-foreground">Understanding message visibility</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          In a real chat, when you send an encrypted message, you'll see "[Your encrypted message]" 
          because you can't decrypt messages you sent to others. Only the recipient can decrypt them 
          using their private key. This is true end-to-end encryption!
        </p>
      </div>
    </div>
  );
}
