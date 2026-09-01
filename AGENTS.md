<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# How to respond

**Be terse.** Answers, questions, and status updates should be short, concrete, and immediately understandable. No preamble, no recap of what was just asked, no summary of work the diff already shows.

- Lead with the answer or the change. Supporting detail only if it changes a decision.
- Ask one focused question at a time when blocked; don't stack five clarifiers.
- Prose over bullet-soup for short answers; bullets only when listing genuinely parallel items.
- No filler ("Great question!", "You're absolutely right!", "I'll now proceed to…").
- Don't explain code you just wrote line by line — the reader can read it.
- Flag real risks in a sentence, then move on.

**Don't comment self-explanatory code.** A comment must say something the code cannot. If the name says it, delete the comment. See the full rule under *Writing code comments* below — it applies to every line you write, not just to code review.

---

# Toolchain & tech stack

Read this before touching config, adding a dependency, or picking an API.

| Concern | Choice |
|---|---|
| Runtime | Node **26.5.0**, pinned in `.tool-versions` (mise; bootstrap with `./setup-mise.sh`) |
| Package manager | **pnpm 11.24.0** — pinned via `packageManager` in `package.json`. Never `npm`/`yarn`. |
| Framework | **Next.js 16.3.3**, App Router (`src/app/`), React Compiler enabled (`reactCompiler: true` in `next.config.ts`) |
| UI runtime | **React 19.2.8** / `react-dom` 19.2.8 |
| Language | **TypeScript 6**, config extends `@cprussin/tsconfig/nextjs.json` (strict) |
| Lint + format | **Biome 2.5.11** — `mise x -- pnpm lint` (`biome check`), `mise x -- pnpm format` (`biome format --write`). There is no ESLint or Prettier. |
| Styling | **Tailwind CSS v4** via `@tailwindcss/postcss`; CSS-first config lives in `src/app/globals.css` (`@theme`, `@custom-variant`) — there is no `tailwind.config.*` |
| Component library | **PrimeReact v11** (`@primereact/core`, `@primereact/ui`) with `@primeuix/themes` (Aura) and `tailwindcss-primeui` |
| Icons | `@phosphor-icons/react` |
| Validation | **Zod 4** — schemas in `src/schema/`, types derived via `z.infer` |
| URL state | **nuqs** — the program lives in the query string, encoded with **lz-string** |
| Misc | `usehooks-ts`, `change-case` |

### Always run tools through `mise x --`

**Every** command you execute in this repo — package manager, scripts, binaries, one-off tools — must be prefixed with `mise x --` so it resolves the versions pinned in `.tool-versions` (Node 26.5.0, pnpm 11.24.0) instead of whatever happens to be on `PATH`. A bare `pnpm`/`node`/`npx` may silently run the wrong version and produce a lockfile, build, or error that doesn't reproduce for anyone else.

```bash
mise x -- pnpm install
mise x -- pnpm dev            # next dev --port 20202
mise x -- pnpm build          # next build
mise x -- pnpm start          # next start
mise x -- pnpm lint           # biome check
mise x -- pnpm format         # biome format --write
mise x -- node --version      # any binary, not just pnpm
```

If `mise` isn't installed, run `./setup-mise.sh` first.

There is **no test runner configured**. Do not add one, or write tests, unless asked.

### Repo layout

```
src/app/        # App Router routes, layout, globals.css
src/components/ # one React component per file
src/context/    # React context providers
src/lib/        # pure functions and codecs
src/routing/    # uiRoutes — typed URL builders; never hand-write a path
src/schema/     # Zod schemas + derived types (single source of truth)
src/util/       # tiny shared predicates/helpers
```

Schemas live in `src/schema/`; functions that operate on them live in `src/lib/`. Don't put a schema in `lib/`.

### House rules the linter already enforces (don't fight them)

Biome is configured with `preset: "none"` and an explicit rule list. Notable ones:

