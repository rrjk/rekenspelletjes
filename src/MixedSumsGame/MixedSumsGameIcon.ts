import { LitElement, html, css, svg } from 'lit';
import type {
  HTMLTemplateResult,
  CSSResultGroup,
  SVGTemplateResult,
} from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import {
  getMixedSumsGameVariant,
  isExtendedVariantInfoV1,
  MixedSumIcon,
} from './MixedSumsGameVariants';
import { Color, getColorInfo } from '../Colors';
import { Operator, operatorToSymbol } from '../Operator';
import { pathPuzzlePiece } from '../PuzzlePiece';
import { UnexpectedValueError } from '../UnexpectedValueError';
import {
  numberDigitsInNumber,
  splitInContiguousRanges,
} from '../NumberHelperFunctions';
import { darken, lighten } from 'color2k';

interface IconInfo {
  icon: MixedSumIcon;
  iconColor: Color;
  maxAnswer: number;
  eligibleTables: number[];
  operators: Operator[];
}

interface IconInfoExampleSum {
  iconColor: Color;
  sumDescriptions: string[];
}

@customElement('mixed-sums-game-icon')
export class MixedSumsGameIcon extends LitElement {
  /** Gamevariant */
  @property({ type: String })
  accessor variant = '';
  @property({ type: Boolean })
  accessor generic = false;

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

        text.singleTable {
          font-size: 35px;
          stroke-width: 4px;
        }

        text.tableRange2Digit {
          font-size: 20px;
          stroke-width: 3px;
        }
        text.tableRange1Digit {
          font-size: 25px;
          stroke-width: 3px;
        }

        text.typicalSum6Char {
          font-size: 35px;
          stroke-width: 4px;
        }

        text.typicalSum8Char {
          font-size: 29px;
          stroke-width: 4px;
        }

        text.typicalSum5Rows {
          font-size: 25px;
          stroke-width: 3px;
        }
      `,
      css`
        rect,
        path {
          stroke: black;
          fill: var(--fill-color, red);
          stroke-width: 2;
        }
      `,
    ];
  }

  private renderRectangleWithCutCorners(
    x: number,
    y: number,
    width: number,
    height: number,
    cutSize: number,
  ): SVGTemplateResult {
    const remainingSideLength = width - 2 * cutSize;
    return svg`
      <path
        d="M ${x + cutSize}, ${y}
           h ${remainingSideLength}
           l ${cutSize} ${cutSize}
           v ${remainingSideLength}
           l ${-cutSize} ${cutSize}
           h ${-remainingSideLength}
           l ${-cutSize} ${-cutSize}
           v ${-remainingSideLength}
           l ${cutSize} ${-cutSize}
           Z"
      />
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

  private renderBackground(iconInfo: IconInfo) {
    switch (iconInfo.icon) {
      case 'puzzlePiece':
        return pathPuzzlePiece(0, -5, 105, 105, {
          left: 'straight',
          bottom: 'straight',
          right: 'negative',
          top: 'positive',
        });
      case 'rectangle':
        return this.renderNoPuzzleBackgroundBlock();
      case 'multiplicationIcon':
        return this.renderRectangleWithCutCorners(0, -5, 105, 105, 12);
      default:
        throw new UnexpectedValueError(iconInfo.icon);
    }
  }

  private renderMaxes(iconInfo: IconInfo) {
    const maxs: SVGTemplateResult[] = [];
    const maxTable = iconInfo.eligibleTables.at(-1) ?? 10;
    if (
      !this.generic &&
      (iconInfo.icon === 'puzzlePiece' || iconInfo.icon === 'rectangle') &&
      iconInfo.operators.some(op => op === 'plus' || op === 'minus')
    ) {
      maxs.push(
        svg`<text class="number" x="55" y="43">${iconInfo.maxAnswer}</text>`,
      );
    }
    if (
      !this.generic &&
      (iconInfo.icon === 'puzzlePiece' || iconInfo.icon === 'rectangle') &&
      iconInfo.operators.some(op => op === 'times' || op === 'divide')
    ) {
      maxs.push(svg`<text class="number" x="54" y="88">${maxTable}</text>`);
    }
    return maxs;
  }

