import { html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { create } from 'mutative';

import { TimeLimitedGame2 } from './TimeLimitedGame2';
import { GameLogger } from './GameLogger';

import { randomFromSet } from './Randomizer';

import type { Digit } from './DigitKeyboard';
import './DigitKeyboard';
import { possibleNumberDots, PossibleNumberDots } from './DieFace';
import { setOf20Colors, type Color } from './Colors';

const allDigitsEnabled = [
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
] as const;

@customElement('die-face-game-app')
export class DieFaceGameApp extends TimeLimitedGame2 {
  @state()
  private accessor dieFaceNumber: PossibleNumberDots = 1;

  @state()
  private accessor disabledDigits: boolean[] = [...allDigitsEnabled];

  @state()
  private accessor dieFaceColor: Color = 'apricot';

  @state()
  private accessor gameDisabled = true;

  private gameLogger = new GameLogger('AA', 'a');

  static get styles(): CSSResultArray {
    return [
      ...super.styles,
      css`
        .gameContent {
          display: grid;
          justify-content: center;
          align-content: center;
          justify-items: center;
          align-items: center;
        }

        @media (min-aspect-ratio: 0.9) {
          .gameContent {
            grid-template-rows: 100%;
            grid-template-columns: 50% 50%;
            grid-template-areas: 'dieFace keyBoard';
          }
        }

        @media (max-aspect-ratio: 0.9) {
          .gameContent {
            grid-template-rows: 50% 50%;
            grid-template-columns: 100%;
            grid-template-areas:
              'dieFace '
              'keyBoard';
          }
        }

        digit-keyboard {
          width: 80%;
          height: 80%;
        }
        die-face {
          width: 80%;
          height: 80%;
        }

        .hidden {
          visibility: hidden;
        }
      `,
    ];
  }

  startNewGame(): void {
    super.startNewGame();
    this.newRound();
  }

  newRound(): void {
    const allowedNumberDots = possibleNumberDots.filter(
      nmbr => nmbr !== this.dieFaceNumber,
    );
    this.dieFaceNumber = randomFromSet(allowedNumberDots);

    const allowedColors = setOf20Colors.filter(
      color => color !== this.dieFaceColor,
    );
    this.dieFaceColor = randomFromSet(allowedColors);

    this.disabledDigits = [...allDigitsEnabled];

    this.gameDisabled = false;
  }

  get welcomeMessage(): HTMLTemplateResult {
    return html`<p>Tel het aantal stippen op de dobbelsteen.</p>`;
  }

  executeGameOverActions(): void {
    this.gameLogger.logGameOver();
  }

  /** Get the title for the welcome dialog. */
  get welcomeDialogTitle(): string {
    return `Dobbelsteen spel`;
  }

  get gameOverIntroductionText(): HTMLTemplateResult {
    return html`<p>Je hebt stippen op een dobbelsteen geteld!</p>`;
  }

  handleDigit(digit: Digit) {
    if (this.dieFaceNumber === digit) {
      this.numberOk += 1;
      this.newRound();
    } else {
      this.numberNok += 1;

      this.disabledDigits = create(this.disabledDigits, draft => {
        draft[digit] = true;
      });
    }
  }

  renderGameContent(): HTMLTemplateResult {
    const hiddenClass = this.gameDisabled ? 'hidden' : '';
    return html`
      <die-face
        .dieFaceColor=${this.dieFaceColor}
        .numberDots=${this.dieFaceNumber}
        class=${hiddenClass}
      ></die-face>
      <digit-keyboard
        @digit-entered=${(evt: CustomEvent<Digit>) =>
          this.handleDigit(evt.detail)}
        .disabledDigits=${this.disabledDigits}
        .disabled=${this.gameDisabled}
      >
      </digit-keyboard>
    `;
  }
}
