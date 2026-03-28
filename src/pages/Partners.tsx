import Navbar from "@/components/Navbar";
import DarkSection from "@/components/DarkSection";
import JsonLd from "@/components/JsonLd";
import { lazy, Suspense } from "react";

const Footer = lazy(() => import("@/components/Footer"));

const Partners = () => (
  <div className="min-h-screen bg-background">
    <JsonLd
      title="Become a Partner — Voicera"
      description="Join the Voicera Partner Program. Integrate our APIs, access co-marketing resources, and earn recurring revenue."
      path="/partners"
    />
    <Navbar />
    <div className="pt-20">
      <DarkSection />
    </div>
    <Suspense fallback={<div className="min-h-[200px]" />}>
      <Footer />
    </Suspense>
  </div>
);

export default Partners;
