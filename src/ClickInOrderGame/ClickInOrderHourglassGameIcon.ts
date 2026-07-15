import { html, css } from 'lit';
import type { CSSResultGroup, HTMLTemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { getClickInOrderGameVariant } from './ClickInOrderGameVariants';

import './ClickInOrderGameIcon';
import { IconHourglassButtonV3 } from '../IconHourglassButtonV3';
import { RenderGameIconFunction } from '../RenderGameIconFunction';

export const renderClickInOrderGameHourglassGameIcon: RenderGameIconFunction = (
  variant,
  classes,
  timeCode,
) => {
  return html`<click-in-order-hourglass-game-icon
    class=${classMap(classes)}
    .variant=${variant}
    .timeCode=${timeCode}
  ></click-in-order-hourglass-game-icon>`;
};

@customElement('click-in-order-hourglass-game-icon')
export class ClickInOrderHourglassGameIcon extends IconHourglassButtonV3 {
  @property({ type: String })
  accessor variant = '';

  static override get aspectRatio(): number {
    return 2.8;
  }

  /** Which mainCode to link to  */
  override get mainCode(): string {
    return getClickInOrderGameVariant(this.variant).mainCode;
  }

  /** Which description to show */
  override get description(): string {
    return getClickInOrderGameVariant(this.variant).description;
  }

  static get styles(): CSSResultGroup {
    return [
      super.styles,
      css`
        click-in-order-game-icon {
          height: 100%;
          width: 100%;
        }
      `,
    ];
  }

  renderGameIcon(): HTMLTemplateResult {
    return html`
      <click-in-order-game-icon
        .variant=${this.variant}
      ></click-in-order-game-icon>
    `;
  }
}
