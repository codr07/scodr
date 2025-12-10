// Gaming profile data for Sankha Saha

export interface GameRank {
  rank: string;
  season?: number;
  leaderboard?: string;
}

export interface GameProfile {
  name: string;
  logo: string;
  investment: string;
  playHours: string;
  started: string;
  currentStatus: string;
  ranks: GameRank[];
  achievements?: string[];
}

export const gamingProfiles: GameProfile[] = [
  {
    name: "VALORANT",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/fc/Valorant_logo_-_pink_color_version.svg",
    investment: "₹20,000",
    playHours: "400+ hrs",
    started: "October 21, 2021",
    currentStatus: "Regular",
    ranks: [
      { rank: "Silver 2", season: 1 },
      { rank: "Silver 3", season: 2 },
      { rank: "Gold 3", season: 3 },
      { rank: "Platinum 2", season: 4 },
      { rank: "Platinum 2", season: 5 },
      { rank: "Gold 3", season: 6 },
      { rank: "Platinum 2", season: 7 },
      { rank: "Gold 3", season: 8 },
      { rank: "Platinum 3", season: 9 },
      { rank: "Diamond 2", season: 10 },
      { rank: "Ascendant 3", season: 11 },
      { rank: "Diamond 2", season: 12 },
      { rank: "Ascendant 3", season: 13 },
      { rank: "Immortal 1", season: 14, leaderboard: "#1023" },
      { rank: "Immortal 2", season: 15, leaderboard: "#532" },
      { rank: "Immortal 2", season: 16, leaderboard: "#674" },
      { rank: "Immortal 1", season: 17, leaderboard: "#1123" },
      { rank: "Immortal 2", season: 18, leaderboard: "#215" },
    ],
  },
  {
    name: "Counter-Strike 2",
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Counter-Strike_2_%28CS2%29.svg",
    investment: "₹60,000",
    playHours: "4000 hrs",
    started: "August 17, 2020",
    currentStatus: "Semi Regular",
    ranks: [
      { rank: "Gold Nova Master", season: 1 },
      { rank: "Gold Nova III", season: 2 },
      { rank: "Master Guardian II", season: 3 },
      { rank: "Master Guardian II", season: 4 },
      { rank: "Master Guardian II", season: 5 },
      { rank: "Master Guardian I", season: 6 },
      { rank: "Master Guardian I", season: 7 },
      { rank: "Master Guardian II", season: 8 },
      { rank: "Master Guardian Elite", season: 9 },
      { rank: "Master Guardian Elite", season: 10 },
      { rank: "Master Guardian III", season: 11 },
      { rank: "Legendary Eagle", season: 12 },
      { rank: "Legendary Eagle", season: 13 },
      { rank: "Legendary Eagle Master", season: 14 },
      { rank: "Master Guardian II", season: 15 },
      { rank: "Master Guardian Elite", season: 16 },
      { rank: "Supreme Master First Class", season: 17 },
      { rank: "Supreme Master First Class", season: 18 },
      { rank: "Legendary Eagle Master", season: 19 },
      { rank: "Legendary Eagle Master", season: 20 },
    ],
  },
  {
    name: "Call of Duty Mobile",
    logo: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Call_of_Duty_Mobile_icon.svg",
    investment: "₹30,000",
    playHours: "N/A",
    started: "July 17, 2019",
    currentStatus: "Not Continued",
    ranks: [
      { rank: "Legendary (BR)", season: 1 },
      { rank: "Legendary (BR)", season: 2 },
      { rank: "Legendary (BR)", season: 3 },
      { rank: "Legendary (BR)", season: 4 },
      { rank: "Legendary (BR)", season: 5 },
      { rank: "Legendary (BR)", season: 6 },
      { rank: "Legendary (BR)", season: 7 },
      { rank: "Legendary (BR)", season: 8 },
      { rank: "Legendary (BR)", season: 9 },
      { rank: "Legendary (BR)", season: 10 },
      { rank: "Legendary (BR)", season: 11 },
    ],
    achievements: ["11 Legendary BR Ranks", "12 Legendary MP Ranks"],
  },
  {
    name: "FIFA Mobile",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/aa/FIFA_logo_without_slogan.svg",
    investment: "N/A",
    playHours: "N/A",
    started: "February 2017",
    currentStatus: "Semi Regular",
    ranks: [
      { rank: "OVR 236", season: 1 },
      { rank: "OVR 107", season: 2 },
      { rank: "OVR 105", season: 3 },
      { rank: "OVR 110", season: 4 },
      { rank: "OVR 101", season: 5 },
      { rank: "OVR 109", season: 6 },
      { rank: "OVR 108", season: 7 },
      { rank: "OVR 110", season: 8 },
      { rank: "OVR 112", season: 9 },
    ],
  },
  {
    name: "eFootball (PES Mobile)",
    logo: "https://upload.wikimedia.org/wikipedia/commons/3/31/EFootball_logo.svg",
    investment: "N/A",
    playHours: "N/A",
    started: "March 2016",
    currentStatus: "Very Irregular",
    ranks: [],
    achievements: ["Early adopter since PES Mobile launch"],
  },
];

// Valorant rank colors for styling
export const valorantRankColors: Record<string, string> = {
  "Iron": "#4a4a4a",
  "Bronze": "#b08d57",
  "Silver": "#9ca3af",
  "Gold": "#ffd700",
  "Platinum": "#3dd1e7",
  "Diamond": "#b9f2ff",
  "Ascendant": "#21ff72",
  "Immortal": "#ff4654",
  "Radiant": "#ffffa0",
};

// CS2 rank tiers
export const cs2RankTiers = [
  "Silver I", "Silver II", "Silver III", "Silver IV", "Silver Elite", "Silver Elite Master",
  "Gold Nova I", "Gold Nova II", "Gold Nova III", "Gold Nova Master",
  "Master Guardian I", "Master Guardian II", "Master Guardian Elite",
  "Distinguished Master Guardian", "Legendary Eagle", "Legendary Eagle Master",
  "Supreme Master First Class", "Global Elite"
];