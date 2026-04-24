# Game Scaffolding Guide for AI

This document provides detailed instructions for creating a new game family following the established pattern used by `MixedSumsGame` and `MultiplicationTablesBalloonGame`.

## Pattern Overview

Each game family consists of these core files in `src/<GameName>/`:

1. **`<GameName>Variants.ts`** - Variant metadata and configuration
2. **`<GameName>GameIcon.ts`** - Visual icon rendering
3. **`<GameName>HourglassGameIcon.ts`** - Hourglass button wrapper
4. **`<GameName>IndexAppV2.ts`** - Index page component

## AI Scaffolding Instructions

### Step 1: Create the Game Directory

Create a new directory under `src/`:

```
src/<GameName>/
```

Replace `<GameName>` with your game name in PascalCase (e.g., `MyNewGame`).

### Step 2: Create `<GameName>Variants.ts`

This file defines all game variants and their metadata.

**Template:**

```typescript
import { Color } from '../Colors';
import { UnexpectedValueError } from '../UnexpectedValueError';
// Import other game-specific types as needed

// Define game-specific icon types if needed
export const gameIcons = ['iconType1', 'iconType2'] as const;
export type GameIcon = (typeof gameIcons)[number];

// Define the base variant interface
interface VariantInfo {
  iconColor: Color;
  // Add game-specific properties here:
  // - icon: GameIcon (if multiple icon types)
  // - operators: Operator[] (if using operators)
  // - difficulty bounds (maxAnswer, maxTable, tableSet, etc.)
}

// Define the default variant
const defaultVariant: VariantInfo = {
  iconColor: 'green',
  // Add default values for all properties
};

// Define all variants keyed by short codes (aa, ab, ac, ba, bb, etc.)
const gameVariants: Record<string, VariantInfo> = {
  aa: defaultVariant,
  ab: {
    iconColor: 'red',
    // override other properties as needed
  },
  // Add more variants...
};

// Define the extended variant interface
export interface ExtendedVariantInfo extends VariantInfo {
  mainCode: string;
  description: string;
  // Add other derived properties:
  // - colorSet: readonly Color[]
  // - image: AscendingImage
  // - tables: number[]
}

// Create helper functions to determine derived properties
function determineMainCode(variantInfo: VariantInfo): string {
  // Logic to determine mainCode based on variant properties
  // Example: switch on icon type or operator combination
  return 'A'; // Default
}

function createDescription(variantInfo: VariantInfo): string {
  // Logic to create human-readable description
  // Use operatorToDutch() if using operators
  // Use joinWithEn() from '../Utils' for natural Dutch lists (e.g., "1, 2 en 3")
  return 'Game description';
}

// Main function to get extended variant info
export function get<GameName>Variant(variant: string): ExtendedVariantInfo {
  const variantInfo = gameVariants[variant] || defaultVariant;

  const mainCode = determineMainCode(variantInfo);
  const description = createDescription(variantInfo);

  return {
    ...variantInfo,
    mainCode,
    description,
    // Add other derived properties
  };
}
```

**Key Points:**

- Use short codes like `aa`, `ab`, `ac` for variants
- **Variant naming pattern**: First letter indicates the section (a, b, c...), second letter increments within the section (a, b, c...)
  - Section 1 variants: `aa`, `ab`, `ac`, `ad`, etc.
  - Section 2 variants: `ba`, `bb`, `bc`, `bd`, etc.
  - Section 3 variants: `ca`, `cb`, `cc`, `cd`, etc.
- **Do not create duplicate variants for different time codes** - time codes are handled separately in the index app (each variant row shows two buttons with different time codes)
- Group variants by category (a-series, b-series, etc.)
- The `get<GameName>Variant` function is the single source of truth for variant metadata
- Return `ExtendedVariantInfo` with all properties needed by icons and index pages
- **Export `gameVariants`** so it can be tested

### Step 2.5: Create `<GameName>Variants.test.ts`

