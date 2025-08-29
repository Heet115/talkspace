import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, Users, MessageCircle, Shield, Bug, Settings, Sparkles, Zap, Lock } from 'lucide-react';
import { EncryptionDemo } from './EncryptionDemo';
import { EncryptionDebug } from './EncryptionDebug';
import { EncryptionSettings } from './EncryptionSettings';

export function DemoInfo() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="relative">
            <MessageCircle className="h-8 w-8 text-primary" />
            <Sparkles className="h-4 w-4 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Demo & Tools
          </h2>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore the features and test the encryption system
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Getting Started & Features */}
        <div className="space-y-6">
          {/* Getting Started Card */}
          <Card className="border-border/30 shadow-xl bg-card/80 backdrop-blur-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                Quick Start Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-background/50 rounded-lg border border-border/20">
                  <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-bold">1</span>
                  <div>
                    <p className="font-semibold text-foreground text-sm">Open Multiple Windows</p>
                    <p className="text-xs text-muted-foreground">Open this app in two different browser windows</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-background/50 rounded-lg border border-border/20">
                  <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-bold">2</span>
                  <div>
                    <p className="font-semibold text-foreground text-sm">Create Accounts</p>
                    <p className="text-xs text-muted-foreground">Sign up with different email addresses</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-background/50 rounded-lg border border-border/20">
                  <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-bold">3</span>
                  <div>
                    <p className="font-semibold text-foreground text-sm">Start Chatting</p>
                    <p className="text-xs text-muted-foreground">Use the "New Chat" button to find and start chatting</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-background/50 rounded-lg border border-border/20">
                  <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-bold">4</span>
                  <div>
                    <p className="font-semibold text-foreground text-sm">Enable Encryption</p>
                    <p className="text-xs text-muted-foreground">Enable encryption for secure messaging</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features Card */}
          <Card className="border-border/30 shadow-xl bg-card/80 backdrop-blur-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-600" />
                Key Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                <div className="bg-gradient-to-r from-green-500/10 to-green-500/5 p-4 rounded-lg border border-green-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <h4 className="font-semibold text-foreground text-sm">End-to-End Encryption</h4>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Messages encrypted with AES-256 and RSA-2048
                  </p>
                </div>
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-primary" />
                    <h4 className="font-semibold text-foreground text-sm">Real-time Chat</h4>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Instant message delivery with live updates
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Tools */}
        <div className="space-y-6">
          {/* Encryption Settings */}
          <Card className="border-border/30 shadow-xl bg-card/80 backdrop-blur-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl font-bold">
                <Settings className="h-5 w-5 text-primary" />
                Encryption Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EncryptionSettings />
            </CardContent>
          </Card>

          {/* Encryption Debug */}
          <Card className="border-border/30 shadow-xl bg-card/80 backdrop-blur-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl font-bold">
                <Bug className="h-5 w-5 text-orange-600" />
                Debug Tools
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EncryptionDebug />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Encryption Demo */}
      <Card className="border-border/30 shadow-xl bg-card/80 backdrop-blur-xl hover:shadow-2xl transition-all duration-300">
        <CardHeader className="text-center pb-4">
          <CardTitle className="flex items-center justify-center gap-2 text-xl font-bold">
            <Shield className="h-6 w-6 text-green-600" />
            Encryption Demo
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            Test the encryption system and see how it works
          </p>
        </CardHeader>
        <CardContent>
          <EncryptionDemo />
        </CardContent>
      </Card>
    </div>
  );
}
