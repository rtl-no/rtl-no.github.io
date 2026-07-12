# Handoff: rtl.no Relaunch — Personal Website

## Overview
Relaunch of rtl.no, the personal website of Rune T. Larsen (Technology Architect, building websites since 1996). A long-term personal publication and archive covering technology, software development, AI, EVs, home cinema / AV, personal projects and trance music. Content will be authored in Markdown; the site will be published in English and Norwegian.

The design consists of five pages: Homepage, Technology, EV & Mobility, Trance, and About.

## About the Design Files
The files in this bundle are **design references created in HTML** (`*.dc.html` — self-contained pages with inline styles, viewable in any browser). They are prototypes showing intended look and behavior, **not production code to copy directly**. The task is to recreate these designs in the target stack. No production stack exists yet — a static-site generator that renders Markdown (e.g. Astro, Hugo, Eleventy, or Next.js SSG) fits the requirements: Markdown content, EN/NO i18n, tag/artist archive pages, RSS, fast static pages.

Note: the `.dc.html` files contain a small amount of runtime templating (`{{ }}` holes, `<sc-for>` loops, a `support.js` runtime and a `class Component` script block holding the data arrays at the bottom of each file). Read the data from the script blocks; the rendered layout is what matters.

## Fidelity
**High-fidelity.** Colors, typography, spacing and copy are intended as final. Recreate pixel-perfectly. All content data (article titles, project entries, timeline entries, trance videos) lives in JS arrays at the bottom of each file and maps 1:1 to future Markdown front-matter.

## Design Tokens

### Colors — light pages (Homepage, Technology, EV articles, About)
- Background: `#F7F5F0` (warm off-white); alt panel/card hover: `#F0EEE7`; chips: `#EFEDE6`
- Card background: `#FFFFFF`; borders: `#E3E0D8`; secondary border: `#D8D4CA`, `#C9C5BA`
- Text primary: `#1C2430` (graphite navy); body secondary: `#3D4653`; muted: `#5A6472`; faint/meta: `#8A857A`
- Accent (primary, teal): `#0B7285`; hover `#095E6D`; light tint bg `#E0F0EE`
- Accent (red, EV/EVKX tag): `#C0392B`; tint bg `#F6E4DF`
- Accent (purple, web/hjemmekino): `#8C5ADC`; tint bg `#EDE6F8`
- Accent (amber, AV): `#E8951C`; tint bg `#FAEEDA`
- Footer/dark: bg `#1C2430`, text `#B8BEC8`, muted `#6B7484`, border `#2A3547`, accent `#5EC4D6`

### Colors — dark pages/bands
- Trance page: bg `#0E141E`, card `#141B26`, deeper `#0A0F16`, border `#232D3E`, text `#E8E6E0`, muted `#9BA3B0` / `#7C8698` / `#8A93A3`, accent cyan `#5EC4D6` (hover `#8FDCE9`)
- Artist accents: Armin `#5EC4D6`, Korolova `#B48CFF`, Tiësto `#E8B24A`; favourite star `#E8B24A`
- Electric Has Gone Audi band: bg `#16090B`, Audi red `#BB0A30` (hover `#D51235`), text `#EDE4E2`/`#C9B8BB`, border `#3A2226`/`#5A3038`, red radial glow `rgba(187,10,48,0.22)`
- EVKX band: bg `#06131A`, accent `#0EA5C4`/`#5EC4D6`, text `#E2EAEE`/`#A9C0C9`, border `#1B3642`, cyan radial glow `rgba(14,165,196,0.18)`
- hjemmekino band: bg `#0D0A14`, accent `#8C5ADC` (hover `#A379E6`), text `#E9E5F0`/`#BBAFD0`, border `#2C2440`/`#3A2F52`, purple glow `rgba(140,90,220,0.20)` + amber `rgba(232,178,74,0.10)`

### Typography (Google Fonts)
- Display/headings: **Space Grotesk** 400–700. H1: `clamp(38–44px, 5–6vw, 58–76px)`, weight 700, line-height 1.0–1.05, letter-spacing −1.8 to −2px. Card titles 17–22px, weight 600, letter-spacing −0.4px.
- Body/UI: **Instrument Sans** 400–600. Body 14–19px, line-height 1.6–1.75.
- Mono (wordmark, meta, kickers, tags, dates): **IBM Plex Mono** 400–600. Kickers: 13px/600/letter-spacing 2px/uppercase. Tags: 10.5–12px in pill chips.

### Spacing & shape
- Content max-width: 1140px, side padding 28px
- Section vertical padding: 72–88px; card padding: 26–28px
- Border radius: cards 12–14px, showcase images 16px, buttons 8px, chips/pills 99px
- Card hover: border-color → section accent + `translateY(-2px..-3px)`, transition .15s
- Showcase screenshot shadow: `0 24px 60px rgba(0,0,0,0.5)`

