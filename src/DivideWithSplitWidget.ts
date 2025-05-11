/* eslint-disable max-classes-per-file */

import { LitElement, html, css, svg } from 'lit';
import type {
  CSSResultArray,
  HTMLTemplateResult,
  PropertyValues,
  SVGTemplateResult,
} from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, property, state } from 'lit/decorators.js';
// eslint-disable-next-line import/extensions
import { classMap } from 'lit/directives/class-map.js';

import { create } from 'mutative';

import {
  numberDigitsInNumber,
  numberWithActiveDigits,
} from './NumberHelperFunctions';

export const fixedNumberFields = ['divisor', 'dividend'] as const;
export type FixedNumberFields = (typeof fixedNumberFields)[number];
export type FixedNumberInfo = Record<FixedNumberFields, number>;
export function initFixedNumberInfo(): FixedNumberInfo {
  const ret: Partial<FixedNumberInfo> = {};
  for (const key of fixedNumberFields) ret[key] = 0;
  return ret as FixedNumberInfo;
}

export const fillInFields = [
  'split0',
  'split1',
  'subAnswer0',
  'subAnswer1',
  'answer',
] as const;
export type FillInFields = (typeof fillInFields)[number];
export type FillInInfo = Record<FillInFields, number>;
export function initFillInInfo(): FillInInfo {
  const ret: Partial<FillInInfo> = {};
  for (const key of fillInFields) ret[key] = 0;
  return ret as FillInInfo;
}

type Position = {
  x: number;
  y: number;
};

const symbolFields = [
  'divisionSign',
  'equalSign0',
  'plusSign',
  'equalSign1',
] as const;
type SymbolFields = (typeof symbolFields)[number];

function symbolWidth(symbol: SymbolFields): number {
  if (symbol.indexOf('divisionSign') === 0) return 18.5;
  if (symbol.indexOf(`equalSign`) === 0) return 47;
  if (symbol.indexOf('plusSign') === 0) return 47;
  return 0;
}

function symbolString(symbol: SymbolFields): string {
  if (symbol.indexOf('divisionSign') === 0) return `∶`;
  if (symbol.indexOf(`equalSign`) === 0) return `=`;
  if (symbol.indexOf('plusSign') === 0) return `+`;
  return '';
}

function renderSymbol(pos: Position, symbol: SymbolFields): SVGTemplateResult {
  return svg`
    <text x="${pos.x}" y="${pos.y + 75}">${symbolString(symbol)}</text>`;
}

type FieldInfo = {
  position: Position;
  width: number;
  visible: boolean;
};
function initFieldInfo(): FieldInfo {
  return {
    position: { x: 0, y: 0 },
    width: 0,
    visible: false,
  };
}

type FillInFieldInfo = FieldInfo & {
  visibleDigits: number;
  active: boolean;
};
function initFillInFieldInfo(): FillInFieldInfo {
  const ret: Partial<FillInFieldInfo> = initFieldInfo();
  ret.visibleDigits = 0;
  ret.active = false;

  return ret as FillInFieldInfo;
}

const splitLineDirections = ['left', 'right'] as const;
type SplitLineDirection = (typeof splitLineDirections)[number];

const digitWidth = 44.5;
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

const splitHelperFields = ['helpSplit0', 'helpSplit1'] as const;
type SplitHelperFields = (typeof splitHelperFields)[number];

function renderSplitHelperField(
  pos: Position,
  divisor: number,
  field: SplitHelperFields,
): SVGTemplateResult {
  if (field === 'helpSplit0')
    return svg`
      <text class="explanationText" x="${pos.x}" y="${pos.y + 30}">Geheel aantal </text> 
      <text class="explanationText" x="${pos.x}" y="${pos.y + 60}">tientallen keer ${divisor}</text>`;
  if (field === 'helpSplit1')
    return svg`
      <text class="explanationText" x="${pos.x}" y="${pos.y + 30}">Rest</text>`;
  throw new Error(`Illegal field ${field}`);
}

const subAnswerHelperFields = ['helpSubAnswer0', 'helpSubAnswer1'] as const;
type SubAnswerHelperFields = (typeof subAnswerHelperFields)[number];

function renderSubAnswerHelperField(
  pos: Position,
  split0: number,
  split1: number,
  divisor: number,
  field: SubAnswerHelperFields,
) {
  if (field === 'helpSubAnswer0')
    return svg`<text class="explanationText" x="${pos.x}" y="${pos.y + 30}">${split0}∶${divisor} </text>`;
  if (field === 'helpSubAnswer1')
    return svg`<text class="explanationText" x="${pos.x}" y="${pos.y + 30}">${split1}∶${divisor} </text>`;
  throw new Error(`Illegal field ${field}`);
}

