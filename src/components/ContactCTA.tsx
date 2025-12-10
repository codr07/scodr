import { Mail, MessageSquare } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

export const ContactCTA = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Terminal prompt */}
          <div className="inline-block mb-8 px-4 py-2 rounded-lg border border-border bg-card/50 backdrop-blur-sm">
            <code className="text-sm text-muted-foreground">
              <span className="text-primary">$</span> echo "Let's connect!"
            </code>
          </div>

          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            <span className="text-primary text-glow">Got a project</span>
            <br />
            <span className="gradient-text">in mind?</span>
          </h2>

          <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
            Whether it's a data science challenge, a tech collaboration, or just a chat about the latest in AI — I'm always up for connecting with fellow tech enthusiasts.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild variant="neon" size="xl">
              <Link to="/contact">
                <MessageSquare className="w-5 h-5 mr-2" />
                Start a Conversation
              </Link>
            </Button>
            <Button asChild variant="neon-blue" size="xl">
              <a href="mailto:contact@sankhasaha.dev">
                <Mail className="w-5 h-5 mr-2" />
                Send Email
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
