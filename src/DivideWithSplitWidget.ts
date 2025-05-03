import { LitElement, html, css, svg } from 'lit';
import type {
  CSSResultArray,
  HTMLTemplateResult,
  SVGTemplateResult,
} from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, property } from 'lit/decorators.js';
// eslint-disable-next-line import/extensions
import { classMap } from 'lit/directives/class-map.js';
import {
  numberDigitsInNumber,
  numberWithActiveDigits,
} from './NumberHelperFunctions';

type SplitLineDirection = 'left' | 'right';
export const fillInBoxes = [
  'split0',
  'split1',
  'subAnswer0',
  'subAnswer1',
  'answer',
] as const;

export type FillInBoxes = (typeof fillInBoxes)[number];

type ActiveDigits = {
  [key in FillInBoxes]: number;
};

function initActiveDigits(): ActiveDigits {
  return Object.fromEntries(fillInBoxes.map(key => [key, 0])) as ActiveDigits;
}

const digitWidth = 44.5;
const equalSignWidth = 47;
const divisionSignWidth = 18.5;
const plusSignWidth = 47;
const spaceWidth = 10;
const boxHeight = 75;
const splitLineWidth = 5 * spaceWidth;
const splitLineHeight = 8 * spaceWidth;

function multiDigitWidth(nmbrDigits: number): number {
  // return Math.ceil((digitWidth * nmbrDigits) / 10) * 10;
  return digitWidth * nmbrDigits;
}

function numberBoxWidth(nmbr: number) {
  const nmbrDigits = numberDigitsInNumber(nmbr);
  const numberWidth = multiDigitWidth(nmbrDigits);
  return numberWidth + 10;
}

@customElement('divide-with-split-widget')
export class DivideWihSplitWidget extends LitElement {
  @property({ type: Number })
  accessor dividend = 132;

  @property({ type: Number })
  accessor divisor = 6;

  @property()
  accessor splits: number[] = [];

  @property()
  accessor subAnswers: number[] = [];

  @property({ type: Number })
  accessor answer = 22;

  @property({ type: String })
  accessor activeFillIn: FillInBoxes = 'subAnswer1';

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

  renderNumber(
    nmbr: number,
    activeDigits: number,
    x: number,
    y: number,
    fillIn: boolean = false,
    active: boolean = false,
  ): SVGTemplateResult {
    const rectClasses = {
      boxLine: fillIn,
      activeFilled: fillIn && active,
      notActiveFilled: !fillIn || !active,
    };
    return svg`
      <rect class="${classMap(rectClasses)}"  
            x="${x}" 
            y="${y}" 
            width="${numberBoxWidth(nmbr)}" 
            height="90"  />
      <text x="${x + 5}" y="${y + 75}">${numberWithActiveDigits(nmbr, activeDigits)}</text>`;
  }

  renderDivisionSign(x: number, y: number): SVGTemplateResult {
    return svg`
      <text x="${x}" y="${y + 75}">∶</text>`;
  }

  renderEqualSign(x: number, y: number): SVGTemplateResult {
    return svg`<text x="${x}" y="${y + 75}">=</text>`;
  }

  renderPlusSign(x: number, y: number): SVGTemplateResult {
    return svg`<text x="${x}" y="${y + 75}">+</text>`;
  }

  renderSplitLine(
    x: number,
    y: number,
    splitLineDirection: SplitLineDirection,
  ): SVGTemplateResult {
    const xEnd =
      x + (splitLineDirection === 'left' ? -splitLineWidth : splitLineWidth);
    const yEnd = y + splitLineHeight;
    return svg`<line
          x1="${x}"
          x2="${xEnd}"
          y1="${y}"
          y2="${yEnd}"
          stroke="black"
          stroke-width="5"
        />`;
  }

