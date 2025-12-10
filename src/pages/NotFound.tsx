import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          {/* Terminal-style error */}
          <div className="inline-block mb-8 p-6 rounded-lg border border-destructive/50 bg-destructive/10">
            <code className="text-sm font-mono">
              <span className="text-destructive">Error:</span> Page not found
              <br />
              <span className="text-muted-foreground">$ ls -la ./pages/</span>
              <br />
              <span className="text-destructive">No such file or directory</span>
            </code>
          </div>

          {/* 404 */}
          <h1 className="font-display text-[150px] md:text-[200px] font-bold leading-none text-primary text-glow animate-flicker">
            404
          </h1>

          <p className="text-xl text-muted-foreground mb-8 font-mono">
            <span className="text-primary">&gt;</span> The page you're looking for doesn't exist
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild variant="neon" size="lg">
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" onClick={() => window.history.back()}>
              <span>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </span>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
