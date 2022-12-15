import { html, css } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, state } from 'lit/decorators.js';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { TimeLimitedGame2 } from './TimeLimitedGame2';

import {
  randomFromSet,
  randomFromSetAndSplice,
  randomIntFromRange,
  shuffleArray,
} from './Randomizer';
import { GameLogger } from './GameLogger';

import './AnalogClock';
import './DigitalClock';
import './SentenceClock';
import './DynamicGrid';

import './RealHeight';

type TimeTypes = 'Hour' | 'HalfHour' | 'QuarterHour' | '10Minute' | 'Minute';
type ClockTypes = 'Analog' | 'Digital' | 'Sentence';
const AvailableImageUrls = [
  new URL('../images/Mompitz Anne.png', import.meta.url),
  new URL('../images/Mompitz Frank.png', import.meta.url),
  new URL('../images/Mompitz Jan-500.png', import.meta.url),
  new URL('../images/Mompitz Johannes.png', import.meta.url),
  new URL('../images/Mompitz Otto.png', import.meta.url),
];

/** Information about an image that is inserted in the dynamic grid */
interface ImageInfo {
  url: URL;
  posTop: number;
  posLeft: number;
  size: number;
}

interface ClockInformationType {
  clockNumber: number;
  pairNumber: number;
  hours: number;
  minutes: number;
  clockType: ClockTypes;
  enabled: boolean;
  left: number;
  top: number;
  addImage: ImageInfo | null;
}

@customElement('clock-pairing-app')
export class ClockPairingApp extends TimeLimitedGame2 {
  private gameLogger = new GameLogger('L', '');

  private numberOfClockPairs = 7;
  private selectedTimeTypes: TimeTypes[] = [];
  private selectedClockTypes: ClockTypes[] = [];

  @state()
  clockLocations: number[] = [];
  @state()
  clockInformation: ClockInformationType[] = [];
  @state()
  selectedClock: ClockInformationType | null = null; // Selected clock equals null to indicate no clock is selected.

  constructor() {
    super();
    this.parseUrl();
  }

  private parseUrl(): void {
    const urlParams = new URLSearchParams(window.location.search);

    this.selectedTimeTypes = [];
    // Parse from URL what time types to use in game
    if (urlParams.has('hour')) {
      this.selectedTimeTypes.push('Hour');
      this.gameLogger.appendSubCode('u');
    }
    if (urlParams.has('halfhour')) {
      this.selectedTimeTypes.push('HalfHour');
      this.gameLogger.appendSubCode('h');
    }
    if (urlParams.has('quarterhour')) {
      this.selectedTimeTypes.push('QuarterHour');
      this.gameLogger.appendSubCode('q');
    }
    if (urlParams.has('10minute')) {
      this.selectedTimeTypes.push('10Minute');
      this.gameLogger.appendSubCode('t');
    }
    if (urlParams.has('minute')) {
      this.selectedTimeTypes.push('Minute');
      this.gameLogger.appendSubCode('m');
    }
    // Fallback in case no timetypes are provided on URL.
    if (this.selectedTimeTypes.length === 0) {
      this.selectedTimeTypes = ['Hour', 'HalfHour', 'QuarterHour'];
      this.gameLogger.appendSubCode('uhq');
    }
    this.gameLogger.appendSubCode('-');
    // Parse from URL what clock types to use in game
    this.selectedClockTypes = [];
    if (urlParams.has('analog')) {
      this.selectedClockTypes.push('Analog');
      this.gameLogger.appendSubCode('a');
    }
    if (urlParams.has('digital')) {
      this.selectedClockTypes.push('Digital');
      this.gameLogger.appendSubCode('d');
    }
    if (urlParams.has('sentence')) {
      this.selectedClockTypes.push('Sentence');
      this.gameLogger.appendSubCode('s');
    }
    // Fallback in case no timetypes are provided on URL.
    if (this.selectedClockTypes.length === 0) {
      this.selectedClockTypes = ['Analog', 'Sentence'];
      this.gameLogger.appendSubCode('as');
    }
  }

