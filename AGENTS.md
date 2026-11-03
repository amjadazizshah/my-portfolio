# Portfolio maintenance

Amjad's standing instruction (1 November 2026): improve the portfolio and update it whenever a project is completed. Treat an explicit final/completed project handoff as a portfolio maintenance step; add the final usable asset, an accurate description, thumbnail and working player/demo in the relevant category, validate and publish through the existing GitHub/Render setup. Do not create another hosting service.

- Primary portfolio: https://my-portfolio-pc1o.onrender.com/; source `creative-portfolio/` on `master`; Render service `srv-d9dgmfrtqb8s738lu3jg`, workspace `tea-d7mcm7mgvqtc73a8s0mg`. Auto-deploy is enabled. Build: `cd src && npm run build`.
- Dedicated creative portfolio: https://amjad-creative-studio.onrender.com/; source `new-portfolios/creative/` on `two-new-portfolios`. Keep relevant finished creative projects in sync when updating that branch. Software portfolio shares that branch at `new-portfolios/software/`.
- Use Amjad Shah and BS Software Engineering. Prefer the Render portfolio links in handoffs and outreach.
- Preserve the established themes, custom quote flow and existing pricing unless Amjad changes it. Keep CreADE playable without a visible download control or direct download link.
- Publish final approved exports, not raw footage, unfinished iterations, private correspondence or client assets marked confidential. If completion, publishability or the final version is unclear, hold that project and report the specific missing detail.
- Distinguish completed client work, editing samples, personal/spec work, prototypes and academic proposals. Do not invent clients, tools used, capabilities, testimonials or measured outcomes.
- Deduplicate by project identity and final asset hash. Replace the existing entry when an updated final export is approved. Record final sources in `docs/portfolio-project-register.md`.
- Run build and JavaScript checks; verify asset paths, playback and responsive layout where browser access is available. Preserve unrelated concurrent edits. Check the automatic Render deployment instead of manually triggering another deployment.
