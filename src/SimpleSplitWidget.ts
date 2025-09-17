import { LitElement, html, css, svg } from 'lit';
import type {
  CSSResultArray,
  HTMLTemplateResult,
  SVGTemplateResult,
} from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('simple-split-widget')
export class SimpleSplitWidget extends LitElement {
  @property({ type: Number })
  accessor numberToSplit = 8;
  @property({ type: Number })
  accessor firstSplit = 3;

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

        .splitLine {
          stroke: black;
          stroke-width: 3px;
        }

        .boxLine {
          stroke: black;
          stroke-width: 2px;
        }

        .activeFilled {
          fill: lightblue;
        }
      `,
    ];
  }

  renderNumberToSplit(): SVGTemplateResult {
    return svg`<text class="middleAligned" x="210" y="50">${this.numberToSplit}</text>`;
  }

  renderFirstSplit(): SVGTemplateResult {
    return svg`<text class="middleAligned" x="145" y="230">${this.firstSplit}</text>`;
  }

  renderSecondSplitBox(): SVGTemplateResult {
    return svg`<rect class="boxLine activeFilled"  x="250" y="200" width="50" height="80"  /> `;
  }

  renderSplitLines(): SVGTemplateResult {
    return svg`        
      <line class="splitLine" x1="200" y1="110" x2="150" y2="190" />
      <line class="splitLine" x1="220" y1="110" x2="270" y2="190" />
    `;
  }

  render(): HTMLTemplateResult {
    return html`
      <svg viewbox="125 25 180 255" style="height: 100%;">
        ${this.renderSecondSplitBox()} ${this.renderNumberToSplit()}
        ${this.renderFirstSplit()} ${this.renderSplitLines()}
      </svg>
    `;
  }
}
