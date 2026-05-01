import { LitElement, html, css } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { getEggCountingGameVariant } from './EggCountingGameVariants';

const eggCartonUrl = new URL('../../images/eggCarton.png', import.meta.url);

@customElement('egg-counting-game-icon')
export class EggCountingGameIcon extends LitElement {
  @property({ type: String })
  accessor variant = '';

  // Square aspect ratio
  static aspectRatio = 1;

  static get styles(): CSSResultGroup {
    return css`
      :host {
        aspect-ratio: ${EggCountingGameIcon.aspectRatio};
        min-width: 0;
        min-height: 0;
        container-type: size;
        display: grid;
        justify-items: center;
        align-items: center;
      }

      .iconContainer {
        aspect-ratio: ${EggCountingGameIcon.aspectRatio};
        min-width: 0;
        min-height: 0;
        border-radius: 25%;
        border: 2px solid black;
        background-color: transparent;
        display: grid;
        justify-items: center;
        align-items: center;
        box-sizing: border-box;
      }

      @container (aspect-ratio < ${EggCountingGameIcon.aspectRatio}) {
        .iconContainer {
          width: 100cqw;
        }
      }

      @container (aspect-ratio >= ${EggCountingGameIcon.aspectRatio}) {
        .iconContainer {
          height: 100cqh;
        }
      }

      .eggCartonImage {
        width: 95%;
        height: 95%;
        object-fit: contain;
      }
    `;
  }

  render(): HTMLTemplateResult {
    // Get variant info to ensure proper initialization, though not used in rendering
    getEggCountingGameVariant(this.variant);

    return html`
      <div class="iconContainer">
        <img
          class="eggCartonImage"
          src=${eggCartonUrl.href}
          alt="Eierdoos"
          draggable="false"
        />
      </div>
    `;
  }
}
