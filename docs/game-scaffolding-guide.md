# Game Scaffolding Guide

This guide explains the pattern for creating game families with variant-based configuration (used by `MixedSumsGame` and `MultiplicationTablesBalloonGame`).

## Quick Reference

**Core files in `src/<GameName>/`:**

- `<GameName>Variants.ts` - Variant metadata (export `gameVariants` for testing)
- `<GameName>Variants.test.ts` - Variant tests
- `<GameName>Icon.ts` - Visual icon rendering
- `<GameName>HourglassGameIcon.ts` - Hourglass button wrapper
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
    // Add other derived properties
  };
}
```

**Key points:**

- Don't create duplicate variants for different time codes (handled in index app)
- Export `<gameName>Variants` for testing

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

### Step 4: Create `<GameName>HourglassGameIcon.ts`

Wraps the game icon in an hourglass button. Copy this template exactly - only change the custom element name and imports.

```typescript
import { LitElement, html, css } from 'lit';
import type { CSSResultGroup, HTMLTemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { type TimeCode, stringToTimeCode } from '../TimeCodes';
import { get<GameName>Variant } from './<GameName>Variants';
import '../IconHourglassButtonV2';
import './<GameName>Icon';

@customElement('<game-name>-hourglass-game-icon')
export class <GameName>HourglassGameIcon extends LitElement {
  @property({ converter: stringToTimeCode })
  accessor timeCode: TimeCode = 'a';

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
        icon-hourglass-button-v2 { height: 100cqh; }
      }

      @container (aspect-ratio <= 1.8) {
        icon-hourglass-button-v2 { width: 100cqw; }
      }

      <game-name>-icon { height: 100%; width: 100%; }
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
      <game-name>-icon .variant=${this.variant}></game-name>-icon>
    </icon-hourglass-button-v2>`;
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
- [ ] Create `<GameName>Icon.ts`
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

## Migration Instructions for Existing Games

To migrate an existing game to the variant-based pattern:

### Step 1: Analyze Existing GameApp.ts

Identify:

- URL parameters currently parsed
- Game configuration properties used
- Current mainCode logic
- Game-specific state

**Important:** Ask the user which main game code (e.g., 'A', 'B', 'O') should be used. This must match `GameCodes.ts`. Ask if additional main codes are needed (most games only need one).

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
