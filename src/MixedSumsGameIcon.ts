import { LitElement, html, css, svg } from 'lit';
import type {
  HTMLTemplateResult,
  CSSResultGroup,
  SVGTemplateResult,
} from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { getMixedSumsGameVariant } from './MixedSumsGameVariants';
import { Color, getColorInfo } from './Colors';
import { Operator, operatorToSymbol } from './Operator';
import { pathPuzzlePiece } from './PuzzlePiece';

interface IconInfo {
  icon: 'rectangle' | 'puzzlePiece';
  iconColor: Color;
  maxAnswer: number;
  maxTable: number;
  excludeMaxs: boolean;
  operators: Operator[];
}

@customElement('mixed-sums-game-icon')
export class MixedSumsGameIcon extends LitElement {
  /** Gamevariant */
  @property({ type: String })
  accessor variant = '';
  static get styles(): CSSResultGroup {
    return [
      css`
        :host {
          display: grid;
          justify-items: center;
          align-items: center;
          container-type: size;
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
      `,
    ];
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

  private renderBackground(iconInfo: IconInfo) {
    let backgroundBlock: SVGTemplateResult;

    if (iconInfo.icon === 'puzzlePiece') {
      backgroundBlock = pathPuzzlePiece(0, -5, 105, 105, {
        left: 'straight',
        bottom: 'straight',
        right: 'negative',
        top: 'positive',
      });
    } else {
      backgroundBlock = this.renderNoPuzzleBackgroundBlock();
    }
    return backgroundBlock;
  }

  private renderMaxes(iconInfo: IconInfo) {
    const maxs: SVGTemplateResult[] = [];
    if (
      !iconInfo.excludeMaxs &&
      iconInfo.operators.some(op => op === 'plus' || op === 'minus')
    )
      maxs.push(
        svg`<text class="number" x="55" y="43">${iconInfo.maxAnswer}</text>`,
      );
    if (
      !iconInfo.excludeMaxs &&
      iconInfo.operators.some(op => op === 'times' || op === 'divide')
    )
      maxs.push(
        svg`<text class="number" x="54" y="88">${iconInfo.maxTable}</text>`,
      );
    return maxs;
  }

  private renderOperators(iconInfo: IconInfo) {
    const plusClasses = {
      operator: true,
      inactive: !iconInfo.operators.includes('plus'),
      active: iconInfo.operators.includes('plus'),
    };

    const minusClasses = {
      operator: true,
      inactive: !iconInfo.operators.includes('minus'),
      active: iconInfo.operators.includes('minus'),
    };
    const timesClasses = {
      operator: true,
      inactive: !iconInfo.operators.includes('times'),
      active: iconInfo.operators.includes('times'),
    };
    const divideClasses = {
      operator: true,
      inactive: !iconInfo.operators.includes('divide'),
      active: iconInfo.operators.includes('divide'),
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
    return operators;
  }

  render(): HTMLTemplateResult {
    let iconInfo: IconInfo = {
      icon: 'puzzlePiece',
      iconColor: 'green',
      maxAnswer: 10,
      maxTable: 10,
      excludeMaxs: true,
      operators: ['plus', 'minus', 'times', 'divide'],
    };

    if (this.variant !== '') {
      iconInfo = {
        ...getMixedSumsGameVariant(this.variant),
        excludeMaxs: false,
      };
    }

    return html`
      <style>
        :host {
          --fill-color: ${getColorInfo(iconInfo.iconColor).mainColorCode};
        }
      </style>
      <svg ViewBox="-5 -10 115 115">
        ${this.renderBackground(iconInfo)} ${this.renderOperators(iconInfo)}
        ${this.renderMaxes(iconInfo)}
      </svg>
    `;
  }
}
