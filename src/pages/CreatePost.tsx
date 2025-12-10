import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  ArrowLeft, 
  Save, 
  Sparkles, 
  Image as ImageIcon, 
  Loader2,
  Upload,
  X,
  Wand2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const CreatePost = () => {
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
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imagePrompt, setImagePrompt] = useState("");
  const [contentPrompt, setContentPrompt] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Auto-generate slug from title
  useEffect(() => {
    const generatedSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
    setSlug(generatedSlug);
  }, [title]);

  const calculateReadTime = (text: string): string => {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  const generateContent = async () => {
    if (!contentPrompt.trim()) {
      toast({ title: "Please enter a topic for the AI to write about", variant: "destructive" });
      return;
    }

    setIsGeneratingContent(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-content", {
        body: { prompt: contentPrompt, type: "blog-content" },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setContent(data.content);
      toast({ title: "Content generated successfully!" });
    } catch (error: any) {
      toast({ title: "Failed to generate content", description: error.message, variant: "destructive" });
    } finally {
      setIsGeneratingContent(false);
    }
  };

  const improveContent = async () => {
    if (!content.trim()) {
      toast({ title: "No content to improve", variant: "destructive" });
      return;
    }

    setIsGeneratingContent(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-content", {
        body: { prompt: content, type: "improve" },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setContent(data.content);
      toast({ title: "Content improved!" });
    } catch (error: any) {
      toast({ title: "Failed to improve content", description: error.message, variant: "destructive" });
    } finally {
      setIsGeneratingContent(false);
    }
  };

  const generateExcerpt = async () => {
    if (!content.trim()) {
      toast({ title: "Add content first to generate an excerpt", variant: "destructive" });
      return;
    }

    setIsGeneratingContent(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-content", {
        body: { prompt: `Summarize this blog post: ${content.substring(0, 2000)}`, type: "excerpt" },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setExcerpt(data.content);
      toast({ title: "Excerpt generated!" });
    } catch (error: any) {
      toast({ title: "Failed to generate excerpt", description: error.message, variant: "destructive" });
    } finally {
      setIsGeneratingContent(false);
    }
  };

  const generateImage = async () => {
    if (!imagePrompt.trim()) {
      toast({ title: "Please enter an image description", variant: "destructive" });
      return;
    }

    setIsGeneratingImage(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-image", {
        body: { prompt: imagePrompt },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      // Upload the base64 image to storage
      const base64Data = data.imageUrl.split(",")[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/png" });
      
      const fileName = `${user.id}/${Date.now()}-generated.png`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("blog-images")
        .upload(fileName, blob);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("blog-images")
        .getPublicUrl(fileName);

      setThumbnailUrl(publicUrl);
      toast({ title: "Image generated and uploaded!" });
    } catch (error: any) {
      toast({ title: "Failed to generate image", description: error.message, variant: "destructive" });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const fileName = `${user.id}/${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
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

  const insertImageInContent = async () => {
    if (!imagePrompt.trim()) {
      toast({ title: "Please enter an image description", variant: "destructive" });
      return;
    }

    setIsGeneratingImage(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-image", {
        body: { prompt: imagePrompt },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      // Upload to storage
      const base64Data = data.imageUrl.split(",")[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/png" });
      
      const fileName = `${user.id}/${Date.now()}-content.png`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("blog-images")
        .upload(fileName, blob);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("blog-images")
        .getPublicUrl(fileName);

      // Insert markdown image at cursor position
      setContent(prev => `${prev}\n\n![${imagePrompt}](${publicUrl})\n\n`);
      toast({ title: "Image added to content!" });
    } catch (error: any) {
      toast({ title: "Failed to generate image", description: error.message, variant: "destructive" });
    } finally {
      setIsGeneratingImage(false);
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
      const { error } = await supabase.from("blog_posts").insert({
        author_id: user.id,
        title,
        slug,
        excerpt,
        content,
        thumbnail_url: thumbnailUrl || null,
        tags: tags.split(",").map(t => t.trim()).filter(Boolean),
        published,
        read_time: calculateReadTime(content),
      });

      if (error) throw error;

      toast({ title: published ? "Post published!" : "Draft saved!" });
      navigate("/blog");
    } catch (error: any) {
      if (error.code === "23505") {
        toast({ title: "A post with this slug already exists", variant: "destructive" });
      } else {
        toast({ title: "Failed to save post", description: error.message, variant: "destructive" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="font-mono text-sm">cd ../blog</span>
              </Link>
              <h1 className="font-display text-4xl font-bold text-primary text-glow">
                Create Post
              </h1>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title & Slug */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-muted-foreground font-mono text-sm">
                  title<span className="text-primary">:</span>
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="My Awesome Blog Post"
                  className="bg-card border-border focus:border-primary"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug" className="text-muted-foreground font-mono text-sm">
                  slug<span className="text-primary">:</span>
                </Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="my-awesome-blog-post"
                  className="bg-card border-border focus:border-primary"
                  required
                />
              </div>
            </div>

            {/* Thumbnail */}
            <div className="space-y-4 p-6 rounded-lg border border-border bg-card/50">
              <Label className="text-secondary font-mono text-sm flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                thumbnail<span className="text-primary">:</span>
              </Label>
              
              {thumbnailUrl && (
                <div className="relative rounded-lg overflow-hidden border border-border">
                  <img src={thumbnailUrl} alt="Thumbnail" className="w-full h-48 object-cover" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-background/80"
                    onClick={() => setThumbnailUrl("")}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">Upload image</Label>
                  <div className="relative">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="thumbnail-upload"
                      disabled={isUploadingImage}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => document.getElementById("thumbnail-upload")?.click()}
                      disabled={isUploadingImage}
                    >
                      {isUploadingImage ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4 mr-2" />
                      )}
                      Upload
                    </Button>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">Generate with AI</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Describe the image..."
                      value={imagePrompt}
                      onChange={(e) => setImagePrompt(e.target.value)}
                      className="bg-card border-border focus:border-primary"
                    />
                    <Button
                      type="button"
                      variant="neon"
                      onClick={generateImage}
                      disabled={isGeneratingImage}
                    >
                      {isGeneratingImage ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4 p-6 rounded-lg border border-border bg-card/50">
              <div className="flex items-center justify-between">
                <Label className="text-secondary font-mono text-sm">
                  content<span className="text-primary">:</span> (markdown)
                </Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={improveContent}
                    disabled={isGeneratingContent || !content.trim()}
                  >
                    {isGeneratingContent ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                    <span className="ml-1">Improve</span>
                  </Button>
                </div>
              </div>

              {/* AI Content Generation */}
              <div className="flex gap-2">
                <Input
                  placeholder="Enter a topic for AI to write about..."
                  value={contentPrompt}
                  onChange={(e) => setContentPrompt(e.target.value)}
                  className="bg-background border-border focus:border-primary"
                />
                <Button
                  type="button"
                  variant="neon"
                  onClick={generateContent}
                  disabled={isGeneratingContent}
                >
                  {isGeneratingContent ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  <span className="ml-2">Generate</span>
                </Button>
              </div>

              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your content in markdown..."
                rows={20}
                className="bg-background border-border focus:border-primary resize-none font-mono text-sm"
                required
              />

              {/* Insert AI Image into Content */}
              <div className="flex gap-2 pt-2 border-t border-border">
                <Input
                  placeholder="Describe an image to insert..."
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  className="bg-background border-border focus:border-primary"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={insertImageInContent}
                  disabled={isGeneratingImage}
                >
                  {isGeneratingImage ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ImageIcon className="w-4 h-4" />
                  )}
                  <span className="ml-2">Insert Image</span>
                </Button>
              </div>
            </div>

            {/* Excerpt */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="excerpt" className="text-muted-foreground font-mono text-sm">
                  excerpt<span className="text-primary">:</span>
                </Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={generateExcerpt}
                  disabled={isGeneratingContent || !content.trim()}
                >
                  <Sparkles className="w-4 h-4 mr-1" />
                  Generate
                </Button>
              </div>
              <Textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A brief summary of your post..."
                rows={3}
                className="bg-card border-border focus:border-primary resize-none"
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags" className="text-muted-foreground font-mono text-sm">
                tags<span className="text-primary">:</span> (comma separated)
              </Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Machine Learning, AI, Python"
                className="bg-card border-border focus:border-primary"
              />
            </div>

            {/* Publish Toggle & Submit */}
            <div className="flex items-center justify-between pt-6 border-t border-border">
              <div className="flex items-center gap-3">
                <Switch
                  id="published"
                  checked={published}
                  onCheckedChange={setPublished}
                />
                <Label htmlFor="published" className="text-muted-foreground font-mono text-sm">
                  Publish immediately
                </Label>
              </div>
              <Button type="submit" variant="neon" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {published ? "Publish" : "Save Draft"}
              </Button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreatePost;
