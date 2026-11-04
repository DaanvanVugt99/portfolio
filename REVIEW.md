# Design review notes

## Selected typography and movement

- Daan selected `/workshop?motion=bouncy&font=space&idle=1`.
- The main landing now uses Space Grotesk Bold on one row, Bouncy pointer/press behaviour, and slow idle movement.
- Workshop comparisons preserve their selection in the URL and do not overwrite the main default.
- All four font choices were verified to load, with one canvas after each switch and no console errors.
- Verified the selected defaults on `/`, including manual pause returning the renderer to a static frame. TypeScript and production build pass.

## Earlier sculpted-name review

- Added a one-screen landing at `/`, with independently extruded blue letter meshes, bevels, satin surfaces, and softened shadows.
- Pointer movement affects nearby letters; pressing a letter produces a bounded spring return. Tested an actual letter press through browser input.
- The role, experience line, and portfolio link are visible independently of the graphics scene.
- Shared theme and motion preferences work across the landing and overview. Manual pause resets the name; returning from the overview preserves pause state.
- The HTML name fallback was tested by temporarily making the font unavailable. The fallback and portfolio link remained usable; the font was restored immediately afterward.
- Verified no horizontal overflow at 320×568, 390×844, 768×1024, 812×375, and 1280×900. The link stays visible; short landscape allows ordinary scrolling when needed.
- Verified keyboard skip-link focus, a single semantic heading, theme persistence after reload, clean hot updates, and no current browser console errors.
- Verified settled on-demand rendering and canvas removal/recreation across navigation (zero on the overview, one on the landing).
- Moved the bento overview to `/portfolio`; tested all three legacy anchor redirects and direct reloads of both project pages.
- Replaced generic copy with name, project titles, factual descriptions, and basic section labels. Reviewed text fit in the retained bento layout.
- TypeScript and the final Vite build pass. Vite reports its usual size advisory for the optional graphics chunk; see README.md for the lazy-loading behaviour.
- OS reduced-motion detection shares the tested static/pause renderer path. The OS preference and physical touch input could not be emulated by the available browser controls; those branches were reviewed in source.

Review the letterforms, material, shadows, composition, and tactile response next. Detailed contribution stories, email, and LinkedIn remain deferred. Nothing is published.

## Earlier bento review

## Implemented

- Responsive six-tile homepage with VEX as the largest project, and the agreed mobile reading order.
- Light, dark, and system themes; explicit choices survive reloads.
- Real VEX store screenshots and a real Divergence development render, with source attribution in README.md.
- Original abstract and integration illustrations; VEX screen transitions and a conceptual code/build/test animation.
- Visibility-aware animation pausing, a manual pause control, and reduced-motion CSS.
- Draft VEX and Divergence routes, with factual contribution summaries and explicit prompts for the stories to develop next.
- Public GitHub link. Email and LinkedIn remain labelled, non-clickable placeholders.
- Central content data and CSS theme variables for further customisation.

## Validation performed

- `npm run build`: TypeScript check and Vite production build passed, using Node 24.21.0.
- Browser checks at 320px, 390px, 768px, and 1280px: no document-level horizontal overflow.
- Inspected desktop light/dark and mobile composition, image loading, and tablet text placement.
- Confirmed mobile card order and that offscreen regions pause their CSS animations.
- Confirmed both explicit theme choices survive a page reload.
- Confirmed manual motion pause changes the visible phone animations to `paused`.
- Confirmed keyboard skip link focuses the main content, and route navigation focuses the new main content.
- Opened and reloaded both project URLs directly; verified their content and images.
- Checked text palette contrast and darkened light-theme supporting text to meet 4.5:1 against the intended background surfaces.
- Inspected the generated reduced-motion media rule. OS-level reduced-motion emulation was not available in this browser tool; it was not toggled during browser testing.

## Your next input

First review the homepage composition, card proportions, type scale, colour, and animation. All copy is editable.

After that, choose one concrete VEX feature or integration and one Divergence system or fix to explain in detail. Supply your preferred public email and LinkedIn URL when ready. These details are intentionally deferred; nothing is published.
