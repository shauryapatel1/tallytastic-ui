
import { Button } from "@/components/ui/button";
import { LogoIcon } from "@/components/ui/logo";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const Footer = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleLinkClick = (path: string, external: boolean = false) => {
    if (external) {
      window.open(path, "_blank");
    } else if (path.startsWith("#")) {
      document.querySelector(path)?.scrollIntoView({ behavior: "smooth" });
    } else {
      toast({
        title: "Navigation",
        description: "Sign in to access this page",
      });
      navigate("/auth");
    }
  };
  
  const footerLinks = [
    {
      title: "Product",
      links: [
        { label: "Features", path: "#features" },
        { label: "Pricing", path: "#pricing" },
        { label: "Templates", path: "/dashboard/templates" },
        { label: "Integrations", path: "/dashboard/integrations" },
        { label: "Enterprise", path: "/enterprise" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Documentation", path: "/docs" },
        { label: "Tutorials", path: "/tutorials" },
        { label: "Blog", path: "/blog" },
        { label: "API Reference", path: "/api" },
        { label: "Developer Guide", path: "/developers" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", path: "/about" },
        { label: "Careers", path: "/careers" },
        { label: "Contact", path: "/contact" },
        { label: "Partners", path: "/partners" },
        { label: "Terms", path: "/terms", external: true },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Help Center", path: "/help" },
        { label: "Community Forum", path: "/community" },
        { label: "Status", path: "https://status.formcraft.com", external: true },
        { label: "Security", path: "/security" },
        { label: "Privacy", path: "/privacy", external: true },
      ],
    },
  ];

  return (
    <footer className="bg-primary-foreground border-t">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <LogoIcon className="h-8 w-8" />
              <span className="font-semibold text-lg">FormCraft</span>
            </div>
            <p className="text-sm text-primary/60 mb-4 max-w-xs">
              The fastest way to create beautiful forms that convert. No coding required.
            </p>
            <div className="flex gap-4">
              <Button
                size="icon"
                variant="outline"
                onClick={() => handleLinkClick("https://twitter.com/formcraft", true)}
                className="rounded-full hover:bg-blue-50 hover:border-blue-200 hover:text-blue-500 transition-colors"
              >
                <TwitterIcon className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={() => handleLinkClick("https://github.com/formcraft", true)}
                className="rounded-full hover:bg-slate-800 hover:border-slate-800 hover:text-white transition-colors"
              >
                <GithubIcon className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={() => handleLinkClick("https://linkedin.com/company/formcraft", true)}
                className="rounded-full hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-colors"
              >
                <LinkedinIcon className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={() => handleLinkClick("https://youtube.com/formcraft", true)}
                className="rounded-full hover:bg-red-500 hover:border-red-500 hover:text-white transition-colors"
              >
                <YoutubeIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="font-medium mb-4">{group.title}</h3>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => handleLinkClick(link.path, link.external)}
                      className="text-primary/60 hover:text-primary transition-colors text-sm"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-accent/20 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-primary/60">
            &copy; {new Date().getFullYear()} FormCraft, Inc. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <button
              onClick={() => handleLinkClick("/terms", true)}
              className="text-sm text-primary/60 hover:text-primary transition-colors"
            >
              Terms
            </button>
            <button
              onClick={() => handleLinkClick("/privacy", true)}
              className="text-sm text-primary/60 hover:text-primary transition-colors"
            >
              Privacy
            </button>
            <button
              onClick={() => handleLinkClick("/cookies", true)}
              className="text-sm text-primary/60 hover:text-primary transition-colors"
            >
              Cookies
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-1-4.8 4-8.9 8-5 1.6-1 3-2.2 3.8-4z" />
  </svg>
);

const GithubIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <path d="m10 15 5-3-5-3z" />
  </svg>
);
