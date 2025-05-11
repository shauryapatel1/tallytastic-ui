
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const CTA = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-24 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-4xl font-playfair font-semibold mb-6">
              Ready to transform your form experience?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who create beautiful, intelligent forms with FormCraft. 
              Start for free, no credit card required.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate("/auth")}
                className="bg-white text-indigo-700 hover:bg-white/90 px-8"
              >
                Get started for free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-white text-white hover:bg-white/10"
              >
                View pricing
              </Button>
            </div>
            
            <p className="text-white/70 text-sm">
              No credit card required • Free plan available • Cancel anytime
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
