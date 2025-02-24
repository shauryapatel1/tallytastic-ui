
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <a
            href="/"
            className="text-xl font-playfair font-semibold tracking-tight"
          >
            FormCraft
          </a>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm hover:text-primary/80 transition-colors">
              Features
            </a>
            <a href="#templates" className="text-sm hover:text-primary/80 transition-colors">
              Templates
            </a>
            <a href="#pricing" className="text-sm hover:text-primary/80 transition-colors">
              Pricing
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              Log in
            </Button>
            <Button size="sm">Get Started</Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
