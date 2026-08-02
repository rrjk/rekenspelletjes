import { html, css, LitElement } from 'lit';
import type { CSSResultGroup, HTMLTemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import {
  getJumpOnNumberLineVariant,
  JumpOnNumberLineExtendedVariantInfo,
} from './JumpOnNumberLineVariants';
import './JumpingJanWithTextOverlay';

type SmallestTickmark = 'noTickMark' | 'tickMark1' | 'tickMark5' | 'tickMark10';

function determineSmallestTickmark(
  variantInfo: JumpOnNumberLineExtendedVariantInfo,
): SmallestTickmark {
  if (variantInfo.numberLineParameters.show1TickMarks) {
    return 'tickMark1';
  }
  if (variantInfo.numberLineParameters.show5TickMarks) {
    return 'tickMark5';
  }
  if (variantInfo.numberLineParameters.show10TickMarks) {
    return 'tickMark10';
  }
  return 'noTickMark';
}

function determineNumberlineMinMaxText(
  variantInfo: JumpOnNumberLineExtendedVariantInfo,
): string {
  return `${variantInfo.numberLineParameters.minimum}-${variantInfo.numberLineParameters.maximum}`;
}

@customElement('jump-on-numberline-game-icon')
export class JumpOnNumberLineGameIcon extends LitElement {
  @property({ type: String })
  accessor variant = '';

  static get styles(): CSSResultGroup {
    return css`
      :host {
        display: grid;
        justify-items: center;
        align-items: center;
        container-type: size;
      }

      jumping-jan-with-text-overlay {
        min-width: 0;
        min-height: 0;
        width: 100%;
        height: 100%;
      }
    `;
  }

  render(): HTMLTemplateResult {
    const variantInfo = getJumpOnNumberLineVariant(this.variant);
    return html`
      <jumping-jan-with-text-overlay
        .text1=${determineNumberlineMinMaxText(variantInfo)}
        .smallestTickmark=${determineSmallestTickmark(variantInfo)}
        .background=${variantInfo.iconColor}
      ></jumping-jan-with-text-overlay>
    `;
  }
}
