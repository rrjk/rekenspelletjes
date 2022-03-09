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

@customElement('sums-with-split-app')
export class SumsWithSplitApp extends TimeLimitedGame {
  private gameLogger = new GameLogger('G', '');
  @state()
  private activeFillIn = 0;
  @state()
  private usedFillIns: string[] = [];

  constructor() {
    super('integrateScoreBoxInProgressBar');
    this.parseUrl();
  }

  private parseUrl(): void {
    const urlParams = new URLSearchParams(window.location.search);
    // Nothing to do for now
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
  }

  /** Get the text to show in the game over dialog */
  get welcomeMessage(): HTMLTemplateResult {
    return html`<p>Maak sommen zoals 8+3</p>`;
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
    /*
    let proposedNumberOfGroups = this.numberOfGroups;
    while (proposedNumberOfGroups === this.numberOfGroups) {
      proposedNumberOfGroups = randomIntFromRange(
        this.numberOfGroups1Seen ? 2 : 1,
        9
      );
    }
    if (proposedNumberOfGroups === 1) this.numberOfGroups1Seen = true;
    this.numberOfGroups = proposedNumberOfGroups;

    let proposedGroupsSize = this.groupSize;
    while (proposedGroupsSize === this.groupSize) {
      proposedGroupsSize = randomIntFromRange(this.groupsSize1Seen ? 2 : 1, 9);
    }
    if (proposedGroupsSize === 1) this.groupsSize1Seen = true;
    this.groupSize = proposedGroupsSize;

    let proposedImage = this.image;
    while (proposedImage === this.image) {
      proposedImage = randomFromSet(GroupOfImages.possibleImages);
    }
    this.image = proposedImage;

    this.usedFillIns = [];
    if (this.includeLongAddition) {
      for (let i = 0; i < this.numberOfGroups; i++) {
        this.usedFillIns.push(`longAddition${i}`);
      }
    }
    this.usedFillIns.push('numberGroups');
    this.usedFillIns.push('groupSize');
    if (this.includeAnswer) this.usedFillIns.push('result');

    this.activeFillIn = 0;
    for (const fillIn of this.usedFillIns) {
      this.getElement<DigitFillin>(`#${fillIn}`).resetVisible();
    }
    */
    this.getElement<DigitKeyboard>('digit-keyboard').enableAllDigits();
  }

  executeGameOverActions(): void {
    this.gameLogger.logGameOver();
  }

  async firstUpdated(): Promise<void> {
    await this.getUpdateComplete();

    /* Workaround for bug found in firefox where draggable=false is ignored in case user-select is set to none.
     * Please note that this expression cannot pierce into webcomponent's shadowroms.
     * The img in slots are found though.
     */
    if (window.navigator.userAgent.toLowerCase().includes('firefox')) {
      this.renderRoot.querySelectorAll('img[draggable=false]').forEach(el => {
        el.addEventListener('mousedown', event => event.preventDefault());
      });
    }
    return super.firstUpdated();
  }

  getActiveFillin(): DigitFillin {
    return this.getElement<DigitFillin>(
      `#${this.usedFillIns[this.activeFillIn]}`
    );
  }

  handleDigit(digit: Digit) {
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

  /** Get all static styles */
  static get styles(): CSSResultGroup {
    return css`
      :host {
      }

      #totalGame {
        position: absolute;
        width: calc(var(--vw) * 100);
        height: calc(var(--vh) * 100 - 20px);
        box-sizing: border-box;
        border: 2px solid purple;
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
        border: 2px solid blue;
        display: flex;
        justify-content: center;
        align-items: flex-end;
      }
      .excersize {
        position: relative;
        width: 6.7em;
        border: orange 2px solid;
      }

      span {
        display: inline-block;
        text-align: right;
      }

      .keyboardArea {
        grid-row-start: keyboard-row;
        border: 2px solid red;
        min-height: 0;
        display: flex;
        align-items: center;
      }

      digit-keyboard {
        height: min(45vh, 90%);
      }
    `;
  }

  /** Render the application */
  render(): HTMLTemplateResult {
    return html`
      <style></style>
      ${this.renderTimedGameApp()}
      <div id="totalGame">
        <div class="row" id="sum-row">
          <div class="excersize">
            <span style="min-width:1.112em">3</span><span>+</span>8 =
            <digit-fillin
              id="result"
              desiredNumber="31"
              numberDigits="2"
              ?fillinActive=${true}
            ></digit-fillin>
          </div>
        </div>

        <div class="row">
          <div class="excersize">
            <span style="min-width: 1.2em;"></span>
            <span style="min-width: 1em;">╱ ╲</span>
          </div>
        </div>

        <div class="row">
          <div class="excersize">
            <span style="min-width: 0.4em;"></span>
            <digit-fillin
              id="result"
              desiredNumber="7"
              numberDigits="1"
              ?fillinActive=${true}
            ></digit-fillin>
            <span style="min-width: 0.4em;"></span>
            <digit-fillin
              id="result"
              desiredNumber="1"
              numberDigits="1"
              ?fillinActive=${true}
            ></digit-fillin>
          </div>
        </div>
        <div class="keyboardArea">
          <digit-keyboard></digit-keyboard>
        </div>
      </div>
    `;
  }
}
