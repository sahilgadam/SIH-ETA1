# RailSense --- Complete Visual Rebuild / Design-Engineering Master Prompt

> **This is a master instruction file for Claude Code.**
>
> The current RailSense prototype has useful functionality but its
> visual hierarchy, composition, color usage, imagery, interaction
> design, and motion are not at the required quality level.
>
> **You have FULL PERMISSION to completely restructure and rebuild the
> frontend.**
>
> Do not preserve the existing visual design merely because it already
> exists. Preserve useful functionality, data, routes, and working flows
> unless a better implementation is required. Rebuild the experience
> around the product's actual concept: **a living railway network whose
> ETA continuously changes as the journey unfolds.**

------------------------------------------------------------------------

# 0. EXECUTION MODE

You are not being asked to "theme" the existing website.

You are being asked to **rethink and rebuild it**.

The current implementation should be treated as a functional
prototype/reference for behavior, not as the design specification.

You have permission to:

-   replace layouts
-   reorder sections
-   replace components
-   create new components
-   remove redundant components
-   refactor state
-   restructure CSS
-   introduce animation libraries
-   introduce SVG visualizations
-   create new visual primitives
-   change typography
-   change color system
-   redesign navigation
-   redesign search
-   redesign train lists
-   redesign station boards
-   redesign alerts
-   redesign dashboards
-   redesign mobile layouts
-   change the information architecture where UX improves
-   rewrite weak UI copy
-   create new interactions
-   create a proper railway simulation layer
-   use the existing images in `/public` creatively
-   add dependencies when justified

Do not ask for permission for reasonable implementation decisions.

Do not make a superficial "before/after theme" change.

This must be a **complete visual and interaction rebuild**.

------------------------------------------------------------------------

# 1. IMPORTANT: UNDERSTAND THE EXISTING APP FIRST

Before modifying code:

1.  Inspect the entire repository.
2.  Inspect package.json.
3.  Identify the framework.
4.  Identify routing.
5.  Identify state management.
6.  Identify current mock data.
7.  Identify current train/station data.
8.  Identify current pages.
9.  Identify current reusable components.
10. Identify existing animation libraries.
11. Inspect every file in `/public`.
12. Inspect `img1.jpg` through `img10.jpg` visually.
13. Run the application.
14. Test the current user flows.
15. Understand what functionality already works.

Do not guess.

Do not immediately delete existing code.

Create a mental model of the application first.

Then rebuild the frontend.

------------------------------------------------------------------------

# 1A. SKILL VERIFICATION GATE

Before touching the RailSense UI, verify the installed skill stack.

Run/check the equivalent of:

-   Anthropic `frontend-design`
-   `ui-ux-pro-max`
-   ConardLi `web-design-engineer`
-   freshtechbro animation/motion skills, especially:
    `gsap-scrolltrigger`, `motion-framer`, `react-spring-physics`,
    `animejs`, `lottie-animations`, `locomotive-scroll`, `barba-js`, and
    relevant SVG/3D skills.

If using the `freshtechbro/claudedesignskills` marketplace, prefer its
category bundles when they provide the required capabilities:

-   `core-3d-animation`
-   `extended-3d-scroll`
-   `animation-components`

Do not install the 3D authoring pipeline unless the project actually
needs Blender/Spline/Rive/Substance workflows.

After installation/verification, inspect the skill instructions and use
them as implementation guidance. Do not merely mention the skills in the
plan; actually apply their relevant principles.

------------------------------------------------------------------------

# 2. REQUIRED CLAUDE CODE SKILL STACK

Before implementation, make sure the project has the strongest relevant
frontend/design/motion skills available.

The skill stack below is intentionally broader than the minimum. Install
the capabilities first, then let Claude Code load only the relevant
skill content for each task.

## 2.1 Required design skills

Use:

-   `frontend-design` --- Anthropic's frontend design skill; use it as
    the baseline anti-generic/anti-AI-slop design direction.
-   `ui-ux-pro-max` --- use for UX patterns, hierarchy, responsive
    behavior, accessibility, interaction patterns, and design-system
    decisions.
-   `web-design-engineer` --- ConardLi/garden-skills; use it as the
    broader design-engineering layer for visual frontends, dashboards,
    animations, design-system exploration, critique, and verification.

`web-design-engineer` is particularly important for this rebuild because
it explicitly supports overhaul-oriented redesigns, design calibration,
anti-cliché checks, typography/color systems, motion, responsive
behavior, and visual QA patterns.

Source:
https://github.com/ConardLi/garden-skills/tree/main/skills/web-design-engineer

## 2.2 Required animation/motion skill stack

Use the `freshtechbro/claudedesignskills` animation ecosystem when
available.

Priority skills/capabilities for RailSense:

1.  `gsap-scrolltrigger`
    -   primary choice for complex timelines
    -   scroll-linked storytelling
    -   railway train movement
    -   SVG MotionPath
    -   coordinated multi-element sequences
2.  `motion-framer`
    -   React UI transitions
    -   layout animation
    -   shared transitions
    -   component state changes
    -   gestures and micro-interactions
3.  `react-spring-physics`
    -   physical/spring-like UI motion where appropriate
4.  `animejs`
    -   lightweight timeline/micro-animation alternatives when GSAP is
        unnecessary
5.  `lottie-animations`
    -   only for suitable pre-authored motion assets; do not replace
        real railway motion with generic Lottie decoration
6.  `locomotive-scroll`
    -   consider only if the existing stack benefits from smooth,
        scroll-driven editorial behavior; do not introduce it merely for
        smooth scrolling
7.  `barba-js`
    -   use only if the application's routing architecture benefits from
        cinematic page transitions; do not force it into an SPA where it
        creates unnecessary complexity
8.  `threejs-webgl` / `react-three-fiber`
    -   optional for genuinely useful 3D railway/network scenes
    -   do not add 3D merely because the skill exists
9.  `pixijs-2d`, `aframe-webxr`, `playcanvas-engine`,
    `babylonjs-engine`, `vanta`, and other specialist skills
    -   use only if a concrete RailSense interaction requires them

The source repository describes a 22-skill set plus bundle plugins,
while its verification section also references a 23-directory skill
count. Treat the repository's currently available marketplace/bundle
contents as the source of truth rather than hard-coding a number.

Source: https://github.com/freshtechbro/claudedesignskills

## 2.3 Skill usage rule

Do NOT make the mistake of using every installed library.

