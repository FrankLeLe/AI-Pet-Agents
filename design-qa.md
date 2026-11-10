# Design QA

Reviewed: 2026-07-21

## Evidence

- Problem-state reference: `.codex/passerby-audit-2026-07-21/01-home-desktop.png`.
- Final desktop: `.codex/cross-team-fix-2026-07-21/01-desktop-zh.png` and `02-desktop-en.png`.
- Final responsive views: `03-mobile-zh.png`, `04-mobile-en.png`, `05-narrow-320-zh.png`, `06-tablet-zh.png`, and `10-narrow-320-en.png` in the same folder.
- Mobile character-lane proof: `11-mobile-character-lane-zh.png`.
- Side-by-side review: `07-before-after-full.png` and `08-before-after-hero.png`.

The supplied screenshot was treated as the problem state, not a pixel-fidelity target. The final design intentionally preserves its cobalt, cream, gold, heavy border, offset-shadow, and pet-art language while correcting hierarchy and interaction.

## Review findings

- **Hierarchy:** the product benefit is now the H1; “金羽十二星” is the series H2. The hero has one filled primary action and one quieter install link.
- **Guide and collection:** 星铠团团 is a compact interactive guide. The collection is a parent card containing complete pet-entry cards, with four visible on desktop and a snap lane on mobile.
- **Content:** guide, role, mood, install-trust, and story copy was reviewed in Chinese and English. It avoids capability claims, fixed roster counts, internal rationale, and translated-sounding phrases.
- **Responsive layout:** 320, 390, 768, and 1280-pixel views have no document-level horizontal overflow. Protected Chinese phrases and the three short path labels stay intact at narrow widths.
- **Behavior:** the guide switches from the static preview to the real spritesheet and announces its new action to assistive technology. CTA scrolling, carousel buttons and their disabled boundaries, keyboard navigation, language routes, and install links were exercised.
- **Quality:** browser console warnings/errors were empty. `npm run lint`, production build, and all 14 integration/data tests passed.

## Final severity review

Independent product-layout and content reviewers reported P0: 0, P1: 0, and P2: 0 after the final narrow-screen and bilingual copy pass.

final result: passed

---

# Hatch Visual Stage Redesign QA

Reviewed: 2026-07-22

## Source truth and rendered evidence

- Selected visual target: `.codex/audits/hatch-layout-redesign-2026-07-22/03-selected-option.png` (1487 × 1058 px).
- Final desktop capture: `.codex/audits/hatch-layout-redesign-2026-07-22/08-implementation-desktop-final.png` (1487 × 1047 px).
- Density-normalized desktop capture: `.codex/audits/hatch-layout-redesign-2026-07-22/08-implementation-desktop-final-normalized.png` (1487 × 1058 px; 11 px paper-color padding added at the bottom for the browser capture exclusion only).
- Full-view comparison: `.codex/audits/hatch-layout-redesign-2026-07-22/09-source-implementation-side-by-side.jpg` (2974 × 1058 px; source left, implementation right).
- Mobile Chinese: `.codex/audits/hatch-layout-redesign-2026-07-22/07-implementation-mobile-iframe.png` (390 × 1467 px).
- Narrow English: `.codex/audits/hatch-layout-redesign-2026-07-22/10-implementation-320-en.png` (320 × 1750 px).
- Desktop browser viewport: 1502 × 1058 CSS px, 1487 px content width after the native scrollbar, devicePixelRatio 1.
- Compared state: Chinese, `第一次使用`, top of page.

The in-app browser's direct narrow-viewport screenshot path doubled the painted page while retaining a CSS-pixel crop. Responsive evidence was therefore captured from a same-origin 390/320 px iframe inside the same browser session. DOM measurements on the direct route still confirmed `scrollWidth === clientWidth`; the temporary QA wrapper was removed after capture.

## Comparison history and resolved findings

1. P1: the previous hero, action card, and pet preview read as three unrelated blocks. Rebuilt them as one bordered stage with an attached action dock.
2. P1: the pet appeared twice and competed with the main action. Removed the duplicate preview and kept one large, animated Star-Armor Tuantuan as the supporting proof.
3. P1: the action and preview columns ended at different heights, leaving a large dead region. The unified stage and dock now share one frame and one bottom edge.
4. P2: the first implementation pass wrapped the desktop H1 and exposed a cream notch along the jagged blue/yellow seam. Removed the artificial title width cap and made the stage base cobalt so the seam remains continuous.
5. P2: nested borders made the previous mobile layout feel cramped. Mobile now orders title → state/action → pet, keeps only the necessary control borders, and fits every control inside 320 px.
6. P2: the secondary finished-pet link floated outside the product surface. It now lives inside the action dock on desktop and becomes a full-width secondary action on mobile.

## Required fidelity surfaces

