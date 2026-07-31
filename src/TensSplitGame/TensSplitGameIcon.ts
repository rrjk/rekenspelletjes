import { LitElement, html, css } from 'lit';
import type { CSSResultGroup, HTMLTemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { getTensSplitGameVariant } from './TensSplitGameVariants';
import './TensSplitWidget';

@customElement('tens-split-game-icon')
export class TensSplitGameIcon extends LitElement {
  @property({ type: String })
  accessor variant = '';

  static get styles(): CSSResultGroup {
    return css`
      :host {
        display: grid;
        justify-items: center;
        align-items: center;
        min-width: 0;
        min-height: 0;
      }

      tens-split-widget {
        width: 100%;
        height: 100%;
        min-width: 0;
        min-height: 0;
      }
    `;
  }

  render(): HTMLTemplateResult {
    const variantInfo = getTensSplitGameVariant(this.variant);

    return html`
      <tens-split-widget
        .numberToSplit=${variantInfo.iconNumberToSplit}
        .activeDigit=${variantInfo.iconActiveDigit}
      ></tens-split-widget>
    `;
  }
}
