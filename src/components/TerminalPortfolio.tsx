import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface HistoryEntry {
  type: "input" | "output" | "error" | "system" | "ascii";
  content: string;
  isHtml?: boolean;
}

interface Command {
  id: string;
  command: string;
  description: string;
  response: string;
}

const ASCII_ART = `
 ██████╗ ██████╗ ██████╗ ██████╗ 
██╔════╝██╔═══██╗██╔══██╗██╔══██╗
██║     ██║   ██║██║  ██║██████╔╝
██║     ██║   ██║██║  ██║██╔══██╗
╚██████╗╚██████╔╝██████╔╝██║  ██║
 ╚═════╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝
`;

const BOOT_MESSAGES = [
  "[    0.000000] Initializing CODR Terminal v2.0...",
  "[    0.001234] Loading kernel modules...",
  "[    0.002456] Mounting /home/visitor...",
  "[    0.003789] Starting network services...",
  "[    0.004012] Loading portfolio data...",
  "[    0.005234] System ready.",
  "",
  "Welcome to Sankha Saha's Portfolio Terminal",
  'Type "help" for available commands or click the buttons below.',
  "",
];

const NEOFETCH = `
<span class="text-dracula-cyan">       visitor@portfolio</span>
       <span class="text-dracula-comment">------------------</span>
<span class="text-dracula-pink">OS:</span>     Human v28.0
<span class="text-dracula-pink">Host:</span>   Bengaluru, India
<span class="text-dracula-pink">Shell:</span>  Full Stack Developer
<span class="text-dracula-pink">DE:</span>     Data Scientist
<span class="text-dracula-pink">Uptime:</span> 28 years
<span class="text-dracula-pink">Memory:</span> ∞ ideas / ∞ total

<span class="text-dracula-cyan">Contact:</span> codr.sankha.contact@gmail.com
<span class="text-dracula-cyan">GitHub:</span>  <a href="https://github.com/codr07" target="_blank" class="text-dracula-green hover:underline">github.com/codr07</a>
<span class="text-dracula-cyan">LinkedIn:</span> <a href="https://linkedin.com/in/sankhasaha" target="_blank" class="text-dracula-green hover:underline">linkedin.com/in/sankhasaha</a>
`;

const PROJECTS_LIST = `
<span class="text-dracula-cyan">drwxr-xr-x</span>  <span class="text-dracula-green">codr07</span>  <span class="text-dracula-yellow">4.0K</span>  <span class="text-dracula-comment">Dec 11</span>  <a href="https://github.com/codr07" target="_blank" class="text-dracula-pink hover:underline">portfolio-terminal/</a>
<span class="text-dracula-cyan">drwxr-xr-x</span>  <span class="text-dracula-green">codr07</span>  <span class="text-dracula-yellow">2.5K</span>  <span class="text-dracula-comment">Nov 20</span>  <a href="https://github.com/codr07" target="_blank" class="text-dracula-pink hover:underline">data-analytics-dashboard/</a>
<span class="text-dracula-cyan">drwxr-xr-x</span>  <span class="text-dracula-green">codr07</span>  <span class="text-dracula-yellow">3.2K</span>  <span class="text-dracula-comment">Oct 15</span>  <a href="https://github.com/codr07" target="_blank" class="text-dracula-pink hover:underline">ml-prediction-models/</a>
<span class="text-dracula-cyan">drwxr-xr-x</span>  <span class="text-dracula-green">codr07</span>  <span class="text-dracula-yellow">1.8K</span>  <span class="text-dracula-comment">Sep 28</span>  <a href="https://github.com/codr07" target="_blank" class="text-dracula-pink hover:underline">mern-stack-apps/</a>

<span class="text-dracula-comment">Total: 4 projects | View all at:</span> <a href="https://github.com/codr07" target="_blank" class="text-dracula-green hover:underline">github.com/codr07</a>
`;

