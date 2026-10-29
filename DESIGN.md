# Project Nodus

## Direction

A robotics atelier with authored light and dark palettes: a lit, extruded metal wordmark above a floating filmstrip of actual projects. The home is an exhibition entrance; article pages remain readable technical documents. Inspired by the restraint, real photography and fine dividers in the BMW M design analysis, without copying its identity or typography.

- Dark palette: ink #080b0e, cool white #edf1f3, muted #a3aeb7, mint #9ed8c5.
- Light palette: mist #edf1ef, deep green text #172d28, muted #536a63, green #176e52, white cards.
- Theme defaults to the system preference and updates live; the native System/Light/Dark picker can override it. CSS color-scheme and HTML metadata declare the supported palettes, and the document background and theme-color match the actual page. Existing explicit theme choices remain valid.
- Card shadows use dark gradients without filter blur or white inset highlights to reduce mobile compositing halos. Browser-forced dark transforms remain controlled by the browser.
- The page context menu is suppressed through one document listener, retained across Astro navigation. Cross-origin player menus are owned by their embedded provider.
- Title: real Three.js beveled text, silver front in dark mode and graphite front in light mode, white key and rim lights, ground shadows. Two lines on all screen sizes, with only the N highlighted in mint; gentle pointer response.
- Title startup: reserve the final stage size and keep temporary text/canvas hidden until the first fully laid-out WebGL frame. Reveal without a crossfade or initial rotation settling. CSS text remains available for JavaScript-disabled browsers or renderer failure, and the pending reveal is cancelled on navigation.
- Home language: English copy, navigation and accessibility labels. English card metadata lives alongside the original article metadata; article text and language remain intact.
- Timeline: the centered card’s date appears below the deck as YYYY.MM.DD in the configured site timezone. Existing posts have source-compared approximate last-work dates in homeDate; new posts default to the blog registration date (pubDatetime). The deck sorts oldest to newest from left to right by this date, independent of later edits. It opens on the latest project and wraps at both ends as a circular carousel. Digit reels roll on date changes, settle on the exact date, and respect pause/reduced-motion preferences.
- Gallery: project video stills, descriptive titles, categories and dates. Perspective makes the current card central and side cards recede. Each card floats independently and lifts on hover/focus.
- Cards link directly to posts. Hover plays only the pointed card's muted preview; leaving, switching cards, hiding the tab or moving offscreen stops it. Local previews are short, silent, compressed excerpts. All current projects, including Torque Control, use local previews. The Torque Control article serves the user-provided full original MP4 unchanged.
- Browse with previous/next buttons, arrow keys, mouse wheel over the cards, drag/swipe and position dots. Mobile keeps one main card plus side previews; touch has an explicit preview toggle and immediate article links.
- Native anchors, meaningful image alt text, semantic navigation, focus outlines and a live position label. Motion can be paused; reduced-motion disables idle movement and automatic hover previews.
- No autoplay carousel. WebGL and JavaScript absence keep the title and project links readable. WebGL runs only on home, caps pixel ratio and pauses when out of view or hidden. Astro navigation disposes GPU resources and listeners.
- Performance: transform/opacity-only card and digit motion, one animation-frame write per drag frame, paused offscreen/background/distant cards, and no repeat gallery layout on unchanged size. Text geometry uses 8 curve segments and 2 bevel segments (13,432 triangles, down from 22,144); pixel ratio caps are 1.5 on desktop and 1.25 on mobile. The title targets 60 Hz on desktop and 30 Hz on mobile with time-based smoothing.
- New posts carry cover/preview fields in frontmatter. Existing article text, sources and routes stay intact.

## Verification

Check the lit title, individual lift, video exclusivity, carousel buttons/keyboard/swipe, direct article navigation, return-to-home lifecycle, mobile overflow and pause/reduced-motion behavior. Build and local-link checks are separate from visual and interaction checks.