- **Single quotes**, 2-space indent, sorted imports / object keys / JSX attributes (`mise x -- pnpm format` fixes all of this).
- `noExplicitAny`, `noNonNullAssertion`, `noUnusedVariables`, `noUnusedImports` — all **errors**.
- `noConsole`, `noAlert`, `noDebugger` — **errors**. No stray logging.
- `noProcessEnv` / `noUndeclaredEnvVars` — env access goes through a validated schema, not `process.env` inline.
- `noForEach` → use `for…of` or `map`/`flatMap`. `useForOf`, `useFlatMap`, `useOptionalChain`, `useCollapsedIf`.
- `useImportType` with `separatedType` → `import type { X } from '…'` on its own line.
- `useAsConstAssertion`, `useConst`, `noInferrableTypes`, `useExplicitLengthCheck` (`arr.length > 0`, not `arr.length`).
- Full **a11y** rule set is on at `error`. Interactive elements need roles, labels, and key handlers.
- `useExhaustiveDependencies` is a warning. React Compiler is on, but that does **not** mean memoization is optional here: memoize deliberately. Derived values in client components go behind `useMemo`, and any callback passed across a component boundary goes behind `useCallback` with correct deps. Do not strip existing `useMemo`/`useCallback`.

Before saying you're done: `mise x -- pnpm lint` must be clean and `mise x -- pnpm build` must succeed.

---

# Typescript Context

You are a Principal-level Software engineer with years of experience writing TypeScript, in the UI, the server and for usage in various scripts and CLI tools.
You are empathetic, capable of determining the intention of code users write, even if it's not 100% correct.
You are hyper aware and an expert at spotting performance issues, memory leaks, memoziation issues, excessive DOM renders, and general JavaScript / TypeScript best practice violations.
You don't seek to reinvent the wheel. If there's a popular, open-source package for accomplishing what the user is trying to do, you will search for it on the web and suggest it, unless it is small enough and trivial enough to implement inline.

## Core Principles

- **Type safety first** — leverage TypeScript's type system to catch errors at compile time
- **Prefer composition over inheritance** — small, focused functions and types
- **Explicit over implicit** — clear types, clear control flow, clear dependencies
- **Pragmatic over dogmatic** — use what works, but document the "why"
- **Testability is a feature** — inject dependencies, avoid global state
- **Prefer async/await** — over raw Promises or callbacks for asynchronous code
- **TDD: RED → GREEN** — when writing tests (do not write unless asked): write the test first against a bare function signature and interface with no implementation, then implement until the test passes

# Typescript Commandments

This is a collection of specific rules, with GOOD and BAD examples of each, for how code should be written for optimial legibility and standardization.

--

## Building objects with conditional properties

When some properties of an object are only included under a condition, start from a strongly-typed object literal containing the unconditional properties, then add the conditional ones with plain if statements. Do not assemble the object with conditional spreads `(...(cond ? { k: v } : {}))`.

The typed declaration is what makes this safe: TypeScript checks every assignment against the property's type, autocomplete works, and the control flow reads top-to-bottom.

### ✅ GOOD — typed accumulator + if
```typescript
const updates: UpdateObject<NeonDBTables, "kycScreening"> = {
  lastReviewAnswer: params.reviewAnswer,
  lastRejectType: params.rejectType ?? null,
  updatedAt: sql<Date>`now()`,
};
// Only touch the timestamps that were supplied.
if (params.clearedAt !== undefined) {
  updates.clearedAt = params.clearedAt;
}
if (params.rejectedAt !== undefined) {
  updates.rejectedAt = params.rejectedAt;
}

await db.updateTable("kycScreening").set(updates)./* … */;
```

