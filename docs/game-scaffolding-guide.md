# Game Scaffolding Guide

This guide explains the pattern for creating game families with variant-based configuration (used by `MixedSumsGame` and `MultiplicationTablesBalloonGame`).

## Quick Reference

**Core files in `src/<GameName>/`:**

- `<GameName>Variants.ts` - Variant metadata (export `gameVariants` for testing)
- `<GameName>Variants.test.ts` - Variant tests
- `<GameName>Icon.ts` - Visual icon rendering
- `<GameName>HourglassGameIcon.ts` - Hourglass/no-time button wrapper (optional for non-time-limited games)
- `<GameName>IndexAppV2.ts` - Index page component
- `<GameName>App.ts` - Main game with dual URL parsing (variant + explicit)

**Variant naming:** `aa`, `ab`, `ac` (section 1), `ba`, `bb`, `bc` (section 2), etc.
**Game naming:** Always include "Game" suffix (e.g., `MyNewGame`, not `MyNew`).

**URL modes:**

- **Variant-based** (recommended): `?variant=aa` - uses pre-configured variant
- **Explicit parameters** (legacy): `?operator=plus&maxAnswer=100` - parses individual params

**When to use which:**

- Use variant-based for new games and index pages
- Keep explicit parameter parsing for backward compatibility with existing URLs

**Time-based vs non-time-based games:**

- Time-based games use `timeCode` and hourglass buttons for duration choices.
- Non-time-based games can omit `timeCode` and use `IconHourglassButtonV3` as a plain variant button,
- Example: `ClickInOrderGame` is a variant-based game that does not require per-variant time codes. Its wrapper can omit `timeCode`, and its index app shows one button per variant.

**SubCode convention:**

- In the variant design pattern, the subCode is always equal to the variant code
- When using variant-based URLs, set `gameLogger.setSubCode(variant)` where variant is the variant code (e.g., 'aa', 'ab', 'ac')
- When using explicit parameter URLs (legacy), determine subCode based on the parsed parameters for backward compatibility

## AI Scaffolding Instructions

**Post-generation step:** Always run `npm run format:prettier` after generating code.

### Step 1: Create the Game Directory

Create a new directory under `src/`:

```
src/<GameName>/
```

Replace `<GameName>` with your game name in PascalCase (e.g., `MyNewGame`).

### Step 2: Create `<GameName>Variants.ts`

Defines all game variants and their metadata.

```typescript
import { Color } from '../Colors';
import { UnexpectedValueError } from '../UnexpectedValueError';

// Define icon types ONLY if genuinely different (not determinable from other properties)
export const gameIcons = ['iconType1', 'iconType2'] as const;
export type GameIcon = (typeof gameIcons)[number];

interface <GameName>VariantInfo {
  iconColor: Color;
  // Add game-specific properties: icon?, operators?, maxAnswer?, tables?, etc.
}

const defaultVariant: <GameName>VariantInfo = {
  iconColor: 'green',
  // Add default values
};

// Export for testing
export const <gameName>Variants: Record<string, <GameName>VariantInfo> = {
  aa: defaultVariant,
  ab: { iconColor: 'red' /* overrides */ },
  // Add more variants...
};

export interface <GameName>ExtendedVariantInfo extends <GameName>VariantInfo {
  mainCode: string;
  description: string;
  // Add derived properties: colorSet?, image?, tables?
  // IMPORTANT: If icon component needs example sums or other derived data,
  // include them here (e.g., exampleSums: { text1: string; text2: string })
}

function determineMainCode(variantInfo: <GameName>VariantInfo): string {
  // Logic to determine mainCode (e.g., switch on icon type or operators)
  return 'A';
}

function createDescription(variantInfo: <GameName>VariantInfo): string {
  // Use operatorToDutch() and joinWithEn() from '../Utils' for Dutch lists
  return 'Game description';
}

export function get<GameName>Variant(variant: string): <GameName>ExtendedVariantInfo {
  const variantInfo = <gameName>Variants[variant] || defaultVariant;
  return {
    ...variantInfo,
    mainCode: determineMainCode(variantInfo),
    description: createDescription(variantInfo),
    // Add other derived properties here (e.g., exampleSums, colorSet, image)
    // IMPORTANT: If icon component needs this data, it MUST be in extended variant info
  };
}
```

