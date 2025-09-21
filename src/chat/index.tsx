// Empty chat folder - ready for your files
import React from 'react';

const ChatPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Chat Coming Soon</h1>
        <p className="text-muted-foreground">This chat folder is ready for your files.</p>
      </div>
    </div>
  );
};

export default ChatPage;