import { LitElement, html, css } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { type TimeCode, stringToTimeCode } from '../TimeCodes';
import { getSplitBalloonGameVariant } from './SplitBalloonGameVariants';

import '../IconHourglassButtonV2';
import './SplitBalloonGameIcon';
import { RenderGameIconFunction } from '../RenderGameIconFunction';

export const renderSplitBalloonGameHourglassGameIcon: RenderGameIconFunction = (
  variant,
  classes,
  timeCode,
) => {
  return html`<split-balloon-game-hourglass-game-icon
    class=${classMap(classes)}
    .variant=${variant}
    .timeCode=${timeCode}
  ></split-balloon-game-hourglass-game-icon>`;
};

@customElement('split-balloon-game-hourglass-game-icon')
export class SplitBalloonGameHourglassGameIcon extends LitElement {
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

      split-balloon-game-icon {
        height: 100%;
        width: 100%;
      }
    `;
  }

  render(): HTMLTemplateResult {
    const variantInfo = getSplitBalloonGameVariant(this.variant);
    return html` <icon-hourglass-button-v2
      .timeCode=${this.timeCode}
      .mainCode=${variantInfo.mainCode}
      .variant=${this.variant}
      .description=${variantInfo.description}
    >
      <split-balloon-game-icon
        .variant=${this.variant}
      ></split-balloon-game-icon>
    </icon-hourglass-button-v2>`;
  }
}
