import { LitElement, html, css } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { getSplitBalloonGameVariant } from './SplitBalloonGameVariants';

import '../NumberedBalloon';

@customElement('split-balloon-game-icon')
export class SplitBalloonGameIcon extends LitElement {
  /** Game variant */
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
      numbered-balloon {
        width: 100%;
        height: 100%;
      }
    `;
  }

  render(): HTMLTemplateResult {
    const variantInfo = getSplitBalloonGameVariant(this.variant);

    // Convert numbers to split strings
    const numbers = variantInfo.numbersToSplit;
    const splits: string[] = [];

    if (numbers.length === 1) {
      splits.push(numbers[0].toString());
    } else {
      // Group numbers for display (e.g., "1 2 3", "4 5 10")
      const sorted = [...numbers].sort((a, b) => a - b);
      if (
        sorted.length === 6 &&
        sorted[0] === 1 &&
        sorted[4] === 5 &&
        sorted[5] === 10
      ) {
        splits.push('1 2 3', '4 5 10');
      } else if (sorted.length === 5 && sorted[0] === 6 && sorted[4] === 10) {
        splits.push('6 7', '8 9 10');
      } else if (sorted.length === 10 && sorted[0] === 1 && sorted[9] === 10) {
        splits.push('1 2 3', '4 5 6 7', '8 9 10');
      } else {
        // Default: split into groups of 3
        for (let i = 0; i < sorted.length; i += 3) {
          const group = sorted.slice(i, i + 3).join(' ');
          splits.push(group);
        }
      }
    }

    const stringsToShow = [...splits, '/ \\'];
    let fontSizeFactor = 1;
    if (splits.length === 1) fontSizeFactor = 0.55;
    else if (splits.length === 2) fontSizeFactor = 0.4;
    else if (splits.length === 3) fontSizeFactor = 0.3;

    return html`
      <numbered-balloon
        .color=${variantInfo.iconColor}
        .stringsToShow=${stringsToShow}
        .fontSizeFactor=${fontSizeFactor}
        ropeLength="short"
      >
      </numbered-balloon>
    `;
  }
}
