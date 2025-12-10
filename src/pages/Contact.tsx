import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Github, Linkedin, Twitter, Mail, Send, MapPin, Terminal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const socialLinks = [
  { icon: Github, href: "https://github.com/codr07", label: "GitHub", username: "@codr07" },
  { icon: Linkedin, href: "https://linkedin.com/in/sankhasaha", label: "LinkedIn", username: "sankhasaha" },
  { icon: Twitter, href: "https://twitter.com/SankhaSaha6", label: "Twitter", username: "@SankhaSaha6" },
  { icon: Mail, href: "mailto:codr.sankha.contact@gmail.com", label: "Email", username: "codr.sankha.contact@gmail.com" },
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Message sent!",
      description: "Thanks for reaching out. I'll get back to you soon.",
    });

    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="max-w-3xl mb-12">
            <code className="text-sm text-muted-foreground font-mono">
              <span className="text-primary">$</span> nc -l 8080 # listening for connections...
            </code>
            <h1 className="font-display text-5xl md:text-6xl font-bold mt-4 mb-6">
              <span className="text-primary text-glow">Get in</span>{" "}
              <span className="gradient-text">Touch</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Have a project in mind? Want to collaborate? Or just want to say hi? 
              Drop me a message and I'll get back to you as soon as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl">
            {/* Contact Form */}
            <div className="p-8 rounded-lg border border-border bg-card/50 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-6">
                <Terminal className="w-5 h-5 text-primary" />
                <span className="font-mono text-sm text-muted-foreground">
                  <span className="text-primary">$</span> compose_message
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-muted-foreground font-mono text-sm">
                      name<span className="text-primary">:</span>
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      required
                      className="bg-background border-border focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-muted-foreground font-mono text-sm">
                      email<span className="text-primary">:</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                      required
                      className="bg-background border-border focus:border-primary"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-muted-foreground font-mono text-sm">
                    subject<span className="text-primary">:</span>
                  </Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Project Collaboration"
                    required
                    className="bg-background border-border focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-muted-foreground font-mono text-sm">
                    message<span className="text-primary">:</span>
                  </Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell me about your project..."
                    required
                    rows={6}
                    className="bg-background border-border focus:border-primary resize-none"
                  />
                </div>

                <Button type="submit" variant="neon" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="animate-pulse">Sending...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              {/* Location */}
              <div className="p-6 rounded-lg border border-border bg-card/50 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-primary">Location</h3>
                </div>
                <p className="text-muted-foreground">
                  <span className="text-secondary">Origin:</span> Kolkata, West Bengal
                  <br />
                  <span className="text-secondary">Current:</span> Bengaluru, Karnataka
                </p>
              </div>

              {/* Social Links */}
              <div className="p-6 rounded-lg border border-border bg-card/50 backdrop-blur-sm">
                <h3 className="font-display text-lg font-semibold text-secondary mb-6">
                  <span className="text-primary">&gt;</span> Connect
                </h3>
                <div className="space-y-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all duration-300 group"
                    >
                      <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                        <social.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div>
                        <p className="font-mono text-sm text-foreground group-hover:text-primary transition-colors">
                          {social.label}
                        </p>
                        <p className="text-xs text-muted-foreground">{social.username}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="p-6 rounded-lg border border-secondary/50 bg-secondary/5 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                  <span className="font-mono text-sm text-secondary">Available for opportunities</span>
                </div>
                <p className="text-muted-foreground text-sm">
                  Currently open to freelance projects, collaborations, and interesting tech discussions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
