import { html, css, nothing } from 'lit';

import { customElement, state } from 'lit/decorators.js';
import { ref } from 'lit/directives/ref.js';

import { create } from 'mutative';

import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { TimeLimitedGame2 } from './TimeLimitedGame2';
import { GameLogger } from './GameLogger';
import { randomFromSet } from './Randomizer';

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
import {
  CreateMinusSum,
  CreatePlusSum,
  LeftRightOperandType,
} from './SumCreationHelpers';

function operatorAsString(operator: OperatorType) {
  if (operator === 'plus') return '+';
  return '-';
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

  private gameLogger = new GameLogger('X', '');

  /* Properties that are set via the URL */
  @state()
  private accessor minNumber = 0;
  @state()
  private accessor maxNumber = 100;
  @state()
  private accessor minNumberline = 0;
  @state()
  private accessor maxNumberline = 100;
  @state()
  private accessor operator: OperatorType = 'plus';
  @state()
  private accessor split: SplitType = 'noSplit';
  @state()
  private accessor jumpsOfTen: JumpsOfTenType = 'noJumpsOfTen';

  /* Game state properties */
  @state()
  private accessor leftOperand = 7;
  @state()
  private accessor rightOperand = 15;
  @state()
  private accessor answer = 22;
  @state()
  private accessor firstArch = 0;
  @state()
  private accessor lastArch = 0;
  @state()
  private accessor numberTenArches = 0;
  @state()
  private accessor arches: ArchType[] = [];
  @state()
  private accessor numberBoxes: NumberBoxInfo[] = [];
  @state()
  private accessor numberLineArea: DropTarget[] = [];
  @state()
  private accessor keyPadActive = false;
  @state()
  private accessor archesPadActive = false;
  @state()
  private accessor gameActive = false;
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
  private previousSinglesRightOperand: undefined | number = undefined;

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

    const parsedMin = parseInt(urlParams.get('min') || '', 10);
    if (Number.isNaN(parsedMin)) this.minNumber = 0;
    else this.minNumber = Math.floor(parsedMin / 10) * 10;
    if (this.minNumber < 0) this.minNumber = 0;

    const parsedMax = parseInt(urlParams.get('max') || '', 10);
    if (Number.isNaN(parsedMax)) this.maxNumber = 100;
    else this.maxNumber = Math.ceil(parsedMax / 10) * 10;
    if (this.maxNumber <= this.minNumber) this.maxNumber = this.minNumber + 10;

    const parsedMinNumberline = parseInt(
      urlParams.get('minNumberline') || '',
      10,
    );
    if (Number.isNaN(parsedMinNumberline)) this.minNumberline = this.minNumber;
    else
      this.minNumberline = Math.min(
        Math.floor(parsedMinNumberline / 10) * 10,
        this.minNumber,
      );

    const parsedMaxNumberline = parseInt(
      urlParams.get('maxNumberline') || '',
      10,
    );
    if (Number.isNaN(parsedMaxNumberline)) this.maxNumberline = this.maxNumber;
    else
      this.maxNumberline = Math.max(
        Math.ceil(parsedMaxNumberline / 10) * 10,
        this.maxNumber,
      );

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
        'A maxNumber - minNumber  of  10 cannot be combined with split === split or jumpsOfTen === jumpsOfTen, falling back to no jumps of ten and no splitting.',
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
        'A maxNumber - minNumber of 20 cannot be combined with split === split and jumpsOfTen === jumpsOfTen, falling back to no jumps of ten.',
      );
      this.jumpsOfTen = 'noJumpsOfTen';
    }

    if (urlParams.has('operator')) {
      const operator = urlParams.get('operator');
      if (operator === 'plus' || operator === 'minus') this.operator = operator;
      // If not, we ignore the operator parameter.
    }
    if (this.operator === 'plus') this.gameLogger.setSubCode('a');
    if (this.operator === 'minus') this.gameLogger.setSubCode('b');
  }

  newRound() {
    if (this.operator === 'plus') {
      this.newRoundPlus();
    } else {
      this.newRoundMinus();
    }
    this.numberBoxes = [{ position: this.leftOperand, nmbr: this.leftOperand }];

    this.currentNumberlineNumber = this.leftOperand;

    this.arches = [];

    this.emoji = NumberlineArchesGameApp.neutralEmoji;

    this.archesPadActive = true;
    this.gameActive = true;
  }

  newRoundMinus() {
    this.operator = 'minus';

    let sum: LeftRightOperandType = {
      leftOperand: 0,
      rightOperand: 0,
      answer: 0,
    };

    let minTenJumps = 0;
    let maxTenJumps = 0;
    if (this.jumpsOfTen === 'jumpsOfTen') {
      minTenJumps = 1;
      maxTenJumps = 100;
    }

    sum = CreateMinusSum(
      this.minNumber,
      this.maxNumber,
      minTenJumps,
      maxTenJumps,
      this.split,
      this.previousSinglesRightOperand,
      this.minNumber === this.minNumberline,
    );

    this.leftOperand = sum.leftOperand;
    this.rightOperand = sum.rightOperand;
    this.answer = sum.answer;

    this.previousSinglesRightOperand = sum.rightOperand % 10;

    // Now we have to find the required arches
    const leftOperandToPreviousMultipleOfTen = sum.leftOperand % 10;

    if (leftOperandToPreviousMultipleOfTen <= sum.rightOperand % 10)
      this.firstArch = leftOperandToPreviousMultipleOfTen;
    else this.firstArch = sum.rightOperand % 10;

    this.lastArch = (sum.rightOperand % 10) - this.firstArch;

    this.numberTenArches = Math.floor(sum.rightOperand / 10);
  }

  newRoundPlus() {
    this.operator = 'plus';

    let sum: LeftRightOperandType = {
      leftOperand: 0,
      rightOperand: 0,
      answer: 0,
    };

    let minTenJumps = 0;
    let maxTenJumps = 0;
    if (this.jumpsOfTen === 'jumpsOfTen') {
      minTenJumps = 1;
      maxTenJumps = 100;
    }

    sum = CreatePlusSum(
      this.minNumber,
      this.maxNumber,
      minTenJumps,
      maxTenJumps,
      this.split,
      this.previousSinglesRightOperand,
      this.minNumber === this.minNumberline,
      this.maxNumber === this.maxNumberline,
    );

    this.leftOperand = sum.leftOperand;
    this.rightOperand = sum.rightOperand;
    this.answer = sum.answer;

    this.previousSinglesRightOperand = sum.rightOperand % 10;

    // Now we have to find the required arches
    const leftOperandToNextMultipleOfTen = 10 - (sum.leftOperand % 10); //leftRightOperand.singlesInLeftOperand;

    if (
      leftOperandToNextMultipleOfTen <=
      sum.rightOperand % 10 // leftRightOperand.singlesInRightOperand
    )
      this.firstArch = leftOperandToNextMultipleOfTen;
    else this.firstArch = sum.rightOperand % 10; // leftRightOperand.singlesInRightOperand;

    this.lastArch = (sum.rightOperand % 10) - this.firstArch; // leftRightOperand.singlesInRightOperand - this.firstArch;

    //this.numberTenArches = leftRightOperand.tensInRightOperand;
    this.numberTenArches = Math.floor(sum.rightOperand / 10);
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
          element: numberLineArea as DropTargetElementInterface,
          dropType: 'dropOk',
        },
      ];
    } else this.numberLineArea = [];
  }

  archDrop(evt: DropEvent) {
    const previousNumberlineNumber = this.currentNumberlineNumber;

    const archSign = this.operator === 'minus' ? -1 : 1;

    const archWidth = parseInt(evt.draggableValue, 10);

    if (archWidth === archSign * 10 && this.numberTenArches > 0) {
      this.currentNumberlineNumber += archSign * 10;
      this.numberTenArches -= 1;
    } else if (this.firstArch === 0 && archWidth === archSign * this.lastArch) {
      this.currentNumberlineNumber += archSign * this.lastArch;
      this.lastArch = 0;
    } else if (archWidth === archSign * this.firstArch) {
      this.currentNumberlineNumber += archSign * this.firstArch;
      this.firstArch = 0;
    }

    if (this.currentNumberlineNumber !== previousNumberlineNumber) {
      this.numberBoxes = create(this.numberBoxes, draft => {
        draft.push({
          position: this.currentNumberlineNumber,
          nmbr: undefined,
          active: 'active',
        });
      });
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
    /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- legacy */
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

      if (
        this.currentNumberlineNumber === this.answer &&
        newPartialNumberlineNumber === this.answer
      ) {
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
        value=${width}
        .dropTargetList=${this.numberLineArea}
        @dropped=${(evt: DropEvent) => this.archDrop(evt)}
      >
        <number-line-arch
          width=${width}
          position=${position}
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
      <dynamic-grid contentAspectRatio=${10 / 7}> ${arches} </dynamic-grid>
    `;
  }

  renderExerciseArea(): HTMLTemplateResult {
    let exercise = '';
    if (this.gameActive)
      exercise = `${this.emoji} ${this.leftOperand} ${operatorAsString(this.operator)} ${this.rightOperand} = ${this.emoji}`;
    return html` <div id="exerciseArea">
      <svg id="exercise" viewbox="-150 -30 300 60">
        <text>${exercise}</text>
      </svg>
    </div>`;
  }

  renderGameContent(): HTMLTemplateResult {
    let belowArches: ArchType[] | typeof nothing = nothing;
    let aboveArches: ArchType[] | typeof nothing = nothing;
    if (this.operator === 'minus') belowArches = this.arches;
    else if (this.operator === 'plus') aboveArches = this.arches;

    /* eslint-disable @typescript-eslint/unbound-method -- For ref, I have to refer to the actual function and not put a arrow function
                                                           in between as otherwise we run into a endless loop. Moreover, inside a html
                                                           string, this will be bound properly 
    */
    return html`
      ${this.renderExerciseArea()}
      <div id="expandedSumArea"></div>
      <drop-target-container
        id="numberlineArea"
        ${ref(this.numberLineAreaChange)}
      >
        <number-line-v2
          min=${this.minNumberline}
          max=${this.maxNumberline}
          .fixedNumbers=${[this.minNumberline, this.maxNumberline]}
          .aboveArches=${aboveArches}
          .belowArches=${belowArches}
          .numberBoxes=${this.numberBoxes}
          tickMarks="upToSingles"
          aspectRatio="10"
        ></number-line-v2>
      </drop-target-container>
      <div id="archesBoxArea">${this.renderArchesBox()}</div>
      <div id="keypadArea">
        <digit-keyboard
          ?disabled=${!this.keyPadActive}
          .disabledDigits=${this.disabledDigits}
          @digit-entered=${(evt: CustomEvent) => this.handleDigit(evt)}
        ></digit-keyboard>
      </div>
    `;
    /* eslint-enable @typescript-eslint/unbound-method */
  }
}
