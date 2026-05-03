import { LitElement, html, css } from 'lit';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { customElement, property } from 'lit/decorators.js';

import { getDieFaceGameVariant } from './DieFaceGameVariants';
import '../DieFace';

@customElement('die-face-game-icon')
export class DieFaceGameIcon extends LitElement {
  static aspectRatio = 1; // Square aspect ratio for die face

  @property({ type: String })
  accessor variant = '';

  static get styles(): CSSResultArray {
    return [
      css`
        :host {
          display: grid;
          justify-items: center;
          align-items: center;
          aspect-ratio: ${DieFaceGameIcon.aspectRatio};
          min-width: 0;
          min-height: 0;
          container-type: size;
        }

        .iconContent {
          width: 90%;
          height: 90%;
          min-width: 0;
          min-height: 0;
        }

        @container (aspect-ratio < ${DieFaceGameIcon.aspectRatio}) {
          .iconContent {
            width: 100cqw;
            height: auto;
          }
        }

        @container (aspect-ratio >= ${DieFaceGameIcon.aspectRatio}) {
          .iconContent {
            height: 100cqh;
            width: auto;
          }
        }

        die-face {
          width: 100%;
          height: 100%;
        }
      `,
    ];
  }

  render(): HTMLTemplateResult {
    const variantInfo = getDieFaceGameVariant(this.variant);

    return html`
      <div class="iconContent">
        <die-face
          .dieFaceColor=${variantInfo.iconColor}
          .numberDots=${variantInfo.numberDots}
        ></die-face>
      </div>
    `;
  }
}