The project should have multiple motion capabilities available, but each
interaction must have one clear implementation owner.

Preferred decision order:

-   React UI state/layout motion → Motion / Framer Motion
-   Complex choreographed sequences → GSAP
-   Train-on-track/path motion → GSAP MotionPath or a lightweight SVG
    path implementation
-   Simple hover/press/reveal → CSS or Motion
-   Spring/physical response → React Spring
-   Authored illustration animation → Lottie
-   Complex 3D scene → Three.js/R3F only when justified

If two libraries can solve the same interaction, choose one. Avoid
shipping overlapping animation systems without a reason.

## 2.4 Other useful capabilities

Also use relevant installed skills for:

-   `feature-dev`
-   `website`
-   accessibility
-   responsive design
-   performance optimization
-   SVG/data visualization
-   visual QA/browser inspection
-   testing
-   image handling/art direction

If an important capability is unavailable, implement the equivalent
carefully rather than stopping the rebuild.

------------------------------------------------------------------------

# 3. DESIGN RESEARCH BEFORE IMPLEMENTATION

Before finalizing the new design direction, study current transportation
and motion-design patterns.

Use these as inspiration, NOT as templates:

-   Rail Europe --- journey/search UX
-   SNCF Connect --- transportation product UX
-   Indian railway UX research
-   Contemporary railway tracking interfaces
-   Awwwards-level editorial web experiences
-   GSAP motion-path examples
-   Motion layout/scroll animation patterns

The goal is to learn:

-   information hierarchy
-   travel search behavior
-   journey visualization
-   data density
-   motion principles
-   responsive interaction
-   editorial composition

Do not copy branding, layouts, illustrations, or exact interactions.

Useful technical references:

GSAP MotionPath supports moving elements along SVG paths and supports
path alignment and auto-rotation. Use this capability for railway
movement where appropriate.

Motion for React supports scroll-triggered animations, scroll-linked
motion, layout animation, shared-element transitions, and reduced-motion
hooks.

Awwwards-style references demonstrate that strong modern sites often
combine editorial composition, large imagery, restrained typography, and
purposeful scroll/micro-interactions rather than simply adding more
cards.

------------------------------------------------------------------------

# 4. THE CENTRAL DESIGN IDEA

RailSense should look like:

**A digital railway instrument built from the visual language of the
physical railway.**

Not:

-   generic SaaS
-   generic AI dashboard
-   government portal
-   futuristic cyberpunk
-   startup template

The physical railway should become the design system.

Examples:

### Tracks

Become: - dividers - navigation lines - timelines - route indicators -
visual connectors

### Stations

Become: - nodes - interaction points - journey milestones

### Signals

Become: - system states - alerts - status indicators

### Timetables

Become: - data architecture - train lists - departure boards

### Trains

Become: - the primary animated objects

### Delay propagation

Become: - animated flows through the network

### Railway photography

Become: - the human / physical layer

### ETA prediction

Become: - the central visual narrative

------------------------------------------------------------------------

# 5. THE CURRENT DESIGN MUST NOT BE THE DESIGN REFERENCE

The current UI is too:

-   simple
-   card-heavy
-   predictable
-   green-heavy
-   white-card-on-background
-   generic
-   static
-   template-like

Do NOT simply:

-   change green to brown
-   add a serif font
-   add a railway icon
-   keep the same cards
-   add a photograph
-   add fade animations

That would still be the same design.

Instead rethink:

-   hierarchy
-   composition
-   section order
-   density
-   visual storytelling
-   interaction model
-   animation
-   imagery
-   navigation
-   search
-   train visualization

------------------------------------------------------------------------

# 6. NEW COLOR SYSTEM

The existing green-heavy palette must be replaced.

Build the product around a sophisticated warm editorial palette.

Use this as the starting token system:

``` css
:root {
  /* Paper */
  --paper-0: #F7F2E9;
  --paper-1: #F0E8DA;
  --paper-2: #E3D5C2;
  --paper-3: #D1BFA8;

  /* Ink */
  --ink-0: #18221E;
  --ink-1: #29332E;
  --ink-2: #514A42;
  --ink-3: #766B60;

  /* Railway brown */
  --brown-0: #3B2920;
  --brown-1: #594033;
  --brown-2: #785643;

  /* Railway green */
  --green-0: #163D30;
  --green-1: #245C45;
  --green-2: #3E765C;

  /* Brass */
  --brass-0: #96733E;
  --brass-1: #B4935D;

  /* Signal */
  --signal-red: #A64637;
  --signal-amber: #B97732;
  --signal-green: #3E7455;

  /* Lines */
  --line-soft: rgba(59, 41, 32, 0.13);
  --line: rgba(59, 41, 32, 0.22);
  --line-strong: rgba(59, 41, 32, 0.35);
}
```

Important:

**Do not make green the dominant color.**

Dominant: - warm ivory - cream - brown - charcoal

Green: - railway active state - selected route - positive operational
state - brand accent

Brass: - premium accent - historical/editorial accent

Red: - delay - alert - disruption

Amber: - warning - congestion

The result should visibly contain a rich palette rather than looking
like a monochrome beige website.

------------------------------------------------------------------------

# 7. ADD COLOR DEPTH

Use different surfaces.

For example:

``` text
Paper
Cream
Sand
Dark brown
Deep green
Muted brass
Signal red
Amber
```

Some sections should be dark.

Example:

A dark railway-green section can contain:

-   live network
-   prediction visualization
-   moving trains
-   light text
-   brass station nodes

Another section can use:

-   cream
-   brown typography
-   red operational markers

Another can use:

-   warm paper
-   photography
-   dark typography

The page should have **visual rhythm**.

Do not use one background color from top to bottom.

------------------------------------------------------------------------

# 8. TYPOGRAPHY

Use an editorial display typeface + practical UI typeface + technical
mono typeface.

Preferred combinations:

Display: - Instrument Serif - Fraunces - DM Serif Display

UI: - Manrope - Geist - General Sans

Technical: - IBM Plex Mono - JetBrains Mono

Use serif/display typography for:

-   hero headline
-   major editorial statements
-   section headlines

Use sans-serif for:

-   navigation
-   body
-   buttons
-   forms

Use monospace for:

-   station codes
-   train numbers
-   times
-   ETA
-   speed
-   simulation time
-   coordinates
-   technical status

Do NOT make every text element monospace.

------------------------------------------------------------------------

# 9. IMAGE ASSETS

