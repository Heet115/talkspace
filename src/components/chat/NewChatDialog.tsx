import { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { useChat } from '@/contexts/ChatContext';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Search, Loader2, AlertCircle, Users } from 'lucide-react';
import type { User } from '@/types/chat';

export function NewChatDialog() {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const { users, loading, loadUsers, createChat, setCurrentChat } = useChat();
  const { userProfile } = useAuth();

  // Memoized filtered users for better performance
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) {
      return users;
    }

    const searchLower = searchTerm.toLowerCase().trim();
    return users.filter(user => {
      const nameMatch = user.displayName?.toLowerCase().includes(searchLower);
      const emailMatch = user.email?.toLowerCase().includes(searchLower);
      return nameMatch || emailMatch;
    });
  }, [users, searchTerm]);

  useEffect(() => {
    if (open) {
      setError(null);
      setSearchTerm(''); // Reset search when dialog opens
      loadUsers().catch(err => {
        console.error('Failed to load users:', err);
        setError('Failed to load users. Please try again.');
      });
    }
  }, [open, loadUsers]);

  // Debounced search effect
  useEffect(() => {
    if (!open) return;
    
    setIsSearching(true);
    const timer = setTimeout(() => {
      setIsSearching(false);
    }, 300); // 300ms delay

    return () => {
      clearTimeout(timer);
      setIsSearching(false);
    };
  }, [searchTerm, open]);

  const handleUserSelect = async (user: User) => {
    try {
      const chatId = await createChat(user.uid);
      
      // Find the created chat and set it as current
      const newChat = {
        id: chatId,
        participants: [userProfile?.uid || '', user.uid],
        lastMessage: undefined,
        lastMessageTime: undefined
      };
      
      setCurrentChat(newChat);
      setOpen(false);
      setSearchTerm('');
    } catch (error) {
      console.error('Failed to create chat:', error);
      setError('Failed to create chat. Please try again.');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full h-11 font-medium shadow-sm hover:shadow-md transition-all">
          <Plus className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md border-border/50 bg-card/95 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">Start a new conversation</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
          
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${isSearching ? 'text-primary' : 'text-muted-foreground'}`} />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={handleSearchChange}
              className={`pl-10 pr-8 h-11 bg-background/50 border-border/50 focus:border-ring transition-colors ${isSearching ? 'border-primary' : ''}`}
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-accent/50"
              >
                ×
              </Button>
            )}
            {isSearching && (
              <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              </div>
            )}
          </div>
          
          <div className="max-h-60 overflow-y-auto space-y-2">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="ml-2 text-sm text-muted-foreground">Loading users...</span>
              </div>
            ) : isSearching ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="ml-2 text-sm text-muted-foreground">Searching...</span>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-lg border border-border/50">
                <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="font-medium text-foreground">No users found</p>
                <p className="text-xs mt-1">
                  Open this app in another browser window and create a different account to start chatting.
                </p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-lg border border-border/50">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="font-medium text-foreground">No users found</p>
                <p className="text-xs mt-1">
                  Try a different search term or check your spelling.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearSearch}
                  className="mt-2 border-border/50 hover:bg-accent/50"
                >
                  Clear search
                </Button>
              </div>
            ) : (
              <>
                {searchTerm && (
                  <div className="text-xs text-muted-foreground px-2 py-1 bg-muted/30 rounded-md">
                    Found {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} 
                    {users.length !== filteredUsers.length && ` (of ${users.length} total)`}
                  </div>
                )}
                {filteredUsers.map((user) => (
                  <div
                    key={user.uid}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 cursor-pointer transition-all duration-200 group border border-transparent hover:border-border/50"
                    onClick={() => handleUserSelect(user)}
                  >
                    <Avatar className="h-10 w-10 ring-2 ring-primary/10 group-hover:ring-primary/20 transition-all">
                      <AvatarImage src={user.photoURL} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {user.displayName?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate text-foreground group-hover:text-primary transition-colors">{user.displayName}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 hover:bg-primary/10">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
