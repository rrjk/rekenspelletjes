import { html, css } from 'lit';

import { customElement, state } from 'lit/decorators.js';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { create } from 'mutative';

import { TimeLimitedGame2 } from './TimeLimitedGame2';
import { GameLogger } from './GameLogger';

import {
  randomFromIterable,
  randomFromSet,
  randomIntFromRange,
} from './Randomizer';

import { numberDigitsInNumber, splitInDigits } from './NumberHelperFunctions';

import './SimpleSumWidget';
import './PuzzlePhotoFrame';
import type { Digit } from './DigitKeyboard';
import './DigitKeyboard';

import { Operator, operators } from './Operator';
import { UnexpectedValueError } from './UnexpectedValueError';

const allEnabledDigits = [
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
];

@customElement('mixed-sums-game-app')
export class MixedSumsGameApp extends TimeLimitedGame2 {
  @state()
  private accessor operand1 = 0;
  @state()
  private accessor operand2 = 0;
  @state()
  private accessor operator: Operator = 'plus';
  @state()
  private accessor answer = 0;

  @state()
  private accessor maxDigitsAnswer = -1;
  @state()
  private accessor maxDigitsOperand1 = -1;
  @state()
  private accessor maxDigitsOperand2 = -1;

  @state()
  private accessor activeDigit = 0;
  @state()
  private accessor fillInActive = true;
  @state()
  private accessor disabledDigits = allEnabledDigits;

  @state()
  private accessor sumVisible = false;
  @state()
  private accessor keyBoardEnabled = false;

  private gameLogger = new GameLogger('AC', 'a');
  private eligibleOperators: Operator[] = []; // We use an array as we need to often select a element randomly and hence need direct access
  private eligibleTables: number[] = []; // We use an array as we need to often select a element randomly and hence need direct access
  private maximumNumber = 10;

  constructor() {
    super();
    this.parseUrl();
  }

  /** Determine maximum number of digits for operand 1 */
  determineMaxDigitsOperand1() {
    this.maxDigitsOperand1 = -1;
    if (this.eligibleOperators.includes('divide')) {
      const maxTable = this.eligibleTables.reduce((max, currentValue) =>
        Math.max(max, currentValue),
      );
      this.maxDigitsOperand1 = Math.max(
        this.maxDigitsOperand1,
        numberDigitsInNumber(10 * maxTable),
      );
    }
    if (this.eligibleOperators.includes('times')) {
      this.maxDigitsOperand1 = Math.max(this.maxDigitsOperand1, 2);
    }
    if (
      this.eligibleOperators.includes('plus') ||
      this.eligibleOperators.includes('minus')
    ) {
      this.maxDigitsOperand1 = Math.max(
        this.maxDigitsOperand1,
        numberDigitsInNumber(this.maximumNumber),
      );
    }
  }

  /** Determine maximum number of digits for operand 1 */
  determineMaxDigitsOperand2() {
    this.maxDigitsOperand2 = -1;
    if (
      this.eligibleOperators.includes('times') ||
      this.eligibleOperators.includes('divide')
    ) {
      const maxTable = this.eligibleTables.reduce((max, currentValue) =>
        Math.max(max, currentValue),
      );
      this.maxDigitsOperand2 = Math.max(
        this.maxDigitsOperand2,
        numberDigitsInNumber(maxTable),
      );
    }
    if (
      this.eligibleOperators.includes('plus') ||
      this.eligibleOperators.includes('minus')
    ) {
      this.maxDigitsOperand2 = Math.max(
        this.maxDigitsOperand2,
        numberDigitsInNumber(this.maximumNumber),
      );
    }
  }

  /** Determine maximum number of digits for operand 1 */
  determineMaxDigitsAnswer() {
    this.maxDigitsAnswer = -1;
    if (this.eligibleOperators.includes('divide')) {
      this.maxDigitsAnswer = Math.max(this.maxDigitsAnswer, 2);
    }
    if (this.eligibleOperators.includes('times')) {
      const maxTable = this.eligibleTables.reduce((max, currentValue) =>
        Math.max(max, currentValue),
      );
      this.maxDigitsAnswer = Math.max(
        this.maxDigitsAnswer,
        numberDigitsInNumber(10 * maxTable),
      );
    }
    if (
      this.eligibleOperators.includes('plus') ||
      this.eligibleOperators.includes('minus')
    ) {
      this.maxDigitsAnswer = Math.max(
        this.maxDigitsAnswer,
        numberDigitsInNumber(this.maximumNumber),
      );
    }
  }

  parseUrl(): void {
    const urlParams = new URLSearchParams(window.location.search);

    this.eligibleTables = [];
    this.eligibleTables = [];
    this.maximumNumber = 10;

    /* Determine the set of operators to use based on the URL
     * We deliberately do not check for duplicates to allow influecing how often an operator is selected
     */
    const operatorsFromUrl = urlParams.getAll('operator');
    for (const operatorString of operatorsFromUrl) {
      const operator = operators.find(elm => elm === operatorString);
      if (operator !== undefined) this.eligibleOperators.push(operator);
    }
    if (this.eligibleOperators.length === 0)
      this.eligibleOperators.push('plus');

    // Get maximum number
    const maxFromUrl = urlParams.get('max');
    // If we don't find a proper maximum in the URL, we use 100.
    this.maximumNumber = 100;
    if (maxFromUrl !== null) {
      const maxAsInt = parseInt(maxFromUrl, 10);
      if (maxAsInt === 10 || maxAsInt === 100 || maxAsInt === 1000)
        this.maximumNumber = maxAsInt; // When the max in the URL is not a number or not 10, 100 or 1000
    }

    /* Determine the set of operators to use based on the URL
     * We deliberately do not check for duplicates to allow influecing how often an operator is selected
     */
    const tablesFromUrl = urlParams.getAll('table');
    for (const tableAsString of tablesFromUrl) {
      const tableAsNumber = parseInt(tableAsString, 10);
      if (!isNaN(tableAsNumber)) {
        this.eligibleTables.push(tableAsNumber);
      }
    }
    if (this.eligibleTables.length === 0)
      this.eligibleTables = [2, 3, 4, 5, 6, 7, 8, 9];

    this.determineMaxDigitsOperand1();
    this.determineMaxDigitsOperand2();
    this.determineMaxDigitsAnswer();
  }

