import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import UserProfile from '@/components/UserProfile';
import { 
  MessageCircle, 
  VideoIcon, 
  ImageIcon, 
  Volume2, 
  Music, 
  Download, 
  Scissors,
  Send,
  Users,
  User,
  Code,
  X
} from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  tabs: Tab[];
}

const telegramButtons = [
  { id: 'support', label: 'Support', username: 'zdarkai', icon: Users },
  { id: 'channel', label: 'Channel', username: 'darkaix', icon: Send },
  { id: 'owner', label: 'Owner', username: 'sii_3', icon: User },
];

export const AnimatedHamburger: React.FC<{ isOpen: boolean; onClick: () => void }> = ({ isOpen, onClick }) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className="relative w-10 h-10 p-0 focus:outline-none md:hidden"
    >
      <div className="w-6 h-6 flex flex-col justify-center items-center">
        <motion.div
          className="w-6 h-0.5 bg-foreground mb-1"
          animate={{
            rotate: isOpen ? 45 : 0,
            y: isOpen ? 6 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          className="w-6 h-0.5 bg-foreground mb-1"
          animate={{
            opacity: isOpen ? 0 : 1,
          }}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          className="w-6 h-0.5 bg-foreground"
          animate={{
            rotate: isOpen ? -45 : 0,
            y: isOpen ? -6 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </Button>
  );
};

const MobileSidebar: React.FC<MobileSidebarProps> = ({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
  tabs,
}) => {
  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    onClose();
  };

  const handleTelegramClick = (username: string) => {
    window.open(`https://t.me/${username}`, '_blank');
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-80 bg-card border-r border-border z-50 md:hidden overflow-hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">DarkAI Menu</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Profile Section */}
                <Card className="p-4 bg-card/50 border-border/50">
                  <UserProfile variant="mobile" />
                </Card>

                {/* Navigation Tabs */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground px-2 mb-3">AI Services</h3>
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    
                    return (
                      <Button
                        key={tab.id}
                        variant={isActive ? "default" : "ghost"}
                        onClick={() => handleTabClick(tab.id)}
                        className={`w-full justify-start gap-3 py-3 h-auto text-left transition-all ${
                          isActive 
                            ? 'bg-primary text-primary-foreground shadow-md' 
                            : 'hover:bg-secondary/80'
                        }`}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <span className="font-medium">{tab.label}</span>
                      </Button>
                    );
                  })}
                </div>

                <Separator className="bg-border/60" />

                {/* Telegram Links */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground px-2 mb-3">Connect with Us</h3>
                  {telegramButtons.map((button) => {
                    const Icon = button.icon;
                    
                    return (
                      <Button
                        key={button.id}
                        variant="outline"
                        onClick={() => handleTelegramClick(button.username)}
                        className="w-full justify-start gap-3 py-3 h-auto text-left border-border/50 hover:bg-accent/50 hover:border-accent transition-all"
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{button.label}</span>
                          <span className="text-xs text-muted-foreground">@{button.username}</span>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-border">
                <p className="text-xs text-center text-muted-foreground">
                  DarkAI Platform © 2025
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileSidebar;