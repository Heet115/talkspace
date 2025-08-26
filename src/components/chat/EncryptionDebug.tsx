import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEncryption } from '@/contexts/EncryptionContext';
import { useAuth } from '@/contexts/AuthContext';
import { Bug, Play, Key, Shield } from 'lucide-react';

export function EncryptionDebug() {
  const { 
    hasKeys, 
    isEncryptionEnabled, 
    generateKeys, 
    toggleEncryption,
    encryptMessageForUser,
    decryptMessage,
    getPublicKey
  } = useEncryption();
  const { currentUser } = useAuth();
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);

  const runDebugTest = async () => {
    if (!currentUser) {
      setDebugInfo('No current user');
      return;
    }

    setIsRunning(true);
    let info = `🔍 Debug Info for User: ${currentUser.uid}\n\n`;
    
    try {
      // Test 1: Check if user has keys
      info += `1. Has Keys: ${hasKeys ? '✅ Yes' : '❌ No'}\n`;
      info += `2. Encryption Enabled: ${isEncryptionEnabled ? '✅ Yes' : '❌ No'}\n\n`;

      // Test 2: Check if user has public key in database
      const publicKey = await getPublicKey(currentUser.uid);
      info += `3. Public Key in DB: ${publicKey ? '✅ Found' : '❌ Not Found'}\n`;
      if (publicKey) {
        info += `   Key Length: ${publicKey.length} characters\n`;
      }

      // Test 3: Try to encrypt a test message
      if (hasKeys && isEncryptionEnabled) {
        try {
          const testMessage = 'Test message for debugging';
          const encrypted = await encryptMessageForUser(testMessage, currentUser.uid);
          info += `4. Encryption Test: ✅ SUCCESS\n`;
          info += `   Encrypted Data Length: ${encrypted.encryptedData.length}\n`;
          info += `   Encrypted Key Length: ${encrypted.encryptedKey.length}\n`;
          info += `   IV Length: ${encrypted.iv.length}\n`;

          // Test 4: Try to decrypt the message (should work since we encrypted for ourselves)
          const decrypted = await decryptMessage(encrypted);
          info += `5. Decryption Test: ${decrypted === testMessage ? '✅ SUCCESS' : '❌ FAILED'}\n`;
          info += `   Decrypted: "${decrypted}"\n`;
          info += `   Note: This works because we encrypted for our own public key\n`;
        } catch (error) {
          info += `4. Encryption Test: ❌ FAILED\n`;
          info += `   Error: ${error instanceof Error ? error.message : 'Unknown error'}\n`;
        }
      } else {
        info += `4. Encryption Test: ⏭️ SKIPPED (no keys or encryption disabled)\n`;
      }

    } catch (error) {
      info += `❌ Error during debug: ${error instanceof Error ? error.message : 'Unknown error'}\n`;
    }

    setDebugInfo(info);
    setIsRunning(false);
  };

  return (
    <Card className="w-full border-border/50 bg-card/80 backdrop-blur-sm shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Bug className="h-5 w-5 text-orange-600" />
          Encryption Debug
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Debug encryption/decryption issues and test functionality
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          <Button 
            onClick={runDebugTest} 
            variant="outline" 
            disabled={isRunning}
            className="border-border/50 hover:bg-accent/50"
          >
            <Play className="h-4 w-4 mr-2" />
            {isRunning ? 'Running...' : 'Run Debug Test'}
          </Button>
          {!hasKeys && (
            <Button onClick={generateKeys} size="sm" className="bg-primary hover:bg-primary/90">
              <Key className="h-4 w-4 mr-2" />
              Generate Keys
            </Button>
          )}
          {hasKeys && !isEncryptionEnabled && (
            <Button onClick={() => toggleEncryption(true)} size="sm" className="bg-green-600 hover:bg-green-700">
              <Shield className="h-4 w-4 mr-2" />
              Enable Encryption
            </Button>
          )}
        </div>

        {debugInfo && (
          <div className="p-4 bg-muted/30 border border-border/50 rounded-lg">
            <pre className="text-sm whitespace-pre-wrap font-mono text-muted-foreground leading-relaxed">{debugInfo}</pre>
          </div>
        )}

        <div className="text-sm text-muted-foreground bg-accent/20 p-4 rounded-lg border border-border/50">
          <p className="font-medium text-foreground mb-2">This debug tool will help identify issues with:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Key generation and storage</li>
            <li>Public key retrieval</li>
            <li>Message encryption</li>
            <li>Message decryption</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
