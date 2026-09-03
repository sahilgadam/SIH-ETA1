# RailSense --- Complete Website Redesign Master Prompt

## Purpose

This file is the master instruction set for a complete visual and UX
restructuring of the existing **RailSense** prototype.

The current application already has useful functionality, but the visual
design is too generic, card-heavy, predictable, and AI-generated.

**You have full permission to restructure, rewrite, replace, refactor,
move, delete, and rebuild frontend code wherever necessary.**

Do not preserve the current visual structure merely because it exists.

Preserve the useful product functionality and mock-data behavior, but
rebuild the presentation, information architecture, components,
animations, responsive behavior, and visual system where necessary.

The final product should look like a serious, distinctive railway
technology product rather than a generated SaaS template.

------------------------------------------------------------------------

# 1. AVAILABLE SKILLS

Use the following Claude Code skills when available. Do not assume they
are installed; inspect the environment first.

### Primary

-   `frontend-design`
-   `ui-ux-pro-max`

### Supporting

-   `feature-dev`
-   `website`

Use the skill whose purpose best matches each task.

If a skill is unavailable, perform the task using your own strongest
frontend/design reasoning rather than stopping.

------------------------------------------------------------------------

# 2. FULL PERMISSION

You have full permission to:

-   restructure the frontend
-   reorganize directories
-   replace components
-   create new components
-   remove obsolete components
-   refactor state management
-   replace styling approaches where practical
-   introduce animation libraries if appropriate
-   introduce SVG-based visualizations
-   redesign navigation
-   redesign page layouts
-   redesign forms
-   redesign tables
-   redesign cards
-   redesign train markers
-   redesign station visualization
-   redesign the simulation system
-   create new reusable design primitives
-   improve responsive behavior
-   improve accessibility
-   improve performance
-   rewrite placeholder copy
-   alter the information hierarchy
-   change the visual identity completely

Do NOT destroy useful existing functionality just to make the UI
different.

Before deleting functionality, understand what it does and reproduce the
behavior in the new architecture.

------------------------------------------------------------------------

# 3. FIRST: INSPECT THE PROJECT

Before writing code:

1.  Inspect the complete project structure.
2.  Identify framework and build system.
3.  Inspect package.json and installed dependencies.
4.  Inspect routes.
5.  Inspect current pages.
6.  Inspect existing components.
7.  Inspect mock data.
8.  Inspect state management.
9.  Inspect animation code.
10. Inspect public assets.
11. Run the application.
12. Identify the current user flows.

Do not guess the technology stack.

Do not immediately rewrite everything.

First understand what exists.

Then execute the redesign.

------------------------------------------------------------------------

# 4. EXISTING PRODUCT

RailSense is a prototype for a data-driven railway ETA prediction
platform.

Core concept:

> RailSense predicts when a train is actually expected to arrive based
> on how it is running now and what is happening ahead on the route.

The prototype is based on mock/simulated data.

The application currently contains functionality around:

-   Home
-   Live Status
-   Trains
-   Stations
-   Alerts
-   About
-   train search
-   station search
-   route search
-   popular trains
-   station departure board
-   train status
-   ETA information
-   train details

All useful functionality must remain accessible.

------------------------------------------------------------------------

# 5. DESIGN RESEARCH / REFERENCE DIRECTION

Use web research only as inspiration, not as something to copy.

Relevant reference directions include:

-   Rail Europe for clear journey/search-oriented UX and travel
    discovery.
-   SNCF Connect for combining data, personalization, UX, and motion
    into a transportation experience.
-   Indian railway UX research for simplifying dense railway
    information.
-   Contemporary railway tracking products for live movement and route
    visualization.
-   Railway operational interfaces for information density and status
    communication.

The design should learn from these principles without copying their
branding or layouts.

Research references: - Rail Europe: https://www.raileurope.com/ - SNCF
Connect & Tech: https://www.sncf-connect-tech.fr/ - UX4G Indian Railways
case study:
https://www.ux4g.gov.in/aboutus/case-studies/ux4g-indian-railways.php -
Indian railway tracking interaction reference:
https://hivicky.in/traintracking

Important: Do NOT reproduce another site's exact UI. Extract principles
only.

