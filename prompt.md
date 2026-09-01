# EyePhi design session

**Ben:**

> Design for a monochromatic UI, using the latest primereact tailwind components and themes. This UI will allow users to build their own vestibular and VOR exercise program, where they can choose for a number of different off-the-shelf exercises that they can then customize (colors, intensity, duration) based on their rehabilitation desires. When they're building their exercise program, users should be able to have a "shopping cart" type of experience, where they can add various exercises to their basket (after adjusting the settings for each exercise). Each exercise should have  a difficulty score, which will be computed by an algorithm, based on the colors, duration, intensity and speed of the exercise's moving pieces. When each exercise gets added to their exercise basket, they should see each exercise's duration and difficulty, and these should sum up to show them the overall total length of their program and the overall difficulty level. Once they've submitted their exercise program, they should be prompted to either start the program now, or to copy their exercise program's unique, shareable link. I think the app needs to be minimalistic in design (because users who are going through vestibular rehabilitation are likely sensitive to visually busy designs), but there are a few things the user should ALWAYS be able to get to:
>
> 1. Activate / start their current exercise program
> 2. create a new exercise program
> 3. share their current program
> 4. See that the application's name is "EyePhi" and has an eyeball icon as its logo (so the users know what website they're on)
> 5. If they're currently going through their program, they should see the time elapsed into the program (and how much total time the program will take them). They should also be able to pause the program at any exercise (each exercise is a step in the program)
>
> Keep color usage to a minimum outside of the actual <canvas /> elements that will be holding the animated exercises the user is currently doing

**Agent:**

EyePhi is built as a single design component: near-monochrome shell (neutral grays, Helvetica, PrimeReact-style surfaces/borders/focus weights), with color confined to the exercise canvases.

Build view: 8 vestibular/VOR exercises, filterable by category; configure dialog with duration/speed/intensity sliders, 4 canvas colour schemes, texture toggle, live animated preview, and a live difficulty score.

Cart: per-exercise duration + difficulty bar, edit/remove, totals for length and duration-weighted overall difficulty.

Submit → Start now / copy shareable link.

Persistent header: logo + name, Start/Pause (primary), New, Share, and during a run the elapsed/total progress bar; run view adds step rail, pause, skip.

Tweaks available: reduced motion, difficulty scoring model, default palette.

> Created EyePhi.dc.html
> Found issues — fixing…
> Edited EyePhi.dc.html

**Ben:**

> ensure that this layout and application also works on mobile devices. Ideally, a user can use their phone in vertical mode to setup the exercises, but then either stay in vertical mode OR turn their phone horizontal to maximize the screenspace they have for the <canvas /> portion of their exercises
>
> I think you took this the wrong direction. you ended up focusing only on the mobile layout here. I need the original (the first) design / layout you implemented, which will be my desktop layout, but the UI needs to be responsive and properly adjust to the user's screen size and orientation

---

# EyePhi session coding transcript

## Turn 1 — `/time-to-log-on`

**Ben:** `/time-to-log-on`

**Agent:** Read the sealed `PICKUP_CONTEXT.md` from the previous session, then ran
a staleness sweep against the live repository rather than trusting it.

The artifact was largely accurate but wrong about itself in three places:

| Artifact claim | Reality |
| --- | --- |
| "Nothing imports either file" (of the two broken ones) | False for `appHeader.tsx`. It is imported at `src/app/layout.tsx:5` and mounted at `:19`, so it renders on every page. `configDialog.tsx` was a genuine orphan. |
| `next dev` works because both files are unreferenced | Right conclusion, wrong reason. All six `appHeader` errors sit inside `{progress && (...)}` guards and the layout passes `progress={null}`. |
| `its-me` has 3 unpushed commits | 0 unpushed. Local `eyephi` tip `66c65c7` equals `origin/eyephi`. |

Confirmed unchanged: 11 TypeScript errors on the exact lines claimed, one Biome
formatting error at `src/app/globals.css:52`, the stale `id` comment at
`src/lib/exercisesList.ts:78-79`, and the 24 untracked reference components in
`its-me`.

The briefing closed by reframing the open decision. The artifact had presented it
as "delete or rewrite, per file". Because it believed `appHeader.tsx` was an
orphan, that framing was misleading: deleting it would strip the header, logo,
theme toggle and three buttons from every page. The real question underneath was
what shape `ProgramProgressView` should be, since the component wanted
pre-formatted label strings that a dumb component is not allowed to compute.

Also flagged that `ProgramProgressViewSchema.elapsed` was `z.int().min(0).max(100)`,
a cap that cannot hold elapsed seconds for a program whose exercises are already
30 to 180 seconds each.

---

## Turn 2 — `/typescript-context`

**Ben:** `/typescript-context`

**Agent:** Acknowledged the standards as loaded and named the three rules bearing
on the open decision: Zod as the single source of truth (so any progress shape
change happens in the schema, not locally in the component), comments earning
their place (so the stale `id` comment gets deleted rather than rewritten), and
one component per file with relative imports.

Restated the gate: what shape should `ProgramProgressView` be, is
`configDialog.tsx` safe to delete, and is the `max(100)` on `elapsed` intentional.

---

## Turn 3 — the implementation plan

**Ben:**

> I'm now ready for you to craft an implementation plan to build the designs,
> plumbing, state management, link sharing and exercise storage portion of the
> designs that I flushed out here:
> https://claude.ai/design/p/d441a4a3-941c-4258-8b3c-7ee4bb6f1a8f?file=EyePhi.dc.html
> I've setup the project in the way that I desire and seeded it with all of the
> valid paradigms and organizational idioms I prefer in my projects. Please take a
> look at the design, investigate the latest codebase I have for this project, and
> present to me a terse, multi-slice plan to build this to completion in the next
> 1-2 hours. And please remember: I must always review the code before I greenlight
> any git operations

**Agent:** Read the design canvas via DesignSync (758 lines) and re-verified the
codebase as unchanged at `16cf226`.

Reported that the canvas is not just visuals: it contains the complete logic
model, including a difficulty formula with three weighting profiles, four palettes
with numeric stimulation values, an 8-exercise catalogue with per-exercise weight,
cue and category, and a full `paint(cv, cfg, t)` for all eight types.

Three reconciliation gaps:

| Gap | Design | Codebase |
| --- | --- | --- |
| 8th exercise | `converge` (Near-Far Convergence) | `vor_vertical_combo` |
| Per-type fields | `category`, `weight`, `cue` | none of the three |
| Config fields | `palette`, `texture` | `scheme`, `backgroundNoise` (clean rename) |

The load-bearing insight: `src/context/BasketBuilder.tsx:47` held the basket in
`useState`, while Ben's own comment in `src/schema/types.ts` said it belonged in
the query string. **Link sharing was not a feature to build, it was what falls out
of moving that one line into nuqs.**

Presented an eight-slice plan and flagged honestly that it was roughly three hours
of work, not one to two, with slices 0-4 landing inside 1.5 hours and 5-7 spilling.

Four decisions were requested before starting.

---

## Turn 4 — the four answers

