# Product Requirements Document
## TabNest — Personal Link Hub (working title, rename as you like)

**Author:** Marthanda
**Status:** Draft v2
**Date:** August 19, 2026
**Type:** Personal-use web app (mobile-first)

---

## 1. Problem Statement

Marthanda currently manages information access on his phone by keeping dozens of Brave browser tabs open, grouped loosely by topic, instead of memorizing and re-searching for websites. This works as a mental model (tabs = categories) but has a hard cost: too many open tabs cause the mobile browser to lag and eat memory/battery.

There is no lightweight, personal, always-available place that holds "the websites I use, grouped the way I think about them" without the overhead of the browser having to keep every page alive in memory.

## 2. Goal

Build a single personal website ("TabNest") that replaces the *habit* of tab-hoarding. It stores links in user-defined groups (mirroring Brave's tab groups), loads instantly, and lets him open any site in one tap — so he can freely close browser tabs without losing track of anything.

## 3. Non-Goals (v1)

- No multi-user support, no login/auth
- No cross-device cloud sync (device-local storage only)
- No social/sharing features
- No automatic tab-import/sync from the live browser (Brave doesn't expose this to a webpage)
- Not trying to be a full bookmark manager replacing Brave's native bookmarks — it's a curated, intentional shortlist

## 4. Target User

One user: Marthanda, primarily on Brave for Android, mobile-first. Desktop use is a nice-to-have, not a design driver.

## 5. Core User Story

> "As someone who keeps many tabs open by category, I want a fast personal webpage where I can tap a category and then tap a link to open it, so I can close my browser tabs without worrying I'll lose track of a site I use often."

## 6. Functional Requirements

### 6.1 Groups (categories)
- Create, rename, delete, and reorder groups (e.g. "College," "SIH Research," "Anime Tracking," "Dev Tools")
- Each group has a name, a color, and optionally an emoji/icon
- Groups are collapsible/expandable on the home view

### 6.2 Links
- Add a link with: URL (required), title (auto-suggested from URL if left blank), group assignment, optional note
- Favicon fetched automatically from the URL (no manual upload needed)
- Edit and delete existing links
- Reorder links within a group
- Move a link to a different group
- Tap a link → opens the site in a new browser tab (link stays saved regardless of what happens to that tab)

### 6.3 Finding things fast
- Persistent search bar at the top, filters across all groups by title or URL as you type
- "Recently opened" section (last 5–10 links tapped) so frequently needed sites surface without hunting for the group

### 6.4 Data safety
- Export all data to a single JSON file (backup)
- Import from a previously exported JSON file (restore)
- Since data lives in browser local storage only, export/import is the safety net against clearing browser data or switching devices

### 6.5 Speed & footprint
- Loads as a single lightweight page — no heavy frameworks, no per-link network calls beyond favicon fetch
- Usable with zero setup: open the page, data lives in the browser automatically

## 7. Non-Functional Requirements

- **Mobile-first:** primary layout, spacing, and tap targets designed for one-handed phone use; desktop just needs to not break
- **Fast:** first paint near-instant even with 100+ saved links
- **Installable:** supports "Add to Home Screen" on Android/Brave so it behaves like an app icon, not a URL to search for
- **Offline-tolerant:** the link list itself (titles, URLs, groups) should still display without internet; only tapping a link requires connectivity
- **No accounts, no server dependency for core use**

## 8. Data Model (local storage)

```
Group
- id
- name
- emoji/icon (optional)
- color
- order

Link
- id
- groupId
- title
- url
- note (optional)
- faviconUrl (derived)
- createdAt
- lastOpenedAt (nullable, powers "Recently opened")
- order
```

## 9. UI Specification (reference: Brave mobile tab groups)

Marthanda supplied a screenshot of his current Brave tab-group view as the visual reference. TabNest's home screen should feel immediately familiar to that layout, adapted from *live tabs* to *saved links*.

**Layout — Home screen**
- Search bar pinned at the top: "Search your tabs" → becomes "Search your links," filters live as you type
- Below it, a **2-column grid of group cards**, one card per group, in the user's chosen order
- Floating **+** button, bottom-center, to add a new link (or long-press for "new group")
- Overflow menu (⋮), bottom-right, for global actions (Settings / export / import)

**Group card (per card in the grid)**
- Colored background matching the group's assigned color (matches Brave's per-group color coding: pink, gray, orange, teal, etc.)
- Header row inside the card: small colored dot + group name (truncated if long) + kebab menu (⋮) for rename/delete/change color
- Body: a **2×2 tile grid** previewing up to 4 items in that group
  - Each tile = a link's favicon centered on a light tile background (not a live page thumbnail — TabNest never loads the actual site until tapped, that's the whole point)
  - If the group has more than 4 links, the 4th tile is replaced with **"+N"** showing the remaining count (matches the "+7," "+2" overflow pattern in the reference)
  - If a group has fewer than 4 links, remaining tiles stay empty/blank (matches reference behavior, e.g. the "JNTUH" card)
