import { LitElement, html, css } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { type TimeCode, stringToTimeCode } from '../TimeCodes';
import { getHowManyFingersGameVariant } from './HowManyFingersGameVariants';

import '../IconHourglassButtonV2';
import './HowManyFingersGameIcon';

@customElement('how-many-fingers-hourglass-game-icon')
export class HowManyFingersHourglassGameIcon extends LitElement {
  /** What time to use for the hourglass */
  @property({ converter: stringToTimeCode })
  accessor timeCode: TimeCode = 'a';

  /** Which variant to link to */
  @property({ type: String })
  accessor variant = '';

  static get styles(): CSSResultGroup {
    return css`
      :host {
        display: grid;
        justify-items: center;
        align-items: center;
        aspect-ratio: 1.8 / 1;
        container-type: size;
        position: relative;
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

      how-many-fingers-game-icon {
        height: 100%;
        width: 100%;
      }
    `;
  }

  render(): HTMLTemplateResult {
    const variantInfo = getHowManyFingersGameVariant(this.variant);
    return html` <icon-hourglass-button-v2
      .timeCode=${this.timeCode}
      .mainCode=${variantInfo.mainCode}
      .variant=${this.variant}
      .description=${variantInfo.description}
    >
      <how-many-fingers-game-icon
        .variant=${this.variant}
      ></how-many-fingers-game-icon>
    </icon-hourglass-button-v2>`;
  }
}