**Key points:**

- Don't create duplicate variants for different time codes (handled in index app)
- Export `<gameName>Variants` for testing
- **Important:** Each variant should represent a unique game configuration, not different time durations. The index app handles showing multiple time codes (e.g., 'b' and 'c') for the same variant.
- **Default variant:** The `defaultVariant` should always equal variant `aa`. Add a comment like `// Default: aa` to make this clear. The icon color and all other aspects of the default variant should be taken from the first found variant (aa).

### Step 2.5: Create `<GameName>Variants.test.ts`

Tests variant definitions.

```typescript
import {
  get<GameName>Variant,
  <gameName>Variants,
  type <GameName>ExtendedVariantInfo,
} from './<GameName>Variants';

test('<gameName>Variants has expected keys', () => {
  expect(Object.keys(<gameName>Variants)).toStrictEqual([
    'aa', 'ab', 'ac', /* all variant codes */
  ]);
});

test('get<GameName>Variant for aa', () => {
  const extendedVariant = get<GameName>Variant('aa');
  expect(extendedVariant.iconColor).toBe('lavender');
  expect(extendedVariant.mainCode).toBe('A');
  expect(extendedVariant.description).toBe('Game description');
});

test('get<GameName>Variant for unknown variant returns default', () => {
  const extendedVariant = get<GameName>Variant('unknown');
  expect(extendedVariant.iconColor).toBe('green');
});

test('<GameName>ExtendedVariantInfo type validation', () => {
  const variant: <GameName>ExtendedVariantInfo = get<GameName>Variant('aa');
  expect(typeof variant.iconColor).toBe('string');
});
```

**Key points:**

- Test expected keys, representative variants, unknown variant fallback, and type validation
- Don't test every variant individually - test key code paths only

### Step 3: Create `<GameName>Icon.ts`

Renders the visual icon for each variant.

```typescript
import { LitElement, html, css } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { <GameName>ExtendedVariantInfo, get<GameName>Variant } from './<GameName>Variants';
import { UnexpectedValueError } from '../UnexpectedValueError';

@customElement('<game-name>-icon')
export class <GameName>Icon extends LitElement {
  @property({ type: String })
  accessor variant = '';

  static get styles(): CSSResultGroup {
    return css`
      :host {
        display: grid;
        justify-items: center;
        align-items: center;
        container-type: size;
      }

      .iconContainer {
        display: grid;
        grid-template-columns: 100%;
        grid-template-rows: 100%;
        width: 90%;
        height: 90%;
        min-width: 0;
        min-height: 0;
        border-radius: 25%;
        border: 2px solid black;
        background-color: var(--fill-color);
        justify-items: center;
        align-items: center;
      }

      .iconContent {
        width: 95%;
        height: 95%;
      }
    `;
  }

  private renderIconType1(variantInfo: <GameName>ExtendedVariantInfo): HTMLTemplateResult {
    return html`<!-- SVG or component -->`;
  }

  render(): HTMLTemplateResult {
    const variantInfo = get<GameName>Variant(this.variant);
    if (variantInfo.icon === 'iconType1') {
      return this.renderIconType1(variantInfo);
    }
    throw new UnexpectedValueError(variantInfo.icon);
  }
}
```

**CSS Grid sizing:** Always add `min-width: 0` and `min-height: 0` to grid items to prevent content from forcing expansion.

**Render function splitting:** When the render function becomes large, split it into smaller, focused helper methods. Each helper should render a specific part of the component (e.g., SVG definitions, gradients, specific visual elements). The main render method should orchestrate these helpers. This improves readability and maintainability.

### Border Considerations

