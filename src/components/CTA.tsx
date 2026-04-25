
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const CTA = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-24 bg-foreground text-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-6">
              Stop gluing form backends together.
            </h2>
            <p className="text-background/70 text-lg mb-8 max-w-2xl mx-auto">
              Capture submissions, route work, and automate follow-up — with one endpoint
              and a dashboard built for the work that comes after.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate("/auth")}
                className="bg-background text-foreground hover:bg-background/90 px-8"
              >
                Start free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate("/docs")}
                className="border-background/30 bg-transparent text-background hover:bg-background/10"
              >
                Read the docs
              </Button>
            </div>
            
            <p className="text-background/60 text-sm">
              No credit card required • Free plan available • Cancel anytime
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
