import { html, css, nothing } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, state } from 'lit/decorators.js';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { TimeLimitedGame2 } from './TimeLimitedGame2';

import { randomFromSet, randomIntFromRange } from './Randomizer';
import { GameLogger } from './GameLogger';

import type { Digit, DigitKeyboard } from './DigitKeyboard';
import './DigitKeyboard';

import type { DigitFillin } from './DigitFillin';
import './DigitFillin';

import './RealHeight';
import type { GameRangeType, ShowSplitsType } from './SumsWithSplitAppLink';

type OperatorType = '+' | '-';

/** Get the width of a piece of text in real vh units
 * @param text - Text for which to determine the width
 * @param font - Font to use, may be null in which case the default font is used
 * @returns Width of text in pixels
 */
export function getTextWidth(text: string, font?: string) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) throw Error('Context cannot be retrieved');

  context.font = font || getComputedStyle(document.body).font;

  return context.measureText(text).width;
}

@customElement('sums-with-split-app')
export class SumsWithDoubleSplitApp extends TimeLimitedGame2 {
  private gameLogger = new GameLogger('G', '');
  @state()
  private accessor showSplits: ShowSplitsType = 'showSplits';

  @state()
  private accessor activeFillIn = 0;
  @state()
  private accessor usedFillIns = [
    'split1Left',
    'split1Right',
    /*    'split2Left',
    'split2Right', */
    'result',
  ];
  @state()
  private accessor leftOperand = 0;
  @state()
  private accessor rightOperand = 0;
  @state()
  private accessor result = 0;
  @state()
  private accessor left1Split = 0;
  @state()
  private accessor right1Split = 0;
  @state()
  private accessor left2Split = 0;
  @state()
  private accessor right2Split = 0;
  @state()
  private accessor operators: OperatorType[] = [];
  @state()
  private accessor selectedOperator: OperatorType = '+';
  @state()
  private accessor game: GameRangeType = 'split1Till20';
  @state()
  private accessor gameEnabled = false;
  @state()
  private accessor slashWidth = 0;
  @state()
  private accessor digitWidth = 0;

  constructor() {
    super();
    this.slashWidth = getTextWidth('/');
    this.digitWidth = getTextWidth('0');
    this.parseUrl();
  }

  private parseUrl(): void {
    const urlParams = new URLSearchParams(window.location.search);
    this.operators = [];
    if (
      urlParams.has('plus') &&
      (urlParams.get('plus') === 'true' || urlParams.get('plus') === '')
    )
      this.operators.push('+');
    if (
      urlParams.has('minus') &&
      (urlParams.get('minus') === 'true' || urlParams.get('minus') === '')
    )
      this.operators.push('-');
    if (this.operators.length === 0) this.operators.push('+');

    if (urlParams.has('game')) {
      const game = urlParams.get('game');
      if (game === 'split1Till20') {
        this.game = 'split1Till20';
        this.usedFillIns = ['split1Left', 'split1Right', 'result'];
      } else if (game === 'split1Till100') {
        this.game = 'split1Till100';
        this.usedFillIns = ['split1Left', 'split1Right', 'result'];
      } else if (game === 'split2Till100') {
        this.game = 'split2Till100';
        this.usedFillIns = [
          'split1Left',
          'split1Right',
          'split2Left',
          'split2Right',
          'result',
        ];
        this.gameLogger.setSubCode('c');
      } else {
        // No game type was provided, we fall back to the default
        this.game = 'split1Till20';
        this.usedFillIns = ['split1Left', 'split1Right', 'result'];
      }
    } else {
      // No game type was provided, we fall back to the default
      this.game = 'split1Till20';
      this.usedFillIns = ['split1Left', 'split1Right', 'result'];
    }

    if (
      this.game === 'split1Till20' &&
      this.operators.length === 1 &&
      this.operators[0] === '+'
    )
      this.gameLogger.setSubCode('a');
    else if (
      this.game === 'split1Till20' &&
      this.operators.length === 1 &&
      this.operators[0] === '-'
    )
      this.gameLogger.setSubCode('b');
    else if (this.game === 'split1Till20' && this.operators.length === 2)
      this.gameLogger.setSubCode('c');
    else if (
      this.game === 'split1Till100' &&
      this.operators.length === 1 &&
      this.operators[0] === '+'
    )
      this.gameLogger.setSubCode('d');
    else if (
      this.game === 'split1Till100' &&
      this.operators.length === 1 &&
      this.operators[0] === '-'
    )
      this.gameLogger.setSubCode('e');
    else if (this.game === 'split1Till100' && this.operators.length === 2)
      this.gameLogger.setSubCode('f');
    else if (
      this.game === 'split2Till100' &&
      this.operators.length === 1 &&
      this.operators[0] === '+'
    ) {
      this.gameLogger.setMainCode('V');
      this.gameLogger.setSubCode('a');
    } else if (
      this.game === 'split2Till100' &&
      this.operators.length === 1 &&
      this.operators[0] === '-'
    ) {
      this.gameLogger.setMainCode('V');
      this.gameLogger.setSubCode('b');
    } else if (this.game === 'split2Till100' && this.operators.length === 2) {
      this.gameLogger.setMainCode('V');
      this.gameLogger.setSubCode('c');
    }

    if (urlParams.has('splits')) {
      const splits = urlParams.get('splits');
      if (splits === 'showSplits' || splits === 'hideSplits')
        this.showSplits = splits;
      if (this.showSplits === 'hideSplits') this.usedFillIns = ['result'];
    }
  }

