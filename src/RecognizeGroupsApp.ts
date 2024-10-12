import { html, css } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, state } from 'lit/decorators.js';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { TimeLimitedGame2 } from './TimeLimitedGame2';

import { randomFromSet, randomIntFromRange } from './Randomizer';
import { GameLogger } from './GameLogger';

import type { ImageEnum } from './GroupOfImages';
import { GroupOfImages } from './GroupOfImages';
import type { Digit, DigitKeyboard } from './DigitKeyboard';
import './DigitKeyboard';

import type { DigitFillin } from './DigitFillin';
import './DigitFillin';

import './RealHeight';

type IncludeAnswer = 'includeAnswer' | 'excludeAnswer';
type IncludeLongAddition = 'includeLongAddition' | 'excludeLongAddition';

/** Create link for recognize groups game.
 * @param includeAnswer - Include answer or not.
 * @param includeLongAddition - Include long addition or not.
 * @param time - Gamelength
 */
export function groepjesVanHerkennenLink(
  includeAnswer: IncludeAnswer,
  includeLongAddition: IncludeLongAddition,
  time: number,
) {
  let params = `time=${time}`;
  if (includeAnswer === 'includeAnswer') params += '&includeAnswer';
  else if (includeAnswer === 'excludeAnswer') params += '&excludeAnswer';
  if (includeLongAddition === 'includeLongAddition')
    params += '&includeLongAddition';
  else if (includeLongAddition === 'excludeLongAddition')
    params += '&excludeLongAddition';

  return `../Rekenspelletjes/GroepjesVanHerkennen.html?${params}`;
}

@customElement('recognize-groups-app')
export class RecognizeGroupsApp extends TimeLimitedGame2 {
  private gameLogger = new GameLogger('F', '');
  @state()
  private numberOfGroups = 0;
  @state()
  private groupSize = 0;
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
  @state()
  private includeLongAddition = true;

  constructor() {
    super();
    this.parseUrl();
  }

  private parseUrl(): void {
    const urlParams = new URLSearchParams(window.location.search);

    this.includeAnswer = true; // If nothing is specified in the url, the answer will be included.
    if (urlParams.has('excludeAnswer')) {
      this.includeAnswer = false;
    }
    if (urlParams.has('includeAnswer')) {
      // Nothing needs to be done
    }

    this.includeLongAddition = false; // If nothing is specified in the url, the long addition will not be included.
    if (urlParams.has('includeLongAddition')) {
      this.includeLongAddition = true;
    }
    if (urlParams.has('excludeLongAddition')) {
      // Nothing needs to be done
    }

    if (!this.includeAnswer && this.includeLongAddition)
      this.gameLogger.setSubCode('a');
    if (!this.includeAnswer && !this.includeLongAddition)
      this.gameLogger.setSubCode('b');
    if (this.includeAnswer && !this.includeLongAddition)
      this.gameLogger.setSubCode('c');
    if (this.includeAnswer && this.includeLongAddition)
      this.gameLogger.setSubCode('d');
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
   */
  startNewGame(): void {
    this.groupsSize1Seen = false;
    this.numberOfGroups1Seen = false;
    super.startNewGame();
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
        9,
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
  static get styles(): CSSResultArray {
    return [
      ...super.styles,
      css`
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
          flex-direction: column;
          align-content: center;
          justify-content: space-evenly;
        }

        .subexcersize {
          display: flex;
          align-content: center;
          justify-content: center;
        }

        .smallText {
          font-size: calc(0.5 * min(5vw, 9vh));
        }

        .largeText {
          font-size: min(5vw, 9vh);
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
        }

        digit-fillin {
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
      `,
    ];
  }

  getActiveFillin(): DigitFillin {
    return this.getElement<DigitFillin>(
      `#${this.usedFillIns[this.activeFillIn]}`,
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

  /** Render the game content */
  renderGameContent(): HTMLTemplateResult {
    const groupsPerRow: number[] = [0, 1, 2, 2, 2, 3, 2, 3, 3, 3];

    const groups: HTMLTemplateResult[] = [];
    for (let i = 0; i < this.numberOfGroups; i++) {
      groups.push(
        html` <group-of-images
          numberInGroup="${this.groupSize}"
          image="${this.image}"
        ></group-of-images>`,
      );
    }

    const longAddition: HTMLTemplateResult[] = [];
    longAddition.push(
      html`<digit-fillin
        id="longAddition0"
        desiredNumber="${this.groupSize}"
        numberDigits="1"
        ?fillinActive=${this.usedFillIns[this.activeFillIn] === `longAddition0`}
      ></digit-fillin>`,
    );

    for (let i = 1; i < 9; i++) {
      longAddition.push(
        html`<div class="text" ?hidden=${i >= this.numberOfGroups}>
            <span class="larger">+ </span>
          </div>
          <digit-fillin
            id="longAddition${i}"
            desiredNumber="${this.groupSize}"
            numberDigits="1"
            ?fillinActive=${this.usedFillIns[this.activeFillIn] ===
            `longAddition${i}`}
            ?hidden=${i >= this.numberOfGroups}
          ></digit-fillin>`,
      );
    }

    const excersizeAsMultiplication = html`
      <digit-fillin
        id="numberGroups"
        desiredNumber="${this.numberOfGroups}"
        numberDigits="1"
        ?fillinActive=${this.usedFillIns[this.activeFillIn] === 'numberGroups'}
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
            ?fillinActive=${this.usedFillIns[this.activeFillIn] === 'result'}
          ></digit-fillin>`
        : html``}
    `;

    return html`
      <style>
        #groups {
          --groupsPerRow: ${groupsPerRow[this.numberOfGroups]};
          --numberRows: ${Math.ceil(
            this.numberOfGroups / groupsPerRow[this.numberOfGroups],
          )};
        }
      </style>
      <div id="totalGame">
        <div id="groups">${groups}</div>
        <div
          id="excersize"
          class="${this.includeLongAddition ? 'smallText' : 'largeText'}"
        >
          ${this.includeLongAddition
            ? html`<div class="subexcersize">${longAddition}</div>`
            : html``}
          <div class="subexcersize">${excersizeAsMultiplication}</div>
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
