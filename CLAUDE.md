# Working contract for this site

Adapted from Josh's working contract (trimmed core of github.com/jbarbier/CLAUDE.md), fitted to this repo: an Astro 7 site with plain CSS tokens (no animation library: CSS plus small scripts), edited by Josh in Pages CMS. Pairs with the karpathy-guidelines skill: "do the whole thing" means the whole thing the task needs, never more.

## How to work

Do the whole thing the task actually needs. Do it right, with docs where they matter. Never offer to "table this for later" when the permanent fix is within reach. Never present a workaround when the real fix exists.

Search before building. Check before shipping. When Josh asks for something, the answer is the finished product, not a plan to build it.

Before calling anything done, be able to explain why the change is correct and where it would break.

## Consent and git (Josh's rules, these override everything below)

- Tell Josh what a command does and get his OK before running anything on his computer. No unexplained commands.
- Commit and push only when Josh asks. Home page work may go straight to `main`. Anything else, or any bigger change where it's unclear, goes to a branch and a pull request for Josh to review.
- Josh is the only contributor on his repos: no Co-Authored-By or other AI attribution lines in commits.

## House rules for this site

- **Everything Josh might change must be editable in Pages CMS.** Text and images go in content files (e.g. `src/content/home/home.yml`), with matching fields in `.pages.yml` and the schema in `src/content.config.ts`. Never hard-code copy or images in `.astro` pages.
- **Taste.** Read `TASTE.md` and `DECISIONS.md` before visual work. Josh's favourite art is Lemoyne's *Apotheosis of Hercules* and Boucher-style chinoiserie. He dislikes busy engravings, art shown too large, grey "calming" filters, and gradient fades between sections. Sections alternate dark and light, ending dark at Start a Project.
- **Build in the cloud container.** Astro's bin script refuses the container's Node version. Run the CLI directly through a small runner: `import(process.cwd() + '/node_modules/astro/dist/cli/index.js').then(m => m.cli(process.argv))`, then `node runner.mjs build`. Serve `dist/` with `python3 -m http.server` instead of `astro preview`.
- **Tokens.** Josh wants to save tokens: keep replies short and skip screenshot passes that aren't needed.

## Task sizing: triage before spending effort

Medium and large tasks start with a short triage block. Small tasks skip it.

```
Size: medium | large, and why
Checks: what will be run, and why
```

- **small**: copy change, styling value, config tweak, rename, one-or-two-file edit with no behavior change. Run the build.
- **medium**: a localized behavior or layout change, or a bug fix in one component. Build, plus a screenshot of the affected section if layout changed.
- **large**: new page or feature, CMS schema change, or cross-component work. Build, screenshots of every affected page at desktop and phone width, and a check that the new fields appear in `.pages.yml`.

When torn between two sizes, pick the smaller and say so. Escalate the moment the change turns out bigger.

## Checks (this repo has no test suite)

- A clean `astro build` is the baseline check for every change.
- Layout changes get a screenshot only when they need one; don't run screenshot passes by habit.
- Scripts with real logic (e.g. `src/scripts/*`) get a test when their behavior changes.

## Two kinds of work: latent vs deterministic

If the same question asked twice would have the same correct answer by definition (arithmetic, dates, file lookups, JSON or YAML transforms, image toning), write a script instead of doing it in your head. Judgment work (design, copy, taste) stays with the model.

## Completion status

End medium and large tasks with one of:

- **DONE**: all steps complete, with evidence for every claim.
- **DONE_WITH_CONCERNS**: complete, with issues Josh should know about, each with severity and a proposed follow-up.
- **BLOCKED**: can't proceed. Say what's blocking and what was tried.
- **NEEDS_CONTEXT**: missing information. Say exactly what's needed.

"Partially done" is not a status.

## Self-rating (medium and large tasks only)

Before the final report, re-read the diff fresh and score it 1-10. Every point below 10 names a specific gap. Fix what can be fixed and re-rate; otherwise report DONE_WITH_CONCERNS. Never inflate the score.

## Confusion protocol

On high-stakes ambiguity (a request that contradicts an existing pattern, a destructive operation with unclear scope, missing context that would change the approach): stop, name it in one sentence, give 2-3 options with trade-offs, and ask Josh. Routine changes: pick the most likely reading, do it, and say which reading you chose.

## Safety

- Never commit secrets. If `.env` is touched, check `.gitignore` before any commit.
- Never run `rm -rf`, `git reset --hard`, `git push --force` or similar without explicit confirmation.
- Never skip pre-commit hooks with `--no-verify`.
- Never commit build output (`dist/`), binaries or video. Site images in `src/assets/` and `public/`, and Pages CMS uploads, are expected; keep them web-sized (WebP or JPEG, compressed).
- Before anything that touches the live site, say what you're about to do and wait for confirmation.

## How to talk to Josh

- Direct, short, concrete. No preamble.
- Point at specifics: `src/components/Nav.astro:47`, not "there's an issue in the nav".
- If something is broken, say so plainly.
- End with the next action, not a recap.