  override async getUpdateComplete(): Promise<boolean> {
    const result = await super.getUpdateComplete();
    /*
    const promises = [];
    for (const number of this.numbers) {
      promises.push(this.getNumber(`#${number.id}`).updateComplete);
    }
    await Promise.all(promises);
    */
    return result;
  }

  /** Start a new game.
   * Progress bar and counters are automatically reset.
   */
  startNewGame(): void {
    super.startNewGame();
    this.newRound();
    this.gameEnabled = true;
  }

  private get possibleSums() {
    const possibleSums = [];

    if (this.game === 'split1Till20') {
      if (this.operators.includes('+')) possibleSums.push('6+8');
      if (this.operators.includes('-')) possibleSums.push('12-3');
    }

    if (this.game === 'split1Till100') {
      if (this.operators.includes('+')) possibleSums.push('36+8');
      if (this.operators.includes('-')) possibleSums.push('53-7');
    }

    if (this.game === 'split2Till100') {
      if (this.operators.includes('+')) possibleSums.push('47+38');
      if (this.operators.includes('-')) possibleSums.push('65-49');
    }

    let ret: string;

    if (possibleSums.length === 1) ret = `${possibleSums[0]}`;
    else ret = `${possibleSums[0]} en ${possibleSums[1]}`;

    return ret;
  }

  /** Get the text to show in the game over dialog */
  get welcomeMessage(): HTMLTemplateResult {
    return html`<p>Maak sommen zoals ${this.possibleSums}</p>`;
  }

  /** Get the title for the welcome dialog. */
  get welcomeDialogTitle(): string {
    return `Sommen met splitsen`;
  }

  get gameOverText(): HTMLTemplateResult {
    return html`<p>Je hebt sommen zoals ${this.possibleSums} geoefend.</p>
      ${this.resultsForGameOverText}`;
  }

  private handleCorrectAnswer(): void {
    this.numberOk += 1;
    this.newRound();
  }

  private handleWrongAnswer(): void {
    this.numberNok += 1;
  }

