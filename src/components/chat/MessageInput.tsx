import { useState, type KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { useChat } from '@/contexts/ChatContext';
import { useEncryption } from '@/contexts/EncryptionContext';
import { Send, Loader2, Lock } from 'lucide-react';
import { Input } from '../ui/input';

interface MessageInputProps {
  disabled?: boolean;
}

export function MessageInput({ disabled }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const { sendMessage } = useChat();
  const { isEncryptionEnabled } = useEncryption();

  const handleSend = async () => {
    if (!message.trim() || disabled || sending) return;

    setSending(true);
    try {
      await sendMessage(message.trim());
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
      // You could add a toast notification here
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-end space-x-3 p-6 border-t border-border/50 bg-card/80 backdrop-blur-sm">
      <div className="flex-1 relative">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={isEncryptionEnabled ? "Type a secure message..." : "Type a message..."}
          className="resize-none pr-12 h-12 bg-background/50 border-border/50 focus:border-ring transition-colors rounded-xl"
          disabled={disabled || sending}
        />
        {isEncryptionEnabled && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <Lock className="h-4 w-4 text-green-500" />
          </div>
        )}
      </div>
      <Button
        onClick={handleSend}
        disabled={!message.trim() || disabled || sending}
        size="icon"
        className="h-12 w-12 rounded-xl shadow-sm hover:shadow-md transition-all"
      >
        {sending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
