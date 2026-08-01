import { html, css } from 'lit';
import type { CSSResultGroup, HTMLTemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { getDivisionWithSplitGameVariant } from './DivisionWithSplitGameVariants';
import { IconHourglassButtonV3 } from '../IconHourglassButtonV3';
import type { RenderGameIconFunction } from '../RenderGameIconFunction';
import './DivisionWithSplitGameIcon';

export const renderDivisionWithSplitGameHourglassGameIcon: RenderGameIconFunction =
  (variant, classes, timeCode) => {
    return html`<division-with-split-game-hourglass-game-icon
      class=${classMap(classes)}
      .variant=${variant}
      .timeCode=${timeCode}
    ></division-with-split-game-hourglass-game-icon>`;
  };

@customElement('division-with-split-game-hourglass-game-icon')
export class DivisionWithSplitGameHourglassGameIcon extends IconHourglassButtonV3 {
  @property({ type: String })
  accessor variant = '';

  override get mainCode(): string {
    return getDivisionWithSplitGameVariant(this.variant).mainCode;
  }

  override get description(): string {
    return getDivisionWithSplitGameVariant(this.variant).description;
  }

  static get styles(): CSSResultGroup {
    return [
      super.styles,
      css`
        division-with-split-game-icon {
          min-width: 0;
          min-height: 0;
          width: 100%;
          height: 100%;
        }
      `,
    ];
  }

  override renderGameIcon(): HTMLTemplateResult {
    return html`
      <division-with-split-game-icon
        .variant=${this.variant}
      ></division-with-split-game-icon>
    `;
  }
}
