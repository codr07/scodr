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
  if (rank.includes("Legendary")) return "#ffd700";
  if (rank.includes("Supreme") || rank.includes("Global")) return "#ffffa0";
  if (rank.includes("Master Guardian")) return "#3dd1e7";
  if (rank.includes("Gold Nova")) return "#ffd700";
  if (rank.includes("OVR")) return "#21ff72";
  return "#f24968";
};

export const GamingSection = () => {
  const [activeGame, setActiveGame] = useState(0);
  const activeProfile = gamingProfiles[activeGame];

  return (
    <section className="py-16 bg-card/30 relative">
      <div className="absolute inset-0 bg-grid opacity-30" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-10">
          <code className="text-sm text-muted-foreground font-mono">
            <span className="text-primary">$</span> cat gaming_stats.json
          </code>
          <h2 className="font-display text-3xl md:text-4xl font-bold mt-3 gradient-text flex items-center justify-center gap-3">
            <Gamepad2 className="w-8 h-8" />
            Gaming Profile
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto text-sm">
            Competitive gaming is my passion beyond coding.
          </p>
        </div>

        {/* Game Selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {gamingProfiles.map((game, index) => (
            <button
              key={game.name}
              onClick={() => setActiveGame(index)}
              className={cn(
                "px-4 py-2 rounded-lg border transition-all duration-300 font-rajdhani font-semibold text-sm",
                activeGame === index
                  ? "border-primary bg-primary/20 text-primary shadow-[0_0_15px_hsl(var(--primary)/0.3)]"
                  : "border-border bg-card/50 text-muted-foreground hover:border-primary/50"
              )}
            >
              {game.name}
            </button>
          ))}
        </div>

        {/* Active Game Profile */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
            {/* Game Info Card */}
            <div className="xl:col-span-1">
              <div className="p-4 rounded-lg border border-border bg-card/50 backdrop-blur-sm neon-border h-full">
                <div className="flex items-center justify-center mb-4">
                  <img 
                    src={activeProfile.logo} 
                    alt={activeProfile.name}
                    className="h-12 w-auto object-contain rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = "https://cdn-icons-png.flaticon.com/512/686/686589.png";
                    }}
                  />
                </div>
                
                <h3 className="font-display text-lg font-bold text-center text-primary mb-4">
                  {activeProfile.name}
                </h3>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <DollarSign className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">Investment:</span>
                    <span className="text-foreground font-semibold ml-auto">{activeProfile.investment}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs">
                    <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">Play Time:</span>
                    <span className="text-foreground font-semibold ml-auto">{activeProfile.playHours}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs">
                    <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">Started:</span>
                    <span className="text-foreground font-semibold ml-auto text-right text-[10px]">{activeProfile.started}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs">
                    <TrendingUp className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">Status:</span>
                    <span className={cn(
                      "font-semibold ml-auto text-[11px]",
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
                  <div className="mt-4 pt-3 border-t border-border">
                    <h4 className="font-display text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                      <Trophy className="w-4 h-4" />
                      Achievements
                    </h4>
                    <ul className="space-y-1">
                      {activeProfile.achievements.map((achievement, idx) => (
                        <li key={idx} className="text-[11px] text-muted-foreground flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Rank Timeline - Horizontal Grid */}
            <div className="xl:col-span-3">
              <div className="p-4 rounded-lg border border-border bg-card/50 backdrop-blur-sm">
                <h4 className="font-display text-base font-semibold text-primary mb-4">
                  Rank Timeline
                </h4>
                
                {activeProfile.ranks.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2">
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
                            "p-2 rounded-lg border transition-all hover:scale-105",
                            isHighlight 
                              ? "border-primary bg-primary/10" 
                              : "border-border bg-card/30 hover:border-primary/50"
                          )}
                          style={{
                            boxShadow: isHighlight ? `0 0 10px ${rankColor}30` : "none"
                          }}
                        >
                          <div className="text-center">
                            
                            <span 
                              className="font-rajdhani font-bold text-[11px] block leading-tight"
                              style={{ color: rankColor }}
                            >
                              {rank.rank}
                            </span>
                            {rank.leaderboard && (
                              <span className="text-[9px] text-primary font-mono mt-0.5 block">
                                {rank.leaderboard}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8 text-sm">
                    No detailed rank data available for this game.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Total Investment Banner */}
        <div className="mt-8 p-4 rounded-lg border border-primary bg-primary/10 backdrop-blur-sm text-center">
          <p className="text-muted-foreground mb-1 text-xs">Total Gaming Investment</p>
          <p className="font-display text-2xl font-bold text-primary">₹1,10,000+</p>
          <p className="text-[10px] text-muted-foreground mt-1">Combined across all platforms</p>
        </div>
      </div>
    </section>
  );
};