import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Terminal, LogIn, Loader2, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .eq("role", "admin")
          .maybeSingle();

        if (roleData) {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setTimeout(() => {
          supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", session.user.id)
            .eq("role", "admin")
            .maybeSingle()
            .then(({ data: roleData }) => {
              if (roleData) {
                navigate("/admin");
              } else {
                navigate("/");
              }
            });
        }, 0);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({ title: "Access granted!" });
    } catch (error: any) {
      toast({
        title: "Authentication failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentDate = () => {
    return new Date().toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      year: "numeric"
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      {/* CRT Overlay */}
      <div className="crt-overlay" />

      {/* Header */}
      <header className="p-4 border-b border-border bg-card/50">
        <p className="text-sm text-muted-foreground font-mono">
          Last login: {getCurrentDate()} on ttys000
        </p>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Terminal Output */}
          <div className="mb-6 font-mono text-sm">
            <p className="text-primary">visitor@portfolio:~$ sudo login</p>
            <p className="text-muted-foreground">[sudo] password required for admin access</p>
          </div>

          <div className="p-6 rounded border border-border bg-card/50">
            <div className="flex items-center gap-2 mb-6">
              <Terminal className="w-5 h-5 text-primary" />
              <span className="font-mono text-primary text-glow">Authentication Required</span>
            </div>

            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-muted-foreground font-mono text-sm">
                  <span className="text-dracula-cyan">email</span>:
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  className="bg-background border-border focus:border-primary font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-muted-foreground font-mono text-sm">
                  <span className="text-dracula-cyan">password</span>:
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="bg-background border-border focus:border-primary font-mono"
                />
              </div>
              <Button type="submit" variant="neon" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <LogIn className="w-4 h-4 mr-2" />
                )}
                Authenticate
              </Button>
            </form>
          </div>

          <div className="mt-6 font-mono text-sm">
            <Link to="/" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span>cd ~/</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Auth;
