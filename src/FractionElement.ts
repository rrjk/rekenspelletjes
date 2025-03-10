import { CSSResultArray, html, css, LitElement } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, property, state } from 'lit/decorators.js';
// eslint-disable-next-line import/extensions
import { classMap } from 'lit/directives/class-map.js';

import type { HTMLTemplateResult, PropertyValues } from 'lit';
import { HighlightType } from './DraggableElement';
import { Fraction } from './Fraction';

@customElement('fraction-element')
export class FractionElement extends LitElement {
  @state()
  private accessor highlightState: HighlightType = 'none';

  @property()
  private accessor fraction = new Fraction(1, 2);

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

        .dropNone {
          stroke: black;
          fill: black;
        }

        line.dropNone {
          stroke-width: 5px;
        }

        .dropOk {
          stroke: blue;
          fill: blue;
        }

        .dropWrong {
          stroke: red;
          fill: red;
        }
      `,
    ];
  }

  protected willUpdate(_changedProperties: PropertyValues): void {
    console.log(`FractionElement - willUpdate`);
    console.log(_changedProperties);
  }

  render(): HTMLTemplateResult {
    const classes = {
      dropOk: this.highlightState === 'droppable',
      dropWrong: this.highlightState === 'wrong',
      dropNone: this.highlightState === 'none',
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
}
