# ❄️ Winter Arc Habit Tracker — Professional React Edition

A modern, high-performance **React + Vite** habit tracking dashboard inspired by Google Sheets habit spreadsheets and customized specifically for your **Winter Arc** regimen.

---

## 📋 Included Habits (From Your Notebook)

Pre-loaded directly from your handwritten notes:

| # | Habit Name | Category | Default Month Goal | Description |
|---|------------|----------|-------------------|-------------|
| 1 | **SQL** | 💻 Tech / Study | 25 Days | Daily database queries & practice |
| 2 | **DSA** | ⚡ Tech / Study | 25 Days | Data Structures & Algorithms problem solving |
| 3 | **CORE** | 🧠 Tech / CS | 20 Days | CS Core fundamentals (OS, DBMS, CN, OOPs) |
| 4 | **INTERVIEW / APTI** | 🎯 Career | 20 Days | Mock interview prep & aptitude questions |
| 5 | **CYBER** | 🛡️ Cybersecurity | 20 Days | Hands-on labs & cybersecurity learning |
| 6 | **Timelapse Everything** | 📹 Productivity | 30 Days | Record your deep work sessions for accountability |
| 7 | **EXERCISE** | 💪 Fitness | 25 Days | Gym / workout / strength training |
| 8 | **ENGLISH** | 🗣️ Communication | 25 Days | Speaking, reading & vocabulary drills |
| 9 | **VLOG** | 🎬 Content | 20 Days | Daily documentation & content creation |
| 10 | **8000 STEPS** | 👟 Fitness | 30 Days | Daily step count target |
| 11 | **3 L of WATER** | 💧 Health | 30 Days | Hydration goal |

---

## 🏗️ Architecture & React Component Tree

```
src/
├── lib/
│   ├── supabase.js               # Supabase cloud client initialization
│   └── syncService.js            # Multi-device real-time cloud sync & owner authentication
├── types/
│   └── habit.js                  # Default Winter Arc habits, categories, quotes, themes
├── hooks/
│   ├── useHabits.js              # State management, cloud sync, streaks, owner authorization
│   ├── useAudio.js               # Web Audio API harmonic chimes for checking habits
│   └── useTheme.js               # Dynamic CSS variable theme switcher
├── components/
│   ├── Header.jsx                # Navigation bar, single-user owner status, cloud sync indicator
│   ├── Dashboard/
│   │   ├── SummaryCard.jsx       # Month summary circular gauge, completion statistics, pace badge
│   │   ├── WeeklyDonuts.jsx      # Weeks 1 to 5 radial progress meters with pastel accents
│   │   ├── DailyBarChart.jsx     # Interactive bar chart (Days 1 to 31) with week color gradients
│   │   └── CategoryProgress.jsx  # Horizontal stacked progress bars with completed vs goal
│   ├── HabitGrid/
│   │   ├── TableToolbar.jsx      # Search input, category filter pills, Quick Fill Today, Reset Month
│   │   ├── HabitTable.jsx        # Multi-row grouped week headers (W1..W5, Mon..Sun, 1..31)
│   │   └── HabitRow.jsx          # Row with category badge, editable goal, streak badge, checkboxes
│   ├── DailyTracker/
│   │   ├── MobileDailyView.jsx   # Touch-optimized mobile daily checklist with view-only lock
│   │   ├── WinterArcLog.jsx      # Step counter, Water intake, Deep work hours, focus reflections
│   │   └── QuoteCard.jsx         # Motivational Winter Arc quotes carousel
│   ├── Modals/
│   │   ├── HabitModal.jsx        # Add/Edit Habit modal with category selector & emoji picker
│   │   └── OwnerModal.jsx        # Single-user owner authorization, cloud sync status & PIN settings
│   └── Common/
│       ├── Toast.jsx             # Animated toast notifications
│       └── Confetti.js           # Milestone celebration confetti
├── App.jsx                       # Main application shell
├── main.jsx                      # Vite entry point
└── index.css                     # Comprehensive design system & CSS variables
```

---

## 🌟 Key Features

1. **👑 Dedicated Single-User Architecture & Supabase Cloud Sync**:
   - **Zero-Friction Access**: Designed exclusively for **Ayush**. No email/password forms required every time you open the app.
   - **Cross-Device Status Tracking**: Habits, checkmarks, step counts, and focus reflections sync automatically in real-time between your phone, laptop, and Vercel deployment.
   - **Vercel Handling Protection**: Unauthenticated visitors are restricted to **View-Only Mode**, ensuring no stranger can modify, delete, or check off your habits.
   - **1-Click Auto-Unlock**: Bookmark `https://your-domain.vercel.app/?owner=2026` once on your phone or laptop to permanently remember your device and bypass all PIN prompts forever.

2. **Top Analytics Dashboard (Matching Reference Photo 2)**:
   - **Summary Ring Gauge**: Real-time month completion percentage (`X completed / Y total goal`).
   - **5 Weekly Donut Rings**: Week 1 (Lilac), Week 2 (Mint Teal), Week 3 (Rose Pink), Week 4 (Sky Blue), and Week 5 (Amber).
   - **Daily Habit Count Bar Chart**: 1 to 31 dynamic vertical bars showing daily completion frequency.
   - **Category Progress Bars**: Visual track of completion vs target per category.

2. **Spreadsheet Matrix Table (Matching Reference Photos 1 & 3)**:
   - Grouped weekly headers (Days 1–7, 8–14, 15–21, 22–28, 29–31) with corresponding day-of-week letters (`M, T, W, T, F, S, S`).
   - **Automatic Today Column Highlight**: Gold glowing border and badge on today's date.
   - **Interactive Checkboxes**: Click to check/uncheck with smooth pop animations, harmonic Web Audio chimes (`🔔`), and streak tracking (`🔥`).
   - **Celebration Confetti**: Explodes when 100% of habits are completed on any day!
   - **Inline Editable Goals**: Click any goal number directly in the table to adjust it.

3. **Winter Arc Daily Reflection & Timelog**:
   - Quick counters for **👟 Steps**, **💧 Water (Liters)**, and **⏱️ Deep Work (Hours)**.
   - Focus notes input to save daily reflections, learnings, or timelapse links.
   - Motivational quotes carousel to keep your mindset locked in.

4. **4 Selectable Themes**:
   - 📑 **Pastel Sheet**: Exact Google Sheets spreadsheet aesthetic.
   - ❄️ **Winter Arc Frost**: High-contrast icy dark mode with glowing meters.
   - 🌌 **Midnight Cyber**: Deep OLED dark mode with neon accents.
   - ☀️ **Clean Minimalist**: Crisp high-contrast grayscale.

5. **Data Export & Import**:
   - **📥 CSV Export**: Export your active month data into a CSV format compatible with Google Sheets and Microsoft Excel.
   - **💾 JSON Backup & Restore**: One-click full data backup so your progress is never lost.

---

## 🚀 Running the App

The React development server is running at:
👉 **`http://localhost:3000`**

### Available Scripts:
- `npm run dev`: Starts the local Vite development server.
- `npm run build`: Builds the production bundle to `dist/`.
- `npm run preview`: Previews the production build locally.
