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

Each game family is organized into five layers:

1. **Variant definitions** — centralized data describing game variants.
2. **Icon component** — renders a visual icon based on variant metadata.
3. **Hourglass wrapper component** — places the icon inside a reusable hourglass button type.
4. **Main App component** — handles URL parsing and game configuration.
5. **Index app component** — builds the game selection page from titled variant rows.

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

### Variant naming convention

- First letter indicates the section (a, b, c...), second letter increments within the section
- Section 1 variants: `aa`, `ab`, `ac`, `ad`, etc.
- Section 2 variants: `ba`, `bb`, `bc`, `bd`, etc.
- Section 3 variants: `ca`, `cb`, `cc`, `cd`, etc.
- Do not create duplicate variants for different time codes - time codes are handled separately in the index app (each variant row shows two buttons with different time codes)

### Default variant pattern

- Define a `defaultVariant` object with fallback values
- Use it when unknown variant codes are passed to `get*Variant`
- Export `gameVariants` to enable testing

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

`*HourglassGameIcon.ts` wraps a game icon in an hourglass button card using `icon-hourglass-button-v2`.

### Pattern

- Accepts `variant` and optionally `timeCode` properties.
- Reads variant metadata and passes:
  - `mainCode`
  - `variant`
  - `description`
- Renders the specific game icon as a slot child.

### `icon-hourglass-button-v2` and optional time

The shared button element treats `timeCode` as **optional**:

| `timeCode` | Hourglass | Game icon width | Short URL |
|------------|-----------|-----------------|-----------|
| Set (`a`, `b`, or `c`) | Shown | Narrow (56% of button) | `../t?{mainCode}-{variant}-{timeCode}` |
| Omitted | Hidden | Wide (89% of button) | `../t?{mainCode}-{variant}` |

When `timeCode` is omitted, `URLshortener2` resolves the link with `?variant=…` only (no `time` query parameter). The outer button keeps aspect ratio **1.8 : 1** in both modes.

Timed game wrappers (e.g. `MixedSumsHourglassGameIcon`) keep using `stringToTimeCode` with default `'a'` and always bind `.timeCode`. Untimed wrappers must **not** bind `timeCode` when absent, or the hourglass will appear.

### Timed vs untimed index rows

| Game type | Index row pattern | `timeCode` on button |
|-----------|-------------------|----------------------|
| Timed (e.g. MixedSums) | Two buttons per variant (`durations[0]`, `durations[1]`) | Always set |
| Untimed (e.g. ClickInOrder) | One button per variant | Omit attribute |

Example untimed index row:

```typescript
renderRow(variant: string): HTMLTemplateResult {
  return html`
    <click-in-order-hourglass-game-icon variant=${variant}>
    </click-in-order-hourglass-game-icon>
  `;
}
```

### Example

- `MultiplicationTablesBalloonHourglassGameIcon.ts`
- `MixedSumsHourglassGameIcon.ts`

This wrapper reuses the same button chrome while keeping game-specific visuals modular.

**Manual inspection:** open `Rekenspelletjes/TestApp.html` for side-by-side timed and untimed `icon-hourglass-button-v2` examples.

## 4. Main App component with dual URL parsing

### Purpose

`*GameApp.ts` is the main game component that handles URL parsing for both variant-based and explicit parameter modes.

### Pattern

- Implement two URL parsing methods: `parseUrlWithVariant` and `parseUrlWithoutVariant`
- `parseUrlWithVariant` uses `get*Variant` to get all configuration from a single variant code
- `parseUrlWithoutVariant` parses individual URL parameters for legacy support
- Both methods set the same internal game properties for consistency
- Use `GameLogger` to track game statistics with mainCode and subCode
- The main `parseUrl` method dispatches to the appropriate parser based on URL parameters

### Example

- `MixedSumsGameApp.ts` - Shows dual URL parsing (variant + explicit parameters)
- `MultiplicationTablesBalloonGameV2.ts` - Shows dual URL parsing with image type selection

## 5. Index app component

### Purpose

`*GameIndexAppV2.ts` builds the page that shows available variant buttons.

### Pattern

- Define `sections` grouped by concept or difficulty.
- Each section contains a `title` and `rows` of variant codes.
- Render rows as two related hourglass buttons with different `timeCode` values.
- Use a generic `@property` converter to map URL or attribute strings into a page type.

### Example

- `MultiplicationTablesBalloonGameIndexAppV2.ts`
  - supports multiple game families in one index app via `game` property
- `MixedSumsGameIndexAppV2.ts`
  - currently supports a single `mixedSums` page with puzzle and no-puzzle sections

## How the pieces fit together

1. `IndexAppV2` chooses variant codes and renders `*HourglassGameIcon` rows.
2. `*HourglassGameIcon` loads variant metadata and passes it to the hourglass button.
3. `*GameIcon` renders the visual icon from the same metadata.
4. `*GameApp` parses URLs and uses variant metadata to configure the game.
5. `get*Variant` is the single source of truth for variant properties.

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
   - forward `mainCode`, `variant`, and `description`
   - forward `timeCode` only for timed games (omit binding for untimed games)
4. Create `src/<NewGame>IndexAppV2.ts`
   - define section groups and variant rows
   - timed games: render two `*HourglassGameIcon` per row with different `timeCode` values
   - untimed games: render one `*HourglassGameIcon` per row without `timeCode`
   - optionally add `indexPage`/`game` converters for multiple pages
