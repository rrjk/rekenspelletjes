import { LitElement, html, css } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { getAdditionSubstractionWithinDecadeGameVariant } from './AdditionSubstractionWithinDecadeGameVariants';
import '../GameIconWithTextOverlay';

@customElement('addition-substraction-within-decade-game-icon')
export class AdditionSubstractionWithinDecadeGameIcon extends LitElement {
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

  render(): HTMLTemplateResult {
    const variantInfo = getAdditionSubstractionWithinDecadeGameVariant(
      this.variant,
    );
    const { text1, text2 } = variantInfo.exampleSums;

    return html`
      <div class="iconContainer">
        <div class="iconContent">
          <game-icon-with-text-overlay
            iconcolor=${variantInfo.iconColor}
            image="kite"
            text1=${text1}
            text2=${text2}
          ></game-icon-with-text-overlay>
        </div>
      </div>
    `;
  }
}
