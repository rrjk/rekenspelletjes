import { html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { create } from 'mutative';

import { TimeLimitedGame2 } from '../TimeLimitedGame2';
import { GameLogger } from '../GameLogger';

import { randomFromSet } from '../Randomizer';

import type { Digit } from '../DigitKeyboard';
import '../DigitKeyboard';
import { possibleNumberFingers, PossibleNumberFingers } from '../HandFace';

import {
  getHowManyFingersGameVariant,
  type HowManyFingersGameExtendedVariantInfo,
} from './HowManyFingersGameVariants';

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

@customElement('how-many-fingers-game-app')
export class HowManyFingersGameApp extends TimeLimitedGame2 {
  @state()
  private accessor numberFingers: PossibleNumberFingers = 1;

  @state()
  private accessor disabledDigits: boolean[] = [...allDigitsEnabled];

  @state()
  private accessor gameDisabled = true;

  private minNumberFingers = 1;
  private maxNumberFingers = 10;

  private gameLogger = new GameLogger('AB', 'a');

  constructor() {
    super();
    this.parseUrl();
  }

  /** Parse URL with variant parameter */
  private parseUrlWithVariant(urlParams: URLSearchParams): void {
    const variant = urlParams.get('variant');
    if (variant === null)
      throw Error(
        'Internal SW Error, parseUrlWithVariant called while there is no variant in the URL',
      );
    const extendedVariantInfo: HowManyFingersGameExtendedVariantInfo =
      getHowManyFingersGameVariant(variant);

    // Set game configuration from variant metadata
    this.minNumberFingers = extendedVariantInfo.minFingers;
    this.maxNumberFingers = extendedVariantInfo.maxFingers;

    // Configure game logger
    this.gameLogger.setMainCode(extendedVariantInfo.mainCode);
    this.gameLogger.setSubCode(variant);
  }

  /** Parse URL with explicit parameters (legacy support) */
  private parseUrlWithoutVariant(urlParams: URLSearchParams): void {
    const minAsString = urlParams.get('min');
    if (minAsString !== null) {
      const min = parseInt(minAsString, 10);
      if (!Number.isNaN(min) && min >= 1 && min <= 9) {
        this.minNumberFingers = min;
      } // Otherwise we'll keep the default
    }

    const maxAsString = urlParams.get('max');
    if (maxAsString !== null) {
      const max = parseInt(maxAsString, 10);
      if (!Number.isNaN(max) && max >= 1 && max <= 9) {
        this.maxNumberFingers = max;
      } // Otherwise we'll keep the default
    }

    // Set mainCode (only one main code for this game)
    this.gameLogger.setMainCode('AB');
  }

  /** Main URL parsing function */
  private parseUrl(): void {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('variant')) this.parseUrlWithVariant(urlParams);
    else this.parseUrlWithoutVariant(urlParams);
  }

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
        hand-face {
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
    const allowedNumberFingers = possibleNumberFingers.filter(
      nmbr =>
        nmbr !== this.numberFingers &&
        nmbr >= this.minNumberFingers &&
        nmbr <= this.maxNumberFingers,
    );
    this.numberFingers = randomFromSet(allowedNumberFingers);

    this.disabledDigits = [...allDigitsEnabled];

    this.gameDisabled = false;
  }

  get welcomeMessage(): HTMLTemplateResult {
    return html`<p>Tel het aantal vingers.</p>`;
  }

  executeGameOverActions(): void {
    this.gameLogger.logGameOver();
  }

  /** Get the title for the welcome dialog. */
  get welcomeDialogTitle(): string {
    return `Hoeveel vingers spel`;
  }

  get gameOverIntroductionText(): HTMLTemplateResult {
    return html`<p>Je hebt het aantal vingers op de handen geteld!</p>`;
  }

  handleDigit(digit: Digit) {
    if (this.numberFingers === digit) {
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
      <hand-face
        .nmbrToShow=${this.numberFingers}
        class=${hiddenClass}
      ></hand-face>
      <digit-keyboard
        @digit-entered=${(evt: CustomEvent<Digit>) =>
          this.handleDigit(evt.detail)}
        .disabledDigits=${this.disabledDigits}
        .disabled=${this.gameDisabled}
        showTen
      >
      </digit-keyboard>
    `;
  }
}
