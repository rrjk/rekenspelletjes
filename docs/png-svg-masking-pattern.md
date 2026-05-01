# PNG + SVG Masking Pattern

This pattern allows you to combine a PNG bitmap image with dynamic SVG elements, useful when you have:
- A character/animal image in PNG format (not available as SVG)
- Need to overlay dynamic SVG elements (like colored stars, shapes, etc.)
- Want parts of the PNG to appear in front of the SVG (like claws/hands)

## Use Case

When you have a fantasy animal holding an object (like a star), and you want to:
- Change the object's color dynamically using SVG
- Keep the animal's hands/claws in front of the object (not recolored)
- Ensure proper scaling together

## Pattern Overview

The pattern uses three layers in a single SVG:
1. **SVG overlay** (colored element, masked to specific area)
2. **Base PNG image** (transparent where the SVG should show)
3. **Mask image** (white/opaque where SVG should appear, transparent elsewhere)

## Implementation

### Required Images

1. **Base image** (`*-transparent.png`): The character/animal with the object area made transparent
   - This allows the SVG overlay to show through
   - Parts that should appear in front (like claws) remain opaque

2. **Mask image** (`*-mask.png`): A white image showing only where the SVG should appear
   - White/opaque areas = SVG visible
   - Transparent areas = SVG hidden
   - Should exclude any foreground elements (like claws)

### Component Structure

```typescript
@customElement('your-element')
export class YourElement extends LitElement {
  @property({ type: Number })
  accessor nmbrToShow = 3;

  @property({ converter: stringToColor })
  accessor color: Color = 'yellow';

  // Static - not user-configurable to prevent misalignment
  static baseImage = 'your-character-transparent.png';
  static maskImage = 'your-character-mask.png';

  static aspectRatio = 213 / 181; // Match your image dimensions

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

        .number {
          font-family: Arial;
          font-weight: 700;
          fill: #ffffff;
          stroke: #000000;
          stroke-width: 0.15em;
          paint-order: stroke;
          text-anchor: middle;
          dominant-baseline: middle;
          font-size: 63px;
        }
      `,
    ];
  }

  render() {
    return html`
      <svg viewBox="0 0 213 181">
        <defs>
          <!-- Mask definition -->
          <mask id="elementMask">
            <image
              href="../images/${YourElement.maskImage}"
              x="0"
              y="0"
              width="213"
              height="181"
            />
          </mask>

          <!-- Gradient for the SVG element -->
          <radialGradient id="elementGradient" cx="30%" cy="30%" r="70%">
            <stop
              offset="0%"
              stop-color=${saturate(
                getColorInfo(this.color).mainColorCode,
                0.6,
              )}
            />
            <stop
              offset="50%"
              stop-color=${getColorInfo(this.color).mainColorCode}
            />
            <stop
              offset="100%"
              stop-color=${desaturate(
                getColorInfo(this.color).mainColorCode,
                0.4,
              )}
            />
          </radialGradient>
        </defs>

        <!-- SVG element with mask applied -->
        <g mask="url(#elementMask)">
          <!-- Your SVG shape (rect, polygon, circle, etc.) -->
          <rect
            x="30"
            y="0"
            width="183"
            height="181"
            fill="url(#elementGradient)"
            stroke=${desaturate(getColorInfo(this.color).mainColorCode, 0.3)}
            stroke-width="2"
          />

          <!-- Text/number overlay -->
          <text x="128" y="104" class="number">${this.nmbrToShow}</text>
        </g>

        <!-- Base image as SVG bitmap (rendered last to appear on top) -->
        <image
          href="../images/${YourElement.baseImage}"
          x="0"
          y="0"
          width="213"
          height="181"
        />
      </svg>
    `;
  }
}
```

## Key Points

### Layer Order Matters
1. **SVG overlay first** - masked to only show where the object should be
2. **Base image last** - rendered on top so foreground elements (claws) appear in front

### Container Queries for Scaling
- Use `container-type: size` on `:host`
- Use `@container` queries to set SVG width/height based on aspect ratio
- This ensures proper scaling when users set width, height, or both

### Static Image Paths
- Make `baseImage` and `maskImage` static class attributes
- Not user-configurable to prevent misalignment
- Changing these would break the masking alignment

### Mask Image Requirements
- Should be a simple white/transparent image
- White areas = SVG visible
- Transparent areas = SVG hidden
- No need for filters if mask is already simple black/white

### Gradient Strength
- Use stronger saturation values (e.g., 0.6, 0.4) for more pronounced gradients
- Adjust based on your visual preference

## Example Usage

```html
<your-element nmbrToShow="5" color="blue"></your-element>
<your-element nmbrToShow="7" color="red"></your-element>
<your-element nmbrToShow="3" color="green"></your-element>
```

## When to Use This Pattern

Use this pattern when:
- You have PNG images that cannot be converted to SVG
- Need dynamic colors/shapes overlaid on the PNG
- Want parts of the PNG to appear in front of the overlay
- Need proper responsive scaling

## Alternatives

If you have SVG versions of your images, consider:
- Using pure SVG for everything (simpler, more flexible)
- Using CSS filters on the entire image (less precise)
- Canvas pixel manipulation (more complex, but precise)