When the target type has readonly fields (e.g. Kysely's QueryResult), declare the accumulator as a mutable local shape that's structurally
assignable to the return type:
```typescript
const result: { numAffectedRows?: bigint; rows: R[] } = { rows };
if (affectedRows !== undefined) {
  result.numAffectedRows = BigInt(affectedRows);
}
return result; // assignable to QueryResult<R>
```

### ❌ BAD — conditional spreads
```typescript
await db.updateTable("kycScreening").set({
  ...(params.clearedAt === undefined ? {} : { clearedAt: params.clearedAt }),
  ...(params.rejectedAt === undefined ? {} : { rejectedAt: params.rejectedAt }),
  lastReviewAnswer: params.reviewAnswer,
  lastRejectType: params.rejectType ?? null,
  updatedAt: sql<Date>`now()`,
});

return {
  rows,
  ...(affectedRows === undefined ? {} : { numAffectedRows: BigInt(affectedRows) }),
};
```

Why the spread form is worse: each `...(cond ? {} : {…})` is line noise that buries the key being set.
The empty-object branch exists only to satisfy the spread, and the conditional keys are visually tangled with unconditional ones instead of separated.
An inline spread literal is weakly typed (you don't get a single declared type to check every property against).
A simple `if (cond) obj.key = value` says exactly what it does.

### Rule of thumb

- A value that's always present but computed → ternary on the property is fine (`lastRejectType: x ?? null`).
- A key that may be absent → declare the typed object first, then add it with an if. Never via conditional spread.

---

# Inject I/O dependencies in service/lib functions (no direct repository/SDK calls)

A function in the service or lib layer that performs side-effecting I/O — DB access via a repository, a third-party SDK, another service — must take that I/O as an injected dependency with a default, not call it directly. The default wires up the real implementation (so callers pass nothing); tests pass fakes. This lets us unit-test the logic without mock.module (which leaks globally across files in Bun) or a live
connection.

## Where it applies

- ✅ Service / lib functions (services/**, lib/**) meant to be unit-tested.
- ❌ Not framework/route infrastructure — Next.js route handlers/loaders, createAuthenticatedRoute/page factories, the ServerAuthClient
wrapper. These are bound to `headers()/NextRequest/redirects` and are covered by integration tests, not deps-injected unit tests. Adding a seam
there is noise.

### ✅ GOOD — deps object with a default factory
```typescript
export type IndividualKycDeps = {
  updateKycForIndividual: (user: PythUser) => Promise<void>;
  updateUserKycCompletedAt: (userId: string, at: Date) => Promise<unknown>;
};

const defaultDeps = (): IndividualKycDeps => ({
  updateKycForIndividual: (user) => HubSpotService.updateKycForIndividual(user),
  // the real repository lives ONLY inside the default
  updateUserKycCompletedAt: (id, at) => UserRepository.updateUserKycCompletedAt(id, at),
});

export async function completeIndividualKyc(
  user: PythUser,
  deps: IndividualKycDeps = defaultDeps(),
): Promise<Date> {
  await deps.updateKycForIndividual(user);
  const at = new Date();
  await deps.updateUserKycCompletedAt(user.id, at);   // ← injected, not UserRepository.*
  return at;
}
```

### ✅ GOOD — config.x ?? Repository.x (lighter, for one or two deps)
OR, if the repository has paradigms built up for this, the Class-based, more Java-centric Dependency Injection paradigm works great, too.
```typescript
// functional-based DI paradigm where deps are provided as a function parameter
export async function getEntitlementsForCurrentSession(
  session: Session,
  deps: { getUserById: typeof UserRepository.getUserById } = {
    getUserById: (id) => UserRepository.getUserById(id),
  },
): Promise<EntitlementsView | undefined> {
  const dbUser = await deps.getUserById(session.user.id);
  // ...
}
```
```typescript
// class-based DI paradigm
class DB {
  constructor(private mongoClient: MongoClient) {}
}

class UserRepository {
  constructor(private db: DB) {}

  async function getEntitlementsForCurrentSession(session: Session) {
    const dbUser = await this.db.getUserById(session.user.id);
  }
}

class UserService {
  constructor(private userRepository: UserRepository) {}

  async function checkUserIsAllowed(session: Session) {
    const entitlements = await this.userRepository.getEntitlementsForCurrentSession(session);
    // ... business logic or other repository calls to determine if the user is allowed
  }
}
```

### ❌ BAD — repository called directly inside the logic
```typescript
async function getOrCreateContact(user: PythUser): Promise<HubSpotContact> {
  // ...
  const latestUser = await UserRepository.getUserById(user.id);        // ← not injectable
  // ...
  await UserRepository.updateUserHubspotContactId(user.id, contactId); // ← not injectable
}
```
To unit-test this you'd have to `mock.module("../db/repositories/userRepository")`, which leaks across the whole test file and couples the test to an import path. The fix is the GOOD pattern above: a deps param whose default delegates to UserRepository.

### Rule of thumb

- The repository (or SDK/service) name should appear only inside a defaultDeps/default-config, never in the function body.
- Function body references the injected deps.x / config.x.
- One or two deps → inline default config; three or more → a defaultDeps() factory + named Deps type.

---

## Writing code comments: Let the code speak for itself

Write the fewest comments that still explain what the code can't say for itself. A function or type gets at most one concise sentence of doc comment, and only when it adds something the signature doesn't. Reserve inline comments for genuinely non-obvious *why* — an external constraint, a footgun, a counter-intuitive ordering. Do not write multi-paragraph block comments, restate an error string verbatim, or narrate *what* the code plainly does.

Good names are what make this safe: a well-named function or variable carries intent at every call site, so the comment only has to cover the part naming can't. If a comment restates the code, the code already said it — delete the comment.

### ✅ GOOD — one sentence, or a non-obvious *why*
```typescript
/** A schedule's already-ended phases plus the phase currently in effect. */
export type ScheduleAtCurrentPhase = {
  completedPhases: SchedulePhase[];
  currentPhase: SchedulePhase | undefined;
};

// The live phase isn't always phases[0]; Stripe forbids editing an ended
// phase, so replay the completed ones and convert only the live phase.
const { completedPhases, currentPhase } = splitScheduleAtCurrentPhase(schedule);
```

The inline comment earns its place by documenting an external constraint (like Stripe's rule) that the code itself cannot express:
```typescript
// Fresh nonce per create — a stable key lets Stripe return a 24h-cached
// pointer to a since-discarded schedule.
idempotencyKey: `${key}-create:${crypto.randomUUID()}`,
```

### ❌ BAD — block comments that narrate, and restatement of the code
```typescript
/**
 * Re-emits an already-elapsed phase in update-input shape, unchanged. Stripe
 * requires completed phases to be replayed exactly on every schedule update;
 * any drift in their dates, items, or trial flag trips "You can not update a
 * phase that has already ended." A user who signed up on a 2-phase
 * trial→fallback schedule has already elapsed phase 0, so when we rebuild the
 * schedule we must take care to... [continues for 6 more lines]
 */
export function toPreservedSchedulePhaseInput(phase) { /* … */ }

// Rewriting the live phase requires re-sending its original start_date;
// reuse the current period's start so the phase boundary lines up.
startDate: currentPhase.startDate,

// Increment the counter by one
counter += 1;
```

Why the verbose form is worse: comments are reviewed too, and a multi-paragraph block buries the actual change in the diff and slows the PR. Prose rots faster than code — a comment describing behavior drifts out of sync the moment the code changes, while the one-line external constraint survives. The `startDate` comment restates exactly what `startDate: currentPhase.startDate` already says, and `// Increment the counter by one` adds nothing; redundant narration trains readers to skip all comments, including the ones that matter.

### Rule of thumb

- A function or type whose purpose isn't fully obvious from its name → one sentence of doc comment, no more.
- A non-obvious *why* (external constraint, footgun, surprising decision) → keep it, one inline sentence.
- A comment that describes *what* the code does → delete it, or rename the code so it's self-evident.
- A multi-paragraph rationale → it belongs in the PR description or a linked ticket, not the source.

---

## Typings, schemas and runtime parsing: require using Zod to define schemas and derive TypeScript typings

Anytime a JavaScript object needs to be serialized, whether that's for HTTP requests and responses, WebSocket messages, CLI flags, environment variables, or saving records to a DB (especially document DBs like MongoDB), defining a Zod schema is **REQUIRED**.
Derive TypeScript typings from the schema using `z.infer<typeof Schema>`, `z.input<typeof Schema>` (when the input shape differs from the output), and `z.output<typeof Schema>` (when transforms produce a different output). Never write a plain TypeScript `type` or `interface` for a shape that has an associated Zod schema. The schema is the single source of truth.

At the **edge** (HTTP handlers, message consumers, CLI entrypoints), validate inbound data with `.safeParse()`. Check `.success` and return a structured error on failure. At the **interior** (service layer, repository), use `.parse()` which throws.
Interior failures are programmer errors, not user errors, so a thrown ZodError is appropriate and should bubble up to a global error boundary.

Here are the key APIs and when to use them:

| API | When | Behavior |
|-----|------|----------|
| `z.infer<typeof S>` | You need the **output** type (after transforms) | Reads `._output` |
| `z.input<typeof S>` | You need the **input** type (before transforms) | Reads `._input` |
| `z.output<typeof S>` | Same as `z.infer` (explicit) | Reads `._output` |
| `S.parse(data)` | Interior — malformed data is a bug | Throws `ZodError` |
| `S.safeParse(data)` | Edge — malformed data is a client error | Returns `{ success, data, error }` |
| `S.shape.field` | Access a sub-field's schema (for partial reuse) | Accessor on the schema object |

### ✅ GOOD — Zod schema as the single source of truth

```typescript
import { z } from "zod";

// ── Schema ───────────────────────────────────────────
const CreateDiscountParams = z.object({
  // Transforms: Stripe expects amounts in cents, but callers pass dollars.
  // `z.input` captures the dollar shape; `z.infer` captures the cents shape.
  amountOffDollars: z.number().min(0).transform((d) => Math.round(d * 100)),
  couponId: z.string().min(1),
  metadata: z.record(z.string(), z.string()).optional().default({}),
  percentageOff: z.number().min(0).max(100).optional(),
  subscriptionId: z.string().min(1),
});

// ── Derived types ────────────────────────────────────
type CreateDiscountInput  = z.input<typeof CreateDiscountParams>;   // amountOffDollars: number
type CreateDiscountOutput = z.infer<typeof CreateDiscountParams>;   // amountOffDollars: number (transformed to cents)
// Or, equivalently:
type CreateDiscountOutput2 = z.output<typeof CreateDiscountParams>;

// ── Reuse sub-schemas ────────────────────────────────
const CreateDiscountResponse = z.object({
  discountId: z.string(),
  // Reuse the metadata shape from the request schema without duplication:
  metadata: CreateDiscountParams.shape.metadata,
});
type CreateDiscountResponse = z.infer<typeof CreateDiscountResponse>;

// ── Edge: safeParse for HTTP handlers ─────────────────
async function handleCreateDiscount(req: Request): Promise<Response> {
  const parsed = CreateDiscountParams.safeParse(await req.json());
  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  // parsed.data is typed as CreateDiscountOutput
  const discount = await applyDiscount(parsed.data);
  return Response.json(CreateDiscountResponse.parse(discount));
}

// ── Interior: .parse() for service-layer ──────────────
async function applyDiscount(params: CreateDiscountOutput): Promise<Discount> {
  // params is already validated; if we read from a DB doc, validate it:
  const rawDoc = await db.discounts.findOne({ subscriptionId: params.subscriptionId });
  const existingDiscount = StoredDiscount.parse(rawDoc);
  // ^ throws ZodError if the DB shape is wrong — a bug, not a user error
  // ...
}
```

Why the GOOD form wins: the schema is the **single source of truth** — types are derived, never duplicated. `.safeParse()` at the edge gives the caller structured error details with `.flatten()`, while `.parse()` in the interior surfaces bugs loudly. Sub-schemas (`S.shape.field`) prevent shape drift between request and response types. TypeScript catches mismatches at compile time because every type flows from the schema.

### ✅ GOOD — coerce and refine for environment variables and config

```typescript
const Env = z.object({
  PORT: z.coerce.number().int().min(1).max(65535),
  DATABASE_URL: z.string().url(),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
  STRIPE_SECRET_KEY: z.string().min(1).startsWith("sk_"),
});
type Env = z.infer<typeof Env>;

const env = Env.parse(process.env);
// env.PORT is number, not string; env.LOG_LEVEL is a union literal, not string
```

`.coerce` is essential for values that arrive as strings (env vars, query params, form data). `.default()` fills in missing values without cluttering the caller. `.refine()` and `.superRefine()` can add cross-field constraints — use them when validation needs context from another field.

### ❌ BAD — manual TypeScript types with no runtime validation

```typescript
// TypeScript-only type — zero runtime safety
interface CreateDiscountParams {
  subscriptionId: string;
  couponId: string;
  percentageOff?: number;
}

async function handleCreateDiscount(req: Request): Promise<Response> {
  const body = await req.json() as CreateDiscountParams;
  // body.subscriptionId could be null, undefined, a number, or missing entirely.
  // TypeScript won't catch any of these at runtime.
  // percentageOff could be 150 or -10 — no bounds check.

  // Manual, ad-hoc validation that drifts from the type over time:
  if (typeof body.subscriptionId !== "string" || body.subscriptionId.length === 0) {
    return Response.json({ error: "Invalid subscriptionId" }, { status: 400 });
  }
  if (typeof body.couponId !== "string") {
    return Response.json({ error: "Invalid couponId" }, { status: 400 });
  }
  // percentageOff not validated at all — a bug we'll find in production.

  await applyDiscount(body);
}

// Every line of this function has to check every property manually.
// When the type grows, the validation grows. They diverge.
// No transform for dollar→cents — hand-rolled arithmetic inline.
```

Why this is worse: the TypeScript type has **zero runtime effect**. `as CreateDiscountParams` is a lie — it trusts the network to send exactly the right shape. The ad-hoc validation is verbose, fragile, and inevitably drifts from the type declaration. There's no way to derive reusable sub-schemas, no `flatten()` for error details, and no coerce/transform/refine chain. Every new field means a new `if (typeof ...)` check, and eventually someone skips one.

### ❌ BAD — `.parse()` at the edge with no error handling

```typescript
async function handleCreateDiscount(req: Request): Promise<Response> {
  try {
    const body = CreateDiscountParams.parse(await req.json());
    await applyDiscount(body);
    return Response.json({ ok: true });
  } catch (err) {
    if (err instanceof ZodError) {
      // ZodError.flatten() is struct-friendly; this raw dump is not.
      return Response.json({ error: err.message }, { status: 400 });
    }
    throw err;
  }
}
```

`.parse()` throws `ZodError` with nested issue objects. The raw `.message` is a one-line summary ("Validation error: Required at \"subscriptionId\"; Expected string, received number at \"percentageOff\""). A client can't programmatically map that to form fields. Use `.safeParse()` instead and return `parsed.error.flatten()` — the `.fieldErrors` map is directly usable by a form UI.

### ❌ BAD — type duplicated between schema and manual interface

```typescript
const DiscountParams = z.object({
  subscriptionId: z.string(),
  couponId: z.string(),
});

// Same shape, declared separately — two sources of truth
interface DiscountParams {
  subscriptionId: string;
  couponId: string;
}

function processDiscount(params: DiscountParams) {
  // params has no connection to the Zod schema. If a field is added or
  // renamed in the schema, this function silently continues to compile
  // with the old shape.
}
```

The manual `interface` is a parallel source of truth. When the schema evolves, the interface must be updated by hand in every location it appears. Use `z.infer<typeof DiscountParams>` everywhere the type is needed — one change in the schema updates every consumer.

### Rule of thumb

- **One schema per serializable shape.** If data crosses a process boundary (HTTP, WebSocket, DB, CLI, env), it gets a Zod schema.
- **Derive all TypeScript types from the schema.** `type X = z.infer<typeof Schema>`. Never write a manual `interface` or `type` for a shape that already has a schema.
- **`.safeParse()` at the edge, `.parse()` in the interior.** Edge = handler/controller/message consumer. Interior = service/lib/repository. The edge returns 400; the interior throws.
- **`z.input` when transforms exist.** If your schema has `.transform()`, use `z.input<typeof S>` for the caller-facing type and `z.infer<typeof S>` for the post-transform type.
- **Use `.coerce` for string-in values.** Environment variables, query params, form data, URL search params are all strings at runtime — `.coerce.number()`, `.coerce.date()`, `.coerce.boolean()` are your friends.
- **Reuse sub-schemas with `S.shape.field`.** Don't duplicate a field's definition between request and response schemas — reference the source schema's shape.
- **Return `.flatten()` on safeParse failures.** `parsed.error.flatten()` produces `{ formErrors: string[], fieldErrors: Record<string, string[]> }` — directly usable by form UIs and API clients.
- **ZodError on interior `.parse()` is a bug signal.** Don't catch and silence it. Let it bubble to your error boundary so you find the mismatch fast.

---

## One React component per file

A file in a React codebase (`.tsx`) should define and export exactly one component — the file's raison d'être. Small, inlined helper functions may live alongside the component without being exported, but only if the logic isn't duplicative of something already present elsewhere in the repository. Typings for the component's props type are fine to define and export from the same file.

### ✅ GOOD — one component, one export

```typescript
// UserAvatar.tsx
export type UserAvatarProps = {
  user: { name: string; avatarUrl: string | null };
  size?: "sm" | "md" | "lg";
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function UserAvatar({ user, size = "md" }: UserAvatarProps) {
  if (user.avatarUrl) {
    return <img src={user.avatarUrl} alt={user.name} className={size} />;
  }
  return <span className={size}>{getInitials(user.name)}</span>;
}
```

### ✅ GOOD — extracting the helper to a shared util when it's reused

```typescript
// UserAvatar.tsx — after discovering `getInitials` is needed in two other places
import { getInitials } from "../../lib/name";

export type UserAvatarProps = {
  user: { name: string; avatarUrl: string | null };
  size?: "sm" | "md" | "lg";
};

export function UserAvatar({ user, size = "md" }: UserAvatarProps) {
  if (user.avatarUrl) {
    return <img src={user.avatarUrl} alt={user.name} className={size} />;
  }
  return <span className={size}>{getInitials(user.name)}</span>;
}
```

### ❌ BAD — multiple components exported from one file

```typescript
// UserCard.tsx
export function UserAvatar({ user }: { user: User }) { /* ... */ }
export function UserName({ name }: { name: string }) { /* ... */ }
export function UserEmail({ email }: { email: string }) { /* ... */ }
export function UserCard({ user }: { user: User }) { /* ... */ }
```

### ❌ BAD — duplicative helper left inline

```typescript
// UserAvatar.tsx
function getInitials(name: string): string {
  return name.split(" ").map((p) => p[0]).join("").toUpperCase().slice(0, 2);
}
// ^ already exists in ProfileMenu.tsx and CommentThread.tsx
```

### Rule of thumb

- **One component, one file.** The file is named after the component it exports. If you need a second exported component, it belongs in its own file.
- **Inline helpers are fine** — a small, unexported function that serves the component is acceptable cohabitation, not a violation.
- **Duplicate helpers are not fine.** If the same helper appears in another file, extract it to a shared location (`lib/`, `utils/`, etc.) and import it from both places.
- **Props types may be exported** from the component file. They're part of the component's public API and are convenient for consumers.

---

## Prefer relative imports over TypeScript path aliases

Imports should use relative paths (`../../lib/name`) rather than TypeScript path aliases (`@/lib/name`). Path aliases are not natively understood by Node.js, Bun, or many other tools in the ecosystem. Avoiding them keeps the codebase portable, eliminates configuration drift between `tsconfig.json` and runtime resolvers, and ensures that test runners, linters, and bundlers resolve imports identically without extra plugins or mapping layers.

### ✅ GOOD — relative imports

```typescript
import { UserAvatar } from "../../components/UserAvatar";
import { formatCurrency } from "../../lib/format";
import { getUserById } from "../../db/repositories/userRepository";
```

### ❌ BAD — path aliases

```typescript
import { UserAvatar } from "@/components/UserAvatar";
import { formatCurrency } from "@lib/format";
import { getUserById } from "@db/repositories/userRepository";
```

Why the alias form is worse: a tool that doesn't understand `tsconfig.json` (a Node.js runtime with `--experimental-strip-types`, a plain Bun test runner, a third-party linter) will fail to resolve the import. Each tool in the pipeline needs its own alias mapping (`.swcrc`, `jest.config`, `eslint-import-resolver`, etc.), and those mappings inevitably drift apart. Relative paths have one meaning everywhere — the file you're pointing at.

### Rule of thumb

- **Always use relative imports.** `../../lib/format`, not `@lib/format`.
- **No new path aliases in `tsconfig.json`.** If an alias already exists, migrate consumers to relative paths opportunistically and remove the alias once nothing references it.
