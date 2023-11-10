import { html, css } from 'lit';
// eslint-disable-next-line import/extensions
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
  private numberDotsHands: PossibleNumberDots[] = [0, 0];
  @state()
  private handStyle: ('handCorrect' | 'handWrong' | '')[] = ['', ''];
  @state()
  private handDisabled = [false, false];
  @state()
  private keyboardDisabled = true;

  private maxDifference = 9;

  private gameLogger = new GameLogger('O', 'a');

  constructor() {
    super();
    this.parseUrl();
  }

  parseUrl() {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has('maxDifference')) {
      const maxDifference = parseInt(urlParams.get('maxDifference') || '', 10);
      if (!maxDifference || maxDifference < 3 || maxDifference > 9) {
        this.maxDifference = 9;
      } else {
        this.maxDifference = maxDifference;
      }
    }
  }

  static get styles(): CSSResultArray {
    return [
      ...super.styles,
      css`
        button {
          display: block;
          width: 40%;
          height: 40%;
          border: none;
          background-color: transparent;
        }
        digit-keyboard {
          width: 80%;
          height: 40%;
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
          height: 100%;
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
    let possibleNumberDots: PossibleNumberDots[] = [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    ];
    let potentialNumberDots: PossibleNumberDots = 0;

    do {
      potentialNumberDots = randomFromSetAndSplice(possibleNumberDots);
    } while (this.numberDotsHands[0] === potentialNumberDots); // We want to prevent keeping the same number of dots on a hand.
    this.numberDotsHands[0] = potentialNumberDots;

    possibleNumberDots = possibleNumberDots.filter(
      x => Math.abs(x - this.numberDotsHands[0]) <= this.maxDifference
    );

    do {
      potentialNumberDots = randomFromSetAndSplice(possibleNumberDots);
    } while (this.numberDotsHands[1] === potentialNumberDots); // We want to prevent keeping the same number of dots on a hand.
    this.numberDotsHands[1] = potentialNumberDots;

    this.getElement<DigitKeyboard>('digit-keyboard').enableAllDigits();
    this.keyboardDisabled = true;
    this.handStyle = ['', ''];
    this.handDisabled = [false, false];
    this.requestUpdate(); // As we are updating an array, we need to explicitely request an update
  }

  /** Get the text to show in the game over dialog */
  get welcomeMessage(): HTMLTemplateResult {
    return html`<p>Wijs de hand aan met de meeste stippen.</p>
      <p>Vertel daarna hoeveel meer stippen die hand heeft.</p>`;
  }

  /** Get the title for the welcome dialog. */
  get welcomeDialogTitle(): string {
    return `Welke hand heeft meer stippen`;
  }

  handleHandClick(handId: HandIds) {
    let ok = true;
    for (const hand of this.numberDotsHands)
      if (hand > this.numberDotsHands[handId]) ok = false;
    if (ok) {
      this.handStyle[handId] = 'handCorrect';
      this.handDisabled = [true, true];
      this.keyboardDisabled = false;
    } else {
      this.numberNok += 1;
      this.handStyle[handId] = 'handWrong';
      this.handDisabled[handId] = true;
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
    return html`
      <div class="bar">
        <button @click=${() => this.handleHandClick(0)} ?disabled=${
      this.handDisabled[0]
    }>
          <hand-with-dots class="${this.handStyle[0]}" numberDots=${
      this.numberDotsHands[0]
    } ></hand-with-dots>
        </button>
        <button @click=${() => this.handleHandClick(1)} ?disabled=${
      this.handDisabled[1]
    }>
          <hand-with-dots class="${this.handStyle[1]}" numberDots=${
      this.numberDotsHands[1]
    }></hand-with-dots>
        </button>
        <digit-keyboard ?disabled=${this.keyboardDisabled} @digit-entered="${(
      evt: CustomEvent<Digit>
    ) => this.handleDigit(evt.detail)}"></digit-keyboad>
      </div>
    `;
  }
}
