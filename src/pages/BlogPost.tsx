import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowLeft, Calendar, Clock, Tag, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Sample blog post data
const posts: Record<string, {
  title: string;
  content: string;
  date: string;
  readTime: string;
  tags: string[];
}> = {
  "1": {
    title: "Building Scalable ML Pipelines with Apache Spark",
    content: `
# Introduction

Building machine learning pipelines that can handle enterprise-scale data is one of the most challenging aspects of modern data science. In this post, we'll explore how to leverage Apache Spark and MLflow to create production-ready ML pipelines.

## Why Spark for ML?

Apache Spark provides a unified analytics engine for large-scale data processing. When combined with MLlib, it becomes a powerful tool for distributed machine learning.

### Key Benefits:

- **Scalability**: Process petabytes of data across clusters
- **Speed**: In-memory processing for faster iterations
- **Unified Platform**: Combine ETL, ML, and streaming in one workflow

## Setting Up Your Environment

First, let's set up our PySpark environment with MLflow for experiment tracking:

\`\`\`python
from pyspark.sql import SparkSession
from pyspark.ml import Pipeline
from pyspark.ml.feature import VectorAssembler, StandardScaler
from pyspark.ml.classification import RandomForestClassifier
import mlflow

# Initialize Spark session
spark = SparkSession.builder \\
    .appName("ML Pipeline") \\
    .config("spark.executor.memory", "4g") \\
    .getOrCreate()
\`\`\`

## Building the Pipeline

The key to a maintainable ML pipeline is modularization. Here's how we structure our feature engineering and model training:

\`\`\`python
# Feature engineering stages
assembler = VectorAssembler(
    inputCols=["feature1", "feature2", "feature3"],
    outputCol="features_raw"
)

scaler = StandardScaler(
    inputCol="features_raw",
    outputCol="features"
)

# Model
rf = RandomForestClassifier(
    labelCol="label",
    featuresCol="features",
    numTrees=100
)

# Create pipeline
pipeline = Pipeline(stages=[assembler, scaler, rf])
\`\`\`

## Conclusion

Building scalable ML pipelines requires careful consideration of data volume, processing speed, and maintainability. Apache Spark combined with MLflow provides an excellent foundation for enterprise ML systems.
    `,
    date: "Dec 8, 2024",
    readTime: "8 min read",
    tags: ["Machine Learning", "Spark", "Data Engineering"],
  },
  "2": {
    title: "The Art of Prompt Engineering for LLMs",
    content: `
# Introduction

Prompt engineering has become an essential skill for anyone working with Large Language Models. The way you structure your prompts can dramatically affect the quality of outputs.

## Core Principles

### 1. Be Specific and Clear

Vague prompts lead to vague responses. Always provide context and specify exactly what you need.

### 2. Use Examples (Few-Shot Learning)

Providing examples helps the model understand the pattern you're looking for:

\`\`\`
Example format:
Input: "Convert to SQL"
Output: "SELECT * FROM users WHERE..."

Your task:
Input: "Find all active users"
Output: ?
\`\`\`

### 3. Chain of Thought

For complex reasoning tasks, ask the model to think step by step.

## Advanced Techniques

- **Role prompting**: "You are an expert Python developer..."
- **Constraint setting**: "Respond in exactly 3 bullet points"
- **Format specification**: "Return the answer as JSON"

## Conclusion

Mastering prompt engineering is about understanding how LLMs interpret instructions and leveraging that knowledge to get better outputs.
    `,
    date: "Dec 5, 2024",
    readTime: "6 min read",
    tags: ["AI", "LLM", "NLP"],
  },
};

const BlogPost = () => {
  const { id } = useParams();
  const post = id ? posts[id] : null;

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
          {/* Back link */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-mono text-sm">cd ../blog</span>
          </Link>

          {/* Header */}
          <header className="mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary text-glow mb-6">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-muted-foreground font-mono">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {post.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.readTime}
              </span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono bg-muted/50 text-muted-foreground border border-border"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-invert prose-green max-w-none">
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              {post.content.split('\n').map((line, i) => {
                if (line.startsWith('# ')) {
                  return <h1 key={i} className="font-display text-3xl font-bold text-primary mt-12 mb-6">{line.slice(2)}</h1>;
                }
                if (line.startsWith('## ')) {
                  return <h2 key={i} className="font-display text-2xl font-bold text-secondary mt-10 mb-4">{line.slice(3)}</h2>;
                }
                if (line.startsWith('### ')) {
                  return <h3 key={i} className="font-display text-xl font-semibold text-primary mt-8 mb-3">{line.slice(4)}</h3>;
                }
                if (line.startsWith('```')) {
                  return null; // Code blocks handled separately
                }
                if (line.startsWith('- ')) {
                  return <li key={i} className="ml-6 text-muted-foreground">{line.slice(2)}</li>;
                }
                if (line.trim()) {
                  return <p key={i}>{line}</p>;
                }
                return null;
              })}
            </div>
          </div>

          {/* Share */}
          <div className="mt-16 pt-8 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-mono text-sm">
                <span className="text-primary">//</span> Thanks for reading!
              </span>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
