import { html, css } from 'lit';
import type { CSSResultGroup, HTMLTemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { getSumsWithSplitGameVariant } from './SumsWithSplitGameVariants';

import './SumsWithSplitGameIcon';
import { IconHourglassButtonV3 } from '../IconHourglassButtonV3';
import type { RenderGameIconFunction } from '../RenderGameIconFunction';

export const renderSumsWithSplitGameHourglassGameIcon: RenderGameIconFunction =
  (variant, classes, timeCode) => {
    return html`<sums-with-split-game-hourglass-game-icon
      class=${classMap(classes)}
      .variant=${variant}
      .timeCode=${timeCode}
    ></sums-with-split-game-hourglass-game-icon>`;
  };

@customElement('sums-with-split-game-hourglass-game-icon')
export class SumsWithSplitGameHourglassGameIcon extends IconHourglassButtonV3 {
  @property({ type: String })
  accessor variant = '';

  override get mainCode(): string {
    return getSumsWithSplitGameVariant(this.variant).mainCode;
  }

  override get description(): string {
    return getSumsWithSplitGameVariant(this.variant).description;
  }

  static get styles(): CSSResultGroup {
    return [
      super.styles,
      css`
        sums-with-split-game-icon {
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
      <sums-with-split-game-icon
        .variant=${this.variant}
      ></sums-with-split-game-icon>
    `;
  }
}