------------------------------------------------------------------------

# 6. CORE VISUAL CONCEPT

The new visual identity should be:

## INDIAN RAILWAY HERITAGE

-   ## MODERN DATA INSTRUMENT

-   ## EDITORIAL PHOTOGRAPHY

-   ## LIVE MOVEMENT

The product should feel like a digital railway instrument designed by
people who understand:

-   railway tracks
-   timetables
-   station boards
-   signals
-   train movement
-   operational delays
-   passenger uncertainty
-   network effects

The physical railway should influence the visual language.

Examples:

-   railway tracks → route/navigation motifs
-   station nodes → data nodes
-   signals → operational states
-   timetable → structured data tables
-   train movement → primary animation
-   railway photography → emotional/editorial layer
-   delay propagation → visual flow
-   station departure board → information architecture

This is the central design idea.

------------------------------------------------------------------------

# 7. ABSOLUTELY AVOID AI-SLOP

The current design feels too generated.

Do NOT use:

-   generic SaaS hero
-   giant centered headline + two cards
-   endless rounded rectangles
-   excessive pill buttons
-   excessive green cards
-   purple/blue AI gradients
-   glassmorphism
-   neon glow
-   floating translucent cards
-   generic 3-column feature cards
-   meaningless dashboard KPIs
-   excessive icon grids
-   random decorative blobs
-   excessive shadows
-   giant border-radius everywhere
-   fake futuristic graphics
-   cartoon train illustrations
-   emoji as interface elements
-   generic AI copy
-   unnecessary animations
-   excessive whitespace without purpose

Do not simply swap the current green color for another trendy color.

Change the underlying visual language.

------------------------------------------------------------------------

# 8. NEW COLOR PALETTE

Do NOT reuse the current green-dominant palette.

Build the interface around a warm railway/editorial palette.

Suggested tokens:

``` css
--paper: #F3EEE5;
--paper-deep: #E7DED0;
--sand: #D5C5B1;
--stone: #B8A794;

--ink: #20241F;
--ink-soft: #4A4942;
--brown: #51372A;
--brown-deep: #34231C;

--rail-green: #245743;
--rail-green-dark: #173D30;

--signal-red: #A64B3C;
--signal-amber: #B8793D;

--brass: #A88952;

--line: rgba(52, 35, 28, 0.16);
--line-strong: rgba(52, 35, 28, 0.28);
```

Do not use all colors equally.

Dominant: paper / cream / ink / brown

Secondary: rail green / brass

Status: red / amber / muted green

The overall site should look warm and tactile.

------------------------------------------------------------------------

# 9. TYPOGRAPHY

Do not default to Inter.

Use a distinctive editorial + technical pairing.

Preferred:

Display: - Instrument Serif - Fraunces - DM Serif Display

UI/body: - Manrope - Geist - General Sans

Technical: - IBM Plex Mono - JetBrains Mono

Use serif/display typography selectively for major headlines.

Use sans-serif for usability.

Use monospace for:

-   train numbers
-   station codes
-   timestamps
-   coordinates
-   ETA values
-   operational status
-   simulation time

Typography should create hierarchy without excessive decoration.

------------------------------------------------------------------------

# 10. LAYOUT LANGUAGE

Move away from:

> everything inside centered white cards.

Use:

-   asymmetric compositions
-   full-width sections
-   editorial image blocks
-   thin horizontal rules
-   vertical railway lines
-   overlapping content
-   large typography
-   dense timetable sections
-   narrow technical columns
-   large photography
-   controlled whitespace
-   strong left alignment
-   occasional edge-to-edge visual sections

Not every element needs to be a card.

------------------------------------------------------------------------

# 11. IMAGE ASSETS

The following images already exist in `/public`:

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

Inspect the actual images before assigning them.

Expected roles:

``` text
img1.jpg  → hero / flagship train
img2.jpg  → station / passenger environment
img3.jpg  → train journey / landscape
img4.jpg  → tracks / infrastructure
img5.jpg  → station at dusk / closing editorial section
img6.jpg  → railway signal / alerts
img7.jpg  → railway control room / operations
img8.jpg  → train interior / passenger experience
img9.jpg  → platform / passengers
img10.jpg → train bridge / landscape / journey
```

