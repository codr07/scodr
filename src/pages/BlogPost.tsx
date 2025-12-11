import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowLeft, Calendar, Clock, Tag, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      setPost(data);
      setLoading(false);
    };
    fetchPost();
  }, [slug]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16 flex items-center justify-center">
          <p className="text-muted-foreground font-mono animate-pulse">Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-display text-4xl font-bold text-primary mb-4">Post Not Found</h1>
            <Button asChild variant="neon">
              <Link to="/blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <article className="container mx-auto px-4 max-w-3xl">
          <Link to="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-mono text-sm">cd ../blog</span>
          </Link>

          {post.thumbnail_url && (
            <img src={post.thumbnail_url} alt={post.title} className="w-full h-64 object-cover rounded-lg mb-8 border border-border" />
          )}

          <header className="mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary text-glow mb-6">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-muted-foreground font-mono">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{formatDate(post.created_at)}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{post.read_time || "5 min read"}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {(post.tags || []).map((tag: string) => (
                <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono bg-muted/50 text-muted-foreground border border-border">
                  <Tag className="w-3 h-3" />{tag}
                </span>
              ))}
            </div>
          </header>

          <div className="prose prose-invert prose-green max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>

          <div className="mt-16 pt-8 border-t border-border flex items-center justify-between">
            <span className="text-muted-foreground font-mono text-sm"><span className="text-primary">//</span> Thanks for reading!</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard!");
              }}
            >
              <Share2 className="w-4 h-4 mr-2" />Copy Link
            </Button>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
