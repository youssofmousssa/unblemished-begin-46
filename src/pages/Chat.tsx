import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { sendEmailVerification } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { motion } from 'framer-motion';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatSidebar from '@/components/chat/ChatSidebar';
import ChatInput, { AIModel } from '@/components/chat/ChatInput';
import VirtualizedChatList from '@/components/chat/VirtualizedChatList';
import { Message } from '@/components/chat/ChatMessage';

const AI_MODELS: AIModel[] = [
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

/**
 * 🚀 PROFESSIONAL CHAT UI COMPONENT
 * Fully responsive, production-ready chat interface with:
 * - Mobile-first responsive design
 * - Framer Motion animations  
 * - Ultra-fast typewriter effects with skip functionality
 * - One-click code copying with shadcn Cards
 * - Performance optimizations (React.memo, virtualization)
 * - Mobile gestures and accessibility features
 */
const Chat: React.FC = () => {
  const { currentUser, isEmailVerified } = useAuth();
  
  // Core state
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedModel, setSelectedModel] = useState('online');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey] = useState(import.meta.env.VITE_CHAT_API_KEY);
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Refs
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Mobile detection
  const isMobile = window.innerWidth < 768;

  // Auto-scroll to bottom optimized with useCallback
  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, []);

  // Smooth scroll on new messages
  useEffect(() => {
    const timer = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timer);
  }, [messages, scrollToBottom]);

  // Memoized user avatar generation
  const userAvatar = useMemo(() => {
    if (currentUser?.photoURL) {
      return currentUser.photoURL;
    }
    if (currentUser?.email) {
      const emailHash = currentUser.email.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0);
      return `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.abs(emailHash)}`;
    }
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`;
  }, [currentUser]);

  // Email verification handler
  const sendVerificationEmail = useCallback(async () => {
    if (currentUser && !isEmailVerified) {
      try {
        await sendEmailVerification(currentUser);
        toast({
          title: "Verification email sent",
          description: "Please check your email for verification link.",
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  }, [currentUser, isEmailVerified]);

  // Optimized message sending with error handling
  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || isLoading || !apiKey) return;
    
    if (!isEmailVerified) {
      toast({
        title: "Email not verified",
        description: "Please verify your email before using chat.",
        variant: "destructive",
      });
      return;
    }

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
        const aiMessageId = (Date.now() + 1).toString();
        const aiMessage: Message = {
          id: aiMessageId,
          content: data.response,
          sender: 'ai',
          timestamp: new Date(),
          model: selectedModel,
          isTyping: true,
        };
        setMessages(prev => [...prev, aiMessage]);
        setTypingMessageId(aiMessageId);
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
  }, [inputValue, isLoading, apiKey, isEmailVerified, selectedModel]);

  // Typing completion handler
  const handleTypingComplete = useCallback((messageId: string) => {
    setTypingMessageId(null);
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isTyping: false } : msg
    ));
  }, []);

  // Keyboard handling with accessibility
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [sidebarOpen]);

  // Close sidebar on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  // Dynamic height calculation for virtualization
  const chatHeight = useMemo(() => {
    return window.innerHeight - 200; // Header + input area
  }, []);

  // Gesture handlers for mobile
  const handleSwipeToOpenSidebar = useCallback(() => {
    if (isMobile && !sidebarOpen) {
      setSidebarOpen(true);
    }
  }, [isMobile, sidebarOpen]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex h-screen bg-background overflow-hidden"
      onTouchStart={(e) => {
        if (e.touches[0].clientX < 20) {
          handleSwipeToOpenSidebar();
        }
      }}
    >
      {/* Sidebar */}
      <ChatSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentUser={currentUser}
      />

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <ChatHeader
          currentUser={currentUser}
          isEmailVerified={isEmailVerified}
          onSendVerification={sendVerificationEmail}
          onToggleSidebar={() => setSidebarOpen(true)}
          showSidebarToggle={true}
        />

        {/* Chat Messages Area with Virtualization */}
        <ScrollArea 
          ref={scrollAreaRef} 
          className="flex-1 h-full overflow-hidden"
        >
          <div 
            ref={chatContainerRef}
            className="min-h-full py-2 sm:py-4"
          >
            <VirtualizedChatList
              messages={messages}
              userAvatar={userAvatar}
              onTypingComplete={handleTypingComplete}
              isLoading={isLoading}
              height={chatHeight}
            />
          </div>
        </ScrollArea>

        {/* Input Section */}
        <div className="flex-shrink-0">
          <ChatInput
            value={inputValue}
            onChange={setInputValue}
            onSend={handleSendMessage}
            onKeyDown={handleKeyDown}
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
            models={AI_MODELS}
            disabled={!isEmailVerified}
            isLoading={isLoading}
            placeholder={
              isMobile 
                ? "Type your message..." 
                : "Type your message... (Shift+Enter for new line, Ctrl+Enter to send)"
            }
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Chat;