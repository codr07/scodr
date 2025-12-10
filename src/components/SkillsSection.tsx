import { Code2, Database, Brain, Cloud, Terminal, Layers } from "lucide-react";

const skills = [
  {
    category: "Languages",
    icon: Code2,
    items: ["Python", "TypeScript", "JavaScript", "SQL", "R"],
    color: "primary" as const,
  },
  {
    category: "ML/AI",
    icon: Brain,
    items: ["TensorFlow", "PyTorch", "Scikit-learn", "NLP", "Computer Vision"],
    color: "secondary" as const,
  },
  {
    category: "Data",
    icon: Database,
    items: ["PostgreSQL", "MongoDB", "Redis", "Spark", "Pandas"],
    color: "primary" as const,
  },
  {
    category: "Cloud",
    icon: Cloud,
    items: ["AWS", "GCP", "Docker", "Kubernetes", "Firebase"],
    color: "secondary" as const,
  },
  {
    category: "Web",
    icon: Layers,
    items: ["React", "Next.js", "Node.js", "FastAPI", "GraphQL"],
    color: "primary" as const,
  },
  {
    category: "Tools",
    icon: Terminal,
    items: ["Git", "Linux", "Jupyter", "VS Code", "Vim"],
    color: "secondary" as const,
  },
];

export const SkillsSection = () => {
  return (
    <section className="py-20 bg-card/30 relative">
      <div className="absolute inset-0 bg-grid opacity-30" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <code className="text-sm text-muted-foreground font-mono">
            <span className="text-primary">$</span> cat skills.json
          </code>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-4 gradient-text">
            Tech Stack
          </h2>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, index) => (
            <div
              key={skill.category}
              className={`group p-6 rounded-lg border border-border bg-background/50 backdrop-blur-sm transition-all duration-500 hover:border-${skill.color} hover:shadow-[0_0_30px_hsl(var(--${skill.color})/0.2)]`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg bg-${skill.color}/10 text-${skill.color}`}>
                  <skill.icon className="w-5 h-5" />
                </div>
                <h3 className={`font-display text-lg font-semibold text-${skill.color}`}>
                  {skill.category}
                </h3>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {skill.items.map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1 rounded-full text-xs font-mono bg-muted/50 text-muted-foreground border border-border hover:border-primary hover:text-primary transition-colors"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
