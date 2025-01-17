import { html, css } from 'lit';

// eslint-disable-next-line import/extensions
import { customElement, property, state } from 'lit/decorators.js';
// eslint-disable-next-line import/extensions
import { ref } from 'lit/directives/ref.js';

import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { TimeLimitedGame2 } from './TimeLimitedGame2';
import { GameLogger } from './GameLogger';
import { randomIntFromRange } from './Randomizer';

import './RealHeight';
import './DynamicGrid';
import './DraggableElement';
import './DropTargetContainer';

import type { ArchType, NumberBoxInfo } from './NumberLineV2';
import type { AboveBelowType } from './Arch';
import type {
  DropTargetElementInterface,
  DropTarget,
  DropEvent,
} from './DraggableElement';

import './NumberLineV2';
import './Arch';

import './DigitKeyboard';

type OperatorType = 'plus' | 'minus';

@customElement('numberline-jumping-app')
export class NumberlineJumpingApp extends TimeLimitedGame2 {
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

  private gameLogger = new GameLogger('J', 'a');

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

  newRound() {
    if (this.operator === 'plus') {
      this.leftOperand = randomIntFromRange(this.minNumber, this.maxNumber - 1);
      this.answer = randomIntFromRange(this.leftOperand + 1, this.maxNumber);
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
    }
  }

  handleCheckAnswer(): void {
    if (true) {
      this.numberOk += 1;
      this.newRound();
    } else {
      this.numberNok += 1;
    }
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
    console.log(`archDrop evt = ${JSON.stringify(evt)}`);
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
            grid-template-rows: 0 11.5% 11.5% 24% 48% 0;
            grid-template-columns: 0 48.5% 48.5% 0;
            grid-template-areas:
              '. ............... ............... .'
              '. exercise        exercise        .'
              '. expandedSum     expandedSum     .'
              '. numberline      numberline      .'
              '. archesBox       keypad          .'
              '. ............... ............... .';
          }
        }

        @media (max-aspect-ratio: 0.9) {
          .gameContent {
            grid-template-rows: 0 11.5% 11.5% 24% 48% 0;
            grid-template-columns: 0 48.5% 48.5% 0;
            grid-template-areas:
              '. ............... ............... .'
              '. exercise        exercise        .'
              '. expandedSum     expandedSum     .'
              '. numberline      numberline      .'
              '. archesBox       keypad          .'
              '. ............... ............... .';
          }
        }

        #exerciseArea {
          grid-area: exercise;
          background-color: yellow;
        }

        #expandedSumArea {
          grid-area: expandedSum;
          background-color: red;
        }

        #numberlineArea {
          grid-area: numberline;
          background-color: green;
        }

        #archesBoxArea {
          grid-area: archesBox;
          background-color: lightgrey;
        }

        #keypadArea {
          grid-area: keypad;
          background-color: purple;
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
      `,
    ];
  }

  renderArch(width: number, position: AboveBelowType): HTMLTemplateResult {
    console.assert(width > 0 && width <= 10);
    return html`
      <draggable-element
        class="arch"
        resetDragAfterDrop
        value="${width}"
        .dropTargetList=${this.numberLineArea}
        @dropped="${this.archDrop}"
      >
        <number-line-arch
          width="${width}"
          position="${position}"
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

  renderGameContent(): HTMLTemplateResult {
    console.log(JSON.stringify(this.numberBoxes));
    return html`
      <div id="exerciseArea">${this.leftOperand} + ${this.rightOperand} =</div>
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
          aspectRatio="30"
        ></number-line-v2>
      </drop-target-container>
      <div id="archesBoxArea">${this.renderArchesBox()}</div>
      <div id="keypadArea">
        <digit-keyboard
          disabled
          .disabledDigits="${[
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
          ]}"
        ></digit-keyboard>
      </div>
    `;
  }
}
