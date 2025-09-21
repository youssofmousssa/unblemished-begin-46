import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  model?: string;
}

interface ChatInterfaceProps {
  apiKey: string;
}

const AI_MODELS = [
  { value: 'online', label: 'Online AI Model', endpoint: `${import.meta.env.VITE_DARK_AI_BASE_URL}/api/ai/online` },
  { value: 'standard', label: 'Standard AI Model', endpoint: `${import.meta.env.VITE_DARK_AI_BASE_URL}/api/ai/standard` },
  { value: 'super-genius', label: 'Super Genius AI Model', endpoint: `${import.meta.env.VITE_DARK_AI_BASE_URL}/api/ai/super-genius` },
  { value: 'online-genius', label: 'Online Genius AI Model', endpoint: `${import.meta.env.VITE_DARK_AI_BASE_URL}/api/ai/online-genius` },
  { value: 'gemini-pro', label: 'Gemini 2.5 Pro', endpoint: `${import.meta.env.VITE_DARK_AI_BASE_URL}/api/gemini/pro` },
  { value: 'gemini-deep', label: 'Gemini 2.5 Deep Search', endpoint: `${import.meta.env.VITE_DARK_AI_BASE_URL}/api/gemini/deep` },
  { value: 'gemini-flash', label: 'Gemini 2.5 Flash', endpoint: `${import.meta.env.VITE_DARK_AI_BASE_URL}/api/gemini/flash` },
  { value: 'gemma-4b', label: 'Gemma 4B Model', endpoint: `${import.meta.env.VITE_DARK_AI_BASE_URL}/api/gemma/4b` },
  { value: 'gemma-12b', label: 'Gemma 12B Model', endpoint: `${import.meta.env.VITE_DARK_AI_BASE_URL}/api/gemma/12b` },
  { value: 'gemma-27b', label: 'Gemma 27B Model', endpoint: `${import.meta.env.VITE_DARK_AI_BASE_URL}/api/gemma/27b` },
  { value: 'wormgpt', label: 'WormGPT Model', endpoint: `${import.meta.env.VITE_DARK_AI_BASE_URL}/api/wormgpt` },
];

const ChatInterface: React.FC<ChatInterfaceProps> = ({ apiKey }) => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedModel, setSelectedModel] = useState('online');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getUserAvatar = () => {
    if (currentUser?.photoURL) {
      return currentUser.photoURL;
    }
    if (currentUser?.email) {
      // Generate a random avatar based on email
      const emailHash = currentUser.email.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0);
      return `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.abs(emailHash)}`;
    }
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || !apiKey) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const selectedModelConfig = AI_MODELS.find(m => m.value === selectedModel);
      const response = await fetch(selectedModelConfig?.endpoint || AI_MODELS[0].endpoint, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: userMessage.content,
          api_key: apiKey,
        }),
      });

      const data = await response.json();

      if (response.ok && data.response) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response,
          sender: 'ai',
          timestamp: new Date(),
          model: selectedModel,
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error(data.error || 'Failed to get AI response');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-card rounded-lg border">
      {/* Chat Messages Area */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground mt-20">
              <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Start a conversation with AI</p>
              <p className="text-sm">Choose your model and type a message below</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'ai' && (
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-md'
                      : 'bg-muted rounded-bl-md'
                  }`}
                >
                  {message.sender === 'ai' ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                          h1: ({ children }) => <h1 className="text-2xl font-bold mb-3">{children}</h1>,
                          h2: ({ children }) => <h2 className="text-xl font-bold mb-2">{children}</h2>,
                          h3: ({ children }) => <h3 className="text-lg font-bold mb-2">{children}</h3>,
                          h4: ({ children }) => <h4 className="text-base font-bold mb-1">{children}</h4>,
                          h5: ({ children }) => <h5 className="text-sm font-bold mb-1">{children}</h5>,
                          h6: ({ children }) => <h6 className="text-xs font-bold mb-1">{children}</h6>,
                          strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                          em: ({ children }) => <em className="italic">{children}</em>,
                          u: ({ children }) => <u className="underline">{children}</u>,
                          del: ({ children }) => <del className="line-through">{children}</del>,
                          code: ({ children, className }) => {
                            const isInline = !className;
                            return isInline ? (
                              <code className="bg-background px-1 py-0.5 rounded text-sm font-mono border">
                                {children}
                              </code>
                            ) : (
                              <pre className="bg-background p-3 rounded-lg overflow-x-auto border my-2">
                                <code className="text-sm font-mono">{children}</code>
                              </pre>
                            );
                          },
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-primary pl-4 italic my-2 bg-muted/30 py-2 rounded-r">
                              {children}
                            </blockquote>
                          ),
                          ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                          li: ({ children }) => <li className="ml-2">{children}</li>,
                          a: ({ children, href }) => (
                            <a href={href} className="text-primary underline hover:text-primary/80" target="_blank" rel="noopener noreferrer">
                              {children}
                            </a>
                          ),
                          table: ({ children }) => (
                            <div className="overflow-x-auto my-2">
                              <table className="border-collapse border border-border w-full">{children}</table>
                            </div>
                          ),
                          th: ({ children }) => (
                            <th className="border border-border px-3 py-2 bg-muted font-bold text-left">{children}</th>
                          ),
                          td: ({ children }) => (
                            <td className="border border-border px-3 py-2">{children}</td>
                          ),
                          hr: () => <hr className="border-border my-4" />,
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  )}
                  
                  {message.model && (
                    <p className="text-xs opacity-70 mt-2">
                      {AI_MODELS.find(m => m.value === message.model)?.label}
                    </p>
                  )}
                </div>

                {message.sender === 'user' && (
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarImage src={getUserAvatar()} />
                    <AvatarFallback className="bg-secondary">
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Section */}
      <div className="border-t p-4 space-y-3">
        <Select value={selectedModel} onValueChange={setSelectedModel}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select AI Model" />
          </SelectTrigger>
          <SelectContent>
            {AI_MODELS.map((model) => (
              <SelectItem key={model.value} value={model.value}>
                {model.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Shift+Enter for new line)"
            className="flex-1 min-h-[44px] max-h-32 resize-none"
            disabled={isLoading || !apiKey}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading || !apiKey}
            size="icon"
            className="h-11 w-11 flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {!apiKey && (
          <p className="text-sm text-muted-foreground text-center">
            Please enter your API key to start chatting
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;