5. Create `src/<NewGame>Variants.test.ts`
   - test that `gameVariants` has all expected keys
   - test representative variants for each code path
   - test that unknown variants return the default
   - test type validation for `ExtendedVariantInfo`
6. Create `src/<NewGame>App.ts` with dual URL parsing
   - implement `parseUrlWithVariant` for variant-based URLs
   - implement `parseUrlWithoutVariant` for explicit parameter URLs (legacy support)
   - configure GameLogger with mainCode and subCode
7. Add the new components to the relevant HTML landing pages.
   - Add script reference to main `index.html`
   - Create game-specific HTML page with `<new-game-app>` element
   - Create index page HTML with `<new-game-index-app-v2>` element

## Common shared utilities

### Color handling

```typescript
import { Color, getColorInfo } from '../Colors';
// In render:
--fill-color: ${getColorInfo(variantInfo.iconColor).mainColorCode};
```

### Operator handling

```typescript
import { Operator, operatorToDutch, operatorToSymbol } from '../Operator';
// Convert to Dutch text: operatorToDutch('plus') → 'plus'
// Convert to symbol: operatorToSymbol('times') → '×'
```

### Time code handling

```typescript
import {
  type TimeCode,
  stringToTimeCode,
  optionalStringToTimeCode,
  timeCodeToAttribute,
} from '../TimeCodes';

// Timed wrappers / index buttons with duration choice (missing attribute defaults to 'a'):
@property({ converter: stringToTimeCode })
accessor timeCode: TimeCode = 'a';

// icon-hourglass-button-v2 itself (missing attribute = no time / no hourglass):
@property({
  converter: {
    fromAttribute: optionalStringToTimeCode,
    toAttribute: timeCodeToAttribute,
  },
})
accessor timeCode: TimeCode | undefined = undefined;
```

### Error handling

```typescript
import { UnexpectedValueError } from '../UnexpectedValueError';
// Throw for unexpected values:
throw new UnexpectedValueError(value);
```

### Dutch list formatting

```typescript
import { joinWithEn } from '../Utils';
// Format natural Dutch lists: joinWithEn([1, 2, 3]) → '1, 2 en 3'
```

## Checklist for new games

- [ ] Create `src/<GameName>/` directory
- [ ] Create `<GameName>Variants.ts` with variant definitions
- [ ] Create `<GameName>Variants.test.ts` with test suite
- [ ] Create `<GameName>GameIcon.ts` with icon rendering
- [ ] Create `<GameName>HourglassGameIcon.ts` with hourglass wrapper
- [ ] Decide timed vs untimed; index renders one or two buttons per variant accordingly
- [ ] Create `<GameName>App.ts` with dual URL parsing
- [ ] Create `<GameName>IndexAppV2.ts` with index page
- [ ] Update main `index.html` with script reference
- [ ] Create game-specific HTML page
- [ ] Create index page HTML
- [ ] Test the game renders correctly
- [ ] Test all variant codes work
- [ ] Test explicit parameter URLs work (backward compatibility)
- [ ] Test index page navigation
- [ ] Run test suite to verify variants

## Migration instructions for existing games

If you have an existing game with a `GameApp.ts` file and want to migrate it to the variant-based pattern:

### Step 1: Analyze existing GameApp.ts

Examine the current `GameApp.ts` to identify:

- What URL parameters it currently parses
- What game configuration properties it uses
- What the current mainCode logic is
- What game-specific state it maintains

### Step 2: Create variants file

Create `<GameName>Variants.ts` based on the existing game configuration:

- Define `VariantInfo` interface with all game-specific properties
- Create variant codes for each common configuration combination
- Implement `get<GameName>Variant` to return extended metadata
- Add helper functions to determine mainCode and description

### Step 3: Update GameApp.ts URL parsing

Modify the existing `GameApp.ts` to support both parsing methods:

- Keep the existing `parseUrl` method or create a new one
- Extract the current URL parsing logic into `parseUrlWithoutVariant`
- Add new `parseUrlWithVariant` method that uses the variants file
- Update the main `parseUrl` to dispatch based on `variant` parameter presence

### Step 4: Create icon component

Create `<GameName>GameIcon.ts`:

- Import `get<GameName>Variant` from the variants file
- Accept a `variant` property
- Render the icon based on variant metadata
- Use the same visual style as the existing game

### Step 5: Create hourglass wrapper

Create `<GameName>HourglassGameIcon.ts`:

- Copy the template from the scaffolding guide
- Update imports and custom element name
- No other changes needed

### Step 6: Create index app

Create `<GameName>IndexAppV2.ts`:

- Define sections based on your variant groupings
- List variant codes in each section
- Use the hourglass wrapper to render buttons

### Step 7: Update HTML files

- Add script references to main `index.html`
- Create or update the game-specific HTML page
- Create a new index page HTML file

### Step 8: Test both URL modes

Ensure both URL modes work:

- Variant-based URL: `<GamePage>.html?variant=aa`
- Explicit parameter URL: `<GamePage>.html?operator=plus&operator=minus&maxAnswer=100`

### Step 9: Clean up legacy code

Once migration is complete and tested:

- Remove any legacy GameLink files (they are no longer needed)
- Update any hardcoded URLs to use variant codes where appropriate
- Consider deprecating explicit parameter URLs in documentation
