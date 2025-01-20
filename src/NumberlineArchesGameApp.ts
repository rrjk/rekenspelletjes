import { html, css } from 'lit';

// eslint-disable-next-line import/extensions
import { customElement, property, state } from 'lit/decorators.js';
// eslint-disable-next-line import/extensions
import { ref } from 'lit/directives/ref.js';

import { create } from 'mutative';

import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { TimeLimitedGame2 } from './TimeLimitedGame2';
import { GameLogger } from './GameLogger';
import { randomFromSet, randomIntFromRange } from './Randomizer';

import './RealHeight';
import './DynamicGrid';
import './DraggableElement';
import './DropTargetContainer';

import type { ActiveEnum, ArchType, NumberBoxInfo } from './NumberLineV2';
import type { AboveBelowType } from './Arch';
import type {
  DropTargetElementInterface,
  DropTarget,
  DropEvent,
} from './DraggableElement';

import './NumberLineV2';
import './Arch';

import './DigitKeyboard';

import { determineRequiredDigit } from './NumberHelperFunctions';

type OperatorType = 'plus' | 'minus';

@customElement('numberline-arches-game-app')
export class NumberlineArchesGameApp extends TimeLimitedGame2 {
  static happyFaces = [
    '😀',
    '😄',
    '😃',
    '😁',
    '🙂',
    '😉',
    '😊',
    '🤩',
    '🥳',
    '🤪',
    '🤗',
  ];
  static sadFaces = ['😕', '😟', '😮', '😲', '🥹', '😧', '😢', '😞', '😭'];
  static neutralEmoji = '⚜️';

  private gameLogger = new GameLogger('F', '');

  @property()
  accessor minNumber = 0;
  @property()
  accessor maxNumber = 100;

  @state()
  private accessor leftOperand = 7;
  @state()
  private accessor rightOperand = 15;
  @state()
  private accessor answer = 22;
  @state()
  private accessor firstArch: number = 0;
  @state()
  private accessor lastArch: number = 0;
  @state()
  private accessor numberTenArches: number = 0;
  @state()
  private accessor operator: OperatorType = 'plus';
  @state()
  private accessor arches: ArchType[] = [];
  @state()
  private accessor numberBoxes: NumberBoxInfo[] = [];
  @state()
  private accessor numberLineArea: DropTarget[] = [];
  @state()
  private accessor keyPadActive: boolean = false;
  @state()
  private accessor archesPadActive: boolean = false;
  @state()
  private accessor gameActive: boolean = false;
  @state()
  private accessor disabledDigits = [
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
  ];
  @state()
  private accessor crossedOutArches: number[] = [];
  @state()
  private accessor emoji: string = NumberlineArchesGameApp.neutralEmoji;

  private currentNumberlineNumber = 0;

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

  /** Start a new game.
   */
  startNewGame(): void {
    super.startNewGame();
    this.newRound();
  }

  /** Get the text to show in the game over dialog */
  get welcomeMessage(): HTMLTemplateResult {
    return html`<p>
      Voeg de juiste boogjes toe op de getallenlijn om de som op te lossen.
    </p>`;
  }

  /** Get the title for the welcome dialog. */
  get welcomeDialogTitle(): string {
    return `Getallenlijn boogjes spel`;
  }

  executeGameOverActions(): void {
    this.gameLogger.logGameOver();
  }

  constructor() {
    super();
    this.parseUrl();
  }

