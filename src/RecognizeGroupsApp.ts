import { html, css } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, state } from 'lit/decorators.js';
import type { CSSResultGroup, HTMLTemplateResult } from 'lit';

import { TimeLimitedGame } from './TimeLimitedGame';

import { randomFromSet, randomIntFromRange } from './Randomizer';
import { GameLogger } from './GameLogger';

import type { ImageEnum } from './GroupOfImages';
import { GroupOfImages } from './GroupOfImages';
import type { Digit, DigitKeyboard } from './DigitKeyboard';
import './DigitKeyboard';

import type { DigitFillin } from './DigitFillin';
import './DigitFillin';

import './RealHeight';

@customElement('recognize-groups-app')
export class RecognizeGroupsApp extends TimeLimitedGame {
  private gameLogger = new GameLogger('F', '');
  @state()
  private numberOfGroups = 0;
  @state()
  private groupSize = 4;
  @state()
  private image: ImageEnum = GroupOfImages.possibleImages[0];
  @state()
  private activeFillIn = 0;
  @state()
  private usedFillIns: string[] = [];

  private groupsSize1Seen = false;
  private numberOfGroups1Seen = false;
  @state()
  private includeAnswer = true;

  constructor() {
    super('integrateScoreBoxInProgressBar');
    this.parseUrl();
  }

  private parseUrl(): void {
    const urlParams = new URLSearchParams(window.location.search);

    this.includeAnswer = true; // If nothing is specified in the url, the answer will be included.
    this.usedFillIns = ['numberGroups', 'groupSize', 'result'];
    if (urlParams.has('excludeAnswer')) {
      this.includeAnswer = false;
      this.usedFillIns = ['numberGroups', 'groupSize'];
    }
    if (urlParams.has('includeAnswer')) {
      // Nothing needs to be done
    }
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
    this.groupsSize1Seen = false;
    this.numberOfGroups1Seen = false;
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

    this.activeFillIn = 0;
    for (const fillIn of this.usedFillIns) {
      this.getElement<DigitFillin>(`#${fillIn}`).resetVisible();
    }
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

      digit-fillin {
        font-size: min(5vw, 9vh);
        margin-top: auto;
        margin-bottom: auto;
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
    /*
    if (
      this.activeFillIn === 'numberGroups' &&
      this.getElement<DigitFillin>('#numberGroups').processInput(digit) ===
        'fillinComplete'
    ) {
      this.activeFillIn = 'groupSize';
      this.getElement<DigitKeyboard>('digit-keyboard').enableAllDigits();
    } else if (
      this.activeFillIn === 'groupSize' &&
      this.getElement<DigitFillin>('#groupSize').processInput(digit) ===
        'fillinComplete'
    ) {
      this.getElement<DigitKeyboard>('digit-keyboard').enableAllDigits();
      if (!this.includeAnswer) {
        this.handleCorrectAnswer();
      } else {
        this.activeFillIn = 'result';
      }
    } else if (
      this.activeFillIn === 'result' &&
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
    */
  }

  /** Render the application */
  render(): HTMLTemplateResult {
    const groupsPerRow: number[] = [0, 1, 2, 2, 2, 3, 2, 3, 3, 3];

    const groups: HTMLTemplateResult[] = [];
    for (let i = 0; i < this.numberOfGroups; i++) {
      groups.push(
        html` <group-of-images
          numberInGroup="${this.groupSize}"
          image="${this.image}"
        ></group-of-images>`
      );
    }

    return html`
      <style>
        #groups {
          --groupsPerRow: ${groupsPerRow[this.numberOfGroups]};
          --numberRows: ${Math.ceil(
            this.numberOfGroups / groupsPerRow[this.numberOfGroups]
          )};
        }
      </style>
      ${this.renderTimedGameApp()}
      <div id="totalGame">
        <div id="groups">${groups}</div>
        <div id="excersize">
          <digit-fillin
            id="numberGroups"
            desiredNumber="${this.numberOfGroups}"
            numberDigits="1"
            ?fillinActive=${this.usedFillIns[this.activeFillIn] ===
            'numberGroups'}
          ></digit-fillin>
          <div class="text">
            groepjes van <br />
            <span class="larger">x </span>
          </div>
          <digit-fillin
            id="groupSize"
            desiredNumber="${this.groupSize}"
            numberDigits="1"
            ?fillinActive=${this.usedFillIns[this.activeFillIn] === 'groupSize'}
          ></digit-fillin>
          ${this.includeAnswer === true
            ? html` <digit-fillin
                id="result"
                desiredNumber="${this.groupSize * this.numberOfGroups}"
                numberDigits="2"
                ?fillinActive=${this.usedFillIns[this.activeFillIn] ===
                'result'}
              ></digit-fillin>`
            : html``}
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
