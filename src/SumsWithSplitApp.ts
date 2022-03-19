import { html, css } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, state } from 'lit/decorators.js';
import type { CSSResultGroup, HTMLTemplateResult } from 'lit';

import { TimeLimitedGame } from './TimeLimitedGame';

import { randomFromSet, randomIntFromRange } from './Randomizer';
import { GameLogger } from './GameLogger';

import type { Digit, DigitKeyboard } from './DigitKeyboard';
import './DigitKeyboard';

import type { DigitFillin } from './DigitFillin';
import './DigitFillin';

import './RealHeight';

type OperatorType = '+' | '-';
type GameRangeType = 'till20' | 'till100';

@customElement('sums-with-split-app')
export class SumsWithSplitApp extends TimeLimitedGame {
  private gameLogger = new GameLogger('G', '');
  @state()
  private activeFillIn = 0;
  @state()
  private usedFillIns = ['splitLeft', 'splitRight', 'result'];
  @state()
  private leftOperand = 0;
  @state()
  private rightOperand = 0;
  @state()
  private result = 23;
  @state()
  private leftSplit = 5;
  @state()
  private rightSplit = 3;
  @state()
  private operators: OperatorType[] = [];
  @state()
  private selectedOperator: OperatorType = '+';
  @state()
  private gameRange: GameRangeType = 'till20';
  @state()
  private gameEnabled = false;

  constructor() {
    super('integrateScoreBoxInProgressBar');
    this.parseUrl();
  }

  private parseUrl(): void {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('till20')) this.gameRange = 'till20';
    if (urlParams.has('till100')) this.gameRange = 'till100';
    this.operators = [];
    if (urlParams.has('plus')) this.operators.push('+');
    if (urlParams.has('minus')) this.operators.push('-');
    if (this.operators.length === 0) this.operators.push('+');
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
    this.newRound();
    this.gameEnabled = true;
  }

  /** Get the text to show in the game over dialog */
  get welcomeMessage(): HTMLTemplateResult {
    const possibleSums = [];

    if (this.gameRange === 'till20') {
      if (this.operators.includes('+')) possibleSums.push('6+8');
      if (this.operators.includes('-')) possibleSums.push('12-3');
    }

    if (this.gameRange === 'till100') {
      if (this.operators.includes('+')) possibleSums.push('36+8');
      if (this.operators.includes('-')) possibleSums.push('53-7');
    }

    let message: HTMLTemplateResult;

    if (possibleSums.length === 1)
      message = html`<p>Maak sommen zoals ${possibleSums[0]}</p>`;
    else
      message = html`<p>
        Maak sommen zoals ${possibleSums[0]} en ${possibleSums[1]}
      </p>`;

    return message;
  }

  /** Get the title for the welcome dialog. */
  get welcomeDialogTitle(): string {
    return `Sommen met splitsen`;
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
    if (this.selectedOperator === '+') {
      const leftOperandUnits = randomIntFromRange(2, 9);
      const leftOperandTens =
        this.gameRange === 'till20' ? 0 : randomIntFromRange(0, 8);
      this.leftOperand = 10 * leftOperandTens + leftOperandUnits;

      this.rightOperand = randomIntFromRange(11 - leftOperandUnits, 9);
      this.result = this.leftOperand + this.rightOperand;
      this.leftSplit = 10 - leftOperandUnits;
      this.rightSplit = this.rightOperand - this.leftSplit;
    }

    if (this.selectedOperator === '-') {
      const leftOperandUnits = randomIntFromRange(1, 8);
      const leftOperandTens =
        this.gameRange === 'till20' ? 1 : randomIntFromRange(1, 9);
      this.leftOperand = 10 * leftOperandTens + leftOperandUnits;

      this.rightOperand = randomIntFromRange(leftOperandUnits + 1, 9);
      this.result = this.leftOperand - this.rightOperand;
      this.leftSplit = leftOperandUnits;
      this.rightSplit = this.rightOperand - this.leftSplit;
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
      `#${this.usedFillIns[this.activeFillIn]}`
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
  static get styles(): CSSResultGroup {
    return css`
      :host {
        --singleDigitWidth: 0.6em;
        --operatorWidth: 0.8em;
        --fillInWidth: 1em;
        --fillInMargin: 0.2em;
      }

      digit-fillin {
        box-sizing: border-box;
      }

      #totalGame {
        position: absolute;
        width: calc(var(--vw) * 100);
        height: calc(var(--vh) * 100 - 20px);
        box-sizing: border-box;
        font-size: calc(1em + 4vmin);
        display: grid;
        grid-template-rows: [sum-row]1.4em [split1-lines-row] 1.4em [split1-answers-row] 1.4em [keyboard-row] 1fr;
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
          3 * var(--singleDigitWidth) + 2 * var(--operatorWidth) + 2 *
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

      .firstSplit {
        display: inline-block;
        text-align: center;
        width: calc(2 * (2.5 * var(--singleDigitWidth) + var(--operatorWidth)));
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
    `;
  }

  /** Render the application */
  render(): HTMLTemplateResult {
    return html`
      ${this.renderTimedGameApp()}
      <div class="${this.gameEnabled ? '' : 'hidden'}" id="totalGame">
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

        <div class="row">
          <div class="excersize">
            <span class="firstSplit">/ &#92;</span>
          </div>
        </div>

        <div class="row">
          <div class="excersize">
            <span class="firstSplit">
              <digit-fillin
                id="splitLeft"
                desiredNumber="${this.leftSplit}"
                numberDigits="1"
                ?fillinActive=${this.usedFillIns[this.activeFillIn] ===
                `splitLeft`}
              ></digit-fillin
              ><digit-fillin
                id="splitRight"
                desiredNumber="${this.rightSplit}"
                numberDigits="1"
                ?fillinActive=${this.usedFillIns[this.activeFillIn] ===
                `splitRight`}
              ></digit-fillin>
            </span>
          </div>
        </div>
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
