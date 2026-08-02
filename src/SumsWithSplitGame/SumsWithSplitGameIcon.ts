import { LitElement, html, css, nothing, svg } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import {
  getSumsWithSplitGameVariant,
  type SumsWithSplitGameExtendedVariantInfo,
} from './SumsWithSplitGameVariants';
import { getColorInfo } from '../Colors';

@customElement('sums-with-split-game-icon')
export class SumsWithSplitGameIcon extends LitElement {
  @property({ type: String })
  accessor variant = '';

  static aspectRatio = 1.15;

  static get styles(): CSSResultGroup {
    return css`
      :host {
        aspect-ratio: ${SumsWithSplitGameIcon.aspectRatio};
        min-width: 0;
        min-height: 0;
        container-type: size;
        display: block;
      }

      svg {
        width: 100%;
        height: 100%;
        display: block;
      }

      text.splitOnceText {
        font-family: monospace;
        font-size: 60px;
      }

      text.splitTwiceText {
        font-family: monospace;
        font-size: 45px;
      }

      rect.surroundingBox {
        stroke: #000000;
        stroke-width: 3;
        fill: var(--iconColor, #ffffff);
      }

      rect.splitBox {
        stroke: #000000;
        stroke-width: 2;
        fill: white;
      }

      line {
        stroke: #000000;
        stroke-width: 3;
      }
    `;
  }

  private formatEquation(sumText: string): string {
    if (sumText === '') {
      return '';
    }
    return `${sumText}=`;
  }

  renderSplitOnceBoxes() {
    return svg`
      <line
        x1="143"
        y1="120"
        x2="103"
        y2="170"
        stroke="#000000"
        stroke-width="3"
      />
      <line
        x1="143"
        y1="120"
        x2="183"
        y2="170"
        stroke="#000000"
        stroke-width="3"
      />
      <rect class="splitBox" x="78" y="175" width="50" height="50" />
      <rect class="splitBox" x="158" y="175" width="50" height="50" />`;
  }

  renderSplitTwiceBoxes() {
    return svg`
      <line
        x1="150"
        y1="100"
        x2="120"
        y2="120"
        stroke="#000000"
        stroke-width="3"
      />
      <line
        x1="150"
        y1="100"
        x2="180"
        y2="120"
        stroke="#000000"
        stroke-width="3"
      />
      <rect class="splitBox" x="102" y="125" width="36" height="36" />
      <rect class="splitBox" x="66" y="125" width="36" height="36" />
      <rect class="splitBox" x="162" y="125" width="36" height="36" />
      <line
        x1="180"
        y1="165"
        x2="160"
        y2="190"
        stroke="#000000"
        stroke-width="3"
      />
      <line
        x1="180"
        y1="165"
        x2="200"
        y2="190"
        stroke="#000000"
        stroke-width="3"
      />
      <rect class="splitBox" x="140" y="195" width="36" height="36" />
      <rect class="splitBox" x="184" y="195" width="36" height="36" />
  `;
  }

  renderSplitOnce(
    variantInfo: SumsWithSplitGameExtendedVariantInfo,
  ): HTMLTemplateResult {
    let topSum, bottomSum: string;
    if (
      variantInfo.exampleSums.text1 != '' &&
      variantInfo.exampleSums.text2 != ''
    ) {
      topSum = variantInfo.exampleSums.text2;
      bottomSum = variantInfo.exampleSums.text1;
    } else if (variantInfo.exampleSums.text1 != '') {
      topSum = '';
      bottomSum = variantInfo.exampleSums.text1;
    } else {
      topSum = '';
      bottomSum = variantInfo.exampleSums.text2;
    }

    return html`
      <svg viewBox="0 0 255 255">
        <rect
          class="surroundingBox"
          x="5"
          y="5"
          width="245"
          height="245"
          rx="28"
        />
        <text
          class="splitOnceText"
          x="195"
          y="50"
          text-anchor="end"
          dominant-baseline="middle"
        >
          ${this.formatEquation(topSum)}
        </text>
        <text
          class="splitOnceText"
          x="195"
          y="100"
          text-anchor="end"
          dominant-baseline="middle"
        >
          ${this.formatEquation(bottomSum)}
        </text>
        ${variantInfo.showSplits === 'showSplits'
          ? this.renderSplitOnceBoxes()
          : nothing}
      </svg>
    `;
  }

  renderSplitTwice(
    variantInfo: SumsWithSplitGameExtendedVariantInfo,
  ): HTMLTemplateResult {
    let topSum, bottomSum: string;
    if (
      variantInfo.exampleSums.text1 != '' &&
      variantInfo.exampleSums.text2 != ''
    ) {
      topSum = variantInfo.exampleSums.text2;
      bottomSum = variantInfo.exampleSums.text1;
    } else if (variantInfo.exampleSums.text1 != '') {
      topSum = '';
      bottomSum = variantInfo.exampleSums.text1;
    } else {
      topSum = '';
      bottomSum = variantInfo.exampleSums.text2;
    }

    return html`
      <svg viewBox="0 0 255 255">
        <rect
          class="surroundingBox"
          x="5"
          y="5"
          width="245"
          height="245"
          rx="28"
        />
        <text
          class="splitTwiceText"
          x="195"
          y="35"
          text-anchor="end"
          dominant-baseline="middle"
        >
          ${this.formatEquation(topSum)}
        </text>
        <text
          class="splitTwiceText"
          x="195"
          y="80"
          text-anchor="end"
          dominant-baseline="middle"
        >
          ${this.formatEquation(bottomSum)}
        </text>
        ${variantInfo.showSplits === 'showSplits'
          ? this.renderSplitTwiceBoxes()
          : nothing}
      </svg>
    `;
  }

  render(): HTMLTemplateResult | typeof nothing {
    const variantInfo = getSumsWithSplitGameVariant(this.variant);
    const colorInfo = getColorInfo(variantInfo.iconColor);
    const gameType = variantInfo.game;

    let mainContent: HTMLTemplateResult | typeof nothing = nothing;
    if (gameType === 'split1Till20' || gameType === 'split1Till100') {
      mainContent = this.renderSplitOnce(variantInfo);
    } else {
      mainContent = this.renderSplitTwice(variantInfo);
    }

    return html` <style>
        :host {
          --iconColor: ${colorInfo.mainColorCode};
        }
      </style>
      ${mainContent}`;
  }
}