There are already images in:

``` text
/public/img1.jpg
/public/img2.jpg
/public/img3.jpg
/public/img4.jpg
/public/img5.jpg
/public/img6.jpg
/public/img7.jpg
/public/img8.jpg
/public/img9.jpg
/public/img10.jpg
```

Inspect the actual files first.

Use them deliberately.

Suggested roles:

``` text
img1.jpg
Primary train / hero

img2.jpg
Railway station / platform

img3.jpg
Train journey / landscape

img4.jpg
Railway tracks / infrastructure

img5.jpg
Station at dusk

img6.jpg
Railway signal

img7.jpg
Railway control room

img8.jpg
Train interior / passenger experience

img9.jpg
Platform / passengers

img10.jpg
Train bridge / landscape
```

These are suggestions, not strict requirements.

Choose based on actual composition and image quality.

------------------------------------------------------------------------

# 10. IMAGE TREATMENT

The existing images must NOT look like "old HTML image tags."

Do not simply do:

``` text
<img>
text
```

Instead use editorial art direction.

Possible treatments:

### Large image crop

Image occupies 40--60% of a section.

### Edge-to-edge image

Image breaks out of the normal container.

### Image + typography

Large image on one side. Editorial statement on the other.

### Image reveal

Image is revealed through a clip-path or masked animation.

### Image overlap

Typography or data panel partially overlaps the image.

### Image frame

Thin warm border + caption.

### Parallax

Extremely subtle movement.

### Hover

Very subtle image scale, approximately 1.02--1.05.

Never use huge zoom effects.

Do not put every image inside a rounded card.

------------------------------------------------------------------------

# 11. WEBSITE INFORMATION ARCHITECTURE

Reorder the website based on what the user needs first.

Primary passenger questions:

1.  Where is my train?
2.  When will it arrive?
3.  Is it delayed?
4.  Why did the ETA change?
5.  What is happening ahead?
6.  What trains are available?

Primary operations questions:

1.  What is happening on the network?
2.  Which trains are delayed?
3.  Where is congestion?
4.  Which downstream services are affected?
5.  Which stations/platforms are impacted?

Design hierarchy around these questions.

------------------------------------------------------------------------

# 12. HOMEPAGE --- COMPLETE RESTRUCTURE

Do not keep the current section order.

Recommended structure:

## A. HERO

Large asymmetric editorial composition.

Left:

``` text
REAL-TIME RAILWAY INTELLIGENCE

Know when your train
will actually arrive.
```

Then concise explanation.

Then immediate search.

Right:

Large real train image.

Use `/public/img1.jpg` or the best suitable train image.

Overlay live information:

``` text
12951
RAJDHANI EXPRESS

SURAT
→
VADODARA

ETA
18:42

+08 MIN
```

This should look like a physical railway instrument translated into
digital form.

------------------------------------------------------------------------

# 13. HERO MOTION

On page load:

1.  navigation appears
2.  eyebrow reveals
3.  headline reveals line by line
4.  body appears
5.  search enters
6.  image reveals
7.  train data fades into image
8.  railway line draws itself
9.  train marker begins moving

Use a cinematic but restrained sequence.

No bouncing.

No springy SaaS animations.

The motion should feel physical.

------------------------------------------------------------------------

# 14. HERO RAILWAY ANIMATION

Create an SVG route.

Example:

``` text
BCT ─────── ST ─────── BRC ─────── RTM ─────── NDLS
```

The line can subtly curve.

Station nodes appear.

A train marker travels along the line.

The train marker can be:

-   geometric
-   minimal
-   directional
-   slightly locomotive-inspired

Do NOT use a cartoon train.

------------------------------------------------------------------------

# 15. TRAIN DETAIL MICRO-MOTION

Where visually appropriate, add subtle physical railway details.

Examples:

### Steam/smoke

Only on suitable locomotive imagery or an illustrated/animated
heritage-style train element.

Smoke should: - be subtle - diffuse - slow - low-opacity - never look
like a cartoon cloud

### Wheels

If a locomotive/train illustration is used: - wheel rotation should
correspond to movement speed - do not animate wheels on static
photography

### Motion blur

Use extremely subtle blur/trail only where it communicates movement.

### Overhead wires

In a route illustration, use parallax-like movement or line drawing.

### Signal

Signal state can change: - green - amber - red

Use this to communicate operational state.

Do not add smoke/wheels simply for decoration.

Only use physical details where they make conceptual sense.

------------------------------------------------------------------------

# 16. JOURNEY FINDER

The current search block is too dominant and card-like.

Rebuild it as a **journey instrument**.

Use:

``` text
FROM
BCT
Mumbai Central

TO
NDLS
New Delhi

DATE
Today
```

Then:

``` text
FIND TRAINS →
```

Use station codes as technical visual anchors.

Below:

``` text
Popular:
BCT → NDLS
HWH → NDLS
MAS → SBC
```

Search by train number/name should remain easy to access.

Do not make voice search the primary interaction.

------------------------------------------------------------------------

# 17. IMPORTANT: VOICE SEARCH POSITION

The current "Where's my train?" voice section is in the wrong hierarchy.

Do NOT put it before the primary train list.

The user should first see:

1.  Search
2.  Live/current train information
3.  Popular/available trains
4.  Network/prediction information
5.  Voice assistant as a secondary convenience

The voice option should be accessible from a **small persistent
side/floating assistant control**.

Example:

``` text
┌──────────────────────┐
│ Ask RailSense        │
│ Where's my train?    │
│ 🎙 / microphone      │
└──────────────────────┘
```

But do not use an emoji in the actual implementation.

Use a proper icon.

On desktop: - small bottom-right assistant control

On mobile: - bottom action / expandable assistant

The user should not have to scroll to find it.

------------------------------------------------------------------------

# 18. TRAIN LIST MUST MOVE UP

This is a key UX change.

The train list/popular trains should appear **much earlier** on the
homepage.

Recommended order:

``` text
HERO
↓
SEARCH
↓
LIVE NETWORK SNAPSHOT
↓
POPULAR / ACTIVE TRAINS
↓
JOURNEY VISUALIZATION
↓
WHY ETA CHANGES
↓
CAPABILITIES
↓
EDITORIAL PHOTOGRAPHY
↓
FOOTER
```

Do not bury trains near the bottom.

------------------------------------------------------------------------

# 19. LIVE NETWORK SNAPSHOT

Immediately after search, create a strong live system section.