  /** Start a new game.
   */
  startNewGame(): void {
    super.startNewGame();
    this.newRound();
  }

  /** Get the text to show in the game over dialog */
  get welcomeMessage(): HTMLTemplateResult {
    return html`<p>Klik twee klokken aan die dezelfde tijd aangeven.</p>`;
  }

  /** Get the title for the welcome dialog. */
  get welcomeDialogTitle(): string {
    return `Combineer klokken`;
  }

  private handleCorrectAnswer(): void {
    this.numberOk += 1;
    if ((this.numberOk % this.numberOfClockPairs) * 2 === 0) this.newRound();
  }

  private handleWrongAnswer(): void {
    this.numberNok += 1;
  }

  private determineTimeAlreadyExists(hours: number, minutes: number) {
    /* I use a manual for loop here in stead of using the find functions for arrays
     * as that find function requires the definition of a function and defining a function
     * in a loop can lead to unexpected results (https://eslint.org/docs/latest/rules/no-loop-func)
     */
    let timeAlreadyExists = false;
    for (
      let j = 0;
      j < this.clockInformation.length && !timeAlreadyExists;
      j++
    ) {
      timeAlreadyExists =
        timeAlreadyExists ||
        (this.clockInformation[j].hours % 12 === hours % 12 &&
          this.clockInformation[j].minutes === minutes);
    }
    return timeAlreadyExists;
  }