These are guidance, not rigid assignments.

Use the images where they create the strongest composition.

IMPORTANT:

Do not use all ten images simply because they exist.

Use approximately 4--7 images across the main experience.

Avoid repetitive image cards.

Prefer:

-   large editorial crops
-   image + typography compositions
-   asymmetric image placement
-   subtle image reveal
-   subtle image zoom
-   occasional image overlap
-   captions where useful

Do not put every image into a rounded card.

------------------------------------------------------------------------

# 12. IMAGE USAGE RULE

Photography represents the physical railway.

UI graphics represent the digital railway.

Therefore:

REAL PHOTOGRAPHY: - hero - editorial sections - passenger context -
station context - operations context

GRAPHICS/SVG: - railway map - train movement - station nodes - ETA
visualization - delay propagation - prediction charts

Do NOT use photographs as the actual map or train markers.

------------------------------------------------------------------------

# 13. PRODUCT STRUCTURE

Rebuild the website around these primary experiences:

1.  Home
2.  Live Network
3.  Trains
4.  Stations
5.  Alerts
6.  Train Details
7.  Operations
8.  About

Navigation should prioritize the core user tasks.

Suggested navigation:

RailSense

Live Network Trains Stations Alerts

Secondary: About

Right: Simulation status Theme/language if already supported

------------------------------------------------------------------------

# 14. NAVIGATION REDESIGN

The navigation should be compact and editorial.

Avoid pill-heavy navigation.

Use:

-   strong logo
-   plain text navigation
-   active underline or subtle background
-   thin bottom border
-   compact system status

Add a small technical status:

``` text
● SIMULATION ACTIVE
18:32:41 IST
```

Use monospace.

On scroll: - reduce height slightly - subtle warm translucent surface -
retain readability

Mobile: - compact menu - accessible drawer - clear active state

------------------------------------------------------------------------

# 15. HOMEPAGE

Completely redesign the Home page.

Do NOT preserve the current:

> heading → search card → station card → features → popular trains

structure.

Instead:

## HERO

Asymmetric editorial composition.

Left:

Eyebrow: REAL-TIME RAILWAY INTELLIGENCE

Headline:

> Know when the railway is moving. Not just when the timetable says it
> should.

Short explanation.

Journey finder.

Right:

Large `/public/img1.jpg`.

Overlay a compact operational data instrument:

``` text
12951
RAJDHANI EXPRESS

CURRENT
SURAT

NEXT
VADODARA

ETA
18:42

+08 MIN
```

The overlay should feel like a railway instrument.

Not a SaaS card.

## JOURNEY FINDER

Preserve current functionality:

-   From station
-   To station
-   Date
-   Find trains
-   train number/name search

Make it resemble a refined timetable/control interface.

Use station codes prominently.

## LIVE STRIP

Full-width horizontal operational strip:

``` text
NETWORK STATUS
18:32:41

TRAINS RUNNING
...

DELAYED
...

CONGESTED SECTIONS
...

PREDICTIONS UPDATED
...
```

Do not use giant KPI cards.

## HOW RAILSENSE SEES A JOURNEY

Create an animated railway line:

Mumbai Central ──────●────── Surat ──────●────── Vadodara ──────●──────
Ratlam ──────●────── New Delhi

Train marker travels through it.

Show scheduled vs predicted time.

## EDITORIAL SECTION

Use `img2.jpg` or another appropriate station image.

Headline:

> Every delay starts somewhere.

Explain delay propagation.

## CAPABILITY SECTIONS

Use editorial rows instead of generic cards:

LIVE POSITION DYNAMIC ETA NETWORK EFFECT HISTORICAL PATTERN

## POPULAR TRAINS

Retain functionality.

Use timetable rows rather than cards.

------------------------------------------------------------------------

# 16. LIVE NETWORK

This is the visual centerpiece.

Build a large railway network visualization.

Do not create a generic Google Maps clone.

Use SVG.

Visual language:

-   cream/paper background
-   brown railway lines
-   station nodes
-   moving train markers
-   route labels
-   congestion indicators

Show 8--12 trains simultaneously.

