import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, Loader2, Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [published, setPublished] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);

      // Check admin role
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!roleData) {
        toast({ title: "Access denied", variant: "destructive" });
        navigate("/");
        return;
      }

      // Fetch post
      const { data: post, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", id)
        .eq("author_id", session.user.id)
        .maybeSingle();

      if (error || !post) {
        toast({ title: "Post not found", variant: "destructive" });
        navigate("/admin");
        return;
      }

      setTitle(post.title);
      setSlug(post.slug);
      setExcerpt(post.excerpt || "");
      setContent(post.content);
      setTags((post.tags || []).join(", "));
      setThumbnailUrl(post.thumbnail_url || "");
      setPublished(post.published);
      setIsFetching(false);
    };

    checkAuthAndFetch();
  }, [id, navigate, toast]);

  const calculateReadTime = (text: string): string => {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUploadingImage(true);
    try {
      const fileName = `${user.id}/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from("blog-images")
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from("blog-images")
        .getPublicUrl(fileName);

      setThumbnailUrl(publicUrl);
      toast({ title: "Image uploaded!" });
    } catch (error: any) {
      toast({ title: "Failed to upload image", description: error.message, variant: "destructive" });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim() || !slug.trim()) {
      toast({ title: "Please fill in title, slug, and content", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("blog_posts")
        .update({
          title,
          slug,
          excerpt,
          content,
          thumbnail_url: thumbnailUrl || null,
          tags: tags.split(",").map(t => t.trim()).filter(Boolean),
          published,
          read_time: calculateReadTime(content),
        })
        .eq("id", id);

      if (error) throw error;

      toast({ title: "Post updated!" });
      navigate("/admin");
    } catch (error: any) {
      if (error.code === "23505") {
        toast({ title: "A post with this slug already exists", variant: "destructive" });
      } else {
        toast({ title: "Failed to update post", description: error.message, variant: "destructive" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16 flex items-center justify-center">
          <p className="text-muted-foreground font-mono animate-pulse">Loading post...</p>
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
          <div className="mb-8">
            <Link to="/admin" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4">
              <ArrowLeft className="w-4 h-4" />
              <span className="font-mono text-sm">cd ../admin</span>
            </Link>
            <h1 className="font-display text-4xl font-bold text-primary text-glow">Edit Post</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground font-mono text-sm">title:</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} className="bg-card border-border" required />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground font-mono text-sm">slug:</Label>
                <Input value={slug} onChange={(e) => setSlug(e.target.value)} className="bg-card border-border" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground font-mono text-sm">excerpt:</Label>
              <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="bg-card border-border" rows={2} />
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground font-mono text-sm">thumbnail:</Label>
              {thumbnailUrl && (
                <div className="relative rounded-lg overflow-hidden border border-border mb-2">
                  <img src={thumbnailUrl} alt="Thumbnail" className="w-full h-32 object-cover" />
                  <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 bg-background/80" onClick={() => setThumbnailUrl("")}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
              <div className="relative">
                <Input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="thumbnail-upload" />
                <Button type="button" variant="outline" onClick={() => document.getElementById("thumbnail-upload")?.click()} disabled={isUploadingImage}>
                  {isUploadingImage ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                  Upload Image
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground font-mono text-sm">content (markdown):</Label>
              <Textarea value={content} onChange={(e) => setContent(e.target.value)} className="bg-card border-border font-mono text-sm" rows={15} required />
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground font-mono text-sm">tags (comma separated):</Label>
              <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="react, typescript, web" className="bg-card border-border" />
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card/50">
              <Switch checked={published} onCheckedChange={setPublished} />
              <Label className="font-mono text-sm">{published ? "Published" : "Draft"}</Label>
            </div>

            <div className="flex gap-4">
              <Button type="submit" variant="neon" disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Update Post
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/admin")}>Cancel</Button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EditPost;
