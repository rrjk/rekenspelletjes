import { LitElement, html, css } from 'lit';
import type { CSSResultGroup, HTMLTemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { type ClassInfo, classMap } from 'lit/directives/class-map.js';

import { type TimeCode, stringToTimeCode } from '../TimeCodes';
import { getAdditionSubstractionWithinDecadeGameVariant } from './AdditionSubstractionWithinDecadeGameVariants';
import '../IconHourglassButtonV2';
import './AdditionSubstractionWithinDecadeGameIcon';

/** Helper function to render the addition/subtraction within decade game hourglass game icon
 * @param timeCode The time code to use for the icon
 * @param variant The variant of the game to use for the icon
 * @param classes Optional classes to add to the icon
 * @returns The HTML template result for the icon
 */
export function renderAdditionSubstractionWithinDecadeGameHourglassGameIcon(
  timeCode: TimeCode,
  variant: string,
  classes: ClassInfo = {},
): HTMLTemplateResult {
  return html`<addition-substraction-within-decade-game-hourglass-game-icon
    class=${classMap(classes)}
    .variant=${variant}
    .timeCode=${timeCode}
  ></addition-substraction-within-decade-game-hourglass-game-icon>`;
}

@customElement('addition-substraction-within-decade-game-hourglass-game-icon')
export class AdditionSubstractionWithinDecadeGameHourglassGameIcon extends LitElement {
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

      addition-substraction-within-decade-game-icon {
        height: 100%;
        width: 100%;
      }
    `;
  }

  render(): HTMLTemplateResult {
    const variantInfo = getAdditionSubstractionWithinDecadeGameVariant(
      this.variant,
    );
    return html` <icon-hourglass-button-v2
      .timeCode=${this.timeCode}
      .mainCode=${variantInfo.mainCode}
      .variant=${this.variant}
      .description=${variantInfo.description}
    >
      <addition-substraction-within-decade-game-icon
        .variant=${this.variant}
      ></addition-substraction-within-decade-game-icon>
    </icon-hourglass-button-v2>`;
  }
}
