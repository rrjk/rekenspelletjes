import { LitElement, html, css } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import {
  getDotCountingGameVariant,
  type DotCountingGameExtendedVariantInfo,
} from './DotCountingGameVariants';
import { getColorInfo } from '../Colors';
import '../HandImage';
import '../DigitKeyboard';

@customElement('dot-counting-game-icon')
export class DotCountingGameIcon extends LitElement {
  @property({ type: String })
  accessor variant = '';

  static aspectRatio = 1;

  static get styles(): CSSResultGroup {
    return css`
      :host {
        aspect-ratio: ${DotCountingGameIcon.aspectRatio};
        min-width: 0;
        min-height: 0;
        container-type: size;
        display: grid;
        justify-items: center;
        align-items: center;
      }

      .iconContainer {
        aspect-ratio: ${DotCountingGameIcon.aspectRatio};
        min-width: 0;
        min-height: 0;
        background-color: var(--fill-color);
        display: grid;
        justify-items: center;
        align-items: center;
        box-sizing: border-box;
      }

      @container (aspect-ratio < ${DotCountingGameIcon.aspectRatio}) {
        .iconContainer {
          width: 100cqw;
        }
      }

      @container (aspect-ratio >= ${DotCountingGameIcon.aspectRatio}) {
        .iconContainer {
          height: 100cqh;
        }
      }

      .twoHandsSideBySide {
        grid-template-columns: 50% 50%;
        grid-template-rows: 100%;
      }

      .oneHandWithKeyboard {
        grid-template-columns: 58% 42%;
        grid-template-rows: 100%;
      }

      .twoHandsWithKeyboard {
        grid-template-columns: 50% 50%;
        grid-template-rows: 60% 40%;
      }

      .twoHandsWithKeyboard digit-keyboard {
        grid-column: 1 / span 2;
      }

      hand-with-dots {
        width: 95%;
        height: 95%;
        justify-self: center;
        align-self: center;
        --hand-stroke-color: #800000;
        --dot-color: #800000;
      }

      digit-keyboard {
        width: 95%;
        height: 95%;
        justify-self: center;
        align-self: center;
      }
    `;
  }

  private renderCountOnly(
    variantInfo: DotCountingGameExtendedVariantInfo,
  ): HTMLTemplateResult {
    const colorInfo = getColorInfo(variantInfo.iconColor);
    return html`
      <hand-with-dots
        numberDots="3"
        style="--hand-fill-color: ${colorInfo.mainColorCode}"
      ></hand-with-dots>
      <digit-keyboard></digit-keyboard>
    `;
  }

  private renderTwoHandsSideBySide(
    variantInfo: DotCountingGameExtendedVariantInfo,
  ): HTMLTemplateResult {
    const colorInfo = getColorInfo(variantInfo.iconColor);
    return html`
      <hand-with-dots
        numberDots="5"
        style="--hand-fill-color: ${colorInfo.mainColorCode}"
      ></hand-with-dots>
      <hand-with-dots
        numberDots="5"
        style="--hand-fill-color: ${colorInfo.mainColorCode}"
      ></hand-with-dots>
    `;
  }

  private renderTwoHandsWithDifference(
    variantInfo: DotCountingGameExtendedVariantInfo,
  ): HTMLTemplateResult {
    const colorInfo = getColorInfo(variantInfo.iconColor);
    return html`
      <hand-with-dots
        numberDots="7"
        style="--hand-fill-color: ${colorInfo.mainColorCode}"
      ></hand-with-dots>
      <hand-with-dots
        numberDots="7"
        style="--hand-fill-color: ${colorInfo.mainColorCode}"
      ></hand-with-dots>
      <digit-keyboard></digit-keyboard>
    `;
  }

  private renderEmptyVariant(): HTMLTemplateResult {
    return html` <hand-with-dots numberDots="7"></hand-with-dots> `;
  }

  private renderContent(
    variantInfo: DotCountingGameExtendedVariantInfo,
  ): HTMLTemplateResult {
    if (variantInfo.countOnly) {
      return this.renderCountOnly(variantInfo);
    } else if (variantInfo.includeDifference) {
      return this.renderTwoHandsWithDifference(variantInfo);
    } else {
      return this.renderTwoHandsSideBySide(variantInfo);
    }
  }

  render(): HTMLTemplateResult {
    const variantInfo = getDotCountingGameVariant(this.variant);

    if (this.variant === '') {
      return html`<div class="iconContainer">
        ${this.renderEmptyVariant()}
      </div>`;
    }

    const gridClass = {
      oneHandWithKeyboard: variantInfo.countOnly,
      twoHandsWithKeyboard: variantInfo.includeDifference,
      twoHandsSideBySide:
        !variantInfo.countOnly && !variantInfo.includeDifference,
    };

    return html`
      <div class="iconContainer ${classMap(gridClass)}">
        ${this.renderContent(variantInfo)}
      </div>
    `;
  }
}