- Typography: Impact/Arial Narrow display treatment, Microsoft YaHei fallback, compact body scale, stable one-line Chinese desktop H1, and clean two-line English narrow H1.
- Spacing and layout: source and implementation use the same top-level composition, near-matching hero/action proportions, one outer shadow, aligned state/action columns, and no document-level horizontal overflow.
- Colors and tokens: existing cobalt, cream, yellow, black ink, hard shadow, and border tokens map directly to the selected visual.
- Image quality: the product uses the real animated pet strips, not a generated replacement. The live sprite is slightly softer than the concept render at large desktop scale; preserving the authentic, working pet is an accepted P3 trade-off.
- Copy: the selected short copy is preserved exactly in Chinese; paired English text remains concise and fits at 320 px.
- Icons: existing Lucide controls remain consistent with the site's icon system; decorative paw/sparkle marks use the same library rather than CSS or handcrafted SVG art.

## Interaction, accessibility, and runtime verification

- `第一次使用` / `已经装好` switches the tabpanel instruction and primary button.
- Successful copy changes the button to `已复制` and announces the next step.
- Forced copy failure shows an alert, opens the source/details panel, and exposes the selectable full prompt.
- `待机` / `拖动` / `工作` updates pressed state, accessible pet label, and real animation strip.
- Controls retain semantic tabs, tabpanel, group, status/alert regions, focus treatment, 44 px minimum touch targets, and reduced-motion behavior.
- Browser logs contain no application warnings or errors; only Vite development and React DevTools notices were present.
- `npm test` passed the production build and all 21 integration/data tests.
- `npm run lint` passed in a clean follow-up run.

No actionable P0/P1/P2 findings remain. The rectangular live-text pet label and authentic sprite softness remain P3 fidelity trade-offs.

final result: passed

---

# Hatch Workshop Design QA

## Source truth and implementation

- Source visual: `exec-5b399896-0e4d-43f5-879a-966d856060f9.png` (local generated-image evidence, not included in the repository)
- Source size: 1487 × 1058 px, generated-image density treated as 1×.
- Implementation: `.codex/design-qa/hatch-redesign-2026-07-22/implementation-ready-desktop-final.jpg`
- Browser viewport: 1280 × 720 CSS px at devicePixelRatio 2. The browser capture surface is 1265 × 712 px after native scrollbar/chrome exclusion.
- Compared state: Chinese, `已经装好`, scroll position 0.
- Combined comparison: `.codex/design-qa/hatch-redesign-2026-07-22/comparison-source-vs-ready.png`
- Mobile capture: `.codex/design-qa/hatch-redesign-2026-07-22/implementation-mobile-390x844.png`

## Visual comparison

The implementation preserves the selected source's cream canvas, blue/yellow bento blocks, heavy black borders, offset shadows, condensed display type, two-state starting point, visible one-line command, and real pet proof. The source showed both states simultaneously; the final implementation intentionally uses exclusive tabs so a novice sees only the action relevant to the current state. This follows the second-round passerby feedback while retaining the selected visual direction.

Desktop source and implementation were placed in one side-by-side input at the same top-of-page state. The source was proportionally scaled to the implementation width and top-cropped to the same 712 px capture height. Focused checks covered header, hero, state controls, primary CTA, prompt card, pet asset framing, borders, radii, shadows, and spacing.

## Iterations and resolved findings

1. P1: the first hero occupied nearly the whole 720 px viewport. Reduced hero height and vertical gaps.
2. P1: the active command appeared below the fold. Split action copy and command into two columns; both desktop state CTAs now fit in the first viewport.
3. P1: the ready-state preview repeated the entire long prompt. Replaced it with a concise preview while keeping the complete request in the expandable source panel.
4. P1: the 390 × 844 mobile CTA initially ended below the fold. Compacted mobile typography and state controls; the button now ends at 795.9 CSS px.
5. P0: clipboard failure previously could report success. Success is now shown only after a confirmed copy; failure opens a selectable fallback textarea.
6. P2: active state contrast was marginal. Changed active tabs to ink with white text.
7. P2: a final impatient-user pass found an awkward Chinese title break. The title now uses two deliberate, non-breaking lines and remains inside the 390 px frame.
8. P1: “只发一句” could imply that Codex never asks follow-up questions. The final promise is “附图发一句就能开始,” while the page keeps the confirmation caveat explicit.

## Interaction and responsive verification

- `第一次使用` → `已经装好`: `data-hatch-mode` changes from `first` to `ready`.
- Normal clipboard path: `data-copy-state="success"` with a next-step status message.
- Forced development failure path: `data-copy-state="error"`, alert present, details open, textarea visible.
- Motion control: `拖动` becomes pressed and loads `running-right.webp`.
- Language switch: route becomes `/hatch?lang=en`; English hero and state labels render.
- Mobile frame: 390 × 844; content client width 375 px with native scrollbar, scroll width 375 px, so no horizontal overflow.
- Console errors: none.
- Automated checks: `npm run lint` passed; `npm test` passed 21/21 tests.

