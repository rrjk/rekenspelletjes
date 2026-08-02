import { html, css } from 'lit';
import type { CSSResultGroup, HTMLTemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { getJumpOnNumberLineVariant } from './JumpOnNumberLineVariants';

import './JumpOnNumberLineGameIcon';
import { IconHourglassButtonV3 } from '../IconHourglassButtonV3';
import { RenderGameIconFunction } from '../RenderGameIconFunction';

export const renderJumpOnNumberLineHourglassGameIcon: RenderGameIconFunction = (
  variant,
  classes,
  timeCode,
) => {
  return html`<jump-on-numberline-hourglass-game-icon
    class=${classMap(classes)}
    .variant=${variant}
    .timeCode=${timeCode}
  ></jump-on-numberline-hourglass-game-icon>`;
};

@customElement('jump-on-numberline-hourglass-game-icon')
export class JumpOnNumberLineHourglassGameIcon extends IconHourglassButtonV3 {
  @property({ type: String })
  accessor variant = '';

  override get mainCode(): string {
    return getJumpOnNumberLineVariant(this.variant).mainCode;
  }

  override get description(): string {
    return getJumpOnNumberLineVariant(this.variant).description;
  }

  static get styles(): CSSResultGroup {
    return [
      super.styles,
      css`
        jump-on-numberline-game-icon {
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
      <jump-on-numberline-game-icon
        .variant=${this.variant}
      ></jump-on-numberline-game-icon>
    `;
  }
}
