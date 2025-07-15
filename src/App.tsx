
import { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import LoginForm from "@/components/LoginForm";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  const { isAuthenticated, login, isLoading } = useAuth();
  const [loginError, setLoginError] = useState('');

  const handleLogin = async (email: string, password: string) => {
    setLoginError('');
    const success = await login(email, password);
    if (!success) {
      setLoginError('Email ou senha incorretos');
    }
  };

  if (!isAuthenticated) {
    return (
      <div>
        <LoginForm onLogin={handleLogin} isLoading={isLoading} />
        {loginError && (
          <div className="fixed bottom-4 right-4 bg-destructive text-destructive-foreground px-4 py-2 rounded-lg shadow-lg">
            {loginError}
          </div>
        )}
      </div>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Index />} />
        {/* Placeholder routes for future implementation */}
        <Route path="/schedule" element={<div className="p-8"><h1>Agendamentos</h1><p>Em desenvolvimento...</p></div>} />
        <Route path="/vessels" element={<div className="p-8"><h1>Embarcações</h1><p>Em desenvolvimento...</p></div>} />
        <Route path="/dock" element={<div className="p-8"><h1>Gestão do Cais</h1><p>Em desenvolvimento...</p></div>} />
        <Route path="/weather" element={<div className="p-8"><h1>Maré & Clima</h1><p>Em desenvolvimento...</p></div>} />
        <Route path="/settings" element={<div className="p-8"><h1>Configurações</h1><p>Em desenvolvimento...</p></div>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