  protected parseUrl(): void {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('min')) {
      const parsedMin = parseInt(urlParams.get('min') || '', 10);
      if (!parsedMin) this.minNumber = 0;
      else this.minNumber = Math.floor(parsedMin / 10) * 10;
      if (this.minNumber < 0) this.minNumber = 0;
    }
    if (urlParams.has('max')) {
      const parsedMax = parseInt(urlParams.get('max') || '', 10);
      if (!parsedMax) this.maxNumber = 100;
      else this.maxNumber = Math.ceil(parsedMax / 10) * 10;
      if (this.maxNumber <= this.minNumber)
        this.maxNumber = this.minNumber + 10;
    }
  }

  newRound() {
    if (this.operator === 'plus') {
      this.leftOperand = randomIntFromRange(
        this.minNumber + 1,
        this.maxNumber - 2,
      ); // We don't want the left most number on the numberline.
      this.answer = randomIntFromRange(
        this.leftOperand + 1,
        this.maxNumber - 1, // We don't want the right most number of the numberline.
      );
      this.rightOperand = this.answer - this.leftOperand;
      /// Now we have to find the required arches
      const singlesInLeftOperand = this.leftOperand % 10;

      const singlesInRightOperand = this.rightOperand % 10;
      const tensInRightOperand = Math.floor(this.rightOperand / 10);

      const leftOperandToNextMultipleOfTen = 10 - singlesInLeftOperand;

      if (leftOperandToNextMultipleOfTen <= singlesInRightOperand)
        this.firstArch = leftOperandToNextMultipleOfTen;
      else this.firstArch = singlesInRightOperand;

      this.lastArch = singlesInRightOperand - this.firstArch;

      this.numberTenArches = tensInRightOperand;

      this.numberBoxes = [
        { position: this.leftOperand, nmbr: this.leftOperand },
      ];

      this.currentNumberlineNumber = this.leftOperand;

      this.arches = [];

      this.emoji = NumberlineArchesGameApp.neutralEmoji;

      this.archesPadActive = true;
      this.gameActive = true;
    }
  }

  processWrongAnswer(): void {
    this.emoji = randomFromSet(NumberlineArchesGameApp.sadFaces);
    this.numberNok += 1;
  }

  processCorrectSubAnswer(): void {
    this.emoji = randomFromSet(NumberlineArchesGameApp.happyFaces);
  }

  numberLineAreaChange(numberLineArea: Element | undefined) {
    console.log(`numberLineAreaChange numberLineArea = ${numberLineArea}`);
    if (numberLineArea) {
      this.numberLineArea = [
        {
          element: <DropTargetElementInterface>numberLineArea,
          dropType: 'dropOk',
        },
      ];
    } else this.numberLineArea = [];
  }

  archDrop(evt: DropEvent) {
    const previousNumberlineNumber = this.currentNumberlineNumber;
    const archWidth = parseInt(evt.draggableValue, 10);

    if (archWidth === 10 && this.numberTenArches > 0) {
      this.currentNumberlineNumber += 10;
      this.numberTenArches -= 1;
    } else if (this.firstArch === 0 && archWidth === this.lastArch) {
      this.currentNumberlineNumber += this.lastArch;
      this.lastArch = 0;
    } else if (archWidth === this.firstArch) {
      this.currentNumberlineNumber += this.firstArch;
      this.firstArch = 0;
    }

    if (this.currentNumberlineNumber !== previousNumberlineNumber) {
      this.numberBoxes = [
        ...this.numberBoxes,
        {
          position: this.currentNumberlineNumber,
          nmbr: undefined,
          active: 'active',
        },
      ];
      this.arches = [
        ...this.arches,
        { from: previousNumberlineNumber, to: this.currentNumberlineNumber },
      ];
      this.processCorrectSubAnswer();
      this.archesPadActive = false;
      this.keyPadActive = true;
      this.crossedOutArches = [];
    } else {
      this.processWrongAnswer();
      this.crossedOutArches = create(this.crossedOutArches, draft => {
        draft.push(archWidth);
      });
    }

    console.log(
      `archDrop this.numberBoxes = ${JSON.stringify(this.numberBoxes)}`,
    );
  }

  handleDigit(evt: CustomEvent) {
    console.log(`handleDigit: ${JSON.stringify(evt.detail)}`);
    const digit: number = evt.detail;
    const partialNumberlineNumber =
      this.numberBoxes[this.numberBoxes.length - 1].nmbr;
    if (
      digit ===
      determineRequiredDigit(
        this.currentNumberlineNumber,
        partialNumberlineNumber,
      )
    ) {
      this.processCorrectSubAnswer();
      this.disabledDigits = [
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
      ];
      const newPartialNumberlineNumber =
        partialNumberlineNumber === undefined
          ? digit
          : partialNumberlineNumber * 10 + digit;

      let newActiveState: ActiveEnum = 'active';
      if (newPartialNumberlineNumber === this.currentNumberlineNumber) {
        newActiveState = 'notActive';
        this.keyPadActive = false;
        this.archesPadActive = true;
      }
      this.numberBoxes = create(this.numberBoxes, draft => {
        draft[draft.length - 1].nmbr = newPartialNumberlineNumber;
        draft[draft.length - 1].active = newActiveState;
      });
      if (newPartialNumberlineNumber === this.answer) {
        this.numberOk += 1;
        this.newRound();
      }
    } else {
      this.processWrongAnswer();
      this.disabledDigits = create(this.disabledDigits, draft => {
        draft[digit] = true;
      });
    }
  }

  static get styles(): CSSResultArray {
    return [
      ...super.styles,
      css`
        .gameContent {
          display: grid;
          row-gap: 1%;
          column-gap: 1%;
        }

        @media (min-aspect-ratio: 0.9) {
          .gameContent {
            grid-template-rows: 0 12% 36% 48% 0;
            grid-template-columns: 0 48.5% 48.5% 0;
            grid-template-areas:
              '. ............... ............... .'
              '. exercise        exercise        .'
              '. numberline      numberline      .'
              '. archesBox       keypad          .'
              '. ............... ............... .';
          }
        }

        @media (max-aspect-ratio: 0.9) {
          .gameContent {
            grid-template-rows: 0 12% 36% 48% 0;
            grid-template-columns: 0 48.5% 48.5% 0;
            grid-template-areas:
              '. ............... ............... .'
              '. exercise        exercise        .'
              '. numberline      numberline      .'
              '. archesBox       keypad          .'
              '. ............... ............... .';
          }
        }

        #exerciseArea {
          grid-area: exercise;
        }

        #expandedSumArea {
          grid-area: expandedSum;
        }

        #numberlineArea {
          grid-area: numberline;
        }

        #archesBoxArea {
          grid-area: archesBox;
        }

        #keypadArea {
          grid-area: keypad;
        }

        number-line-v2 {
          height: 100%;
          width: 100%;
        }

        number-line-arch {
          display: block;
          height: 100%;
          width: 100%;
        }

        digit-keyboard {
          height: 100%;
        }

        dynamic-grid {
          width: 100%;
          height: 100%;
        }

        svg#exercise {
          width: 100%;
          height: 100%;
        }

        svg#exercise text {
          text-anchor: middle;
          dominant-baseline: mathematical;
          font-size: 40px;
          fill: black;
        }
      `,
    ];
  }

  renderArch(width: number, position: AboveBelowType): HTMLTemplateResult {
    console.assert(width > 0 && width <= 10);
    const disabled = !this.archesPadActive;
    const crossedOut =
      this.crossedOutArches.find(val => val === width) !== undefined;
    return html`
      <draggable-element
        class="arch"
        resetDragAfterDrop
        ?dragDisabled=${disabled || crossedOut}
        value="${width}"
        .dropTargetList=${this.numberLineArea}
        @dropped="${this.archDrop}"
      >
        <number-line-arch
          width="${width}"
          position="${position}"
          ?disabled=${disabled}
          ?crossedOut=${crossedOut}
        ></number-line-arch>
      </draggable-element>
    `;
  }

  renderArchesBox(): HTMLTemplateResult {
    const desiredArcheWidths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const multiplier = this.operator === 'plus' ? 1 : -1;
    const archPosition = this.operator === 'plus' ? 'above' : 'below';
    const arches = desiredArcheWidths.map(i =>
      this.renderArch(multiplier * i, archPosition),
    );

    return html`
      <dynamic-grid contentAspectRatio="${10 / 7}"> ${arches} </dynamic-grid>
    `;
  }

  renderExerciseArea(): HTMLTemplateResult {
    let exercise = '';
    if (this.gameActive)
      exercise = `${this.emoji} ${this.leftOperand} + ${this.rightOperand} = ${this.emoji}`;
    return html` <div id="exerciseArea">
      <svg id="exercise" viewbox="-150 -30 300 60">
        <text>${exercise}</text>
      </svg>
    </div>`;
  }

  renderGameContent(): HTMLTemplateResult {
    console.log(
      `renderGameContent: this.numberBoxes = ${JSON.stringify(this.numberBoxes)}`,
    );
    return html`
      ${this.renderExerciseArea()}
      <div id="expandedSumArea"></div>
      <drop-target-container
        id="numberlineArea"
        ${ref(this.numberLineAreaChange)}
      >
        <number-line-v2
          min="${this.minNumber}"
          max="${this.maxNumber}"
          .fixedNumbers="${[this.minNumber, this.maxNumber]}"
          .aboveArches="${this.arches}"
          .numberBoxes="${this.numberBoxes}"
          tickMarks="upToSingles"
          aspectRatio="10"
        ></number-line-v2>
      </drop-target-container>
      <div id="archesBoxArea">${this.renderArchesBox()}</div>
      <div id="keypadArea">
        <digit-keyboard
          ?disabled=${!this.keyPadActive}
          .disabledDigits="${this.disabledDigits}"
          @digit-entered="${this.handleDigit}"
        ></digit-keyboard>
      </div>
    `;
  }
}