  private newRound() {
    this.selectedOperator = randomFromSet(this.operators);

    if (this.game === 'split1Till20' || this.game === 'split1Till100') {
      if (this.selectedOperator === '+') {
        const leftOperandUnits = randomIntFromRange(2, 9);
        const leftOperandTens =
          this.game === 'split1Till20' ? 0 : randomIntFromRange(0, 8);
        this.leftOperand = 10 * leftOperandTens + leftOperandUnits;

        this.rightOperand = randomIntFromRange(11 - leftOperandUnits, 9);
        this.result = this.leftOperand + this.rightOperand;
        this.left1Split = 10 - leftOperandUnits;
        this.right1Split = this.rightOperand - this.left1Split;
      }

      if (this.selectedOperator === '-') {
        const leftOperandUnits = randomIntFromRange(1, 8);
        const leftOperandTens =
          this.game === 'split1Till20' ? 1 : randomIntFromRange(1, 9);
        this.leftOperand = 10 * leftOperandTens + leftOperandUnits;

        this.rightOperand = randomIntFromRange(leftOperandUnits + 1, 9);
        this.result = this.leftOperand - this.rightOperand;
        this.left1Split = leftOperandUnits;
        this.right1Split = this.rightOperand - this.left1Split;
      }
    }

    if (this.game === 'split2Till100') {
      if (this.selectedOperator === '+') {
        const leftOperandUnits = randomIntFromRange(2, 9);
        const leftOperandTens = randomIntFromRange(0, 7);
        this.leftOperand = 10 * leftOperandTens + leftOperandUnits;

        const rightOperandUnits = randomIntFromRange(11 - leftOperandUnits, 9);
        const rightOperandTens = randomIntFromRange(1, 8 - leftOperandTens);

        this.rightOperand = 10 * rightOperandTens + rightOperandUnits;
        this.result = this.leftOperand + this.rightOperand;

        this.left1Split = rightOperandTens * 10;
        this.right1Split = rightOperandUnits;

        this.left2Split = 10 - leftOperandUnits;
        this.right2Split = this.right1Split - this.left2Split;
      }

      if (this.selectedOperator === '-') {
        const leftOperandUnits = randomIntFromRange(1, 8);
        const leftOperandTens = randomIntFromRange(2, 9);
        this.leftOperand = 10 * leftOperandTens + leftOperandUnits;

        const rightOperandUnits = randomIntFromRange(leftOperandUnits + 1, 9);
        const rightOperandTens = randomIntFromRange(1, leftOperandTens - 1);

        this.rightOperand = 10 * rightOperandTens + rightOperandUnits;
        this.result = this.leftOperand - this.rightOperand;

        this.left1Split = rightOperandTens * 10;
        this.right1Split = rightOperandUnits;

        this.left2Split = leftOperandUnits;
        this.right2Split = rightOperandUnits - this.left2Split;
      }
    }
    this.activeFillIn = 0;
    for (const fillIn of this.usedFillIns) {
      this.getElement<DigitFillin>(`#${fillIn}`).resetVisible();
    }
    this.getElement<DigitKeyboard>('digit-keyboard').enableAllDigits();
  }

  executeGameOverActions(): void {
    this.gameEnabled = false;
    this.gameLogger.logGameOver();
  }

  getActiveFillin(): DigitFillin {
    return this.getElement<DigitFillin>(
      `#${this.usedFillIns[this.activeFillIn]}`,
    );
  }

  handleDigit(digit: Digit) {
    if (this.gameEnabled) {
      const processResult = this.getActiveFillin().processInput(digit);

      if (processResult === 'inputNok') {
        this.getElement<DigitKeyboard>('digit-keyboard').disable(digit);
        this.handleWrongAnswer();
      } else if (processResult === 'inputOk') {
        this.getElement<DigitKeyboard>('digit-keyboard').enableAllDigits();
      } else if (processResult === 'fillinComplete') {
        if (this.activeFillIn === this.usedFillIns.length - 1) {
          this.handleCorrectAnswer();
        } else {
          this.getElement<DigitKeyboard>('digit-keyboard').enableAllDigits();
          this.activeFillIn += 1;
        }
      }
    }
  }