Each train has:

``` text
number
name
route
position
speed
status
delay
next station
ETA
```

Statuses:

-   ON TIME
-   MINOR DELAY
-   DELAYED
-   STOPPED
-   CONGESTED

Do not rely on color alone.

Use labels/shapes/icons.

## Train movement

Trains must move smoothly along SVG paths.

Never teleport.

When approaching a station:

1.  slow down
2.  stop
3.  update state
4.  pause
5.  continue

Different trains should have different speeds and routes.

## Train interaction

Hover: small tooltip.

Click: open train detail drawer.

Drawer:

``` text
12951
RAJDHANI EXPRESS

MUMBAI CENTRAL → NEW DELHI

CURRENT
SURAT

NEXT
VADODARA

SPEED
...

DELAY
+08 MIN

ETA
18:42

CONFIDENCE
94%
```

Then:

``` text
WHY THIS ETA?

Current running speed
Historical section
Current delay
Downstream congestion
Expected recovery
```

Use simulated explanatory values.

Clearly avoid pretending these values are actual model outputs.

------------------------------------------------------------------------

# 17. SHARED SIMULATION ENGINE

This is critical.

Do not generate unrelated random values inside each component.

Create a central simulation state.

Suggested structure:

``` text
data/
  trains
  stations
  routes
  events
  simulation

components/
  RailwayTrack
  StationNode
  TrainMarker
  RoutePath
  JourneyTimeline
  SimulationControls
  TrainDrawer
```

Simulation state:

``` text
currentTime
trains
stations
routes
events
```

The same simulation must power:

-   Home
-   Live Network
-   Train Details
-   Operations
-   Alerts

When simulation time advances:

-   train positions change
-   station states change
-   delays change
-   ETA changes
-   alerts update
-   operations data updates

The entire application should feel like one living system.

------------------------------------------------------------------------

# 18. SIMULATION CONTROLS

Add:

``` text
PLAY
PAUSE
1×
2×
5×
```

Also show:

``` text
SIMULATED TIME
18:32:41 IST
```

Make controls compact.

Do not make them giant buttons.

The simulation should be deterministic enough for a demo.

Avoid random behavior that changes unpredictably on every render.

------------------------------------------------------------------------

# 19. TRAIN ANIMATION SYSTEM

Create reusable:

``` text
RailwayTrack
RoutePath
StationNode
TrainMarker
JourneyTimeline
```

Use SVG paths.

Use transforms.

Avoid layout-based animation.

Multiple trains should move simultaneously.

Different:

-   speed
-   direction
-   route
-   status

Train markers should be geometric and minimal.

Do not use:

-   emojis
-   cartoon locomotives
-   generic blue map pins

The train marker is one of RailSense's signature visual elements.

------------------------------------------------------------------------

# 20. TRAINS PAGE

Turn the train list into a modern digital railway timetable.

Header:

``` text
TRAINS

Find a service, then follow how it is actually running.
```

Search: train number/name

Filters: origin destination status train type

Main list:

``` text
12951
RAJDHANI EXPRESS

BCT ───────────── NDLS

17:00
DEPARTURE

08:32
ARRIVAL

15h 32m

LIVE
+08 MIN
```

Use dense rows.

On hover: - subtle horizontal movement - railway-line indicator appears

Click: Train Details.

Optional featured train visual: Use `img3.jpg`.

------------------------------------------------------------------------

# 21. TRAIN DETAILS

This page must visibly demonstrate the ETA prediction concept.

Primary:

``` text
12951
RAJDHANI EXPRESS

Mumbai Central → New Delhi

18:42
EXPECTED ARRIVAL

Scheduled
18:34

Difference
+08 MIN
```

Do not put everything into KPI cards.

Create a large journey timeline.

Example:

``` text
Mumbai Central
✓ Departed

Surat
✓ +06m

Vadodara
● Approaching

Ratlam
○ Upcoming

Kota
○ Upcoming

New Delhi
○ Destination
```

Train marker moves along timeline.

## Prediction chart

Compare:

-   timetable ETA
-   current-delay estimate
-   RailSense prediction

## Prediction factors

Show:

``` text
Current running speed
Historical sectional time
Current accumulated delay
Downstream congestion
Expected recovery
Weather/operations
```

Use horizontal influence bars.

Do not claim they are genuine model feature importances unless generated
by an actual model.

## Confidence

Example:

``` text
94%
HIGH CONFIDENCE
```

Use explanatory copy.

## Upcoming stations

Timetable-style table:

Station Scheduled Predicted Variance Confidence

------------------------------------------------------------------------

# 22. STATIONS PAGE

Concept:

> A station is where journeys intersect.

Featured station section.

Use appropriate station photograph.

Example:

``` text
NEW DELHI
NDLS

LIVE DEPARTURES
```

Departure board:

``` text
TIME
TRAIN
DESTINATION
PLATFORM
STATUS
```

Use a modern interpretation of a railway departure board.

Do not imitate an LED screen.

Beside it: vertical railway line.

Train markers approach station node.

Station search remains easy to access.

Popular station codes:

``` text
NDLS
BCT
HWH
MAS
SBC
```

------------------------------------------------------------------------

# 23. ALERTS PAGE

Alerts should feel like operational events.

Not notification cards.

Create a vertical railway event timeline.

Example:

``` text
18:31
CONGESTION

VADODARA → RATLAM

12 trains affected

+4–9 min expected impact
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

Visual chain:

``` text
EVENT
↓
SECTION
↓
TRAIN
↓
ETA IMPACT
```

Use `/public/img6.jpg` in a signal/operations editorial section.

------------------------------------------------------------------------

# 24. OPERATIONS PAGE

This is the control-room experience.

Header:

``` text
OPERATIONS CONTROL

NETWORK
OPERATIONAL

SIMULATION
18:34:12
```

Information-dense but elegant.

Main:

-   network visualization
-   delayed trains
-   congested sections
-   affected stations

Do not use generic colorful KPI cards.

Use typographic data panels.

## Delay propagation

Show:

``` text
TRAIN 12951
+6 MIN

↓
SURAT DEPARTURE

↓
VADODARA CONGESTION

↓
TRAIN 12002
+3 MIN IMPACT

↓
PLATFORM OCCUPANCY

↓
DOWNSTREAM RISK
```

This is one of the key product stories.

## Operations tables

Include:

-   most delayed trains
-   congested sections
-   platform impact
-   affected stations

Use `/public/img7.jpg` as a restrained editorial control-room image.

------------------------------------------------------------------------

# 25. ABOUT PAGE

Do not make About a generic company page.

Explain the system visually.

Possible sections:

``` text
THE PROBLEM
Why schedule-only ETA breaks down.

THE IDEA
Predict remaining journey time.

THE SIGNALS
GPS
speed
sectional history
delay
congestion
operations

THE PREDICTION
Current state → model → ETA