  private renderTableSets(iconInfo: IconInfo) {
    const tableSets: SVGTemplateResult[] = [];
    if (
      iconInfo.icon === 'puzzlePiece' ||
      iconInfo.icon === 'rectangle' ||
      this.generic
    ) {
      return tableSets;
    }

    const contiguousTableRanges = splitInContiguousRanges(
      iconInfo.eligibleTables,
    );

    if (contiguousTableRanges.length === 0) {
      throw new Error(`No eligible tables for variant ${this.variant}`);
    }

    let tableRangePos: { x: number; y: number }[] = [];
    let cls = '';

    const highestNumberOfDigits = numberDigitsInNumber(
      contiguousTableRanges[contiguousTableRanges.length - 1][1],
    );
    if (highestNumberOfDigits > 2) {
      throw new Error(
        `Highest number of digits in eligible tables is greater than 2 for variant ${this.variant}`,
      );
    } else if (highestNumberOfDigits === 2) {
      cls = 'tableRange2Digit';
    } else {
      cls = 'tableRange1Digit';
    }

    if (contiguousTableRanges.length === 1) {
      tableRangePos = [{ x: 75, y: 52 }];
      if (contiguousTableRanges[0][0] === contiguousTableRanges[0][1]) {
        cls = 'singleTable';
      }
    } else if (contiguousTableRanges.length === 2) {
      tableRangePos = [
        { x: 75, y: 30 },
        { x: 75, y: 70 },
      ];
    } else if (contiguousTableRanges.length === 3) {
      tableRangePos = [
        { x: 75, y: 20 },
        { x: 75, y: 52 },
        { x: 75, y: 84 },
      ];
    } else if (contiguousTableRanges.length === 4) {
      tableRangePos = [
        { x: 75, y: 12 },
        { x: 75, y: 36.33 },
        { x: 75, y: 60.66 },
        { x: 75, y: 85 },
      ];
    } else throw new Error(`Too many contiguous table ranges`);

    for (let i = 0; i < contiguousTableRanges.length; i++) {
      const range = contiguousTableRanges[i];
      if (range[0] === range[1]) {
        tableSets.push(
          svg`<text class="${cls}" x="${tableRangePos[i].x}" y="${tableRangePos[i].y}">${range[0]}</text>`,
        );
      } else {
        tableSets.push(
          svg`<text class="${cls}" x="${tableRangePos[i].x}" y="${tableRangePos[i].y}">${range[0]}-${range[1]}</text>`,
        );
      }
    }
    return tableSets;
  }

  private renderGenericTexts(iconInfo: IconInfo) {
    const genericTexts: SVGTemplateResult[] = [];
    if (!this.generic) {
      return genericTexts;
    }
    if (iconInfo.icon === 'puzzlePiece' || iconInfo.icon === 'rectangle') {
      return genericTexts;
    }
    if (iconInfo.icon === 'multiplicationIcon') {
      const contiguousTableRanges = splitInContiguousRanges(
        iconInfo.eligibleTables,
      );
      const lowestTable = contiguousTableRanges[0][0];
      const highestTable =
        contiguousTableRanges[contiguousTableRanges.length - 1][1];

      let textPos: { x: number; y: number }[] = [];
      textPos = [
        { x: 75, y: 20 },
        { x: 75, y: 52 },
        { x: 75, y: 84 },
      ];
      genericTexts.push(
        svg`<text class="tableRange1Digit" x="${textPos[0].x}" y="${textPos[0].y}">${
          lowestTable
        }</text>`,
      );
      genericTexts.push(
        svg`<text class="tableRange1Digit" x="${textPos[1].x}" y="${textPos[1].y}">t/m</text>`,
      );
      genericTexts.push(
        svg`<text class="tableRange1Digit" x="${textPos[2].x}" y="${textPos[2].y}">${highestTable}</text>`,
      );
      return genericTexts;
    }
  }

  private showTimesOperator(iconInfo: IconInfo): boolean {
    if (
      iconInfo.icon === 'rectangle' ||
      iconInfo.icon === 'puzzlePiece' ||
      iconInfo.operators.includes('times')
    ) {
      return true;
    }
    return false;
  }

  private showDivideOperator(iconInfo: IconInfo): boolean {
    if (
      iconInfo.icon === 'rectangle' ||
      iconInfo.icon === 'puzzlePiece' ||
      iconInfo.operators.includes('divide')
    ) {
      return true;
    }
    return false;
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

    const plusPosition = { x: 30, y: 30 };
    const minusPosition = { x: 70, y: 30 };
    let timesPosition = { x: 0, y: 0 };
    let dividePosition = { x: 0, y: 0 };

    if (
      iconInfo.icon === 'multiplicationIcon' &&
      iconInfo.operators.length === 2
    ) {
      timesPosition = { x: 30, y: 30 };
      dividePosition = { x: 30, y: 70 };
    } else if (
      iconInfo.icon === 'multiplicationIcon' &&
      iconInfo.operators.length === 1
    ) {
      timesPosition = { x: 25, y: 53 };
      dividePosition = { x: 25, y: 53 };
    } else {
      timesPosition = { x: 30, y: 70 };
      dividePosition = { x: 70, y: 70 };
    }

    const operators: SVGTemplateResult[] = [];

    if (iconInfo.icon === 'puzzlePiece' || iconInfo.icon === 'rectangle') {
      operators.push(
        svg`
          <text class=${classMap(plusClasses)} x="${plusPosition.x}" y="${plusPosition.y}">
            ${operatorToSymbol('plus')}
          </text>`,
      );
      operators.push(svg`
          <text class=${classMap(minusClasses)} x="${minusPosition.x}" y="${minusPosition.y}">
            ${operatorToSymbol('minus')}
          </text>`);
    }
    if (this.showTimesOperator(iconInfo)) {
      operators.push(
        svg`
          <text class=${classMap(timesClasses)} x="${timesPosition.x}" y="${timesPosition.y}">
            ${operatorToSymbol('times')}
          </text>`,
      );
    }
    if (this.showDivideOperator(iconInfo)) {
      operators.push(
        svg`
          <text class=${classMap(divideClasses)} x="${dividePosition.x}" y="${dividePosition.y}">
            ${operatorToSymbol('divide')}
          </text>`,
      );
    }
    return operators;
  }

