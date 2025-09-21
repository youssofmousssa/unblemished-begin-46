import React from 'react';
import { motion } from 'framer-motion';
import { Bot, User, Copy } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toast } from '@/hooks/use-toast';
import CodeBlock from './CodeBlock';
import TypingEffect from './TypingEffect';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  model?: string;
  isTyping?: boolean;
}

interface ChatMessageProps {
  message: Message;
  userAvatar?: string;
  onTypingComplete: (messageId: string) => void;
  onLongPress?: (message: Message) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = React.memo(({ 
  message, 
  userAvatar, 
  onTypingComplete,
  onLongPress 
}) => {
  const isUser = message.sender === 'user';

  const handleLongPress = () => {
    if (onLongPress) {
      onLongPress(message);
    } else {
      // Default: copy message content
      navigator.clipboard.writeText(message.content);
      toast({
        title: "Copied",
        description: "Message copied to clipboard",
      });
    }
  };

  if (isUser) {
    // User message with bubble (right side)
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="flex gap-2 sm:gap-3 w-full justify-end group mb-4"
        onTouchStart={() => {
          let timeout = setTimeout(handleLongPress, 800);
          const cleanup = () => clearTimeout(timeout);
          document.addEventListener('touchend', cleanup, { once: true });
          document.addEventListener('touchmove', cleanup, { once: true });
        }}
      >
        <div className="max-w-[85%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[60%] bg-primary text-primary-foreground rounded-2xl rounded-br-md shadow-sm px-3 py-2 sm:px-4 sm:py-3">
          <p className="whitespace-pre-wrap break-words text-sm sm:text-base leading-relaxed">
            {message.content}
          </p>
        </div>
        
        <Avatar className="w-7 h-7 sm:w-9 sm:h-9 flex-shrink-0 mt-1">
          <AvatarImage src={userAvatar} />
          <AvatarFallback className="bg-secondary">
            <User className="w-3 h-3 sm:w-4 sm:h-4" />
          </AvatarFallback>
        </Avatar>
      </motion.div>
    );
  }

  // AI message without bubble (left side, plain text like ChatGPT)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex gap-2 sm:gap-3 w-full justify-start group mb-6"
      onTouchStart={() => {
        let timeout = setTimeout(handleLongPress, 800);
        const cleanup = () => clearTimeout(timeout);
        document.addEventListener('touchend', cleanup, { once: true });
        document.addEventListener('touchmove', cleanup, { once: true });
      }}
    >
      <Avatar className="w-7 h-7 sm:w-9 sm:h-9 flex-shrink-0 mt-1">
        <AvatarFallback className="bg-primary text-primary-foreground">
          <Bot className="w-3 h-3 sm:w-4 sm:h-4" />
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0 max-w-[calc(100vw-4rem)] md:max-w-[70%]">
        {/* AI Response Content - No bubble, just clean text */}
        <div className="prose prose-sm dark:prose-invert max-w-none overflow-hidden">
          {message.isTyping ? (
            <TypingEffect 
              text={message.content} 
              onComplete={() => onTypingComplete(message.id)}
            />
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => (
                  <p className="mb-3 last:mb-0 break-words leading-relaxed text-sm sm:text-base text-foreground">
                    {children}
                  </p>
                ),
                h1: ({ children }) => <h1 className="text-lg sm:text-xl font-bold mb-4 break-words text-foreground">{children}</h1>,
                h2: ({ children }) => <h2 className="text-base sm:text-lg font-bold mb-3 break-words text-foreground">{children}</h2>,
                h3: ({ children }) => <h3 className="text-sm sm:text-base font-bold mb-2 break-words text-foreground">{children}</h3>,
                h4: ({ children }) => <h4 className="text-sm font-bold mb-2 break-words text-foreground">{children}</h4>,
                strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                em: ({ children }) => <em className="italic text-foreground">{children}</em>,
                code: ({ children, className }) => (
                  <CodeBlock className={className}>{String(children)}</CodeBlock>
                ),
                blockquote: ({ children }) => (
                  <Card className="border-l-4 border-l-primary/60 pl-4 py-3 my-3 bg-muted/40">
                    <div className="italic text-sm text-foreground">{children}</div>
                  </Card>
                ),
                ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1 text-sm text-foreground">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1 text-sm text-foreground">{children}</ol>,
                li: ({ children }) => <li className="ml-1 break-words leading-relaxed text-foreground">{children}</li>,
                a: ({ children, href }) => (
                  <a 
                    href={href} 
                    className="text-primary underline hover:text-primary/80 break-all transition-smooth" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
                table: ({ children }) => (
                  <Card className="overflow-x-auto my-3">
                    <table className="w-full text-sm">{children}</table>
                  </Card>
                ),
                th: ({ children }) => (
                  <th className="border border-border px-3 py-2 bg-muted font-semibold text-left">{children}</th>
                ),
                td: ({ children }) => (
                  <td className="border border-border px-3 py-2 break-words">{children}</td>
                ),
                hr: () => <hr className="border-border my-4" />,
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>

        {/* Copy button for AI messages */}
        <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => {
              navigator.clipboard.writeText(message.content);
              toast({
                title: "Copied",
                description: "Message copied to clipboard",
              });
            }}
            aria-label="Copy message"
          >
            <Copy className="w-3 h-3 mr-1" />
            Copy
          </Button>
        </div>
      </div>
    </motion.div>
  );
});

ChatMessage.displayName = 'ChatMessage';

export default ChatMessage;