If your icon needs a border around it (like the EggCountingGameIcon example), you must set `box-sizing: border-box` on the container with the border. Without this, the border adds to the element's size and the icon becomes too large.

```css
.iconContainer {
  aspect-ratio: ${<GameName>Icon.aspectRatio};
  min-width: 0;
  min-height: 0;
  border: 2px solid black;
  border-radius: 25%;
  /* CRITICAL: Include this when using borders */
  box-sizing: border-box;
  display: grid;
  justify-items: center;
  align-items: center;
}
```

**Why `box-sizing: border-box` is required:**

- Default `content-box` sizing adds border/padding to the specified dimensions
- `border-box` includes border/padding within the specified dimensions
- Without it, a 100px × 100px container with 2px border becomes 104px × 104px
- This breaks the container query calculations and aspect ratio maintenance

**Example of split render:**

```typescript
private renderDefs(color: Color): SVGTemplateResult {
  return svg`<defs>...</defs>`;
}

private renderStarBody(color: Color): SVGTemplateResult {
  return svg`<rect ... />`;
}

private renderStrings(strings: string[]): SVGTemplateResult {
  return svg`<text>...</text>`;
}

render(): HTMLTemplateResult {
  const strings = this.getStrings();
  const color = this.getColor();
  return html`
    <svg viewBox="0 0 213 181">
      ${this.renderDefs(color)}
      <g mask="url(#starMask)">
        ${this.renderStarBody(color)}
        ${this.renderStrings(strings)}
      </g>
    </svg>
  `;
}
```

### Step 4: Create `<GameName>HourglassGameIcon.ts`

Use the `IconHourglassButtonV3` base class and inherit from it. Override `mainCode`, `description`, and `renderGameIcon()` so the hourglass button renders the game icon without embedding the button markup directly. If the game is not time-based, omit the `timeCode` attribute and `IconHourglassButtonV3` will render as a plain button without an hourglass icon.

```typescript
import { html, css } from 'lit';
import type { CSSResultGroup, HTMLTemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { get<GameName>Variant } from './<GameName>Variants';
import { IconHourglassButtonV3 } from '../IconHourglassButtonV3';
import './<GameName>Icon';

@customElement('<game-name>-hourglass-game-icon')
export class <GameName>HourglassGameIcon extends IconHourglassButtonV3 {
@property({ converter: stringToTimeCode })
  accessor timeCode: TimeCode = 'a';
    @property({ type: String })
  accessor variant = '';

  static get styles(): CSSResultGroup {
    return [
      super.styles,
      css`
        :host {
          display: grid;
          justify-items: center;
          align-items: center;
          aspect-ratio: 1.8 / 1;
          container-type: size;
          position: relative;
        }

        @container (aspect-ratio > 1.8) {
          <game-name>-icon { height: 100cqh; }
        }

        @container (aspect-ratio <= 1.8) {
          <game-name>-icon { width: 100cqw; }
        }

        <game-name>-icon { height: 100%; width: 100%; }
      `,
    ];
  }

  override get mainCode(): string {
    return get<GameName>Variant(this.variant).mainCode;
  }

  override get timeCode(): string {
    return this.timeCode;
  }

  override get description(): string {
    return get<GameName>Variant(this.variant).description;
  }

  renderGameIcon(): HTMLTemplateResult {
    return html`
      <<game-name>-icon .variant=${this.variant}></<game-name>-icon>
    `;
  }
}
```

### Step 5: Create `<GameName>IndexAppV2.ts`

Creates the index page showing all variant buttons.

