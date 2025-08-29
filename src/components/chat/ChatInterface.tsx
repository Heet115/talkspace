import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChatList } from "./ChatList";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { NewChatDialog } from "./NewChatDialog";
import { DemoInfo } from "./DemoInfo";
import { EncryptionSettings } from "./EncryptionSettings";
import { useChat } from "@/contexts/ChatContext";
import { useAuth } from "@/contexts/AuthContext";
import { useEncryption } from "@/contexts/EncryptionContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Chat, User } from "@/types/chat";
import { ArrowLeft, LogOut, Settings, Shield, MessageCircle, Users, Sparkles } from "lucide-react";

export function ChatInterface() {
  const { currentChat, setCurrentChat } = useChat();
  const { userProfile, logout } = useAuth();
  const { isEncryptionEnabled } = useEncryption();
  const [currentParticipant, setCurrentParticipant] = useState<User | null>(
    null
  );
  const [showEncryptionSettings, setShowEncryptionSettings] = useState(false);

  const handleChatSelect = (chat: Chat) => {
    setCurrentChat(chat);
  };

  const handleBackToChats = () => {
    setCurrentChat(null);
    setCurrentParticipant(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const getOtherParticipant = (chat: Chat) => {
    return chat.participants.find((uid) => uid !== userProfile?.uid) || "";
  };

  // Load current participant details
  useEffect(() => {
    const loadParticipantDetails = async () => {
      if (!currentChat) {
        setCurrentParticipant(null);
        return;
      }

      const otherParticipantId = getOtherParticipant(currentChat);
      if (otherParticipantId) {
        try {
          const userDoc = await getDoc(doc(db, "users", otherParticipantId));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setCurrentParticipant({
              uid: data.uid,
              displayName: data.displayName,
              email: data.email,
              photoURL: data.photoURL,
            });
          }
        } catch (error) {
          console.error("Error loading participant details:", error);
        }
      }
    };

    loadParticipantDetails();
  }, [currentChat, userProfile?.uid]);

  return (
    <div className="h-screen flex bg-gradient-to-br from-background via-background to-muted/5 overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 border-r border-border/20 bg-card/60 backdrop-blur-xl flex flex-col shadow-2xl relative">
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5 opacity-50"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl"></div>
        
        {/* Header */}
        <div className="p-6 border-b border-border/20 bg-card/80 backdrop-blur-xl relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12 ring-2 ring-primary/20 shadow-lg">
                <AvatarImage src={userProfile?.photoURL || ""} />
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold text-lg">
                  {userProfile?.displayName?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-bold text-foreground text-base">
                  {userProfile?.displayName}
                </h2>
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Online
                  {isEncryptionEnabled && (
                    <span className="flex items-center gap-1 text-green-600">
                      <Shield className="h-3 w-3" />
                      Encrypted
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowEncryptionSettings(true)}
                title="Encryption Settings"
                className="hover:bg-accent/50 hover:scale-105 transition-all duration-200"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleLogout} 
                className="hover:bg-destructive/10 hover:text-destructive hover:scale-105 transition-all duration-200"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="mt-6">
            <NewChatDialog />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto p-4 bg-transparent relative z-10">
          <ChatList onChatSelect={handleChatSelect} />
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-background relative">
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-30"></div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl"></div>
        
        {currentChat ? (
          <>
            {/* Chat Header */}
            <div className="p-6 border-b border-border/20 bg-card/80 backdrop-blur-xl relative z-10">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBackToChats}
                  className="md:hidden hover:bg-accent/50 hover:scale-105 transition-all duration-200"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Avatar className="h-12 w-12 ring-2 ring-primary/20 shadow-lg">
                  <AvatarImage src={currentParticipant?.photoURL || ""} />
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold text-lg">
                    {currentParticipant?.displayName?.charAt(0).toUpperCase() ||
                      getOtherParticipant(currentChat).charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-foreground text-lg">
                    {currentParticipant?.displayName ||
                      getOtherParticipant(currentChat)}
                  </h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Active now
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-hidden bg-gradient-to-b from-background via-background to-muted/10 relative z-10">
              <MessageList chatId={currentChat.id} />
            </div>

            {/* Message Input */}
            <div className="relative z-10">
              <MessageInput />
            </div>
          </>
        ) : (
          /* Welcome Screen with Placeholder and Demo Components */
          <div className="flex-1 flex flex-col relative z-10 overflow-y-auto">
            {/* Placeholder Section */}
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center space-y-6 max-w-md">
                <div className="relative">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center mb-6">
                    <MessageCircle className="h-12 w-12 text-primary" />
                  </div>
                  <Sparkles className="h-6 w-6 text-yellow-500 absolute -top-2 -right-2 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-3">
                    Welcome to TalkSpace
                  </h2>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Select a chat from the sidebar to start messaging, or create a new conversation to begin your secure communication journey.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span>End-to-End Encrypted</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span>Real-time Chat</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Demo Components Section */}
            <div className="border-t border-border/20 bg-card/30 backdrop-blur-sm">
              <div className="p-6">
                <DemoInfo />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Encryption Settings Modal */}
      {showEncryptionSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-card rounded-xl p-6 max-w-md w-full shadow-2xl border border-border/50 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Encryption Settings
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowEncryptionSettings(false)}
                className="hover:bg-accent/50 hover:scale-105 transition-all duration-200"
              >
                ×
              </Button>
            </div>
            <EncryptionSettings />
          </div>
        </div>
      )}
    </div>
  );
}
