# 🎵 Who Sings?

A fast, fun lyrics-guessing game built with **Next.js**, **Zustand**, and the **Musixmatch API**.  
Get a lyric line, pick the right artist, beat the timer, and climb the leaderboard!

---

## 🚀 Features

- 🎮 10-question music quiz
- 🕑 20-second timer + time-based scoring
- 🔊 Correct / wrong sound effects
- 🔥 Streak tracking
- 🌍 US & Italy chart selection
- 🧠 Player stats (locally persisted)
- 🏆 Leaderboard per country
- ✨ Smooth animations with Framer Motion

---

## 🛠 Tech Stack

- **Next.js**
- **React + TypeScript**
- **Zustand**
- **Tailwind CSS**
- **Framer Motion**
- **Musixmatch API**

---

## ▶️ Running the Project (pnpm)

### Install dependencies

```bash
pnpm install
```

### Start development server

```bash
pnpm run dev
```

### Build for production

```bash
pnpm run build
pnpm start
```

---

## ⚙️ Environment Variables

You will need:
MUSIXMATCH_API_KEY=your_api_key_here

---

## 🎤 How Questions Work

- Fetch top trending tracks by country (**US / IT**)
- Pull one lyric snippet per track
- Generate **3 artists**:
  - ✅ 1 correct
  - ❌ 2 distractors
- Prefer distractors from the **same genre**
- Always try to return **10 questions**, even when data is limited
- Country-specific caches keep everything fast

---

## 📊 Scoring

- **Up to 1000 pts** per question (scaled by time left)
- **0 pts** for wrong answers
- Time-based scoring formula
- Track:
  - ✔️ Correct answers
  - 🔥 Streak
  - 🏅 Best streak
- Final results
- Built-in **Share your score** button

---

🔗 **Live Demo:** <https://musixmatch-lyrics-game.vercel.app/>

---

## 👨‍💻 Author

Made with ✦love✦ by Marco
