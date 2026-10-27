# Amjad Shah — Creative & Developer

The live Render portfolio source is in `creative-portfolio/`. It includes the original portrait, existing project artwork, Saber portrait, the two designed PDF CVs, and the 29-second Cre·ADE commercial with the download control suppressed.

The current final year project is **UnStickCode: An Offline Desktop IDE for Guided Programming Learning**, replacing Capture Defect. The page describes the planned Windows prototype, educational language/compiler/VM, visual debugger, reviewed lessons/exercises, bounded offline neural guidance, and English push-to-talk tutor. Proposal goals are distinguished from completed capabilities. The full student form is not published.

New concept covers for UnStickCode and Restaurant POS are in `creative-portfolio/assets/projects/`. Their source prompts and usage notes are recorded in `docs/portfolio-cover-prompts.md`. They are labeled as conceptual illustrations, not application screenshots.

## Build and deploy

From `src/`, run `npm run build`. The build uses Node built-ins to copy the static portfolio to `src/build/` (Node 18+).

The existing Render service uses root directory `src`, build command `npm install; npm run build`, and publish directory `build`. It deploys the repository's `master` branch automatically. The previous React implementation remains in the repository.

Personal and client media belong to their respective owners; no reuse licence is granted.

## AI receptionist service

The service feature at `#ai-receptionist` links to https://amjads-demo-agent.onrender.com/ and offers a custom quote for English receptionist implementations across phone, website chat and WhatsApp. Support is optional; provider costs are scoped separately. The development gallery includes the guided prototype as a seventh project with an original SVG illustration and an explicit distinction between the demo and production integrations. The contact form supports AI receptionist enquiries without sending automatically.
