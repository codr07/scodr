import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Terminal, Save, X, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface Command {
  id: string;
  command: string;
  description: string;
  response: string;
}

const AdminCommands = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [commands, setCommands] = useState<Command[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ command: "", description: "", response: "" });

  useEffect(() => {
    const checkAdminAndFetch = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      // Check if user has admin role
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!roleData) {
        toast({ title: "Access denied", description: "Admin privileges required", variant: "destructive" });
        navigate("/");
        return;
      }

      setIsAdmin(true);
      fetchCommands();
    };

    checkAdminAndFetch();
  }, [navigate, toast]);

  const fetchCommands = async () => {
    const { data } = await supabase
      .from("terminal_commands")
      .select("*")
      .order("command");
    if (data) setCommands(data);
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!formData.command || !formData.description || !formData.response) {
      toast({ title: "All fields required", variant: "destructive" });
      return;
    }

    const { error } = await supabase
      .from("terminal_commands")
      .insert({
        command: formData.command.toLowerCase().trim(),
        description: formData.description.trim(),
        response: formData.response.trim()
      });

    if (error) {
      toast({ title: "Failed to add command", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Command added successfully" });
      setFormData({ command: "", description: "", response: "" });
      setShowAddForm(false);
      fetchCommands();
    }
  };

  const handleUpdate = async (id: string) => {
    const { error } = await supabase
      .from("terminal_commands")
      .update({
        command: formData.command.toLowerCase().trim(),
        description: formData.description.trim(),
        response: formData.response.trim()
      })
      .eq("id", id);

    if (error) {
      toast({ title: "Failed to update command", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Command updated successfully" });
      setEditingId(null);
      setFormData({ command: "", description: "", response: "" });
      fetchCommands();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this command?")) return;

    const { error } = await supabase
      .from("terminal_commands")
      .delete()
      .eq("id", id);

    if (error) {
      toast({ title: "Failed to delete command", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Command deleted" });
      fetchCommands();
    }
  };

  const startEdit = (cmd: Command) => {
    setEditingId(cmd.id);
    setFormData({ command: cmd.command, description: cmd.description, response: cmd.response });
    setShowAddForm(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setShowAddForm(false);
    setFormData({ command: "", description: "", response: "" });
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16 flex items-center justify-center">
          <p className="text-muted-foreground font-mono animate-pulse">Checking access...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-mono text-sm">cd ~/</span>
          </Link>

          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Terminal className="w-6 h-6 text-primary" />
                <h1 className="font-display text-3xl font-bold text-primary">Terminal Commands</h1>
              </div>
              <p className="text-muted-foreground font-mono text-sm">Manage terminal commands</p>
            </div>
            <Button onClick={() => { setShowAddForm(true); setEditingId(null); }} variant="neon">
              <Plus className="w-4 h-4 mr-2" />
              Add Command
            </Button>
          </div>

          {/* Add Form */}
          {showAddForm && (
            <div className="mb-8 p-6 rounded-lg border border-border bg-card/50">
              <h2 className="font-mono text-lg mb-4 text-primary">New Command</h2>
              <div className="space-y-4">
                <div>
                  <Label className="font-mono text-sm">Command</Label>
                  <Input
                    value={formData.command}
                    onChange={(e) => setFormData(p => ({ ...p, command: e.target.value }))}
                    placeholder="e.g., hello"
                    className="bg-background border-border"
                  />
                </div>
                <div>
                  <Label className="font-mono text-sm">Description</Label>
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                    placeholder="What this command does"
                    className="bg-background border-border"
                  />
                </div>
                <div>
                  <Label className="font-mono text-sm">Response</Label>
                  <Textarea
                    value={formData.response}
                    onChange={(e) => setFormData(p => ({ ...p, response: e.target.value }))}
                    placeholder="The output when command is run"
                    className="bg-background border-border min-h-[100px]"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAdd} variant="neon">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button onClick={cancelEdit} variant="outline">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Commands List */}
          {loading ? (
            <p className="text-muted-foreground font-mono animate-pulse">Loading commands...</p>
          ) : (
            <div className="space-y-4">
              {commands.map((cmd) => (
                <div key={cmd.id} className="p-4 rounded-lg border border-border bg-card/50">
                  {editingId === cmd.id ? (
                    <div className="space-y-4">
                      <div>
                        <Label className="font-mono text-sm">Command</Label>
                        <Input
                          value={formData.command}
                          onChange={(e) => setFormData(p => ({ ...p, command: e.target.value }))}
                          className="bg-background border-border"
                        />
                      </div>
                      <div>
                        <Label className="font-mono text-sm">Description</Label>
                        <Input
                          value={formData.description}
                          onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                          className="bg-background border-border"
                        />
                      </div>
                      <div>
                        <Label className="font-mono text-sm">Response</Label>
                        <Textarea
                          value={formData.response}
                          onChange={(e) => setFormData(p => ({ ...p, response: e.target.value }))}
                          className="bg-background border-border min-h-[100px]"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => handleUpdate(cmd.id)} variant="neon" size="sm">
                          <Save className="w-4 h-4 mr-2" />
                          Update
                        </Button>
                        <Button onClick={cancelEdit} variant="outline" size="sm">
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <code className="text-primary font-mono font-bold">{cmd.command}</code>
                        <p className="text-muted-foreground text-sm mt-1">{cmd.description}</p>
                        <p className="text-foreground/70 text-sm mt-2 font-mono bg-muted/30 p-2 rounded">
                          {cmd.response.substring(0, 100)}{cmd.response.length > 100 ? "..." : ""}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button onClick={() => startEdit(cmd)} variant="ghost" size="sm">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button onClick={() => handleDelete(cmd.id)} variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminCommands;
