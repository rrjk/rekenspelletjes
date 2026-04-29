import { LitElement, html, css } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import {
  HowManyFingersGameExtendedVariantInfo,
  getHowManyFingersGameVariant,
} from './HowManyFingersGameVariants';
import { getColorInfo } from '../Colors';
import '../HandFace';

@customElement('how-many-fingers-game-icon')
export class HowManyFingersGameIcon extends LitElement {
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

      hand-face {
        width: 95%;
        height: 95%;
      }
    `;
  }

  private getRepresentativeFingerCount(
    variantInfo: HowManyFingersGameExtendedVariantInfo,
  ): number {
    // For one hand variants (max <= 5), show a middle value (3-4)
    if (variantInfo.maxFingers <= 5) {
      const range = variantInfo.maxFingers - variantInfo.minFingers + 1;
      const middle = Math.floor(range / 2);
      return variantInfo.minFingers + middle;
    }
    // For two hands variants (max > 5), show 7 fingers (representative)
    return 7;
  }

  render(): HTMLTemplateResult {
    const variantInfo = getHowManyFingersGameVariant(this.variant);
    const fingerCount = this.getRepresentativeFingerCount(variantInfo);
    const colorInfo = getColorInfo(variantInfo.iconColor);

    return html`
      <style>
        :host {
          --fill-color: ${colorInfo.mainColorCode};
        }
      </style>
      <div class="iconContainer">
        <hand-face .nmbrToShow=${fingerCount}></hand-face>
      </div>
    `;
  }
}
