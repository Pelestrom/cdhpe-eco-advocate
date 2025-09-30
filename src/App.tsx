import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Index from "./pages/Index";
import Actualites from "./pages/Actualites";
import ArticleDetail from "./pages/ArticleDetail";
import Evenement from "./pages/Evenement";
import NousSoutenir from "./pages/NousSoutenir";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col parallax-container">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/actualites" element={<Actualites />} />
              <Route path="/actualites/:slug" element={<ArticleDetail />} />
              <Route path="/evenement" element={<Evenement />} />
              <Route path="/nous-soutenir" element={<NousSoutenir />} />
              <Route path="/admin" element={<Admin />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
