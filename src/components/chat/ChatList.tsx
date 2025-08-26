import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useChat } from '@/contexts/ChatContext';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Chat, User } from '@/types/chat';
import { MessageCircle, Clock } from 'lucide-react';

interface ChatListProps {
  onChatSelect: (chat: Chat) => void;
}

export function ChatList({ onChatSelect }: ChatListProps) {
  const { chats } = useChat();
  const { userProfile } = useAuth();
  const [participantDetails, setParticipantDetails] = useState<Record<string, User>>({});

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getOtherParticipant = (chat: Chat) => {
    return chat.participants.find(uid => uid !== userProfile?.uid) || '';
  };

  // Load participant details
  useEffect(() => {
    const loadParticipantDetails = async () => {
      const details: Record<string, User> = {};
      
      for (const chat of chats) {
        const otherParticipantId = getOtherParticipant(chat);
        if (otherParticipantId && !details[otherParticipantId]) {
          try {
            const userDoc = await getDoc(doc(db, 'users', otherParticipantId));
            if (userDoc.exists()) {
              const data = userDoc.data();
              details[otherParticipantId] = {
                uid: data.uid,
                displayName: data.displayName,
                email: data.email,
                photoURL: data.photoURL
              };
            }
          } catch (error) {
            console.error('Error loading participant details:', error);
          }
        }
      }
      
      setParticipantDetails(details);
    };

    if (chats.length > 0) {
      loadParticipantDetails();
    }
  }, [chats, userProfile?.uid]);

  if (chats.length === 0) {
    return (
      <Card className="h-full border-border/50 bg-card/50">
        <CardContent className="flex flex-col items-center justify-center h-full text-center p-8">
          <div className="bg-muted/50 rounded-full p-4 mb-4">
            <MessageCircle className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2 text-foreground">No conversations yet</h3>
          <p className="text-sm text-muted-foreground">
            Start a new chat to begin messaging
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {chats.map((chat) => (
        <Card
          key={chat.id}
          className="cursor-pointer py-0 border-border/50 bg-card/50 hover:bg-card hover:shadow-md transition-all duration-200 group"
          onClick={() => onChatSelect(chat)}
        >
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12 ring-2 ring-primary/10 group-hover:ring-primary/20 transition-all">
                <AvatarImage src={participantDetails[getOtherParticipant(chat)]?.photoURL || ''} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {participantDetails[getOtherParticipant(chat)]?.displayName?.charAt(0).toUpperCase() || 
                   getOtherParticipant(chat).charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold truncate text-foreground group-hover:text-primary transition-colors">
                    {participantDetails[getOtherParticipant(chat)]?.displayName || getOtherParticipant(chat)}
                  </h4>
                  {chat.lastMessageTime && (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatTime(chat.lastMessageTime)}
                    </div>
                  )}
                </div>
                {chat.lastMessage && (
                  <p className="text-xs text-muted-foreground truncate mt-1">
                    {chat.lastMessage.senderId === userProfile?.uid ? 'You: ' : ''}
                    {chat.lastMessage.text}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