```typescript
import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import './<GameName>HourglassGameIcon';

type IndexPage = 'defaultPage';

export function convertIndexPage(value: string | null): IndexPage {
  switch (value) {
    case 'defaultPage': return value;
    default: return 'defaultPage';
  }
}

interface SectionInfoType { title: string; rows: string[]; }
interface IndexPageType { defaultPage: SectionInfoType[]; }

const sections: IndexPageType = {
  defaultPage: [
    { title: 'Section Title', rows: ['aa', 'ab', 'ac', 'ad'] },
    { title: 'Another Section', rows: ['ba', 'bb', 'bc', 'bd'] },
  ],
};

const durations = ['a', 'b'];

@customElement('<game-name>-game-index-app-v2')
export class <GameName>IndexApp extends LitElement {
  @property({ converter: convertIndexPage })
  accessor indexPage: IndexPage = 'defaultPage';

  static get styles(): CSSResultArray {
    return [
      css`
        :host { font-size: x-large; }
        .buttonTable {
          position: relative;
          display: flex;
          row-gap: 10px;
          flex-wrap: wrap;
          justify-content: space-around;
          width: min(400px, 90vw);
        }
        <game-name>-hourglass-game-icon { width: 47%; }
      `,
    ];
  }

  renderRow(variant: string): HTMLTemplateResult {
    return html`
      <<game-name>-hourglass-game-icon variant=${variant} timeCode=${durations[0]}></<game-name>-hourglass-game-icon>
      <<game-name>-hourglass-game-icon variant=${variant} timeCode=${durations[1]}></<game-name>-hourglass-game-icon>
    `;
  }

  // For non-time-based games, render the wrapper without a timeCode attribute:
  // renderRow(variant: string): HTMLTemplateResult {
  //   return html`<game-name-hourglass-game-icon variant=${variant}></game-name-hourglass-game-icon>`;
  // }



  render(): HTMLTemplateResult[] {
    const renderItems: HTMLTemplateResult[] = [];
    for (const section of sections[this.indexPage]) {
      renderItems.push(html`
        <h2>${section.title}</h2>
        <div class="buttonTable">
          ${section.rows.map(row => this.renderRow(row))}
        </div>
      `);
    }
    renderItems.push(html` <p><a href="index.html">Terug naar het hoofdmenu</a></p>`);
    return renderItems;
  }
}
```

### Step 6: Create `<GameName>App.ts` with URL Parsing

Main game component with dual URL parsing (variant-based and explicit parameters).
For time-based games extend `TimeLimitedGame2`; for untimed games use `GameSkeleton`, `AscendingItemsGameApp`, or another non-time base class as appropriate.

```typescript
import { html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { GameLogger } from '../GameLogger';
// import { TimeLimitedGame2 } from '../TimeLimitedGame2';
// import { AscendingItemsGameApp } from '../AscendingItemsGameApp';
import { get<GameName>Variant } from './<GameName>Variants';

@customElement('<game-name>-app')
export class <GameName>App extends /* TimeLimitedGame2 or AscendingItemsGameApp */ {
  @state() private accessor gameProperty1 = defaultValue1;
  private eligibleOperators: Operator[] = [];
  private eligibleTables: number[] = [];
  private maximumNumber = 10;
  private gameText = '';
  private gameLogger = new GameLogger('A', '');

  constructor() {
    super();
    this.parseUrl();
  }

  private parseUrlWithVariant(urlParams: URLSearchParams): void {
    const variant = urlParams.get('variant');
    if (variant === null) throw Error('Internal SW Error: no variant in URL');
    const extendedVariantInfo = get<GameName>Variant(variant);

    this.eligibleTables = extendedVariantInfo.tables;
    this.eligibleOperators = extendedVariantInfo.operators;
    this.maximumNumber = extendedVariantInfo.maxAnswer;
    this.gameLogger.setMainCode(extendedVariantInfo.mainCode);
    this.gameLogger.setSubCode(variant);
    this.gameText = extendedVariantInfo.description;
    this.determineMaxDigits();
  }

  private parseUrlWithoutVariant(urlParams: URLSearchParams): void {
    this.eligibleOperators = [];
    this.eligibleTables = [];
    this.maximumNumber = 10;
    this.gameText = 'Default game description';

    const operatorsFromUrl = urlParams.getAll('operator');
    for (const operatorString of operatorsFromUrl) {
      const operator = operators.find(elm => elm === operatorString);
      if (operator !== undefined) this.eligibleOperators.push(operator);
    }
    if (this.eligibleOperators.length === 0) this.eligibleOperators = [...defaultOperators];

    const maxFromUrl = urlParams.get('maxAnswer');
    if (maxFromUrl !== null) {
      const maxAsInt = parseInt(maxFromUrl, 10);
      if (!Number.isNaN(maxAsInt)) this.maximumNumber = maxAsInt;
    }

    const tablesFromUrl = urlParams.getAll('table');
    for (const tableAsString of tablesFromUrl) {
      const table = parseInt(tableAsString, 10);
      if (!Number.isNaN(table) && table >= 1 && table <= 100) {
        this.eligibleTables.push(table);
      }
    }
    if (this.eligibleTables.length === 0) this.eligibleTables = [2, 3, 4, 5, 6, 7, 8, 9, 10];

    this.gameLogger.setMainCode(this.determineMainCodeFromParams());
    this.determineMaxDigits();
  }

  private parseUrl(): void {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('variant')) this.parseUrlWithVariant(urlParams);
    else this.parseUrlWithoutVariant(urlParams);
  }

  private determineMainCodeFromParams(): string {
    return 'A'; // Logic based on parsed parameters
  }

  private determineMaxDigits(): void {
    // Calculate max digits based on game configuration
  }

  // Implement other required game methods...
}
```

