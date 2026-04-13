import { LitElement, html, css } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { type TimeCode, stringToTimeCode } from './TimeCodes';
import { getGameVariant } from './MultiplicationTablesBalloonGameVariants';

import './IconHourglassButtonV2';
import './MultiplicationTablesBalloonGameIcon';

@customElement('multiplication-tables-balloon-hourglass-game-icon')
export class MultiplicationTablesBalloonHourglassGameIcon extends LitElement {
  /** What time to use for the hourglass */

  @property({ converter: stringToTimeCode })
  accessor timeCode: TimeCode = 'a';

  /** Which variant to link to  */
  @property({ type: String })
  accessor variant = 'a';

  static get styles(): CSSResultGroup {
    return css`
      :host {
        display: grid;
        justify-items: center;
        align-items: center;
        aspect-ratio: 1.8 / 1;
        container-type: size;
      }

      @container (aspect-ratio > 1.8) {
        icon-hourglass-button-v2 {
          height: 100cqh;
        }
      }

      @container (aspect-ratio <= 1.8) {
        icon-hourglass-button-v2 {
          width: 100cqw;
        }
      }

      multiplication-tables-balloon-game-icon {
        height: 100%;
        width: 100%;
      }
    `;
  }

  render(): HTMLTemplateResult {
    console.log(
      `Rendering hourglass icon with variant ${this.variant} and timeCode ${this.timeCode}`,
    );
    const variantInfo = getGameVariant(this.variant);
    return html` <icon-hourglass-button-v2
      .timeCode=${this.timeCode}
      .mainCode=${variantInfo.mainCode}
      .variant=${this.variant}
      .description=${variantInfo.description}
    >
      <multiplication-tables-balloon-game-icon
        .variant=${this.variant}
      ></multiplication-tables-balloon-game-icon>
    </icon-hourglass-button-v2>`;
  }
}