  startNewGame(): void {
    super.startNewGame();
    this.newRound();
  }

  /** Get the text to show in the game over dialog */
  get welcomeMessage(): HTMLTemplateResult {
    return html`<p>Los de som op.</p>`;
  }

  /** Get the title for the welcome dialog. */
  get welcomeDialogTitle(): string {
    return `Gemengde sommen`;
  }

  executeGameOverActions(): void {
    this.sumVisible = false;
    this.keyBoardEnabled = false;
    this.gameLogger.logGameOver();
  }

  determineOperandsForPlus() {
    this.answer = randomIntFromRange(1, this.maximumNumber);
    this.operand1 = randomIntFromRange(1, this.answer);
    this.operand2 = this.answer - this.operand1;
  }

  determineOperandsForMinus() {
    this.answer = randomIntFromRange(1, this.maximumNumber);
    this.operand1 = randomIntFromRange(this.answer, this.maximumNumber);
    this.operand2 = this.operand1 - this.answer;
  }

  determineOperandsForTimes() {
    this.operand2 = randomFromSet(this.eligibleTables);
    this.operand1 = randomIntFromRange(2, 10);
    this.answer = this.operand1 * this.operand2;
  }

  determineOperandsForDivision() {
    this.operand2 = randomFromSet(this.eligibleTables);
    this.answer = randomIntFromRange(2, 10);
    this.operand1 = this.operand2 * this.answer;
  }

  newRound() {
    const pickedOperator = randomFromIterable(this.eligibleOperators);

    if (pickedOperator === 'plus') this.determineOperandsForPlus();
    else if (pickedOperator === 'minus') this.determineOperandsForMinus();
    else if (pickedOperator === 'times') this.determineOperandsForTimes();
    else if (pickedOperator === 'divide') this.determineOperandsForDivision();
    else throw new UnexpectedValueError(pickedOperator);

    this.operator = pickedOperator;

    this.disabledDigits = allEnabledDigits;
    this.activeDigit = 0;
    this.keyBoardEnabled = true;
    this.sumVisible = true;
  }

  handleDigit(evt: CustomEvent<Digit>): void {
    const digits = splitInDigits(this.answer);
    if (digits[this.activeDigit] === evt.detail) {
      this.activeDigit += 1;
      this.disabledDigits = allEnabledDigits;
      if (this.activeDigit === digits.length) {
        this.numberOk += 1;
        this.newRound();
      }
    } else {
      this.disabledDigits = create(this.disabledDigits, draft => {
        draft[evt.detail] = true;
        this.numberNok += 1;
      });
    }
  }

  static get styles(): CSSResultArray {
    return [
      ...super.styles,
      css`
        .gameContent {
          display: grid;
          justify-items: center;
          align-items: center;
          --piece-absent-color: #ededed;
        }

        @media (aspect-ratio > 6/8) {
          .gameContent {
            grid-template-rows: 30% 70%;
            grid-template-columns: 50% 50%;
            grid-template-areas:
              'sum    sum'
              'puzzle keyboard';
          }
        }
        @media (aspect-ratio < 6/8) {
          .gameContent {
            grid-template-rows: 20% 40% 40%;
            grid-template-columns: 100%;
            grid-template-areas:
              'sum'
              'puzzle'
              'keyboard';
          }
        }

        simple-sum-widget {
          grid-area: sum;
          width: 100%;
          height: 100%;
        }

        puzzle-photo-frame {
          grid-area: puzzle;
          height: 90%;
          width: 90%;
        }

        digit-keyboard {
          grid-area: keyboard;
          height: 90%;
          width: 90%;
        }
      `,
    ];
  }

  renderGameContent(): HTMLTemplateResult {
    return html`
      <simple-sum-widget
        id="sum"
        .operand1=${this.operand1}
        .operand2=${this.operand2}
        .operator=${this.operator}
        .visibleDigits=${this.activeDigit}
        .minDigitsAnswer=${this.maxDigitsAnswer}
        .minDigitsOperand1=${this.maxDigitsOperand1}
        .minDigitsOperand2=${this.maxDigitsOperand2}
        ?sumVisible=${this.sumVisible}
      ></simple-sum-widget>

      <puzzle-photo-frame
        .numberVisiblePieces=${Math.max(0, this.numberOk - this.numberNok)}
      ></puzzle-photo-frame>
      <digit-keyboard
        @digit-entered=${(evt: CustomEvent<Digit>) => this.handleDigit(evt)}
        ?disabled=${!this.keyBoardEnabled}
        .disabledDigits=${this.disabledDigits}
      ></digit-keyboard>
    `;
  }
}