  render(): HTMLTemplateResult {
    const firstLineY = spaceWidth;
    const dividendWidth = numberBoxWidth(this.dividend);
    const divisorWidth = numberBoxWidth(this.divisor);

    const subAnswersWidth: number[] = [];
    subAnswersWidth[0] = numberBoxWidth(this.subAnswers[0]);
    subAnswersWidth[1] = numberBoxWidth(this.subAnswers[1]);

    const answerWidth = numberBoxWidth(this.answer);

    const totalWidth =
      dividendWidth +
      divisorWidth +
      subAnswersWidth[0] +
      subAnswersWidth[1] +
      answerWidth +
      2 * equalSignWidth +
      divisionSignWidth +
      plusSignWidth +
      8 * spaceWidth;

    const dividendX = (1000 - totalWidth) / 2;
    const divisionSignX = dividendX + dividendWidth + spaceWidth;
    const divisorX = divisionSignX + divisionSignWidth + spaceWidth;
    const equalSignX = divisorX + divisorWidth + spaceWidth;
    const subAnswersX: number[] = [];
    subAnswersX[0] = equalSignX + equalSignWidth + spaceWidth;
    const plusSignX = subAnswersX[0] + subAnswersWidth[0] + spaceWidth;
    subAnswersX[1] = plusSignX + plusSignWidth + spaceWidth;
    const equalSign2X = subAnswersX[1] + subAnswersWidth[1] + spaceWidth;
    const answerX = equalSign2X + equalSignWidth + spaceWidth;

    const dividendMidX = dividendX + 0.5 * dividendWidth;
    const splitLine0X = dividendMidX - spaceWidth;
    const splitLine1X = dividendMidX + spaceWidth;
    const splitLinesY = firstLineY + boxHeight + spaceWidth;

    const splitNumberBoxesY = splitLinesY + splitLineHeight + spaceWidth;

    const splitNumberBox0Width = numberBoxWidth(this.splits[0]);
    const splitNumberBox0X =
      splitLine0X - splitLineWidth - 0.75 * splitNumberBox0Width;

    const splitNumberBox1Width = numberBoxWidth(this.splits[1]);
    const splitNumberBox1X =
      splitLine1X + splitLineWidth - 0.25 * splitNumberBox1Width;

    const activeDigits: ActiveDigits = initActiveDigits();

    const indexActiveFillIn = fillInBoxes.findIndex(
      e => e === this.activeFillIn,
    );

    if (indexActiveFillIn === -1) throw new Error('Illegal active fillin box');

    for (let i = 0; i < indexActiveFillIn; i++)
      activeDigits[fillInBoxes[i]] = 1000;
    activeDigits[fillInBoxes[indexActiveFillIn]] = this.activeDigit;
    for (let i = indexActiveFillIn + 1; i < fillInBoxes.length; i++)
      activeDigits[fillInBoxes[i]] = 0;

    return html`
      <svg
        viewbox="0 0 1000 350"
        style="height: 100%; background-color: purple;"
      >
        <line x1="0" x2="1000" y1="0" y2="0" stroke="blue" />
        <line x1="0" x2="1000" y1="350" y2="350" stroke="blue" />
        <line x1="0" x2="0" y1="0" y2="350" stroke="blue" />

        ${this.renderNumber(
          this.dividend,
          1000,
          dividendX,
          firstLineY,
          false,
          false,
        )}
        ${this.renderDivisionSign(divisionSignX, firstLineY)}
        ${this.renderNumber(
          this.divisor,
          1000,
          divisorX,
          firstLineY,
          false,
          false,
        )}
        ${this.renderEqualSign(equalSignX, firstLineY)}
        ${this.renderNumber(
          this.subAnswers[0],
          activeDigits.subAnswer0,
          subAnswersX[0],
          firstLineY,
          true,
          this.activeFillIn === 'subAnswer0',
        )}
        ${this.renderPlusSign(plusSignX, firstLineY)}
        ${this.renderNumber(
          this.subAnswers[1],
          activeDigits.subAnswer1,
          subAnswersX[1],
          firstLineY,
          true,
          this.activeFillIn === 'subAnswer1',
        )}
        ${this.renderEqualSign(equalSign2X, firstLineY)}
        ${this.renderNumber(
          this.answer,
          activeDigits.answer,
          answerX,
          firstLineY,
          true,
          this.activeFillIn === 'answer',
        )}
        ${this.renderSplitLine(splitLine0X, splitLinesY, 'left')}
        ${this.renderSplitLine(splitLine1X, splitLinesY, 'right')}
        ${this.renderNumber(
          this.splits[0],
          activeDigits.split0,
          splitNumberBox0X,
          splitNumberBoxesY,
          true,
          this.activeFillIn === 'split0',
        )};
        ${this.renderNumber(
          this.splits[1],
          activeDigits.split1,
          splitNumberBox1X,
          splitNumberBoxesY,
          true,
          this.activeFillIn === 'split1',
        )};
      </svg>
    `;
  }
}
