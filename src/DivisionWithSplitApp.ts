import { html, css } from 'lit';

import { customElement, state } from 'lit/decorators.js';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { range } from 'lit/directives/range.js';

import { create } from 'mutative';

import { TimeLimitedGame2 } from './TimeLimitedGame2';
import { GameLogger } from './GameLogger';

import type { Digit } from './DigitKeyboard';
import './DigitKeyboard';
import { randomFromSet } from './Randomizer';

import { splitInDigits } from './NumberHelperFunctions';
import {
  fillInFields,
  FillInFields,
  initFillInInfo,
  initFixedNumberInfo,
} from './DivideWithSplitWidget';

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

type NeededDigits = {
  [key in FillInFields]: number[];
};
function initEmptyNeededDigits(): NeededDigits {
  return Object.fromEntries(
    fillInFields.map(key => [key, [] as number[]]),
  ) as NeededDigits;
}

@customElement('division-with-split-app')
export class DivisionWithSplitApp extends TimeLimitedGame2 {
  @state()
  accessor fillInNumbers = initFillInInfo();
  @state()
  accessor fixedNumbers = initFixedNumberInfo();

  @state()
  accessor activeDigit = 2;
  @state()
  accessor activeFillIn: FillInFields = 'split0';
  @state()
  accessor neededDigits = initEmptyNeededDigits();
  @state()
  accessor disabledDigits = allEnabledDigits;

  @state()
  accessor exerciseVisible = false;

  @state()
  accessor keyBoardEnabled = false;

  private gameLogger = new GameLogger('Z', 'a');
  private eligibleDivisors: number[] = [];
  private eligibleAnswers: number[] = [];

  private showSubAnswers = true;
  private showHelp = true;

  constructor() {
    super();
    this.parseUrl();
    this.eligibleDivisors = [...range(2, 9)];
  }

  private parseUrl(): void {
    const urlParams = new URLSearchParams(window.location.search);

    // Get allowed decade
    const decadesToUse: number[] = [];
    const decadesFromUrl = urlParams.getAll('decade');

    for (const decadeAsString of decadesFromUrl) {
      const decade = parseInt(decadeAsString, 10);
      if (
        !Number.isNaN(decade) &&
        decade % 10 === 0 &&
        decade >= 10 &&
        decade < 100 &&
        !decadesToUse.find(value => value === decade)
      )
        decadesToUse.push(decade);
    }

    if (decadesToUse.length === 0) decadesToUse.push(10);
    for (const decade of decadesToUse) {
      for (let i = 1; i < 10; i++) this.eligibleAnswers.push(decade + i);
    }

    // Determine whether subanswers should be shown
    if (urlParams.has('hideSubAnswers')) this.showSubAnswers = false;
    else this.showSubAnswers = true;

    // Determine whether help texts should be shown
    if (urlParams.has('hideHelpText')) this.showHelp = false;
    else this.showHelp = true;
  }

  /** Start a new game.
   */
  startNewGame(): void {
    super.startNewGame();
    this.newRound();
  }

  /** Get the text to show in the game over dialog */
  get welcomeMessage(): HTMLTemplateResult {
    return html`<p>
      Splits het eerste getal zodat je er de deler keer een geheel aantal
      tientallen uit haalt en maak dan de som.
    </p>`;
  }

  /** Get the title for the welcome dialog. */
  get welcomeDialogTitle(): string {
    return `Delen met splitsen`;
  }

  executeGameOverActions(): void {
    this.exerciseVisible = false;
    this.keyBoardEnabled = false;
    this.gameLogger.logGameOver();
  }

  static get styles(): CSSResultArray {
    return [
      ...super.styles,
      css`
        .gameContent {
          display: grid;
          grid-template-rows: 0 repeat(2, calc(97% / 2)) 0;
          grid-template-columns: 100%;
          row-gap: 1%;
        }
      `,
    ];
  }

  newRound() {
    const pickedAnswer = randomFromSet(this.eligibleAnswers);
    const pickedDivisor = randomFromSet(this.eligibleDivisors);
    const pickedDividend = pickedAnswer * pickedDivisor;

    this.fixedNumbers = create(this.fixedNumbers, draft => {
      draft.divisor = pickedDivisor;
      draft.dividend = pickedDividend;
    });

    this.fillInNumbers = create(this.fillInNumbers, draft => {
      draft.answer = pickedAnswer;
      draft.subAnswer0 = Math.floor(pickedAnswer / 10) * 10;
      draft.subAnswer1 = pickedAnswer % 10;
      draft.split0 = draft.subAnswer0 * pickedDivisor;
      draft.split1 = pickedDividend - draft.subAnswer0 * pickedDivisor;
    });

    this.neededDigits = create(this.neededDigits, draft => {
      for (const key of fillInFields) {
        draft[key] = splitInDigits(this.fillInNumbers[key]);
      }
    });

    this.disabledDigits = allEnabledDigits;
    this.activeDigit = 0;
    this.activeFillIn = 'split0';
    this.keyBoardEnabled = true;
    this.exerciseVisible = true;
  }

  handleWrongDigit(digit: Digit) {
    this.disabledDigits = create(this.disabledDigits, draft => {
      draft[digit] = true;
    });

    this.numberNok += 1;
  }

  handleCorrectDigit() {
    this.disabledDigits = allEnabledDigits;
    this.activeDigit += 1;
    if (this.activeDigit === this.neededDigits[this.activeFillIn].length) {
      if (this.activeFillIn === 'answer') {
        this.numberOk += 1;
        this.newRound();
      } else {
        this.activeDigit = 0;
        this.advanceActiveFillIn();
      }
    }
  }

  advanceActiveFillIn() {
    if (this.activeFillIn === 'answer')
      throw new Error(`No next fill in possible after ${this.activeFillIn}`);

    if (!this.showSubAnswers && this.activeFillIn === 'split1')
      this.activeFillIn = 'answer';
    else {
      const indexActiveFillIn = fillInFields.findIndex(
        elm => elm === this.activeFillIn,
      );
      if (indexActiveFillIn === -1)
        throw new Error(`Illegal active fill in (${this.activeFillIn})`);

      this.activeFillIn = fillInFields[indexActiveFillIn + 1];
    }
  }

  handleDigit(digit: Digit) {
    const desiredDigit = this.neededDigits[this.activeFillIn][this.activeDigit];
    if (digit === desiredDigit) this.handleCorrectDigit();
    else this.handleWrongDigit(digit);
  }

  renderGameContent(): HTMLTemplateResult {
    // DummyRows are added to get a gap on the top and the bottom.

    const divideWithSplitWidget = this.exerciseVisible
      ? html`
          <divide-with-split-widget
            .fixedNumbers=${this.fixedNumbers}
            .fillInNumbers=${this.fillInNumbers}
            .activeFillIn=${this.activeFillIn}
            .activeDigit=${this.activeDigit}
            .showSubAnswers=${this.showSubAnswers}
            .showHelp=${this.showHelp}
          ></divide-with-split-widget>
        `
      : html`<div></div>`;

    const keyBoard = html`
      <digit-keyboard
        .disabledDigits=${this.disabledDigits}
        .disabled=${!this.keyBoardEnabled}
        @digit-entered=${(evt: CustomEvent<Digit>) =>
          this.handleDigit(evt.detail)}
        >></digit-keyboard
      >
    `;

    return html` <div class="dummyRow"></div>
      ${divideWithSplitWidget} ${keyBoard}
      <div class="dummyRow"></div>`;
  }
}
