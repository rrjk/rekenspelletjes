import { html, css } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, state } from 'lit/decorators.js';
import type { CSSResultGroup, HTMLTemplateResult } from 'lit';

import { TimeLimitedGame } from './TimeLimitedGame';

import { randomIntFromRange } from './Randomizer';
import { GameLogger } from './GameLogger';

import './GroupOfImages';
import type { Digit, DigitKeyboard } from './DigitKeyboard';
import './DigitKeyboard';

import './RealHeight';

@customElement('recognize-groups-app')
export class RecognizeGroupsApp extends TimeLimitedGame {
  private gameLogger = new GameLogger('F', '');
  @state()
  private numberGroups = 0;
  @state()
  private perGroup = 4;
  @state()
  private numberOfGroupsText = '';
  @state()
  private groupSizeText = '';
  @state()
  private resultDigit1Text = '';
  @state()
  private resultDigit2Text = '';
  @state()
  private activeFillIn:
    | 'numberGroups'
    | 'groupSize'
    | 'resultDigit1'
    | 'resultDigit2'
    | 'none' = 'numberGroups';

  constructor() {
    super('integrateScoreBoxInProgressBar');
    this.parseUrl();
  }

  protected parseUrl(): void {
    const urlParams = new URLSearchParams(window.location.search);
    /*
    let numberBoxes = 4;
    if (urlParams.has('numberBoxes')) {
      numberBoxes = parseInt(urlParams.get('numberBoxes') || '', 10);
      if (!numberBoxes || numberBoxes < 2 || numberBoxes > 4) {
        numberBoxes = 4;
      }
    }
*/
  }

