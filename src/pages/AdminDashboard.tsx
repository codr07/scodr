import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import { 
  Plus, Pencil, Trash2, Terminal, Save, X, 
  FileText, Eye, EyeOff, ArrowLeft, LogOut,
  LayoutDashboard
} from "lucide-react";

interface Command {
  id: string;
  command: string;
  description: string;
  response: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  published: boolean;
  created_at: string;
  tags: string[] | null;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Commands state
  const [commands, setCommands] = useState<Command[]>([]);
  const [editingCommandId, setEditingCommandId] = useState<string | null>(null);
  const [showAddCommand, setShowAddCommand] = useState(false);
  const [commandForm, setCommandForm] = useState({ command: "", description: "", response: "" });
  
  // Blog posts state
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminAndFetch = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

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
      fetchPosts(session.user.id);
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

  const fetchPosts = async (userId: string) => {
    const { data } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, published, created_at, tags")
      .eq("author_id", userId)
      .order("created_at", { ascending: false });
    if (data) setPosts(data);
  };

  // Command handlers
  const handleAddCommand = async () => {
    if (!commandForm.command || !commandForm.description || !commandForm.response) {
      toast({ title: "All fields required", variant: "destructive" });
      return;
    }

    const { error } = await supabase
      .from("terminal_commands")
      .insert({
        command: commandForm.command.toLowerCase().trim(),
        description: commandForm.description.trim(),
        response: commandForm.response.trim()
      });

    if (error) {
      toast({ title: "Failed to add command", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Command added" });
      setCommandForm({ command: "", description: "", response: "" });
      setShowAddCommand(false);
      fetchCommands();
    }
  };

  const handleUpdateCommand = async (id: string) => {
    const { error } = await supabase
      .from("terminal_commands")
      .update({
        command: commandForm.command.toLowerCase().trim(),
        description: commandForm.description.trim(),
        response: commandForm.response.trim()
      })
      .eq("id", id);

    if (error) {
      toast({ title: "Failed to update command", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Command updated" });
      setEditingCommandId(null);
      setCommandForm({ command: "", description: "", response: "" });
      fetchCommands();
    }
  };

  const handleDeleteCommand = async (id: string) => {
    if (!confirm("Delete this command?")) return;

    const { error } = await supabase.from("terminal_commands").delete().eq("id", id);
    if (error) {
      toast({ title: "Failed to delete command", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Command deleted" });
      fetchCommands();
    }
  };

  // Blog post handlers
  const handleDeletePost = async (id: string) => {
    if (!confirm("Delete this post?")) return;

    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) {
      toast({ title: "Failed to delete post", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Post deleted" });
      const { data: { session } } = await supabase.auth.getSession();
      if (session) fetchPosts(session.user.id);
    }
  };

  const togglePublish = async (id: string, currentState: boolean) => {
    const { error } = await supabase
      .from("blog_posts")
      .update({ published: !currentState })
      .eq("id", id);

    if (error) {
      toast({ title: "Failed to update post", variant: "destructive" });
    } else {
      toast({ title: currentState ? "Post unpublished" : "Post published" });
      const { data: { session } } = await supabase.auth.getSession();
      if (session) fetchPosts(session.user.id);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const startEditCommand = (cmd: Command) => {
    setEditingCommandId(cmd.id);
    setCommandForm({ command: cmd.command, description: cmd.description, response: cmd.response });
    setShowAddCommand(false);
  };

  const cancelEdit = () => {
    setEditingCommandId(null);
    setShowAddCommand(false);
    setCommandForm({ command: "", description: "", response: "" });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
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
        <div className="container mx-auto px-4 max-w-5xl">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-mono text-sm">cd ~/</span>
          </Link>

          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-8 h-8 text-primary" />
              <div>
                <h1 className="font-display text-3xl font-bold text-primary">Admin Dashboard</h1>
                <p className="text-muted-foreground font-mono text-sm">Manage blog posts & terminal commands</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          <Tabs defaultValue="posts" className="space-y-6">
            <TabsList className="bg-muted">
              <TabsTrigger value="posts" className="font-mono">
                <FileText className="w-4 h-4 mr-2" />
                Blog Posts
              </TabsTrigger>
              <TabsTrigger value="commands" className="font-mono">
                <Terminal className="w-4 h-4 mr-2" />
                Terminal Commands
              </TabsTrigger>
            </TabsList>

            {/* Blog Posts Tab */}
            <TabsContent value="posts" className="space-y-4">
              <div className="flex justify-end">
                <Button asChild variant="neon">
                  <Link to="/create-post">
                    <Plus className="w-4 h-4 mr-2" />
                    New Post
                  </Link>
                </Button>
              </div>

              {loading ? (
                <p className="text-muted-foreground font-mono animate-pulse">Loading...</p>
              ) : posts.length === 0 ? (
                <p className="text-muted-foreground font-mono text-center py-8">No posts yet</p>
              ) : (
                <div className="space-y-3">
                  {posts.map((post) => (
                    <div key={post.id} className="p-4 rounded-lg border border-border bg-card/50 flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground truncate">{post.title}</h3>
                          <span className={`px-2 py-0.5 rounded text-xs font-mono ${post.published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                            {post.published ? 'Published' : 'Draft'}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-sm font-mono">/{post.slug} • {formatDate(post.created_at)}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => togglePublish(post.id, post.published)} variant="ghost" size="sm" title={post.published ? 'Unpublish' : 'Publish'}>
                          {post.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button asChild variant="ghost" size="sm">
                          <Link to={`/edit-post/${post.id}`}>
                            <Pencil className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button onClick={() => handleDeletePost(post.id)} variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Terminal Commands Tab */}
            <TabsContent value="commands" className="space-y-4">
              <div className="flex justify-end">
                <Button onClick={() => { setShowAddCommand(true); setEditingCommandId(null); }} variant="neon">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Command
                </Button>
              </div>

              {/* Add Command Form */}
              {showAddCommand && (
                <div className="p-6 rounded-lg border border-border bg-card/50 space-y-4">
                  <h3 className="font-mono text-primary">New Command</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="font-mono text-sm">Command</Label>
                      <Input
                        value={commandForm.command}
                        onChange={(e) => setCommandForm(p => ({ ...p, command: e.target.value }))}
                        placeholder="e.g., hello"
                        className="bg-background border-border"
                      />
                    </div>
                    <div>
                      <Label className="font-mono text-sm">Description</Label>
                      <Input
                        value={commandForm.description}
                        onChange={(e) => setCommandForm(p => ({ ...p, description: e.target.value }))}
                        placeholder="What this command does"
                        className="bg-background border-border"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="font-mono text-sm">Response</Label>
                    <MarkdownEditor
                      value={commandForm.response}
                      onChange={(val) => setCommandForm(p => ({ ...p, response: val }))}
                      placeholder="The output when command is run. Use [text](url) for links."
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddCommand} variant="neon" size="sm">
                      <Save className="w-4 h-4 mr-2" />Save
                    </Button>
                    <Button onClick={cancelEdit} variant="outline" size="sm">
                      <X className="w-4 h-4 mr-2" />Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Commands List */}
              {loading ? (
                <p className="text-muted-foreground font-mono animate-pulse">Loading...</p>
              ) : (
                <div className="space-y-3">
                  {commands.map((cmd) => (
                    <div key={cmd.id} className="p-4 rounded-lg border border-border bg-card/50">
                      {editingCommandId === cmd.id ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label className="font-mono text-sm">Command</Label>
                              <Input
                                value={commandForm.command}
                                onChange={(e) => setCommandForm(p => ({ ...p, command: e.target.value }))}
                                className="bg-background border-border"
                              />
                            </div>
                            <div>
                              <Label className="font-mono text-sm">Description</Label>
                              <Input
                                value={commandForm.description}
                                onChange={(e) => setCommandForm(p => ({ ...p, description: e.target.value }))}
                                className="bg-background border-border"
                              />
                            </div>
                          </div>
                          <div>
                            <Label className="font-mono text-sm">Response</Label>
                            <MarkdownEditor
                              value={commandForm.response}
                              onChange={(val) => setCommandForm(p => ({ ...p, response: val }))}
                              placeholder="The output when command is run. Use [text](url) for links."
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={() => handleUpdateCommand(cmd.id)} variant="neon" size="sm">
                              <Save className="w-4 h-4 mr-2" />Update
                            </Button>
                            <Button onClick={cancelEdit} variant="outline" size="sm">
                              <X className="w-4 h-4 mr-2" />Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <code className="text-primary font-mono font-bold">{cmd.command}</code>
                            <p className="text-muted-foreground text-sm mt-1">{cmd.description}</p>
                            <p className="text-foreground/60 text-xs mt-2 font-mono bg-muted/30 p-2 rounded truncate">
                              {cmd.response.substring(0, 80)}{cmd.response.length > 80 ? "..." : ""}
                            </p>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button onClick={() => startEditCommand(cmd)} variant="ghost" size="sm">
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button onClick={() => handleDeleteCommand(cmd.id)} variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
