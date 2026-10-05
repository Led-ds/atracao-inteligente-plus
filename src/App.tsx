
import { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PortCallStoreProvider } from "@/contexts/PortCallStore";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import LoginForm from "@/components/LoginForm";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import Planning from "./pages/Planning";
import Vessels from "./pages/Vessels";
import Infrastructure from "./pages/Infrastructure";
import PortCalls from "./pages/PortCalls";
import PortCallDetail from "./pages/PortCallDetail";
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
    <PortCallStoreProvider>
    <Layout>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/port-calls" element={<PortCalls />} />
        <Route path="/port-calls/:id" element={<PortCallDetail />} />
        <Route path="/planning" element={<Planning />} />
        <Route path="/vessels" element={<Vessels />} />
        <Route path="/infrastructure" element={<Infrastructure />} />
        {/* Rotas antigas redirecionadas */}
        <Route path="/schedule" element={<Navigate to="/planning" replace />} />
        <Route path="/dock" element={<Navigate to="/infrastructure" replace />} />
        <Route path="/weather" element={<div><h1 className="text-3xl font-bold">Maré & Clima</h1><p className="text-muted-foreground">Em desenvolvimento — dados SIMULADOS no dashboard.</p></div>} />
        <Route path="/settings" element={<div><h1 className="text-3xl font-bold">Configurações</h1><p className="text-muted-foreground">Em desenvolvimento...</p></div>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
    </PortCallStoreProvider>
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
