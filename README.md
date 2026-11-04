<div align="center">

# Amjad Shah
### AI Video Creator · Video Editor · Full-Stack Developer

Creative storytelling and practical software, built around your business.

**[Explore My Portfolio](https://my-portfolio-pc1o.onrender.com/) · [Try the AI Receptionist Demo](https://amjads-demo-agent.onrender.com/) · [Let’s Work Together](mailto:amjadshahg26@gmail.com)**

</div>

---

## About Me

I’m Amjad Shah, a freelance video editor, AI creator and full-stack web developer based in Islamabad, Pakistan, studying BS Software Engineering at Iqra University Islamabad Campus.

I help studios and emerging brands turn ideas into product commercials, short-form videos and AI-assisted visuals. Alongside creative work, I build websites, applications and AI integrations that solve practical business problems.

This repository contains my personal portfolio: a place to explore selected films, development projects, service demos and current research.

## Selected Creative Work

| Project | What to explore |
| --- | --- |
| **Web Autónomos** | A vertical website promotional editing sample featuring mobile-screen visuals and a concise service introduction. |
| **Joepify** | A short brand promotional editing sample with bold messaging, blue and purple visuals, and a “Get a quote” close. |
| **Regimen — Product & App Story** | A product-film sample combining a studio reveal, product close-ups and companion-app visuals. |
| **CreADE — Full Commercial** | A completed 29-second commercial showcased in the portfolio’s video player. |
| **Ecommerce, Made Clear** | A vertical editing and motion graphics piece focused on presenting ecommerce clearly. |
| **Meet Your AI Creator** | A personal service promo introducing my creative offering. |

**[Watch the work →](https://my-portfolio-pc1o.onrender.com/#films)**

Samples, personal promos and completed work are identified separately. Project descriptions do not imply campaign results or client relationships beyond what is documented.

## What I Can Help With

- **AI commercials and UGC-style creatives:** product stories, promotional concepts and AI-assisted visuals.
- **Video editing and motion graphics:** reels, short-form content, typography, pacing and polished promotional edits.
- **Web and app development:** responsive business websites, portfolios and custom applications.
- **AI agents and automation:** receptionist solutions, chatbots and integrations scoped around enquiries, bookings and business workflows.

Creative tools in my workflow include **After Effects, Premiere Pro, CapCut, Flow and Higgsfield**. My broader development stack includes **JavaScript, React, Next.js, Node.js, Express, Python, PHP, Laravel, MySQL and MongoDB**.

The tools listed above describe my wider skill set; the deployed portfolio itself uses the simpler stack documented below.

## AI Receptionist Demo

**[Open Amjad’s Demo Agent →](https://amjads-demo-agent.onrender.com/)**

Explore a guided prototype for an AI receptionist. Production phone, WhatsApp, website chat and booking integrations are scoped separately for each business; the demo should not be taken as proof that every integration is already connected.

## Research: UnStickCode

**UnStickCode** is my final-year project proposal for an offline desktop IDE that supports guided programming learning.

The proposed Windows prototype brings together an educational language, compiler and virtual machine, a visual debugger, reviewed lessons and exercises, bounded offline neural guidance, and an English push-to-talk tutor.

These are **planned research and prototype goals**, distinguished from completed product capabilities.

## Portfolio Features

- Separate creative work and development sections.
- Video previews, project notes and an integrated player.
- Responsive layouts with mobile navigation.
- Motion controls and a skip-to-content link.
- Creative and development CVs.
- A project enquiry form that opens a prefilled Gmail draft or another email app for review before sending.

## Built With

| Layer | Technology |
| --- | --- |
| Live portfolio | HTML, CSS and vanilla JavaScript |
| Build | Node.js script using built-in filesystem APIs |
| Hosting | Render, connected to the `master` branch |
| Earlier implementation | React, Vite and Tailwind CSS, retained in this repository |

### Repository Guide

| Path | Purpose |
| --- | --- |
| `creative-portfolio/` | Source for the primary live portfolio |
| `creative-portfolio/index.html` | Page content and sections |
| `creative-portfolio/app.js` | Portfolio interactions |
| `creative-portfolio/assets/` | Video, image and document assets |
| `src/build-portfolio.mjs` | Copies the live portfolio into `src/build/` |
| `src/package.json` | Build command for the live portfolio |
| `src/` and root `package.json` | Also contain the earlier React/Vite implementation |
| `docs/portfolio-project-register.md` | Published media sources and project classifications |
| `CREATIVE_PORTFOLIO.md` | Additional portfolio and deployment notes |

## Run Locally

### Primary portfolio

Use **Node.js 18 or later** and Python 3 for the preview server.

```bash
git clone https://github.com/amjadazizshah/my-portfolio.git
cd my-portfolio/src
npm run build
python -m http.server 8000 --directory build
```

Open **http://localhost:8000**.

The build copies `creative-portfolio/` to `src/build/`. To preview source changes without rebuilding, run this from the repository root:

```bash
python -m http.server 8000 --directory creative-portfolio
```

### Earlier React implementation

The root-level commands target the earlier React/Vite app:

```bash
npm ci
npm run dev
```

Use a Node.js version compatible with the Vite version in the root `package.json` when working on that implementation.

## Deployment & Updates

The primary Render site deploys from `master` with:

| Setting | Value |
| --- | --- |
| Root directory | `src` |
| Build command | `npm install; npm run build` |
| Publish directory | `build` |

To update the live portfolio:

1. Edit the relevant content or assets in `creative-portfolio/`.
2. For new films, add the approved final export, a poster and an accurate project description.
3. Record media sources and classifications in `docs/portfolio-project-register.md`.
4. Run `npm run build` from `src/` and check the changed pages, links and video playback.
5. Commit and push to `master`; the connected Render service handles deployment.

## Let’s Build Something Worth Showing

Have a product to introduce, a reel to edit or a business workflow to improve? Send your brief, references and target date so we can agree on the right scope.

**[View Portfolio](https://my-portfolio-pc1o.onrender.com/) · [Email Amjad](mailto:amjadshahg26@gmail.com) · [GitHub](https://github.com/amjadazizshah)**

Projects and ongoing work are quoted to suit the agreed scope.

---

### Media & Usage

Personal and client media belong to their respective owners. Inclusion in this repository does not grant permission to reuse videos, branding, portraits or other project assets. No reuse licence is granted for those materials.
