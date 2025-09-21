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
  X,
  Sparkles,
  Zap,
  Flame
} from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}

interface DesktopSidebarProps {
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
  { id: 'developer', label: 'Developer', username: 'youssofxmoussa', icon: Code },
];

export const AnimatedDesktopHamburger: React.FC<{ isOpen: boolean; onClick: () => void }> = ({ isOpen, onClick }) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className="relative w-12 h-12 p-0 focus:outline-none hover:bg-accent/20 transition-all duration-300 group"
    >
      <div className="w-7 h-7 flex flex-col justify-center items-center">
        <motion.div
          className="w-7 h-0.5 bg-gradient-to-r from-primary to-accent mb-1.5 rounded-full shadow-glow"
          animate={{
            rotate: isOpen ? 45 : 0,
            y: isOpen ? 8 : 0,
            scaleX: isOpen ? 1.1 : 1,
          }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        />
        <motion.div
          className="w-7 h-0.5 bg-gradient-to-r from-accent to-primary mb-1.5 rounded-full shadow-glow"
          animate={{
            opacity: isOpen ? 0 : 1,
            scaleX: isOpen ? 0 : 1,
          }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        />
        <motion.div
          className="w-7 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full shadow-glow"
          animate={{
            rotate: isOpen ? -45 : 0,
            y: isOpen ? -8 : 0,
            scaleX: isOpen ? 1.1 : 1,
          }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        />
      </div>
      
      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 -z-10"
        animate={{ scale: isOpen ? 1.1 : 1 }}
        transition={{ duration: 0.3 }}
      />
    </Button>
  );
};

const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
  tabs,
}) => {
  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
  };

  const handleTelegramClick = (username: string) => {
    window.open(`https://t.me/${username}`, '_blank');
  };

  return (
    <>
      {/* Backdrop with blur */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="fixed inset-0 bg-black/30 backdrop-blur-md z-40 hidden md:block"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ 
              x: '-100%',
              opacity: 0,
              scale: 0.95
            }}
            animate={{ 
              x: 0,
              opacity: 1,
              scale: 1
            }}
            exit={{ 
              x: '-100%',
              opacity: 0,
              scale: 0.95
            }}
            transition={{ 
              type: 'spring', 
              damping: 25, 
              stiffness: 200,
              opacity: { duration: 0.3 },
              scale: { duration: 0.3 }
            }}
            className="fixed left-0 top-0 bottom-0 w-96 bg-gradient-to-br from-card/95 via-card/90 to-card/95 backdrop-blur-xl border-r border-gradient-to-b from-border/50 to-border/20 z-50 hidden md:block overflow-hidden shadow-dramatic"
          >
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-10 left-10 w-20 h-20 bg-primary rounded-full blur-xl animate-pulse"></div>
              <div className="absolute top-32 right-8 w-16 h-16 bg-accent rounded-full blur-lg animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="absolute bottom-20 left-8 w-24 h-24 bg-primary rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="flex flex-col h-full relative z-10">
              {/* Header with enhanced design */}
              <motion.div 
                className="flex items-center justify-between p-6 border-b border-border/30 bg-gradient-to-r from-primary/5 to-accent/5"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl shadow-glow">
                    <Flame className="h-6 w-6 text-primary animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      DarkAI
                    </h2>
                    <p className="text-xs text-muted-foreground">AI Platform</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-10 w-10 p-0 hover:bg-destructive/20 hover:text-destructive transition-all duration-300 hover:scale-110"
                >
                  <X className="h-5 w-5" />
                </Button>
              </motion.div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                {/* Profile Section */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  <Card className="p-5 bg-gradient-to-br from-card/80 to-card/60 border-border/50 backdrop-blur-sm shadow-control hover:shadow-glow transition-all duration-500 hover:scale-[1.02]">
                    <UserProfile variant="mobile" />
                  </Card>
                </motion.div>

                {/* AI Services Section */}
                <motion.div 
                  className="space-y-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                      AI Services
                    </h3>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="p-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full"
                    >
                      <Zap className="w-4 h-4 text-accent" />
                    </motion.div>
                  </div>
                  
                  <div className="space-y-2">
                    {tabs.map((tab, index) => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      
                      return (
                        <motion.div
                          key={tab.id}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
                        >
                          <Button
                            variant={isActive ? "default" : "ghost"}
                            onClick={() => handleTabClick(tab.id)}
                            className={`w-full justify-start gap-4 py-4 h-auto text-left transition-all duration-300 relative overflow-hidden group ${
                              isActive 
                                ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-glow border-0' 
                                : 'hover:bg-gradient-to-r hover:from-accent/10 hover:to-primary/10 hover:shadow-control hover:scale-[1.02]'
                            }`}
                          >
                            {/* Background animation for active state */}
                            {isActive && (
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20"
                                animate={{ 
                                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                                }}
                                transition={{
                                  duration: 3,
                                  repeat: Infinity,
                                  ease: "linear"
                                }}
                                style={{
                                  backgroundSize: "200% 200%"
                                }}
                              />
                            )}
                            
                            <div className="relative z-10 flex items-center gap-4 w-full">
                              <div className={`p-2 rounded-lg transition-all duration-300 ${
                                isActive 
                                  ? 'bg-white/20 shadow-lg' 
                                  : 'bg-primary/10 group-hover:bg-primary/20 group-hover:scale-110'
                              }`}>
                                <Icon className="w-5 h-5 flex-shrink-0" />
                              </div>
                              <div className="flex-1">
                                <span className="font-semibold text-sm">{tab.label}</span>
                                {isActive && (
                                  <motion.div
                                    className="h-0.5 bg-white/40 rounded-full mt-1"
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                  />
                                )}
                              </div>
                              
                              {/* Active indicator */}
                              {isActive && (
                                <motion.div
                                  initial={{ scale: 0, rotate: -180 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  className="w-2 h-2 bg-white rounded-full shadow-sm"
                                />
                              )}
                            </div>
                          </Button>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>

                <Separator className="bg-gradient-to-r from-border/0 via-border/50 to-border/0" />

                {/* Connect Section */}
                <motion.div 
                  className="space-y-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.4 }}
                >
                  <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Connect with Us
                  </h3>
                  <div className="space-y-2">
                    {telegramButtons.map((button, index) => {
                      const Icon = button.icon;
                      
                      return (
                        <motion.div
                          key={button.id}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.9 + index * 0.1, duration: 0.3 }}
                        >
                          <Button
                            variant="outline"
                            onClick={() => handleTelegramClick(button.username)}
                            className="w-full justify-start gap-3 py-3 h-auto text-left border-border/30 hover:border-accent/50 hover:bg-accent/5 transition-all duration-300 hover:scale-[1.02] hover:shadow-control group"
                          >
                            <div className="p-1.5 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-all duration-300 group-hover:scale-110">
                              <Icon className="w-4 h-4 flex-shrink-0 text-accent" />
                            </div>
                            <div className="flex flex-col items-start">
                              <span className="font-medium text-sm">{button.label}</span>
                              <span className="text-xs text-muted-foreground">@{button.username}</span>
                            </div>
                            <motion.div
                              className="ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300"
                              whileHover={{ x: 5 }}
                            >
                              <Send className="w-3 h-3 text-accent" />
                            </motion.div>
                          </Button>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              </div>

              {/* Footer */}
              <motion.div 
                className="p-6 border-t border-border/30 bg-gradient-to-r from-primary/5 to-accent/5"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.4 }}
              >
                <div className="text-center">
                  <p className="text-xs text-muted-foreground font-medium">
                    DarkAI Platform © 2025
                  </p>
                  <div className="flex justify-center gap-1 mt-2">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1 h-1 bg-accent rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ 
                          duration: 1,
                          repeat: Infinity,
                          delay: i * 0.2
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: hsl(var(--accent)) transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, hsl(var(--primary)), hsl(var(--accent)));
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, hsl(var(--accent)), hsl(var(--primary)));
        }
      `}</style>
    </>
  );
};

export default DesktopSidebar;