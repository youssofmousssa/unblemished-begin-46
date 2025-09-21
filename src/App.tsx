import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AuthForm from "./components/AuthForm";
import Home from "./pages/Home";
import Index from "./pages/Index";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";
import SecurityProvider from "./components/SecurityProvider";

const queryClient = new QueryClient();

const AppContent = () => {
  const { currentUser, isEmailVerified } = useAuth();
  
  // Show Home page for everyone, but app routes require auth
  if (!currentUser && window.location.pathname !== '/' && window.location.pathname !== '/home') {
    return <AuthForm />;
  }

  return (
    <SecurityProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/app" element={<Index />} />
          <Route path="/chat" element={<div className="min-h-screen bg-background flex items-center justify-center"><div className="text-center space-y-4"><h1 className="text-4xl font-bold text-foreground">Chat Coming Soon</h1><p className="text-muted-foreground">This chat folder is ready for your files.</p></div></div>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </SecurityProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