const SKILLS_OUTPUT = `
<span class="text-dracula-pink">Languages:</span>    Python, C/C++, C#, Java, JavaScript, TypeScript, Ruby, Assembly
<span class="text-dracula-pink">Frameworks:</span>   React, Next.js, Node.js, Express, MERN Stack
<span class="text-dracula-pink">Data Tools:</span>   Power BI, MatLab, R, Pandas, NumPy, TensorFlow
<span class="text-dracula-pink">DevOps:</span>       GitHub, Docker, VS Code, Google Colab, Slack
<span class="text-dracula-pink">Databases:</span>    PostgreSQL, MongoDB, Supabase, Firebase
`;

export const TerminalPortfolio = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [input, setInput] = useState("");
  const [commands, setCommands] = useState<Command[]>([]);
  const [booted, setBooted] = useState(false);
  const [bootIndex, setBootIndex] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Fetch commands from database
  useEffect(() => {
    const fetchCommands = async () => {
      const { data } = await supabase
        .from("terminal_commands")
        .select("*")
        .order("command");
      if (data) setCommands(data);
    };
    fetchCommands();

    // Check admin status
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
      }
    };
    checkAdmin();
  }, []);

  // Boot sequence
  useEffect(() => {
    if (bootIndex < BOOT_MESSAGES.length) {
      const timer = setTimeout(() => {
        setHistory(prev => [...prev, { type: "system", content: BOOT_MESSAGES[bootIndex] }]);
        setBootIndex(prev => prev + 1);
      }, 150);
      return () => clearTimeout(timer);
    } else if (!booted) {
      setBooted(true);
      setHistory(prev => [...prev, { type: "ascii", content: ASCII_ART }]);
    }
  }, [bootIndex, booted]);

  // Auto-scroll
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

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

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    if (!trimmedCmd) return;

    setHistory(prev => [...prev, { type: "input", content: `visitor@portfolio:~$ ${trimmedCmd}` }]);

    switch (trimmedCmd) {
      case "help":
        const helpOutput = `
<span class="text-dracula-green">Available Commands:</span>
  <span class="text-dracula-cyan">help</span>      - Display this help message
  <span class="text-dracula-cyan">about</span>     - Display information about me (neofetch style)
  <span class="text-dracula-cyan">projects</span>  - List my projects
  <span class="text-dracula-cyan">skills</span>    - Show my technical skills
  <span class="text-dracula-cyan">contact</span>   - Get my contact information
  <span class="text-dracula-cyan">blog</span>      - Navigate to blog
  <span class="text-dracula-cyan">login</span>     - Admin login
  <span class="text-dracula-cyan">clear</span>     - Clear the terminal
${commands.filter(c => !["help", "about", "clear", "skills", "contact", "blog", "github", "linkedin"].includes(c.command)).map(c => `  <span class="text-dracula-cyan">${c.command.padEnd(10)}</span> - ${c.description}`).join("\n")}
`;
        setHistory(prev => [...prev, { type: "output", content: helpOutput, isHtml: true }]);
        break;

      case "about":
        setHistory(prev => [...prev, { type: "output", content: NEOFETCH, isHtml: true }]);
        break;

      case "projects":
        setHistory(prev => [...prev, { type: "output", content: PROJECTS_LIST, isHtml: true }]);
        break;

      case "skills":
        setHistory(prev => [...prev, { type: "output", content: SKILLS_OUTPUT, isHtml: true }]);
        break;

      case "contact":
        const contactOutput = `
<span class="text-dracula-green">Contact Information:</span>
  <span class="text-dracula-pink">Email:</span>    <a href="mailto:codr.sankha.contact@gmail.com" class="text-dracula-cyan hover:underline">codr.sankha.contact@gmail.com</a>
  <span class="text-dracula-pink">GitHub:</span>   <a href="https://github.com/codr07" target="_blank" class="text-dracula-cyan hover:underline">github.com/codr07</a>
  <span class="text-dracula-pink">LinkedIn:</span> <a href="https://linkedin.com/in/sankhasaha" target="_blank" class="text-dracula-cyan hover:underline">linkedin.com/in/sankhasaha</a>
`;
        setHistory(prev => [...prev, { type: "output", content: contactOutput, isHtml: true }]);
        break;

      case "blog":
        setHistory(prev => [...prev, { type: "output", content: "Navigating to blog..." }]);
        setTimeout(() => navigate("/blog"), 500);
        break;

      case "login":
        setHistory(prev => [...prev, { type: "output", content: "Redirecting to admin login..." }]);
        setTimeout(() => navigate("/auth"), 500);
        break;

      case "admin":
        if (isAdmin) {
          setHistory(prev => [...prev, { type: "output", content: "Opening admin dashboard..." }]);
          setTimeout(() => navigate("/admin"), 500);
        } else {
          setHistory(prev => [...prev, { type: "error", content: "Permission denied. Please login first." }]);
        }
        break;

      case "clear":
        setHistory([]);
        break;

      default:
        const foundCommand = commands.find(c => c.command === trimmedCmd);
        if (foundCommand) {
          if (foundCommand.response === "SYSTEM_HELP") {
            handleCommand("help");
            return;
          } else if (foundCommand.response === "SYSTEM_CLEAR") {
            setHistory([]);
            return;
          }
          setHistory(prev => [...prev, { type: "output", content: foundCommand.response }]);
        } else {
          setHistory(prev => [...prev, { 
            type: "error", 
            content: `bash: ${trimmedCmd}: command not found. Type 'help' for available commands.` 
          }]);
        }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCommand(input);
    setInput("");
  };

  const simulateCommand = (cmd: string) => {
    setInput(cmd);
    setTimeout(() => {
      handleCommand(cmd);
      setInput("");
    }, 300);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      {/* CRT Overlay */}
      <div className="crt-overlay" />

      {/* Header - Last Login */}
      <header className="p-4 border-b border-border bg-card/50">
        <p className="text-sm text-muted-foreground font-mono">
          Last login: {getCurrentDate()} on ttys000
        </p>
      </header>

      {/* Main Terminal Area */}
      <main 
        ref={terminalRef}
        className="flex-1 overflow-y-auto p-4 pb-32"
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((entry, index) => (
          <div 
            key={index} 
            className={`mb-1 font-mono text-sm whitespace-pre-wrap ${
              entry.type === "input" ? "text-primary" :
              entry.type === "error" ? "text-destructive" :
              entry.type === "ascii" ? "text-dracula-purple text-xs leading-tight" :
              entry.type === "system" ? "text-muted-foreground" :
              "text-foreground"
            }`}
          >
            {entry.isHtml ? (
              <span dangerouslySetInnerHTML={{ __html: entry.content }} />
            ) : (
              entry.content
            )}
          </div>
        ))}
      </main>

      {/* Quick Command Buttons */}
      {booted && (
        <div className="fixed bottom-20 left-0 right-0 px-4 py-2 bg-card/80 backdrop-blur border-t border-border">
          <div className="flex flex-wrap gap-2 justify-center">
            {["help", "about", "projects", "skills", "contact", "blog"].map((cmd) => (
              <button
                key={cmd}
                onClick={() => simulateCommand(cmd)}
                className="px-3 py-1 text-xs font-mono bg-muted hover:bg-muted/80 text-foreground rounded border border-border hover:border-primary transition-colors"
              >
                {cmd}
              </button>
            ))}
            <button
              onClick={() => simulateCommand("login")}
              className="px-3 py-1 text-xs font-mono bg-accent/20 hover:bg-accent/30 text-accent rounded border border-accent/50 hover:border-accent transition-colors"
            >
              login
            </button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-card border-t border-border">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <span className="text-primary font-mono text-sm">visitor@portfolio:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-foreground font-mono text-sm"
            placeholder=""
            autoFocus
          />
          <span className="w-2 h-5 bg-primary cursor-blink" />
        </form>
      </footer>
    </div>
  );
};