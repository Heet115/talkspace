import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Lock, Chrome, LogIn } from 'lucide-react';

interface LoginFormProps {
  onSwitchToSignUp: () => void;
}

export function LoginForm({ onSwitchToSignUp }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signIn, signInWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Failed to sign in'); 
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      await signInWithGoogle();
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <CardHeader className="space-y-4 pb-8">
        <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
          <LogIn className="h-6 w-6 text-primary" />
          Welcome back
        </CardTitle>
        <CardDescription className="text-center text-base text-muted-foreground">
          Sign in to your TalkSpace account to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-3">
            <Label htmlFor="email" className="text-sm font-semibold">Email address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-12 bg-background/50 border-border/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                required
              />
            </div>
          </div>
          <div className="space-y-3">
            <Label htmlFor="password" className="text-sm font-semibold">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 h-12 bg-background/50 border-border/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                required
              />
            </div>
          </div>
          {error && (
            <div className="text-sm text-destructive text-center bg-destructive/10 rounded-xl p-4 border border-destructive/20">
              {error}
            </div>
          )}
          <Button 
            type="submit" 
            className="w-full h-12 font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary transition-all duration-200 shadow-lg hover:shadow-xl" 
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-4 text-muted-foreground font-medium">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          type="button"
          className="w-full h-12 font-semibold border-border/30 hover:bg-accent/50 hover:border-border/50 transition-all duration-200"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          <Chrome className="mr-2 h-4 w-4" />
          Sign in with Google
        </Button>

        <div className="text-center text-sm pt-2">
          <span className="text-muted-foreground">Don't have an account? </span>
          <button
            type="button"
            onClick={onSwitchToSignUp}
            className="text-primary hover:text-primary/80 underline-offset-4 hover:underline font-semibold transition-colors"
          >
            Sign up
          </button>
        </div>
      </CardContent>
    </div>
  );
}