Possible design:

Dark railway-green background.

Header:

``` text
LIVE NETWORK
18:39:55 IST
```

Show an animated miniature network.

Multiple trains move simultaneously.

Show:

``` text
ON TIME
DELAYED
CONGESTED
STOPPED
```

This section should immediately demonstrate that RailSense is not just a
timetable.

------------------------------------------------------------------------

# 20. MULTIPLE TRAIN ANIMATION

This is a required feature.

Show at least 8--12 simulated trains where appropriate.

Different trains:

-   different routes
-   different speeds
-   different directions
-   different statuses
-   different delays

They must move continuously.

Example:

``` text
Train A ────────────────→
Train B ←───────────────
Train C ───────→
Train D ────────────────→
```

Use SVG paths.

Use GSAP MotionPath or an equivalent robust motion system where
appropriate.

GSAP's MotionPath system is specifically suited to moving objects along
SVG paths and can auto-rotate objects to follow the path.

------------------------------------------------------------------------

# 21. TRAIN ANIMATION PHYSICS

Train movement should not feel like a dot moving at constant speed.

Simulate:

``` text
departure
acceleration
cruising
deceleration
station stop
departure
```

When a train approaches a station:

-   speed decreases
-   marker reaches station
-   marker stops
-   station node changes state
-   ETA updates
-   marker resumes

Different trains should have different dwell times.

------------------------------------------------------------------------

# 22. SIMULATION ENGINE

Create one central simulation source.

Suggested:

``` text
data/
  trains
  stations
  routes
  events
  historical
  simulation

components/
  railway/
  trains/
  stations/
  prediction/
  simulation/
```

Central state:

``` text
currentTime
trains
stations
routes
events
```

Do NOT generate random state inside individual UI components.

------------------------------------------------------------------------

# 23. SIMULATION CONTROLS

Provide:

``` text
PLAY
PAUSE
1×
2×
5×
```

Also:

``` text
SIMULATION
18:39:55 IST
```

Use compact controls.

Do not create a giant "simulation dashboard."

The simulation should feel integrated into the product.

------------------------------------------------------------------------

# 24. DYNAMIC ETA

The ETA should visibly change as the train moves.

Example:

``` text
18:42
```

then:

``` text
18:44
```

then:

``` text
18:43
```

depending on simulated events.

The interface should explain the change.

Example:

``` text
ETA revised +2 min

Congestion ahead
```

Then later:

``` text
ETA recovered -1 min

Higher sectional speed
```

This is far more convincing than a static "94% confidence" card.

------------------------------------------------------------------------

# 25. PREDICTION EXPLANATION

Make the model concept visible.

Use:

``` text
WHY DID THE ETA MOVE?
```

Then a visual flow:

``` text
CURRENT POSITION
        ↓
RUNNING SPEED
        ↓
SECTION HISTORY
        ↓
NETWORK CONDITIONS
        ↓
PREDICTED REMAINING TIME
        ↓
ETA
```

This should be a major visual story.

------------------------------------------------------------------------

# 26. LIVE NETWORK PAGE

This is the product centerpiece.

Layout:

``` text
---------------------------------------------------
LIVE NETWORK                      18:42 IST
---------------------------------------------------

                  NETWORK VISUALIZATION

             multiple animated trains

                                           LIVE TRAINS
                                           12951
                                           12002
                                           12301
                                           ...
```

The network visualization should dominate.

The right panel should be secondary.

Do not build a conventional dashboard grid.

------------------------------------------------------------------------

# 27. NETWORK VISUALIZATION

Use SVG.

Include:

-   railway routes
-   station nodes
-   junctions
-   train markers
-   congestion sections
-   signals
-   direction indicators
-   zone labels

Use different line weights.

Primary route: strong.

Secondary routes: subtle.

Congestion: warm red/amber.

Active train: green/brass.

------------------------------------------------------------------------

# 28. NETWORK ANIMATION

Possible interactions:

### Train hover

Train marker enlarges slightly.

Route highlights.

Tooltip appears.

### Train click

Route becomes emphasized.

Right-side drawer opens.

### Station hover

Station node expands.

Upcoming trains appear.

### Congestion

Affected section gets a restrained animated pulse.

### Signal

Signal state changes when operational events occur.

### Time progression

Train positions update.

------------------------------------------------------------------------

# 29. TRAIN DRAWER

Clicking a train should open a detailed drawer.

Use Motion layout/AnimatePresence or equivalent.

Show:

``` text
12951
RAJDHANI EXPRESS

MUMBAI CENTRAL
→
NEW DELHI

CURRENT
SURAT

NEXT
VADODARA

SPEED
94 km/h

DELAY
+08 MIN

ETA
18:42
```

Then:

``` text
WHY THIS ETA?

+4 min congestion
+2 min previous departure
-3 min recovery
+1 min speed restriction
```

Use clear hierarchy.

------------------------------------------------------------------------

# 30. TRAIN DETAILS PAGE

This page should demonstrate the core ML idea.

Top:

``` text
12951
RAJDHANI EXPRESS

Mumbai Central → New Delhi
```

Large:

``` text
18:42
PREDICTED ARRIVAL
```

Then:

``` text
08:34
TIMETABLE

+08 MIN
CURRENT VARIANCE
```

------------------------------------------------------------------------

# 31. JOURNEY TIMELINE

Use a large railway line.

Example:

``` text
BCT
●────────●────────●────────●────────●
         ST       BRC      RTM      NDLS
```

Train marker moves.

Each station:

``` text
scheduled
actual
predicted
variance
```

Completed stations: subtle filled node.

Current: animated node.

Upcoming: outlined node.

------------------------------------------------------------------------

# 32. ETA HISTORY

Create a line chart.

Show:

``` text
TIMETABLE
CURRENT DELAY
RAILSENSE PREDICTION
```

The prediction line changes as simulation changes.

Do not use generic dashboard chart styling.

Style it as a railway engineering plot.

Use: - thin lines - labels - warm paper - minimal axes - annotated
events

------------------------------------------------------------------------

# 33. PREDICTION FACTORS

Create a sophisticated visual explanation.

Example:

``` text
WHY 18:42?

Current speed          ████████████
Section history        █████████
Current delay          ███████
Congestion ahead       ███████████
Recovery potential     █████
Weather/operations     ███
```

The values are simulated.

Clearly label them as prototype/simulated where appropriate.

Do not falsely present them as actual trained-model feature importances.

