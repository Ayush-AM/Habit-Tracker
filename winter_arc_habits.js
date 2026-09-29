/**
 * Winter Arc Default Habits & Initial Configuration
 * Pre-populated directly from the user's handwritten Winter Arc notebook:
 * - SQL
 * - DSA
 * - CORE
 * - INTERVIEW / APTI
 * - CYBER
 * - Timelapse Everything
 * - EXERCISE
 * - ENGLISH
 * - VLOG
 * - 8000 STEPS
 * - 3 L of WATER
 */

const DEFAULT_WINTER_ARC_HABITS = [
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
  }
];

const MOTIVATIONAL_QUOTES = [
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

// Week color themes matching the Google Sheets reference images
const WEEK_THEME_COLORS = {
  week1: {
    name: "Week 1",
    bgLight: "#e9d5ff",      // Lilac / Soft Purple
    textDark: "#581c87",
    border: "#d8b4fe",
    chartFill: "#9333ea"
  },
  week2: {
    name: "Week 2",
    bgLight: "#ccfbf1",      // Mint / Light Teal
    textDark: "#115e59",
    border: "#99f6e4",
    chartFill: "#0d9488"
  },
  week3: {
    name: "Week 3",
    bgLight: "#fce7f3",      // Soft Pink / Rose
    textDark: "#831843",
    border: "#fbcfe8",
    chartFill: "#db2777"
  },
  week4: {
    name: "Week 4",
    bgLight: "#e0f2fe",      // Soft Sky Blue
    textDark: "#075985",
    border: "#bae6fd",
    chartFill: "#0284c7"
  },
  week5: {
    name: "Week 5",
    bgLight: "#fef3c7",      // Soft Amber / Warm Yellow
    textDark: "#78350f",
    border: "#fde68a",
    chartFill: "#d97706"
  }
};
