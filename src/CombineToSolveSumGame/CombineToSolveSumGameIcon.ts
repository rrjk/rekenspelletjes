import { LitElement, html, css } from 'lit';
import type { CSSResultGroup, HTMLTemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { getCombineToSolveSumGameVariant } from './CombineToSolveSumGameVariants';

import '../HeartImage';

@customElement('combine-to-solve-sum-game-icon')
export class CombineToSolveSumGameIcon extends LitElement {
  static aspectRatio = 2; // Aspect ratio for the game icon
  @property({ type: Boolean })
  accessor isGeneric = false; // Whether to show a generic icon or specific numbers

  @property({ type: String })
  accessor variant = '';

  static get styles(): CSSResultGroup {
    return css`
      :host {
        display: grid;
        justify-items: center;
        align-items: center;
        aspect-ratio: 2 / 1;
        min-width: 0;
        min-height: 0;
        container-type: size;
      }

      @container (aspect-ratio < ${CombineToSolveSumGameIcon.aspectRatio}) {
        .heartDiv {
          width: 100cqw;
          height: auto;
        }
      }

      @container (aspect-ratio >= ${CombineToSolveSumGameIcon.aspectRatio}) {
        .heartDiv {
          height: 100cqh;
          width: auto;
        }
      }

      .heartDiv {
        display: grid;
        grid-template-columns: 1fr 1fr;
        justify-items: center;
        align-items: center;
        border: 2px solid #a60020;
        border-radius: 15px;
      }

      heart-image {
        height: 88%;
        width: 88%;
        max-height: 100%;
        max-width: 100%;
      }
    `;
  }

  render(): HTMLTemplateResult {
    const variantInfo = getCombineToSolveSumGameVariant(this.variant);
    let iconNumbers = variantInfo.iconNumbers;
    if (this.isGeneric) {
      iconNumbers = [2, 8];
    }
    return html`
      <div class="heartDiv">
        <heart-image value=${iconNumbers[0]}></heart-image>
        <heart-image value=${iconNumbers[1]}></heart-image>
      </div>
    `;
  }
}
