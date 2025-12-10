import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BlogCard } from "@/components/BlogCard";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Sample blog posts
const allPosts = [
  {
    id: "1",
    title: "Building Scalable ML Pipelines with Apache Spark",
    excerpt: "A deep dive into creating production-ready machine learning pipelines using PySpark and MLflow for enterprise-scale data processing.",
    date: "Dec 8, 2024",
    readTime: "8 min read",
    tags: ["Machine Learning", "Spark", "Data Engineering"],
    featured: true,
  },
  {
    id: "2",
    title: "The Art of Prompt Engineering for LLMs",
    excerpt: "Mastering the techniques of crafting effective prompts to get the best results from large language models like GPT-4 and Claude.",
    date: "Dec 5, 2024",
    readTime: "6 min read",
    tags: ["AI", "LLM", "NLP"],
    featured: false,
  },
  {
    id: "3",
    title: "Deploying Models at Scale with Kubernetes",
    excerpt: "A comprehensive guide to containerizing and deploying machine learning models using Docker and Kubernetes for production environments.",
    date: "Dec 1, 2024",
    readTime: "10 min read",
    tags: ["DevOps", "Kubernetes", "MLOps"],
    featured: false,
  },
  {
    id: "4",
    title: "Real-time Data Streaming with Apache Kafka",
    excerpt: "Learn how to build robust real-time data pipelines using Apache Kafka for processing millions of events per second.",
    date: "Nov 28, 2024",
    readTime: "12 min read",
    tags: ["Data Engineering", "Kafka", "Streaming"],
    featured: false,
  },
  {
    id: "5",
    title: "Neural Networks from Scratch in Python",
    excerpt: "Understanding the fundamentals of neural networks by building one from scratch using only NumPy.",
    date: "Nov 22, 2024",
    readTime: "15 min read",
    tags: ["Deep Learning", "Python", "Neural Networks"],
    featured: false,
  },
  {
    id: "6",
    title: "Modern React Patterns for 2024",
    excerpt: "Exploring the latest React patterns and best practices including Server Components, Suspense, and the new use hook.",
    date: "Nov 15, 2024",
    readTime: "7 min read",
    tags: ["React", "JavaScript", "Frontend"],
    featured: false,
  },
];

const allTags = [...new Set(allPosts.flatMap((post) => post.tags))];

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredPosts = allPosts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || post.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="max-w-3xl mb-12">
            <code className="text-sm text-muted-foreground font-mono">
              <span className="text-primary">$</span> cat /dev/brain &gt; blog.md
            </code>
            <h1 className="font-display text-5xl md:text-6xl font-bold mt-4 mb-6">
              <span className="text-primary text-glow">Blog</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Thoughts on data science, machine learning, software engineering, and everything tech.
            </p>
          </div>

          {/* Search and Filter */}
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

            {/* Tags Filter */}
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
          </div>

          {/* Posts Grid */}
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <BlogCard key={post.id} {...post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground font-mono">
                <span className="text-primary">$</span> No posts found matching your criteria
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
