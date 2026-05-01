import { LitElement, html, css } from 'lit';
import type { CSSResultGroup, HTMLTemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { type TimeCode, stringToTimeCode } from '../TimeCodes';
import { getAdditionSubstractionWholeDecadeGameVariant } from './AdditionSubstractionWholeDecadeGameVariants';
import '../IconHourglassButtonV2';
import './AdditionSubstractionWholeDecadeGameIcon';

@customElement('addition-substraction-whole-decade-game-hourglass-game-icon')
export class AdditionSubstractionWholeDecadeGameHourglassGameIcon extends LitElement {
  @property({ converter: stringToTimeCode })
  accessor timeCode: TimeCode = 'a';

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

      addition-substraction-whole-decade-game-icon {
        height: 100%;
        width: 100%;
      }
    `;
  }

  render(): HTMLTemplateResult {
    const variantInfo = getAdditionSubstractionWholeDecadeGameVariant(
      this.variant,
    );
    return html` <icon-hourglass-button-v2
      .timeCode=${this.timeCode}
      .mainCode=${variantInfo.mainCode}
      .variant=${this.variant}
      .description=${variantInfo.description}
    >
      <addition-substraction-whole-decade-game-icon
        .variant=${this.variant}
      ></addition-substraction-whole-decade-game-icon>
    </icon-hourglass-button-v2>`;
  }
}
