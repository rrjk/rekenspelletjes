import { LitElement, html, css } from 'lit';
import type { CSSResultGroup, HTMLTemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { getColorInfo } from '../Colors';
import { getDivisionWithSplitGameVariant } from './DivisionWithSplitGameVariants';
import './DivideWithSplitWidget';

@customElement('division-with-split-game-icon')
export class DivisionWithSplitGameIcon extends LitElement {
  @property({ type: String })
  accessor variant = '';

  static get styles(): CSSResultGroup {
    return css`
      :host {
        display: grid;
        justify-items: center;
        align-items: center;
        min-width: 0;
        min-height: 0;
      }

      .iconContainer {
        width: 100%;
        height: 100%;
        border-radius: 10px;
        display: grid;
        justify-items: center;
        align-items: center;
        box-sizing: border-box;
      }

      divide-with-split-widget {
        width: 100%;
        height: 100%;
        min-width: 0;
        min-height: 0;
      }
    `;
  }

  render(): HTMLTemplateResult {
    const variantInfo = getDivisionWithSplitGameVariant(this.variant);

    return html`
      <div
        class="iconContainer"
        style="background-color: ${getColorInfo(variantInfo.iconColor)
          .mainColorCode}"
      >
        <divide-with-split-widget
          .fixedNumbers=${variantInfo.iconFixedNumbers}
          .fillInNumbers=${variantInfo.iconFillInNumbers}
          .showSubAnswers=${variantInfo.showSubAnswers}
          .showHelp=${variantInfo.showHelp}
          activeFillIn="answer"
        ></divide-with-split-widget>
      </div>
    `;
  }
}
