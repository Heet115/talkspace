import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, Users, MessageCircle, Shield, Bug, Settings } from 'lucide-react';
import { EncryptionDemo } from './EncryptionDemo';
import { EncryptionDebug } from './EncryptionDebug';
import { EncryptionSettings } from './EncryptionSettings';

export function DemoInfo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <MessageCircle className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              TalkSpace
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Secure real-time messaging with end-to-end encryption
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Welcome & Getting Started */}
          <div className="space-y-6">
            {/* Welcome Card */}
            <Card className="border-border/50 shadow-xl bg-card/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                  <MessageCircle className="h-6 w-6 text-primary" />
                  Welcome to Secure Messaging
                </CardTitle>
                <p className="text-muted-foreground">
                  Experience real-time chat with military-grade encryption
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Getting Started */}
                <div className="bg-muted/30 p-6 rounded-xl border border-border/50">
                  <div className="flex items-start gap-3">
                    <Info className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div className="space-y-3">
                      <h3 className="font-semibold text-foreground text-lg">
                        Getting Started
                      </h3>
                      <ol className="text-muted-foreground space-y-2 list-decimal list-inside">
                        <li className="flex items-center gap-2">
                          <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">Step 1</span>
                          Open this app in two different browser windows
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">Step 2</span>
                          Sign up with different email addresses
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">Step 3</span>
                          Use the "New Chat" button to find and start chatting
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">Step 4</span>
                          Enable encryption for secure messaging
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-5 w-5 text-green-600" />
                      <h4 className="font-semibold text-foreground">End-to-End Encryption</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Messages are encrypted with AES-256 and RSA-2048
                    </p>
                  </div>
                  <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-5 w-5 text-primary" />
                      <h4 className="font-semibold text-foreground">Real-time Chat</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Instant message delivery with live updates
                    </p>
                  </div>
                </div>

                {/* Ready to Start */}
                <div className="text-center bg-accent/30 p-6 rounded-xl border border-border/50">
                  <h3 className="font-semibold text-foreground mb-2">
                    Ready to start chatting?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create multiple accounts to test the secure messaging features
                  </p>
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>Multi-user testing recommended</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Encryption Tools */}
          <div className="space-y-6">
            {/* Encryption Settings */}
            <Card className="border-border/50 shadow-xl bg-card/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  Encryption Settings
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Configure your encryption keys and settings
                </p>
              </CardHeader>
              <CardContent>
                <EncryptionSettings />
              </CardContent>
            </Card>

            {/* Encryption Debug */}
            <Card className="border-border/50 shadow-xl bg-card/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Bug className="h-5 w-5 text-orange-600" />
                  Debug Tools
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Troubleshoot encryption issues and test functionality
                </p>
              </CardHeader>
              <CardContent>
                <EncryptionDebug />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Full Width Encryption Demo */}
        <Card className="border-border/50 shadow-xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center gap-2">
              <Shield className="h-6 w-6 text-green-600" />
              Encryption Demo
            </CardTitle>
            <p className="text-muted-foreground">
              Test the encryption system and see how it works
            </p>
          </CardHeader>
          <CardContent>
            <EncryptionDemo />
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2 bg-card/50 px-6 py-3 rounded-full border border-border/50">
            <Shield className="h-4 w-4 text-green-600" />
            <span className="text-sm text-muted-foreground">
              Built with React, TypeScript, and Firebase
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
