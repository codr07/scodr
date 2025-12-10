import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlogCardProps {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  featured?: boolean;
}

export const BlogCard = ({
  id,
  title,
  excerpt,
  date,
  readTime,
  tags,
  featured = false,
}: BlogCardProps) => {
  return (
    <Link
      to={`/blog/${id}`}
      className={cn(
        "group block p-6 rounded-lg border transition-all duration-500",
        "bg-card/50 backdrop-blur-sm hover:bg-card",
        featured
          ? "border-secondary hover:border-secondary hover:shadow-[0_0_30px_hsl(var(--secondary)/0.2)]"
          : "border-border hover:border-primary hover:shadow-[0_0_30px_hsl(var(--primary)/0.2)]"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <h3 className={cn(
          "font-display text-xl font-semibold transition-colors",
          featured ? "text-secondary group-hover:text-glow-blue" : "text-primary group-hover:text-glow"
        )}>
          {title}
        </h3>
        <ArrowRight className={cn(
          "w-5 h-5 flex-shrink-0 transition-transform group-hover:translate-x-1",
          featured ? "text-secondary" : "text-primary"
        )} />
      </div>

      {/* Excerpt */}
      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
        {excerpt}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag) => (
          <span
            key={tag}
            className={cn(
              "inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-mono",
              "bg-muted/50 text-muted-foreground"
            )}
          >
            <Tag className="w-3 h-3" />
            {tag}
          </span>
        ))}
      </div>

      {/* Meta */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {date}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {readTime}
        </span>
      </div>
    </Link>
  );
};
