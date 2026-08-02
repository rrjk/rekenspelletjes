import { LitElement, html, css } from 'lit';
import type { CSSResultGroup, HTMLTemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { type TimeCode, stringToTimeCode } from '../TimeCodes';
import { getSortingGameVariant } from './SortingGameVariants';
import '../IconHourglassButtonV2';
import './SortingGameIcon';
import { RenderGameIconFunction } from '../RenderGameIconFunction';

export const renderSortingGameHourglassGameIcon: RenderGameIconFunction = (
  variant,
  classes,
  timeCode,
) => {
  return html`<sorting-game-hourglass-game-icon
    class=${classMap(classes)}
    .variant=${variant}
    .timeCode=${timeCode}
  ></sorting-game-hourglass-game-icon>`;
};

@customElement('sorting-game-hourglass-game-icon')
export class SortingGameHourglassGameIcon extends LitElement {
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

      sorting-game-icon {
        height: 100%;
        width: 100%;
      }
    `;
  }

  render(): HTMLTemplateResult {
    const variantInfo = getSortingGameVariant(this.variant);
    return html` <icon-hourglass-button-v2
      .timeCode=${this.timeCode}
      .mainCode=${variantInfo.mainCode}
      .variant=${this.variant}
      .description=${variantInfo.description}
    >
      <sorting-game-icon .variant=${this.variant}></sorting-game-icon>
    </icon-hourglass-button-v2>`;
  }
}
