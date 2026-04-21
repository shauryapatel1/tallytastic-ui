
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Pricing } from "@/components/Pricing";
import { FAQ } from "@/components/FAQ";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Trust } from "@/components/landing/Trust";
import { CodeShowcase } from "@/components/landing/CodeShowcase";
import { DeveloperFeatures } from "@/components/landing/DeveloperFeatures";
import { WebhookShowcase } from "@/components/landing/WebhookShowcase";
import { UseCases } from "@/components/landing/UseCases";

const Index = () => {
  return (
    <motion.div
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Navbar />
      <Hero />
      <Trust />
      <CodeShowcase />
      <DeveloperFeatures />
      <WebhookShowcase />
      <UseCases />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </motion.div>
  );
};

export default Index;
