import { html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { TimeLimitedGame2 } from './TimeLimitedGame2';

import './RealHeight';
import { GameLogger } from './GameLogger';
import type { PossibleNumberDots } from './HandImage';
import './HandImage';
import { randomFromSetAndSplice } from './Randomizer';

import type { Digit, DigitKeyboard } from './DigitKeyboard';
import './DigitKeyboard';

type HandIds = 0 | 1;

@customElement('which-is-bigger-app')
export class WhichIsBiggerApp extends TimeLimitedGame2 {
  @state()
  private accessor numberDotsHands: PossibleNumberDots[] = [0, 0];
  @state()
  private accessor handStyle: ('handCorrect' | 'handWrong' | '')[] = ['', ''];
  @state()
  private accessor handDisabled = [false, false];
  @state()
  private accessor keyboardDisabled = true;
  @state()
  private accessor includeDifference = true;
  @state()
  private accessor countOnly = false;

  private maxDifference = 9;
  private wrongHandSelected = false;

  private gameLogger = new GameLogger('O', 'a');

  constructor() {
    super();
    this.parseUrl();
  }

  parseUrl() {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has('countOnly')) {
      const countOnly = urlParams.get('countOnly');
      if (countOnly && countOnly === 'true') this.countOnly = true;
      else this.countOnly = false;
    }

    if (urlParams.has('maxDifference')) {
      const maxDifference = parseInt(urlParams.get('maxDifference') || '', 10);
      if (!maxDifference || maxDifference < 3 || maxDifference > 9) {
        this.maxDifference = 9;
      } else {
        this.maxDifference = maxDifference;
      }
    }

    if (urlParams.has('includeDifference')) {
      const includeDifference = urlParams.get('includeDifference');
      if (
        includeDifference &&
        includeDifference === 'false' &&
        this.countOnly === false
      )
        this.includeDifference = false;
      else this.includeDifference = true;
    }

    if (this.countOnly) this.gameLogger.setSubCode('a');
    else if (!this.includeDifference) this.gameLogger.setSubCode('b');
    else this.gameLogger.setSubCode('c');
  }

  static get styles(): CSSResultArray {
    return [
      ...super.styles,
      css`
        button {
          display: block;
          width: 40%;
          height: 90%;
          border: none;
          background-color: transparent;
        }
        digit-keyboard {
          width: 80%;
          height: 90%;
        }
        .handCorrect {
          --hand-fill-color: green;
        }

        .handWrong {
          --hand-fill-color: red;
        }

        hand-with-dots {
          height: 100%;
          width: 100%;
          max-height: 100%;
          max-width: 100%;

          --hand-stroke-color: #800000;
          --dot-color: #800000;
        }

        .bar {
          display: flex;
          justify-content: space-evenly;
          align-items: center;
          flex-wrap: wrap;
          height: 50%;
          width: 100%;
        }
      `,
    ];
  }

  /** Start a new game.
   */
  startNewGame(): void {
    super.startNewGame();
    this.newRound();
  }

  newRound(): void {
    let possibleNumberDots: PossibleNumberDots[] = [];
    if (this.countOnly) possibleNumberDots = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    // If we only count, we cannot handle 0 as it's not on the keyboard.
    else possibleNumberDots = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    let potentialNumberDots: PossibleNumberDots = 0;

    do {
      potentialNumberDots = randomFromSetAndSplice(possibleNumberDots);
    } while (this.numberDotsHands[0] === potentialNumberDots); // We want to prevent keeping the same number of dots on a hand.
    this.numberDotsHands[0] = potentialNumberDots;

    this.handStyle = ['', ''];
    this.wrongHandSelected = false;

    if (this.countOnly) {
      /* If we only count the dots on one hand, we set the number of dots on the second hand to zero
       * That way the difference will be exactly the number of dots on the first hand and we can keep all the logic the same
       */
      this.numberDotsHands[1] = 0;
      this.handDisabled = [true, true];
    } else {
      possibleNumberDots = possibleNumberDots.filter(
        x => Math.abs(x - this.numberDotsHands[0]) <= this.maxDifference,
      );

      do {
        potentialNumberDots = randomFromSetAndSplice(possibleNumberDots);
      } while (this.numberDotsHands[1] === potentialNumberDots); // We want to prevent keeping the same number of dots on a hand.
      this.numberDotsHands[1] = potentialNumberDots;
      this.handDisabled = [false, false];
    }

    if (this.includeDifference) {
      this.getElement<DigitKeyboard>('digit-keyboard').enableAllDigits();
      if (this.countOnly) this.keyboardDisabled = false;
      else this.keyboardDisabled = true;
    }
    this.requestUpdate(); // As we are updating an array, we need to explicitely request an update
  }

  get welcomeMessage(): HTMLTemplateResult {
    let res = html``;
    if (this.countOnly) {
      res = html`<p>Tel het aantal stippen op de hand.</p>`;
    } else if (this.includeDifference)
      res = html`<p>Wijs de hand aan met de meeste stippen.</p>
        <p>
          Vertel daarna hoeveel stippen die hand er meer heeft dan de andere
          hand.
        </p>`;
    else if (!this.includeDifference)
      res = html`<p>Wijs de hand aan met de meeste stippen.</p>`;

    return res;
  }

  executeGameOverActions(): void {
    this.gameLogger.logGameOver();
  }

  /** Get the title for the welcome dialog. */
  get welcomeDialogTitle(): string {
    return `Stippen tellen`;
  }

  handleHandClick(handId: HandIds) {
    let ok = true;
    for (const hand of this.numberDotsHands)
      if (hand > this.numberDotsHands[handId]) ok = false;
    if (ok) {
      if (this.includeDifference) {
        this.handStyle[handId] = 'handCorrect';
        this.handDisabled = [true, true];
        this.keyboardDisabled = false;
      } else {
        // Only when the hand is selected correctly immediately it will count if no difference needs to be provided
        if (!this.wrongHandSelected) this.numberOk += 1;
        this.newRound();
      }
    } else {
      this.numberNok += 1;
      this.handStyle[handId] = 'handWrong';
      this.handDisabled[handId] = true;
      this.wrongHandSelected = true;
    }

    this.requestUpdate();
  }

  handleDigit(digit: Digit) {
    if (Math.abs(this.numberDotsHands[0] - this.numberDotsHands[1]) === digit) {
      this.numberOk += 1;
      this.newRound();
    } else {
      this.numberNok += 1;
      this.getElement<DigitKeyboard>('digit-keyboard').disable(digit);
    }
  }

  renderGameContent(): HTMLTemplateResult {
    let keyboard = html``;
    if (this.includeDifference) {
      keyboard = html`
      <div class="bar">
        <digit-keyboard showTen ?disabled=${
          this.keyboardDisabled
        } @digit-entered="${(evt: CustomEvent<Digit>) =>
          this.handleDigit(evt.detail)}">
        </digit-keyboad>
      </div>`;
    }

    let hands = html``;
    if (this.countOnly) {
      hands = html`
        <button
          @click=${() => this.handleHandClick(0)}
          ?disabled=${this.handDisabled[0]}
        >
          <hand-with-dots
            class="${this.handStyle[0]}"
            numberDots=${this.numberDotsHands[0]}
          ></hand-with-dots>
        </button>
      `;
    } else {
      hands = html`
        <button
          @click=${() => this.handleHandClick(0)}
          ?disabled=${this.handDisabled[0]}
        >
          <hand-with-dots
            class="${this.handStyle[0]}"
            numberDots=${this.numberDotsHands[0]}
          ></hand-with-dots>
        </button>
        <button
          @click=${() => this.handleHandClick(1)}
          ?disabled=${this.handDisabled[1]}
        >
          <hand-with-dots
            class="${this.handStyle[1]}"
            numberDots=${this.numberDotsHands[1]}
          ></hand-with-dots>
        </button>
      `;
    }

    return html` <div class="bar">${hands}</div>
      ${keyboard}`;
  }
}
