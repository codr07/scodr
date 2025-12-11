import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Terminal as TerminalIcon, ChevronRight } from "lucide-react";

interface Command {
  id: string;
  command: string;
  description: string;
  response: string;
}

interface HistoryEntry {
  type: "input" | "output" | "error";
  content: string;
}

export const Terminal = () => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([
    { type: "output", content: "Welcome to CODR Terminal. Type 'help' to see available commands." }
  ]);
  const [commands, setCommands] = useState<Command[]>([]);
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

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    
    if (!trimmedCmd) return;

    setHistory(prev => [...prev, { type: "input", content: `$ ${trimmedCmd}` }]);

    if (trimmedCmd === "clear") {
      setHistory([{ type: "output", content: "Terminal cleared. Type 'help' for commands." }]);
      return;
    }

    if (trimmedCmd === "help") {
      const helpOutput = commands
        .filter(c => c.command !== "clear")
        .map(c => `  ${c.command.padEnd(12)} - ${c.description}`)
        .join("\n");
      setHistory(prev => [...prev, { 
        type: "output", 
        content: `Available commands:\n${helpOutput}\n  clear        - Clear the terminal` 
      }]);
      return;
    }

    const foundCommand = commands.find(c => c.command === trimmedCmd);
    if (foundCommand) {
      if (foundCommand.response === "SYSTEM_HELP") {
        const helpOutput = commands
          .filter(c => c.command !== "clear")
          .map(c => `  ${c.command.padEnd(12)} - ${c.description}`)
          .join("\n");
        setHistory(prev => [...prev, { 
          type: "output", 
          content: `Available commands:\n${helpOutput}\n  clear        - Clear the terminal` 
        }]);
      } else if (foundCommand.response === "SYSTEM_CLEAR") {
        setHistory([{ type: "output", content: "Terminal cleared. Type 'help' for commands." }]);
      } else {
        setHistory(prev => [...prev, { type: "output", content: foundCommand.response }]);
      }
    } else {
      setHistory(prev => [...prev, { 
        type: "error", 
        content: `Command not found: ${trimmedCmd}. Type 'help' for available commands.` 
      }]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCommand(input);
    setInput("");
  };

  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="rounded-lg border border-border bg-card/80 backdrop-blur-sm overflow-hidden shadow-lg">
        {/* Terminal Header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div className="flex items-center gap-2 ml-2">
            <TerminalIcon className="w-4 h-4 text-primary" />
            <span className="text-sm font-mono text-muted-foreground">codr@terminal</span>
          </div>
        </div>

        {/* Terminal Body */}
        <div 
          ref={terminalRef}
          onClick={handleTerminalClick}
          className="h-64 overflow-y-auto p-4 font-mono text-sm cursor-text"
        >
          {history.map((entry, index) => (
            <div 
              key={index} 
              className={`mb-2 whitespace-pre-wrap ${
                entry.type === "input" 
                  ? "text-primary" 
                  : entry.type === "error" 
                    ? "text-destructive" 
                    : "text-muted-foreground"
              }`}
            >
              {entry.content}
            </div>
          ))}
          
          {/* Input Line */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-primary flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-foreground font-mono"
              placeholder="Type a command..."
              autoFocus
            />
          </form>
        </div>
      </div>
    </div>
  );
};