This file tests the variant definitions to ensure they are correct.

**Template:**

```typescript
import {
  get<GameName>Variant,
  gameVariants,
  type ExtendedVariantInfo,
} from './<GameName>Variants';

test('gameVariants has expected keys', () => {
  expect(Object.keys(gameVariants)).toStrictEqual([
    'aa',
    'ab',
    'ac',
    // ... add all variant codes
  ]);
});

test('get<GameName>Variant for aa', () => {
  const extendedVariant = get<GameName>Variant('aa');
  expect(extendedVariant.iconColor).toBe('lavender');
  expect(extendedVariant.mainCode).toBe('A');
  expect(extendedVariant.description).toBe('Game description');
  // Test other properties as needed
});

// Add tests for each variant...

test('get<GameName>Variant for unknown variant returns default', () => {
  const extendedVariant = get<GameName>Variant('unknown');
  expect(extendedVariant.iconColor).toBe('green');
  // Test default values
});

test('ExtendedVariantInfo type validation', () => {
  const variant: ExtendedVariantInfo = get<GameName>Variant('aa');
  expect(typeof variant.iconColor).toBe('string');
  // Test other type validations
});
```

**Key Points:**

- Test that `gameVariants` has all expected keys
- Test representative variants for each code path (e.g., single digit, multi digit, full range)
- Test that unknown variants return the default
- Test type validation for `ExtendedVariantInfo`
- Export `gameVariants` from the variants file to enable testing
- **Don't test every variant individually** - test key code paths only to keep tests maintainable

### Step 3: Create `<GameName>GameIcon.ts`

This file renders the visual icon for each variant.

**Template:**

```typescript
import { LitElement, html, css } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import {
  ExtendedVariantInfo,
  get<GameName>Variant,
} from './<GameName>Variants';

import { UnexpectedValueError } from '../UnexpectedValueError';
// Import other shared components as needed

@customElement('<game-name>-game-icon')
export class <GameName>GameIcon extends LitElement {
  /** Gamevariant */
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
      /* Add icon-specific styles */
    `;
  }

  // Create render methods for each icon type if multiple types exist
  private renderIconType1(variantInfo: ExtendedVariantInfo): HTMLTemplateResult {
    return html`<!-- SVG or component for icon type 1 -->`;
  }

  private renderIconType2(variantInfo: ExtendedVariantInfo): HTMLTemplateResult {
    return html`<!-- SVG or component for icon type 2 -->`;
  }

  render(): HTMLTemplateResult {
    const variantInfo = get<GameName>Variant(this.variant);

    // Choose render method based on variant properties
    if (variantInfo.icon === 'iconType1') {
      return this.renderIconType1(variantInfo);
    } else if (variantInfo.icon === 'iconType2') {
      return this.renderIconType2(variantInfo);
    } else {
      throw new UnexpectedValueError(variantInfo.icon);
    }
  }
}
```

**Key Points:**

- Accept a `variant` property (string)
- Use `get<GameName>Variant(this.variant)` to get metadata
- Render different icon types based on variant properties
- Use CSS container queries for responsive sizing
- Import shared components from `../` directory

### Step 4: Create `<GameName>HourglassGameIcon.ts`

This wraps the game icon in an hourglass button.

**Template:**

```typescript
import { LitElement, html, css } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { type TimeCode, stringToTimeCode } from '../TimeCodes';
import { get<GameName>Variant } from './<GameName>Variants';

import '../IconHourglassButtonV2';
import './<GameName>GameIcon';

@customElement('<game-name>-hourglass-game-icon')
export class <GameName>HourglassGameIcon extends LitElement {
  /** What time to use for the hourglass */
  @property({ converter: stringToTimeCode })
  accessor timeCode: TimeCode = 'a';

  /** Which variant to link to */
  @property({ type: String })
  accessor variant = '';