## Final passerby retest

- Novice: PASS in 24 seconds; no blocker.
- Impatient visitor: PASS; both routes lead directly to copying and returning to Codex.
- Character creator: PASS in about 24 seconds on desktop and 27 seconds on mobile.
- Unresolved P0/P1/P2 findings: 0. The mobile proof remains below the first action by design so the install CTA stays visible within 844 px.

final result: passed

---

# Hatch Content Simplification QA

Reviewed: 2026-07-22

## Source truth and rendered evidence

- Problem-state visual: `.codex/audits/hatch-content-simplify-2026-07-22/before-desktop-first.jpg` (1265 × 1866 px). This is the rejected state, not a pixel-fidelity target.
- Final desktop: `.codex/audits/hatch-content-simplify-2026-07-22/after-desktop-first-final-latest.jpg` (1265 × 1035 px).
- Final mobile: `.codex/audits/hatch-content-simplify-2026-07-22/after-mobile-390x844-final.jpg` (390 × 844 px).
- Final narrow English: `.codex/audits/hatch-content-simplify-2026-07-22/after-narrow-320x844-en.jpg` (320 × 844 px).
- Same-state comparison: `.codex/audits/hatch-content-simplify-2026-07-22/comparison-before-after-top-final.jpg` (2530 × 720 px).
- Browser viewport: 1280 × 720 CSS px at devicePixelRatio 2; native page capture excludes 15 px for the scrollbar and is emitted at CSS-pixel dimensions.
- Compared state: Chinese, `第一次使用`, scroll position 0.
- Density normalization: the desktop comparison uses matching 1265 × 720 top crops without scaling. The mobile frame was captured at 390 × 844 CSS/output pixels without resampling.

## Comparison and iteration history

1. P1: the two-line hero was oversized and risked narrow-screen overflow. Replaced it with the user-specified single title “带你的宠物回家,” removed forced non-wrapping spans, and verified one-line rendering at 390 px.
2. P1: the same workflow appeared in the hero, mode heading, action card, and a separate three-step section. Removed the repeated heading, labels, visible technical preview, step list, and entire three-step block.
3. P1: the first action did not state where copied text goes. The only remaining instruction now says to paste and send in a new Codex task; the button names the destination.
4. P2: the shared workspace produced a large empty left region. Split it into two independent Bento cards: one action card and one motion-preview card.
5. P2: removing the mode heading left an H3 without an H2. Promoted the action title to H2 and preserved a clean H1 → H2 reading order.
6. P2: internal proof language (`v2`, repository, concept-image disclaimers) competed with the product task. Reduced the proof area to the pet name, one invitation, and three working motion controls.
7. P2: at 340 px and below, English `PET WORKSHOP` could break into an orphan letter. Removed `overflow-wrap: anywhere`, kept normal word boundaries, and verified the two-word label at 320 × 844.

The full-view comparison covers the hero, state controls, primary CTA, and pet preview at identical top-of-page crops. A separate focused crop was unnecessary because all changed copy and controls remain readable in the 2530 × 720 comparison. The native 390 × 844 capture is the focused responsive check.

## Required fidelity surfaces

- Typography: one H1, no forced `nowrap`, stable Chinese wrapping, and a smaller display scale.
- Spacing and layout: CTA remains visible in the 720 px desktop viewport and the 844 px mobile viewport; independent cards remove false empty-container space.
- Colors and tokens: existing cream, cobalt, yellow, ink borders, radii, and offset shadows are preserved.
- Images: existing Star-Armor Tuantuan source assets remain sharp and correctly scaled; no placeholder or synthetic substitute was added.
- Copy: visible technical and team-facing language is removed. Safety hashes, pinned source, and overwrite protection remain inside the copied content and expandable details.

## Interaction and verification

- `第一次使用` and `已经装好` switch the single action card.
- Normal copy reports `已复制`; forced failure reports `复制失败`, opens the details, and exposes a selectable full-text fallback.
- `拖动` changes the pressed motion and the pet animation label.
- English navigation preserves the hatch route and renders the paired English copy.
- Browser app logs contain no page warnings or errors; only Vite debug and React development notices were present.
- `npm run lint` passed.
- `npm test` passed all 21 tests after the final copy and responsive-regression assertions.
- Final independent review: novice PASS (5 seconds to understand, 18 seconds to both paths); content PASS with no P1 blocker; UI PASS with no P0/P1 and the narrow-navigation P2 fixed afterward.

No actionable P0/P1/P2 findings remain.

final result: passed
