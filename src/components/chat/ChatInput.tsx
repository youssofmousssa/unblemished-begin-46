import React, { useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

export interface AIModel {
  value: string;
  label: string;
  endpoint: string;
}

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
  models: AIModel[];
  disabled?: boolean;
  isLoading?: boolean;
  placeholder?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSend,
  onKeyDown,
  selectedModel,
  onModelChange,
  models,
  disabled = false,
  isLoading = false,
  placeholder = "Type your message... (Shift+Enter for new line, Ctrl+Enter to send)"
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [value]);

  // Focus textarea on mount
  useEffect(() => {
    if (textareaRef.current && !disabled) {
      textareaRef.current.focus();
    }
  }, [disabled]);

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl+Enter or Cmd+Enter to send
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onSend();
      return;
    }
    
    // Call parent handler for other key events
    onKeyDown(e);
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-t bg-card/95 backdrop-blur-sm">
        <div className="p-3 sm:p-4 space-y-3">
          {/* Model selector - Mobile responsive */}
          <div className="w-full">
            <Select value={selectedModel} onValueChange={onModelChange} disabled={disabled}>
              <SelectTrigger className="w-full h-9 text-sm">
                <SelectValue placeholder="Select AI Model" />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto">
                {models.map((model) => (
                  <SelectItem key={model.value} value={model.value} className="text-sm">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{model.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Input area */}
          <div className="flex gap-2 items-end">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={disabled || isLoading}
                className="min-h-[44px] max-h-32 resize-none pr-12 text-sm sm:text-base leading-relaxed transition-smooth"
                rows={1}
                aria-label="Message input"
              />
              
              {/* Character count for mobile (optional) */}
              {value.length > 500 && (
                <span className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                  {value.length}
                </span>
              )}
            </div>
            
            <Button
              onClick={onSend}
              disabled={!value.trim() || isLoading || disabled}
              size="icon"
              className="h-11 w-11 flex-shrink-0 transition-smooth hover:scale-105"
              aria-label="Send message"
            >
              <motion.div
                animate={{ 
                  rotate: isLoading ? 360 : 0,
                  scale: !value.trim() ? 0.9 : 1 
                }}
                transition={{ 
                  rotate: { duration: 1, repeat: isLoading ? Infinity : 0, ease: "linear" },
                  scale: { duration: 0.2 }
                }}
              >
                <Send className="w-4 h-4" />
              </motion.div>
            </Button>
          </div>

          {/* Help text */}
          <div className="text-xs text-muted-foreground text-center space-y-1">
            <p><strong>Tips:</strong> Shift+Enter for new line • Ctrl+Enter to send • Long-press message to copy</p>
            {disabled && (
              <p className="text-destructive font-medium">
                Please verify your email to start chatting
              </p>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ChatInput;