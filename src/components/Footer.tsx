
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-background border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="font-playfair text-xl font-semibold">FormCraft</h3>
            <p className="text-primary/60 text-sm">
              Create beautiful forms in minutes. No coding required.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/#features" className="text-primary/60 hover:text-primary transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <span className="text-primary/40 cursor-not-allowed">
                  Templates
                </span>
              </li>
              <li>
                <Link to="/#pricing" className="text-primary/60 hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <span className="text-primary/40 cursor-not-allowed">
                  Integrations
                </span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/#faq" className="text-primary/60 hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <span className="text-primary/40 cursor-not-allowed">
                  Blog
                </span>
              </li>
              <li>
                <span className="text-primary/40 cursor-not-allowed">
                  Documentation
                </span>
              </li>
              <li>
                <span className="text-primary/40 cursor-not-allowed">
                  Community
                </span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-primary/40 cursor-not-allowed">
                  About
                </span>
              </li>
              <li>
                <span className="text-primary/40 cursor-not-allowed">
                  Careers
                </span>
              </li>
              <li>
                <span className="text-primary/40 cursor-not-allowed">
                  Privacy
                </span>
              </li>
              <li>
                <span className="text-primary/40 cursor-not-allowed">
                  Terms
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border text-sm text-primary/60">
          <p>© {new Date().getFullYear()} FormCraft. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
