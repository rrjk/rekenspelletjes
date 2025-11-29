import { LitElement, html, css, svg } from 'lit';
import type {
  CSSResultArray,
  HTMLTemplateResult,
  SVGTemplateResult,
} from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('simple-split-widget')
export class SimpleSplitWidget extends LitElement {
  /** Number shown at the top of the split widget */
  @property({ type: Number })
  accessor numberToSplit = 8;
  /** Number shown as the first split */
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
          font-size: 90px;
          font-weight: 500;
        }

        .middleAligned {
          text-anchor: middle;
        }

        .splitLine {
          stroke: black;
          stroke-width: 5px;
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

  get getSecondSplitBoxWidth() {
    if (this.numberToSplit >= 100) return 100;
    else if (this.numberToSplit >= 10) return 75;
    else return 50;
  }

  get getSecondSplitBoxX() {
    if (this.numberToSplit >= 100) return 245;
    else if (this.numberToSplit >= 10) return 257.5;
    else return 270;
  }

  renderNumberToSplit(): SVGTemplateResult {
    return svg`<text class="middleAligned" x="210" y="50">${this.numberToSplit}</text>`;
  }

  renderFirstSplit(): SVGTemplateResult {
    return svg`<text class="middleAligned" x="125" y="230">${this.firstSplit}</text>`;
  }

  renderSecondSplitBox(): SVGTemplateResult {
    return svg`<rect class="boxLine activeFilled"  x="${this.getSecondSplitBoxX}" y="200" width="${this.getSecondSplitBoxWidth}" height="80"  /> `;
  }

  renderSplitLines(): SVGTemplateResult {
    return svg`        
      <line class="splitLine" x1="200" y1="110" x2="130" y2="190" />
      <line class="splitLine" x1="220" y1="110" x2="290" y2="190" />
    `;
  }

  render(): HTMLTemplateResult {
    return html`
      <svg viewbox="100 25 245 258" style="height: 100%;">
        ${this.renderSecondSplitBox()} ${this.renderNumberToSplit()}
        ${this.renderFirstSplit()} ${this.renderSplitLines()}
      </svg>
    `;
  }
}
