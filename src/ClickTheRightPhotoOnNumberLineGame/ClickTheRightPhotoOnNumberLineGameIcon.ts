import { html, css, LitElement } from 'lit';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import {
  getClickTheRightPhotoOnNumberLineVariant,
  type ClickTheRightPhotoOnNumberLineExtendedVariantInfo,
} from './ClickTheRightPhotoOnNumberLineVariants';

import { HangingPhotoIconWithTextOverlay } from '../HangingPhotoIconWithTextOverlay';

@customElement('click-the-right-photo-on-number-line-game-icon')
export class ClickTheRightPhotoOnNumberLineGameIcon extends LitElement {
  @property({ type: String })
  accessor variant = '';

  static get styles(): CSSResultArray {
    return [
      css`
        :host {
          display: grid;
          justify-items: center;
          align-items: center;
          min-width: 0;
          min-height: 0;
          container-type: size;
        }

        @container (aspect-ratio < ${HangingPhotoIconWithTextOverlay.aspectRatio}) {
          hanging-photo-icon-with-text-overlay {
            min-width: 0;
            min-height: 0;
            width: 100%;
            height: auto;
          }
        }

        @container (aspect-ratio >= ${HangingPhotoIconWithTextOverlay.aspectRatio}) {
          hanging-photo-icon-with-text-overlay {
            min-width: 0;
            min-height: 0;
            width: auto;
            height: 100%;
          }
        }
      `,
    ];
  }

  render(): HTMLTemplateResult {
    const variantInfo: ClickTheRightPhotoOnNumberLineExtendedVariantInfo =
      getClickTheRightPhotoOnNumberLineVariant(this.variant);

    return html`
      <hanging-photo-icon-with-text-overlay
        .numberLeft=${variantInfo.minimum}
        .numberMiddle=${variantInfo.mid}
        .numberRight=${variantInfo.maximum}
        .smallestTickmark=${variantInfo.show1TickMarks
          ? 'tickMark1'
          : variantInfo.show5TickMarks
            ? 'tickMark5'
            : 'tickMark10'}
        ?showNumberMiddle=${variantInfo.showAll10Numbers}
        .brokenLine=${variantInfo.maximum > 20}
        .photoId=${variantInfo.photoId}
        .background=${variantInfo.iconColor}
      ></hanging-photo-icon-with-text-overlay>
    `;
  }
}
