import React, { useState, useEffect, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface TypingEffectProps {
  text: string;
  onComplete?: () => void;
}

interface ContentSegment {
  type: 'text' | 'code';
  content: string;
  language?: string;
}

const TypingEffect: React.FC<TypingEffectProps> = ({ text, onComplete }) => {
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [displayedSegments, setDisplayedSegments] = useState<ContentSegment[]>([]);

  // Parse text into segments (text and code blocks)
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

  useEffect(() => {
    if (currentSegmentIndex >= segments.length) {
      if (onComplete) onComplete();
      return;
    }

    const currentSegment = segments[currentSegmentIndex];
    const speed = calculateTypingSpeed(currentSegment.content.length, currentSegment.type);

    if (currentCharIndex < currentSegment.content.length) {
      const timer = setTimeout(() => {
        setDisplayedSegments(prev => {
          const updated = [...prev];
          const segmentContent = currentSegment.content.slice(0, currentCharIndex + 1);
          
          if (updated[currentSegmentIndex]) {
            updated[currentSegmentIndex] = { ...currentSegment, content: segmentContent };
          } else {
            updated.push({ ...currentSegment, content: segmentContent });
          }
          
          return updated;
        });
        setCurrentCharIndex(currentCharIndex + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else {
      // Move to next segment
      setCurrentSegmentIndex(currentSegmentIndex + 1);
      setCurrentCharIndex(0);
    }
  }, [currentSegmentIndex, currentCharIndex, segments, onComplete]);

  // Reset when text changes
  useEffect(() => {
    setDisplayedSegments([]);
    setCurrentSegmentIndex(0);
    setCurrentCharIndex(0);
  }, [text]);

  const calculateTypingSpeed = (contentLength: number, type: 'text' | 'code'): number => {
    // Ultra fast typing - 1-2ms per character
    return type === 'code' ? 1 : 2;
  };

  return (
    <div className="space-y-4">
      {displayedSegments.map((segment, index) => (
        <div key={index}>
          {segment.type === 'text' ? (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {segment.content}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="relative my-4 max-h-96 overflow-y-auto rounded-lg border animate-fade-in">
              <SyntaxHighlighter
                language={segment.language || 'text'}
                style={oneDark}
                customStyle={{
                  margin: 0,
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  maxHeight: '24rem',
                  overflow: 'auto',
                  fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                }}
                wrapLongLines={true}
                showLineNumbers={segment.content.split('\n').length > 5}
                lineNumberStyle={{ 
                  color: '#6b7280', 
                  fontSize: '0.75rem',
                  paddingRight: '1rem',
                  minWidth: '2.5rem' 
                }}
              >
                {segment.content}
              </SyntaxHighlighter>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TypingEffect;