------------------------------------------------------------------------

# 34. TRAINS PAGE

Make this a modern digital timetable.

Not cards.

Structure:

``` text
TRAINS

Search train
Origin
Destination
Status

------------------------------------------------
12951   RAJDHANI EXPRESS
BCT ───────────── NDLS
17:00 → 08:32
LIVE +08 MIN
------------------------------------------------
```

Rows should be dense but readable.

Hover: - route line appears - row shifts slightly - status becomes
clearer

Click: - shared transition to train detail

Use Motion shared-layout behavior where appropriate.

------------------------------------------------------------------------

# 35. STATIONS PAGE

Concept:

> A station is where journeys intersect.

Top:

Featured station.

Then:

``` text
NDLS
NEW DELHI

LIVE DEPARTURES
```

Departure board:

``` text
TIME   TRAIN    DESTINATION    PLATFORM    STATUS
```

Use railway-inspired information architecture.

Beside the board:

animated trains approaching the station.

Station nodes should have subtle active-state animations.

------------------------------------------------------------------------

# 36. ALERTS PAGE

Alerts should become an operational event timeline.

Example:

``` text
18:31
CONGESTION
VADODARA → RATLAM

12 trains affected
+4–9 min impact
```

Then:

``` text
18:27
SPEED RESTRICTION
SECTION 4B

+3 min expected impact
```

Then:

``` text
18:19
DEPARTURE DELAY
12951
SURAT
+6 min
```

Connect them with a vertical railway line.

This is much more meaningful than notification cards.

------------------------------------------------------------------------

# 37. DELAY PROPAGATION ANIMATION

This is a major opportunity.

When an event occurs:

``` text
SIGNAL DELAY
     ↓
SECTION
     ↓
TRAIN A
     ↓
STATION
     ↓
TRAIN B
     ↓
DOWNSTREAM ETA
```

Animate the impact traveling through the network.

For example:

-   event appears
-   route segment highlights
-   affected train marker changes
-   ETA shifts
-   downstream node updates

This visually demonstrates the project's value.

------------------------------------------------------------------------

# 38. OPERATIONS PAGE

Make it feel like railway control intelligence.

Not an admin panel.

Use:

``` text
OPERATIONS CONTROL

NETWORK STATUS
OPERATIONAL

SIMULATION
18:42:31
```

Then:

-   live network
-   delayed services
-   congestion
-   affected stations
-   platform impact
-   delay propagation

Use `/public/img7.jpg` as a contextual image.

Keep the data dominant.

------------------------------------------------------------------------

# 39. CONTROL ROOM IMAGE

Do not simply place `img7.jpg` in a card.

Use it as:

-   a side editorial panel
-   a contextual visual
-   a small immersive strip

Overlay something like:

``` text
NETWORK INTELLIGENCE

Every delay has a location.
Every location has a consequence.
```

Keep it subtle.

------------------------------------------------------------------------

# 40. HOME PAGE TRAIN LIST

The popular/active train list must appear significantly earlier than in
the current implementation.

Recommended:

``` text
Hero
↓
Journey Search
↓
Live Network Snapshot
↓
Active / Popular Trains
↓
How ETA Changes
↓
Editorial / Photography
↓
Capabilities
```

The user should reach useful train information quickly.

------------------------------------------------------------------------

# 41. VOICE ASSISTANT

The current voice feature should be redesigned as a secondary persistent
utility.

Desktop:

Bottom-right compact assistant.

Mobile:

Bottom action.

Possible:

``` text
ASK RAILSENSE
Where's my train?
```

Click expands.

Do not let it dominate the homepage.

Do not hide it at the bottom of a long section.

------------------------------------------------------------------------

# 42. EDITORIAL STORYTELLING

Add strong visual statements.

Example:

``` text
A timetable tells you the plan.

RailSense estimates the outcome.
```

Then:

``` text
Every delay starts somewhere.
```

Then show a railway signal photograph.

Then:

``` text
A two-minute hold.
A crowded junction.
A platform still occupied.

Small events become journey-wide delays.
```

This should feel like a product narrative, not marketing fluff.

------------------------------------------------------------------------

# 43. PHOTO + DATA COMPOSITIONS

Combine photography with actual system information.

Example:

Left: large railway photograph.

Right:

``` text
SECTION 04B

CURRENT SPEED
87 km/h

HISTORICAL
82 km/h

ETA IMPACT
−2 MIN
```

This makes the images part of the product story.

------------------------------------------------------------------------

# 44. RAILWAY PHYSICAL DETAILS

Use visual motifs carefully:

-   rail tracks
-   sleepers
-   signal poles
-   station boards
-   overhead wires
-   platform markings
-   station codes
-   railway crossing geometry
-   route diagrams

Do NOT turn the interface into a railway-themed cartoon.

Subtle references are better.

------------------------------------------------------------------------

# 45. MICRO-DETAILS

Add small details that make the interface feel engineered.

Examples:

``` text
LAST UPDATED 2.4s AGO
```

``` text
SECTION 04B
```

``` text
GPS LOCKED
```

``` text
PREDICTION REVISION
+2m
```

``` text
SIMULATION ACTIVE
```

``` text
DATA SOURCE
DEMO
```

Use monospace.

These small details create credibility.

------------------------------------------------------------------------

# 46. STATUS SYSTEM

Do not rely only on color.

Each status should have:

-   text
-   icon/shape
-   color
-   motion where appropriate

Example:

``` text
● ON TIME
△ WATCH
■ DELAYED
◆ CONGESTED
```

Use muted status colors.

------------------------------------------------------------------------

# 47. ANIMATION SYSTEM

Use a dedicated animation strategy.

Possible tools:

### GSAP

Use for: - complex timeline sequences - SVG path movement - MotionPath -
ScrollTrigger - coordinated multi-element animations

### Motion / Framer Motion

Use for: - React component transitions - layout changes - drawers -
shared transitions - hover/gesture - scroll-triggered sections

### Native CSS

Use for: - simple hover - opacity - transform - status pulse - basic
transitions

Do not use a JavaScript animation library for trivial CSS transitions.

------------------------------------------------------------------------

# 48. MOTION HIERARCHY

Use three levels.

## Level 1 --- Ambient

Very subtle.

Examples: - live clock - train movement - signal pulse - image movement

## Level 2 --- Interaction

User-triggered.

Examples: - hover - click - drawer - search - filter

## Level 3 --- Storytelling

Scroll/page transitions.