type FieldsRenderInfo = {
  [key in
    | FixedNumberFields
    | SymbolFields
    | SplitLineDirection
    | SplitHelperFields
    | SubAnswerHelperFields]: FieldInfo;
} & { [key in FillInFields]: FillInFieldInfo };
function initFieldsRenderInfo(): FieldsRenderInfo {
  const ret: Partial<FieldsRenderInfo> = {};
  for (const key of fillInFields) {
    ret[key] = initFillInFieldInfo();
  }
  for (const key of [
    ...symbolFields,
    ...fixedNumberFields,
    ...splitLineDirections,
    ...splitHelperFields,
    ...subAnswerHelperFields,
  ]) {
    ret[key] = initFieldInfo();
  }
  return ret as FieldsRenderInfo;
}

type AllFields =
  | FixedNumberFields
  | FillInFields
  | SymbolFields
  | SplitLineDirection;

const firstLineFieldsWithSubAnswers: AllFields[] = [
  'dividend',
  'divisionSign',
  'divisor',
  'equalSign0',
  'subAnswer0',
  'plusSign',
  'subAnswer1',
  'equalSign1',
  'answer',
] as const;
const firstLineFieldsWithoutSubAnswers: AllFields[] = [
  'dividend',
  'divisionSign',
  'divisor',
  'equalSign0',
  'answer',
] as const;

