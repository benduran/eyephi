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
- [biome](https://biomejs.dev/) - Linter and formatter. I've been migrating a bunch of projects off of `eslint`, and found Biome's `kitchen-sink` feature set to be delightful to configure and set up, and its performance to be excellent.
