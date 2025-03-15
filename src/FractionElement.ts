import { CSSResultArray, html, css, LitElement, svg, unsafeCSS } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, property, state } from 'lit/decorators.js';
// eslint-disable-next-line import/extensions
import { classMap } from 'lit/directives/class-map.js';

import type { HTMLTemplateResult, SVGTemplateResult } from 'lit';
import { HighlightType } from './DraggableElement';
import { Fraction } from './Fraction';

import type { FractionRepresentation } from './Fraction';
import { getColorInfo } from './Colors';

@customElement('fraction-element')
export class FractionElement extends LitElement {
  @state()
  private accessor highlightState: HighlightType = 'none';

  @property()
  private accessor fraction = new Fraction(1, 2);

  @property()
  private accessor representation: FractionRepresentation = 'fraction';

  private get barLength() {
    if (this.fraction.numerator > 99 || this.fraction.denumerator > 99)
      return 85;
    if (this.fraction.numerator > 9 || this.fraction.denumerator > 9) return 65;
    return 45;
  }

  /** Get all static styles */
  static get styles(): CSSResultArray {
    return [
      css`
        :host {
          display: inline-block;
        }

        text {
          font-size: 100px;
          text-anchor: middle;
        }

        text.numerator {
          dominant-baseline: alphabetic;
        }

        text.denumerator {
          dominant-baseline: hanging;
        }

        line.fractionBar {
          stroke-width: 5px;
        }

        svg {
          width: 100%;
          height: 100%;
        }

        .dropNoneFraction {
          stroke: black;
          fill: black;
        }

        .dropOkFraction {
          stroke: ${unsafeCSS(getColorInfo('blue').mainColorCode)};
          fill: ${unsafeCSS(getColorInfo('blue').mainColorCode)};
        }

        .dropWrongFraction {
          stroke: ${unsafeCSS(getColorInfo('red').mainColorCode)};
          fill: ${unsafeCSS(getColorInfo('red').mainColorCode)};
        }

        .dropNonePie {
          stroke: black;
          fill: ${unsafeCSS(getColorInfo('yellow').mainColorCode)};
        }

        .dropOkPie {
          stroke: black;
          fill: ${unsafeCSS(getColorInfo('blue').mainColorCode)};
        }

        .dropWrongPie {
          stroke: black;
          fill: ${unsafeCSS(getColorInfo('red').mainColorCode)};
        }
      `,
    ];
  }

  /*
  protected willUpdate(changedProperties: PropertyValues): void {
  }
*/

  renderAsFraction(): HTMLTemplateResult {
    const classes = {
      dropOkFraction: this.highlightState === 'droppable',
      dropWrongFraction: this.highlightState === 'wrong',
      dropNoneFraction: this.highlightState === 'none',
    };
    return html`
      <svg viewbox="-100 -100 200 200">
        <text class="numerator ${classMap(classes)}" x="0" y="-20">
          ${this.fraction.numerator}
        </text>
        <line
          class="fractionBar ${classMap(classes)}"
          x1="-${this.barLength}"
          x2="${this.barLength}"
          y1="0"
          y2="0"
        />
        <text class="denumerator ${classMap(classes)}" x="0" y="20">
          ${this.fraction.denumerator}
        </text>
      </svg>
    `;
  }

  renderAsPiechart(): HTMLTemplateResult {
    const classes = {
      dropOkPie: this.highlightState === 'droppable',
      dropWrongPie: this.highlightState === 'wrong',
      dropNonePie: this.highlightState === 'none',
    };

    const arc =
      (this.fraction.numerator / this.fraction.denumerator) * 2 * Math.PI;
    const largeArcFilled = arc > Math.PI ? 1 : 0;
    const largeArcNonFilled = arc > Math.PI ? 0 : 1;

    const dividerLines: SVGTemplateResult[] = [];
    for (let i = 1; i < this.fraction.numerator; i++) {
      dividerLines.push(this.renderPieDivider(i));
    }
    for (
      let i = this.fraction.numerator + 1;
      i < this.fraction.denumerator;
      i++
    ) {
      dividerLines.push(this.renderPieDivider(i));
    }

    return html`
      <svg class="${classMap(classes)}" viewbox="-1100 -1100 2200 2200">
        <path
          d="M 0 0 L 0 -1000 A 1000 1000 0 ${largeArcFilled} 1 
             ${this.arcToXPosition(arc)} ${this.arcToYPosition(arc)} L 0 0"
          stroke-width="50"
        />
        <path
          d="M 0 0 L 0 -1000 A 1000 1000 0 ${largeArcNonFilled} 0 
             ${this.arcToXPosition(arc)} ${this.arcToYPosition(arc)} L 0 0"
          stroke-width="50"
          fill="none"
        />
        ${dividerLines}
      </svg>
    `;
  }

  renderPieDivider(numerator: number): SVGTemplateResult {
    const arc = (numerator / this.fraction.denumerator) * 2 * Math.PI;
    return svg`<path d="M 0 0 L ${this.arcToXPosition(arc)} ${this.arcToYPosition(arc)}" stroke-dasharray="50,50" stroke-width="50"/>`;
  }

  arcToXPosition(arc: number) {
    return Math.sin(arc) * 1000;
  }

  arcToYPosition(arc: number) {
    return -Math.cos(arc) * 1000;
  }

  render(): HTMLTemplateResult {
    if (this.representation === 'fraction') return this.renderAsFraction();
    if (this.representation === 'piechart') return this.renderAsPiechart();
    console.error(
      `Fraction representation ${this.representation} is not supported`,
    );
    return html``;
  }
}
