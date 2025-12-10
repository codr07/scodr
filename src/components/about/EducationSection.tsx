import { education } from "@/data/aboutData";
import { GraduationCap } from "lucide-react";

export const EducationSection = () => {
  return (
    <section className="py-16 bg-card/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <GraduationCap className="w-6 h-6 text-secondary" />
            <h3 className="font-display text-2xl font-bold text-foreground">Education</h3>
          </div>
          
          <div className="space-y-6">
            {education.map((edu, index) => (
              <div 
                key={index}
                className="p-6 rounded-lg border border-border bg-background/50 backdrop-blur-sm hover:border-secondary/50 transition-all group"
              >
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-lg bg-muted/50 flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img 
                      src={edu.logo} 
                      alt={edu.institution}
                      className="w-10 h-10 object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-display font-semibold text-lg text-foreground group-hover:text-secondary transition-colors">
                          {edu.degree}
                        </h4>
                        <p className="text-secondary font-medium">{edu.institution}</p>
                      </div>
                      <span className="text-xs font-mono text-muted-foreground">
                        {edu.startDate} - {edu.endDate}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{edu.location}</p>
                    <p className="text-muted-foreground mt-3">{edu.description}</p>
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