import { useEffect, useState } from "react";
import { ChevronDown, MapPin, GraduationCap } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useParallax } from "@/hooks/useScrollAnimation";

const roles = [
  "Data Scientist",
  "ML Engineer", 
  "Full Stack Developer",
  "Tech Enthusiast",
];

export const HeroSection = () => {
  const [currentRole, setCurrentRole] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const role = roles[currentRole];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < role.length) {
          setDisplayText(role.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentRole((prev) => (prev + 1) % roles.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentRole]);

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-grid overflow-hidden">
      {/* Parallax background elements */}
      <div className="absolute inset-0 bg-scanlines pointer-events-none opacity-50" />
      <div 
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        style={{ transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.15}px)` }}
      />
      <div 
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
        style={{ transform: `translate(${-scrollY * 0.08}px, ${scrollY * 0.12}px)` }}
      />
      <div 
        className="absolute top-1/3 right-1/3 w-64 h-64 bg-accent/5 rounded-full blur-2xl"
        style={{ transform: `translate(${scrollY * 0.05}px, ${-scrollY * 0.1}px)` }}
      />
      
      {/* Floating particles with parallax */}
      <div 
        className="absolute top-20 left-20 w-2 h-2 bg-primary/50 rounded-full"
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      />
      <div 
        className="absolute top-40 right-32 w-3 h-3 bg-secondary/50 rounded-full"
        style={{ transform: `translateY(${scrollY * 0.25}px)` }}
      />
      <div 
        className="absolute bottom-40 left-32 w-2 h-2 bg-accent/50 rounded-full"
        style={{ transform: `translateY(${scrollY * 0.2}px)` }}
      />
      
      <div 
        className="container mx-auto px-4 py-20 relative z-10"
        style={{ transform: `translateY(${scrollY * 0.1}px)`, opacity: Math.max(0, 1 - scrollY / 600) }}
      >
        <div className="max-w-4xl mx-auto text-center">
          {/* Terminal-style intro */}
          <div className="inline-block mb-8 px-4 py-2 rounded-lg border border-border bg-card/50 backdrop-blur-sm">
            <code className="text-sm text-muted-foreground">
              <span className="text-primary">$</span> whoami
            </code>
          </div>

          {/* Name */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
            <span className="text-primary text-glow animate-flicker">SANKHA</span>
            <br />
            <span className="gradient-text">SAHA</span>
          </h1>

          {/* Animated Role */}
          <div className="h-12 mb-8 flex items-center justify-center">
            <span className="font-mono text-xl md:text-2xl text-secondary">
              &gt; {displayText}
              <span className="animate-pulse text-primary">|</span>
            </span>
          </div>

          {/* Info badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/30 backdrop-blur-sm">
              <GraduationCap className="w-4 h-4 text-secondary" />
              <span className="text-sm text-muted-foreground">M.Sc Data Science, Amity University</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/30 backdrop-blur-sm">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Kolkata → Bengaluru</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild variant="neon" size="xl">
              <Link to="/blog">
                <span className="mr-2">&lt;</span>
                Read Blog
                <span className="ml-2">/&gt;</span>
              </Link>
            </Button>
            <Button asChild variant="neon-blue" size="xl">
              <Link to="/contact">Connect</Link>
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-primary" />
        </div>
      </div>
    </section>
  );
};