THE LOOP
observe → predict → update → observe
```

Use one strong railway photograph such as `img10.jpg`.

------------------------------------------------------------------------

# 26. MOTION DESIGN

Use animation deliberately.

Every animation must communicate:

-   movement
-   hierarchy
-   state
-   navigation
-   system activity

## Page entrance

Use restrained staggered reveal.

Headline: line-by-line.

Image: clip/reveal.

Data: small fade/translate.

Do not animate everything.

## Railway route

When entering viewport:

1.  track draws
2.  stations appear
3.  train marker begins moving

## Train

Use smooth interpolation.

No teleportation.

## Station arrival

Train slows. Stops. State changes. ETA changes. Continues.

## Alerts

New events appear through the timeline.

Do not make alerts pop up randomly.

## Images

Subtle reveal and very subtle hover zoom.

## Navigation

Smooth route transition.

## Reduced motion

Respect:

``` css
prefers-reduced-motion
```

When reduced motion is enabled: - stop train animation - show static
positions - retain state updates - preserve usability

------------------------------------------------------------------------

# 27. MICROINTERACTIONS

Use:

-   subtle hover movement
-   focus states
-   row highlight
-   train marker highlight
-   station node highlight
-   image zoom
-   button press feedback
-   drawer transitions
-   search result reveal

Avoid:

-   bouncing
-   shaking
-   cursor trails
-   particle effects
-   glowing borders
-   excessive parallax
-   decorative animation

------------------------------------------------------------------------

# 28. COPY STYLE

The copy should sound like a serious product.

Avoid generic AI phrases such as:

-   "Harness the power of AI"
-   "Unlock intelligent insights"
-   "Revolutionize your journey"
-   "Next-generation railway intelligence"

Prefer:

-   "See where the train is."
-   "Know when it is expected."
-   "Understand what is changing the ETA."
-   "Follow the journey as conditions change."
-   "A timetable tells you the plan. RailSense estimates the outcome."

The language should be concise, operational, and human.

------------------------------------------------------------------------

# 29. RESPONSIVE DESIGN

Desktop is the primary demo environment, but mobile must work properly.

At mobile widths:

-   navigation becomes drawer
-   hero becomes stacked
-   image remains prominent
-   journey finder remains easy to use
-   railway visualization becomes scrollable or simplified
-   train list becomes compact
-   train detail becomes bottom sheet/drawer
-   operations tables become horizontally scrollable or reorganized
-   alerts remain readable

Do not merely shrink desktop layouts.

Recompose them.

------------------------------------------------------------------------

# 30. ACCESSIBILITY

Implement:

-   semantic HTML
-   labels
-   keyboard navigation
-   visible focus states
-   sufficient contrast
-   accessible buttons
-   accessible drawers
-   accessible tables
-   aria labels where appropriate
-   reduced motion

Do not communicate status using color alone.

------------------------------------------------------------------------

# 31. PERFORMANCE

Because multiple trains will animate:

-   use SVG efficiently
-   use transform-based movement
-   avoid unnecessary React re-renders
-   centralize simulation state
-   memoize expensive visual components where useful
-   avoid recreating route geometry every frame
-   use requestAnimationFrame only where appropriate
-   lazy-load below-fold photography
-   use responsive image sizing
-   avoid excessive DOM nodes

Do not optimize prematurely, but do not build an animation architecture
that causes the whole page to rerender every frame.

------------------------------------------------------------------------

# 32. COMPONENT ARCHITECTURE

Create reusable components instead of page-specific duplicates.

Potential structure:

``` text
components/
  brand/
  navigation/
  railway/
    RailwayTrack
    RoutePath
    StationNode
    TrainMarker
    JourneyTimeline
  train/
    TrainRow
    TrainCard
    TrainDrawer
    TrainStatus
  station/
    StationRow
    DepartureBoard
  prediction/
    PredictionChart
    PredictionFactors
    ConfidenceIndicator
  simulation/
    SimulationControls
    SimulationClock
  common/
    SectionHeader
    StatusBadge
    MetricLine
    ImagePanel
```

Adapt this to the actual framework.

Do not blindly create folders if the existing architecture has a better
pattern.

------------------------------------------------------------------------

# 33. DATA ARCHITECTURE

Keep mock data separate from presentation.

Suggested:

``` text
data/
  trains
  stations
  routes
  events
  historical
  simulation