**Ben:**

> 1. let's clamp the "type" field to be more accurate of a representation of what
> vestibular therapists actually call these exercises (as well as the display name)
> 2. Query string only. However, since the query string will likely get pretty
> thick, we might want to consider some form of string compression, like
> lzw-compression (can either provide a POST body to the server and have the
> node.js side of next.js compress it OR install a popular library, like
> https://www.npmjs.com/package/lz-string) 3. Stays in scope. We should consider
> using an abstraction layer for the canvas stuffs, like Phaser.js or pixi.js,
> though, so we don't have to build and maintain our own `<canvas />` wrapper. we
> need to keep code as DRY as possible. 4. keep my schema and have computation of
> percentages and display times be the responsibility of the progress bar
> component. the schemas should all be as raw as possible. things like you've
> described should be pure rendering sugar

**Agent:** Proposed the nine clinical type names (the union of the design's eight
and the codebase's eight), with `x1` and `x2` viewing following Herdman's standard
gaze-stabilisation terminology.

On compression: recommended `lz-string`'s `compressToEncodedURIComponent` because
it is **synchronous**, and nuqs parsers are synchronous. The native
`CompressionStream` route is async and therefore unusable, and a server round trip
would block first paint and defeat a plain shareable link.

On the canvas, recommended **against** Phaser and Pixi, having measured rather than
guessed: the design's `paint()` is 80 lines using 15 distinct Canvas2D calls, all
immediate-mode. Both engines are retained-mode scene graphs, so porting would mean
creating persistent display objects and diffing per frame, which is more code and a
second representation of the same drawing. Bundle cost ~1.1MB and ~450KB against
zero, for an audience of motion-sensitive patients often on phones. WebGL also adds
compositing and colour-management variance, against the monochrome rule. The
wrapper being bought out of is about six lines, and `useResizeObserver` from
`usehooks-ts` (already a dependency) covers resize.

On raw schemas: adopted, and noted it reversed the agent's own earlier
recommendation. Stated one assumption rather than blocking: "keep my schema" was
read as "keep it raw", so `ProgramProgressViewSchema` became `{ elapsed, total }`
in raw seconds, since a percentage cannot be derived without a total.

---

## Turn 5 — slice 0, and a static-export idea

**Ben:**

> proceed with slice 0. also, something to consider: since there's really no server
> side portion to this, I'm wondering if we can consider using next.js capability
> of building to a fully static output? Might be worth adding as a final slice of
> exploration

**Agent:** Executed slice 0: made `ProgramProgressView` raw seconds, added
`src/lib/format.ts` with `formatDuration` and `toPercentage`, retargeted
`appHeader.tsx` to compute its own labels, deleted the 182-line orphan
`configDialog.tsx`, removed the stale `id` comment, and fixed the Biome nit.

`next build` then surfaced a **pre-existing** failure the type errors had been
masking: `useSearchParams() should be wrapped in a suspense boundary`.
`NuqsAdapter` was already correct at `src/context/providers.tsx:64`; the boundary
was simply missing. Added it, and reported the real trade-off honestly: the
prerendered HTML now contains zero `p-card` elements, because the card grid became
client-rendered.

Also reported that the dev server on port 20202 had died, with no `kill` having
been run, and that two files were showing as staged despite no `git add` having
been issued.

On static export: the build itself answered it. Both routes already reported
`○ (Static)`, so `output: 'export'` looked close to a one-line change.

---

## Turn 6 — `<PageLoader />`

**Ben:**

> before we continue: you should adjust your usage of the `<Suspense />` component
> to use a new component you should make, called `<PageLoader />`, which renders a
> https://primereact.dev/docs/styled/components/progressspinner and a loading
> message that's customizable, but falls back to "Loading..." if nothing is
> provided (and the message should be provided as a react children prop)

**Agent:** Checked the installed API rather than the linked docs and found two
things.

First, those docs are v10. v11 has no flat `<ProgressSpinner>`; it is `Root`
(which renders the `<svg>`) plus `Track` and `Range`. The module is `'use client'`
and assembles its namespace at module scope, which is exactly the pattern that
yields `undefined` across the React Server Component boundary. Used the flat
exports so the fallback stays server-rendered, and confirmed it appears in the
prerendered HTML.

Second, and more importantly: **Aura's spinner animates red to blue to green to
yellow on a 6-second loop.** That directly contradicts the clinical monochrome rule
at `src/context/providers.tsx:9-13`. Pinned all four colour tokens to
`{primary.color}` and verified the token path by resolving the preset in Node
rather than assuming it.

---

## Turn 7 — `/commit-push`

**Ben:** `/commit-push`

**Agent:** Preflight found the branch was `main`, so asked for explicit
confirmation. Ben chose "Commit straight to main".

Committed `fix: restore green build and add PageLoader` as `c021ce1`. Both
attribution audits came back empty. Noted the conflict once: the repo's
`AGENTS.md` asks for a `Co-Authored-By: Claude` footer, which Ben's standing
preference overrides.

---

## Turn 8 — slice 1

**Ben:** proceed with next slice

**Agent:** Built the schema slice: renamed all nine exercise types to clinical
vocabulary, added `category`, `cue` and `weight`, and created `src/lib/palettes.ts`
with the four schemes and their stimulation weights.

At this point the agent had split `Exercise` into `ExerciseDefinitionSchema`
(per-type catalogue metadata) and `ExerciseConfigSchema` (per-instance tuning), on
the reasoning that prose should not be duplicated in the query string for each
basket entry.

Verified all nine exercises rendered end to end with the correct category
distribution.

---

## Turn 9 — rejecting the schema split

**Ben:**

> having ExerciseDefinitionSchema feels messy, especially since the values in there
> are directly related to the user's exercise program configuration, which means
> you extracting it out of BaseExericseSchema introduces schema maintenance
> confusion

**Agent:** Agreed, and identified why the split was wrong rather than just
reverting it: **the wire format is a codec concern, not a schema concern.** The
domain model had been split to solve a serialization problem that the codec should
solve by projecting down to tuning fields and rehydrating prose from the catalogue
on decode.

Collapsed back to one `ExerciseSchema` with the three new fields added to the base.
Three things introduced the previous round were removed: `ExerciseDefinitionSchema`,
`ExerciseConfigSchema`, and `ExerciseTypeSchema`. That last one was the sharpest
edge, being a second list of the nine type names that had to be hand-synced with
the discriminated union. `defaultDuration` and `createDefaultConfig` also
disappeared, since a catalogue entry simply *is* an `Exercise` carrying its
starting duration.

Also noted the consequence: a shared link becomes decodable only against the
catalogue shipped with the app, so renaming a type breaks old links for that
exercise.

---

## Turn 10 — `/commit-push`

**Ben:** `/commit-push`

**Agent:** Committed `feat(schema): adopt clinical exercise names and add palette
table` as `b9ca1f5`. Three files, since collapsing the split had restored the
consumer files to their committed state.

Did not re-ask about committing to `main`, on the grounds that Ben had answered
that explicitly one slice earlier and re-asking would be re-litigating a settled
decision. Said so, and offered to be prompted each time instead.

---

## Turn 11 — slice 2

**Ben:** proceed

**Agent:** Installed `lz-string` 1.5.0, then measured the wire format options
rather than picking one:

```
n    tuple   short-key   full objects
6    246     339         664
12   431     693        1329
```

Compression beat plain URI-encoded JSON at every size, even one exercise (53 vs 56
chars), so there is a single code path with no size threshold. Used **strings**
rather than enum indices for `type` and `scheme`, costing about 57 characters at
six exercises, because positional identity is exactly the fragility Ben's own
deleted `id` comment had warned about.

Wrote `src/lib/programCodec.ts` and moved the basket out of `useState` into a nuqs
query parameter. The catalogue is injected into `decodeProgram` rather than
imported, because the codec runs on the client and the catalogue module imports a
Node builtin.

Since the repo has no test runner, verification ran the real source under Node's
native type stripping, copied into a gitignored directory with only the import
specifier rewritten and diff-confirmed. Three gotchas cost time: Node refuses type
stripping under `node_modules`, extensionless relative imports do not resolve under
the ESM loader, and Node's strict ESM interop cannot do named imports from
`lz-string`.

---

## Turn 12 — schema definitions belong in the schema directory

**Ben:**

> the codex definition needs to go next to the other schema items. it's not okay to
> have it floating by itself in a lib folder. lib files should be primarily
> functions with small logical chunks

**Agent:** Moved `PROGRAM_WIRE_VERSION`, `EncodedExerciseSchema` and
`EncodedProgramSchema` into `src/schema/types.ts`. `src/lib/programCodec.ts` was
reduced to functions only, verified by confirming zero `z.` calls remained in it.
Also removed a stray check file that had been left in the repo root.

---

## Turn 13 — magic tuple indices

**Ben:**

> also, it's too fragile we have essentially "magic" tuple index assignments in
> `src/lib/programCodec.ts`. The assignment of exercise keys to codec indexes should
> be stored as a constant MAP so it can be looked up and easier to access

**Agent:** Added `ENCODED_EXERCISE_FIELDS` to `types.ts` mapping field name to
slot, and routed both codec directions through it. Confirmed no bare numeric
indexing remained.

Noted a pleasant side effect: because Biome alphabetises the map, source order and
wire order became visibly independent, which makes the "append, never reorder" rule
harder to violate by accident.

---

## Turn 14 — the loop, and the typing problem

**Ben:** I've attempted at DRYing up the code in the `toWire()` function by looping
over the encoded fields, rather than hard-coding the access. please address the
typing issues

**Agent:** Diagnosed why the loop could not type-check as written: `Object.entries`
widens keys to `string` and values to `number`, so `wire[slot]` becomes "any slot of
a heterogeneous tuple", and the only value assignable to all six slots at once is
`never`. Separately, `backgroundNoise` was `boolean` on `Exercise` but `0 | 1` on
the wire, so a straight value copy could not be correct regardless.

Offered a version that kept the loop and got full type checking by deriving the
value object's type from the field map itself, then proved it caught four distinct
classes of mistake by deliberately breaking each one.

---

## Turn 14b — preference for the simpler form

**Ben:** *(mid-turn)* I'd prefer not to use your version of this, it's harder to
read. please just keep mine and add type casts

**Agent:** Kept Ben's loop with casts. Casting the `Object.entries` result restored
the key type, which made `exercise[exerciseKey]` type-check on its own and rendered
the `keyIsEncodedExerciseProp` guard dead code (it also had a typo between its
parameter name and its predicate).

Kept `backgroundNoise` on its own line after the loop, and verified the reason held
by dumping the actual payload to confirm no raw boolean leaked onto the wire.

---

## Turn 15 — boolean on the wire

**Ben:**

> why not just make backgroundNoise a boolean when encoded versus an integer? we're
> not really saving many characters here by doing this, and it's adding an "extra"
> case that's just going to breakdown in the future

**Agent:** Measured first: 11 characters on a real 3-exercise link, topping out at
+37 for a 20-exercise program. Agreed it was not worth a special case.

Changed the wire slot to `z.boolean()`, which let `toWire` become a pure loop with
no special cases and `fromWire` lose its `=== 1`. Added a check confirming a legacy
`0/1` payload is now rejected rather than silently coerced.

---

## Turn 16 — review, then commit

**Ben:** I made some further checks. please review then `/commit-push`

**Agent:** Reviewed two additions. The `try/catch` around
`decompressFromEncodedURIComponent` was correct and worth having, since lz-string
does raw `charCodeAt` work and can throw rather than return null. Widened the
malformed-input sweep to include a lone surrogate, a 5000-character run, whitespace
and `=====`.

The `satisfies Record<keyof Pick<Exercise, ...>, number>` on the field map was
judged the better version of what the agent had written, and was probe-tested three
ways to confirm it was not decorative: a typo, an omission, and a field that exists
on the model but is not tuned all failed to compile.

Committed `feat(program): persist the exercise program in the query string` as
`7e7099d`. Noted one cosmetic asymmetry left alone: `encodeExerciseProgram` versus
`decodeProgram`.

---

## Turn 17 — slice 3

**Ben:** proceed

**Agent:** Built `src/lib/difficulty.ts`. Rather than eyeballing the formula,
ported the design canvas' `difficulty()` verbatim and ran both across the entire
tunable space: every speed 1-10, intensity 1-10, seven durations, four schemes,
noise on and off, and all eight catalogue weights.

```
PASS  per-exercise score matches design across all 44800 combinations
PASS  program score matches design totals()
PASS  gentlest config floors at 1 · harshest caps at 10
PASS  all 8 band boundaries, including the exact 3.5 / 6.5 / 8.2 edges
```

Bands return raw identifiers rather than display strings, since the thresholds are
clinical domain constants but the capitalised labels are rendering sugar.

Two things deliberately left out: the design's alternative `difficultyModel`
weighting profiles, judged a canvas authoring knob rather than an app feature, and
the `draftDiffBreakdown` display string, which belongs with the config dialog.

---

## Turn 18 — improve the typings

**Ben:**

> you need to improve the typings instead of just hardcoding keys that may change
> elsewhere. please check your const INPUT_WEIGHTS and take inspiration from my
> changes to ENCODED_EXERCISE_FIELDS

**Agent:** Applied the `satisfies Record<keyof Pick<Exercise, ...>>` pattern to all
three constants and probed each guard to confirm it errored at both the definition
and the use site.

Then surfaced a larger instance of the same problem: `normalize(exercise.speed, 1, 10)`
and `normalize(exercise.duration, 30, 180)` were restating numbers that already
lived in the Zod schemas. Zod 4 exposes `.minValue` and `.maxValue`, so the bounds
are now read off the schemas.

Proved it was not cosmetic by temporarily widening `ExerciseSpeedSchema` to `1..20`:
`speed=10` dropped from **4.4 to 3.0**, because it is no longer the top of the
range. The hardcoded version would have returned 4.4 and been wrong.

Re-ran the full sweep: still 44,800 exact matches after the refactor.

---

## Turn 19 — loop over the weights too

**Ben:**

> we should consider the looping approach I introduced in the other places, rather
> than hard coding things in functions like scoreExercises(). this should, in
> theory, make it easier to add more weights with fewer lines of code to change

**Agent:** Noted the loop could not drop in directly because each term computes its
0-1 share differently (schema-range normalize, palette lookup, boolean flag), so the
table needed to carry the *how* alongside the weight. That also let
`FLAT_SURCHARGES` and `SCORED_RANGES` collapse into the same table, since the flat
surcharge is just `0.14 × (noise ? 1 : 0)`.

Then flagged the risk the refactor introduced and measured it: summing in table
order rather than the design's order changes floating-point results in the last
bits, which flips values sitting exactly on a `.5` rounding boundary. **8
divergences in 70,400.** Noted the deeper issue was not design parity but that
scores would shift if the table were ever reordered, which Biome's key sorting could
do on a rename.

---

## Turn 20 — precision is overkill

**Ben:**

> RAW_PRECISION is overkill for this. the difficulty score doesn't need to be
> scientifically accurate

**Agent:** Agreed, with the numbers backing it: 21 of 70,400 differ, maximum delta
0.1, exactly 1 crosses a band. Removed the stabilisation and left `scoreExercise` as
a plain loop.

Stated the practical consequence plainly so it would not be a surprise later: if the
table is ever reordered, a handful of scores shift by 0.1.

---

## Turn 21 — `/commit-push`

**Ben:** `/commit-push`

**Agent:** Found a file that had not been seen before, `src/util/isNumber.ts`, and
read it before committing it. Ben had replaced the `=== null` checks with a type
guard and changed the signature to use `Nullish<number>`, which is the better
signature since `| null` alone missed `undefined`.

Re-ran the scoring after the guard swap to confirm no regression, then committed
`feat(difficulty): score exercises and programs` as `32b0441`.

---

## Turn 22 — slice 4

**Ben:** proceed with next slice

**Agent:** Built the build view: `CategoryFilter`, `ExerciseCatalog`,
`ProgramPanel`, `ProgramPanelItem`, `ProgramSummary`, `MobileSubmitBar`, and
`lib/labels.ts`. `ExercisesList` became dumb and `ExerciseCard` gained the category
tag and default-duration label.

This surfaced another latent bug. `appHeader.tsx` used `wide:flex` and
`wide:hidden`, but **`--breakpoint-wide` was never defined**. Confirmed against the
built CSS: `max-w-130` compiled, `wide:flex` emitted nothing, and the only media
query present was `min-width:1200px`. The header's desktop progress readout could
never appear and the stacked mobile one always would. Added the design's three
breakpoints.

Verified the whole stack against a live server by loading a real shared link:

```
/?program=<174 chars, 3 exercises>

3 EXERCISES · SPD 9 / SPD 2 / SPD 5 · Warm / Cool / High contrast
per-item:  D 7.8, D 2.7, D 2.7      bars: aria-valuenow 78, 27, 27
totals:    3:00 · D 5.3 · Moderate   bar: aria-valuenow 53
```

Those numbers were computed independently in Node and matched exactly, exercising
URL decode, catalogue rehydration, scoring and rendering together.

Flagged that the submit button is a deliberate no-op with a `TODO(slice 7)`, since
opening the ready dialog needs a state decision that is Ben's.

---

## Turn 23 — `/time-to-log-off`

**Ben:** `/time-to-log-off`

**Agent:** Verified ground truth (branch, cleanliness, unpushed commits, and that
every file claimed to exist actually did), then wrote `PICKUP_CONTEXT.md` at the
repo root and added it to `.git/info/exclude` so the auto-stager on the machine
could not sweep it into a commit.

The artifact captures the four commits, the finished-but-uncommitted slice 4,
fifteen decisions with rationale and what each rules out, the verification record,
and three corrections worth not re-deriving.

Also wrote three durable preferences to memory: table-driven typed constants,
measure-before-abstracting, and schemas-in-`schema/`.

---

## Turn 24 — the transcript

**Ben:** Asked for the chat history to be written to a Markdown file at the
repository root, prepared for sharing across the business.

---

## Session outcome

| Slice | Scope | Result |
| --- | --- | --- |
| 0 | Unblock build, `PageLoader` | `c021ce1` |
| 1 | Schema, nine clinical names, palettes | `b9ca1f5` |
| 2 | `lz-string` codec, program in query string | `7e7099d` |
| 3 | Difficulty scoring | `32b0441` |
| 4 | Build view components | done, uncommitted |
| 5-8 | Canvas, config dialog, run views, static export | not started |

Three latent bugs were found and fixed along the way, none of which was the task at
hand: the missing Suspense boundary that had been breaking `next build`, the
undefined `wide:` breakpoint silently disabling header layout, and Aura's
multicolour spinner contradicting the clinical monochrome rule.


---
---

# EyePhi session transcript — session 2

**Session date:** 2026-09-01
**Repository:** `/Users/benjaminduran/dddddd/personal/eyephi`
**Started at:** `32b0441 feat(difficulty): score exercises and programs`, plus the uncommitted slice 4
**Ended at:** `64f7336 feat(exercises): share target paths between pursuit and saccades`

---

## Turn 1 — AGENTS.md

**Ben:** Asked for an `AGENTS.md` that is mostly a raw dump of the
`typescript-context` skill, plus the toolchain and tech stack actually in use in
this repository, plus a callout telling any LLM to be terse and to refrain from
commenting self-explanatory code. Then symlink `AGENTS.md` to `CLAUDE.md`.

**Agent:** Wrote the file in four parts: the `next dev`-managed Next.js block
(kept, since it is re-added automatically), a **How to respond** section, a
**Toolchain & tech stack** section read off `package.json`, `biome.json`,
`.tool-versions` and `next.config.ts`, and the skill body verbatim.

`CLAUDE.md` became a symlink to it, which git records as a typechange since it
had been a regular file containing `@AGENTS.md`.

---

## Turn 2 — `mise x --`

**Ben:** Asked that the file call out that every tool and script must be prefixed
with `mise x --` so the pinned dependency versions are used.

**Agent:** Replaced the Scripts section with **Always run tools through
`mise x --`**, rewrote every command, and updated the three other places that
still quoted a bare `pnpm`.

---

## Turn 3 — `/commit-push`

Committed `feat(builder): add the program panel, catalog filtering and mobile bar`
as `653e9b1`. Ben chose a single commit covering both the docs and the
already-finished slice 4.

---

## Turn 4 — slice 5, the canvas

**Ben:** proceed with next slice

**Agent:** Ported the design's 80-line `paint()` into `src/lib/paint.ts` as a
`satisfies Record<Exercise['type'], Painter>` table, plus an `ExerciseCanvas`
owning DPR, sizing and the `requestAnimationFrame` loop.

`vor_x2_vertical` had to be **written, not ported** — the design has no such
painter. It is the `vor2h` maths with the axes swapped and vertical travel
clamped to `h * 0.35`, matching what `vor1v` already did.

Verified with a recording fake 2D context under Node's type stripping:
**67,608 checks, no failures**, across all 9 types, 4 schemes, noise on and off,
speed and intensity extremes, four canvas sizes including 1x1, and a time sweep
to t=913s. The assertions covered non-finite coordinates, background painted
first at full size, balanced `save`/`restore`, no leaked `globalAlpha`, the
target never leaving the canvas, and x2-horizontal travelling only in x while
x2-vertical travels only in y.

---

## Turn 5 — one file

**Ben:**

> let's please move all of the canvas rendering and painting logic to be contained
> within `src/components/ExerciseCanvas.tsx` — there's no reason to have the
> rendering of the `<canvas />` element, itself, completely separate from the
> actual canvas implementation.

**Agent:** Moved it and deleted `src/lib/paint.ts`. To prove nothing drifted, the
painting section was lifted back out of the component and diffed against the
pre-move file: identical apart from the import path and one deliberate doc-comment
reword. Harness re-run at the same 67,608 checks.

---

## Turn 6 — thinking about Kaplay

**Ben:**

> just thinking out loud here: I'm still not a big fan of maintaining our own canvas
> rendering logic and abstraction. couldn't we use something like the Kaplay game
> engine, instead? Yes, I know we'd be adding to the bundle size, but the API and
> ergonomics would be much improved?

**Agent:** Measured rather than argued. Kaplay is 184 KB raw / **68 KB gzipped**,
which is a different weight class from the Phaser (~1.1 MB) and Pixi (~450 KB)
numbers that session 1's decision had rejected, so the bundle objection was
weaker than the earlier record implied.

Counted what it would actually replace: of 292 non-blank lines, 51 were sizing,
loop and component; 241 were painting. The engine deletes some of the first group
and only re-dialects the second. Recommended against, but offered a spike rather
than an argument.

---

## Turn 7 — the spike

**Ben:** Chose "spike one painter, then decide".

**Agent:** Installed `kaplay`, ported `vor_x2_horizontal` behind the same
component API, and measured on an isolated `/spike` route so only the canvas
implementation differed:

| Build | Client JS (gzipped) |
| --- | --- |
| No spike route | 318.3 KB |
| `/spike` with Canvas2D, all 9 painters | 322.9 KB (**+4.6 KB**) |
| `/spike` with Kaplay, **one** painter | 387.1 KB (**+64.2 KB**) |

Kaplay does not tree-shake: the spike called six functions and shipped the whole
engine. Two worries were raised and then **disproved** rather than left standing:
`setBackground()` exists, so live palette swapping is fine, and `debug.paused`
covers the pause button.

---

## Turn 8 — adopting it anyway

**Ben:**

> this looks great, let's continue with Kaplay. it's so much less code, plus there's
> a ton of added benefit in the future if the exercises need to become interactive

**Agent:** Ported all nine painters. Kept `paused` on an own clock rather than
`debug.paused`, because `k.time()` keeps advancing underneath it and the drill
would teleport on resume. Harness re-pointed at a faked Kaplay context:
**54,648 checks, no failures**.

---

## Turn 9 — cleaning up the context

**Ben:**

> I will never be rendering more than one canvas at a time here, so the fact that
> Kaplay doesn't allow this doesn't concern me. as long as we cleanup the kaplay
> context properly

**Agent:** Read Kaplay's sourcemapped source rather than trusting the API surface.
`quit()` defers all teardown to the **next frame end**, then stops the loop,
removes every canvas/document/window listener, disconnects its ResizeObserver and
destroys GL state.

Three fixes followed. Kaplay now creates its own canvas via `root`, because React
Strict Mode remounts onto the same DOM node and a repeat `getContext('webgl')`
returns the *same* context, so a dead instance's deferred teardown would wreck the
live one. A `disposed` flag stops painting immediately, since teardown is a frame
late. And `pixelDensity` **defaults to 1**, so the previous version rendered soft
on retina.

Also found that `_k.k` is only ever assigned, never cleared, which is why the
nine-up demo grid was misleading: each new instance force-quit the previous one,
so only the last canvas was ever running.

---

## Turn 10 — slice 6, the config dialog

**Ben:** Asked to clean up the spike artifacts, note Kaplay's usage in memory, and
proceed with the next slice.

**Agent:** Deleted the spike route, wrote a `kaplay-owns-canvas-rendering` memory,
and built `ConfigDialog`, `SliderField`, `PaletteChooser`, plus a shared
`numericBounds` helper so the sliders read their range off the Zod schemas.
`difficulty.ts` was refactored onto the same helper and proven score-identical
across **396,000 combinations**.

---

## Turn 11 — the slider is over-customised

**Ben:**

> I think you went too far trying to customize `src/components/SliderField.tsx` -
> it looks nothing like the PrimeReact one does, and its CSS is broken, such that
> the handle is too big and there is no bg color for the track

**Agent:** The bug was a missing `Slider.Track`, so `p-slider-track` never
rendered and `Range`/`Handle` sat directly in `Root`. Restored the canonical
composition from the linked docs.

---

## Turn 12 — the checkbox too

**Ben:** Reported the same class of bug on the background-texture checkbox.

**Agent:** Same cause: bare `CheckboxRoot` with no `Box` or `Indicator`, so there
was nothing to click. Rebuilt as `Checkbox.Root` → `Box` →
`Indicator match="checked"` with an icon child.

---

## Turn 13 — audit the rest

**Ben:**

> you should probably also check the rest of your usage of the primereact components
> to be sure there are no other mistakes like these elsewhere that you've made

**Agent:** Found three more. `Dialog.Close` renders no icon of its own and belongs
inside `Dialog.HeaderActions`. `ToggleButton.Indicator` was missing in
`PaletteChooser` — it is what renders `p-togglebutton-content`, which carries the
theme's padding and checked state. And **`CategoryFilter` had the identical bug and
predated this session**, so the catalogue's filter had been unstyled all along.

`Card`, `ProgressSpinner` and `ProgressBar` were checked and found correct.

---

## Turn 14 — `/commit-push`

Committed `feat(config): tune exercises in a dialog with a live preview` as
`c5c7643`.

---

## Turn 15 — slice 7, the run views

**Ben:** proceed with next slice

**Agent:** Built `ReadyDialog`, `RunView`, `ImmersiveStage`, `DoneView`,
`RunStepList`, `RunControls`. The submit button finally does something, closing
the last `TODO(slice 7)`.

Stated the deferred state decision rather than blocking on it: `view` goes in the
query string like everything else, run *progress* stays in memory, because a
ticking clock in the URL would churn history.

The arithmetic started inside the provider with `advance` calling `setView` from
within a `setProgress` updater, which is impure and would fire twice under Strict
Mode. Moved to `src/lib/runProgram.ts` returning a tagged result the provider
applies: **2,756 checks, no failures**.

---

## Turn 16 — a dedicated route

**Ben:**

> the exercise program should be run on a separate route. you should create a new
> page and use the root layout so the styling and layout is roughly the same. this
> route should be `/program` and you should also make a corresponding
> `src/routing/uiRoutes.ts` entry that is parameterized. you will likely also have
> to adjust the header navigation links.

**Agent:** Added `/program`, parameterised every `uiRoutes` builder on the program,
and introduced a `QUERY_KEYS` table so route builders and the hooks parsing them
cannot drift. **52 checks** confirmed every builder round-trips the program back
through the real decoder.

Two things fell out. `basketBuilderAdd` had been **dropping the program**, so
clicking a catalogue card after adding exercises wiped the basket. And the header
needed the share dialog reachable by URL, so its open state moved to a query key.

---

## Turn 17 — the empty div

**Ben:**

> you wrapped the `<AppHeader />` in a `<Suspense />` with literally an empty div.
> Why, when there's `src/components/PageLoader.tsx` already?

**Agent:** The boundary is genuinely required — removing it fails the build with
`useSearchParams() should be wrapped in a suspense boundary`. But `PageLoader` is a
`py-24` centred spinner and would have wrecked a 64px sticky header. The real
mistake was wrapping the whole header when one line needed it. Split out
`HeaderProgramActions` (pure) and `HeaderProgramActionsFromUrl` (reads the query),
so the fallback is the same button row in its no-program state and the header never
changes shape.

---

## Turn 18 — dead props

**Ben:**

> what's the point of hard-coding progress={null} when if it's not set anywhere and
> not used?

**Agent:** Correct, it was dead: the layout sits above the run provider so it can
never know. Rather than delete the design's readout, extracted `ProgramProgressBar`
and put it where the data lives — used by the immersive stage and by the windowed
`RunView`, which had no overall progress at all. `AppHeader` now takes no props.

---

## Turn 19 — use the paradigms

**Ben:**

> There's little point in me writing code I expect you to use if it isn't going to be
> read and followed. You are inlining URLs and query strings in
> `src/components/HeaderProgramActions` even though I have a clearly-established way
> of crafting UI routing URLs in `src/routing/uiRoutes.ts`

**Agent:** Fair. The header only ever holds the *encoded* program and cannot decode
it above the providers, and rather than extending `uiRoutes` the agent had routed
around it. Added a `ProgramInput` type so every builder accepts either the
assembled `Program` or the encoded string, then routed the header, the logo link
and `basketBuilderAdd/Edit` through it. A sweep for hand-built hrefs and query
strings returns nothing outside `uiRoutes.ts`. **63 checks** confirm both input
forms produce byte-identical URLs.

---

## Turn 20 — the rotate hint

**Ben:** Pointed out that "turn your phone sideways" should not show on anything
larger than an iPad.

**Agent:** The old `wide:hidden` keyed on viewport width alone, so a narrow desktop
window saw it. Now `hidden portrait:pointer-coarse:max-sidebyside:block`, verified
against the compiled CSS by walking the brace nesting. A plain grep looked wrong at
first because Tailwind groups rules under shared media queries.

---

## Turn 21 — `/commit-push`

Committed `feat(program): run the program on its own route` as `26bf896`.

---

## Turn 22 — slice 8, then a change of direction

**Ben:** proceed with the next slice, or tell me if we're done with all
currently-planned work

**Agent:** Slice 8 was the static export. It worked with one config line and all
routes prerendered, but `/program` 301s on a plain static host, and the exported
HTML ships the `PageLoader` fallback rather than the catalogue.

**Ben:** *(mid-turn)*

> abandon the static export. instead, I want to add some variation / configuration
> options to the Smooth Pursuit exercise: I want to adjust the default speed
> modifier in the exercise to be a bit faster (it's far too slow now). additionally,
> I want to add a number of different shapes that the orb will follow: horizontal
> line, vertical line, circle, ping-pong circle (where the orb traces the circle one
> direction, before bouncing back the other direction), figure 8, then random path

**Agent:** Reverted the export. The "far too slow" symptom turned out to be an
agent bug from the Kaplay port: **`k.wave(lo, hi, t)` is `-cos(t)` with t in
radians**, so passing `time() * freq` gave a period of `2π/freq` — about **6.3x too
slow**. Near-Far Convergence had the same mistake.

| speed | cycle now | cycle before |
| --- | --- | --- |
| 1 | 6.45s | 40.5s |
| 5 (new default) | 2.67s | 16.8s |
| 10 | 1.54s | 9.7s |

Added six paths in a `TARGET_SHAPES` table of pure `(phase, metrics) => {x, y}`
functions. The random path is summed incommensurate sines: deterministic, so two
runs of a program match, but non-repeating within a session. On the wire the path
is an **optional 7th tuple slot**, so pre-path links still decode and the other
drills still emit 6-slot tuples.

The catalogue defaults table was typed off `Omit<Exercise, 'type'>`, which collapses
the union and hid `path` entirely; it is now per-type, so omitting a required
per-type field is a compile error. **100 checks, no failures.**

---

## Turn 23 — Saccades

**Ben:**

> I would like to take a similar approach and change the Horizontal Saccades to just
> "Saccades," with the same path build options (we should leverage what we've just
> built so it can be shared). However, since it is a saccades exercise, we will be
> snapping to points along the path

**Agent:** Renamed the path concept to `TargetPath` since it is no longer
pursuit-only, and gave each shape a `stops` count. Fixation points sit half a step
in, which is what makes a two-stop line land on its ends rather than passing through
centre twice — so the renamed drill still behaves exactly like the old Horizontal
Saccades on a horizontal path.

The harness caught a real defect: **ping-pong sampled to only 3 distinct points of
6**, because a path that retraces itself revisits the same coordinates, so the
target would have frozen for two intervals at each turnaround. It now walks a ring
of six points out and back via an optional `stopAt` that only that path needs.

---

## Turn 24 — the config does nothing

**Ben:**

> the saccades configuration doesn't actually work. changing the shape doesn't seem
> to do anything. it's just stuck on the horizontal shape

**Agent:** Two agent bugs. `pathOf` still read
`exercise.type === 'smooth_pursuit' ? exercise.path : DEFAULT`, so Saccades always
fell through to the default. And `stageSignature` had lost the path, so switching
shape never rebuilt the stage and the guide markers were left over.

The earlier 88 checks missed it because they called `TARGET_SHAPES[path]` directly,
testing the geometry while skipping the code that decides *which* shape to use. The
suite now drives the real builders and asserts each path produces a distinct
sequence of positions, and explicitly that no path collapses onto horizontal.
**299 checks, no failures.**

---

## Turn 25 — submission does not use the route

**Ben:**

> program submission and running doesn't work. it's setting the program solely as a
> query parameter, but not using the dedicated /program route

**Agent:** A timing bug, not a routing one. nuqs **throttles** its URL writes — 50ms
by default and **320ms on Safari** — so `setReady(false)` followed by
`router.push()` lost the race and rewrote the URL back to `/`. `exitRun` had the
identical pattern. Both now navigate only, since the destination URL carries
neither key.

---

## Turn 26 — three more

**Ben:** Reported that the Kaplay double-init warnings were fewer but still present,
asked that the program start in immersive mode, and asked for a back button to the
previous exercise.

**Agent:** The `kRef` guard stopped double-init within one effect run, but cleanup
nulled it while `quit()` deferred a frame, so any remount still re-initialised. Made
the engine one-per-page with its canvas moving between mounts, cancelling the
per-mount `onUpdate` so handlers cannot stack. `immersive` defaults to true.
`toPreviousStep` went in `lib/runProgram.ts` beside `toNextStep`, restarting the
current step when already at the first. **10 checks, no failures.**

---

## Turn 27 — no global singletons

**Ben:**

> we should not be mixing global singletons with react state. I would rather hoist /
> move the kaplay init and resizing, etc to a react context provider and wrap the
> children in all the layouts that care

**Agent:** Moved the engine into `src/context/KaplayEngine.tsx` exposing `attach`
and `detach`. Flagged one deviation: it belongs in the **root** layout, not
per-route ones, because `(home)/layout.tsx` and `program/layout.tsx` are different
layouts and navigating between them would quit and re-init the engine — exactly the
double-init being removed. Ben then moved it into `Providers` alongside Nuqs,
PrimeReact and Theme, which keeps it under the root layout.

---

## Turn 28 — `/commit-push`

Committed `feat(exercises): share target paths between pursuit and saccades` as
`64f7336`.

---

## Turn 29 — the transcript

**Ben:** Asked for this session's exchanges to be appended to `prompt.md` in
their correct chronological slot.

**Agent:** Appended session 2 after session 1, since this session began where the
previous one ended.
---

## Session outcome

| Slice | Scope | Result |
| --- | --- | --- |
| 4 | Build view components | `653e9b1` |
| 5 | Canvas | `be75256`, rewritten onto Kaplay in `c5c7643` |
| 6 | Config dialog | `c5c7643` |
| 7 | Run / done / share views | `26bf896` |
| 8 | Static export | explored, then abandoned by choice |
| — | Target paths, Saccades rename | `64f7336` |

Bugs found that were **not** the task at hand: `basketBuilderAdd` silently dropping
the program, `CategoryFilter` missing its `ToggleButton.Indicator` since before this
session, and nuqs' throttle clobbering two navigations.

Bugs the agent introduced and then had to fix: the `k.wave` radians error making
every drill 6x too slow, `pathOf` ignoring Saccades, `stageSignature` losing the
path, `Slider.Track` and `Checkbox.Box` omitted, `Dialog.Close` with no icon, and a
Suspense fallback that collapsed the header.

---
---

# EyePhi session transcript — session 3

**Session date:** 2026-09-01
**Repository:** `/Users/benjaminduran/dddddd/personal/eyephi`
**Started at:** `64f7336 feat(exercises): share target paths between pursuit and saccades`
**Ended at:** `8eec6c5 refactor: rename components to PascalCase and memoize consistently`, plus the random-program feature

> Same conventions as the earlier sessions: user messages as sent, agent replies
> in substance, verification output summarised rather than pasted.

---

## Turn 1 — the missing memoization

**Ben:**

> you removed a lot of my memoization, especially around callbacks, which is NOT in
> my code styles, and is a liberty you took that I don't agree with

**Agent:** Checked before answering. Across all four of its commits the only
deleted memo-related line was an import that was immediately re-added with
`useMemo` still in it, so nothing of Ben's had been stripped by those commits.

But the substantive complaint was correct: every component the agent had authored
in slice 4 carried **zero** memoization, and it passed raw inline arrows into
child props. `ProgramPanel.tsx:44-45` was the clearest example.

Root cause named rather than just the symptom: `CLAUDE.md:91` said verbatim
*"React Compiler is on, so don't hand-roll `useMemo`/`useCallback` unless you've
measured a reason to."* The agent had treated that as authoritative, and that line
would keep producing the same result for any agent on the repository.

---

## Turn 2 — the ConfigDialog claim

**Ben:**

> that is false, for example, in ConfigDialog, you removed my use of useCallback()
> for the updateDraft function for a bare, inline function declaration

**Agent:** Traced it properly:

```
c5c7643   const updateDraft = useCallback(
26bf896   const updateDraft = useCallback(
64f7336   const updateDraft = useCallback(     <- HEAD
WORKTREE  const updateDraft = (update: Partial<Exercise>) =>
```

The `useCallback` survived in every commit and was removed only in the
**uncommitted working tree**, alongside `const difficulty = useMemo(...)`.
`ConfigDialog.tsx` was created in `c5c7643`, which is a descendant of all four of
the agent's commits, and the only config-dialog file it ever touched was the
lowercase `configDialog.tsx` it deleted in `c021ce1`, which contained no
`useCallback` at all.

So the edit came from something working on the tree after `64f7336`. Given the
`CLAUDE.md` line, an agent following it was the likely culprit, which is the same
instruction that produced the un-memoized components. The agent said plainly that
this did not excuse its own miss.

Also surfaced: the session had been building on a **stale view** of the
repository. It was working from `32b0441` while HEAD had moved to `64f7336`
through five commits it had never seen.

---

## Turn 3 — fix all of it

**Ben:** proceed with all three at once, in a single pass

**Agent:** Full inventory first: **nine memoization removals across four files,
zero additions**, all in the working tree.

Restored exactly those nine, keeping every unrelated worktree change in the same
files (the `lib/program.ts` and `lib/format.ts` extractions, PascalCase imports,
`formatExerciseCount`, `text-meta`, `aria-hidden`).

Then swept twelve more files. Two cases needed real changes rather than wrapping:

- **Hook ordering.** `ImmersiveStage` and `RunView` both `return null` early
  before their derived values, so memoizing in place would have put hooks after a
  conditional return. The memos moved above it.
- **`ProgramPanel`'s map.** `onEdit={() => setEditing(index)}` inside `.map()`
  cannot be memoized, since hooks cannot run in a loop. The binding moved into
  `ProgramPanelItem`, which now takes `index` plus `onEdit(index)` /
  `onRemove(index)` and binds them with `useCallback` internally. The parent
  passes the context functions straight through, and those are already stable
  inside `BasketBuilder`'s `useMemo`.

Finally rewrote `CLAUDE.md:91` so it says memoization is deliberate here, names
the two rules, and adds "Do not strip existing `useMemo`/`useCallback`."
`CLAUDE.md` turned out to be a symlink to `AGENTS.md`, so the edit landed in the
tracked file.

Biome reported no `useExhaustiveDependencies` warnings afterwards, which is the
evidence the dependency arrays were right.

---

## Turn 4 — `/commit-push`

**Ben:** Asked to delete `PICKUP_CONTEXT.md`, run `biome check --write`, then
commit and push.

**Agent:** Committed `refactor: rename components to PascalCase and memoize
consistently` as `8eec6c5`. Fifty files, because it swept up everything sitting
uncommitted: the PascalCase rename, the `lib/program.ts`, `lib/theme.ts` and
`util/nullish.ts` extractions, the memoization work, and `prompt.md` itself. Net
memoization change **+39 lines, -1**.

Flagged that the repository is private, so committing the transcript does not
expose it, but that it is permanent in history either way.

---

## Turn 5 — the random program button

**Ben:**

> last feature to implement, before you then add it to the prompt.md dictionary:
> implement a Random exercise Program button and place it in
> `src/components/ProgramPanel.tsx`. when clicked, this button should pick at least
> 3, but up to 9 exercises (which is the current max number of exercises we have
> mapped in the exercise set, provided in `src/lib/exercisesList.ts`...basically we
> should clamp to the .length of the available exercises in the exercise
> collection). the random generation should randomly select properties from each
> exercise it plucks to use in its random collection, add those to the
> `src/components/ExerciseBasket.tsx` via the `src/context/BasketBuilder.tsx`, so
> that a user can quickly create a program and an exercise share link and / or
> start their rehabilitation immediately

**Agent:** Built `src/lib/randomProgram.ts` as pure functions with the randomizer
injected (`random: Randomizer = Math.random`), so a generated program is
reproducible in a test.

The rolls live in one `RANDOM_TUNING` table typed against the model, following the
established pattern:

```ts
type TunedKey =
  | keyof Pick<Exercise, 'backgroundNoise' | 'duration' | 'intensity' | 'scheme' | 'speed'>
  | keyof Pick<Extract<Exercise, { path: TargetPath }>, 'path'>;
```

(Turn 7 below collapses this into shared types declared in `types.ts`, so the
shipped version reads `TunedExerciseKey | PathTunedExerciseKey`.)

`path` only exists on Smooth Pursuit and Saccades, so rather than special-casing
it the loop applies each roll **by key presence** (`if (key in exercise)`), which
keeps one uniform code path. Durations snap to the same 15-second steps the config
dialog's slider uses, and bounds are read off the Zod schemas rather than
restated. Selection is Fisher-Yates over a copy, so exercises are distinct and the
catalogue is never mutated.

`BasketBuilder` gained `replaceProgram`, since generating a program swaps the whole
thing rather than appending. The button sits under the panel header and reads
"Random program" when empty, "Randomize again" once populated. The roll happens in
the click handler, not during render, so server and client markup agree.

Verified with a seeded PRNG over **3,000 programs**: all valid against
`ProgramSchema`, all exercises distinct, counts spanning 3 to 9, all four schemes
and all six target paths exercised, `backgroundNoise` rolling both ways, durations
landing only on 15-second steps, and catalogue copy never altered. Edge cases
covered an empty catalogue, a catalogue smaller than the minimum, and a
single-exercise catalogue. The three `satisfies` guards were probe-tested and each
errors on a typo, an omission, and a path rolled from the wrong enum.

End to end, a generated program encoded to a 241-character link, round-tripped
identically, and rendered as five exercises in the panel.
---

## Turn 6 — kill the dev server

**Ben:**

> please kill your server so I can boot one up, myself, because I'm not seeing the
> changes

**Agent:** Found two Node processes still alive, both carrying this session's
`CLAUDE_CODE_MESSAGING_TOKEN` in their environment, which identified both as
agent-started: the current `next dev` pair on port 20202, and an orphaned
`next-server` from an earlier run whose parent had already died. Killed all of
them and confirmed the port was free with nothing matching `next` left.

Flagged the likely cause of "not seeing the changes" as separate from the server
itself: the agent had run `pnpm run build` several times while a dev server was
up, and both write into `.next`, so production and dev artifacts sharing that
directory can leave the dev server serving stale chunks. Suggested `rm -rf .next`
if a fresh `pnpm run dev` still looked wrong, noting it is gitignored build cache.

Then listed exactly what should be visible once it booted: the button at
`ProgramPanel.tsx:51`, `replaceProgram` at `BasketBuilder.tsx:27,92`, and
`src/lib/randomProgram.ts`, so a still-missing button could be distinguished from
a button that renders but does nothing.

---

## Turn 7 — the key set was declared twice

**Ben:**

> type TunedKey and type RandomTuning feels duplicative to types declared in
> `src/schema/types.ts`

**Agent:** Correct, and it turned out to be a **three-way** duplication rather
than two. The literal list `'backgroundNoise' | 'duration' | 'intensity' |
'scheme' | 'speed'` appeared in `ENCODED_EXERCISE_FIELDS`, in `randomProgram`'s
`TunedKey`, and — spotted only by grepping — in `difficulty.ts`'s `SCORE_INPUTS`,
where it had been sitting since that file was written.

Declared the key set once in `src/schema/types.ts`, next to `Exercise`:

```ts
export type TunedExerciseKey = keyof Pick<
  Exercise,
  'backgroundNoise' | 'duration' | 'intensity' | 'scheme' | 'speed'
>;

export type PathTunedExerciseKey = keyof Pick<
  Extract<Exercise, { path: TargetPath }>,
  'path'
>;
```

All three consumers now derive from it. `difficulty.ts` collapsed from six lines
to `} as const satisfies Record<TunedExerciseKey, ScoreInput>;`.

Proved they were genuinely wired to one definition rather than three lists that
happened to agree, by mutating the shared type and watching every consumer fail:

```
+ 'weight'   difficulty.ts(56)  randomProgram.ts(76)  types.ts(132)
- 'speed'    difficulty.ts(52)  randomProgram.ts(75)  types.ts(130)
```

A regression run confirmed the refactor changed no behaviour: 3,000 seeded
programs still valid and distinct, counts still spanning 3 to 9, all schemes and
paths still rolled, and the difficulty formula still matching the design's.

---

## Turn 8 — cite the algorithm

**Ben:**

> please provide a link to wikipedia or some other place that has a writeup of the
> fisher-yates algo, since you added a comment about it on the shuffled() function

**Agent:** Verified the URL resolved rather than pasting one from memory: both the
encoded en-dash form and the plain-hyphen redirect return 200, the page title is
`Fisher–Yates shuffle - Wikipedia`, and the `#The_modern_algorithm` anchor exists.

Linked that **specific section** rather than the article root, because the article
also documents Fisher and Yates' original 1938 pencil-and-paper method, which
strikes elements out of a list and looks nothing like the loop in the code. The
implementation here is the modern Durstenfeld form.

```ts
/**
 * Fisher-Yates over a copy, so the catalogue is never mutated. This is the
 * modern (Durstenfeld) form: walk down, swapping with a random earlier index.
 * https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
 */
```

---

## Turn 9 — the transcript

**Ben:** Asked for the last few exchanges to be appended to `prompt.md`.


---

## Session outcome

| Work | Result |
| --- | --- |
| Memoization restored and swept across 16 files | `8eec6c5` |
| `CLAUDE.md` / `AGENTS.md` memoization rule corrected | `8eec6c5` |
| PascalCase rename and module extractions committed | `8eec6c5` |
| Random program generator and button | implemented |
| Tuned-key types shared across three consumers | implemented |

The instructive finding: a single line of guidance in `AGENTS.md` had been quietly
steering every agent that read it toward stripping memoization. Fixing the
components without fixing the instruction would have left the same drift to happen
again.

