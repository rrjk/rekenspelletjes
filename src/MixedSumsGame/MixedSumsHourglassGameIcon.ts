import { LitElement, html, css } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { type ClassInfo, classMap } from 'lit/directives/class-map.js';

import { type TimeCode, stringToTimeCode } from '../TimeCodes';
import { getMixedSumsGameVariant } from './MixedSumsGameVariants';

import '../IconHourglassButtonV2';
import './MixedSumsGameIcon';

/** Helper function to render the mixed sums game hourglass game icon
 * @param timeCode The time code to use for the icon
 * @param variant The variant of the game to use for the icon
 * @param classes Optional classes to add to the icon
 * @returns The HTML template result for the icon
 */
export function renderMixedSumsGameHourglassGameIcon(
  timeCode: TimeCode,
  variant: string,
  classes: ClassInfo = {},
): HTMLTemplateResult {
  return html`<mixed-sums-hourglass-game-icon
    class=${classMap(classes)}
    .variant=${variant}
    .timeCode=${timeCode}
  ></mixed-sums-hourglass-game-icon>`;
}

@customElement('mixed-sums-hourglass-game-icon')
export class MixedSumsHourglassGameIcon extends LitElement {
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

      mixed-sums-game-icon {
        height: 100%;
        width: 100%;
      }
    `;
  }

  render(): HTMLTemplateResult {
    const variantInfo = getMixedSumsGameVariant(this.variant);
    return html` <icon-hourglass-button-v2
      .timeCode=${this.timeCode}
      .mainCode=${variantInfo.mainCode}
      .variant=${this.variant}
      .description=${variantInfo.description}
    >
      <mixed-sums-game-icon .variant=${this.variant}></mixed-sums-game-icon>
    </icon-hourglass-button-v2>`;
  }
}