- Tapping the card body → opens the **Group view** (full list)
- Tapping a single favicon tile directly → opens that link immediately, one tap, without entering the group view first (a shortcut the reference tab-view doesn't need but TabNest benefits from, since there's no "switch to that live tab" equivalent)

**Group view (after tapping a card)**
- Same colored header carried over from the card, now full-width
- Full vertical list of links in that group: favicon, title, URL (truncated), tap to open, swipe or long-press for edit/delete/reorder
- Back gesture/button returns to Home

**Add/Edit Link (modal or dedicated screen)**
- URL field, title field (auto-filled, editable), group picker (chip/pill style, matches group colors), optional note
- Save / Cancel

**Settings screen**
- Manage groups: reorder, rename, recolor, delete
- Export backup (JSON) / Import backup (JSON)

**Visual tone**
- Keep the card-grid, colored-group, favicon-tile language from the reference — it's already a mental model Marthanda knows well from daily use, so TabNest should not reinvent it
- Difference from reference: no live page previews (by design — that's the memory/lag cost TabNest exists to avoid), no "inactive items" concept (not needed without live browser tabs to expire)

## 10. Success Criteria

- Marthanda can close all open Brave tabs at the end of a session without anxiety about losing a site
- Getting to any saved site takes ≤ 2 taps from opening TabNest
- Noticeable reduction in the number of simultaneously open browser tabs / reduced phone lag

## 11. Technical Approach (proposed)

- Single self-contained HTML/CSS/JS page (no backend, no build step)
- Data persisted via browser `localStorage`
- Favicon retrieval via a public favicon service (image request only, no scraping)
- Optional lightweight web app manifest so it can be added to the home screen as an app-like icon
- Hosting: works even as a local file, but a static host (e.g. GitHub Pages) is recommended so "Add to Home Screen" behaves consistently

## 12. Future Enhancements (out of scope for v1, parking lot)

- Share-sheet "quick add" — send a page from Brave straight into TabNest
- Bulk import from Brave's exported bookmarks HTML
- Cross-device sync (would require a backend — could reuse the Java Full Stack / Spring Boot + MySQL stack later if this evolves into a portfolio-worthy build)
- Usage-based auto-sorting (surface links you open most, regardless of group)
- Dark/light theme toggle if the default theme doesn't fit all lighting conditions

---

## 13. Surprise & Delight Layer (v1 Scope)

*Goal: Make TabNest feel alive, personal, and memorable — not just functional.*

### 13.1 Ambient Atmosphere
- **Time-aware background gradient** — shifts subtly with time of day (dawn → day → dusk → night) using CSS `prefers-color-scheme` + JS `Date.getHours()`. Zero runtime cost, pure CSS custom properties.
- **Group-color aura** (optional) — background hue leans toward the most-used group's color (derived from `lastOpenedAt` frequency).

### 13.2 Micro-Interactions (CSS-First, ~60fps Target)
| Trigger | Animation | Tech |
|---------|-----------|------|
| Tap group card | Shared-element "morph": card inhales (scale 0.96) → expands into full-width group view | CSS `view-transition-name` + `view-transition` (fallback: keyframe scale/opacity) |
| Tap favicon tile | Radial ripple from tap point (200ms) | `::after` pseudo-element + keyframe |
| Long-press + button | Haptic (`navigator.vibrate([15, 10, 15])`) + action menu blooms from touch origin | `touchstart`/`touchend` timing + CSS `transform-origin` |
| Drag to reorder | Ghost card with spring easing (`cubic-bezier(0.34, 1.56, 0.64, 1)`) | Native HTML5 DnD + CSS transition |
| Pull-to-refresh (home) | Bouncy "TabNest" logo stretch → settle | CSS `overscroll-behavior` + keyframe |

### 13.3 Personality-Driven Empty States
| State | Visual | Micro-Copy |
|-------|--------|------------|
| First visit (no data) | Animated bird building nest, dropping link-twigs | "Every nest starts with one twig. Add your first link 🪺" |
| Empty group | Subtle bounce on card, floating feather | "This nest is empty. Ready for stories." |
| No search results | Tiny animated magnifying glass wobble | "Even the best hunters come up empty sometimes." |
| Offline + no cache | Paper plane grounded | "Your links are safe. They'll fly when you're back online." |

### 13.4 Delightful Feedback Moments
- **Favicon load**: Skeleton shimmer → cross-fade (not pop-in)
- **Group creation**: Confetti burst (canvas, 30 particles, 800ms, auto-cleanup)
- **Export**: Animated paper plane folds and flies off-screen → "Nest packed ✈️"
- **Import**: Paper plane lands, unfolds → "Welcome home 🪺"
- **Search**: Matching group cards glow (`box-shadow` pulse); non-matching dim to 40% opacity

### 13.5 Easter Eggs (Harmless, Discoverable, Zero Clutter)
| Trigger | Reward |
|---------|--------|
| Konami code (↑↑↓↓←→←→BA) | "Developer Mode" toast → reveals visit counts, `lastOpenedAt` timestamps per link |
| Triple-tap logo (within 800ms) | Cycles secret themes: *Retro CRT* → *Matrix Rain* → *Minimal Mono* → *Neon Cyberpunk* → *Default* |
| Type "tabnest" in search | Hidden "About" card with personal note from creator |
| Long-press logo (2s) | "Credits" modal: links to favicon service, PWA docs, your GitHub |

### 13.6 Voice & Tone (TabNest Personality)
| Standard UI Copy | TabNest Voice |
|------------------|---------------|
| "Add link" | "Give this link a home" |
| "Delete group" | "Release this nest back to the wild" |
| "Export data" | "Pack your nest for the journey" |
| "Import data" | "Unpack your nest" |
| "No links yet" | "A quiet nest. Ready for stories." |
| "Group deleted" | "Nest released. Feathers scattered." |
| "Link opened" | (Silent — action speaks; toast only on error) |

### 13.7 Technical Implementation Notes
- **All animations CSS-first** — JS only triggers class toggles; no animation libraries
- **Respects `prefers-reduced-motion`** — all motion reduces to instant transitions
- **Performance budget**: < 100KB total (gzipped), 60fps on 5-year-old Android
- **Single file** — embedded CSS/JS/manifest (as `data:` URL or inline `<script type="manifest">`)
- **Service Worker** — caches shell (HTML/CSS/JS) + `localStorage` sync strategy for true offline

---

## 14. Final v1 Scope Checklist

### Core (PRD Sections 6-8)
- [ ] Groups: CRUD + reorder + color + emoji
- [ ] Links: CRUD + move + reorder + favicon auto-fetch
- [ ] Search (live filter)
- [ ] Recently opened (last 10)
- [ ] Export/Import JSON
- [ ] localStorage persistence

### UI (PRD Section 9)
- [ ] 2-col group card grid
- [ ] 2×2 favicon tile preview + "+N" overflow
- [ ] Tap card → group view; tap tile → open link
- [ ] Floating + button (tap = add link, long-press = add group)
- [ ] Overflow menu (settings/export/import)

### Delight (Section 13)
- [ ] Time-aware background
- [ ] Shared-element card→group transition
- [ ] Ripple, haptics, spring drag, pull-refresh
- [ ] 4 empty states with animation + copy
- [ ] Favicon skeleton → fade-in
- [ ] Confetti on group create
- [ ] Paper plane export/import
- [ ] Search glow/dim
- [ ] 4 easter eggs
- [ ] Voice/tone copy throughout
- [ ] Reduced-motion support

### PWA / Offline
- [ ] Web App Manifest (name, icons, theme_color, display: standalone)
- [ ] Service Worker (cache-first shell, stale-while-revalidate for favicons)
- [ ] "Add to Home Screen" tested on Brave Android

---

*Next step: build v1 as a single HTML file per the plan in Section 11, matching the UI spec in Section 9, delight spec in Section 13, seeded with an empty state and your real group names.*