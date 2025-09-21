import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

interface CodeBlockProps {
  children: string;
  className?: string;
  [key: string]: any;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ children, className, ...props }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "Code copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy code to clipboard",
        variant: "destructive",
      });
    }
  };

  const isInline = !className;
  if (isInline) {
    return (
      <code className="bg-muted/60 px-1 py-0.5 rounded text-xs font-mono border border-border/50 inline-block break-words">
        {children}
      </code>
    );
  }

  const language = className?.replace(/language-/, '') || 'text';
  const displayLanguage = language.charAt(0).toUpperCase() + language.slice(1);

  return (
    <motion.div
  initial={{ opacity: 0, scale: 0.98 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.2 }}
  className="my-2 w-full min-w-0 mx-1 sm:mx-2"
>
  <div className="rounded-lg bg-gray-900 border border-gray-700 overflow-x-auto max-w-full">
    {/* Header */}
    <div className="flex flex-wrap items-center justify-between px-2 py-1 bg-gray-800 border-b border-gray-700">
      <span className="text-xs font-medium text-white font-mono mb-1 sm:mb-0">
        {displayLanguage}
      </span>
      <Button
        size="sm"
        variant="ghost"
        className="h-auto px-2 py-0.5 text-xs text-white hover:bg-gray-700 transition-colors flex items-center gap-1"
        onClick={copyToClipboard}
        title={copied ? "Copied!" : "Copy code"}
        aria-label="Copy code to clipboard"
      >
        <Copy className="w-3 h-3" />
        <span className="font-medium">Copy</span>
      </Button>
    </div>

    {/* Code Content */}
    <div className="overflow-x-auto">
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          fontSize: '0.65rem', // slightly smaller for mobile
          lineHeight: '1.4',
          padding: '0.4rem',
          fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
          background: '#1f2937',
          color: '#f9fafb',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
        wrapLongLines={true}
        showLineNumbers={false}
        {...props}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  </div>
</motion.div>
  );
};

export default CodeBlock;
