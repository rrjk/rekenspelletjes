import { html, css } from 'lit';
import type { CSSResultGroup, HTMLTemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { getCombineToSolveSumGameVariant } from './CombineToSolveSumGameVariants';
import { IconHourglassButtonV3 } from '../IconHourglassButtonV3';
import './CombineToSolveSumGameIcon';
import { RenderGameIconFunction } from '../RenderGameIconFunction';

export const renderCombineToSolveSumGameHourglassGameIcon: RenderGameIconFunction =
  (variant, classes, timeCode) => {
    return html`<combine-to-solve-sum-game-hourglass-game-icon
      class=${classMap(classes)}
      .variant=${variant}
      .timeCode=${timeCode}
    ></combine-to-solve-sum-game-hourglass-game-icon>`;
  };

@customElement('combine-to-solve-sum-game-hourglass-game-icon')
export class CombineToSolveSumGameHourglassGameIcon extends IconHourglassButtonV3 {
  @property({ type: String })
  accessor variant = '';

  static override get aspectRatio(): number {
    return 2;
  }

  static get styles(): CSSResultGroup {
    return [
      super.styles,
      css`
        combine-to-solve-sum-game-icon {
          height: 100%;
          width: 100%;
        }
      `,
    ];
  }

  override get mainCode(): string {
    return getCombineToSolveSumGameVariant(this.variant).mainCode;
  }

  override get description(): string {
    return getCombineToSolveSumGameVariant(this.variant).description;
  }

  renderGameIcon(): HTMLTemplateResult {
    return html`
      <combine-to-solve-sum-game-icon
        .variant=${this.variant}
      ></combine-to-solve-sum-game-icon>
    `;
  }
}
