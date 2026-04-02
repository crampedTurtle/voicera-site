import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Sitemap from "./pages/Sitemap.tsx";
import Media from "./pages/Media.tsx";
import BlogPost from "./pages/BlogPost.tsx";
import SolutionPageComponent, { getSolutionBySlug, solutions } from "./pages/SolutionPage.tsx";
import AdminLogin from "./pages/AdminLogin.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import AdminEditor from "./pages/AdminEditor.tsx";
import NotFound from "./pages/NotFound.tsx";
import About from "./pages/About.tsx";
import Investors from "./pages/Investors.tsx";
import Partners from "./pages/Partners.tsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.tsx";
import TermsOfUse from "./pages/TermsOfUse.tsx";
import ApiDocs from "./pages/ApiDocs.tsx";
import VoiceraLabs from "./pages/VoiceraLabs.tsx";
import SincerityForSales from "./pages/SincerityForSales.tsx";
import SincerityForHR from "./pages/SincerityForHR.tsx";
import SincerityForLawEnforcement from "./pages/SincerityForLawEnforcement.tsx";
import SincerityForDating from "./pages/SincerityForDating.tsx";
import SincerityForLegal from "./pages/SincerityForLegal.tsx";
import CookieBanner from "./components/CookieBanner.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <CookieBanner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/media" element={<Media />} />
            <Route path="/media/:slug" element={<BlogPost />} />
            <Route path="/solutions/sales" element={<SincerityForSales />} />
            <Route path="/solutions/hr" element={<SincerityForHR />} />
            <Route path="/solutions/law-enforcement" element={<SincerityForLawEnforcement />} />
            <Route path="/solutions/dating" element={<SincerityForDating />} />
            {solutions.filter((s) => s.slug !== "sales" && s.slug !== "hr" && s.slug !== "law-enforcement" && s.slug !== "dating").map((s) => (
              <Route
                key={s.slug}
                path={`/solutions/${s.slug}`}
                element={<SolutionPageComponent solution={s} />}
              />
            ))}
            <Route path="/about" element={<About />} />
            <Route path="/investors" element={<Investors />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-use" element={<TermsOfUse />} />
            <Route path="/api-docs" element={<ApiDocs />} />
            <Route path="/voicera-labs" element={<VoiceraLabs />} />
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
