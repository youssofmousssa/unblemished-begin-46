import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LogOut, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import md5 from 'md5';

interface UserProfileProps {
  variant?: 'mobile' | 'desktop';
}

const UserProfile: React.FC<UserProfileProps> = ({ variant = 'desktop' }) => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsDropdownOpen(false);
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error signing out",
        description: "There was an issue signing you out. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!currentUser) return null;

  // Get user avatar with priority: auth provider photo → Gravatar for email users → default
  const getAvatarUrl = () => {
    // Priority 1: Use photoURL from auth provider (Google, etc.)
    if (currentUser.photoURL) {
      return currentUser.photoURL;
    }
    
    // Priority 2: Use Gravatar for email users
    if (currentUser.email) {
      const hash = md5(currentUser.email.trim().toLowerCase());
      return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=200`;
    }
    
    // Fallback: Generate random avatar
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`;
  };
  
  const avatarUrl = getAvatarUrl();

  // Mobile version - compact horizontal layout
  if (variant === 'mobile') {
    return (
      <div className="flex items-center justify-between w-full p-3 rounded-lg bg-card/50 border border-border/30 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 ring-1 ring-primary/20">
            <AvatarImage src={avatarUrl} alt="Profile" className="object-cover" />
            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-xs font-semibold">
              {currentUser.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {currentUser.displayName || currentUser.email?.split('@')[0]}
            </p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
          title="Sign out"
        >
          <LogOut className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  // Desktop version - avatar with dropdown
  return (
    <div className="relative">
      <Button
        variant="ghost"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="h-10 w-10 p-0 rounded-full hover:ring-2 hover:ring-primary/20 transition-all duration-200"
      >
        <Avatar className="h-9 w-9">
          <AvatarImage src={avatarUrl} alt="Profile" className="object-cover" />
          <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-semibold">
            {currentUser.email?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </Button>

      {/* Dropdown */}
      {isDropdownOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsDropdownOpen(false)}
          />
          
          {/* Dropdown content */}
          <div className="absolute right-0 top-12 z-20 w-64 bg-card border border-border rounded-xl shadow-xl backdrop-blur-xl animate-scale-in">
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                  <AvatarImage src={avatarUrl} alt="Profile" className="object-cover" />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-semibold">
                    {currentUser.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {currentUser.displayName || currentUser.email?.split('@')[0]}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {currentUser.email}
                  </p>
                </div>
              </div>
              
              <div className="w-full h-px bg-border" />
              
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserProfile;