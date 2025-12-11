import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

interface HistoryEntry {
  type: "input" | "output" | "error" | "system";
  content: string;
  isHtml?: boolean;
}

interface Command {
  id: string;
  command: string;
  description: string;
  response: string;
}

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
];

const NEOFETCH = `
<span class="text-secondary">       visitor@portfolio</span>
       <span class="text-muted-foreground">------------------</span>
<span class="text-accent">OS:</span>     Human v28.0
<span class="text-accent">Host:</span>   Bengaluru, India
<span class="text-accent">Shell:</span>  Full Stack Developer
<span class="text-accent">DE:</span>     Data Scientist
<span class="text-accent">Uptime:</span> 28 years
<span class="text-accent">Memory:</span> ∞ ideas / ∞ total

<span class="text-secondary">Tech Stack:</span> MERN, Data Analytics
<span class="text-secondary">Languages:</span>  Python, C/C++, Java, JavaScript, TypeScript

<span class="text-secondary">Contact:</span> <a href="mailto:codr.sankha.contact@gmail.com" class="text-primary hover:underline">codr.sankha.contact@gmail.com</a>
<span class="text-secondary">GitHub:</span>  <a href="https://github.com/codr07" target="_blank" class="text-primary hover:underline">github.com/codr07</a>
<span class="text-secondary">LinkedIn:</span> <a href="https://linkedin.com/in/sankhasaha" target="_blank" class="text-primary hover:underline">linkedin.com/in/sankhasaha</a>
`;

const PROJECTS_DATA = [
  { name: "portfolio-terminal", size: "4.0K", date: "Dec 11", desc: "Interactive terminal-style portfolio website built with React & TypeScript" },
  { name: "data-analytics-dashboard", size: "2.5K", date: "Nov 20", desc: "Real-time data visualization dashboard using Power BI and Python" },
  { name: "ml-prediction-models", size: "3.2K", date: "Oct 15", desc: "Machine learning models for predictive analytics using TensorFlow" },
  { name: "mern-stack-apps", size: "1.8K", date: "Sep 28", desc: "Full-stack web applications built with MongoDB, Express, React, Node.js" },
];

const CONTACT_OUTPUT = `
<span class="text-primary">Contact Information:</span>
  <span class="text-accent">Email:</span>    <a href="mailto:codr.sankha.contact@gmail.com" class="text-secondary hover:underline">codr.sankha.contact@gmail.com</a>
  <span class="text-accent">GitHub:</span>   <a href="https://github.com/codr07" target="_blank" class="text-secondary hover:underline">github.com/codr07</a>
  <span class="text-accent">LinkedIn:</span> <a href="https://linkedin.com/in/sankhasaha" target="_blank" class="text-secondary hover:underline">linkedin.com/in/sankhasaha</a>

<span class="text-muted-foreground">Or navigate to /contact for the full contact form.</span>
`;

export const Terminal = () => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [commands, setCommands] = useState<Command[]>([]);
  const [booted, setBooted] = useState(false);
  const [bootIndex, setBootIndex] = useState(0);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCommands = async () => {
      const { data } = await supabase
        .from("terminal_commands")
        .select("*")
        .order("command");
      if (data) setCommands(data);
    };
    fetchCommands();
  }, []);

  // Boot sequence
  useEffect(() => {
    if (bootIndex < BOOT_MESSAGES.length) {
      const timer = setTimeout(() => {
        setHistory(prev => [...prev, { type: "system", content: BOOT_MESSAGES[bootIndex] }]);
        setBootIndex(prev => prev + 1);
      }, 120);
      return () => clearTimeout(timer);
    } else if (!booted) {
      setBooted(true);
    }
  }, [bootIndex, booted]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const generateProjectsList = () => {
    let output = `<span class="text-primary">Projects Directory:</span>\n\n`;
    PROJECTS_DATA.forEach(p => {
      output += `<span class="text-secondary">drwxr-xr-x</span>  <span class="text-primary">codr07</span>  <span class="text-accent">${p.size}</span>  <span class="text-muted-foreground">${p.date}</span>  <button class="text-accent hover:underline cursor-pointer project-btn" data-project="${p.name}">${p.name}/</button>\n`;
    });
    output += `\n<span class="text-muted-foreground">Click a project name to view details, or type: cat [project_name]</span>`;
    output += `\n<span class="text-muted-foreground">View all at:</span> <a href="https://github.com/codr07" target="_blank" class="text-primary hover:underline">github.com/codr07</a>`;
    return output;
  };

  const getProjectDetails = (name: string) => {
    const project = PROJECTS_DATA.find(p => p.name === name || p.name === name.replace("/", ""));
    if (project) {
      return `
<span class="text-primary">=== ${project.name} ===</span>
<span class="text-accent">Description:</span> ${project.desc}
<span class="text-accent">Size:</span>        ${project.size}
<span class="text-accent">Modified:</span>    ${project.date}
<span class="text-accent">Link:</span>        <a href="https://github.com/codr07" target="_blank" class="text-secondary hover:underline">github.com/codr07/${project.name}</a>
`;
    }
    return `<span class="text-destructive">cat: ${name}: No such file or directory</span>`;
  };

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    if (!trimmedCmd) return;

    setHistory(prev => [...prev, { type: "input", content: `visitor@portfolio:~$ ${trimmedCmd}` }]);

    // Handle cat command
    if (trimmedCmd.startsWith("cat ")) {
      const projectName = trimmedCmd.replace("cat ", "").trim();
      setHistory(prev => [...prev, { type: "output", content: getProjectDetails(projectName), isHtml: true }]);
      return;
    }

    switch (trimmedCmd) {
      case "help":
        const defaultCmds = [
          { cmd: "help", desc: "Display this help message" },
          { cmd: "about", desc: "Display information about me (neofetch style)" },
          { cmd: "projects", desc: "List my projects" },
          { cmd: "contact", desc: "Get my contact information" },
          { cmd: "clear", desc: "Clear the terminal" },
        ];
        const customCmds = commands.filter(c => !["help", "about", "clear", "projects", "contact"].includes(c.command));
        
        let helpOutput = `<span class="text-primary">Available Commands:</span>\n`;
        defaultCmds.forEach(c => {
          helpOutput += `  <span class="text-secondary">${c.cmd.padEnd(12)}</span> - ${c.desc}\n`;
        });
        customCmds.forEach(c => {
          helpOutput += `  <span class="text-secondary">${c.command.padEnd(12)}</span> - ${c.description}\n`;
        });
        setHistory(prev => [...prev, { type: "output", content: helpOutput, isHtml: true }]);
        break;

      case "about":
        setHistory(prev => [...prev, { type: "output", content: NEOFETCH, isHtml: true }]);
        break;

      case "projects":
        setHistory(prev => [...prev, { type: "output", content: generateProjectsList(), isHtml: true }]);
        break;

      case "contact":
        setHistory(prev => [...prev, { type: "output", content: CONTACT_OUTPUT, isHtml: true }]);
        break;

      case "clear":
        setHistory([]);
        setBootIndex(0);
        setBooted(false);
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

  const handleTerminalClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains("project-btn")) {
      const projectName = target.getAttribute("data-project");
      if (projectName) {
        handleCommand(`cat ${projectName}`);
      }
      return;
    }
    inputRef.current?.focus();
  };

  const simulateCommand = (cmd: string) => {
    setInput(cmd);
    setTimeout(() => {
      handleCommand(cmd);
      setInput("");
    }, 200);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="rounded-lg border border-border bg-card/80 backdrop-blur-sm overflow-hidden shadow-lg">
        {/* Terminal Header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-destructive/80" />
            <div className="w-3 h-3 rounded-full bg-accent/80" />
            <div className="w-3 h-3 rounded-full bg-primary/80" />
          </div>
          <span className="text-sm font-mono text-muted-foreground ml-2">visitor@portfolio ~ bash</span>
        </div>

        {/* Terminal Body */}
        <div 
          ref={terminalRef}
          onClick={handleTerminalClick}
          className="h-80 overflow-y-auto p-4 font-mono text-sm cursor-text"
        >
          {history.map((entry, index) => (
            <div 
              key={index} 
              className={`mb-1 whitespace-pre-wrap ${
                entry.type === "input" ? "text-primary" :
                entry.type === "error" ? "text-destructive" :
                entry.type === "system" ? "text-muted-foreground text-xs" :
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
          
          {/* Input Line */}
          {booted && (
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <span className="text-primary text-sm">visitor@portfolio:~$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-foreground font-mono text-sm"
                autoFocus
              />
              <span className="w-2 h-4 bg-primary cursor-blink" />
            </form>
          )}
        </div>

        {/* Quick Command Buttons */}
        {booted && (
          <div className="px-4 py-3 bg-muted/30 border-t border-border">
            <div className="flex flex-wrap gap-2">
              {["help", "about", "projects", "contact", "clear"].map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => simulateCommand(cmd)}
                  className="px-3 py-1.5 text-xs font-mono bg-card hover:bg-muted text-foreground rounded border border-border hover:border-primary transition-all hover:shadow-[0_0_10px_hsl(var(--primary)/0.3)]"
                >
                  {cmd}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};