  render(): HTMLTemplateResult {
    if (this.variant === '') {
      const iconInfo: IconInfo = {
        icon: 'puzzlePiece',
        iconColor: 'green',
        maxAnswer: 10,
        eligibleTables: [],
        operators: ['plus', 'minus', 'times', 'divide'],
      };
      return this.renderV1(iconInfo);
    } else {
      const variantInfo = getMixedSumsGameVariant(this.variant);
      if (isExtendedVariantInfoV1(variantInfo)) {
        const iconInfo: IconInfo = {
          ...variantInfo,
        };
        return this.renderV1(iconInfo);
      } else {
        const iconInfo: IconInfoExampleSum = {
          iconColor: variantInfo.iconColor,
          sumDescriptions: variantInfo.sumTypes.flatMap(
            sumType => sumType.sumDescriptions,
          ),
        };
        return this.renderWithExampleSums(iconInfo);
      }
    }
  }

  renderWithExampleSums(iconInfo: IconInfoExampleSum): HTMLTemplateResult {
    const backgroundColor = getColorInfo(iconInfo.iconColor).mainColorCode;
    return html`
      <style>
        :host {
          --fill-color: ${backgroundColor};
        }
      </style>
      <svg ViewBox="-5 -10 115 115">
        ${this.renderRectangleWithCutCorners(0, -5, 105, 105, 12)}
        ${this.renderTypicalSumns(iconInfo.sumDescriptions)}
      </svg>
    `;
  }

  renderTypicalSumns(typicalSums: string[]): SVGTemplateResult[] {
    const ret: SVGTemplateResult[] = [];
    let sumPos: { x: number; y: number }[] = [];
    const cls = {
      typicalSum6Char: false,
      typicalSum8Char: false,
      typicalSum5Rows: false,
    };

    switch (typicalSums.length) {
      case 0:
        throw new Error(`No typical sums provided`);
      case 1:
        sumPos = [{ x: 50, y: 52 }];
        break;
      case 2:
        sumPos = [
          { x: 50, y: 30 },
          { x: 50, y: 70 },
        ];
        break;
      case 3:
        sumPos = [
          { x: 50, y: 20 },
          { x: 50, y: 52 },
          { x: 50, y: 84 },
        ];
        break;
      case 4:
        sumPos = [
          { x: 50, y: 12 },
          { x: 50, y: 38 },
          { x: 50, y: 62 },
          { x: 50, y: 87 },
        ];
        break;
    }
    let maxLength = 0;
    for (const typicalSum of typicalSums) {
      if (typicalSum.length > maxLength) {
        maxLength = typicalSum.length;
      }
    }

    if (typicalSums.length > 5) {
      throw new Error(`Too many typical sums provided`);
    } else if (typicalSums.length > 3) {
      cls.typicalSum5Rows = true;
    } else if (maxLength <= 6) {
      cls.typicalSum6Char = true;
    } else if (maxLength <= 8) {
      cls.typicalSum8Char = true;
    } else {
      throw new Error(`There is a typical sum that is too long`);
    }

    for (const typicalSum of typicalSums) {
      ret.push(
        svg`<text class="${classMap(cls)}" x="${sumPos[ret.length].x}" y="${sumPos[ret.length].y}">${typicalSum}</text>`,
      );
    }
    return ret;
  }

  renderV1(iconInfo: IconInfo): HTMLTemplateResult {
    /** This will be the icon info when no variant is selected, to be used on the front page */
    let backgroundColor = getColorInfo(iconInfo.iconColor).mainColorCode;
    if (
      iconInfo.icon === 'multiplicationIcon' &&
      iconInfo.operators.length === 1 &&
      iconInfo.operators[0] === 'divide'
    ) {
      backgroundColor = lighten(backgroundColor, 0.1); // Lighten the background color for divide-only variant
    }
    if (
      iconInfo.icon === 'multiplicationIcon' &&
      iconInfo.operators.length === 2 &&
      iconInfo.operators.includes('times') &&
      iconInfo.operators.includes('divide')
    ) {
      backgroundColor = darken(backgroundColor, 0.1); // Lighten the background color for both times and divide variant
    }
    return html`
      <style>
        :host {
          --fill-color: ${backgroundColor};
        }
      </style>
      <svg ViewBox="-5 -10 115 115">
        ${this.renderBackground(iconInfo)} ${this.renderOperators(iconInfo)}
        ${this.renderMaxes(iconInfo)} ${this.renderTableSets(iconInfo)}
        ${this.renderGenericTexts(iconInfo)}
      </svg>
    `;
  }
}
