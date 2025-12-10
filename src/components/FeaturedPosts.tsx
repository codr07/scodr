import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { BlogCard } from "./BlogCard";

// Sample blog posts - in real app, these would come from a database
const featuredPosts = [
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
];

export const FeaturedPosts = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <code className="text-sm text-muted-foreground font-mono">
              <span className="text-primary">$</span> ls -la ./blog/recent
            </code>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-4 text-primary text-glow">
              Latest Posts
            </h2>
          </div>
          <Button asChild variant="outline" className="hidden md:flex">
            <Link to="/blog">
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredPosts.map((post) => (
            <BlogCard key={post.id} {...post} />
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-8 text-center md:hidden">
          <Button asChild variant="outline">
            <Link to="/blog">
              View All Posts
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
