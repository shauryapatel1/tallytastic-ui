
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    
    // If we're not on the home page, navigate there first
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
      return;
    }
    
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
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: "There was a problem logging you out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <a
            href="/"
            className="text-xl font-semibold tracking-tight text-foreground"
          >
            Ingrid
          </a>
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              onClick={(e) => scrollToSection(e, 'features')}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Product
            </a>
            <a
              href="#code"
              onClick={(e) => scrollToSection(e, 'code')}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Developers
            </a>
            <a
              href="#use-cases"
              onClick={(e) => scrollToSection(e, 'use-cases')}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Agencies
            </a>
            <a
              href="#pricing"
              onClick={(e) => scrollToSection(e, 'pricing')}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </a>
            <a
              href="/docs"
              onClick={(e) => { e.preventDefault(); navigate('/docs'); }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Docs
            </a>
            <a
              href="#faq"
              onClick={(e) => scrollToSection(e, 'faq')}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
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
