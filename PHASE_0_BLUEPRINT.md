# Phase 0: The Blueprint

## Component Architecture Map

### 1. Global Structure
- **Root Layout:** Wrapped in `ReactLenis` (lerp: 0.1, duration: 1.2) for "editorial" smooth scrolling.
- **ScrollProgress:** Fixed top bar (`h-1`, coral `#FFAA91`) scaling x-axis on scroll.
- **Navbar:** Fixed, initially transparent, becomes solid warm cream (`#FCFCF4`) + backdrop blur on scroll.

### 2. Page Sections
- **Hero Section:**
  - `SectionLabel`: "( THE OFFER )" - Animated slide up.
  - `AnimatedHeadline`: "your business deserves better" - `SplitType` char-reveal, lowercase `Darker Grotesque`.
  - `FadeUpText`: Subtext describing the $500 offer.
  - `StatsBar`: Container for `StatMarker`s ("* $500 ONE-TIME", "* NO MONTHLY FEES").
  - `CTAButton`: "Book Discovery Call" - Coral glow hover.

- **Problem Section (Scrollytelling):**
  - **Structure:** `h-[300vh]` container for pinning.
  - **Sticky Container:** Holds the central text stage.
  - **Animation:** 3 statements fade sequentially based on scroll progress:
    1. "You're great at what you do. But while you're busy..."
    2. "...your competitors with 24/7 AI agents are winning."
    3. "DIY builders promised simplicity. They lied."

- **Solution Section:**
  - **Header:** "The ThinkSwift Standard".
  - **Grid Layout:**
    - Left Col (Website): `StaggerCards` with `FeatureCard` (Light variants).
    - Right Col (AI): `StaggerCards` with `FeatureCard` (Dark `#232428` variants for contrast).

- **Who This Is For:**
  - Simple, clean grid of `ChecklistItem`s (Retail, Service, Hospitality, Healthcare).

- **Pricing Section:**
  - `PriceDisplay`: Large center numeral animates 0 -> 500.
  - `FadeUpText`: "One-time investment. Zero recurring bloat."
  - List of inclusions.

- **Process Section:**
  - **Visual:** Vertical timeline line draws down on scroll.
  - `ProcessStep`: 6 steps (Discovery -> Launch) staggered reveal.

- **CTA Section:**
  - Huge `AnimatedHeadline`: "ready to start?"
  - `CTAButton`: Center aligned, large.

- **Footer:** Minimalist, editorial typography.

## Animation Strategy (GSAP 3.12)
- **Engine:** `gsap` core + `ScrollTrigger` + `SplitType` (simulated via CSS/JS for text splitting if library unavailable, or standard GSAP stagger).
- **Triggers:**
  - **Hero:** Auto-play on mount (0.5s delay).
  - **Sections:** `start: "top 80%"` for element entry.
  - **Pinning:** Problem section uses `pin: true`, `scrub: 1`.
  - **Ref System:** Strictly using `useRef` for all animation targets. No class selectors.

## Technical Decisions
- **Framework:** React 18 + TypeScript.
- **Styling:** Tailwind CSS with strict Token Map values.
  - Background: `#FCFCF4` (Warm Cream).
  - Text: `#232428` (Charcoal).
  - Accent: `#FFAA91` (Coral).
  - Fonts: 
    - Display: `Darker Grotesque` (Weight: 400 Regular).
    - Body: `Merriweather` (Serif).
- **Icons:** Lucide React (minimal set).
- **Responsive:** Mobile-first approach. Pinning disabled or adjusted for touch devices if necessary.

## Validation Checklist
- [ ] Brand colors defined in Tailwind config? Yes.
- [ ] Fonts imported in HTML? Yes (Darker Grotesque + Merriweather).
- [ ] GSAP Context used? Yes (`useGSAP` hook).
- [ ] Warm background implemented? Yes (`bg-[#FCFCF4]`).

**Status:** Ready for Phase 3 (Animation). Please approve to proceed.