Examples: - railway line drawing - journey progression - image reveal -
prediction explanation

Do not mix all three constantly.

------------------------------------------------------------------------

# 49. SCROLL STORYTELLING

Use scroll-triggered animation selectively.

Example:

As the user scrolls into:

``` text
HOW ETA CHANGES
```

Animate:

``` text
station
↓
delay
↓
network event
↓
prediction
```

The user should visually see the prediction evolve.

Use `whileInView`, `useScroll`, GSAP ScrollTrigger, or equivalent where
appropriate.

Do not make the page feel like a theme-park animation.

------------------------------------------------------------------------

# 50. PAGE TRANSITIONS

Use subtle transitions between:

-   train list
-   train details
-   station
-   live network

If using Motion shared-element transitions, a train row can visually
transform into the train detail header.

This should feel natural.

Avoid generic fade-to-black transitions.

------------------------------------------------------------------------

# 51. HOVER DETAILS

Train rows:

-   route line extends
-   train number becomes prominent
-   arrow appears

Station nodes:

-   radius expands slightly
-   label appears
-   nearby routes highlight

Images:

-   slight zoom
-   caption appears

Buttons:

-   subtle translation
-   border/background shift

Do not use dramatic scale effects.

------------------------------------------------------------------------

# 52. TRAIN MARKER DESIGN

Create one strong RailSense train marker.

Possible concept:

A compact top-down locomotive silhouette built with SVG geometry.

Elements:

-   front
-   carriage body
-   tiny wheels
-   directional indicator

For moving SVG:

-   rotate to path direction
-   optional wheel rotation if physically represented
-   optional subtle wake/motion line at higher speeds

Do not use an emoji.

Do not use a generic map pin.

------------------------------------------------------------------------

# 53. TRAIN SMOKE

Smoke is only appropriate for:

-   heritage locomotive illustration
-   stylized train illustration
-   a specific atmospheric animation

Do NOT add smoke to modern electric locomotive photography.

If used:

-   low opacity
-   procedural/randomized subtle motion
-   blur
-   scale variation
-   upward drift
-   fade out

It should look like atmospheric steam, not cartoon smoke.

------------------------------------------------------------------------

# 54. WHEEL ANIMATION

If an illustrated train contains visible wheels:

Wheel rotation should be tied to train velocity.

Do not rotate wheels on static images.

If the train marker is too small for visible wheels, omit the animation.

The goal is realism, not decoration.

------------------------------------------------------------------------

# 55. NETWORK SIGNALS

Use railway signal states as meaningful system states.

Example:

``` text
GREEN
route clear

AMBER
watch / reduced capacity

RED
stop / disruption
```

Signal changes can trigger:

-   train slowing
-   ETA revision
-   alert
-   route state change

This makes the animation functional rather than decorative.

------------------------------------------------------------------------

# 56. REAL-TIME TICKER

A compact operational ticker can run across selected sections.

Example:

``` text
18:42:12
12951 ETA revised +2m

18:42:18
Section 04B congestion easing

18:42:24
12002 departed platform 6
```

Use restrained horizontal movement.

Do not make it look like a stock-market ticker.

------------------------------------------------------------------------

# 57. LOADING STATES

Design real loading states.

For example:

Train search:

``` text
SCANNING ROUTE
───────────────●──────
```

Station:

``` text
READING DEPARTURE BOARD...
```

Live network:

``` text
SYNCING TRAIN POSITIONS...
```

These should reinforce the railway/system concept.

------------------------------------------------------------------------

# 58. EMPTY STATES

Do not use generic:

> No results found.

Instead:

``` text
NO SERVICES MATCH THIS ROUTE

Try another station pair.
```

Or:

``` text
NO ACTIVE ALERTS

The network is quiet here.
```

------------------------------------------------------------------------

# 59. ERROR STATES

Errors should remain calm and useful.

Example:

``` text
POSITION DATA UNAVAILABLE

Last known position:
SURAT
18:37 IST

Prediction remains available.
```

This is more realistic than generic error messages.

------------------------------------------------------------------------

# 60. DARK MODE

If the existing product has theme switching, redesign dark mode too.

Do not simply invert colors.

Dark mode palette:

``` text
background:
#141A17

surface:
#1D2521

brown:
#80614D

cream:
#E9E0D1

green:
#4F896E

brass:
#C3A46B

red:
#D16A59
```

Dark mode should feel like a railway control room at night.

------------------------------------------------------------------------

# 61. RESPONSIVE DESIGN

Do not merely shrink desktop.

Recompose.

### Mobile Home

Order:

1.  brand/navigation
2.  hero
3.  journey search
4.  live train
5.  active trains
6.  prediction story
7.  photography
8.  assistant

### Mobile Live Network

Use:

-   full-width network
-   bottom sheet for selected train
-   horizontal route scrolling where required

### Mobile train detail

Use: - prediction first - journey second - factors third - history
fourth

### Mobile tables

Convert to: - compact rows - horizontal scroll - stacked details

------------------------------------------------------------------------

# 62. ACCESSIBILITY

Implement:

-   semantic HTML
-   keyboard navigation
-   visible focus states
-   accessible labels
-   accessible drawers
-   accessible tables
-   proper contrast
-   reduced motion
-   non-color status communication

Respect:

``` css
@media (prefers-reduced-motion: reduce)
```

When enabled:

-   stop train animation
-   stop decorative motion
-   keep state updates
-   keep all information available

------------------------------------------------------------------------

# 63. PERFORMANCE

Multiple animated trains can become expensive.

Use:

-   SVG transforms
-   requestAnimationFrame only where necessary
-   memoized components
-   centralized simulation state
-   efficient route geometry
-   lazy-loaded images
-   optimized image dimensions
-   minimal DOM
-   no unnecessary rerenders

Avoid rerendering the entire application every animation frame.

------------------------------------------------------------------------

# 64. SIMULATION PERFORMANCE ARCHITECTURE

Prefer:

``` text
simulation clock
      ↓
simulation engine
      ↓
derived train positions
      ↓
visual components
```

Not:

``` text
every train component
      ↓
independent setInterval
      ↓
random state
```

One simulation.

Many consumers.

------------------------------------------------------------------------

# 65. DATA REALISM

Use realistic-looking prototype values.

Trains should have:

-   plausible routes
-   plausible station sequences
-   realistic station codes
-   realistic train numbers
-   realistic times
-   realistic delays
-   realistic speeds