  static get styles(): CSSResultGroup {
    return css`
      :host {
        display: grid;
        justify-items: center;
        align-items: center;
        aspect-ratio: 1.8 / 1;
        container-type: size;
        position: relative;
      }

      @container (aspect-ratio > 1.8) {
        icon-hourglass-button-v2 {
          height: 100cqh;
        }
      }

      @container (aspect-ratio <= 1.8) {
        icon-hourglass-button-v2 {
          width: 100cqw;
        }
      }

      <game-name>-game-icon {
        height: 100%;
        width: 100%;
      }
    `;
  }

  render(): HTMLTemplateResult {
    const variantInfo = get<GameName>Variant(this.variant);
    return html` <icon-hourglass-button-v2
      .timeCode=${this.timeCode}
      .mainCode=${variantInfo.mainCode}
      .variant=${this.variant}
      .description=${variantInfo.description}
    >
      <<game-name>-game-icon .variant=${this.variant}></<game-name>-game-icon>
    </icon-hourglass-button-v2>`;
  }
}
```

**Key Points:**

- Copy this template exactly - only change the custom element name and imports
- The CSS and structure are identical across all games
- Pass `timeCode`, `mainCode`, `variant`, and `description` to the hourglass button

### Step 5: Create `<GameName>IndexAppV2.ts`

This creates the index page showing all variant buttons.

**Template:**

```typescript
import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import './<GameName>HourglassGameIcon';

// Define page types if supporting multiple index pages
type IndexPage = 'defaultPage'; // Add more as needed

// Converter function for page type
export function convertIndexPage(value: string | null): IndexPage {
  switch (value) {
    case 'defaultPage':
      return value;
    default:
      return 'defaultPage';
  }
}

interface SectionInfoType {
  title: string;
  rows: string[];
}

interface IndexPageType {
  defaultPage: SectionInfoType[];
  // Add more pages if needed
}

// Define sections with variant codes
const sections: IndexPageType = {
  defaultPage: [
    {
      title: 'Section Title',
      rows: ['aa', 'ab', 'ac', 'ad'],
    },
    {
      title: 'Another Section',
      rows: ['ba', 'bb', 'bc', 'bd'],
    },
  ],
};

const durations = ['a', 'b'];

@customElement('<game-name>-index-app-v2')
export class <GameName>IndexApp extends LitElement {
  @property({ converter: convertIndexPage })
  accessor indexPage: IndexPage = 'defaultPage';

  static get styles(): CSSResultArray {
    return [
      css`
        :host {
          font-size: x-large;
        }
        .buttonTable {
          position: relative;
          display: flex;
          row-gap: 10px;
          flex-wrap: wrap;
          justify-content: space-around;
          width: min(400px, 90vw);
        }
        <game-name>-hourglass-game-icon {
          width: 47%;
        }
      `,
    ];
  }

