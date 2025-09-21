import React, { useMemo } from 'react';
import ChatMessage, { Message } from './ChatMessage';
import { Bot } from 'lucide-react';
import { motion } from 'framer-motion';

interface VirtualizedChatListProps {
  messages: Message[];
  userAvatar?: string;
  onTypingComplete: (messageId: string) => void;
  isLoading?: boolean;
  height: number;
}

const LoadingMessage = React.memo(() => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex gap-3 justify-start px-4 py-2"
  >
    <div className="w-7 h-7 sm:w-9 sm:h-9 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
      <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-primary-foreground" />
    </div>
    <div className="bg-muted/90 backdrop-blur-sm rounded-2xl rounded-bl-md px-4 py-3 border border-border/40">
      <div className="flex space-x-1">
        <motion.div 
          className="w-2 h-2 bg-current rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
        />
        <motion.div 
          className="w-2 h-2 bg-current rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }}
        />
        <motion.div 
          className="w-2 h-2 bg-current rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
        />
      </div>
    </div>
  </motion.div>
));

const EmptyState = React.memo(() => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    className="text-center text-muted-foreground mt-12 sm:mt-20 px-4"
  >
    <Bot className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 opacity-50" />
    <h2 className="text-xl sm:text-2xl font-semibold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
      Start Your AI Conversation
    </h2>
    <p className="text-base sm:text-lg mb-4">Choose your model and ask anything</p>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-md mx-auto text-sm">
      <div className="bg-card/50 rounded-lg p-3">
        <div className="font-medium mb-1">💡 Ask Questions</div>
        <div className="text-xs opacity-70">Get instant answers</div>
      </div>
      <div className="bg-card/50 rounded-lg p-3">
        <div className="font-medium mb-1">🔧 Write Code</div>
        <div className="text-xs opacity-70">Generate & debug</div>
      </div>
      <div className="bg-card/50 rounded-lg p-3">
        <div className="font-medium mb-1">✨ Be Creative</div>
        <div className="text-xs opacity-70">Stories & ideas</div>
      </div>
    </div>
  </motion.div>
));

const MessageItem = React.memo(({ 
  index, 
  style, 
  data 
}: { 
  index: number; 
  style: any; 
  data: { 
    messages: Message[], 
    userAvatar?: string, 
    onTypingComplete: (id: string) => void 
  } 
}) => {
  const { messages, userAvatar, onTypingComplete } = data;
  const message = messages[index];

  return (
    <div style={style} className="px-2 sm:px-4">
      <ChatMessage
        message={message}
        userAvatar={userAvatar}
        onTypingComplete={onTypingComplete}
      />
    </div>
  );
});

const VirtualizedChatList: React.FC<VirtualizedChatListProps> = ({
  messages,
  userAvatar,
  onTypingComplete,
  isLoading,
  height
}) => {
  const itemData = useMemo(() => ({
    messages,
    userAvatar,
    onTypingComplete
  }), [messages, userAvatar, onTypingComplete]);

  if (messages.length === 0 && !isLoading) {
    return <EmptyState />;
  }

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto">
      {/* Simplified without virtualization for now */}
      {(
        <div className="space-y-2 sm:space-y-4 px-2 sm:px-4 pb-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              userAvatar={userAvatar}
              onTypingComplete={onTypingComplete}
            />
          ))}
        </div>
      )}
      
      {isLoading && <LoadingMessage />}
    </div>
  );
};

export default VirtualizedChatList;