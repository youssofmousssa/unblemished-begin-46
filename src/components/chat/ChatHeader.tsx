import React from 'react';
import { ArrowLeft, Bot, Mail, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface ChatHeaderProps {
  currentUser?: any;
  isEmailVerified?: boolean;
  onSendVerification?: () => void;
  onToggleSidebar?: () => void;
  showSidebarToggle?: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  currentUser,
  isEmailVerified,
  onSendVerification,
  onToggleSidebar,
  showSidebarToggle = false
}) => {
  const navigate = useNavigate();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-b rounded-none bg-card/95 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 sm:p-4">
          {/* Left section - Navigation and title */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {showSidebarToggle && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleSidebar}
                className="flex-shrink-0 h-9 w-9 sm:hidden"
                aria-label="Toggle sidebar"
              >
                <Menu className="w-4 h-4" />
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="flex-shrink-0 h-9 w-9"
              aria-label="Go back to home"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            
            <div className="flex items-center gap-3 flex-1">
              <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-primary animate-pulse" />
              <h1 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                AI Chat Assistant
              </h1>
            </div>
          </div>
          
          {/* Email verification warning - Mobile optimized */}
          {currentUser && !isEmailVerified && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 w-full sm:w-auto px-3 py-2 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-lg text-sm border border-orange-200 dark:border-orange-800"
            >
              <Mail className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1 sm:flex-none font-medium">
                ⚠️ Email verification required
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onSendVerification}
                className="h-auto px-2 py-1 text-xs font-medium bg-orange-100 dark:bg-orange-900/50 hover:bg-orange-200 dark:hover:bg-orange-900 transition-smooth rounded"
              >
                Resend
              </Button>
            </motion.div>
          )}
        </div>
      </Card>
    </motion.header>
  );
};

export default ChatHeader;