### Step 7: Update HTML Files

Add the new game to HTML files:

1. **Main index.html** - Add script reference:

```html
<script type="module" src="../src/<GameName>/<GameName>Icon.ts"></script>
```

2. **Game-specific HTML page** (e.g., `<GamePage>.html`):

```html
<<game-name>-app></<game-name>-app>
<script type="module" src="../src/<GameName>/<GameName>App.ts"></script>
```

3. **Index page HTML** (e.g., `index<GameName>.html`):

```html
<<game-name>-game-index-app-v2 indexPage="defaultPage"></<game-name>-game-index-app-v2>
<script type="module" src="../src/<GameName>/<GameName>IndexAppV2.ts"></script>
```

### Step 8: Update Import References

If referenced from other files (e.g., `TestApp.ts`, `URLshortener.ts`):

```typescript
import './<GameName>/<GameName>Icon';
```

## Common Pitfalls and Lessons Learned

### Issue 1: Duplicate Variants for Time Codes

**Problem:** Creating duplicate variants (e.g., `aa`, `ab` with identical configurations) to show different time durations on the index page.

**Solution:** Don't create duplicate variants for different time codes. The index app handles showing multiple time codes for the same variant. Each variant should represent a unique game configuration only.

**Example:**

````typescript
// WRONG - duplicate variants for time codes
export const gameVariants = {
  aa: { /* config */ },
  ab: { /* same config */ }, // duplicate!
};

// CORRECT - unique variants only
export const gameVariants = {
  aa: { /* config */ },
  ba: { /* different config */ },
};