  override async getUpdateComplete(): Promise<boolean> {
    const result = await super.getUpdateComplete();
    /*
    const promises = [];
    for (const number of this.numbers) {
      promises.push(this.getNumber(`#${number.id}`).updateComplete);
    }
    for (const box of this.boxes) {
      promises.push(this.getBox(`#${box.id}`).updateComplete);
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
    return html`<p>
      Tel het aantal groepjes en hoeveel er in een groepje zit.
    </p>`;
  }

  /** Get the title for the welcome dialog. */
  get welcomeDialogTitle(): string {
    return `Herken groepjes van`;
  }

  private handleCorrectAnswer(): void {
    this.numberOk += 1;
    this.newRound();
  }

  private handleWrongAnswer(): void {
    this.numberNok += 1;
  }

  private newRound() {
    this.numberGroups = randomIntFromRange(1, 9);
    this.perGroup = randomIntFromRange(1, 9);
    this.numberOfGroupsText = '';
    this.groupSizeText = '';
    this.resultDigit1Text = '';
    this.resultDigit2Text = '';
    this.activeFillIn = 'numberGroups';
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

  /** Get all static styles */
  static get styles(): CSSResultGroup {
    return css`
      #totalGame {
        position: absolute;
        width: calc(var(--vw) * 100);
        height: calc(var(--vh) * 100 - 20px);
        box-sizing: border-box;
        display: grid;
        grid-template-columns: 65% 35%;
        grid-template-rows: 75% 25%;
      }

      #groups {
        grid-column: 1 / span 2;
        grid-row: 1 / span 1;
        box-sizing: border-box;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        align-content: space-around;
      }

      group-of-images {
        width: calc(90% / var(--groupsPerRow));
        height: calc(90% / var(--numberRows));
        border: 4px dotted orange;
      }

      #excersize {
        grid-column: 1 / span 1;
        grid-row: 2 / span 1;
        box-sizing: border-box;
        display: flex;
        align-content: center;
        justify-content: center;
      }

      #keyboard {
        grid-column: 2 / span 1;
        grid-row: 2 / span 1;
        box-sizing: border-box;
      }

      digit-keyboard {
        width: 100%;
        height: 100%;
      }

      .text {
        margin-top: auto;
        margin-bottom: auto;
        text-align: center;
        font-size: min(5vw, 9vh);
      }

      .larger {
        font-size: 150%;
      }

      .fillInSingleDigit {
        border: 2px solid black;
        height: 2ex;
        width: 1em;
        margin-left: 0.2em;
        margin-right: 0.2em;
      }

      .fillInDoubleDigitLeft {
        width: 1em;
        height: 2ex;
        border-left: 2px solid black;
        border-bottom: 2px solid black;
        border-top: 2px solid black;
        border-right: 1px solid lightgrey;
        margin-left: 0.2em;
        margin-right: 0;
      }

      .fillInDoubleDigitRight {
        width: 1em;
        height: 2ex;
        border-right: 2px solid black;
        border-bottom: 2px solid black;
        border-top: 2px solid black;
        border-left: 1px solid lightgrey;
        margin-left: 0;
        margin-right: 0.2em;
      }

      .fillInActive {
        border-color: blue;
      }
    `;
  }

  handleDigit(digit: Digit) {
    const resultDigit1 = Math.floor((this.numberGroups * this.perGroup) / 10);
    const resultDigit2 = (this.numberGroups * this.perGroup) % 10;

    if (
      this.activeFillIn === 'numberGroups' &&
      `${digit}` === `${this.numberGroups}`
    ) {
      this.numberOfGroupsText = `${digit}`;
      this.activeFillIn = 'groupSize';
      this.getElement<DigitKeyboard>('digit-keyboard').enableAllDigits();
    } else if (
      this.activeFillIn === 'groupSize' &&
      `${digit}` === `${this.perGroup}`
    ) {
      this.groupSizeText = `${digit}`;
      this.getElement<DigitKeyboard>('digit-keyboard').enableAllDigits();
      if (resultDigit1 === 0) {
        this.activeFillIn = 'resultDigit2';
      } else {
        this.activeFillIn = 'resultDigit1';
      }
    } else if (
      this.activeFillIn === 'resultDigit1' &&
      `${digit}` === `${resultDigit1}`
    ) {
      this.resultDigit1Text = `${digit}`;
      this.activeFillIn = 'resultDigit2';
      this.getElement<DigitKeyboard>('digit-keyboard').enableAllDigits();
    } else if (
      this.activeFillIn === 'resultDigit2' &&
      `${digit}` === `${resultDigit2}`
    ) {
      this.resultDigit2Text = `${digit}`;
      this.activeFillIn = 'none';
      this.getElement<DigitKeyboard>('digit-keyboard').enableAllDigits();
      this.handleCorrectAnswer();
    } else {
      this.getElement<DigitKeyboard>('digit-keyboard').disable(digit);
      this.handleWrongAnswer();
    }
  }

  /** Render the application */
  render(): HTMLTemplateResult {
    const groupsPerRow: number[] = [0, 1, 2, 2, 2, 3, 2, 3, 3, 3];

    const groups: HTMLTemplateResult[] = [];
    for (let i = 0; i < this.numberGroups; i++) {
      groups.push(
        html` <group-of-images
          numberInGroup="${this.perGroup}"
          image="box"
        ></group-of-images>`
      );
    }

    return html`
      <style>
        #groups{
          --groupsPerRow: ${groupsPerRow[this.numberGroups]};
          --numberRows: ${Math.ceil(
            this.numberGroups / groupsPerRow[this.numberGroups]
          )} 
        }
      </style>
      ${this.renderTimedGameApp()}
      <div id="totalGame">
        <div id="groups">
          ${groups}
        </div>
        <div id="excersize">
          <div class="text fillInSingleDigit ${
            this.activeFillIn === 'numberGroups' ? 'fillInActive' : ''
          }">${this.numberOfGroupsText}</div>
          <div class="text">groepjes van </br> <span class="larger">x </span> </div>
          <div class="text fillInSingleDigit ${
            this.activeFillIn === 'groupSize' ? 'fillInActive' : ''
          }">${this.groupSizeText}</div>
          <div class="text">=</div>
          <div class="text fillInDoubleDigitLeft ${
            this.activeFillIn === 'resultDigit1' ? 'fillInActive' : ''
          }">${this.resultDigit1Text}</div>
          <div class="text fillInDoubleDigitRight ${
            this.activeFillIn === 'resultDigit2' ? 'fillInActive' : ''
          }">${this.resultDigit2Text}</div>
        </div>
        <div id="keyboard">
          <digit-keyboard
            @digit-entered="${(evt: CustomEvent<Digit>) =>
              this.handleDigit(evt.detail)}"
          ></digit-keyboard>
        </div>
      </div>
    `;
  }
}
