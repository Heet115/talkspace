import { useState } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ChatProvider } from '@/contexts/ChatContext';
import { EncryptionProvider } from '@/contexts/EncryptionContext';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { ChatInterface } from '@/components/chat/ChatInterface';

function AppContent() {
  const { currentUser } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
        {isLogin ? (
          <LoginForm onSwitchToSignUp={() => setIsLogin(false)} />
        ) : (
          <SignUpForm onSwitchToLogin={() => setIsLogin(true)} />
        )}
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