  renderRow(variant: string): HTMLTemplateResult {
    return html`
      <<game-name>-hourglass-game-icon
        variant=${variant}
        timeCode=${durations[0]}
      ></<game-name>-hourglass-game-icon>
      <<game-name>-hourglass-game-icon
        variant=${variant}
        timeCode=${durations[1]}
      ></<game-name>-hourglass-game-icon>
    `;
  }

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
    renderItems.push(
      html` <p>
        <a href="index.html">Terug naar het hoofdmenu</a>
      </p>`,
    );
    return renderItems;
  }
}
```

**Key Points:**

- Group variants into sections with titles
- Each row shows two buttons with different time codes
- Use `durations` array to control time options
- Add a link back to the main index page

### Step 6: Create `<GameName>App.ts` with URL Parsing

This is the main game component that handles URL parsing for both variant-based and explicit parameter modes.

**Template:**

```typescript
import { html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { GameLogger } from '../GameLogger';
// Import other game-specific base classes as needed
// import { TimeLimitedGame2 } from '../TimeLimitedGame2';
// import { AscendingItemsGameApp } from '../AscendingItemsGameApp';

import { get<GameName>Variant } from './<GameName>Variants';

@customElement('<game-name>-app')
export class <GameName>App extends /* TimeLimitedGame2 or AscendingItemsGameApp */ {
  // Game state properties
  @state()
  private accessor gameProperty1 = defaultValue1;
  @state()
  private accessor gameProperty2 = defaultValue2;

  // Private game configuration properties
  private eligibleOperators: Operator[] = [];
  private eligibleTables: number[] = [];
  private maximumNumber = 10;
  private gameText = '';
  private gameLogger = new GameLogger('A', '');

  constructor() {
    super();
    this.parseUrl();
  }

  /** Parse URL with variant parameter */
  private parseUrlWithVariant(urlParams: URLSearchParams): void {
    const variant = urlParams.get('variant');
    if (variant === null)
      throw Error(
        'Internal SW Error, parseUrlWithVariant called while there is no variant in the URL',
      );
    const extendedVariantInfo = get<GameName>Variant(variant);

    // Set game configuration from variant metadata
    this.eligibleTables = extendedVariantInfo.tables;
    this.eligibleOperators = extendedVariantInfo.operators;
    this.maximumNumber = extendedVariantInfo.maxAnswer;
    // Set other game-specific properties from variant

    // Configure game logger
    this.gameLogger.setMainCode(extendedVariantInfo.mainCode);
    this.gameLogger.setSubCode(variant);
    this.gameText = extendedVariantInfo.description;

    // Set any other derived properties
    this.determineMaxDigits();
  }

  /** Parse URL with explicit parameters (legacy support) */
  private parseUrlWithoutVariant(urlParams: URLSearchParams): void {
    // Set default values
    this.eligibleOperators = [];
    this.eligibleTables = [];
    this.maximumNumber = 10;
    this.gameText = 'Default game description';

    // Parse operators from URL
    const operatorsFromUrl = urlParams.getAll('operator');
    for (const operatorString of operatorsFromUrl) {
      const operator = operators.find(elm => elm === operatorString);
      if (operator !== undefined) this.eligibleOperators.push(operator);
    }
    if (this.eligibleOperators.length === 0)
      this.eligibleOperators = [...defaultOperators];

    // Parse other parameters from URL
    const maxFromUrl = urlParams.get('maxAnswer');
    if (maxFromUrl !== null) {
      const maxAsInt = parseInt(maxFromUrl, 10);
      if (!Number.isNaN(maxAsInt)) this.maximumNumber = maxAsInt;
    }

    // Parse tables/other game-specific parameters
    const tablesFromUrl = urlParams.getAll('table');
    for (const tableAsString of tablesFromUrl) {
      const table = parseInt(tableAsString, 10);
      if (!Number.isNaN(table) && table >= 1 && table <= 100) {
        this.eligibleTables.push(table);
      }
    }
    if (this.eligibleTables.length === 0)
      this.eligibleTables = [2, 3, 4, 5, 6, 7, 8, 9, 10];

    // Determine mainCode based on parsed parameters
    this.gameLogger.setMainCode(this.determineMainCodeFromParams());

    // Set derived properties
    this.determineMaxDigits();
  }

  /** Main URL parsing function */
  private parseUrl(): void {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('variant')) this.parseUrlWithVariant(urlParams);
    else this.parseUrlWithoutVariant(urlParams);
  }

  /** Determine mainCode from explicit parameters */
  private determineMainCodeFromParams(): string {
    // Logic to determine mainCode based on parsed parameters
    // Example: switch on operator combination or table ranges
    return 'A'; // Default
  }

  /** Determine derived properties like max digits */
  private determineMaxDigits(): void {
    // Calculate max digits for operands and answer based on game configuration
  }

  // Implement other required game methods...
  // - startNewGame()
  // - welcomeMessage
  // - welcomeDialogTitle
  // - executeGameOverActions()
  // - renderGameContent()
  // - etc.
}
```

**Key Points:**

- Implement two URL parsing methods: `parseUrlWithVariant` and `parseUrlWithoutVariant`
- `parseUrlWithVariant` uses `get<GameName>Variant` to get all configuration from a single variant code
- `parseUrlWithoutVariant` parses individual URL parameters for legacy support
- Both methods set the same internal game properties for consistency
- Use `GameLogger` to track game statistics with mainCode and subCode
- The `parseUrl` method dispatches to the appropriate parser based on URL parameters

### Step 7: Update HTML Files

Add the new game to the relevant HTML files:

1. **Main index.html** - Add script reference and icon:

```html
<script type="module" src="../src/<GameName>/<GameName>GameIcon.ts"></script>
```

2. **Create game-specific HTML page** (e.g., `<GamePage>.html`):

```html
<<game-name>-app></<game-name>-app>
<script type="module" src="../src/<GameName>/<GameName>App.ts"></script>
```

3. **Create index page HTML** (e.g., `index<GameName>.html`):

```html
<<game-name>-index-app-v2 indexPage="defaultPage"></<game-name>-index-app-v2>
<script type="module" src="../src/<GameName>/<GameName>IndexAppV2.ts"></script>
```

### Step 8: Update Import References

If the new game is referenced from other files (e.g., `TestApp.ts`, `URLshortener.ts`), update the import paths:

```typescript
import './<GameName>/<GameName>GameIcon';
```

## Common Patterns to Reuse

### Color Handling

```typescript
import { Color, getColorInfo } from '../Colors';
// In render:
--fill-color: ${getColorInfo(variantInfo.iconColor).mainColorCode};
```

### Operator Handling

```typescript
import { Operator, operatorToDutch, operatorToSymbol } from '../Operator';
// Convert to Dutch text: operatorToDutch('plus') → 'plus'
// Convert to symbol: operatorToSymbol('times') → '×'
```

### Time Code Handling

```typescript
import { type TimeCode, stringToTimeCode } from '../TimeCodes';
// Use as property converter:
@property({ converter: stringToTimeCode })
accessor timeCode: TimeCode = 'a';
```

### Error Handling

```typescript
import { UnexpectedValueError } from '../UnexpectedValueError';
// Throw for unexpected values:
throw new UnexpectedValueError(value);
```

## Checklist for New Games

- [ ] Create `src/<GameName>/` directory
- [ ] Create `<GameName>Variants.ts` with variant definitions
- [ ] Create `<GameName>Variants.test.ts` with test suite
- [ ] Create `<GameName>GameIcon.ts` with icon rendering
- [ ] Create `<GameName>HourglassGameIcon.ts` with hourglass wrapper
- [ ] Create `<GameName>IndexAppV2.ts` with index page
- [ ] Create `<GameName>App.ts` with URL parsing (variant-based and explicit)
- [ ] Update main `index.html` with script reference
- [ ] Create game-specific HTML page
- [ ] Create index page HTML
- [ ] Update import references in other files
- [ ] Test the game renders correctly
- [ ] Test all variant codes work
- [ ] Test explicit parameter URLs work
- [ ] Test index page navigation
- [ ] Run test suite to verify variants

## Migration Instructions for Existing Games

If you have an existing game with a `GameApp.ts` file and want to migrate it to the variant-based pattern:

### Step 1: Analyze Existing GameApp.ts

Examine the current `GameApp.ts` to identify:

- What URL parameters it currently parses
- What game configuration properties it uses
- What the current mainCode logic is
- What game-specific state it maintains

### Step 2: Create Variants File

Create `<GameName>Variants.ts` based on the existing game configuration:

1. Define `VariantInfo` interface with all game-specific properties
2. Create variant codes for each common configuration combination
3. Implement `get<GameName>Variant` to return extended metadata
4. Add helper functions to determine mainCode and description

**Example migration approach:**

- If the game has operator parameters, create variants for each operator combination
- If the game has difficulty levels, create variants for each level
- Group variants logically (a-series for easy, b-series for medium, etc.)

### Step 3: Update GameApp.ts URL Parsing

Modify the existing `GameApp.ts` to support both parsing methods:

1. Keep the existing `parseUrl` method or create a new one
2. Extract the current URL parsing logic into `parseUrlWithoutVariant`
3. Add new `parseUrlWithVariant` method that uses the variants file
4. Update the main `parseUrl` to dispatch based on `variant` parameter presence

**Example changes:**

```typescript
// Before (single parsing method)
private parseUrl(): void {
  const urlParams = new URLSearchParams(window.location.search);
  // Parse all parameters directly
}

