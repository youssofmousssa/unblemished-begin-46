import React from 'react';
import { X, Settings, User, History, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: any;
  sessions?: ChatSession[];
  onSessionSelect?: (sessionId: string) => void;
  onNewChat?: () => void;
  onDeleteSession?: (sessionId: string) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  isOpen,
  onClose,
  currentUser,
  sessions = [],
  onSessionSelect,
  onNewChat,
  onDeleteSession
}) => {
  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-80 z-50 lg:relative lg:z-auto"
          >
            <Card className="h-full rounded-none lg:rounded-r-lg border-r bg-card/95 backdrop-blur-sm">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Chat History</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-8 w-8"
                  aria-label="Close sidebar"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* User section */}
              {currentUser && (
                <div className="p-4 border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {currentUser.displayName || currentUser.email}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {currentUser.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* New Chat Button */}
              <div className="p-4">
                <Button
                  onClick={onNewChat}
                  className="w-full justify-start gap-2"
                  variant="outline"
                >
                  <History className="w-4 h-4" />
                  New Chat
                </Button>
              </div>

              {/* Chat Sessions */}
              <ScrollArea className="flex-1 px-2">
                <div className="space-y-1 pb-4">
                  {sessions.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No chat history yet</p>
                      <p className="text-xs">Start a conversation to see it here</p>
                    </div>
                  ) : (
                    sessions.map((session) => (
                      <motion.div
                        key={session.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="group"
                      >
                        <Card 
                          className="p-3 cursor-pointer hover:bg-muted/50 transition-smooth border-transparent hover:border-border/50"
                          onClick={() => onSessionSelect?.(session.id)}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-medium truncate mb-1">
                                {session.title}
                              </h3>
                              <p className="text-xs text-muted-foreground truncate mb-1">
                                {session.lastMessage}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {session.timestamp.toLocaleDateString()}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="opacity-0 group-hover:opacity-100 h-6 w-6 transition-smooth"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteSession?.(session.id);
                              }}
                              aria-label="Delete chat session"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </Card>
                      </motion.div>
                    ))
                  )}
                </div>
              </ScrollArea>

              {/* Footer */}
              <div className="p-4 border-t">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2"
                  size="sm"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Button>
              </div>
            </Card>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatSidebar;