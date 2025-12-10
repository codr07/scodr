import { useState } from "react";
import { gamingProfiles, valorantRankColors } from "@/data/gamingData";
import { Gamepad2, Clock, Calendar, TrendingUp, DollarSign, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const getRankColor = (rank: string): string => {
  for (const [tier, color] of Object.entries(valorantRankColors)) {
    if (rank.toLowerCase().includes(tier.toLowerCase())) {
      return color;
    }
  }
  return "#f24968";
};

const getRankTier = (rank: string): string => {
  const tiers = ["Iron", "Bronze", "Silver", "Gold", "Platinum", "Diamond", "Ascendant", "Immortal", "Radiant"];
  for (const tier of tiers) {
    if (rank.toLowerCase().includes(tier.toLowerCase())) return tier.toLowerCase();
  }
  if (rank.includes("Legendary")) return "legendary";
  if (rank.includes("Supreme") || rank.includes("Global")) return "supreme";
  if (rank.includes("Master Guardian")) return "mg";
  if (rank.includes("OVR")) return "ovr";
  return "default";
};

export const GamingSection = () => {
  const [activeGame, setActiveGame] = useState(0);
  const activeProfile = gamingProfiles[activeGame];

  return (
    <section className="py-20 bg-card/30 relative">
      <div className="absolute inset-0 bg-grid opacity-30" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <code className="text-sm text-muted-foreground font-mono">
            <span className="text-primary">$</span> cat gaming_stats.json
          </code>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-4 gradient-text flex items-center justify-center gap-4">
            <Gamepad2 className="w-10 h-10" />
            Gaming Profile
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Competitive gaming is my passion beyond coding. Here's my journey through various games.
          </p>
        </div>

        {/* Game Selector */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {gamingProfiles.map((game, index) => (
            <button
              key={game.name}
              onClick={() => setActiveGame(index)}
              className={cn(
                "px-6 py-3 rounded-lg border transition-all duration-300 font-rajdhani font-semibold",
                activeGame === index
                  ? "border-primary bg-primary/20 text-primary shadow-[0_0_20px_hsl(var(--primary)/0.3)]"
                  : "border-border bg-card/50 text-muted-foreground hover:border-primary/50"
              )}
            >
              {game.name}
            </button>
          ))}
        </div>

        {/* Active Game Profile */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Game Info Card */}
            <div className="lg:col-span-1">
              <div className="p-6 rounded-lg border border-border bg-card/50 backdrop-blur-sm neon-border">
                <div className="flex items-center justify-center mb-6">
                  <img 
                    src={activeProfile.logo} 
                    alt={activeProfile.name}
                    className="h-16 w-auto object-contain"
                    onError={(e) => {
                      e.currentTarget.src = "https://cdn-icons-png.flaticon.com/512/686/686589.png";
                    }}
                  />
                </div>
                
                <h3 className="font-display text-2xl font-bold text-center text-primary mb-6">
                  {activeProfile.name}
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <DollarSign className="w-5 h-5 text-primary" />
                    <span className="text-muted-foreground">Investment:</span>
                    <span className="text-foreground font-semibold ml-auto">{activeProfile.investment}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="text-muted-foreground">Play Time:</span>
                    <span className="text-foreground font-semibold ml-auto">{activeProfile.playHours}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-5 h-5 text-primary" />
                    <span className="text-muted-foreground">Started:</span>
                    <span className="text-foreground font-semibold ml-auto">{activeProfile.started}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <span className="text-muted-foreground">Status:</span>
                    <span className={cn(
                      "font-semibold ml-auto",
                      activeProfile.currentStatus === "Regular" && "text-green-500",
                      activeProfile.currentStatus === "Semi Regular" && "text-yellow-500",
                      activeProfile.currentStatus === "Not Continued" && "text-red-500",
                      activeProfile.currentStatus === "Very Irregular" && "text-orange-500"
                    )}>
                      {activeProfile.currentStatus}
                    </span>
                  </div>
                </div>

                {activeProfile.achievements && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <h4 className="font-display text-lg font-semibold text-primary mb-3 flex items-center gap-2">
                      <Trophy className="w-5 h-5" />
                      Achievements
                    </h4>
                    <ul className="space-y-2">
                      {activeProfile.achievements.map((achievement, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Rank Timeline */}
            <div className="lg:col-span-2">
              <div className="p-6 rounded-lg border border-border bg-card/50 backdrop-blur-sm">
                <h4 className="font-display text-xl font-semibold text-primary mb-6">
                  Rank Timeline
                </h4>
                
                {activeProfile.ranks.length > 0 ? (
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                    
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                      {activeProfile.ranks.map((rank, idx) => {
                        const rankColor = getRankColor(rank.rank);
                        const isHighlight = rank.rank.includes("Immortal") || 
                                          rank.rank.includes("Supreme") || 
                                          rank.rank.includes("Global") ||
                                          rank.rank.includes("Radiant") ||
                                          rank.rank.includes("Legendary");
                        
                        return (
                          <div 
                            key={idx} 
                            className={cn(
                              "flex items-center gap-4 pl-10 relative group",
                              isHighlight && "scale-105"
                            )}
                          >
                            {/* Timeline dot */}
                            <div 
                              className={cn(
                                "absolute left-2 w-5 h-5 rounded-full border-2 transition-all",
                                isHighlight ? "w-6 h-6 left-1.5" : ""
                              )}
                              style={{ 
                                borderColor: rankColor,
                                backgroundColor: `${rankColor}40`,
                                boxShadow: isHighlight ? `0 0 10px ${rankColor}` : "none"
                              }}
                            />
                            
                            <div className={cn(
                              "flex-1 p-3 rounded-lg border transition-all",
                              isHighlight 
                                ? "border-primary bg-primary/10" 
                                : "border-border bg-card/30 group-hover:border-primary/50"
                            )}>
                              <div className="flex items-center justify-between">
                                <div>
                                  <span 
                                    className="font-rajdhani font-bold text-lg"
                                    style={{ color: rankColor }}
                                  >
                                    {rank.rank}
                                  </span>
                                  {rank.leaderboard && (
                                    <span className="ml-2 text-xs text-primary font-mono">
                                      {rank.leaderboard}
                                    </span>
                                  )}
                                </div>
                                {rank.season && (
                                  <span className="text-xs text-muted-foreground font-mono">
                                    Season {rank.season}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-10">
                    No detailed rank data available for this game.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Total Investment Banner */}
        <div className="mt-12 p-6 rounded-lg border border-primary bg-primary/10 backdrop-blur-sm text-center">
          <p className="text-muted-foreground mb-2">Total Gaming Investment</p>
          <p className="font-display text-4xl font-bold text-primary">₹1,10,000+</p>
          <p className="text-sm text-muted-foreground mt-2">Combined across all platforms</p>
        </div>
      </div>
    </section>
  );
};