// After (dual parsing methods)
private parseUrl(): void {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('variant')) this.parseUrlWithVariant(urlParams);
  else this.parseUrlWithoutVariant(urlParams);
}
```

### Step 4: Create Icon Component

Create `<GameName>GameIcon.ts`:

1. Import `get<GameName>Variant` from the variants file
2. Accept a `variant` property
3. Render the icon based on variant metadata
4. Use the same visual style as the existing game

### Step 5: Create Hourglass Wrapper

Create `<GameName>HourglassGameIcon.ts`:

1. Copy the template from the scaffolding guide
2. Update imports and custom element name
3. No other changes needed

### Step 6: Create Index App

Create `<GameName>IndexAppV2.ts`:

1. Define sections based on your variant groupings
2. List variant codes in each section
3. Use the hourglass wrapper to render buttons

### Step 7: Update HTML Files

1. Add script references to main `index.html`
2. Create or update the game-specific HTML page
3. Create a new index page HTML file

### Step 8: Test Both URL Modes

Ensure both URL modes work:

**Variant-based URL:**

```
<GamePage>.html?variant=aa
```

**Explicit parameter URL:**

```
<GamePage>.html?operator=plus&operator=minus&maxAnswer=100
```

### Step 9: Clean Up Legacy Code

Once migration is complete and tested:

- Remove any legacy GameLink files (they are no longer needed)
- Update any hardcoded URLs to use variant codes where appropriate
- Consider deprecating explicit parameter URLs in documentation

### Migration Checklist

- [ ] Analyze existing GameApp.ts URL parsing
- [ ] Create `<GameName>Variants.ts` with all existing configurations
- [ ] Add `parseUrlWithVariant` method to GameApp.ts
- [ ] Rename existing parsing to `parseUrlWithoutVariant`
- [ ] Update main `parseUrl` to dispatch based on variant parameter
- [ ] Create `<GameName>GameIcon.ts`
- [ ] Create `<GameName>HourglassGameIcon.ts`
- [ ] Create `<GameName>IndexAppV2.ts`
- [ ] Update HTML files
- [ ] Test variant-based URLs
- [ ] Test explicit parameter URLs (ensure backward compatibility)
- [ ] Remove legacy GameLink files
- [ ] Update documentation

## Examples to Reference

- **MixedSumsGame**: Simple variant system with icon shapes and operators

  - `MixedSumsGameApp.ts` - Shows dual URL parsing (variant + explicit parameters)
  - `MixedSumsGameVariants.ts` - Variant definitions with icon types and operators
  - `MixedSumsGameIcon.ts` - SVG-based icon rendering
  - `MixedSumsGameIndexAppV2.ts` - Single-page index with sections

- **MultiplicationTablesBalloonGame**: Complex variant system with multiple image types
  - `MultiplicationTablesBalloonGameV2.ts` - Shows dual URL parsing with image type selection
  - `MultiplicationTablesBalloonGameVariants.ts` - Complex variant logic with table sets and image types
  - `MultiplicationTablesBalloonGameIcon.ts` - Component-based icon rendering (balloon, rocket, zeppelin, UFO)
  - `MultiplicationTablesBalloonGameIndexAppV2.ts` - Multi-page index supporting different game types

Use these as templates when creating similar game types.
