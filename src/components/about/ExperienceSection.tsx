import { experience } from "@/data/aboutData";
import { Briefcase, ExternalLink } from "lucide-react";

export const ExperienceSection = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Briefcase className="w-6 h-6 text-primary" />
            <h3 className="font-display text-2xl font-bold text-foreground">Experience</h3>
          </div>
          
          <div className="space-y-6">
            {experience.map((exp, index) => (
              <div 
                key={index}
                className="p-6 rounded-lg border border-border bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all group"
              >
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-lg bg-muted/50 flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img 
                      src={exp.logo} 
                      alt={exp.company}
                      className="w-10 h-10 object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-display font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                          {exp.title}
                        </h4>
                        <p className="text-primary font-medium">{exp.company}</p>
                      </div>
                      <span className="text-xs font-mono text-muted-foreground">
                        {exp.startDate} - {exp.endDate}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{exp.location}</p>
                    <p className="text-muted-foreground mt-3">{exp.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};