function renderNumber(
  nmbr: number,
  activeDigits: number,
  pos: Position,
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
          x="${pos.x}" 
          y="${pos.y}" 
          width="${numberBoxWidth(nmbr)}" 
          height="90"  />
    <text x="${pos.x + 5}" y="${pos.y + 75}">${numberWithActiveDigits(nmbr, activeDigits)}</text>`;
}

function renderSplitLine(
  pos: Position,
  splitLineDirection: SplitLineDirection,
): SVGTemplateResult {
  const xEnd =
    pos.x + (splitLineDirection === 'left' ? -splitLineWidth : splitLineWidth);
  const yEnd = pos.y + splitLineHeight;
  return svg`<line
        x1="${pos.x}"
        x2="${xEnd}"
        y1="${pos.y}"
        y2="${yEnd}"
        stroke="black"
        stroke-width="5"
      />`;
}

function convertJSON<T>(value: string | null): T {
  console.log(`convertFixedNumbers called`);
  console.log(value);
  if (value !== null) {
    const parsedValue = JSON.parse(value);
    return parsedValue;
  }
  throw new Error(`illegally formatted attribute provided`);
}

@customElement('divide-with-split-widget')
export class DivideWihSplitWidget extends LitElement {
  @property({ converter: convertJSON<FixedNumberInfo> })
  accessor fixedNumbers = initFixedNumberInfo();

  @property({ converter: convertJSON<FillInInfo> })
  accessor fillInNumbers = initFillInInfo();

  @property({ type: String })
  accessor activeFillIn: FillInFields = 'split0';

  @property({ type: Number })
  accessor activeDigit = 0; // Which digit should be active, counting starts at 0

  @property({ type: Boolean })
  accessor showSubAnswers: boolean = false;

  @property({ type: Boolean })
  accessor showHelp: boolean = false;

  @state()
  accessor fieldsRenderInfo = initFieldsRenderInfo();

  @state()
  accessor firstLineFields: AllFields[] = [];

  setFirstLineFields() {
    if (this.showSubAnswers) {
      this.firstLineFields = firstLineFieldsWithSubAnswers;
    } else this.firstLineFields = firstLineFieldsWithoutSubAnswers;
  }

  setElementPositions() {
    this.fieldsRenderInfo = create(this.fieldsRenderInfo, draft => {
      for (const key of fixedNumberFields) {
        draft[key].width = numberBoxWidth(this.fixedNumbers[key]);
      }
      for (const key of fillInFields) {
        draft[key].width = numberBoxWidth(this.fillInNumbers[key]);
      }
      for (const key of symbolFields) {
        draft[key].width = symbolWidth(key);
      }

      const firstLineY = spaceWidth;

      let firstLineWidth = 0;

      for (const field of this.firstLineFields) {
        firstLineWidth += draft[field].width + spaceWidth;
      }
      firstLineWidth -= spaceWidth;

      let currentPos = (825 - firstLineWidth) / 2 + 50;

      for (const field of this.firstLineFields) {
        draft[field].position.x = currentPos;
        draft[field].position.y = firstLineY;
        draft[field].visible = true;
        currentPos += draft[field].width + spaceWidth;
      }

      const splitLinesY = firstLineY + boxHeight + spaceWidth;

      const dividendMidX =
        draft.dividend.position.x + 0.5 * draft.dividend.width;
      draft.left = {
        position: {
          x: dividendMidX - spaceWidth,
          y: splitLinesY,
        },
        width: 0,
        visible: true,
      };
      draft.right = {
        position: {
          x: dividendMidX + spaceWidth,
          y: splitLinesY,
        },
        width: 0,
        visible: true,
      };

      const thirdLineY = splitLinesY + splitLineHeight + spaceWidth;

      draft.split0.position = {
        x: draft.left.position.x - splitLineWidth - 0.75 * draft.split0.width,
        y: thirdLineY,
      };
      draft.split0.visible = true;

      draft.split1.position = {
        x: draft.right.position.x + splitLineWidth - 0.25 * draft.split1.width,
        y: thirdLineY,
      };
      draft.split1.visible = true;

      const helpSplitFieldsY = thirdLineY + boxHeight + spaceWidth;

      draft.helpSplit0.position = {
        x: draft.split0.position.x + draft.split0.width / 2,
        y: helpSplitFieldsY,
      };
      draft.helpSplit0.visible = this.showHelp;

      draft.helpSplit1.position = {
        x: draft.split1.position.x + draft.split1.width / 2,
        y: helpSplitFieldsY,
      };
      draft.helpSplit1.visible = this.showHelp;

      const helpSubAnswerFieldsY = firstLineY + boxHeight + spaceWidth;

      draft.helpSubAnswer0.position = {
        x: draft.subAnswer0.position.x + draft.subAnswer0.width / 2,
        y: helpSubAnswerFieldsY,
      };

      draft.helpSubAnswer1.position = {
        x: draft.subAnswer1.position.x + draft.subAnswer1.width / 2,
        y: helpSubAnswerFieldsY,
      };
    });
  }

  setActiveFillIn() {
    this.fieldsRenderInfo = create(this.fieldsRenderInfo, draft => {
      for (const key of fillInFields) {
        if (key === this.activeFillIn) draft[key].active = true;
        else draft[key].active = false;
      }
      if (this.activeFillIn !== 'split0')
        draft.helpSubAnswer0.visible = this.showHelp && this.showSubAnswers;
      else draft.helpSubAnswer0.visible = false;
      if (this.activeFillIn !== 'split0' && this.activeFillIn !== 'split1')
        draft.helpSubAnswer1.visible = this.showHelp && this.showSubAnswers;
      else draft.helpSubAnswer1.visible = false;
    });
  }

  setActiveDigits() {
    const indexActiveFillIn = fillInFields.findIndex(
      e => e === this.activeFillIn,
    );

    if (indexActiveFillIn === -1) throw new Error('Illegal active fillin box');

    this.fieldsRenderInfo = create(this.fieldsRenderInfo, draft => {
      for (let i = 0; i < indexActiveFillIn; i++)
        draft[fillInFields[i]].visibleDigits = 1000;
      draft[fillInFields[indexActiveFillIn]].visibleDigits = this.activeDigit;
      for (let i = indexActiveFillIn + 1; i < fillInFields.length; i++)
        draft[fillInFields[i]].visibleDigits = 0;
    });
  }

  protected willUpdate(_changedProperties: PropertyValues<this>): void {
    if (_changedProperties.has('showSubAnswers')) {
      this.setFirstLineFields();
      this.setElementPositions();
    }
    if (
      _changedProperties.has(`fixedNumbers`) ||
      _changedProperties.has(`fillInNumbers`)
    ) {
      this.setElementPositions();
    }
    if (_changedProperties.has('activeFillIn')) {
      this.setActiveFillIn();
      this.setActiveDigits();
    }
    if (_changedProperties.has(`activeDigit`)) {
      this.setActiveDigits();
    }
  }

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

        .explanationText {
          font-size: 25px;
          text-anchor: middle;
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

  render(): HTMLTemplateResult {
    const elements: SVGTemplateResult[] = [];

    for (const key of fixedNumberFields) {
      if (this.fieldsRenderInfo[key].visible) {
        elements.push(
          renderNumber(
            this.fixedNumbers[key],
            1000,
            this.fieldsRenderInfo[key].position,
            false,
            false,
          ),
        );
      }
    }
    for (const key of fillInFields) {
      if (this.fieldsRenderInfo[key].visible) {
        elements.push(
          renderNumber(
            this.fillInNumbers[key],
            this.fieldsRenderInfo[key].visibleDigits,
            this.fieldsRenderInfo[key].position,
            true,
            this.fieldsRenderInfo[key].active,
          ),
        );
      }
    }
    for (const key of symbolFields) {
      if (this.fieldsRenderInfo[key].visible) {
        elements.push(renderSymbol(this.fieldsRenderInfo[key].position, key));
      }
    }
    for (const key of splitLineDirections) {
      if (this.fieldsRenderInfo[key].visible) {
        elements.push(
          renderSplitLine(this.fieldsRenderInfo[key].position, key),
        );
      }
    }
    for (const key of splitHelperFields) {
      if (this.fieldsRenderInfo[key].visible === true)
        elements.push(
          renderSplitHelperField(
            this.fieldsRenderInfo[key].position,
            this.fixedNumbers.divisor,
            key,
          ),
        );
    }
    for (const key of subAnswerHelperFields) {
      if (this.fieldsRenderInfo[key].visible === true)
        elements.push(
          renderSubAnswerHelperField(
            this.fieldsRenderInfo[key].position,
            this.fillInNumbers.split0,
            this.fillInNumbers.split1,
            this.fixedNumbers.divisor,
            key,
          ),
        );
    }

    return html` <svg viewbox="0 0 825 350" style="height: 100%; ">
      ${elements}
    </svg>`;
  }
}
