import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LayoutDashboard } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import codrLogo from "@/assets/codr-logo.png";
import { supabase } from "@/integrations/supabase/client";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Blog", path: "/blog" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .eq("role", "admin")
          .maybeSingle();
        setIsAdmin(!!roleData);
      } else {
        setIsAdmin(false);
      }
    };

    checkAdmin();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      setTimeout(checkAdmin, 0);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <img src={codrLogo} alt="CODR Logo" className="w-10 h-10 object-contain" />
            <span className="font-display text-xl text-primary text-glow tracking-wider relative overflow-hidden">
              <span className={cn(
                "inline-block transition-all duration-500",
                isHovered ? "opacity-0 -translate-y-full" : "opacity-100 translate-y-0"
              )}>
                Sankha Saha
              </span>
              <span className={cn(
                "absolute left-0 top-0 transition-all duration-500",
                isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"
              )}>
                CODR<span className="text-secondary">®</span>
              </span>
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
            {isAdmin && (
              <Link
                to="/admin"
                className={cn(
                  "relative font-mono text-sm uppercase tracking-widest transition-all duration-300 flex items-center gap-1",
                  location.pathname === "/admin"
                    ? "text-primary text-glow"
                    : "text-muted-foreground hover:text-primary"
                )}
              >
                {location.pathname === "/admin" && (
                  <span className="absolute -left-4 text-primary">&gt;</span>
                )}
                <LayoutDashboard className="w-4 h-4" />
                Admin
              </Link>
            )}
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
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block py-3 font-mono text-sm uppercase tracking-widest transition-all flex items-center gap-2",
                  location.pathname === "/admin"
                    ? "text-primary text-glow"
                    : "text-muted-foreground hover:text-primary hover:pl-4"
                )}
              >
                <span className="text-primary mr-2">&gt;</span>
                <LayoutDashboard className="w-4 h-4" />
                Admin
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};