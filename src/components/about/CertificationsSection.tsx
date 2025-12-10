import { certifications } from "@/data/aboutData";
import { Award, ExternalLink } from "lucide-react";

export const CertificationsSection = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Award className="w-6 h-6 text-primary" />
            <h3 className="font-display text-2xl font-bold text-foreground">Certifications & Licenses</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certifications.map((cert, index) => (
              <div 
                key={index}
                className="p-4 rounded-lg border border-border bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all group flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center overflow-hidden flex-shrink-0">
                  <img 
                    src={cert.logo} 
                    alt={cert.issuer}
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                    {cert.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                  <p className="text-xs text-primary font-mono">{cert.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};