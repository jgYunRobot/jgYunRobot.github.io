# Project Nodus

## Direction

A dark robotics atelier: a lit, extruded metal wordmark above a floating filmstrip of actual projects. The home is an exhibition entrance; article pages remain readable technical documents. Inspired by the restraint, real photography and fine dividers in the BMW M design analysis, without copying its identity or typography.

- Background: ink #080b0e. Text: cool white #edf1f3. Muted: #a3aeb7. Accent: existing mint, refined to #9ed8c5.
- Title: real Three.js beveled text, silver front and graphite sides, white key light, mint rim, ground shadows. Two lines on all screen sizes, with only the N highlighted in mint; gentle pointer response.
- Gallery: project video stills, descriptive titles, categories and dates. Perspective makes the current card central and side cards recede. Each card floats independently and lifts on hover/focus.
- Cards link directly to posts. Hover plays only the pointed card's muted preview; leaving, switching cards, hiding the tab or moving offscreen stops it. Local previews are short, silent, compressed excerpts. The existing Torque Control video uses an on-demand privacy-enhanced YouTube embed.
- Browse with previous/next buttons, arrow keys, drag/swipe and position dots. Mobile keeps one main card plus side previews; touch has an explicit preview toggle and immediate article links.
- Native anchors, meaningful image alt text, semantic navigation, focus outlines and a live position label. Motion can be paused; reduced-motion disables idle movement and automatic hover previews.
- No autoplay carousel. WebGL and JavaScript absence keep the title and project links readable. WebGL runs only on home, caps pixel ratio and pauses when out of view or hidden. Astro navigation disposes GPU resources and listeners.
- New posts carry cover/preview fields in frontmatter. Existing article text, sources and routes stay intact.

## Verification

Check the lit title, individual lift, video exclusivity, carousel buttons/keyboard/swipe, direct article navigation, return-to-home lifecycle, mobile overflow and pause/reduced-motion behavior. Build and local-link checks are separate from visual and interaction checks.
