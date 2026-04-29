import { LitElement, html, css, nothing } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import {
  getNumberlineArchesGameVariant,
  type NumberlineArchesGameExtendedVariantInfo,
} from './NumberlineArchesGameVariants';
import { getColorInfo } from '../Colors';
import type { ArchType } from '../NumberLineV2';
import '../NumberLineV2';

@customElement('numberline-arches-game-icon')
export class NumberlineArchesGameIcon extends LitElement {
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
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-rows: 1fr auto;
        align-items: center;
      }

      number-line-v2 {
        width: 100%;
        height: 100%;
      }

      .minMaxText {
        font-size: 20px;
        font-weight: bold;
        text-align: center;
      }
    `;
  }

  render(): HTMLTemplateResult {
    const variantInfo: NumberlineArchesGameExtendedVariantInfo =
      getNumberlineArchesGameVariant(this.variant);

    let belowArches: ArchType[] | typeof nothing = nothing;
    let aboveArches: ArchType[] | typeof nothing = nothing;

    if (variantInfo.operator === 'minus') {
      belowArches = variantInfo.archesForIcon;
    } else if (variantInfo.operator === 'plus') {
      aboveArches = variantInfo.archesForIcon;
    }

    const iconNumberLineLength =
      variantInfo.maxNumberline - variantInfo.minNumberline;

    return html`
      <style>
        :host {
          --fill-color: ${getColorInfo(variantInfo.iconColor).mainColorCode};
        }
      </style>
      <div class="iconContainer">
        <div class="iconContent">
          <number-line-v2
            min="0"
            max=${iconNumberLineLength}
            tickMarks="upToSingles"
            .belowArches=${belowArches}
            .aboveArches=${aboveArches}
          ></number-line-v2>
          <span class="minMaxText"
            >${variantInfo.min} － ${variantInfo.max}</span
          >
        </div>
      </div>
    `;
  }
}