  /** Get all static styles */
  static get styles(): CSSResultArray {
    return [
      ...super.styles,
      css`
        :host {
          --spaceBetweenSlashesWidth: 0.4em;
          --operatorWidth: 0.8em;
          --fillInWidth: 1em;
          --fillInMargin: 0.2em;

          --fontMagnification: calc(
            (16 + (4 * min(var(--vhWithoutUnit), var(--vwWithoutUnit)))) / 16
          );

          --preSplit1Slashes1DigitWidth: calc(
            (2.5 * var(--singleDigitWidth) + var(--operatorWidth)) - var(
                --slashWidth
              ) - (0.5 * var(--spaceBetweenSlashesWidth))
          );

          --preSplit1DigitEntry1DigitWidthBackup: calc(
            (2.5 * var(--singleDigitWidth) + var(--operatorWidth)) - var(
                --slashWidth
              ) - (0.5 * var(--spaceBetweenSlashesWidth)) - var(--fillInWidth)
          );

          --preSplit1DigitEntry1DigitWidth: calc(
            var(--preSplit1Slashes1DigitWidth) + var(--slashWidth) -
              (1 * var(--fillInWidth)) - var(--fillInMargin)
          );

          --preSplit1Slashes2DigitWidth: calc(
            (3 * var(--singleDigitWidth) + var(--operatorWidth)) - var(
                --slashWidth
              ) - (0.5 * var(--spaceBetweenSlashesWidth))
          );

          --preSplit1DigitEntry2DigitWidth: calc(
            var(--preSplit1Slashes2DigitWidth) + var(--slashWidth) -
              (2 * var(--fillInWidth)) - var(--fillInMargin)
          );

          --preSplit2SlashesWidth: calc(
            (2.5 * var(--fillInWidth)) + (3 * var(--fillInMargin)) - var(
                --slashWidth
              ) - (0.5 * var(--spaceBetweenSlashesWidth)) +
              var(--preSplit1DigitEntry2DigitWidth)
          );

          --preSplit2DigitEntryWidth: calc(
            var(--preSplit2SlashesWidth) + var(--slashWidth) -
              (1 * var(--fillInWidth)) - var(--fillInMargin)
          );
        }
        digit-fillin {
          box-sizing: border-box;
        }

        .totalGame {
          position: absolute;
          width: calc(var(--vw) * 100);
          height: calc(var(--vh) * 100 - 20px);
          box-sizing: border-box;
          font-size: calc(16px * var(--fontMagnification));
          display: grid;
        }

        .totalGame1Split {
          grid-template-rows: [sum-row]1.2em [split1-lines-row] 1.2em [split1-answers-row] 1.2em [keyboard-row] 1fr;
        }

        .totalGame2Split {
          grid-template-rows: [sum-row]1.2em [split1-lines-row] 1.2em [split1-answers-row] 1.2em [split2-lines-row] 1.2em [split2-answers-row] 1.2em [keyboard-row] 1fr;
        }

        #sum-row {
          grid-row-start: sum-row;
        }

        #split1-lines-row {
          grid-row-start: split1-lines-row;
        }

        #split1-answers-row {
          grid-row-start: split1-answers-row;
        }

        #split2-lines-row {
          grid-row-start: split2-lines-row;
        }

        #split2-answers-row {
          grid-row-start: split2-answers-row;
        }

        .row {
          position: relative;
          width: 100%;
          height: 1.4em;
          display: flex;
          justify-content: center;
          align-items: flex-end;
        }

        .excersize {
          position: relative;
          width: calc(
            4 * var(--singleDigitWidth) + 2 * var(--operatorWidth) + 2 *
              var(--fillInWidth) + 2 * var(--fillInMargin) + 10px
          );
        }

        span {
          box-sizing: border-box;
        }

        .leftOperand {
          display: inline-block;
          text-align: right;
          min-width: calc(2 * var(--singleDigitWidth));
        }

        .rightOperand1Digit {
          display: inline-block;
          text-align: left;
          min-width: var(--singleDigitWidth);
        }

        .rightOperand2Digit {
          display: inline-block;
          text-align: left;
          min-width: calc(2 * var(--singleDigitWidth));
        }

        .preSplit1Slashes1Digit {
          display: inline-block;
          width: var(--preSplit1Slashes1DigitWidth);
        }

        .preSplit1DigitEntry1Digit {
          display: inline-block;
          width: var(--preSplit1DigitEntry1DigitWidth);
        }

        .preSplit1Slashes2Digit {
          display: inline-block;
          width: var(--preSplit1Slashes2DigitWidth);
        }

        .preSplit1DigitEntry2Digit {
          display: inline-block;
          width: var(--preSplit1DigitEntry2DigitWidth);
        }

        .spaceBetweenSlashes {
          display: inline-block;
          width: var(--spaceBetweenSlashesWidth);
        }

        .preSplit2Slashes {
          display: inline-block;
          width: var(--preSplit2SlashesWidth);
        }

        .preSplit2DigitEntry {
          display: inline-block;
          width: var(--preSplit2DigitEntryWidth);
        }

        .split2 {
          display: inline-block;
          text-align: center;
          width: calc(
            2 * (2.5 * var(--singleDigitWidth) + var(--operatorWidth))
          );
        }

        .operator {
          display: inline-block;
          text-align: center;
          min-width: var(--operatorWidth);
        }

        .keyboardArea {
          grid-row-start: keyboard-row;
          min-height: 0;
          width: 100%;
          min-width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        digit-keyboard {
          height: min(calc(45 * var(--vh)), 90%);
          aspect-ratio: 3/4;
        }

        .hidden {
          visibility: hidden;
        }
      `,
    ];
  }

