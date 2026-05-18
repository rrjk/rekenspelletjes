import { LitElement, html, css } from 'lit';
import type { CSSResultGroup, HTMLTemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { getClickInOrderGameVariant } from './ClickInOrderGameVariants';

import '../IconHourglassButtonV2';
import './ClickInOrderGameIcon';

@customElement('click-in-order-hourglass-game-icon')
export class ClickInOrderHourglassGameIcon extends LitElement {
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

      click-in-order-game-icon {
        height: 100%;
        width: 100%;
      }
    `;
  }

  render(): HTMLTemplateResult {
    const variantInfo = getClickInOrderGameVariant(this.variant);
    return html`
      <icon-hourglass-button-v2
        .mainCode=${variantInfo.mainCode}
        .variant=${this.variant}
        .description=${variantInfo.description}
      >
        <click-in-order-game-icon
          .variant=${this.variant}
        ></click-in-order-game-icon>
      </icon-hourglass-button-v2>
    `;
  }
}