// In index app, show multiple time codes for same variant
const durations = ['b', 'c']; // 3 and 5 minutes
renderRow(variant: string) {
  return html`
    <game-hourglass-game-icon variant=${variant} timeCode=${durations[0]}></game-hourglass-game-icon>
    <game-hourglass-game-icon variant=${variant} timeCode=${durations[1]}></game-hourglass-game-icon>
  `;
}
```

### Issue 2: Forgetting to Update URLshortener2.ts
**Problem:** Links don't work because the game code mapping wasn't added to `URLshortener2.ts`.

**Solution:** Always add the game's main code to the `baseURLs` mapping in `src/URLshortener2.ts` after creating the game.

**Example:**
```typescript
const baseURLs: Partial<Record<string, URL>> = {
  // ... existing mappings
  X: new URL('./GetallenlijnBoogjesSpel.html', baseUrl),
};
```

**Important:** Do NOT modify `URLshortener.ts` - the existing shortcode system must continue working. Use URLshortener2.ts for new variant-based URL generation.

**Code organization:** Keep the `baseURLs` maincodes sorted alphabetically, with single-letter codes before two-letter codes (e.g., C, D, I, K, M, R, X, AB, AC, AD). This maintains consistency and makes the file easier to maintain.

**Example:** If the original icon shows min-max text below a visual element, the new icon should also include this:

```typescript
render(): HTMLTemplateResult {
  return html`
    <div class="iconContainer">
      <div class="iconContent">
        <visual-element></visual-element>
        <span class="minMaxText">${variantInfo.min} － ${variantInfo.max}</span>
      </div>
    </div>
  `;
}
```

### Issue 4: Using Incorrect Time Codes

**Problem:** Assuming all games use time codes 'a' and 'b' when the game actually uses different codes (e.g., 'b' and 'c' for 3 and 5 minutes).

**Solution:** Check the original index app or game configuration to determine which time codes the game uses. Not all games use the default time codes.

**Example:**

```typescript
// Check original implementation for time codes
const durations = ['b', 'c']; // 3 minutes and 5 minutes, not 'a' and 'b'
```

### Issue 5: Icon Component Using Helper Functions Directly

**Problem:** Icon component directly calling helper functions (like `getExampleSums`) instead of using data from the extended variant info. This breaks the intended architecture where the variant getter should provide all needed data.

**Solution:** If the icon component needs derived data (example sums, calculated values, etc.), include it in the `ExtendedVariantInfo` interface and compute it in the `get<GameName>Variant` function. The icon component should only use data from `variantInfo`.

**Example:**

```typescript
// WRONG - icon component calls helper directly
import { getExampleSums } from './<GameName>Variants';

render(): HTMLTemplateResult {
  const variantInfo = get<GameName>Variant(this.variant);
  const { text1, text2 } = getExampleSums(variantInfo); // BAD!
  // ...
}

// CORRECT - data is in extended variant info
export interface <GameName>ExtendedVariantInfo extends <GameName>VariantInfo {
  mainCode: string;
  description: string;
  exampleSums: { text1: string; text2: string }; // Include here
}

export function get<GameName>Variant(variant: string): <GameName>ExtendedVariantInfo {
  const variantInfo = <gameName>Variants[variant] || defaultVariant;
  return {
    ...variantInfo,
    mainCode: determineMainCode(variantInfo),
    description: createDescription(variantInfo),
    exampleSums: getExampleSums(variantInfo), // Compute here
  };
}

// Icon component uses data from variantInfo
render(): HTMLTemplateResult {
  const variantInfo = get<GameName>Variant(this.variant);
  const { text1, text2 } = variantInfo.exampleSums; // GOOD!
  // ...
}
```

### Issue 6: Using String Paths for Images (Rollup Build Error)

**Problem:** Using hardcoded string paths for images in SVG elements causes Rollup build failures because the paths cannot be resolved during the build process.

**Solution:** Always use `new URL()` with `import.meta.url` for image references, then use the `.href` property in SVG elements.

**Example:**

```typescript
// WRONG - hardcoded strings fail in Rollup build
static baseImage = 'Mompitz Elli star-transparent.png';
static maskImage = 'Mompitz Elli star-mask.png';

// In SVG:
href="../images/${AdditionSubstractionWholeDecadeGameIcon.maskImage}"

// CORRECT - proper URL objects that work with Rollup
static baseImage = new URL('../../images/Mompitz Elli star-transparent.png', import.meta.url);
static maskImage = new URL('../../images/Mompitz Elli star-mask.png', import.meta.url);

