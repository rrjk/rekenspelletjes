import { html, css } from 'lit';
import type { CSSResultGroup, HTMLTemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { getClickTheRightPhotoOnNumberLineVariant } from './ClickTheRightPhotoOnNumberLineVariants';

import './ClickTheRightPhotoOnNumberLineGameIcon';
import { IconHourglassButtonV3 } from '../IconHourglassButtonV3';
import { RenderGameIconFunction } from '../RenderGameIconFunction';

export const renderClickTheRightPhotoOnNumberLineHourglassGameIcon: RenderGameIconFunction =
  (variant, classes, timeCode) => {
    return html`<click-the-right-photo-on-number-line-hourglass-game-icon
      class=${classMap(classes)}
      .variant=${variant}
      .timeCode=${timeCode}
    ></click-the-right-photo-on-number-line-hourglass-game-icon>`;
  };

@customElement('click-the-right-photo-on-number-line-hourglass-game-icon')
export class ClickTheRightPhotoOnNumberLineHourglassGameIcon extends IconHourglassButtonV3 {
  @property({ type: String })
  accessor variant = '';

  static override get aspectRatio(): number {
    return 1.8;
  }

  override get mainCode(): string {
    return getClickTheRightPhotoOnNumberLineVariant(this.variant).mainCode;
  }

  override get description(): string {
    return getClickTheRightPhotoOnNumberLineVariant(this.variant).description;
  }

  static get styles(): CSSResultGroup {
    return [
      super.styles,
      css`
        click-the-right-photo-on-number-line-game-icon {
          min-width: 0;
          min-height: 0;
          width: 100%;
          height: 100%;
        }
      `,
    ];
  }

  renderGameIcon(): HTMLTemplateResult {
    return html`
      <click-the-right-photo-on-number-line-game-icon
        .variant=${this.variant}
      ></click-the-right-photo-on-number-line-game-icon>
    `;
  }
}
