# Slider: Smooth Horizontal Scroll on Desktop

| Field | Value |
|-------|-------|
| **Ticket** | exploration |
| **Status** | Research |
| **Created** | 2026-04-30 |

---

## Requirements

- Desktop users with a laptop touchpad should be able to scroll the slider horizontally with the same fluidity as the vertical page scroll (two-finger swipe left/right scrolls slide content).
- Existing button (arrow) navigation must continue to work.
- Existing touch swipe on mobile must continue to work (or be replaced by something equivalent or better).
- Should not break existing consumers of `tp-slider` that use other behaviours (e.g. `behaviour="fade"`, `infinite`, `flexible-height`).

## Research

### Current architecture (read from source)

- `tp-slider-track` has `overflow-x: clip` (style.scss:8).
- `tp-slider-slides` is `position: relative` and uses `style.left = -<offset>px` with a CSS transition for slide-to-slide animation (tp-slider.ts:393, style.scss:18-20).
- Slides are flex items with `flex: 0 0 100%` and `scroll-snap-align: start` (style.scss:23-25). Note: `scroll-snap-align` is currently a no-op because the parent isn't a scroll container.
- Touch swipe handlers measure `touchstart`/`touchend` deltas and call `next()`/`previous()` (tp-slider.ts:692-741).
- `behaviour="fade"` uses absolute positioning, no horizontal motion.
- `per-view`, `step`, `infinite`, `flexible-height` are all parameterised off discrete slide indexes.

### Why a wheel-event hack is the wrong path

Listening to `wheel` events and manually translating `deltaX` into a transform/left value fights the browser's native momentum and inertia. It will feel laggy compared to native scroll, and won't match the OS-level rubber-banding/inertia the user gets on vertical page scroll. Native CSS scroll is the right primitive for "as smooth as the vertical page scroll".

## Brainstorm

### Approach A — Native scroll + scroll-snap (recommended)

- Switch the scroll container (likely `tp-slider-slides`) to `overflow-x: auto` + `scroll-snap-type: x mandatory`.
- Each slide already has `scroll-snap-align: start` — just becomes effective.
- Buttons call `scrollContainer.scrollTo({ left, behavior: 'smooth' })` instead of mutating `.style.left`.
- Sync `current-slide` from a `scroll` listener (debounced) or an IntersectionObserver on slides — the source of truth becomes scroll position, and the attribute follows.
- Touch swipe handlers become unnecessary (native scroll handles it).
- Hide the native scrollbar via CSS.

Tradeoffs:
- Bigger refactor inside `slide()`, `handleTouchStart/End`, and the height/position logic.
- `infinite` mode is harder with native scroll (no native infinite scroll — would need slide cloning or wrap-around logic).
- `behaviour="fade"` must remain on the old code path.
- Sub-pixel scroll positions during a drag can flicker the `current-slide` if synced naively — needs a settle/debounce.

### Approach B — Wheel listener over current transform-based code

Listen for `wheel` with non-zero `deltaX`, accumulate, then call `next()`/`previous()` past a threshold (similar to existing touch swipe).

Tradeoffs:
- Smaller change, but it's still discrete jumps, not the smooth/inertial feel the user described.
- Rejected for that reason — does not meet the "as smooth as vertical page scroll" requirement.

### Open questions

- Opt-in via a new attribute (e.g. `behaviour="scroll"` or `scroll="yes"`) to avoid breaking existing consumers? Or replace the default?
- Does this mode need to support `infinite`? `per-view` > 1? `flexible-height`?
- Should the snap be `mandatory` (always snaps to a slide) or `proximity` (free-scroll, only snaps when close)?
- Should buttons jump by `step` (current behaviour) or by viewport width / one slide at a time?

## Decisions

| # | Decision | Rationale |
|---|----------|-----------|
| D1 | Native CSS scroll + `scroll-snap`, not a wheel-event hack | Only native scroll gives the OS-level inertia/momentum the user described. Wheel-listener approach would still be discrete jumps. |
| D2 | Opt-in via a new mode, existing consumers untouched | Avoids breaking current sliders that depend on transform-based animation timing. |
| D3 | `infinite` and `behaviour="fade"` are out of scope for the new mode | Fade is non-horizontal; infinite would require slide-cloning hacks that fight native scroll. They stay on the old code path. |
| D4 | New mode is `behaviour="scroll"` | Slots into the existing `behaviour` attribute alongside `"fade"` instead of inventing a new flag. |
| D5 | `scroll-snap-type: x mandatory` | Always lands on a slide edge, matching the discrete feel of the current slider. |
| D6 | Buttons keep current `step` semantics | Use `scrollTo({ behavior: 'smooth' })` to land on the same target slide that `next()`/`previous()` already compute. API stays consistent. |
| D7 | `per-view` and `flexible-height` supported in the new mode | Both work naturally with native scroll — per-view via consumer-set slide widths, flexible-height via the existing `scrollHeight`-based measurement. |

## Affected Files

| Layer | File | Change |
|-------|------|--------|
| TS | `src/slider/tp-slider.ts` | Branch `slide()` on `behaviour="scroll"` to call `scrollTo` instead of mutating `style.left`. Add scroll listener that syncs `current-slide` from scroll position. Skip touch swipe handlers in scroll mode. |
| SCSS | `src/slider/style.scss` | Add `tp-slider[behaviour="scroll"]` rules: `overflow-x: auto`, `scroll-snap-type: x mandatory` on the slides container, hide native scrollbar. |
| HTML | `src/slider/index.html` | Add demo example of `behaviour="scroll"` for manual testing. |

## Affected Files

| Layer | File | Change |
|-------|------|--------|
| | | |

## Next Steps
