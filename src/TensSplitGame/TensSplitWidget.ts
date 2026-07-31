import { LitElement, html, css, svg } from 'lit';
import type {
  CSSResultArray,
  HTMLTemplateResult,
  SVGTemplateResult,
} from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('tens-split-widget')
export class TensSplitWidget extends LitElement {
  @property({ type: Number })
  accessor numberToSplit = 28;
  @property({ type: Number })
  accessor activeDigit = 0; // Which digit should be active, counting starts at 0

  static get styles(): CSSResultArray {
    return [
      css`
        :host {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        text {
          dominant-baseline: mathematical;
          font-size: 80px;
        }

        .middleAligned {
          text-anchor: middle;
        }

        .leftAligned {
          text-anchor: start;
        }

        .splitLine {
          stroke: black;
          stroke-width: 3px;
        }

        .boxLine {
          stroke: black;
          stroke-width: 2px;
        }

        .outerBoxFill {
          fill: transparent;
        }

        .activeFilled {
          fill: lightblue;
        }

        .notActiveFilled {
          fill: transparent;
        }
      `,
    ];
  }

  renderNumberToSplit(): SVGTemplateResult {
    return svg`<text class="middleAligned" x="210" y="50">${this.numberToSplit}</text>`;
  }

  renderTens(): SVGTemplateResult {
    if (this.activeDigit === 1) {
      return svg`<text class="leftAligned" x="96" y="245">${Math.floor(
        this.numberToSplit / 10,
      )}</text>`;
    }
    if (this.activeDigit > 1) {
      return svg`<text class="leftAligned" x="96" y="245">${Math.floor(
        this.numberToSplit / 10,
      )}0</text>`;
    }
    return svg``;
  }

  renderUnits(): SVGTemplateResult {
    if (this.activeDigit > 2)
      return svg`<text class="middleAligned" x="280" y="245">${
        this.numberToSplit % 10
      }</text>`;
    return svg``;
  }

  renderUnitsBox(): SVGTemplateResult {
    let rectClasses = '';
    if (this.activeDigit === 2) {
      rectClasses = 'boxLine activeFilled';
    } else {
      rectClasses = 'boxLine notActiveFilled';
    }
    return svg`<rect class="${rectClasses}"  x="250" y="200" width="60" height="100"  /> `;
  }

  renderTensBox(): SVGTemplateResult {
    let rectClasses = '';
    if (this.activeDigit === 0 || this.activeDigit === 1) {
      rectClasses = 'boxLine activeFilled';
    } else {
      rectClasses = 'boxLine notActiveFilled';
    }
    return svg`<rect class="${rectClasses}"  x="90" y="200" width="100" height="100" /> `;
  }

  renderSplitLines(): SVGTemplateResult {
    return svg`        
      <line class="splitLine" x1="200" y1="110" x2="150" y2="190" />
      <line class="splitLine" x1="220" y1="110" x2="270" y2="190" />
    `;
  }

  render(): HTMLTemplateResult {
    return html`
      <svg viewbox="0 0 420 350" style="height: 100%;">
        ${this.renderUnitsBox()} ${this.renderTensBox()}
        ${this.renderNumberToSplit()} ${this.renderTens()} ${this.renderUnits()}
        ${this.renderSplitLines()}
      </svg>
    `;
  }
}
