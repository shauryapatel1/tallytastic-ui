
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.log(`Element with id ${sectionId} not found`);
    }
  };

  const handleLoginClick = () => {
    navigate("/auth");
  };

  const handleDashboardClick = () => {
    navigate("/dashboard");
  };

  const handleLogoutClick = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

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
            <a 
              href="#features" 
              onClick={(e) => scrollToSection(e, 'features')}
              className="text-sm hover:text-primary/80 transition-colors"
            >
              Features
            </a>
            <a 
              href="#pricing" 
              onClick={(e) => scrollToSection(e, 'pricing')}
              className="text-sm hover:text-primary/80 transition-colors"
            >
              Pricing
            </a>
            <a 
              href="#testimonials" 
              onClick={(e) => scrollToSection(e, 'testimonials')}
              className="text-sm hover:text-primary/80 transition-colors"
            >
              Testimonials
            </a>
            <a 
              href="#faq" 
              onClick={(e) => scrollToSection(e, 'faq')}
              className="text-sm hover:text-primary/80 transition-colors"
            >
              FAQ
            </a>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDashboardClick}
                >
                  Dashboard
                </Button>
                <Button size="sm" onClick={handleLogoutClick}>
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLoginClick}
                >
                  Log in
                </Button>
                <Button
                  size="sm"
                  onClick={handleLoginClick}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
