export type Profile = {
  id: string;
  name: string;
  age: number;
  role: string;
  location: string;
  distanceKm: number;
  bio: string;
  interests: string[];
  instagram: string;
  gradient: [string, string];
};

// "Current user" — used as the anchor for recommendations.
export const currentUser: Profile = {
  id: "me",
  name: "You",
  age: 25,
  role: "Product designer",
  location: "Bengaluru",
  distanceKm: 0,
  bio: "Design, ambient music, weekend chess.",
  interests: ["Design", "Chess", "Ambient Music", "Coffee", "Reading"],
  instagram: "@you",
  gradient: ["#a7f3d0", "#059669"],
};

export const candidates: Profile[] = [
  {
    id: "julian",
    name: "Julian",
    age: 29,
    role: "Architect",
    location: "Bengaluru",
    distanceKm: 3.2,
    bio: "Obsessed with brutalist concrete, specialty coffee, and modular synthesis. Looking for someone to join a weekly chess club.",
    interests: ["Chess", "Architecture", "Ambient Music", "Coffee"],
    instagram: "@julian.builds",
    gradient: ["#fde68a", "#d97706"],
  },
  {
    id: "elena",
    name: "Elena",
    age: 26,
    role: "Visual artist",
    location: "Bengaluru",
    distanceKm: 1.4,
    bio: "Illustrator making risograph zines. Long walks, secondhand books, and quiet Sunday mornings.",
    interests: ["Design", "Reading", "Illustration", "Coffee"],
    instagram: "@elena_visuals",
    gradient: ["#fbcfe8", "#db2777"],
  },
  {
    id: "marcus",
    name: "Marcus",
    age: 31,
    role: "Backend engineer",
    location: "Bengaluru",
    distanceKm: 5.8,
    bio: "Distributed systems by day, bouldering by night. Always down for a debugging story or a new climbing gym.",
    interests: ["Coding", "Bouldering", "Podcasts", "Coffee"],
    instagram: "@marcus_codes",
    gradient: ["#bfdbfe", "#2563eb"],
  },
  {
    id: "aisha",
    name: "Aisha",
    age: 27,
    role: "Journalist",
    location: "Bengaluru",
    distanceKm: 2.1,
    bio: "Reports on climate and cities. Cooks a lot. Would love a friend for slow Saturday markets.",
    interests: ["Writing", "Cooking", "Cycling", "Politics"],
    instagram: "@aisha.writes",
    gradient: ["#e9d5ff", "#7c3aed"],
  },
  {
    id: "ravi",
    name: "Ravi",
    age: 24,
    role: "Musician",
    location: "Bengaluru",
    distanceKm: 6.7,
    bio: "Producing lo-fi under a pseudonym. Vinyl hunter, tea over coffee, and long night rides.",
    interests: ["Ambient Music", "Vinyl", "Motorcycles", "Tea"],
    instagram: "@ravi.loops",
    gradient: ["#c7d2fe", "#4f46e5"],
  },
  {
    id: "sana",
    name: "Sana",
    age: 28,
    role: "Yoga teacher",
    location: "Bengaluru",
    distanceKm: 4.4,
    bio: "Ashtanga, plant-based cooking, and a growing pottery obsession. Looking for a calm, curious friend.",
    interests: ["Yoga", "Cooking", "Pottery", "Reading"],
    instagram: "@sana.flows",
    gradient: ["#fecaca", "#dc2626"],
  },
  {
    id: "kabir",
    name: "Kabir",
    age: 30,
    role: "Chef",
    location: "Bengaluru",
    distanceKm: 8.2,
    bio: "Runs a tiny supper club. Football on Sundays, jazz records the rest of the week.",
    interests: ["Cooking", "Football", "Jazz", "Travel"],
    instagram: "@kabir.eats",
    gradient: ["#fed7aa", "#ea580c"],
  },
  {
    id: "meera",
    name: "Meera",
    age: 23,
    role: "PhD student",
    location: "Bengaluru",
    distanceKm: 3.9,
    bio: "Marine biology, tide-pool nerd. Loves board games and terrible sci-fi movies.",
    interests: ["Science", "Board Games", "Sci-Fi", "Hiking"],
    instagram: "@meera.tides",
    gradient: ["#a5f3fc", "#0891b2"],
  },
];

export type Mode = "similar" | "different";

// Very small graph-inspired scoring:
//  - similar: prefer high Jaccard overlap on interests, closer distance
//  - different: prefer low overlap, further distance (breaks the cluster)
export function scoreProfile(anchor: Profile, other: Profile, mode: Mode) {
  const a = new Set(anchor.interests.map((i) => i.toLowerCase()));
  const b = new Set(other.interests.map((i) => i.toLowerCase()));
  const inter = [...a].filter((x) => b.has(x)).length;
  const union = new Set([...a, ...b]).size || 1;
  const jaccard = inter / union; // 0..1
  const distanceNorm = Math.min(other.distanceKm, 20) / 20; // 0..1

  return mode === "similar"
    ? jaccard * 0.85 + (1 - distanceNorm) * 0.15
    : (1 - jaccard) * 0.75 + distanceNorm * 0.25;
}

export function rankCandidates(
  anchor: Profile,
  pool: Profile[],
  mode: Mode,
  excludeIds: Set<string>,
) {
  return pool
    .filter((p) => !excludeIds.has(p.id) && p.id !== anchor.id)
    .map((p) => ({ p, score: scoreProfile(anchor, p, mode) }))
    .sort((a, b) => b.score - a.score)
    .map((x) => x.p);
}

// Diversity: 1 - average Jaccard between you and your connections.
// Higher = more diverse network.
export function diversityScore(anchor: Profile, connections: Profile[]) {
  if (connections.length === 0) return 0;
  const a = new Set(anchor.interests.map((i) => i.toLowerCase()));
  const avg =
    connections.reduce((acc, c) => {
      const b = new Set(c.interests.map((i) => i.toLowerCase()));
      const inter = [...a].filter((x) => b.has(x)).length;
      const union = new Set([...a, ...b]).size || 1;
      return acc + inter / union;
    }, 0) / connections.length;
  return Math.round((1 - avg) * 100);
}
