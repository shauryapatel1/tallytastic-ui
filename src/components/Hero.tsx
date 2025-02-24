
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const Hero = () => {
  return (
    <div className="min-h-screen pt-16 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="relative">
          {/* Background pattern */}
          <div className="absolute inset-0 hero-pattern opacity-10 -z-10" />
          
          {/* Content */}
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center">
            <div className="space-y-6 max-w-3xl">
              <div className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-secondary/80 backdrop-blur-sm">
                <span className="text-primary/80">
                  New: AI form suggestions are here
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-playfair font-semibold tracking-tight leading-tight md:leading-tight">
                Create beautiful forms 
                <span className="text-primary/80"> in minutes</span>
              </h1>
              
              <p className="text-lg md:text-xl text-primary/60 max-w-2xl mx-auto">
                Design stunning forms with our intuitive builder. No coding required.
                Get started in seconds.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Button size="lg" className="w-full sm:w-auto">
                  Start building for free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  See templates
                </Button>
              </div>
            </div>

            {/* Form Preview */}
            <div className="mt-16 w-full max-w-2xl mx-auto p-6">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white/50 backdrop-blur-sm border border-accent/20 float">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/5" />
                <div className="relative p-6 space-y-6">
                  <div className="space-y-2">
                    <div className="h-4 w-1/4 bg-primary/5 rounded animate-pulse" />
                    <div className="h-10 bg-primary/5 rounded animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-1/3 bg-primary/5 rounded animate-pulse" />
                    <div className="h-10 bg-primary/5 rounded animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-1/2 bg-primary/5 rounded animate-pulse" />
                    <div className="h-24 bg-primary/5 rounded animate-pulse" />
                  </div>
                  <div className="h-10 w-1/4 bg-primary/80 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
