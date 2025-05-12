
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Testimonials } from "@/components/Testimonials";
import { Pricing } from "@/components/Pricing";
import { FAQ } from "@/components/FAQ";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { UseCaseDemo } from "@/components/UseCaseDemo";
import { Integrations } from "@/components/Integrations";
import { Benefits } from "@/components/Benefits";
import { TemplateShowcase } from "@/components/TemplateShowcase";
import { motion } from "framer-motion";
import { InteractiveDemo } from "@/components/InteractiveDemo";

const Index = () => {
  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-white to-indigo-50/30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar />
      <Hero />
      <InteractiveDemo />
      <Benefits />
      <Features />
      <TemplateShowcase />
      <UseCaseDemo />
      <Integrations />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </motion.div>
  );
};

export default Index;
