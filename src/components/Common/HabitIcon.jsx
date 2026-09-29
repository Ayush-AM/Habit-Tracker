import React from 'react';
import {
  Database,
  Binary,
  Cpu,
  Brain,
  Code2,
  Terminal,
  Target,
  Briefcase,
  Shield,
  Video,
  Camera,
  Dumbbell,
  Activity,
  Heart,
  Footprints,
  Droplets,
  Languages,
  Clapperboard,
  GitPullRequest,
  GitBranch,
  Globe,
  Zap,
  Flame,
  Clock,
  BookOpen,
  Award,
  Trophy,
  Sparkles,
  Layers,
  FileSpreadsheet,
  Snowflake,
  Sun,
  Moon,
  Compass,
  CheckCircle2,
  CheckSquare,
  Coffee,
  Music,
  PenTool,
  Smile
} from 'lucide-react';

// Master icon component dictionary
export const ICON_COMPONENTS = {
  // Study & Tech
  database: Database,
  binary: Binary,
  cpu: Cpu,
  brain: Brain,
  code: Code2,
  code2: Code2,
  terminal: Terminal,
  book: BookOpen,
  bookopen: BookOpen,

  // Career & Goals
  target: Target,
  briefcase: Briefcase,
  award: Award,
  trophy: Trophy,
  compass: Compass,

  // Security & System
  shield: Shield,

  // Media & Content
  video: Video,
  camera: Camera,
  clapperboard: Clapperboard,

  // Fitness & Health
  dumbbell: Dumbbell,
  activity: Activity,
  heart: Heart,
  footprints: Footprints,
  droplets: Droplets,

  // Communication & Open Source
  languages: Languages,
  gitpullrequest: GitPullRequest,
  gitbranch: GitBranch,
  globe: Globe,

  // Productivity, Routine & Energy
  zap: Zap,
  flame: Flame,
  clock: Clock,
  sparkles: Sparkles,
  layers: Layers,
  coffee: Coffee,
  music: Music,
  pentool: PenTool,
  smile: Smile,
  checkcircle2: CheckCircle2,
  checksquare: CheckSquare,

  // Themes & Environment
  filespreadsheet: FileSpreadsheet,
  snowflake: Snowflake,
  sun: Sun,
  moon: Moon
};

// Emoji to professional icon key mapping
const EMOJI_TO_ICON_KEY = {
  '💻': 'database',
  '⚡': 'binary',
  '🧠': 'brain',
  '🎯': 'target',
  '🛡️': 'shield',
  '🛡': 'shield',
  '📹': 'video',
  '💪': 'dumbbell',
  '🗣️': 'languages',
  '🗣': 'languages',
  '🎬': 'clapperboard',
  '👟': 'footprints',
  '💧': 'droplets',
  '🌐': 'gitpullrequest',
  '💼': 'briefcase',
  '🧗': 'flame',
  '💤': 'moon',
  '✨': 'sparkles',
  '📑': 'filespreadsheet',
  '❄️': 'snowflake',
  '❄': 'snowflake',
  '🌌': 'moon',
  '☀️': 'sun',
  '☀': 'sun',
  '📌': 'target',
  '🔥': 'flame',
  '🚀': 'target',
  '📚': 'bookopen',
  '🧘': 'smile',
  '🥗': 'heart',
  '🏋️': 'dumbbell',
  '🏃': 'activity',
  '⏱️': 'clock'
};

// Curated list for the Modal Icon Picker
export const POPULAR_PROFESSIONAL_ICONS = [
  { key: 'Database', name: 'Database (SQL)', group: 'Tech' },
  { key: 'Binary', name: 'Binary / DSA', group: 'Tech' },
  { key: 'Code2', name: 'Coding / Dev', group: 'Tech' },
  { key: 'Terminal', name: 'Terminal / CLI', group: 'Tech' },
  { key: 'Cpu', name: 'Core Systems', group: 'Tech' },
  { key: 'Brain', name: 'Cognition / Mind', group: 'Tech' },
  { key: 'Target', name: 'Interview / Apti', group: 'Career' },
  { key: 'Briefcase', name: 'Career / Job', group: 'Career' },
  { key: 'Shield', name: 'Cybersecurity', group: 'Security' },
  { key: 'Video', name: 'Timelapse', group: 'Media' },
  { key: 'Clapperboard', name: 'Vlog / Media', group: 'Media' },
  { key: 'Dumbbell', name: 'Exercise / Gym', group: 'Fitness' },
  { key: 'Activity', name: 'Cardio / Workout', group: 'Fitness' },
  { key: 'Footprints', name: '8000 Steps', group: 'Fitness' },
  { key: 'Droplets', name: '3L Water', group: 'Health' },
  { key: 'Heart', name: 'Health / Vitals', group: 'Health' },
  { key: 'Languages', name: 'English / Comm', group: 'Language' },
  { key: 'GitPullRequest', name: 'Open Source', group: 'Open Source' },
  { key: 'Globe', name: 'Global / Web', group: 'Open Source' },
  { key: 'Flame', name: 'Streak / Drive', group: 'Discipline' },
  { key: 'Zap', name: 'Discipline / Focus', group: 'Discipline' },
  { key: 'Clock', name: 'Deep Work Hours', group: 'Discipline' },
  { key: 'BookOpen', name: 'Reading Books', group: 'Study' },
  { key: 'Award', name: 'Goal Milestone', group: 'Milestone' }
];

export function HabitIcon({
  name,
  size = 16,
  className = '',
  color,
  strokeWidth = 2
}) {
  if (!name) {
    return <Sparkles size={size} className={className} strokeWidth={strokeWidth} style={color ? { color } : undefined} />;
  }

  // Check if string is an emoji
  let resolvedKey = EMOJI_TO_ICON_KEY[name] || name;

  // Clean key: lowercase, strip non-alphanumeric
  const cleanKey = String(resolvedKey).toLowerCase().replace(/[^a-z0-9]/g, '');

  const IconComp = ICON_COMPONENTS[cleanKey] || Sparkles;

  return (
    <IconComp
      size={size}
      className={`habit-pro-icon ${className}`}
      strokeWidth={strokeWidth}
      style={color ? { color } : undefined}
    />
  );
}

export default HabitIcon;