// In SVG:
href=${AdditionSubstractionWholeDecadeGameIcon.maskImage.href}
```

**Important notes:**

- Use `../../images/` for games in `src/<GameName>/` directories (two levels up to reach images)
- Use `../images/` for components directly in `src/` (one level up)
- Always reference the `.href` property when using the URL in SVG `href` attributes
- Follow the same pattern used in `src/TimeCodes.ts` for `hourGlassIcons`

**Reference example from TimeCodes.ts:**
```typescript
export const hourGlassIcons: Record<TimeCode, URL> = {
  a: new URL('../images/hourglass_1min.png', import.meta.url),
  b: new URL('../images/hourglass_3min.png', import.meta.url),
  c: new URL('../images/hourglass_5min.png', import.meta.url),
};
```

### Issue 7: Not Moving Main App and Link Files to New Directory

**Problem:** When migrating an existing game, the main `<GameName>App.ts` and `<GameName>AppLink.ts` files are left in the `src/` directory instead of being moved to the new `src/<GameName>/` directory.

**Solution:** Always move both the main App file and the Link file to the new game directory during migration. Update all import references in other files (e.g., `URLshortener.ts`, HTML files) to point to the new location.

**Example:**

```typescript
// Move these files:
src/<GameName>App.ts → src/<GameName>/<GameName>App.ts
src/<GameName>AppLink.ts → src/<GameName>/<GameName>AppLink.ts

// Update imports in URLshortener.ts:
import { gameLink } from './<GameName>/<GameName>AppLink';

// Update script references in HTML files:
<script type="module" src="../src/<GameName>/<GameName>App.ts"></script>
```

## Common Patterns

**Import statement rules:**

- Combine all imports from one file in a single statement
- When migrating existing code, NEVER change import paths to files that don't exist
- Always verify the target file exists before changing an import statement
- Keep the original import path if you're unsure of the correct location

```typescript
// GOOD: Combine all imports from one file in a single statement
import {
  Fraction,
  FractionAndRepresentation,
  type FractionRepresentation,
  type DenumeratorPossibleNumerators,
} from '../Fraction';

// BAD: Multiple separate imports from the same file
import { Fraction } from '../Fraction';
import { FractionAndRepresentation } from '../Fraction';
import type { FractionRepresentation } from '../Fraction';
import type { DenumeratorPossibleNumerators } from '../Fraction';
```

**Color handling:**

```typescript
import { Color, getColorInfo } from '../Colors';
--fill-color: ${getColorInfo(variantInfo.iconColor).mainColorCode};
```

**Operator handling:**

```typescript
import { Operator, operatorToDutch, operatorToSymbol } from '../Operator';
operatorToDutch('plus') → 'plus'
operatorToSymbol('times') → '×'
```

**Component reuse principle:**

```typescript
// WRONG - recreating existing functionality
render(): HTMLTemplateResult {
  return html`
    <svg>
      <!-- Complex SVG recreation of die face -->
    </svg>
  `;
}

// CORRECT - using existing custom elements
render(): HTMLTemplateResult {
  return html`
    <die-face
      .dieFaceColor=${variantInfo.iconColor}
      .numberDots=${variantInfo.numberDots}
    ></die-face>
  `;
}
```

**Type safety and lint management:**

```typescript
// WRONG - unused parameter causes lint error
private parseUrlWithoutVariant(urlParams: URLSearchParams): void {
  // urlParams not used
}

