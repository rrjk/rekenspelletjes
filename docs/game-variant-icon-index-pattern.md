# Game Variant / Icon / Index Pattern

This document describes the pattern used for two game families in this repository:
- `MultiplicationTablesBalloonGame` (multiplication tables balloon/rocket/zeppelin/UFO)
- `MixedSumsGame` (mixed addition/subtraction and multiplication/division)

It is intended to help scaffold new games with the same structure for:
- variant metadata
- icon rendering
- hourglass button wrapping
- index page composition

## Pattern Overview

Each game family is organized into four layers:

1. **Variant definitions** — centralized data describing game variants.
2. **Icon component** — renders a visual icon based on variant metadata.
3. **Hourglass wrapper component** — places the icon inside a reusable hourglass button type.
4. **Index app component** — builds the game selection page from titled variant rows.

This pattern separates data from rendering and keeps shared metadata logic in one place.

## 1. Variant configuration

### Purpose
`*GameVariants.ts` contains the variant table for a family.

### What it includes
- a variant dictionary keyed by short codes (`aa`, `ab`, `ba`, ...)
- properties like:
  - icon type / color
  - operator lists
  - difficulty bounds (`maxAnswer`, `maxTable`, `tableSet`)
- functions that convert variant metadata into derived info:
  - `mainCode`
  - human-readable `description`
  - optional `image` or `tables`

### Examples
- `MultiplicationTablesBalloonGameVariants.ts`
  - defines table sets and operator combinations
  - returns extended info with `mainCode`, `colorSet`, `image`, `description`, `tables`
- `MixedSumsGameVariants.ts`
  - defines icon shape, color, and operator sets
  - returns extended info with `mainCode` and `description`

## 2. Icon component

### Purpose
`*GameIcon.ts` renders the visual icon for a variant.

### Pattern
- Accepts a `variant` property.
- Reads metadata via `get*Variant(variant)`.
- Chooses icon sub-rendering based on metadata.
- Uses shared rendering utilities when needed.

### Implementation notes
- `MultiplicationTablesBalloonGameIcon.ts`
  - renders balloons, rockets, zeppelins, or flying saucers
  - chooses variant-specific text arrangement and font size
- `MixedSumsGameIcon.ts`
  - renders a single icon block with operator symbols
  - toggles active/inactive operator text based on `operators`
  - displays max answer/table values when appropriate

## 3. Hourglass-wrapper component

### Purpose
`*HourglassGameIcon.ts` wraps a game icon in an hourglass button card.

### Pattern
- Accepts `timeCode` and `variant` properties.
- Reads variant metadata and passes:
  - `mainCode`
  - `variant`
  - `description`
- Renders the specific game icon as a slot child.

### Example
- `MultiplicationTablesBalloonHourglassGameIcon.ts`
- `MixedSumsHourglassGameIcon.ts`

This wrapper reuses the same button chrome while keeping game-specific visuals modular.

## 4. Index app component

### Purpose
`*GameIndexAppV2.ts` builds the page that shows available variant buttons.

### Pattern
- Define `sections` grouped by concept or difficulty.
- Each section contains a `title` and `rows` of variant codes.
- Render rows as two related hourglass buttons with different `timeCode` values.
- Use a generic `@property` converter to map URL or attribute strings into a page type.

### Example
- `BalloonMultiplicationIndexAppV2.ts`
  - supports multiple game families in one index app via `game` property
- `MixedSumsGameIndexAppV2.ts`
  - currently supports a single `mixedSums` page with puzzle and no-puzzle sections

## How the pieces fit together

1. `IndexAppV2` chooses variant codes and renders `*HourglassGameIcon` rows.
2. `*HourglassGameIcon` loads variant metadata and passes it to the hourglass button.
3. `*GameIcon` renders the visual icon from the same metadata.
4. `get*Variant` is the single source of truth for variant properties.

This ensures a variant only needs to be defined once and all UI layers stay consistent.

## Scaffolding recipe for a new game family

1. Create `src/<NewGame>Variants.ts`
   - define variant codes and metadata shape
   - add `get<NewGame>Variant(variant)` that returns extended metadata
2. Create `src/<NewGame>GameIcon.ts`
   - use `get<NewGame>Variant(this.variant)`
   - render the icon based on metadata fields
3. Create `src/<NewGame>HourglassGameIcon.ts`
   - wrap the game icon in `icon-hourglass-button-v2`
   - forward `timeCode`, `mainCode`, `variant`, and `description`
4. Create `src/<NewGame>IndexAppV2.ts`
   - define section groups and variant rows
   - render rows with `*HourglassGameIcon`
   - optionally add `indexPage`/`game` converters for multiple pages
5. Add the new components to the relevant HTML landing pages.

## Improvement ideas

### 1. Factor shared variant metadata helpers
- Create reusable base types for `VariantInfo`, `ExtendedVariantInfo`, and description generation.
- Extract common conversion functions like `determineMainCode` and `determineSumCategoryText`.

### 2. Reduce duplication between game families
- Introduce a generic icon renderer or helper functions for operator-based icons.
- Share the hourglass wrapper component if its API is identical.

### 3. Make variant definitions more data-driven
- Use explicit variant categories such as `puzzle` / `rectangle` / `iconGroup`.
- Store display rows in the same file or a dedicated page config to avoid separate section duplication.

### 4. Type-safe variant keys
- Replace raw `string` variant props with a union of literal variant keys.
- This improves compile-time safety when scaffolding new variants.

### 5. Centralize index page configuration
- Use a generic `IndexPage` builder that can take section metadata and component references.
- This would let all games share the same render logic and only supply per-game config.

### 6. Clarify fallback and V1 compatibility
- Keep `V1` pages only as legacy fallback; prefer a single `V2` index pattern.
- Document the migration path for new pages and new variant families.

## Summary

The existing design is a clean, layered pattern that keeps:
- variant data centralized
- icon rendering separate from button wrapping
- index layout data-driven

For future games, follow this structure and consider extracting the shared bits into generic utilities or base components to make new game scaffolding faster and less error prone.