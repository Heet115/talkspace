import { useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useChat } from '@/contexts/ChatContext';
import { useAuth } from '@/contexts/AuthContext';
import type { Message } from '@/types/chat';
import { format } from 'date-fns';
import { Lock } from 'lucide-react';

interface MessageListProps {
  chatId?: string;
}

export function MessageList({ chatId: _ }: MessageListProps) {
  const { messages } = useChat();
  const { userProfile } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatMessageTime = (date: Date) => {
    return format(date, 'HH:mm');
  };

  const isOwnMessage = (message: Message) => {
    return message.senderId === userProfile?.uid;
  };

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <div className="text-muted-foreground bg-card/50 rounded-lg p-8 border border-border/50">
          <p className="text-lg font-medium mb-2 text-foreground">No messages yet</p>
          <p className="text-sm">Start the conversation by sending a message!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto p-6 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${isOwnMessage(message) ? 'justify-end' : 'justify-start'}`}
        >
          <div className={`flex items-end space-x-3 max-w-xs lg:max-w-md ${isOwnMessage(message) ? 'flex-row-reverse space-x-reverse' : ''}`}>
            {!isOwnMessage(message) && (
              <Avatar className="h-8 w-8 flex-shrink-0 ring-2 ring-primary/10">
                <AvatarImage src={message.senderAvatar} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                  {message.senderName?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            )}
            <div className={`flex flex-col ${isOwnMessage(message) ? 'items-end' : 'items-start'}`}>
              <div className={`rounded-2xl px-4 py-3 shadow-sm border ${
                isOwnMessage(message) 
                  ? 'bg-primary text-primary-foreground border-primary/20' 
                  : 'bg-card text-card-foreground border-border/50'
              }`}>
                <div className="flex items-start gap-2">
                  <p className="text-sm break-words flex-1 leading-relaxed">{message.text}</p>
                  {message.isEncrypted && (
                    <Lock className="h-3 w-3 text-green-500 flex-shrink-0 mt-1.5" />
                  )}
                </div>
              </div>
              <div className={`flex items-center mt-2 text-xs text-muted-foreground ${isOwnMessage(message) ? 'justify-end' : 'justify-start'}`}>
                {!isOwnMessage(message) && (
                  <span className="mr-2 font-medium text-foreground/70">{message.senderName}</span>
                )}
                <span>{formatMessageTime(message.timestamp)}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
