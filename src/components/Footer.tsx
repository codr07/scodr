import { Github, Linkedin, Twitter, Mail, Terminal } from "lucide-react";
import { Link } from "react-router-dom";

const socialLinks = [
  { icon: Github, href: "https://github.com/codr07", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com/in/sankhasaha", label: "LinkedIn" },
  { icon: Twitter, href: "https://twitter.com/SankhaSaha6", label: "Twitter" },
  { icon: Mail, href: "mailto:contact@sankhasaha.dev", label: "Email" },
];

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <Terminal className="w-5 h-5 text-primary" />
            <span className="font-display text-lg text-primary tracking-wider">
              SANKHA<span className="text-secondary">_</span>SAHA
            </span>
          </Link>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary hover:shadow-[0_0_15px_hsl(var(--primary)/0.3)] transition-all duration-300"
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="font-mono text-xs text-muted-foreground">
            <span className="text-primary">&copy;</span> {new Date().getFullYear()} | Built with{" "}
            <span className="text-secondary">&lt;/&gt;</span> in Bengaluru
          </p>
        </div>
      </div>
    </footer>
  );
};