// CORRECT - fix unused parameter
private parseUrlWithoutVariant(): void {
  // No unused parameter
}
```

**Time code handling:**

```typescript
import { type TimeCode, stringToTimeCode } from '../TimeCodes';
@property({ converter: stringToTimeCode })
accessor timeCode: TimeCode = 'a';
```

**Error handling:**

```typescript
import { UnexpectedValueError } from '../UnexpectedValueError';
throw new UnexpectedValueError(value);
```

## Checklist

- [ ] Create `src/<GameName>/` directory
- [ ] Create `<GameName>Variants.ts` (export `gameVariants`)
- [ ] Create `<GameName>Variants.test.ts`
- [ ] Create `<GameName>Icon.ts` with proper URL handling for images
- [ ] Create `<GameName>HourglassGameIcon.ts`
- [ ] Create `<GameName>IndexAppV2.ts`
- [ ] Create `<GameName>App.ts` with dual URL parsing
- [ ] Update main `index.html`
- [ ] Create game-specific HTML page
- [ ] Create index page HTML
- [ ] Update import references
- [ ] Run `npm run format:prettier`
- [ ] Test variant-based URLs
- [ ] Test explicit parameter URLs
- [ ] Run test suite
- [ ] Verify image URLs use `new URL()` pattern (not hardcoded strings)

## Migration Instructions for Existing Games

To migrate an existing game to the variant-based pattern:

### Step 1: Analyze Existing GameApp.ts

Identify:

- URL parameters currently parsed
- Game configuration properties used
- Current mainCode logic
- Game-specific state

**Important:** Ask the user which main game code (e.g., 'A', 'B', 'O') should be used. This must match `GameCodes.ts`. Ask if additional main codes are needed (most games only need one). No questions are needed if the main code is already provided in the prompt.

### Step 2: Create Variants File

Create `<GameName>Variants.ts` based on existing configuration:

- Define `VariantInfo` interface with game-specific properties
- Create variant codes for each configuration combination
- Implement `get<GameName>Variant` to return extended metadata
- Add helper functions for mainCode and description

### Step 3: Update GameApp.ts URL Parsing

Modify existing `GameApp.ts`:

- Extract current parsing logic into `parseUrlWithoutVariant`
- Add `parseUrlWithVariant` method using variants file
- Update main `parseUrl` to dispatch based on `variant` parameter presence

**CRITICAL:** When modifying import statements during migration:

- NEVER change import paths to files that don't exist
- Always verify the target file exists before changing an import
- If you need to add a new import, use the existing import structure as a guide
- Combine multiple imports from the same file into a single statement

```typescript
private parseUrl(): void {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('variant')) this.parseUrlWithVariant(urlParams);
  else this.parseUrlWithoutVariant(urlParams);
}
```

### Step 4-6: Create Components

Follow Steps 3-5 from the scaffolding instructions to create:

- `<GameName>Icon.ts`
- `<GameName>HourglassGameIcon.ts`
- `<GameName>IndexAppV2.ts`

### Step 7: Update HTML Files

Add script references to main `index.html`, create/update game-specific HTML page, and create index page HTML.

### Step 8: Test Both URL Modes

Test variant-based (`?variant=aa`) and explicit parameter URLs (`?operator=plus&maxAnswer=100`).

### Step 9: Update URLshortener2.ts

Add the game's main code to the `baseURLs` mapping in `src/URLshortener2.ts`:

```typescript
const baseURLs: Partial<Record<string, URL>> = {
  // ... existing mappings
  <MainCode>: new URL('./<GamePage>.html', baseUrl),
};
```

Replace `<MainCode>` with the game's main code (e.g., 'I', 'A', 'B') and `<GamePage>.html` with the game's HTML file.

**Important:** Do NOT modify `URLshortener.ts` - the existing shortcode system must continue working. Use URLshortener2.ts for new variant-based URL generation.

## Migration Checklist

- [ ] Analyze existing GameApp.ts
- [ ] Create `<GameName>Variants.ts`
- [ ] Add `parseUrlWithVariant` to GameApp.ts
- [ ] Rename existing parsing to `parseUrlWithoutVariant`
- [ ] Update main `parseUrl` dispatch logic
- [ ] Create icon, hourglass wrapper, and index app
- [ ] Update HTML files
- [ ] Test both URL modes
- [ ] Verify URLshortener2.ts has main code mapping

## Examples to Reference

- **MixedSumsGame**: Simple variant system with icon shapes and operators

  - `MixedSumsGameApp.ts` - Dual URL parsing
  - `MixedSumsGameVariants.ts` - Variant definitions
  - `MixedSumsGameIcon.ts` - SVG-based icon rendering
  - `MixedSumsGameIndexAppV2.ts` - Single-page index

- **MultiplicationTablesBalloonGame**: Complex variant system with multiple image types
  - `MultiplicationTablesBalloonGameV2.ts` - Dual URL parsing with image type selection
  - `MultiplicationTablesBalloonGameVariants.ts` - Complex variant logic
  - `MultiplicationTablesBalloonGameIcon.ts` - Component-based icon rendering
  - `MultiplicationTablesBalloonGameIndexAppV2.ts` - Multi-page index
````
