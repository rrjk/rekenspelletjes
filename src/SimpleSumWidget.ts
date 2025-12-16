import { LitElement, html, css, svg } from 'lit';
import type {
  CSSResultArray,
  HTMLTemplateResult,
  SVGTemplateResult,
} from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import {
  numberDigitsInNumber,
  numberWithActiveDigits,
} from './NumberHelperFunctions';
import { convertOperator, Operator, operatorToSymbol } from './Operator';
import { UnexpectedValueError } from './UnexpectedValueError';

@customElement('simple-sum-widget')
export class SimpleSumWidget extends LitElement {
  /** Width of the SVG viewbox in SVG coordinates*/
  static viewBoxWidth = 550;
  /** Height of the SVG viewbox in SVG coordinates*/
  static viewBoxHeight = 100;
  /** baseline of the text in SVG coordinates */
  static textBaseline = 80;
  /** Width of a digit in SVG coordinates */
  static digitWidth = 44.5;
  /** Height of a digit in SVG coordinates */
  static digitHeight = 57;
  /** Width of a space in SVG coordinates */
  static spaceWidth = 10;
  /** Amount of horizontal space between the fillin box borders and the digits inside in SVG coordinates*/
  static boxHorizontalMargin = 5;
  /** Amount of vertical space between the fillin box borders and the digits inside in SVG coordinates*/
  static boxVerticalMargin = 10;
  /** Height of the fillin box */
  static boxHeight =
    SimpleSumWidget.digitHeight + 2 * SimpleSumWidget.boxVerticalMargin;
  /** Location of the right side of the equal sign in SVG coordinates */
  static middleX = 325;

  /** Operand 1 (left of the operator) */
  @property({ type: Number })
  private accessor operand1 = 0;

  /** Operand 2 (right of the operator) */
  @property({ type: Number })
  private accessor operand2 = 0;

  /** Operator to use in the sum */
  @property({ converter: convertOperator })
  private accessor operator: Operator = 'times';

  /** How many digits should be visible in the fill-in box */
  @property({ type: Number })
  private accessor visibleDigits = 0;

  /** Should the fill-in box be shown as active (blue) or not */
  @property({ type: Boolean })
  private accessor fillInActive = true;

  /** Number of digits that should be allocated for in the answer box
   * If equal to -1, the width will be determined based on the number of
   * widgets in the answer.
   *
   * If number of actual digits in the answer is bigger, this bigger
   * number of digits will be used.
   */
  @property({ type: Number })
  private accessor digitsAnswerBox = -1;

  /** Answer to the sum */
  private get answer(): number {
    switch (this.operator) {
      case 'divide':
        return this.operand1 / this.operand2;
      case 'times':
        return this.operand1 * this.operand2;
      case 'minus':
        return this.operand1 - this.operand2;
      case 'plus':
        return this.operand1 + this.operand2;
      default:
        throw new UnexpectedValueError(this.operator);
    }
  }

  /** Calculated number of digits that should be alocated for in the answer box
   * It's ensured it is at least as high as the number of digits in the answer
   */
  private digitsFillinBoxToUse(): number {
    const actualDigitsAnswer = numberDigitsInNumber(this.answer);
    return Math.max(actualDigitsAnswer, this.digitsAnswerBox);
  }

  /** Calculated width of the fillin box */
  private getFillinBoxWidth() {
    const numberWidth =
      this.digitsFillinBoxToUse() * SimpleSumWidget.digitWidth;
    return numberWidth + 2 * SimpleSumWidget.boxHorizontalMargin;
  }

  static get styles(): CSSResultArray {
    return [
      css`
        :host {
          display: block;
          container-type: size;
        }

        svg {
          width: 100%;
          height: 100%;
        }

        text {
          font-family: Arial, sans-serif;
          font-size: 80px;
        }

        .sum {
          text-anchor: end;
        }

        .answer {
          text-anchor: start;
        }

        .boxLine {
          stroke: black;
          stroke-width: 2px;
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

  renderAnswer(activeDigits: number, active = false): SVGTemplateResult {
    const rectClasses = {
      boxLine: true,
      activeFilled: active,
      notActiveFilled: !active,
    };
    return svg`
      <rect class="${classMap(rectClasses)}"  
            x="${SimpleSumWidget.middleX + SimpleSumWidget.spaceWidth}" 
            y="${SimpleSumWidget.textBaseline + SimpleSumWidget.boxVerticalMargin - SimpleSumWidget.boxHeight}" 
            width="${this.getFillinBoxWidth()}" 
            height="${SimpleSumWidget.boxHeight}" />
      <text x="${SimpleSumWidget.middleX + SimpleSumWidget.spaceWidth + SimpleSumWidget.boxHorizontalMargin}" y="${SimpleSumWidget.textBaseline}">${numberWithActiveDigits(this.answer, activeDigits)}</text>`;
  }

  render(): HTMLTemplateResult {
    const elements: SVGTemplateResult[] = [];
    elements.push(
      svg`<rect x="0" y="0" width="${SimpleSumWidget.viewBoxWidth - 2}" height="${SimpleSumWidget.viewBoxHeight - 2}" stroke="black" stroke-width="1" fill="none"/>`,
    );

    elements.push(
      svg`<text class="sum" x=${SimpleSumWidget.middleX} y="${SimpleSumWidget.textBaseline}"> ${this.operand1} ${operatorToSymbol(this.operator)} ${this.operand2} =</text>`,
    );
    elements.push(this.renderAnswer(this.visibleDigits, this.fillInActive));

    return html` <svg
      viewBox="0 0 ${SimpleSumWidget.viewBoxWidth} ${SimpleSumWidget.viewBoxHeight}"
      preserveAspectRatio="xMidYMid meet"
    >
      ${elements}
    </svg>`;
  }
}