  private newRound() {
    this.clockInformation = [];
    const possibleMompitzLocations = [
      ...Array(this.numberOfClockPairs * 2).keys(),
    ];
    const chosenMompitzLocations = [];
    chosenMompitzLocations.push(
      randomFromSetAndSplice(possibleMompitzLocations)
    );
    chosenMompitzLocations.push(
      randomFromSetAndSplice(possibleMompitzLocations)
    );
    chosenMompitzLocations.push(
      randomFromSetAndSplice(possibleMompitzLocations)
    );

    const possibleMompitzs = [...AvailableImageUrls];

    for (let i = 0; i < this.numberOfClockPairs; i++) {
      let hours = 0;
      let minutes = 0;
      let timeAlreadyExists = false;

      do {
        hours = randomIntFromRange(0, 23);
        const timeType = randomFromSet(this.selectedTimeTypes);

        if (timeType === 'Hour') {
          minutes = 0;
        } else if (timeType === 'HalfHour') {
          minutes = 30;
        } else if (timeType === 'QuarterHour') {
          minutes = randomFromSet([15, 45]);
        } else if (timeType === '10Minute') {
          minutes = randomFromSet([10, 20, 40, 50]);
        } else if (timeType === 'Minute') {
          minutes = randomFromSet([
            1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 16, 17, 18, 19, 21, 22,
            23, 24, 25, 26, 27, 28, 29, 31, 32, 33, 34, 35, 36, 37, 38, 39, 41,
            42, 43, 44, 46, 47, 48, 49, 51, 52, 53, 54, 55, 56, 57, 58, 59,
          ]);
        }
        timeAlreadyExists = this.determineTimeAlreadyExists(hours, minutes);
      } while (timeAlreadyExists);

      const possibleClockTypes = [...this.selectedClockTypes];

      this.clockInformation.push({
        hours,
        minutes,
        clockNumber: 2 * i,
        pairNumber: 2 * i + 1,
        clockType: randomFromSetAndSplice(possibleClockTypes),
        enabled: true,
        left: randomIntFromRange(0, 20),
        top: randomIntFromRange(0, 20),
        addImage: chosenMompitzLocations.includes(2 * i)
          ? {
              url: randomFromSetAndSplice(possibleMompitzs),
              posLeft: randomIntFromRange(5, 25),
              posTop: randomIntFromRange(5, 25),
              size: 75,
            }
          : null,
      });
      this.clockInformation.push({
        hours,
        minutes,
        clockNumber: 2 * i + 1,
        pairNumber: 2 * i,
        clockType: randomFromSetAndSplice(possibleClockTypes),
        enabled: true,
        left: randomIntFromRange(0, 20),
        top: randomIntFromRange(0, 20),
        addImage: chosenMompitzLocations.includes(2 * i + 1)
          ? {
              url: randomFromSetAndSplice(possibleMompitzs),
              posLeft: randomIntFromRange(5, 25),
              posTop: randomIntFromRange(5, 25),
              size: 75,
            }
          : null,
      });
    }
    shuffleArray(this.clockInformation);
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
        button {
          border: 0px;
          background-color: transparent;
        }
        button.selected {
          background-color: lightblue;
        }
      `,
    ];
  }

  createClock(clockInformation: ClockInformationType) {
    let clock: HTMLTemplateResult = html`FOUT`;

    if (clockInformation.clockType === 'Analog') {
      clock = html`
        <analog-clock
          id="clock${clockInformation.clockNumber}"
          hours="${clockInformation.hours}"
          minutes="${clockInformation.minutes}"
          showAllNumbers
          showAllTickMarks
        ></analog-clock>
      `;
    } else if (clockInformation.clockType === 'Digital') {
      clock = html` <digital-clock
        id="clock${clockInformation.clockNumber}"
        hours="${clockInformation.hours}"
        minutes="${clockInformation.minutes}"
      ></digital-clock>`;
    } else if (clockInformation.clockType === 'Sentence') {
      clock = html` <sentence-clock
        id="clock${clockInformation.clockNumber}"
        hours="${clockInformation.hours}"
        minutes="${clockInformation.minutes}"
        useWords
      ></sentence-clock>`;
    }
    return clock;
  }

  handleButtonClick(clockInformation: ClockInformationType) {
    if (this.selectedClock === null) this.selectedClock = clockInformation;
    else if (this.selectedClock === clockInformation) this.selectedClock = null;
    else if (this.selectedClock.pairNumber === clockInformation.clockNumber) {
      this.selectedClock.enabled = false;
      clockInformation.enabled = false;
      this.selectedClock = null;
      this.handleCorrectAnswer();
    } else {
      this.selectedClock = null;
      this.handleWrongAnswer();
    }
  }

  createButton(clockInformation: ClockInformationType) {
    let cls = '';
    if (clockInformation === this.selectedClock) cls = 'selected';

    let divContent = html``;
    let mompitzContent = html``;

    if (clockInformation.enabled) {
      divContent = html`
        <button
          style="position: relative; left: ${clockInformation.left}%; top: ${clockInformation.top}%; width: 80%; height: 80%;"
          class="${cls}"
          @click=${() => this.handleButtonClick(clockInformation)}
        >
          ${this.createClock(clockInformation)}
        </button>
      `;
    }
    if (clockInformation.addImage !== null) {
      const imageUrl = clockInformation.addImage;
      mompitzContent = html`<div>
        <img
          src="${imageUrl.url}"
          alt="Mompitz figure"
          style="width: ${imageUrl.size}%; 
                 height: ${imageUrl.size}%; 
                 object-fit: contain; 
                 position:relative; 
                 top: ${imageUrl.posTop}%; 
                 left: ${imageUrl.posLeft}%;"
        />
      </div>`;
    }

    return html`<div>${divContent}</div>
      ${mompitzContent}`;
  }

  /** Render the game content */
  renderGameContent(): HTMLTemplateResult {
    return html`
      <dynamic-grid
        numberInGroup="12"
        contentAspectRatio="1"
        padding="0"
        style="width: 100%; height: 100%; top: 0;"
      >
        ${this.clockInformation.map(clockInformation =>
          this.createButton(clockInformation)
        )}
      </dynamic-grid>
    `;
  }
}
