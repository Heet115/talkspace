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
import { ArrowLeft, LogOut, Settings } from "lucide-react";

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
    <div className="h-screen flex bg-background">
      {/* Sidebar */}
      <div className="w-80 border-r border-border/50 bg-card/50 backdrop-blur-sm flex flex-col shadow-lg">
        {/* Header */}
        <div className="p-6 border-b border-border/50 bg-card/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10 ring-2 ring-primary/10">
                <AvatarImage src={userProfile?.photoURL || ""} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {userProfile?.displayName?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold text-sm text-foreground">
                  {userProfile?.displayName}
                </h2>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Online {isEncryptionEnabled && "• Encrypted"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowEncryptionSettings(true)}
                title="Encryption Settings"
                className="hover:bg-accent/50"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout} className="hover:bg-destructive/10 hover:text-destructive">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="mt-4">
            <NewChatDialog />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto p-4 bg-background/30">
          <ChatList onChatSelect={handleChatSelect} />
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-background">
        {currentChat ? (
          <>
            {/* Chat Header */}
            <div className="p-6 border-b border-border/50 bg-card/80 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBackToChats}
                  className="md:hidden hover:bg-accent/50"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Avatar className="h-10 w-10 ring-2 ring-primary/10">
                  <AvatarImage src={currentParticipant?.photoURL || ""} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {currentParticipant?.displayName?.charAt(0).toUpperCase() ||
                      getOtherParticipant(currentChat).charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {currentParticipant?.displayName ||
                      getOtherParticipant(currentChat)}
                  </h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Active now
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-hidden bg-gradient-to-b from-background to-muted/20">
              <MessageList chatId={currentChat.id} />
            </div>

            {/* Message Input */}
            <MessageInput />
          </>
        ) : (
          /* Welcome Screen */
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
            <DemoInfo />
          </div>
        )}
      </div>

      {/* Encryption Settings Modal */}
      {showEncryptionSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg p-6 max-w-md w-full shadow-2xl border border-border/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Encryption Settings</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowEncryptionSettings(false)}
                className="hover:bg-accent/50"
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