But do not imply that fictional positions are actual live Indian
Railways data.

Use:

``` text
DEMO DATA
SIMULATION
```

where appropriate.

------------------------------------------------------------------------

# 66. MOCK TRAIN SCENARIOS

Create several clearly different scenarios.

### Scenario A

Train on time.

### Scenario B

Train mildly delayed.

### Scenario C

Train heavily delayed.

### Scenario D

Train recovering delay.

### Scenario E

Congestion ahead.

### Scenario F

Signal restriction.

### Scenario G

Station dwell longer than expected.

### Scenario H

Downstream delay propagation.

These scenarios should drive the visual state.

------------------------------------------------------------------------

# 67. ETA BEHAVIOR

ETA should not always increase.

This is important.

Example:

``` text
18:42
```

then congestion:

``` text
18:46
```

then congestion clears:

``` text
18:44
```

then train recovers:

``` text
18:43
```

This demonstrates why dynamic prediction is valuable.

------------------------------------------------------------------------

# 68. PRODUCT NARRATIVE

The entire website should tell this story:

``` text
A timetable describes the plan.

A train begins moving.

Reality changes.

RailSense observes it.

The network changes.

RailSense updates the remaining journey.

The ETA changes.

The passenger sees the new expectation.
```

This should be visible through design and motion, not only text.

------------------------------------------------------------------------

# 69. HOME PAGE SECTION ORDER --- FINAL RECOMMENDATION

Use this as the default structure unless UX testing reveals a better
arrangement:

``` text
1. Navigation

2. Hero
   ├── headline
   ├── journey search
   └── live train photography + ETA

3. Live network snapshot
   └── multiple animated trains

4. Active / popular trains
   └── timetable-style list

5. How the ETA moves
   └── animated journey

6. Why the forecast changes
   └── signal / congestion / delay propagation

7. Editorial railway photography
   └── physical railway context

8. RailSense capabilities
   └── live position
   └── dynamic ETA
   └── network effects
   └── historical patterns

9. Final CTA

10. Footer

11. Persistent Ask RailSense assistant
```

This is intentionally different from the existing page.

------------------------------------------------------------------------

# 70. NAVIGATION PRIORITY

Navigation should emphasize:

``` text
LIVE NETWORK
TRAINS
STATIONS
ALERTS
```

Home remains the entry point.

About is secondary.

On desktop, show simulation status.

Example:

``` text
● SIMULATION ACTIVE
18:42:31 IST
```

Use monospace.

------------------------------------------------------------------------

# 71. FOOTER

Do not make a giant generic SaaS footer.

Use a railway-line separator.

Example:

``` text
══════════════════════════════════════════════════

RAILSENSE

Dynamic ETA for coaching trains.

LIVE NETWORK
TRAINS
STATIONS
ALERTS

DATA
SIMULATION
METHODOLOGY

© RailSense
```

Keep it restrained.

------------------------------------------------------------------------

# 72. COMPONENT ARCHITECTURE

Adapt to the existing framework, but aim for reusable primitives.

Potential:

``` text
components/
  brand/
  navigation/
  railway/
    RailwayTrack
    RailwayRoute
    StationNode
    TrainMarker
    Signal
    CongestionSegment
    JourneyTimeline

  trains/
    TrainRow
    TrainList
    TrainDrawer
    TrainStatus

  stations/
    StationHeader
    DepartureBoard
    StationTimeline

  prediction/
    EtaDisplay
    PredictionChart
    PredictionFactors
    PredictionRevision
    ConfidenceIndicator

  simulation/
    SimulationClock
    SimulationControls
    SimulationProvider

  editorial/
    ImagePanel
    EditorialSplit
    ImageReveal

  common/
    SectionHeader
    Status
    DataLine
    TechnicalLabel
```

Do not duplicate UI logic across pages.

------------------------------------------------------------------------

# 73. DESIGN TOKENS

Centralize:

-   color
-   typography
-   spacing
-   border
-   radius
-   shadows
-   motion
-   z-index

Do not scatter random values throughout the codebase.

------------------------------------------------------------------------

# 74. BORDERS AND CORNERS

Avoid giant rounded cards.

Use:

-   square/near-square panels
-   small radii
-   thin borders
-   strong dividers

Rounded corners should be purposeful.

The railway aesthetic should feel engineered, not bubbly.

------------------------------------------------------------------------

# 75. SHADOWS

Use very little shadow.

Prefer:

-   contrast
-   borders
-   background shifts
-   typography
-   spacing

Do not make everything float.

------------------------------------------------------------------------

# 76. ICONS

Use one coherent icon system.

Do not mix:

-   emoji
-   random SVGs
-   random icon libraries
-   inconsistent stroke widths

Keep iconography subtle.

Railway-specific SVG symbols can be custom-built where useful.

------------------------------------------------------------------------

# 77. SEARCH UX

Search should feel immediate.

When the user enters a train:

``` text
12951
```

Show suggestions:

``` text
12951
Rajdhani Express
Mumbai Central → New Delhi
```

When selecting:

Transition into train details.

When entering station:

``` text
NDLS
New Delhi
```

Use station code prominently.

------------------------------------------------------------------------

# 78. SEARCH RESULT ANIMATION

Use:

-   short reveal
-   row stagger
-   shared layout where appropriate

Do not make results fly around.

------------------------------------------------------------------------

# 79. TRAIN LIST VISUAL PRIORITY

Each row should visually prioritize:

1.  train number
2.  train/service
3.  route
4.  live status
5.  ETA

Not:

1.  decorative icon
2.  giant card
3.  secondary information

------------------------------------------------------------------------

# 80. STATION BOARD VISUAL PRIORITY

Prioritize:

1.  train
2.  destination
3.  expected time
4.  platform
5.  status

The user's eye should find the ETA quickly.

------------------------------------------------------------------------

# 81. OPERATIONS VISUAL PRIORITY

Prioritize:

1.  network state
2.  disruptions
3.  affected trains
4.  affected sections
5.  downstream impact

Do not bury important operational events below decorative charts.

------------------------------------------------------------------------

# 82. ALERT PRIORITY

Use severity hierarchy.

Critical: immediately visible.

Warning: visible but not dominant.

Information: secondary.

Do not make all alerts equally visually loud.

------------------------------------------------------------------------

# 83. VISUAL RHYTHM

Alternate between:

-   dense data
-   open editorial space
-   image
-   visualization
-   dense data

