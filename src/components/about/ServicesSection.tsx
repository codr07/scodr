import { services } from "@/data/aboutData";
import { Brain, Code, Database, MessageSquare, Sparkles } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Brain,
  Code,
  Database,
  MessageSquare,
};

export const ServicesSection = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="w-6 h-6 text-primary" />
            <h3 className="font-display text-2xl font-bold text-foreground">Services</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service, index) => {
              const IconComponent = iconMap[service.icon] || Sparkles;
              return (
                <div 
                  key={index}
                  className="p-6 rounded-lg border border-border bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all group"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  
                  <h4 className="font-display font-semibold text-lg text-foreground group-hover:text-primary transition-colors mb-2">
                    {service.title}
                  </h4>
                  <p className="text-muted-foreground">
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};