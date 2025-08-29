import { useState } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ChatProvider } from '@/contexts/ChatContext';
import { EncryptionProvider } from '@/contexts/EncryptionContext';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { MessageCircle, Shield, Zap } from 'lucide-react';

function AppContent() {
  const { currentUser } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/5 p-4 relative">
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-30"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-tl from-green-500/10 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Content */}
        <div className="relative z-10 w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="relative">
                <MessageCircle className="h-10 w-10 text-primary drop-shadow-lg" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full animate-pulse"></div>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                TalkSpace
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Secure messaging with end-to-end encryption
            </p>
            <div className="flex items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Shield className="h-4 w-4 text-green-600" />
                <span>Encrypted</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="h-4 w-4 text-blue-600" />
                <span>Real-time</span>
              </div>
            </div>
          </div>

          {/* Auth Forms */}
          <div className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border/30 shadow-2xl p-8">
            {isLogin ? (
              <LoginForm onSwitchToSignUp={() => setIsLogin(false)} />
            ) : (
              <SignUpForm onSwitchToLogin={() => setIsLogin(true)} />
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <div className="inline-flex items-center gap-2 bg-card/50 px-4 py-2 rounded-full border border-border/30 backdrop-blur-sm">
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

  return <ChatInterface />;
}

function App() {
  return (
    <AuthProvider>
      <EncryptionProvider>
        <ChatProvider>
          <AppContent />
        </ChatProvider>
      </EncryptionProvider>
    </AuthProvider>
  );
}

export default App;