```

The UI should not contain large hardcoded datasets.

Create a central source of truth.

------------------------------------------------------------------------

# 34. DO NOT FAKE REAL-TIME DATA

This is a prototype.

The UI may simulate:

-   train positions
-   ETA
-   delays
-   congestion
-   alerts

But clearly label the system where appropriate:

``` text
SIMULATION
DEMO DATA
```

Do not present fictional positions as real Indian Railways live data.

------------------------------------------------------------------------

# 35. DESIGN SYSTEM IMPLEMENTATION

Create global tokens for:

``` text
colors
fonts
font sizes
spacing
borders
radius
shadows
animation duration
easing
z-index
```

Avoid random values scattered across components.

Use CSS variables or the project's equivalent.

------------------------------------------------------------------------

# 36. ANIMATION TIMING

Suggested:

``` text
micro interaction: 120–180ms
button/row: 180–240ms
drawer: 280–400ms
section reveal: 500–800ms
image reveal: 700–1000ms
railway drawing: 1000–1800ms
train movement: continuous
```

Adjust based on feel.

Motion should be calm and physical.

------------------------------------------------------------------------

# 37. VISUAL HIERARCHY

Every page should have:

1.  one dominant idea
2.  one primary action
3.  one primary data visualization
4.  supporting information
5.  secondary navigation

Do not give every section equal visual weight.

------------------------------------------------------------------------

# 38. IMPORTANT UX PRINCIPLE

The user should be able to answer these questions immediately:

### Passenger

-   Where is my train?
-   Is it delayed?
-   When will it reach me?
-   Why has the ETA changed?
-   What is the next station?

### Operations user

-   Which trains are delayed?
-   Where is congestion?
-   Which trains will be affected?
-   How will the delay propagate?
-   Which station/platform may be affected?

The visual hierarchy should follow these questions.

------------------------------------------------------------------------

# 39. IMPLEMENTATION ORDER

Execute the redesign in this order:

## PHASE 1

Audit codebase and current UX.

## PHASE 2

Build design tokens and visual primitives.

## PHASE 3

Build navigation and global shell.

## PHASE 4

Build shared simulation state.

## PHASE 5

Build railway SVG animation system.

## PHASE 6

Redesign Home.

## PHASE 7

Redesign Live Network.

## PHASE 8

Redesign Trains.

## PHASE 9

Redesign Train Details.

## PHASE 10

Redesign Stations.

## PHASE 11

Redesign Alerts.

## PHASE 12

Redesign Operations.

## PHASE 13

Redesign About.

## PHASE 14

Photography/art-direction pass.

## PHASE 15

Motion pass.

## PHASE 16

Responsive/accessibility pass.

## PHASE 17

Performance pass.

## PHASE 18

Final anti-AI-slop design critique.

Do not try to solve every phase in one uncontrolled rewrite.

Complete each phase cleanly and verify it before moving on.

------------------------------------------------------------------------

# 40. FINAL ANTI-AI-SLOP REVIEW

Before considering the redesign complete, critically inspect every page.

Ask:

-   Does this look like a template?
-   Are there too many cards?
-   Are there too many pills?
-   Are there too many icons?
-   Is green overused?
-   Is the hierarchy predictable?
-   Are the railway motifs meaningful?
-   Does photography have a purpose?
-   Do animations communicate real system concepts?
-   Does the interface feel like railway software?
-   Does it look distinctive when compared with generic SaaS websites?
-   Can a user understand the ETA concept immediately?
-   Does the product have a visual identity beyond its logo?

If something feels generic, redesign it.

Do not merely polish it.

------------------------------------------------------------------------

# 41. FINAL QUALITY BAR

The final RailSense prototype should feel like:

> A modern railway intelligence product with the visual restraint of an
> editorial publication, the information density of an operational
> system, and the motion language of a live railway network.

It should feel:

-   distinctive
-   credible
-   calm
-   technical
-   human
-   warm
-   modern
-   operational
-   highly usable

It should NOT feel:

-   AI-generated
-   generic SaaS
-   futuristic for the sake of being futuristic
-   government-portal-like
-   visually noisy
-   over-animated
-   card-heavy

The final experience should make the evaluator understand the project's
central idea without needing to read the entire project description:

**RailSense watches the railway as it moves and continuously estimates
when the train will actually arrive.**

------------------------------------------------------------------------

# 42. FINAL COMMAND TO CLAUDE CODE

After reading this entire file:

1.  Inspect the existing codebase.
2.  Inspect all existing functionality.
3.  Inspect `/public/img1.jpg` through `/public/img10.jpg`.
4.  Inspect installed skills.
5.  Run the existing application.
6.  Build an implementation plan.
7.  Execute the redesign phase by phase.
8.  Preserve useful functionality.
9.  Replace weak visual architecture without hesitation.
10. Test every major flow.
11. Test responsive layouts.
12. Test animations.
13. Test reduced-motion behavior.
14. Test accessibility.
15. Test performance.
16. Perform the anti-AI-slop review.
17. Fix issues found during that review.

You have full permission to restructure the frontend.

Do not ask for permission before making reasonable design or
architecture decisions.

Do not stop at a superficial color/theme change.

This is a COMPLETE WEBSITE RESTRUCTURE.

The objective is not to make the existing website slightly prettier.

The objective is to make RailSense look like a deliberately designed,
technically credible railway intelligence product.
