import { projects, socialLinks } from "@/data/aboutData";
import { FolderGit2, ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ProjectsSection = () => {
  return (
    <section className="py-16 bg-card/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <FolderGit2 className="w-6 h-6 text-primary" />
              <h3 className="font-display text-2xl font-bold text-foreground">Projects</h3>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href={socialLinks.github} target="_blank" rel="noopener noreferrer">
                <Github className="w-4 h-4 mr-2" />
                View All
              </a>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <a 
                key={index}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-6 rounded-lg border border-border bg-background/50 backdrop-blur-sm hover:border-primary transition-all group block"
              >
                <div className="flex items-start justify-between mb-3">
                  <FolderGit2 className="w-8 h-8 text-primary" />
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                
                <h4 className="font-display font-semibold text-lg text-foreground group-hover:text-primary transition-colors mb-2">
                  {project.name}
                </h4>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span 
                      key={tech}
                      className="px-2 py-1 rounded text-xs font-mono bg-muted/50 text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};