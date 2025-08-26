import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEncryption } from '@/contexts/EncryptionContext';
import { Shield, Key, Lock, Unlock, AlertCircle, CheckCircle, Info } from 'lucide-react';

export function EncryptionSettings() {
  const { 
    hasKeys, 
    isEncryptionEnabled, 
    generateKeys, 
    toggleEncryption 
  } = useEncryption();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleGenerateKeys = async () => {
    setIsGenerating(true);
    try {
      await generateKeys();
    } catch (error) {
      console.error('Failed to generate keys:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleEncryption = async (enabled: boolean) => {
    setIsToggling(true);
    try {
      await toggleEncryption(enabled);
    } catch (error) {
      console.error('Failed to toggle encryption:', error);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <Card className="w-full border-border/50 bg-card/80 backdrop-blur-sm shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Shield className="h-5 w-5 text-primary" />
          Encryption Settings
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Manage your encryption keys and settings for secure messaging
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Generation */}
        <div className="space-y-3 p-4 bg-muted/20 rounded-lg border border-border/50">
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4 text-primary" />
            <Label htmlFor="keys-status" className="font-medium text-foreground">Encryption Keys</Label>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {hasKeys ? '✅ Keys generated' : '❌ No keys generated'}
            </span>
            {!hasKeys && (
              <Button 
                onClick={handleGenerateKeys} 
                disabled={isGenerating}
                size="sm"
                className="bg-primary hover:bg-primary/90"
              >
                {isGenerating ? 'Generating...' : 'Generate Keys'}
              </Button>
            )}
          </div>
        </div>

        {/* Encryption Toggle */}
        <div className="space-y-3 p-4 bg-muted/20 rounded-lg border border-border/50">
          <div className="flex items-center gap-2">
            {isEncryptionEnabled ? (
              <Lock className="h-4 w-4 text-green-600" />
            ) : (
              <Unlock className="h-4 w-4 text-muted-foreground" />
            )}
            <Label htmlFor="encryption-toggle" className="font-medium text-foreground">Enable Encryption</Label>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {isEncryptionEnabled 
                ? 'Messages will be encrypted' 
                : 'Messages will be sent in plain text'
              }
            </span>
            <Switch
              id="encryption-toggle"
              checked={isEncryptionEnabled}
              onCheckedChange={handleToggleEncryption}
              disabled={!hasKeys || isToggling}
            />
          </div>
        </div>

        {/* Status Info */}
        {!hasKeys && (
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Generate encryption keys to enable secure messaging. 
                This will create a public/private key pair for you.
              </p>
            </div>
          </div>
        )}

        {hasKeys && !isEncryptionEnabled && (
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-sm text-primary-foreground">
                Your keys are ready! Enable encryption to start sending secure messages.
              </p>
            </div>
          </div>
        )}

        {hasKeys && isEncryptionEnabled && (
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-green-700 dark:text-green-300">
                ✓ Encryption is enabled. Your messages are now being encrypted.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