  /** Render the game content */
  renderGameContent(): HTMLTemplateResult {
    let totalGameClass = 'totalGame1Split';
    if (this.game === 'split2Till100') totalGameClass = 'totalGame2Split';

    const excersize = html`
      <div class="row" id="sum-row">
        <div class="excersize">
          <span class="leftOperand">${this.leftOperand}</span
          ><span class="operator">${this.selectedOperator}</span
          ><span class="rightOperand1Digit">${this.rightOperand}</span
          ><span class="operator">=</span
          ><digit-fillin
            id="result"
            desiredNumber="${this.result}"
            numberDigits="2"
            ?fillinActive=${this.usedFillIns[this.activeFillIn] === `result`}
          ></digit-fillin>
        </div>
      </div>
    `;

    let left1SplitNumberDigits = 1;
    let preSplit1SlashesClass = 'preSplit1Slashes1Digit';
    let preSplit1DigitEntryClass = 'preSplit1DigitEntry1Digit';
    if (this.game === 'split2Till100') {
      left1SplitNumberDigits = 2;
      preSplit1SlashesClass = 'preSplit1Slashes2Digit';
      preSplit1DigitEntryClass = 'preSplit1DigitEntry2Digit';
    }

    const split1 = html`
      <div class="row">
        <div class="excersize">
          <span class="${preSplit1SlashesClass}"></span><span>/</span
          ><span class="spaceBetweenSlashes"></span><span>&#92;</span>
        </div>
      </div>

      <div class="row">
        <div class="excersize">
          <span class="${preSplit1DigitEntryClass}"></span
          ><digit-fillin
            id="split1Left"
            desiredNumber="${this.left1Split}"
            numberDigits="${left1SplitNumberDigits}"
            ?fillinActive=${this.usedFillIns[this.activeFillIn] ===
            `split1Left`}
          ></digit-fillin
          ><digit-fillin
            id="split1Right"
            desiredNumber="${this.right1Split}"
            numberDigits="1"
            ?fillinActive=${this.usedFillIns[this.activeFillIn] ===
            `split1Right`}
          ></digit-fillin>
        </div>
      </div>
    `;

    let split2 = html``;
    if (this.game === 'split2Till100') {
      split2 = html`
        <div class="row">
          <div class="excersize">
            <span class="preSplit2Slashes"></span><span>/</span
            ><span class="spaceBetweenSlashes"></span><span>&#92;</span>
          </div>
        </div>

        <div class="row">
          <div class="excersize">
            <span class="preSplit2DigitEntry"></span
            ><digit-fillin
              id="split2Left"
              desiredNumber="${this.left2Split}"
              numberDigits="1"
              ?fillinActive=${this.usedFillIns[this.activeFillIn] ===
              `split2Left`}
            ></digit-fillin
            ><digit-fillin
              id="split2Right"
              desiredNumber="${this.right2Split}"
              numberDigits="1"
              ?fillinActive=${this.usedFillIns[this.activeFillIn] ===
              `split2Right`}
            ></digit-fillin>
          </div>
        </div>
      `;
    }

    return html`
      <style>
        :host {
          --slashWidth: calc(${this.slashWidth}px * var(--fontMagnification));
          --singleDigitWidth: calc(
            ${this.digitWidth}px * var(--fontMagnification)
          );
        }
      </style>
      <div
        class="totalGame ${totalGameClass} ${this.gameEnabled ? '' : 'hidden'}"
        id="totalGame"
      >
        ${excersize} ${this.showSplits === 'showSplits' ? split1 : nothing}
        ${this.showSplits === 'showSplits' ? split2 : nothing}
        <div class="keyboardArea">
          <digit-keyboard
            @digit-entered="${(evt: CustomEvent<Digit>) =>
              this.handleDigit(evt.detail)}"
          >
          </digit-keyboard>
        </div>
      </div>
    `;
  }
}
