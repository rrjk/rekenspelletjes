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

import type {
  JumpsOfTenType,
  OperatorType,
  SplitType,
} from './NumberlineArchesGameAppLink';

interface LeftRightOperandSplitType {
  tensInLeftOperand: number;
  singlesInLeftOperand: number;
  tensInRightOperand: number;
  singlesInRightOperand: number;
}

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
  private accessor split: SplitType = 'noSplit';
  @state()
  private accessor jumpsOfTen: JumpsOfTenType = 'noJumpsOfTen';
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
      Sleep de juiste boogjes naar de getallenlijn om de som op te lossen.
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
    if (urlParams.has('split')) {
      const split = urlParams.get('split');
      if (split === 'split' || split === 'noSplit') this.split = split;
      // If not, we ignore the crossTen parameter.
    }
    if (urlParams.has('jumpsOfTen')) {
      const jumpsOfTen = urlParams.get('jumpsOfTen');
      if (jumpsOfTen === 'jumpsOfTen' || jumpsOfTen === 'noJumpsOfTen')
        this.jumpsOfTen = jumpsOfTen;
      // If not, we ignore the crossTen parameter.
    }

    if (
      (this.split === 'split' || this.jumpsOfTen === 'jumpsOfTen') &&
      this.maxNumber - this.minNumber === 10
    ) {
      console.error(
        'A numberline of length 10 cannot be combined with split === split or jumpsOfTen === jumpsOfTen, falling back to no jumps of ten and no splitting.',
      );
      this.split = 'noSplit';
      this.jumpsOfTen = 'noJumpsOfTen';
    }

    if (
      this.split === 'split' &&
      this.jumpsOfTen === 'jumpsOfTen' &&
      this.maxNumber - this.minNumber === 20
    ) {
      console.error(
        'A numberline of length 20 cannot be combined with split === split and jumpsOfTen === jumpsOfTen, falling back to no jumps of ten.',
      );
      this.jumpsOfTen = 'noJumpsOfTen';
    }
  }

  determineLeftRightOperandNoSplitPlus(): LeftRightOperandSplitType {
    const tensInMin = Math.floor(this.minNumber / 10);
    const tensInMax = Math.floor(this.maxNumber / 10);

    /* First we determine how many singles we want in the right operand
     */
    const singlesInRightOperand = randomIntFromRange(1, 9);

    /** Then we determine the number of singles in the left operand, taking into
     * account we do not want to split the singles.
     */
    const singlesInLeftOperand = randomIntFromRange(
      1,
      10 - singlesInRightOperand,
    );

    let tensInRightOperand = 0;
    if (this.jumpsOfTen === 'jumpsOfTen') {
      tensInRightOperand = randomIntFromRange(1, tensInMax - tensInMin - 1);
    }
    const tensInLeftOperand = randomIntFromRange(
      tensInMin,
      tensInMax - tensInRightOperand - 1,
    );

    return {
      tensInLeftOperand,
      singlesInLeftOperand,
      tensInRightOperand,
      singlesInRightOperand,
    };
  }

  determineLeftRightOperandWithSplitPlus(): LeftRightOperandSplitType {
    const tensInMin = Math.floor(this.minNumber / 10);
    const tensInMax = Math.floor(this.maxNumber / 10);

    /* First we determine how many singles we want in the right operand
     * As we always want to cross tens, one doesn't work as it can't be split
     * By starting with determining the number of singles in the right operand, we make
     * these truely random
     */
    const singlesInRightOperand = randomIntFromRange(2, 9);

    /** Then we determine the number of singles in the left operand, taking into
     * account we also want to cross a ten.
     */
    const singlesInLeftOperand = randomIntFromRange(
      11 - singlesInRightOperand,
      9,
    );

    let tensInRightOperand = 0;
    if (this.jumpsOfTen === 'jumpsOfTen') {
      tensInRightOperand = randomIntFromRange(1, tensInMax - tensInMin - 2);
    }
    const tensInLeftOperand = randomIntFromRange(
      tensInMin,
      tensInMax - tensInRightOperand - 2,
    );
    return {
      tensInLeftOperand,
      singlesInLeftOperand,
      tensInRightOperand,
      singlesInRightOperand,
    };
  }

  newRound() {
    if (this.operator === 'plus') {
      let leftRightOperand: LeftRightOperandSplitType = {
        tensInLeftOperand: 0,
        singlesInLeftOperand: 0,
        tensInRightOperand: 0,
        singlesInRightOperand: 0,
      };

      if (this.split === 'noSplit') {
        leftRightOperand = this.determineLeftRightOperandNoSplitPlus();
      } else if (this.split === 'split') {
        leftRightOperand = this.determineLeftRightOperandWithSplitPlus();
      }

      this.leftOperand =
        leftRightOperand.tensInLeftOperand * 10 +
        leftRightOperand.singlesInLeftOperand;
      this.rightOperand =
        leftRightOperand.tensInRightOperand * 10 +
        leftRightOperand.singlesInRightOperand;
      this.answer = this.leftOperand + this.rightOperand;

      if (
        this.answer === this.maxNumber &&
        leftRightOperand.singlesInRightOperand > 1 &&
        this.rightOperand > 1
      ) {
        leftRightOperand.singlesInRightOperand -= 1;
        this.rightOperand -= 1;
        this.answer -= 1;
      } else if (this.answer === this.maxNumber) {
        console.assert(this.leftOperand !== this.minNumber);
        leftRightOperand.singlesInLeftOperand -= 1;
        this.leftOperand -= 1;
        this.answer -= 1;
      }

      // Now we have to find the required arches
      const leftOperandToNextMultipleOfTen =
        10 - leftRightOperand.singlesInLeftOperand;

      if (
        leftOperandToNextMultipleOfTen <= leftRightOperand.singlesInRightOperand
      )
        this.firstArch = leftOperandToNextMultipleOfTen;
      else this.firstArch = leftRightOperand.singlesInRightOperand;

      this.lastArch = leftRightOperand.singlesInRightOperand - this.firstArch;

      this.numberTenArches = leftRightOperand.tensInRightOperand;

      this.numberBoxes = [
        { position: this.leftOperand, nmbr: this.leftOperand },
      ];

      this.currentNumberlineNumber = this.leftOperand;

      this.arches = [];

      this.emoji = NumberlineArchesGameApp.neutralEmoji;

      this.archesPadActive = true;
      this.gameActive = true;
    } else {
      console.assert(false);
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
  }

  handleDigit(evt: CustomEvent) {
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
