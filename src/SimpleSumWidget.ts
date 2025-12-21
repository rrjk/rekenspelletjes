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
import { getTextWidth } from './StringHelperFunctions';

@customElement('simple-sum-widget')
export class SimpleSumWidget extends LitElement {
  /** Horizontal margin around the SVG viewboxin SVG coordinates*/
  static viewBoxHorizontalMargin = 5;
  /** Height of the SVG viewbox in SVG coordinates*/
  static viewBoxHeight = 100;
  /** baseline of the text in SVG coordinates */
  static textBaseline = 80;

  /** Width of a digit in SVG coordinates */
  static digitWidth = getTextWidth('0', '80px "Arial", sans-serif');

  /** Width of an operator in SVG coordinates
   * Here we take the width of the widest operator (times)
   */
  static operatorWidth = getTextWidth(
    operatorToSymbol('times'),
    '80px "Arial", sans-serif',
  );

  /** Width of a space in SVG coordinates */
  static spaceWidth = getTextWidth(' ', '80px "Arial", sans-serif');

  /** Width of an equal sign in SVG coordinates */
  static equalSignWidth = getTextWidth('=', '80px "Arial", sans-serif');

  /** Height of a digit in SVG coordinates  */
  static digitHeight = 57;
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
  private accessor minDigitsAnswer = -1;

  /** Number of digits that should be allocated for in operand1
   * If equal to -1, the width will be determined based on the number of
   * digits in operand1.
   *
   * If number of actual digits in operand1 is bigger, this bigger
   * number of digits will be used.
   */
  @property({ type: Number })
  private accessor minDigitsOperand1 = -1;

  /** Number of digits that should be allocated for in operand1
   * If equal to -1, the width will be determined based on the number of
   * digits in operand1.
   *
   * If number of actual digits in operand1 is bigger, this bigger
   * number of digits will be used.
   */
  @property({ type: Number })
  private accessor minDigitsOperand2 = -1;

  /** Should the sum be visible, or just the equal sign and the answerbox */
  @property({ type: Boolean })
  private accessor sumVisible = false;

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
    return Math.max(actualDigitsAnswer, this.minDigitsAnswer);
  }

  /** Calculated number of digits that should be alocated for for operand1
   * It's ensured it is at least as high as the number of digits in operand1
   */
  private digitsOperand1ToUse(): number {
    const actualDigitsOperand1 = numberDigitsInNumber(this.operand1);
    return Math.max(actualDigitsOperand1, this.minDigitsOperand1);
  }

  /** Calculated number of digits that should be alocated for for operand2
   * It's ensured it is at least as high as the number of digits in operand2
   */
  private digitsOperand2ToUse(): number {
    const actualDigitsOperand2 = numberDigitsInNumber(this.operand2);
    return Math.max(actualDigitsOperand2, this.minDigitsOperand2);
  }

  /** Calculated width of the fillin box in SVG units*/
  private getFillinBoxWidth() {
    const numberWidth =
      this.digitsFillinBoxToUse() * SimpleSumWidget.digitWidth;
    return numberWidth + 2 * SimpleSumWidget.boxHorizontalMargin;
  }

  /** Calculated width sum in SVG units*/
  private getSumWidth() {
    const operand1Width =
      this.digitsOperand1ToUse() * SimpleSumWidget.digitWidth;
    const operand2Width =
      this.digitsOperand2ToUse() * SimpleSumWidget.digitWidth;

    const totalWidth =
      operand1Width +
      operand2Width +
      3 * SimpleSumWidget.spaceWidth +
      SimpleSumWidget.operatorWidth +
      SimpleSumWidget.equalSignWidth;

    return totalWidth;
  }

  /** Calculated width total exercise block in SVG units */
  private getExerciseWidth() {
    return (
      this.getSumWidth() +
      SimpleSumWidget.spaceWidth +
      this.getFillinBoxWidth() +
      2 * SimpleSumWidget.viewBoxHorizontalMargin
    );
  }

  /** Right aligned position of the equal sign in SVG units */
  private getEqualSignPosition() {
    return this.getSumWidth() + SimpleSumWidget.viewBoxHorizontalMargin;
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

        rect {
          box-sizing: border-box;
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
            x="${this.getEqualSignPosition() + SimpleSumWidget.spaceWidth}" 
            y="${SimpleSumWidget.textBaseline + SimpleSumWidget.boxVerticalMargin - SimpleSumWidget.boxHeight}" 
            width="${this.getFillinBoxWidth()}" 
            height="${SimpleSumWidget.boxHeight}" />
      <text x="${this.getEqualSignPosition() + SimpleSumWidget.spaceWidth + SimpleSumWidget.boxHorizontalMargin}" y="${SimpleSumWidget.textBaseline}">${numberWithActiveDigits(this.answer, activeDigits)}</text>`;
  }

  renderSum(sumVisible = false): SVGTemplateResult {
    console.log(`sumVisible = ${sumVisible}`);
    let sumText = '';
    if (sumVisible) {
      sumText = `${this.operand1} ${operatorToSymbol(this.operator)} ${this.operand2} =`;
    } else {
      sumText = `=`;
    }
    return svg`<text class="sum" x=${this.getEqualSignPosition()} y="${SimpleSumWidget.textBaseline}"> ${sumText}</text>`;
  }

  render(): HTMLTemplateResult {
    const elements: SVGTemplateResult[] = [];
    elements.push(
      svg`<rect x="0" y="0" width="${this.getExerciseWidth()}" height="${SimpleSumWidget.viewBoxHeight}" stroke="black" stroke-width="1" fill="none"/>`,
    );

    elements.push(this.renderSum(this.sumVisible));
    elements.push(this.renderAnswer(this.visibleDigits, this.fillInActive));

    return html` <svg
      viewBox="0 0 ${this.getExerciseWidth()} ${SimpleSumWidget.viewBoxHeight}"
      preserveAspectRatio="xMidYMid meet"
    >
      ${elements}
    </svg>`;
  }
}
