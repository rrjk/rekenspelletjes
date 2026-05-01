# Container Query Scaling Pattern

This pattern ensures custom elements scale properly when users set:
- Both width and height
- Only width
- Only height

The element maintains its aspect ratio and fits within the specified dimensions.

## Use Case

When creating custom elements with fixed aspect ratios (like stars, balloons, icons) that need to:
- Scale responsively based on user-provided dimensions
- Maintain correct aspect ratio
- Work correctly when only width OR height is set
- Use SVG content that needs to scale with the container

## Pattern Overview

The pattern uses CSS Container Queries to dynamically adjust the SVG's width or height based on the container's aspect ratio. This ensures the SVG always fills the available space while maintaining its aspect ratio.

## Implementation

### Component Structure

```typescript
@customElement('your-element')
export class YourElement extends LitElement {
  // Static aspect ratio based on your SVG viewBox
  static aspectRatio = 213 / 181; // width / height

  static get styles(): CSSResultArray {
    return [
      css`
        :host {
          aspect-ratio: ${YourElement.aspectRatio};
          min-width: 0;
          min-height: 0;
          container-type: size;
          display: grid;
          justify-items: center;
          align-items: center;
          position: relative;
        }

        @container (aspect-ratio < ${YourElement.aspectRatio}) {
          svg {
            width: 100cqw;
          }
        }

        @container (aspect-ratio >= ${YourElement.aspectRatio}) {
          svg {
            height: 100cqh;
          }
        }
      `,
    ];
  }

  render() {
    return html`
      <svg viewBox="0 0 213 181">
        <!-- Your SVG content here -->
      </svg>
    `;
  }
}
```

## Key Components

### 1. Aspect Ratio on Host

```css
:host {
  aspect-ratio: ${YourElement.aspectRatio};
}
```

- Sets the element's intrinsic aspect ratio
- Based on your SVG viewBox dimensions (width / height)
- Ensures the element maintains correct proportions

### 2. Container Type

```css
:host {
  container-type: size;
}
```

- Enables container queries on the element
- Allows the element to query its own dimensions
- Required for `@container` rules to work

### 3. Min Dimensions

```css
:host {
  min-width: 0;
  min-height: 0;
}
```

- Prevents the element from being larger than its container
- Ensures proper containment behavior
- Critical for container queries to work correctly

### 4. Grid Layout

```css
:host {
  display: grid;
  justify-items: center;
  align-items: center;
}
```

- Centers the SVG content within the element
- Provides consistent positioning
- Works well with the container query logic

### 5. Container Queries

```css
@container (aspect-ratio < ${YourElement.aspectRatio}) {
  svg {
    width: 100cqw;
  }
}

@container (aspect-ratio >= ${YourElement.aspectRatio}) {
  svg {
    height: 100cqh;
  }
}
```

- **`100cqw`**: 100% of container query width
- **`100cqh`**: 100% of container query height
- When container is "wider" than target aspect ratio → set SVG height
- When container is "narrower" than target aspect ratio → set SVG width

## How It Works

### Scenario 1: Both Width and Height Set

```html
<your-element style="width: 200px; height: 200px;"></your-element>
```

- Container aspect ratio: 200/200 = 1.0
- Target aspect ratio: 213/181 ≈ 1.176
- Container (1.0) < Target (1.176) → SVG width = 100cqw
- SVG scales to fit width, height adjusts to maintain aspect ratio

### Scenario 2: Only Width Set

```html
<your-element style="width: 200px;"></your-element>
```

- Element uses aspect-ratio to calculate height automatically
- Height = 200 / 1.176 ≈ 170px
- Container queries work the same as above

### Scenario 3: Only Height Set

```html
<your-element style="height: 200px;"></your-element>
```

- Element uses aspect-ratio to calculate width automatically
- Width = 200 * 1.176 ≈ 235px
- Container queries work the same as above

## Multiple Aspect Ratios

If your element supports multiple aspect ratios (like short/long variants):

```typescript
@customElement('your-element')
export class YourElement extends LitElement {
  static aspectRatioShort = 160 / 220;
  static aspectRatioLong = 160 / 280;

  @property({ converter: stringToShortLong })
  accessor variant: 'short' | 'long' = 'long';

  static get styles(): CSSResultArray {
    return [
      css`
        :host {
          aspect-ratio: var(--aspect-ratio, ${YourElement.aspectRatioLong});
          /* ... other styles ... */
        }

        @container (aspect-ratio < ${YourElement.aspectRatioLong}) {
          svg.longVariant {
            width: 100cqw;
          }
        }

        @container (aspect-ratio >= ${YourElement.aspectRatioLong}) {
          svg.longVariant {
            height: 100cqh;
          }
        }

        @container (aspect-ratio < ${YourElement.aspectRatioShort}) {
          svg.shortVariant {
            width: 100cqw;
          }
        }

        @container (aspect-ratio >= ${YourElement.aspectRatioShort}) {
          svg.shortVariant {
            height: 100cqh;
          }
        }
      `,
    ];
  }

  render() {
    return html`
      <style>
        :root {
          --aspect-ratio: ${this.variant === 'short'
            ? YourElement.aspectRatioShort
            : YourElement.aspectRatioLong};
        }
      </style>

      <svg viewBox="0 0 160 ${this.variant === 'short' ? 220 : 280}" 
           class="${this.variant}">
        <!-- SVG content -->
      </svg>
    `;
  }
}
```

## Browser Support

Container queries are supported in:
- Chrome 105+
- Edge 105+
- Safari 16+
- Firefox 110+

For older browsers, consider using a polyfill or fallback approach.

## Example Usage

```html
<!-- Both dimensions set -->
<your-element style="width: 300px; height: 300px;"></your-element>

<!-- Only width set -->
<your-element style="width: 300px;"></your-element>

<!-- Only height set -->
<your-element style="height: 300px;"></your-element>

<!-- No dimensions (intrinsic size) -->
<your-element></your-element>
```

## Common Pitfalls

### 1. Forgetting `container-type: size`

Without this, `@container` queries won't work.

### 2. Not setting `min-width: 0` and `min-height: 0`

Without these, the element may not shrink properly within flex/grid containers.

### 3. Using incorrect aspect ratio calculation

Always use `width / height` (not `height / width`) to match CSS `aspect-ratio` behavior.

### 4. Mixing with `width: 100%` on SVG

Don't set explicit width/height on the SVG - let container queries handle it.

## When to Use This Pattern

Use this pattern when:
- Your element has a fixed aspect ratio
- You need responsive scaling
- Users might set width, height, or both
- Using SVG content that needs to scale with container

## Alternatives

### Simple CSS Scaling (Less Flexible)

```css
:host {
  width: 100%;
  height: auto;
}

svg {
  width: 100%;
  height: auto;
}
```

- Doesn't handle height-only sizing well
- Less control over aspect ratio maintenance

### JavaScript-Based Scaling (More Complex)

Calculate dimensions in JS and set styles dynamically.

- More code
- Performance overhead
- But works in older browsers
