import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp,
  where,
  doc,
  getDoc,
  setDoc,
  getDocs
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './AuthContext';
import { useEncryption } from './EncryptionContext';
import type { Message, Chat, User } from '@/types/chat';

interface ChatContextType {
  messages: Message[];
  chats: Chat[];
  currentChat: Chat | null;
  users: User[];
  loading: boolean;
  sendMessage: (text: string) => Promise<void>;
  createChat: (participantId: string) => Promise<string>;
  setCurrentChat: (chat: Chat | null) => void;
  loadUsers: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { currentUser, userProfile } = useAuth();
  const { isEncryptionEnabled, encryptMessageForUser, decryptMessage } = useEncryption();
  const [messages, setMessages] = useState<Message[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // Load user's chats
  useEffect(() => {
    if (!currentUser) return;

    const chatsQuery = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', currentUser.uid)
    );

    const unsubscribe = onSnapshot(chatsQuery, (snapshot) => {
      const chatsData: Chat[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        chatsData.push({
          id: doc.id,
          participants: data.participants,
          lastMessage: data.lastMessage,
          lastMessageTime: data.lastMessageTime?.toDate()
        });
      });
      setChats(chatsData);
    });

    return unsubscribe;
  }, [currentUser]);

  // Load users when component mounts
  useEffect(() => {
    if (currentUser) {
      loadUsers();
    }
  }, [currentUser]);

  // Load messages for current chat
  useEffect(() => {
    if (!currentChat || !currentUser) return;

    const messagesQuery = query(
      collection(db, `chats/${currentChat.id}/messages`),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(messagesQuery, async (snapshot) => {
      const messagesData: Message[] = [];
      
      for (const doc of snapshot.docs) {
        const data = doc.data();
        let text = data.text;
        
        // Handle encrypted messages
        if (data.isEncrypted) {
          console.log('Processing encrypted message:', {
            messageId: doc.id,
            senderId: data.senderId,
            currentUserId: currentUser.uid,
            isEncryptionEnabled,
            hasEncryptedData: !!data.encryptedData,
            hasEncryptedKey: !!data.encryptedKey,
            hasIV: !!data.iv
          });
          
          // If encryption is enabled and we're the recipient, try to decrypt
          if (isEncryptionEnabled && data.senderId !== currentUser.uid) {
            try {
              const encryptedMessage = {
                encryptedData: data.encryptedData,
                encryptedKey: data.encryptedKey,
                iv: data.iv
              };
              text = await decryptMessage(encryptedMessage);
              console.log('Successfully decrypted message:', doc.id);
            } catch (error) {
              console.error('Failed to decrypt message:', doc.id, error);
              text = '[DECRYPTION FAILED]';
            }
          } else if (data.senderId === currentUser.uid) {
            // For our own encrypted messages, show a simple indicator
            text = '[Your encrypted message]';
            console.log('Showing own encrypted message:', doc.id);
          } else {
            // For encrypted messages from others when encryption is disabled
            text = '[ENCRYPTED MESSAGE]';
            console.log('Showing encrypted message placeholder:', doc.id);
          }
        }
        
        messagesData.push({
          id: doc.id,
          text,
          senderId: data.senderId,
          senderName: data.senderName,
          senderAvatar: data.senderAvatar,
          timestamp: data.timestamp.toDate(),
          isEncrypted: data.isEncrypted,
          encryptedData: data.encryptedData,
          encryptedKey: data.encryptedKey,
          iv: data.iv
        });
      }
      
      setMessages(messagesData);
    });

    return unsubscribe;
  }, [currentChat, currentUser, isEncryptionEnabled, decryptMessage]);

  const sendMessage = async (text: string) => {
    if (!currentChat || !currentUser || !userProfile) {
      throw new Error('Cannot send message: missing chat, user, or profile');
    }

    // Get the other participant in the chat
    const otherParticipantId = currentChat.participants.find(uid => uid !== currentUser.uid);
    if (!otherParticipantId) {
      throw new Error('Cannot find other participant in chat');
    }

    let messageData = {
      text,
      senderId: currentUser.uid,
      senderName: userProfile.displayName || 'Unknown',
      senderAvatar: userProfile.photoURL || '',
      timestamp: serverTimestamp(),
      isEncrypted: false
    };

    // Encrypt message if encryption is enabled
    if (isEncryptionEnabled) {
      try {
        const encryptedMessage = await encryptMessageForUser(text, otherParticipantId);
        messageData = {
          ...messageData,
          text: '[ENCRYPTED]', // Placeholder text for encrypted messages
          isEncrypted: true,
          encryptedData: encryptedMessage.encryptedData,
          encryptedKey: encryptedMessage.encryptedKey,
          iv: encryptedMessage.iv
        } as any;
      } catch (error) {
        console.error('Failed to encrypt message:', error);
        // Fall back to unencrypted message
      }
    }

    try {
      await addDoc(collection(db, `chats/${currentChat.id}/messages`), messageData);

      // Update last message in chat
      await setDoc(doc(db, 'chats', currentChat.id), {
        lastMessage: messageData,
        lastMessageTime: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const createChat = async (participantId: string): Promise<string> => {
    if (!currentUser) throw new Error('User not authenticated');

    const chatId = [currentUser.uid, participantId].sort().join('_');
    
    // Check if chat already exists
    const chatDoc = await getDoc(doc(db, 'chats', chatId));
    if (chatDoc.exists()) {
      return chatId;
    }
    
    await setDoc(doc(db, 'chats', chatId), {
      participants: [currentUser.uid, participantId],
      createdAt: serverTimestamp()
    });

    return chatId;
  };

  const loadUsers = useCallback(async () => {
    if (!currentUser) {
      return;
    }

    setLoading(true);
    try {
      // Create user document if it doesn't exist
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userSnapshot = await getDoc(userDocRef);
      
      if (!userSnapshot.exists()) {
        await setDoc(userDocRef, {
          uid: currentUser.uid,
          displayName: userProfile?.displayName || 'Unknown',
          email: currentUser.email,
          photoURL: userProfile?.photoURL || ''
        });
      }

      // Load all users and filter out current user
      const snapshot = await getDocs(collection(db, 'users'));
      const usersData: User[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        // Filter out current user
        if (data.uid !== currentUser.uid) {
          usersData.push({
            uid: data.uid,
            displayName: data.displayName || 'Unknown User',
            email: data.email || '',
            photoURL: data.photoURL || ''
          });
        }
      });
      
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
      throw error; // Re-throw to be caught by the component
    } finally {
      setLoading(false);
    }
  }, [currentUser, userProfile]);

  const value: ChatContextType = {
    messages,
    chats,
    currentChat,
    users,
    loading,
    sendMessage,
    createChat,
    setCurrentChat,
    loadUsers
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}
