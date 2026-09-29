/**
 * Winter Arc Habits & Theme Constants
 * Tracking Period: October 1, 2026 → December 31, 2026 (92 Days)
 *
 * Pre-populated from the user's handwritten notebook:
 * 1. SQL
 * 2. DSA
 * 3. CORE
 * 4. INTERVIEW / APTI
 * 5. CYBER
 * 6. Timelapse Everything
 * 7. EXERCISE
 * 8. ENGLISH
 * 9. VLOG
 * 10. 8000 STEPS
 * 11. 3 L of WATER
 * 12. OPENSOURCE
 */

export const DEFAULT_WINTER_ARC_HABITS = [
  {
    id: "habit-sql",
    name: "SQL",
    category: "Tech / Study",
    icon: "💻",
    goal: 25,
    color: "#4f46e5"
  },
  {
    id: "habit-dsa",
    name: "DSA",
    category: "Tech / Study",
    icon: "⚡",
    goal: 25,
    color: "#2563eb"
  },
  {
    id: "habit-core",
    name: "CORE",
    category: "Tech / Study",
    icon: "🧠",
    goal: 20,
    color: "#0284c7"
  },
  {
    id: "habit-interview-apti",
    name: "INTERVIEW / APTI",
    category: "Career",
    icon: "🎯",
    goal: 20,
    color: "#059669"
  },
  {
    id: "habit-cyber",
    name: "CYBER",
    category: "Cybersecurity",
    icon: "🛡️",
    goal: 20,
    color: "#7c3aed"
  },
  {
    id: "habit-timelapse",
    name: "Timelapse Everything",
    category: "Productivity",
    icon: "📹",
    goal: 30,
    color: "#ea580c"
  },
  {
    id: "habit-exercise",
    name: "EXERCISE",
    category: "Fitness",
    icon: "💪",
    goal: 25,
    color: "#e11d48"
  },
  {
    id: "habit-english",
    name: "ENGLISH",
    category: "Communication",
    icon: "🗣️",
    goal: 25,
    color: "#0891b2"
  },
  {
    id: "habit-vlog",
    name: "VLOG",
    category: "Content & VLOG",
    icon: "🎬",
    goal: 20,
    color: "#d97706"
  },
  {
    id: "habit-steps",
    name: "8000 STEPS",
    category: "Fitness",
    icon: "👟",
    goal: 30,
    color: "#16a34a"
  },
  {
    id: "habit-water",
    name: "3 L of WATER",
    category: "Health",
    icon: "💧",
    goal: 30,
    color: "#06b6d4"
  },
  {
    id: "habit-opensource",
    name: "OPENSOURCE",
    category: "Open Source",
    icon: "🌐",
    goal: 20,
    color: "#f97316"
  }
];

export const HABIT_CATEGORIES = [
  { name: "Tech / Study", icon: "💻", color: "#4f46e5" },
  { name: "Career", icon: "💼", color: "#059669" },
  { name: "Cybersecurity", icon: "🛡️", color: "#7c3aed" },
  { name: "Fitness", icon: "💪", color: "#e11d48" },
  { name: "Health", icon: "💧", color: "#06b6d4" },
  { name: "Communication", icon: "🗣️", color: "#0891b2" },
  { name: "Content & VLOG", icon: "🎬", color: "#d97706" },
  { name: "Open Source", icon: "🌐", color: "#f97316" },
  { name: "Productivity", icon: "🧗", color: "#ea580c" },
  { name: "Sleep", icon: "💤", color: "#6366f1" },
  { name: "Other", icon: "✨", color: "#64748b" }
];

export const MOTIVATIONAL_QUOTES = [
  {
    quote: "The Winter Arc is where champions are forged in silence while others sleep.",
    author: "Winter Arc Creed"
  },
  {
    quote: "Small disciplines repeated with consistency every day lead to great achievements.",
    author: "John C. Maxwell"
  },
  {
    quote: "Lock in. 90 days of intense focus can completely change your trajectory.",
    author: "Discipline Protocol"
  },
  {
    quote: "You don't rise to the level of your goals, you fall to the level of your systems.",
    author: "James Clear, Atomic Habits"
  },
  {
    quote: "Every rep, every SQL query, every line of DSA code is a vote for who you are becoming.",
    author: "Self Mastery"
  },
  {
    quote: "Discipline is choosing between what you want now, and what you want most.",
    author: "Abraham Lincoln"
  },
  {
    quote: "Document the process. The timelapse will be the evidence of your relentless work ethic.",
    author: "Winter Arc Vision"
  }
];

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const DAY_LETTERS = ["S", "M", "T", "W", "T", "F", "S"];

export const THEMES = [
  { id: "theme-pastel", name: "Pastel Sheet", icon: "📑", desc: "Reference spreadsheet style" },
  { id: "theme-frost", name: "Winter Arc Frost", icon: "❄️", desc: "Icy dark mode" },
  { id: "theme-midnight", name: "Midnight Cyber", icon: "🌌", desc: "OLED neon aesthetic" },
  { id: "theme-clean", name: "Clean Minimal", icon: "☀️", desc: "Crisp light workspace" }
];
