<div align="center">

# ShrimathDasbodh

A modern, minimal, spiritual reading web app for **Srimath Dasbodh** with Dashak/Samas navigation and Ovi reading experience.

[![Next.js](https://img.shields.io/badge/Next.js_15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

![Srimath Dasbodh Website Mockup](./public/website_mockup.png)

**[Live Demo →](https://srimath-dasbodh.vercel.app/)**

</div>

---

## Why I built this

Every existing Dasbodh reading site is cluttered with ads, outdated UI, and poor mobile experience.
The goal was a clean, distraction-free reader built with a modern stack, something worth opening daily.


---
## About the Author: Samarth Ramdas

**Samarth Ramdas** (1608–1681) was a prominent 17th-century Marathi saint, philosopher, poet, and spiritual master. A devoted follower of Lord Rama and Hanuman, he is uniquely remembered for blending profound spiritual wisdom with practical guidance for everyday life, governance, and societal upliftment.

Key highlights of his life and teachings:

* **The Author of Dasbodh:** His magnum opus, *Dasbodh*, is a comprehensive spiritual text written in Marathi. Structured into 20 *Dashakas* (chapters) and 200 *Samasas* (sub-chapters), it serves as a practical, step-by-step guide to navigating life, understanding human psychology, fulfilling one's duties, and achieving self-realization.
* **Mentor to a King:** He was a contemporary and widely revered spiritual guide to the great Maratha warrior king, Chhatrapati Shivaji Maharaj.
* **Practical Spirituality:** Unlike many traditional mystics who advocated solely for asceticism, Ramdas Swami strongly emphasized the balance between spiritual growth and worldly responsibilities. He advocated for physical fitness, discipline, and active, ethical participation in society.

This project aims to bridge the 17th-century wisdom of Samarth Ramdas making the intricate teachings of *Dasbodh* highly accessible, searchable, and interactive for today's generation.

---

## Features

- Offline/local Dasbodh dataset in JSON (`app/data/dashaks.json`)
- Search across Dashak/Samas with transliteration-friendly matching
- Active Dashak/Samas highlighting
- Smooth mobile nav modal animation (Framer Motion)
- Settings menu:
  - Theme cycle: **Grey -> Dark -> Light**
  - Font size `+ / -`
  - Ovis per card (`1` or `2`)
- Weekly default Samas opening logic (Monday-based progression)
---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + Framer Motion |
| Deployment | Vercel |

---


## Getting started

```bash
# 1. Clone the repo
git clone https://github.com/Kaustubhjogle/SamarthDasbodh.git
cd SamarthDasbodh-main

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).


---
