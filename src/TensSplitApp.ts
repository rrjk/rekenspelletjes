import { html, css } from 'lit';

import { customElement, state } from 'lit/decorators.js';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { TimeLimitedGame2 } from './TimeLimitedGame2';
import { GameLogger } from './GameLogger';

import './TensSplitWidget';
import type { Digit } from './DigitKeyboard';
import './DigitKeyboard';
import { randomFromSet } from './Randomizer';

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

@customElement('tens-split-app')
export class TensSplitApp extends TimeLimitedGame2 {
  @state()
  accessor numberToSplit = 96;
  @state()
  accessor activeDigit = 0;
  @state()
  accessor disabledDigits = allEnabledDigits;

  private gameLogger = new GameLogger('W', 'a');
  private eligibleNumbersToSplit: number[] = [];

  constructor() {
    super();
    for (let tens = 1; tens < 10; tens++)
      for (let units = 1; units < 10; units++)
        this.eligibleNumbersToSplit.push(tens * 10 + units);
  }

  /** Start a new game.
   */
  startNewGame(): void {
    super.startNewGame();
    this.newRound();
  }

  /** Get the text to show in the game over dialog */
  get welcomeMessage(): HTMLTemplateResult {
    return html`<p>Splits het getal in tientallen en eenheden.</p>`;
  }

  /** Get the title for the welcome dialog. */
  get welcomeDialogTitle(): string {
    return `Splitsen op waarde`;
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
    this.numberToSplit = randomFromSet(this.eligibleNumbersToSplit);
    this.disabledDigits = allEnabledDigits;
    this.activeDigit = 0;
  }

  handleWrongDigit(digit: Digit) {
    const tempDisabledDigits = [...this.disabledDigits]; // Here we make a copy such that a render is triggered
    tempDisabledDigits[digit] = true;
    this.disabledDigits = tempDisabledDigits;
    this.numberNok += 1;
  }

  handleCorrectDigit() {
    this.disabledDigits = allEnabledDigits;
    this.activeDigit += 1;
    if (this.activeDigit === 3) {
      this.numberOk += 1;
      this.newRound();
    }
  }

  handleDigit(digit: Digit) {
    let desiredDigit = 0;
    if (this.activeDigit === 0)
      desiredDigit = Math.floor(this.numberToSplit / 10);
    else if (this.activeDigit === 1) desiredDigit = 0;
    else if (this.activeDigit === 2) desiredDigit = this.numberToSplit % 10;

    if (digit === desiredDigit) this.handleCorrectDigit();
    else this.handleWrongDigit(digit);
  }

  renderGameContent(): HTMLTemplateResult {
    // DummyRows are added to get a gap on the top and the bottom.

    return html` <div class="dummyRow"></div>
      <tens-split-widget
        numberToSplit="${this.numberToSplit} "
        activeDigit=${this.activeDigit}
      ></tens-split-widget>
      <digit-keyboard
        .disabledDigits=${this.disabledDigits}
        @digit-entered=${(evt: CustomEvent<Digit>) =>
          this.handleDigit(evt.detail)}
        >></digit-keyboard
      >
      <div class="dummyRow"></div>`;
  }
}
