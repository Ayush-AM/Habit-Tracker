/**
 * Habit Tracker — Generic Default Habits & Theme Constants
 * A universal habit tracker for daily discipline and personal growth.
 */

export const DEFAULT_WINTER_ARC_HABITS = [
  {
    id: "habit-exercise",
    name: "Exercise / Gym",
    category: "Fitness",
    icon: "Dumbbell",
    goal: 25,
    color: "#e11d48"
  },
  {
    id: "habit-reading",
    name: "Read 30 Minutes",
    category: "Learning",
    icon: "BookOpen",
    goal: 25,
    color: "#4f46e5"
  },
  {
    id: "habit-meditation",
    name: "Meditation",
    category: "Mindfulness",
    icon: "Leaf",
    goal: 20,
    color: "#059669"
  },
  {
    id: "habit-study",
    name: "Study / Learn",
    category: "Learning",
    icon: "GraduationCap",
    goal: 25,
    color: "#2563eb"
  },
  {
    id: "habit-sleep",
    name: "Sleep 7+ Hours",
    category: "Health",
    icon: "Moon",
    goal: 28,
    color: "#6366f1"
  },
  {
    id: "habit-water",
    name: "Drink 3L Water",
    category: "Health",
    icon: "Droplets",
    goal: 30,
    color: "#06b6d4"
  },
  {
    id: "habit-steps",
    name: "10,000 Steps",
    category: "Fitness",
    icon: "Footprints",
    goal: 25,
    color: "#16a34a"
  },
  {
    id: "habit-journal",
    name: "Journal / Reflect",
    category: "Mindfulness",
    icon: "PenLine",
    goal: 20,
    color: "#d97706"
  },
  {
    id: "habit-healthy-food",
    name: "Eat Clean",
    category: "Health",
    icon: "Apple",
    goal: 25,
    color: "#ea580c"
  },
  {
    id: "habit-no-phone",
    name: "No Phone Before Bed",
    category: "Mindfulness",
    icon: "SmartphoneOff",
    goal: 25,
    color: "#7c3aed"
  },
  {
    id: "habit-side-project",
    name: "Side Project / Coding",
    category: "Productivity",
    icon: "Code2",
    goal: 20,
    color: "#0284c7"
  },
  {
    id: "habit-gratitude",
    name: "Gratitude Practice",
    category: "Mindfulness",
    icon: "Heart",
    goal: 25,
    color: "#f43f5e"
  }
];

export const HABIT_CATEGORIES = [
  { name: "Fitness", icon: "Dumbbell", color: "#e11d48" },
  { name: "Health", icon: "Heart", color: "#06b6d4" },
  { name: "Learning", icon: "BookOpen", color: "#4f46e5" },
  { name: "Mindfulness", icon: "Leaf", color: "#059669" },
  { name: "Productivity", icon: "Zap", color: "#ea580c" },
  { name: "Career", icon: "Briefcase", color: "#0891b2" },
  { name: "Social", icon: "Users", color: "#d97706" },
  { name: "Creative", icon: "Palette", color: "#7c3aed" },
  { name: "Finance", icon: "Wallet", color: "#16a34a" },
  { name: "Sleep", icon: "Moon", color: "#6366f1" },
  { name: "Other", icon: "Sparkles", color: "#64748b" }
];

export const MOTIVATIONAL_QUOTES = [
  {
    quote: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: "Aristotle"
  },
  {
    quote: "Small disciplines repeated with consistency every day lead to great achievements.",
    author: "John C. Maxwell"
  },
  {
    quote: "You don't rise to the level of your goals, you fall to the level of your systems.",
    author: "James Clear, Atomic Habits"
  },
  {
    quote: "Discipline is choosing between what you want now, and what you want most.",
    author: "Abraham Lincoln"
  },
  {
    quote: "Success is the sum of small efforts, repeated day in and day out.",
    author: "Robert Collier"
  },
  {
    quote: "The secret of getting ahead is getting started.",
    author: "Mark Twain"
  },
  {
    quote: "Motivation is what gets you started. Habit is what keeps you going.",
    author: "Jim Ryun"
  }
];

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const DAY_LETTERS = ["S", "M", "T", "W", "T", "F", "S"];

export const THEMES = [
  { 
    id: "theme-pastel", 
    name: "Pastel Sheet", 
    icon: "FileSpreadsheet", 
    desc: "Reference spreadsheet style",
    colors: ["#6366f1", "#0d9488", "#db2777", "#ca8a04"]
  },
  { 
    id: "theme-frost", 
    name: "Arctic Frost", 
    icon: "Snowflake", 
    desc: "Icy dark mode with high contrast",
    colors: ["#38bdf8", "#0b1120", "#a78bfa", "#2dd4bf"]
  },
  { 
    id: "theme-midnight", 
    name: "Midnight Cyber", 
    icon: "Moon", 
    desc: "OLED neon aesthetic for night owls",
    colors: ["#06b6d4", "#030712", "#c084fc", "#34d399"]
  },
  { 
    id: "theme-clean", 
    name: "Clean Minimal", 
    icon: "Sun", 
    desc: "Crisp light workspace layout",
    colors: ["#2563eb", "#ffffff", "#0f172a", "#10b981"]
  }
];
