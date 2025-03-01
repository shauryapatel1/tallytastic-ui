
import { Button } from "@/components/ui/button";
import { ArrowRight, MousePointerClick, Sparkles, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export const Hero = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div className="min-h-screen pt-16 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="relative">
          {/* Background pattern with parallax effect */}
          <motion.div 
            className="absolute inset-0 hero-pattern opacity-10 -z-10"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
          />
          
          {/* Animated particles with staggered entrance */}
          <div className="absolute inset-0 -z-5 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-gradient-to-r from-indigo-400 to-purple-400"
                initial={{ 
                  x: Math.random() * window.innerWidth, 
                  y: Math.random() * window.innerHeight,
                  opacity: 0,
                  scale: 0,
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
                  opacity: [0, 0.8, 0.3],
                  scale: [0, 1, 0.7],
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 15 + Math.random() * 20,
                  ease: "linear",
                  delay: i * 0.1,
                }}
                style={{ 
                  width: (3 + Math.random() * 6) + 'px',
                  height: (3 + Math.random() * 6) + 'px',
                  filter: `blur(${Math.random() > 0.8 ? '1px' : '0px'})`,
                  boxShadow: `0 0 ${5 + Math.random() * 10}px rgba(99, 102, 241, ${0.3 + Math.random() * 0.4})`,
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
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                  </motion.div>
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
                  <motion.span 
                    className="relative z-10"
                    animate={{ color: ["#1e293b", "#4f46e5", "#1e293b"] }}
                    transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
                  > in minutes</motion.span>
                  <motion.span 
                    className="absolute bottom-1 left-0 right-0 h-3 bg-gradient-to-r from-indigo-100 to-purple-100 -z-10"
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
                <motion.div
                  onHoverStart={() => setIsHovered(true)}
                  onHoverEnd={() => setIsHovered(false)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg relative overflow-hidden"
                    onClick={() => navigate("/auth")}
                  >
                    <AnimatePresence>
                      {isHovered && (
                        <motion.span
                          className="absolute inset-0 bg-white/10"
                          initial={{ x: "-100%", opacity: 0.5 }}
                          animate={{ x: "100%", opacity: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.6, ease: "easeInOut" }}
                        />
                      )}
                    </AnimatePresence>
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
                      animate={{ x: isHovered ? 5 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </motion.div>
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full sm:w-auto hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 transition-all group"
                    onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ repeat: Infinity, repeatDelay: 3, duration: 0.5 }}
                    >
                      <MousePointerClick className="mr-2 h-4 w-4" />
                    </motion.div>
                    See templates
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Form Preview with enhanced animations */}
            <motion.div 
              className="mt-16 w-full max-w-2xl mx-auto p-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.5 }}
            >
              <motion.div 
                className="relative rounded-2xl overflow-hidden shadow-2xl bg-white/70 backdrop-blur-sm border border-accent/20 transition-all duration-500"
                whileHover={{ 
                  boxShadow: "0 25px 50px -12px rgba(99, 102, 241, 0.25)",
                  y: -5,
                }}
                initial={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 to-purple-50/30"
                  animate={{ 
                    opacity: [0.3, 0.6, 0.3],
                    background: [
                      "linear-gradient(to bottom right, rgba(238, 242, 255, 0.3), rgba(236, 252, 255, 0.3))",
                      "linear-gradient(to bottom right, rgba(224, 231, 255, 0.3), rgba(226, 232, 240, 0.3))",
                      "linear-gradient(to bottom right, rgba(238, 242, 255, 0.3), rgba(236, 252, 255, 0.3))"
                    ]
                  }}
                  transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
                />
                
                <div className="relative p-6 space-y-6">
                  <div className="space-y-2">
                    <motion.div 
                      className="h-4 bg-indigo-100 rounded overflow-hidden relative" 
                      initial={{ width: "20%" }}
                      animate={{ width: ["20%", "25%", "22%"] }}
                      transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                      />
                    </motion.div>
                    <motion.div 
                      className="h-10 bg-indigo-50 rounded overflow-hidden relative" 
                      animate={{ opacity: [0.5, 0.7, 0.5] }}
                      transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.5 }}
                      />
                    </motion.div>
                  </div>
                  <div className="space-y-2">
                    <motion.div 
                      className="h-4 bg-indigo-100 rounded overflow-hidden relative" 
                      initial={{ width: "30%" }}
                      animate={{ width: ["30%", "33%", "28%"] }}
                      transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5 }}
                      />
                    </motion.div>
                    <motion.div 
                      className="h-10 bg-indigo-50 rounded overflow-hidden relative" 
                      animate={{ opacity: [0.5, 0.7, 0.5] }}
                      transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                      />
                    </motion.div>
                  </div>
                  <div className="space-y-2">
                    <motion.div 
                      className="h-4 bg-indigo-100 rounded overflow-hidden relative" 
                      initial={{ width: "45%" }}
                      animate={{ width: ["45%", "50%", "47%"] }}
                      transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", delay: 1 }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                      />
                    </motion.div>
                    <motion.div 
                      className="h-24 bg-indigo-50 rounded overflow-hidden relative" 
                      animate={{ opacity: [0.5, 0.7, 0.5] }}
                      transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", delay: 1 }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5 }}
                      />
                    </motion.div>
                  </div>
                  <motion.div 
                    className="h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded relative overflow-hidden" 
                    initial={{ width: "25%" }}
                    whileHover={{ 
                      width: "28%", 
                      boxShadow: "0 4px 12px rgba(99, 102, 241, 0.4)" 
                    }}
                    animate={{ 
                      scale: [1, 1.02, 1],
                      boxShadow: [
                        "0 0 0 0 rgba(99, 102, 241, 0)",
                        "0 0 0 4px rgba(99, 102, 241, 0.1)",
                        "0 0 0 0 rgba(99, 102, 241, 0)"
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", delay: 1.5 }}
                  >
                    <motion.div 
                      className="absolute inset-0 flex items-center justify-center text-white text-sm font-medium"
                      animate={{ y: [0, -30, 0] }}
                      transition={{ duration: 6, repeat: Infinity, repeatDelay: 5 }}
                    >
                      Submit
                    </motion.div>
                    <motion.div 
                      className="absolute inset-0 flex items-center justify-center text-white text-sm font-medium"
                      initial={{ y: 30 }}
                      animate={{ y: [30, 0, 30] }}
                      transition={{ duration: 6, repeat: Infinity, repeatDelay: 5 }}
                    >
                      <Zap className="mr-1 h-3 w-3" />
                      Send
                    </motion.div>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
                    />
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
