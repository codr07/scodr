import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import codrLogo from "@/assets/codr-logo.png";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Blog", path: "/blog" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img src={codrLogo} alt="CODR Logo" className="w-10 h-10 object-contain" />
            <span className="font-display text-xl text-primary text-glow tracking-wider">
              CODR<span className="text-secondary">07</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "relative font-mono text-sm uppercase tracking-widest transition-all duration-300",
                  location.pathname === link.path
                    ? "text-primary text-glow"
                    : "text-muted-foreground hover:text-primary"
                )}
              >
                {location.pathname === link.path && (
                  <span className="absolute -left-4 text-primary">&gt;</span>
                )}
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border animate-in slide-in-from-top-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block py-3 font-mono text-sm uppercase tracking-widest transition-all",
                  location.pathname === link.path
                    ? "text-primary text-glow"
                    : "text-muted-foreground hover:text-primary hover:pl-4"
                )}
              >
                <span className="text-primary mr-2">&gt;</span>
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};
