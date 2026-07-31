import { html, css } from 'lit';
import type { CSSResultGroup, HTMLTemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { getTensSplitGameVariant } from './TensSplitGameVariants';
import { IconHourglassButtonV3 } from '../IconHourglassButtonV3';
import type { RenderGameIconFunction } from '../RenderGameIconFunction';
import './TensSplitGameIcon';

/** Helper function to render the tens split game hourglass game icon */
export const renderTensSplitGameHourglassGameIcon: RenderGameIconFunction = (
  variant,
  classes,
  timeCode,
) => {
  return html`<tens-split-game-hourglass-game-icon
    class=${classMap(classes)}
    .variant=${variant}
    .timeCode=${timeCode}
  ></tens-split-game-hourglass-game-icon>`;
};

@customElement('tens-split-game-hourglass-game-icon')
export class TensSplitGameHourglassGameIcon extends IconHourglassButtonV3 {
  @property({ type: String })
  accessor variant = '';

  override get mainCode(): string {
    return getTensSplitGameVariant(this.variant).mainCode;
  }

  override get description(): string {
    return getTensSplitGameVariant(this.variant).description;
  }

  static get styles(): CSSResultGroup {
    return [
      super.styles,
      css`
        tens-split-game-icon {
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
      <tens-split-game-icon .variant=${this.variant}></tens-split-game-icon>
    `;
  }
}
