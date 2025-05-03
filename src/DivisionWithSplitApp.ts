import { html, css } from 'lit';

// eslint-disable-next-line import/extensions
import { customElement, state } from 'lit/decorators.js';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

// eslint-disable-next-line import/extensions
import { range } from 'lit/directives/range.js';

import { create } from 'mutative';

import { TimeLimitedGame2 } from './TimeLimitedGame2';
import { GameLogger } from './GameLogger';

import type { Digit } from './DigitKeyboard';
import './DigitKeyboard';
import { randomFromSet } from './Randomizer';

import { splitInDigits } from './NumberHelperFunctions';
import type { FillInBoxes } from './DivideWithSplitWidget';
import './DivideWithSplitWidget';

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
  [key in FillInBoxes]: number[];
};

@customElement('division-with-split-app')
export class DivisionWithSplitApp extends TimeLimitedGame2 {
  @state()
  accessor dividend = 126; // Number to divide
  @state()
  accessor divisor = 6;
  @state()
  accessor answer = 21;
  @state()
  accessor splits = [120, 6];
  @state()
  accessor subAnswers = [20, 1];
  @state()
  accessor activeDigit = 2;
  @state()
  accessor activeFillIn: FillInBoxes = 'split0';
  @state()
  accessor neededDigits: NeededDigits = {
    split0: [],
    split1: [],
    subAnswer0: [],
    subAnswer1: [],
    answer: [],
  };
  @state()
  accessor disabledDigits = allEnabledDigits;

  private gameLogger = new GameLogger('Z', 'a');
  private eligibleDivisors: number[] = [];
  private eligibleAnswers: number[] = [];

  private useSubAnswers = true;

  constructor() {
    super();
    this.eligibleDivisors = [...range(2, 9)];
    this.eligibleAnswers = [...range(11, 50)];
  }

  /** Start a new game.
   */
  startNewGame(): void {
    super.startNewGame();
    this.newRound();
  }

  /** Get the text to show in the game over dialog */
  get welcomeMessage(): HTMLTemplateResult {
    return html`<p>Splits het eerste getal eerst en maak dan de som.</p>`;
  }

  /** Get the title for the welcome dialog. */
  get welcomeDialogTitle(): string {
    return `Delen met splitsen`;
  }

  executeGameOverActions(): void {
    this.gameLogger.logGameOver();
  }

  static get styles(): CSSResultArray {
    return [
      ...super.styles,
      css`
        .gameContent {
          display: grid;
          grid-template-rows: 0 repeat(2, calc(97% / 2)) 0;
          row-gap: 1%;
        }
      `,
    ];
  }

  newRound() {
    this.answer = randomFromSet(this.eligibleAnswers);
    this.divisor = randomFromSet(this.eligibleDivisors);

    this.dividend = this.answer * this.divisor;

    this.subAnswers = [Math.floor(this.answer / 10) * 10, this.answer % 10];
    this.splits = [
      this.subAnswers[0] * this.divisor,
      this.dividend - this.subAnswers[0] * this.divisor,
    ];

    this.disabledDigits = allEnabledDigits;
    this.neededDigits = {
      split0: splitInDigits(this.splits[0]),
      split1: splitInDigits(this.splits[1]),
      subAnswer0: splitInDigits(this.subAnswers[0]),
      subAnswer1: splitInDigits(this.subAnswers[1]),
      answer: splitInDigits(this.answer),
    };

    console.log(`newRound needeDigits = ${JSON.stringify(this.neededDigits)}`);
    console.log(`newRound subAnswers = ${this.subAnswers}`);
    this.activeDigit = 0;
    this.activeFillIn = 'split0';
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
    switch (this.activeFillIn) {
      case 'split0':
        this.activeFillIn = 'split1';
        break;
      case 'split1':
        if (this.useSubAnswers) this.activeFillIn = 'subAnswer0';
        else this.activeFillIn = 'answer';
        break;
      case 'subAnswer0':
        this.activeFillIn = 'subAnswer1';
        break;
      case 'subAnswer1':
        this.activeFillIn = 'answer';
        break;
      default:
        throw new Error(
          `Illegal active fill in (${this.activeFillIn}) or no next fill in possible`,
        );
    }
  }

  handleDigit(digit: Digit) {
    const desiredDigit = this.neededDigits[this.activeFillIn][this.activeDigit];
    if (digit === desiredDigit) this.handleCorrectDigit();
    else this.handleWrongDigit(digit);
  }

  renderGameContent(): HTMLTemplateResult {
    // DummyRows are added to get a gap on the top and the bottom.

    return html` <div class="dummyRow"></div>
      <divide-with-split-widget
        .dividend=${this.dividend}
        .divisor=${this.divisor}
        .splits=${this.splits}
        .subAnswers=${this.subAnswers}
        .answer=${this.answer}
        .activeFillIn=${this.activeFillIn}
        .activeDigit=${this.activeDigit}
      ></divide-with-split-widget>
      <digit-keyboard
        .disabledDigits=${this.disabledDigits}
        @digit-entered="${(evt: CustomEvent<Digit>) =>
          this.handleDigit(evt.detail)}"
        >></digit-keyboard
      >
      <div class="dummyRow"></div>`;
  }
}