Do not create 12 consecutive card sections.

------------------------------------------------------------------------

# 84. SECTION WIDTHS

Do not put everything inside the same 1200px centered container.

Use multiple widths:

-   full-width network
-   medium content
-   narrow editorial text
-   edge-to-edge photography
-   wide timetable
-   split layouts

This will make the site feel designed rather than assembled.

------------------------------------------------------------------------

# 85. BACKGROUND DETAILS

Use subtle visual texture.

Possible:

-   very faint railway-grid pattern
-   fine horizontal lines
-   station-code micro labels
-   track lines
-   paper texture

Keep opacity low.

Do not use a visible grid behind every section.

------------------------------------------------------------------------

# 86. HERO BACKGROUND

The hero can contain a very subtle railway infrastructure pattern.

But the actual image should dominate.

Do not use a generic CSS gradient.

------------------------------------------------------------------------

# 87. COLOR APPLICATION RULE

Do not make every important element green.

Use:

Green: active / live

Brown: brand / structural

Brass: highlight

Red: delay

Amber: warning

Cream: surface

Dark green: network visualization

This produces a richer palette.

------------------------------------------------------------------------

# 88. ANIMATION QUALITY BAR

Before accepting an animation ask:

-   Does it communicate something?
-   Is it physically plausible?
-   Is it smooth?
-   Does it help hierarchy?
-   Is it distracting?
-   Does it work on mobile?
-   Does it respect reduced motion?
-   Does it perform well?

If the answer is no, remove the animation.

------------------------------------------------------------------------

# 89. DO NOT OVER-ANIMATE

The target is not:

> "Look how many animations we added."

The target is:

> "The website itself behaves like a railway."

That means the most important motion is:

-   train movement
-   route movement
-   ETA changes
-   station states
-   signal states
-   delay propagation

------------------------------------------------------------------------

# 90. FINAL DESIGN PERSONALITY

RailSense should feel:

-   Indian
-   technical
-   warm
-   engineered
-   editorial
-   calm
-   trustworthy
-   dynamic
-   operational

It should NOT feel:

-   futuristic
-   childish
-   corporate SaaS
-   generic AI
-   overly minimal
-   overly decorative

------------------------------------------------------------------------

# 91. FINAL ANTI-AI-SLOP AUDIT

After implementation, inspect every page and ask:

### Composition

Is the layout predictable?

### Cards

Are there unnecessary cards?

### Color

Is the palette visibly richer?

### Typography

Does the hierarchy feel intentional?

### Images

Do photographs feel art-directed?

### Motion

Do trains and system states actually move?

### Data

Can the user find ETA immediately?

### Hierarchy

Does the most important information appear first?

### Product identity

Would this look like a railway product even if the logo were removed?

### Originality

Does this look like RailSense rather than a generated template?

If not, redesign the weak areas.

Do not merely polish them.

------------------------------------------------------------------------

# 92. FINAL QA

Verify:

## Functionality

-   search works
-   station search works
-   train search works
-   routes work
-   train detail works
-   station detail works
-   alerts work
-   navigation works
-   simulation works

## Animation

-   multiple trains move
-   trains stop at stations
-   ETA updates
-   alerts update
-   congestion appears
-   signals change where applicable
-   drawers animate
-   page sections reveal
-   reduced motion works

## Responsive

Test:

``` text
1440px
1280px
1024px
768px
430px
390px
```

## Accessibility

-   keyboard
-   focus
-   contrast
-   screen-reader labels
-   reduced motion

## Performance

-   no excessive rerenders
-   no animation jank
-   images optimized
-   SVG efficient

------------------------------------------------------------------------

# 93. EXECUTION ORDER

Do not attempt to redesign the entire site in one uncontrolled pass.

Execute in this order:

### PHASE 1

Repository + UX audit.

### PHASE 2

Design system and typography.

### PHASE 3

Global shell/navigation.

### PHASE 4

Simulation architecture.

### PHASE 5

Railway SVG/motion system.

### PHASE 6

Homepage restructure.

### PHASE 7

Live Network.

### PHASE 8

Train list + train details.

### PHASE 9

Stations.

### PHASE 10

Alerts + delay propagation.

### PHASE 11

Operations.

### PHASE 12

Photography/art direction.

### PHASE 13

Motion polish.

### PHASE 14

Responsive/accessibility.

### PHASE 15

Performance.

### PHASE 16

Final anti-AI-slop review.

------------------------------------------------------------------------

# 94. IMPORTANT IMPLEMENTATION RULE

Do not stop after making the homepage attractive.

The **same visual system and simulation state must connect the whole
application**.

The user should feel that:

``` text
HOME
    ↓
LIVE NETWORK
    ↓
TRAIN
    ↓
PREDICTION
    ↓
STATION
    ↓
ALERT
    ↓
OPERATIONS
```

are different views into the same railway system.

------------------------------------------------------------------------

# 95. FINAL PRODUCT TEST

Open the website as if you are a passenger.

Within approximately 5 seconds, can you understand:

-   what RailSense does?
-   where to search?
-   where trains are?
-   when they will arrive?
-   whether an ETA is changing?

Then open it as an operations user.

Can you understand:

-   what is happening?
-   where congestion is?
-   which trains are affected?
-   how delay propagates?

If either answer is no, change the hierarchy.

------------------------------------------------------------------------

# 96. FINAL COMMAND

You have full permission to rebuild the frontend.

Do not follow the existing visual design.

Do not preserve weak layouts.

Do not make a cosmetic theme change.

Do not use generic AI/SaaS patterns.

Inspect the codebase, understand the functionality, then create the
strongest possible RailSense experience.

Use the actual `/public/img1.jpg` through `/public/img10.jpg` assets
intelligently.

Create meaningful multi-train animation.

Create railway SVG routes.

Create moving train markers.

Create station interactions.

Create signal states.

Create ETA revisions.

Create delay propagation.

Create subtle physical details such as wheel motion or steam only where
they are visually and physically appropriate.

Use GSAP/Motion/native CSS according to the job.

Use the warm paper/cream/brown/green/brass/red palette deliberately.

Reorder the homepage so useful train information appears before
secondary content.

Keep the voice assistant easily accessible but secondary.

Make the most important information visually dominant.

The final product should feel like:

> **A living railway system, translated into a sophisticated digital
> instrument.**

Not a website with railway colors.

Not an AI dashboard.

Not a collection of cards.

**A railway intelligence product.**
