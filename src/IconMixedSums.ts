import {
  LitElement,
  html,
  css,
  svg,
  HTMLTemplateResult,
  CSSResultGroup,
  SVGTemplateResult,
  nothing,
} from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { Color, getColorInfo, stringToColor } from './Colors';
import { operatorToSymbol } from './Operator';
import { pathPuzzlePiece } from './PuzzlePiece';

@customElement('icon-mixed-sums')
export class IconMixedSums extends LitElement {
  @property({ type: Boolean })
  private accessor plus = false;
  @property({ type: Boolean })
  private accessor minus = false;
  @property({ type: Boolean })
  private accessor times = false;
  @property({ type: Boolean })
  private accessor divide = false;
  @property({ type: Boolean })
  private accessor puzzlePiece = false;

  @property({ type: Number })
  private accessor maxTable = 10;
  @property({ type: Number })
  private accessor maxAnswer = 100;

  @property({ type: Boolean })
  private accessor excludeMaxs = false;

  @property({ type: String, converter: stringToColor })
  private accessor color: Color = 'grey';

  static get styles(): CSSResultGroup {
    return css`
      :host {
        display: block;
      }

      svg {
        height: 100%;
        width: 100%;
        font-family: 'Arial';
        font-weight: 700;
        fill: #ffffff;
        stroke: #000000;
        paint-order: stroke;
        text-anchor: middle;
        dominant-baseline: middle;
      }

      text.active {
        fill: #ffffff;
        stroke: #000000;
      }

      text.inactive {
        fill: #000000;
        fill-opacity: 0.1;
        stroke: none;
      }

      text.operator {
        font-size: 50px;
        stroke-width: 6px;
      }

      text.number {
        font-size: 15px;
        stroke-width: 3px;
      }

      rect,
      path {
        stroke: black;
        fill: var(--fill-color, red);
        stroke-width: 2;
      }
    `;
  }

  renderNoPuzzleBackgroundBlock(): SVGTemplateResult {
    return svg`
        <rect
          x="0"
          y="-5"
          width="105"
          height="105"
          stroke-width="3px"
          rx="20px"
        />
    `;
  }

  render(): HTMLTemplateResult {
    let backgroundBlock: SVGTemplateResult | typeof nothing = nothing;

    if (this.puzzlePiece) {
      backgroundBlock = pathPuzzlePiece(0, -5, 105, 105, {
        left: 'straight',
        bottom: 'straight',
        right: 'negative',
        top: 'positive',
      });
    } else {
      backgroundBlock = this.renderNoPuzzleBackgroundBlock();
    }

    const plusClasses = {
      operator: true,
      inactive: !this.plus,
      active: this.plus,
    };

    const minusClasses = {
      operator: true,
      inactive: !this.minus,
      active: this.minus,
    };
    const timesClasses = {
      operator: true,
      inactive: !this.times,
      active: this.times,
    };
    const divideClasses = {
      operator: true,
      inactive: !this.divide,
      active: this.divide,
    };

    const operators = svg`
      <text class=${classMap(plusClasses)} x="30" y="30">
        ${operatorToSymbol('plus')}
      </text>
      <text class=${classMap(minusClasses)} x="70" y="30">
        ${operatorToSymbol('minus')}
      </text>
      <text class=${classMap(timesClasses)} x="30" y="73">
        ${operatorToSymbol('times')}
      </text>
      <text class=${classMap(divideClasses)} x="70" y="70">
        ${operatorToSymbol('divide')}
      </text>`;

    const maxs: SVGTemplateResult[] = [];
    if (!this.excludeMaxs && (this.plus || this.minus))
      maxs.push(
        svg`<text class="number" x="55" y="43">${this.maxAnswer}</text>`,
      );
    if (!this.excludeMaxs && (this.times || this.divide))
      maxs.push(
        svg`<text class="number" x="54" y="88">${this.maxTable}</text>`,
      );

    return html`
      <style>
        :host {
          --fill-color: ${getColorInfo(this.color).mainColorCode};
        }
      </style>
      <svg ViewBox="-5 -10 115 115">
        ${backgroundBlock} ${operators} ${maxs}
      </svg>
    `;
  }
}
