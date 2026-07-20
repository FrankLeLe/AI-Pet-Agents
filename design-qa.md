# Design QA

Status: **Passed**  
Reviewed: 2026-07-20

## Visual checks

- Compared the selected desktop reference and implementation side by side at 1440 × 1024.
- Confirmed the neo-brutalist frame, cream/blue palette, heavy borders, offset shadows, hero hierarchy, pet focus, and mode dock remain visually coherent.
- Checked 390 × 844 mobile layout. Header, hero copy, calls to action, pet artwork, and navigation remain within the viewport with no horizontal overflow.
- Confirmed all pet imagery loads without broken assets on the home, gallery, and detail views.

## Interaction checks

- Home pet states switch between Working, Waiting, and Done; the pressed state and live status copy update together.
- Chinese/English switching preserves the selected language in page links.
- Pet gallery renders all four launch pets and routes to individual detail pages.
- Detail pages expose all ten v2 animation states and route to the matching install page.
- Install pages expose the correct pet ZIP and command snippets.

## Technical checks

- No browser console warnings or errors during the tested journey.
- Desktop and mobile document widths remain within their viewports.
- Production build, lint, and five integration tests pass.
