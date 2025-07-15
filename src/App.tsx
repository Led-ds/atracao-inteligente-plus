
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
