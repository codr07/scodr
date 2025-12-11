import { awards, recommendations, languages } from "@/data/aboutData";
import { Trophy, MessageCircle, Globe, Medal, Calendar } from "lucide-react";

export const AwardsSection = () => {
  return (
    <section className="py-16 bg-card/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-16">
          {/* Awards */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <Trophy className="w-6 h-6 text-primary" />
              <h3 className="font-display text-2xl font-bold text-foreground">Honors & Awards</h3>
            </div>
            
            <div className="space-y-4">
              {awards.map((award, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-lg border border-border bg-background/50 backdrop-blur-sm hover:border-primary/50 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Medal className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">{award.title}</h4>
                          <p className="text-sm text-primary">{award.organization}</p>
                          <p className="text-sm text-muted-foreground mt-1">{award.description}</p>
                        </div>
                        <span className="text-xs font-mono text-muted-foreground whitespace-nowrap flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {award.year}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <MessageCircle className="w-6 h-6 text-secondary" />
              <h3 className="font-display text-2xl font-bold text-foreground">Recommendations</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendations.map((rec, index) => (
                <div 
                  key={index}
                  className="p-6 rounded-lg border border-border bg-background/50 backdrop-blur-sm"
                >
                  <p className="text-muted-foreground italic mb-4">"{rec.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      {rec.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{rec.name}</p>
                      <p className="text-sm text-muted-foreground">{rec.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <Globe className="w-6 h-6 text-primary" />
              <h3 className="font-display text-2xl font-bold text-foreground">Languages</h3>
            </div>
            
            <div className="flex flex-wrap gap-4">
              {languages.map((lang, index) => (
                <div 
                  key={index}
                  className="px-6 py-3 rounded-lg border border-border bg-background/50 backdrop-blur-sm"
                >
                  <p className="font-semibold text-foreground">{lang.name}</p>
                  <p className="text-sm text-muted-foreground">{lang.proficiency}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};