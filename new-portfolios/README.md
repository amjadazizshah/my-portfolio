# Two separate portfolios for Amjad Shah

These are new, independent static sites on the `two-new-portfolios` branch.
The existing portfolio files, master branch and Render service are unchanged.

- `creative/`: creative editing, AI ad creative services, client CreADE film and four original spec-motion MP4s.
- `software/`: searchable project index covering 16 software, agent, website, mobile, game and research entries.

## Checks and hosting

Run `node new-portfolios/check.mjs` from the repository root. Each Render static
site uses this branch, its own `new-portfolios/creative` or
`new-portfolios/software` publish directory and a corresponding
`node new-portfolios/check.mjs creative` or `software` build command.
No runtime secrets or dependencies are required. Set `SKIP_INSTALL_DEPS=true`
to skip unrelated repository-root npm dependencies.

## Sample provenance

`tools/render_samples.py` reproducibly renders four 12-second H.264/AAC motion
design studies with Pillow, NumPy and FFmpeg. Typography, vector-like product
illustrations and synthesised audio are original procedural work. FORM, VOLT
and ORBIT are fictional concepts. These are not client campaigns or generated
AI-footage examples. CreADE is the existing client AI-video example; the film
is reused unchanged and its download UI is suppressed.

No brand results, testimonials, production adoption, app-store release or
advertising-performance figures are invented. Private projects have their
stage and restrictions described; their access settings are unchanged.
The two existing PDF CVs are reused without edits.

Personal and client assets remain the property of their respective owners.