## Screens

### 1. Homepage (`rtl.no Homepage.dc.html`)
Sticky header (64px, blurred `rgba(247,245,240,0.92)`, bottom border): mono wordmark `rtl.no` (".no" in teal), nav (Home, Technology, Projects, EV & Mobility, Trance, Notes, About), search icon, **EN/NO toggle button** (mono, bordered pill — switches hero copy between English and Norwegian), GitHub icon → github.com/TheTechArch.

Sections, in order:
1. **Hero** — kicker "RUNE T. LARSEN", H1 "Building websites since 1996. Still curious about how technology works." (NO: "Har bygget nettsider siden 1996…"), intro paragraph, two CTAs (dark solid "Explore my projects", outlined "Read the latest articles"), then a row of mono chips: `1996 · Mazda 323F fan site`, `1998 · Hjemmekino Web`, `2008 · Altinn`, `EVKX`, `2026 · rtl.no relaunch` (last one teal-outlined).
2. **Current focus** — 3 white cards: EVKX (red kicker "EV KNOWLEDGE"), Digital systems ("ARCHITECTURE"), AI-assisted development ("PRACTICAL AI").
3. **Featured article** — large split card: image slot left, right side category/date/read-time, title "From Hjemmekino Web to EVKX: Thirty Years of Building Knowledge Sites", summary.
4. **Latest technology articles** — 4 cards (category, date, title, summary, read time).
5. **Projects** — bordered list rows: years | name + description | status pill. Entries: EVKX (2022—, ACTIVE), Altinn & digital public systems (2008—, ONGOING, "Building Altinn 2 and Altinn 3 since 2008… Opinions are my own."), Hjemmekino Web (1998—2006, ARCHIVE), Electric Has Gone Audi (2018—2022, ARCHIVE), rtl.no (1998—, RELAUNCHED red pill).
6. **EV & Mobility teaser** — 2 cards + line linking to EVKX for specs.
7. **Trance band** — dark `#141B26` full-bleed section, intro copy ("…I am not a DJ — just a fan."), 3 video cards, link to Trance page.
8. **From the archive** — horizontal timeline on a 2px top rule with colored dots: 1996 Mazda 323F, 1998 Hjemmekino Web, 2008 Building Altinn 2 and 3, 2018 EHGA, 2022 EVKX (red dot), 2026 relaunch (teal dot).
9. **Short notes** — compact rows: date | tag | one-liner.
10. **Footer** (dark) — identity block ("Rune T. Larsen / Technology Architect and developer / Building websites since 1996"), Site links, Elsewhere links (GitHub — TheTechArch, EVKX, Contact, Privacy), bottom row: "Opinions published here are my own." + "Not affiliated with a certain German TV network."

### 2. Technology (`Technology.dc.html`)
Hero: kicker "TECHNOLOGY", H1 "My main interest for as long as I can remember."
1. **Four topic-group cards** (3px colored top bar, icon in tinted square, tags): Cloud (teal — .NET, Azure, Architecture, Altinn), AI (red — coding agents, workflows), Web (purple — web history, performance, publishing), AV & Home cinema (amber — home cinema, audio, displays).
2. **hjemmekino.no showcase band** (dark purple `#0D0A14`): kicker "THE FIRST KNOWLEDGE SITE · 1998 —", H2 "hjemmekino.no" (".no" purple), story: first big knowledge site, teaching people about AV technology; "the pattern started here… EVKX follows the same blueprint". CTAs: purple solid "Visit hjemmekino.no ↗" + outlined "The story from 1998". Screenshot slot right.
3. **Latest in technology** — 4 article cards color-coded by topic.

### 3. EV & Mobility (`EV & Mobility.dc.html`)
Hero: H1 "Two websites, one obsession: understanding electric vehicles properly."
1. **Electric Has Gone Audi band** (near-black red `#16090B`, four-rings motif of overlapping circle outlines in Audi red): kicker "PROJECT · 2018 —", H2 "Electric Has Gone Audi" ("Audi" in red). Story: started to share knowledge and passion about EVs from Audi. CTAs: red "Visit electrichasgoneaudi.net ↗" + "The story behind it". Screenshot slot right.
2. **EVKX band** (dark teal `#06131A`, image left / text right, thin cyan gradient rule on top): EVKX logo chip, kicker "PROJECT · 2022 —", H2 "Knowledge eXchange for every EV". Story: created when no site covered all brands in the detail preferred; KX = Knowledge eXchange. CTAs: cyan "Visit evkx.net ↗" + "Why EVKX became much larger than planned".
3. **The personal perspective** — 3 article cards (red accents).

