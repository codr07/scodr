import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BlogCard } from "@/components/BlogCard";
import { Search, Filter, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setPosts(data);
        const tags = [...new Set(data.flatMap((post: any) => post.tags || []))];
        setAllTags(tags);
      }
      setLoading(false);
    };

    fetchPosts();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.excerpt || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || (post.tags || []).includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-start justify-between mb-12">
            <div className="max-w-3xl">
              <code className="text-sm text-muted-foreground font-mono">
                <span className="text-primary">$</span> cat /dev/brain &gt; blog.md
              </code>
              <h1 className="font-display text-5xl md:text-6xl font-bold mt-4 mb-6">
                <span className="text-primary text-glow">Blog</span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Thoughts on data science, machine learning, and tech.
              </p>
            </div>
            {user && (
              <Button asChild variant="neon">
                <Link to="/create-post">
                  <Plus className="w-4 h-4 mr-2" />
                  New Post
                </Link>
              </Button>
            )}
          </div>

          <div className="mb-8 space-y-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card/50 border-border focus:border-primary"
              />
            </div>

            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedTag === null ? "neon" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedTag(null)}
                >
                  <Filter className="w-3 h-3 mr-1" />
                  All
                </Button>
                {allTags.map((tag) => (
                  <Button
                    key={tag}
                    variant={selectedTag === tag ? "neon" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedTag(tag)}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {loading ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground font-mono animate-pulse">Loading posts...</p>
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <BlogCard
                  key={post.id}
                  id={post.slug}
                  title={post.title}
                  excerpt={post.excerpt || ""}
                  date={formatDate(post.created_at)}
                  readTime={post.read_time || "5 min read"}
                  tags={post.tags || []}
                  featured={false}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground font-mono">
                <span className="text-primary">$</span> No posts found
              </p>
              {user && (
                <Button asChild variant="neon" className="mt-4">
                  <Link to="/create-post">Create your first post</Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
