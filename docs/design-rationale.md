# Hosted app location
https://eyephi.benduran.com

# Design Rationale

## What is this document?
This document seeks to serve as a brief overview of why, given all the prompts presented in the take-home assignment, the **creative & generative tools** theme was chosen.
Additionally, motivation behind why the relatively non-standard application / solution choice was taken, and general commentary about the project technical, design and organizational decisions made.
Onward! 🏇

---

## Why did I choose the __creative & generative tools__ prompt?

I'd like to classify myself as a relatively creative person.
Prior to studying computer science and becoming a software engineer, I went to university to study music (I've been playing drums since I was 11 years old).
Pivoting to computer science felt natural to me, as it allowed me to express myself in ways to build ideas I had in my head, which has helped to scratch my creative itch, while also getting paid to do so (never a bad thing 😂)!

## Why build a vestibular training and rehabilitation application?

A few years ago, seemingly out of nowhere (while walking my dog, nonetheless), I experienced an intense, spinning, debilitating vestibular episode.
For nearly an entire day, I was incapable of doing anything other than lying on on my left-hand side and closing my eyes.
Eventually, the spinning subsided, but I was left with permanent vertigo, dizziness and susceptibility to vestibular migraines.
Many medical appointments later, it was determined that a COVID infection damaged part of my inner ear pathways and a prolonged period of high stress ended up becoming my first vestibular migraine trigger and episode.
Since my mobility was impacted, doctors recommended I undergo vestibular rehabilitation training, which requires performing various exercises to desensitize my vestibular system from stimuli, to help establish a new baseline.
I was given a combination of balance-related exercises and eye tracking exercises.
The eye tracking exercises, in particular, were very crude, and often required me to tape a piece of paper to my wall and perform various head movements.
It was this specific set of exercises that I wanted to target and build a reusable, customizable experience around, one where patients (or their doctors / therapists) could build their own exercise program, one where they can gradually increase their difficulty levels as their vestibular system regains some of its strength.
However, to lean into the **generative** portion of the prompt, in addition to enabling users to customize each exercise in their program, a **Randomize program** button was added, to allow a user to quickly build a new program they can try out immediately, with zero configuration required.

## Design choices

Most users are familiar with buying things online, and the "shopping cart / basket" UX is a pretty well-established paradigm.
Building a customized exercise program felt like a natural fit into that model, where a user is simply adding one or more exercises to their basket, and "checking out" is the final step where a user get their exercise program unique link and can kick off their program.
Since the vision I had was pretty clear, I was able to translate this into a mostly one-shot the design clickthrough prototype with Claude Design.

## Technical choices
For this project, I chose the following, with brief callouts about why:
- [mise](https://mise.jdx.dev/) - A single tool to unify all your runtime tools. I've had a wonderful experience with this tool. It works everywhere, is fast, doesn't pollute my global environment, and supports nearly every tool you can think of.
- [node](https://nodejs.org/en/download) - I chose `node` over `bun`, as I've experienced a number of issues running `bun` in production and in CI, whether that's slow static file hosting or random `segfault` errors, and I've found `node` has better performance when working with `next.js`. `node` also has 16 years worth of battle testing, which is hard to replace.
- [pnpm](https://pnpm.io/) - The most "predictable" package manager, where installs and dependency shrinkwrapping work, and module isolation and hoisting has the fewest bugs
- [typescript v6](https://www.typescriptlang.org/) (`v7` is available, but I've experienced some issues with tools, due to Microsoft switching to building a standalone binary with `go` and where that binary lives in `node_modules`)
- [next.js](https://nextjs.org/) - quickest way to build an SSR application, one that has reasonably-good SEO. Plus, it's plethora of documentation and community add-ons means that LLMs are well-equipped to assist when issues arise. I did consider `astro`, initially, but working with [islands](https://docs.astro.build/en/concepts/islands/) is a bit wonky, especially since the bulk of this application was going to be a glorified SPA (single-page application).
- [primereact](https://primereact.dev/components) - `shadcn` and `baseui` seem to get all the love these days, but `primereact` has been quietly shipping an excellent component library for awhile now. Plus, having used `primereact` to build the UI for the [BlueMinus - Blue light filter desktop application](https://ctrlwork.io/blueminus), I've had a generally pleasant experience, pleasant enough to use it for this project (plus, like `shadcn` and `baseui`, `primereact` has solved most of the tricky `a11y` issues for me).
- [tailwind CSS](https://tailwindcss.com/) - Allows for rapid ideating on CSS and layouts. Plus, most big component libraries support it in some manner, including `primereact`, so it felt like a natural fit.
- [kayplay](https://kaplayjs.com/) - used to handle the `<canvas />` rendering, drawing and events. The raw `getContext('2d')` API could have been used, or even something like `Pixi.js` or `Phase.js`, but Kaplay's object model makes getting setup a breeze, and its built-in event handlers keep things easy when you need to start building interactivity and animations. Plus, if I want to keep working on this project in the future and start supporting user input, `kaplay` is a literal game engine, so it's well-suited for that.
- [zod](https://zod.dev/) - With the exception of React component props interfaces, I am a strong supporter of heavy Zod schema usage to help detect and prevent "surprise" runtime bugs that result from poor TypeScript practices accidentally erasing important typing information and making the application less-safe. Additionally, creating a schema helps to also catch any potential API drifts across the app, and eventually, with external API providers (should any be integrated).
- [biome](https://biomejs.dev/) - Linter and formatter. I've been migrating a bunch of projects off of `eslint`, and found Biome's `kitchen-sink` feature set to be delightful to configure and set up, and its performance to be excellent.

## Implementation callouts

This list is non-exhaustive, but rather, a few interesting gotcha-style items:

- **Zero user identity or authentication**
  - Applying identities to somebody using a healthcare-oriented software tool means being extra cautious about identity and leaking of sensitive healthcare data (HIPAA in the USA, GDPR and DPA in the UK and Europe). To keep the UX simple and lean, everything was kept fully anonymous and oriented around link sharing.
  - **🚨 Tradeoff alert:** Keeping things fully-anonymous means that a users are unable to track their overall program progress, like whether they've added more exercises or increased the difficulty or duration of exercises. If this capabiltiy were to be added, some concept of identity would need to be implemented, as well as differentiation between the patient and the medical professional (so the medical professional cannot go through the program and have it count as though the patient completed it).
- **Monochromatic color scheme:** Many people with vestibular disorders experience some level of sensitivity to various color palettes and bright lights. In order to keep the visual noise focused to the actual `<canvas />` exercises, the color theme across the app was kept solely to a white-on-black or a black-on-white theme, with limited use of shades of grey.
  - **🚨 Tradeoff alert:** This color theme, while achieving the intention, does mean the app looks a bit bland, clinical, or lacking of identity. Something to consider in the future, if branding becomes an important part of the product.
- **Codec format for serializing exercise plan to a compressed string:** A bespoke wire format was created to serialize a plan's JSON object representation into a more compact, array-based format that can be better compressed with `lz` compression and safely stored as a `GET` query parameter, without worrying about reaching the `GET` URL length limitations.
  - **🚨 Tradeoff alert:** In retrospect, I should have used [zod's built-in codec](https://zod.dev/codecs) feature, rather than hand-rolling my own series of functions in [programCodec.ts](src/lib/programCodec.ts). While this wouldn't have necessarily changed the need for some of the logic written, it would have made it cleaner to simply write `schema.encode()` or `schema.decode()`. Additionally, the usage of such an opinionated codec means that a number of TypeScript interfaces will have to be hand-edited whenever a new field needs to be added to the wire format, and the `ENCODED_EXERCISE_FIELDS` constant will need to be manually updated.
- **Client-side SPA despite using Next.js:** Despite leveraging Next.js App Router, this application is essentially a client-side SPA. The server only serves initial HTML and exercise defaults (all program state lives in URL query params).
  - **🚨 Tradeoff alert:** No SEO benefit for dynamic content.
- **Kaplay engine singleton with canvas parking:** The Kaplay game engine is instantiated once and reused across components. The canvas DOM element is moved between hosts rather than recreated, using a hidden "parking" div between stage transitions.
  - **🚨 Tradeoff alert:** Avoids expensive engine recreation but requires careful lifecycle management and introduces coupling between components.
- **Monochrome theme enforced at component library level:** PrimeReact's Aura theme is heavily customized with a neutral color ramp, even overriding the default multi-colored progress spinner to single-color to maintain visual consistency.
  - **🚨 Tradeoff alert:** Deviating from built-in theme defaults makes future theme customization more difficult and requires maintaining custom preset overrides.
- **Device pixel ratio capped at 2x:** Canvas rendering caps `pixelDensity` at 2 despite some phones reporting 3x or higher.
  - **🚨 Tradeoff alert:** Balances retina sharpness with memory and performance on mobile devices, but sacrifices maximum visual fidelity on high-end phones or tablets.
- **Difficulty scoring normalizes against Zod schemas:** Each scoring input (duration, intensity, speed) is normalized against its Zod schema's min/max before weighting, preventing score skew when bounds change.
  - **🚨 Tradeoff alert:** Makes the scoring system less intuitive to reason about and potential "tribal knowledge" of the coupling between scoring and Zod schemas.

## If allowed more time / next steps

- **UX polish:** There are some nitpicks I have with the UX, like not having an `exit program` button when in the Fullscreen, immersive exercise viewer, or the color contrast with the immersive view's bottom button bar being poor when the exercise `<canvas />` is a light background color.
- **User analytics:** Implement either something paid, like [PostHog](https://posthog.com/), or something free, like [Umami](https://umami.is/) to capture some baseline viewership metrics, as well as falloff rates for different types of exercises. It would be very interesting to see which exercises have the highest bounce rates, as it might provide some interesting data to vestibular therapists, who can tune their exercise programs for the masses (or it might reveal common shortcomings for a person with an average vestibular disorder).
- **User progression:** As touched upon, briefly, in the tradeoffs section, I'd like to maintain some semblance of user identity, so users, both medical professionals *and* their patients, can see if there are particular parts of an exercise program that is proving to be difficult and requires more tuning.
- **Add more exercises, including gamer-focused exercises:** Many of these are specifically targeting people living with a vestibular disorder, so the exercises might seem quite peculiar. However, there is some overlap with exercise types between vestibular rehab and professional gamers. In fact, there exists several well known YouTube videos with "eye warm up" exercises for those who play fast-paced, multiplayer action games ([
DARKMODE FPS Eye Training Warmup 2025 (HIGH RES)](https://www.youtube.com/watch?v=gCR5EbuNcIE) and [FPS Eye Training - Improve Reaction Time & Tracking](https://www.youtube.com/watch?v=E7HOlJ_OhEo)). Doing this could allow for broader expansion of the addressable market for this tool.
- **Build tests for the critical parts of the app, like the configurator and the difficulty weightting:** The application currently lacks testing. Given the time constraints, this makes sense, but to move into something longer term, it would be a valuable investment to adds tests. **Note:** Arguably, the most *important* piece of the application is the `<canvas />` and how it renders and animates the exercises is also the most difficult to test, since it would either require extensive mocking of the `kaplay()` game engine's APIs, or, mocking of the underlying 2D canvas API, both of which would require a high level of effort and may be brittle to test reliably. This is because most test runners rely on synthetic DOM *approximation* libraries, like `JSDom` or `HappyDom`, which are not capable of rendering things into a server-side `<canvas />`. An alternative might be to do a full end-to-end test with a real browser, using Puppeteer or Playwright, which would also be a high level of effort.