### 4. Trance (`Trance.dc.html`) — dark theme throughout
Hero (radial cyan+purple glows, 9s pulse animation): kicker "THE PERSONAL COLLECTION", huge H1 "Trance", intro "I am not a DJ or music critic. I simply love trance…", genre chips (Uplifting, Progressive, Vocal, Classic, Driving, Working). Illustration slot right (340px tall).
1. **Favourite artists** — cards with a 4:3 illustration slot, genre badge overlay, name, saved-count, personal note. Armin van Buuren (cyan), Korolova (purple), Tiësto (amber). Each links to a per-artist archive page (`/trance/<artist>/`).
2. **The collection** — filter pills (All / artist names / Favourites; active = solid cyan) + responsive grid of video cards: 16:9 gradient placeholder thumb with artist initials + play button overlay + duration badge + gold star if favourite; below: TYPE · genre · year, title, artist (cyan), personal note, tag chips. Entries link to YouTube. Count line at bottom ("N of M entries · filter: X").
3. **"How this works" card** — music icon + "New entries are just a YouTube link, a title and a short personal note… nothing is hosted here."
Footer joke: "Still not a DJ."

### 5. About (`About.dc.html`)
Two-column (1fr / 340px):
- Left: H1 "About Rune" + paragraphs: intro (websites since 1996, **first website was a fan site for his mom's Mazda 323F — his first experience with HTML**); interests → hjemmekino.no and EVKX; **Altinn paragraph**: "Since 2008 I have been building Altinn 2 and Altinn 3, Norway's digital public infrastructure" with links to two Vimeo videos — Altinn Kaffe presentation https://vimeo.com/1204460046 and 2020 Altinn 3 presentation with two colleagues https://vimeo.com/431429016; closing rtl.no paragraph.
- Right: portrait photo slot (340×380) + "Quick facts" card: Based in Norway · Technology Architect and developer · Building websites since 1996 · **Web editor at Akers Mic 1998–2004** · GitHub: TheTechArch · Creator of EVKX and hjemmekino.no · Long-term work with large digital public systems · EV and Audi enthusiast · Trance fan — not a DJ.
Then: **Now** section (white band, "updated July 2026"): four cards Building / Learning / Driving / On repeat. **Three decades online** timeline: 1996 Mazda 323F · 1998 hjemmekino.no + Akers Mic · 2008 Altinn 2 & 3 · 2018 EHGA (red dot) · 2022 EVKX (cyan dot) · 2026 relaunch (teal dot).

## Interactions & Behavior
- Header is sticky with backdrop blur on all pages; active nav item is dark, others muted with accent hover.
- EN/NO toggle (homepage): swaps hero H1 + intro between English and Norwegian. Production: full i18n routing (e.g. `/en/`, `/no/`) — the toggle in the mock only covers the hero.
- Card hovers: accent border + slight lift (`translateY(-2px)`, .15s).
- Trance filters: client-side filter of the collection grid by artist or favourites.
- Trance hero glow: `pulseGlow` keyframes, opacity .35→.65, 9s ease-in-out infinite. Respect `prefers-reduced-motion`.
- All external links (`evkx.net`, `hjemmekino.no`, `electrichasgoneaudi.net`, YouTube, Vimeo, GitHub) open in new tab.
- Image slots (`<image-slot>` / `image-slot.js`) are design-time placeholders — replace with real `<img>`/`<picture>` assets: site screenshots, artist illustrations, portrait photo.

## State Management
Static site — no app state beyond: language selection (route-based), trance collection filter (client-side), optional dark mode (not designed yet; brief calls for deep charcoal, not pure black).

## Content Model (Markdown)
- **Article**: title, summary, category (Cloud/AI/Web/AV/EV/...), tags, date, readingTime, lang (en/no), image
- **Project**: name, years, status (active/ongoing/archive), description, external URL, related articles
- **Trance entry**: artist, title, type (live set/dj set/track/classic), genre, year, duration, youtubeUrl, favourite (bool), tags, personal note — artist archive pages generated from entries
- **Note**: date, tag, text (short)

## Assets
- Google Fonts: Space Grotesk, Instrument Sans, IBM Plex Mono
- Inline SVG icons (search, GitHub mark, play, star, topic icons) — all drawn in the HTML files, stroke-based, 1.6–2px stroke
- No stock imagery. All image slots await real assets from Rune (site screenshots, artist art, portrait)

## Files
- `rtl.no Homepage.dc.html` — homepage
- `Technology.dc.html` — technology section + hjemmekino showcase
- `EV & Mobility.dc.html` — EHGA + EVKX showcases
- `Trance.dc.html` — music collection (dark theme)
- `About.dc.html` — about + now + timeline
- `image-slot.js`, `support.js` — prototype runtime helpers (not for production)
