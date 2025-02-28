
import { Button } from "@/components/ui/button";
import { ArrowRight, MousePointerClick, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen pt-16 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="relative">
          {/* Background pattern */}
          <div className="absolute inset-0 hero-pattern opacity-10 -z-10" />
          
          {/* Animated particles */}
          <div className="absolute inset-0 -z-5 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-indigo-400/30"
                initial={{ 
                  x: Math.random() * window.innerWidth, 
                  y: Math.random() * window.innerHeight,
                  opacity: 0.3 + Math.random() * 0.5
                }}
                animate={{ 
                  x: [
                    Math.random() * window.innerWidth,
                    Math.random() * window.innerWidth,
                    Math.random() * window.innerWidth
                  ],
                  y: [
                    Math.random() * window.innerHeight,
                    Math.random() * window.innerHeight,
                    Math.random() * window.innerHeight
                  ],
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 15 + Math.random() * 20,
                  ease: "linear"
                }}
                style={{ 
                  width: (3 + Math.random() * 6) + 'px',
                  height: (3 + Math.random() * 6) + 'px',
                }}
              />
            ))}
          </div>
          
          {/* Content */}
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center">
            <motion.div 
              className="space-y-6 max-w-3xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.div 
                className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-indigo-100/80 backdrop-blur-sm border border-indigo-200"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.7 }}
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-indigo-700 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  New: AI form suggestions are here
                </span>
              </motion.div>
              
              <motion.h1 
                className="text-4xl md:text-6xl font-playfair font-semibold tracking-tight leading-tight md:leading-tight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Create beautiful forms 
                <motion.span 
                  className="text-primary/80 relative inline-block"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <span className="relative z-10"> in minutes</span>
                  <motion.span 
                    className="absolute bottom-1 left-0 right-0 h-3 bg-indigo-100 -z-10"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.8, delay: 1 }}
                  />
                </motion.span>
              </motion.h1>
              
              <motion.p 
                className="text-lg md:text-xl text-primary/60 max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.9 }}
              >
                Design stunning forms with our intuitive builder. No coding required.
                Get started in seconds.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
                  onClick={() => navigate("/auth")}
                >
                  <span className="relative">
                    Start building for free
                    <motion.span 
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-white/40"
                      initial={{ width: 0 }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </span>
                  <motion.div
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </motion.div>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 transition-all"
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <MousePointerClick className="mr-2 h-4 w-4" />
                  See templates
                </Button>
              </motion.div>
            </motion.div>

            {/* Form Preview */}
            <motion.div 
              className="mt-16 w-full max-w-2xl mx-auto p-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.5 }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white/70 backdrop-blur-sm border border-accent/20 hover:shadow-indigo-200/30 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/5" />
                <div className="relative p-6 space-y-6">
                  <div className="space-y-2">
                    <motion.div 
                      className="h-4 w-1/4 bg-indigo-100 rounded" 
                      animate={{ width: ["20%", "25%", "22%"] }}
                      transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                    />
                    <motion.div 
                      className="h-10 bg-indigo-50 rounded" 
                      animate={{ opacity: [0.5, 0.7, 0.5] }}
                      transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                    />
                  </div>
                  <div className="space-y-2">
                    <motion.div 
                      className="h-4 w-1/3 bg-indigo-100 rounded" 
                      animate={{ width: ["30%", "33%", "28%"] }}
                      transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
                    />
                    <motion.div 
                      className="h-10 bg-indigo-50 rounded" 
                      animate={{ opacity: [0.5, 0.7, 0.5] }}
                      transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
                    />
                  </div>
                  <div className="space-y-2">
                    <motion.div 
                      className="h-4 w-1/2 bg-indigo-100 rounded" 
                      animate={{ width: ["45%", "50%", "47%"] }}
                      transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", delay: 1 }}
                    />
                    <motion.div 
                      className="h-24 bg-indigo-50 rounded" 
                      animate={{ opacity: [0.5, 0.7, 0.5] }}
                      transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", delay: 1 }}
                    />
                  </div>
                  <motion.div 
                    className="h-10 w-1/4 bg-indigo-600 rounded" 
                    animate={{ 
                      scale: [1, 1.02, 1],
                      boxShadow: [
                        "0 0 0 0 rgba(99, 102, 241, 0)",
                        "0 0 0 4px rgba(99, 102, 241, 0.1)",
                        "0 0 0 0 rgba(99, 102, 241, 0)"
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", delay: 1.5 }}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
