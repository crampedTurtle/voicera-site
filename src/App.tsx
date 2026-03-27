import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Sitemap from "./pages/Sitemap.tsx";
import Media from "./pages/Media.tsx";
import SolutionPageComponent, { getSolutionBySlug, solutions } from "./pages/SolutionPage.tsx";
import AdminLogin from "./pages/AdminLogin.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import AdminEditor from "./pages/AdminEditor.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/media" element={<Media />} />
            {solutions.map((s) => (
              <Route
                key={s.slug}
                path={`/solutions/${s.slug}`}
                element={<SolutionPageComponent solution={s} />}
              />
            ))}
            <Route path="/sitemap" element={<Sitemap />} />
            <Route path="/voicera-admin" element={<AdminLogin />} />
            <Route path="/voicera-admin/dashboard" element={<AdminDashboard />} />
            <Route path="/voicera-admin/editor" element={<AdminEditor />} />
            <Route path="/voicera-admin/editor/:id" element={<AdminEditor />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
