import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { SkipForward } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeBlock from './CodeBlock';

interface TypingEffectProps {
  text: string;
  onComplete?: () => void;
  speed?: number; // characters per frame (1-5, higher = faster)
}

interface ContentSegment {
  type: 'text' | 'code';
  content: string;
  language?: string;
}

const TypingEffect: React.FC<TypingEffectProps> = ({ 
  text, 
  onComplete, 
  speed = 3 // Ultra-fast by default
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [isSkipped, setIsSkipped] = useState(false);
  const animationRef = useRef<number>();
  const indexRef = useRef(0);

  // Parse text into segments for better handling of code blocks
  const segments = useMemo(() => {
    const parsed: ContentSegment[] = [];
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        const textContent = text.slice(lastIndex, match.index).trim();
        if (textContent) {
          parsed.push({ type: 'text', content: textContent });
        }
      }

      // Add code block
      parsed.push({
        type: 'code',
        content: match[2],
        language: match[1] || 'text'
      });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text after last code block
    if (lastIndex < text.length) {
      const textContent = text.slice(lastIndex).trim();
      if (textContent) {
        parsed.push({ type: 'text', content: textContent });
      }
    }

    // If no code blocks found, treat entire text as one segment
    if (parsed.length === 0) {
      parsed.push({ type: 'text', content: text });
    }

    return parsed;
  }, [text]);

  // Check if text contains code blocks to skip typewriter effect
  const hasCodeBlocks = useMemo(() => {
    return /```[\s\S]*?```/.test(text);
  }, [text]);

  // Ultra-fast typing animation using requestAnimationFrame
  const animateTyping = useCallback(() => {
    if (isSkipped || indexRef.current >= text.length || hasCodeBlocks) {
      setDisplayedText(text);
      setIsComplete(true);
      if (onComplete) onComplete();
      return;
    }

    // Type multiple characters per frame for ultra-fast effect
    const nextIndex = Math.min(indexRef.current + speed, text.length);
    setDisplayedText(text.slice(0, nextIndex));
    indexRef.current = nextIndex;

    if (nextIndex < text.length) {
      animationRef.current = requestAnimationFrame(animateTyping);
    } else {
      setIsComplete(true);
      if (onComplete) onComplete();
    }
  }, [text, speed, onComplete, isSkipped, hasCodeBlocks]);

  // Start typing animation
  useEffect(() => {
    indexRef.current = 0;
    setDisplayedText('');
    setIsComplete(false);
    setIsSkipped(false);

    // If has code blocks, render immediately
    if (hasCodeBlocks) {
      setDisplayedText(text);
      setIsComplete(true);
      if (onComplete) onComplete();
      return;
    }

    // Small delay for smooth start
    const timer = setTimeout(() => {
      animationRef.current = requestAnimationFrame(animateTyping);
    }, 50);

    return () => {
      clearTimeout(timer);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animateTyping, hasCodeBlocks, text, onComplete]);

  // Skip typing animation
  const handleSkip = useCallback(() => {
    setIsSkipped(true);
    setDisplayedText(text);
    setIsComplete(true);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (onComplete) onComplete();
  }, [text, onComplete]);

  // Keyboard shortcut for skipping (Escape key)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isComplete) {
        handleSkip();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleSkip, isComplete]);

  return (
    <div className="relative">
      {/* Skip button - only show while typing */}
      {!isComplete && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute -top-2 right-0 z-10"
        >
          <Button
            size="sm"
            variant="ghost"
            onClick={handleSkip}
            className="h-6 px-2 text-xs bg-background/80 backdrop-blur-sm border border-border/40 hover:bg-background transition-smooth"
            title="Skip typing (Esc)"
            aria-label="Skip typing animation"
          >
            <SkipForward className="w-3 h-3 mr-1" />
            Skip
          </Button>
        </motion.div>
      )}

      {/* Typing content */}
      <div className="prose prose-sm dark:prose-invert max-w-none overflow-hidden pt-2">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => (
              <p className="mb-2 last:mb-0 break-words leading-relaxed text-sm sm:text-base">
                {children}
              </p>
            ),
            h1: ({ children }) => <h1 className="text-lg sm:text-xl font-bold mb-3 break-words">{children}</h1>,
            h2: ({ children }) => <h2 className="text-base sm:text-lg font-bold mb-2 break-words">{children}</h2>,
            h3: ({ children }) => <h3 className="text-sm sm:text-base font-bold mb-2 break-words">{children}</h3>,
            h4: ({ children }) => <h4 className="text-sm font-bold mb-1 break-words">{children}</h4>,
            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
            em: ({ children }) => <em className="italic">{children}</em>,
            code: ({ children, className }) => (
              <CodeBlock className={className}>{String(children)}</CodeBlock>
            ),
            ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1 text-sm">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1 text-sm">{children}</ol>,
            li: ({ children }) => <li className="ml-1 break-words leading-relaxed">{children}</li>,
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
          }}
        >
          {displayedText}
        </ReactMarkdown>
        
        {/* Cursor animation */}
        {!isComplete && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
            className="inline-block w-0.5 h-4 bg-primary ml-0.5"
          />
        )}
      </div>
    </div>
  );
};

export default TypingEffect;