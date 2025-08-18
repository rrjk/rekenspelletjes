import { html, css, unsafeCSS } from 'lit';

import { customElement, state } from 'lit/decorators.js';
import { ref } from 'lit/directives/ref.js';
import { classMap } from 'lit/directives/class-map.js';

import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { TimeLimitedGame2 } from './TimeLimitedGame2';
import { GameLogger } from './GameLogger';
import { randomFromSet } from './Randomizer';

import './RealHeight';
import './DraggableElement';
import './DropTargetEgg';
import './DropTargetTrashcan';
import './DynamicGrid';
import type {
  DraggableElement,
  DropTargetElementInterface,
  DropTarget,
} from './DraggableElement';
import { getColorInfo } from './Colors';
// import type { DropTargetEgg } from './DropTargetEgg';

const eggUrl = new URL('../images/egg.png', import.meta.url);
const eggCartonUrl = new URL('../images/eggCarton.png', import.meta.url);

@customElement('eggcarton-counting-app')
export class EggCountingApp extends TimeLimitedGame2 {
  @state()
  accessor numberToSplit = 96;
  @state()
  accessor numberVisibleEggCartons = 0;
  @state()
  accessor numberVisibleEggs = 0;

  @state()
  accessor eggCartonTarget: readonly DropTarget[] = [];

  @state()
  accessor eggCartonTargetAreaHighlightWrong = false;

  @state()
  accessor trashcanTarget: readonly DropTarget[] = [];

  @state()
  accessor eggTarget: readonly DropTarget[] = [];

  @state()
  accessor eggTargetAreaHighlightWrong = false;

  eggCartonSource: DraggableElement | null = null;

  maxNumberItemsToShow = 12; // Maximum number of eggs / eggCartons to show in the target area.

  private gameLogger = new GameLogger('J', 'a');
  private eligibleNumbersToSplit: number[] = [];

  eggTargetChange(eggTarget: Element | undefined) {
    if (eggTarget) {
      this.eggTarget = [
        {
          element: eggTarget as DropTargetElementInterface,
          dropType: 'dropOk',
        },
      ];
    } else this.eggTarget = [];
  }

  eggCartonTargetChange(eggCartonTarget: Element | undefined) {
    if (eggCartonTarget) {
      this.eggCartonTarget = [
        {
          element: eggCartonTarget as DropTargetElementInterface,
          dropType: 'dropOk',
        },
      ];
    } else this.eggCartonTarget = [];
  }

  trashcanTargetChange(trashcanTarget: Element | undefined) {
    if (trashcanTarget) {
      this.trashcanTarget = [
        {
          element: trashcanTarget as DropTargetElementInterface,
          dropType: 'dropOk',
        },
      ];
    } else this.trashcanTarget = [];
  }

  eggCartonDrop() {
    if (this.numberVisibleEggCartons < this.maxNumberItemsToShow)
      this.numberVisibleEggCartons += 1;
  }
  eggCartonTrashed() {
    if (this.numberVisibleEggCartons > 0) this.numberVisibleEggCartons -= 1;
  }

  eggDrop() {
    if (this.numberVisibleEggs < this.maxNumberItemsToShow)
      this.numberVisibleEggs += 1;
  }
  eggTrashed() {
    if (this.numberVisibleEggs > 0) this.numberVisibleEggs -= 1;
  }

  constructor() {
    super();
    for (let i = 1; i < 100; i++) this.eligibleNumbersToSplit.push(i);
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
      Sleep het juiste aantal eierdozen (met tien eieren) en losse eieren naar
      hun plek.
    </p>`;
  }

  /** Get the title for the welcome dialog. */
  get welcomeDialogTitle(): string {
    return `Eierdoos tellen`;
  }

  executeGameOverActions(): void {
    this.gameLogger.logGameOver();
  }

  newRound() {
    this.numberToSplit = randomFromSet(this.eligibleNumbersToSplit);
    this.numberVisibleEggCartons = 0;
    this.numberVisibleEggs = 0;
    this.eggCartonTargetAreaHighlightWrong = false;
    this.eggTargetAreaHighlightWrong = false;
  }

  handleCheckAnswer(): void {
    if (
      this.numberVisibleEggCartons * 10 + this.numberVisibleEggs ===
      this.numberToSplit
    ) {
      this.numberOk += 1;
      this.newRound();
    } else {
      if (Math.floor(this.numberToSplit / 10) !== this.numberVisibleEggCartons)
        this.eggCartonTargetAreaHighlightWrong = true;
      else this.eggCartonTargetAreaHighlightWrong = false;

      if (Math.floor(this.numberToSplit % 10) !== this.numberVisibleEggs)
        this.eggTargetAreaHighlightWrong = true;
      else this.eggTargetAreaHighlightWrong = false;

      this.numberNok += 1;
    }
  }

  resetWrongHighlights(): void {
    this.eggCartonTargetAreaHighlightWrong = false;
    this.eggTargetAreaHighlightWrong = false;
  }

  static get styles(): CSSResultArray {
    return [
      ...super.styles,
      css`
        .gameContent {
          display: grid;
          row-gap: 1%;
          column-gap: 1%;
          --backgroundColor: ${unsafeCSS(getColorInfo('beige').mainColorCode)};
          --highlightBackgroundColor: ${unsafeCSS(
            getColorInfo('beige').accentColorCode,
          )};
          --wrongBackgroundColor: ${unsafeCSS(
            getColorInfo('maroon').mainColorCode,
          )};
          background-color: var(--backgroundColor);
        }

        @media (min-aspect-ratio: 0.9) {
          .gameContent {
            grid-template-rows: 0 18% 53% 25% 0;
            grid-template-columns: 0 23% 24% 24% 24% 0;
            grid-template-areas:
              '. ............... ............... ............. ............. .'
              '. numberToSplit   numberToSplit   numberToSplit numberToSplit .'
              '. eggCartonTarget eggCartonTarget eggTarget     eggTarget     .'
              '. trashcan        eggCartonSource eggSource     checkButton    .'
              '. ............... ............... ............. ............. .';
          }
        }

        @media (max-aspect-ratio: 0.9) {
          .gameContent {
            grid-template-rows: 0 15% 53% 10% 17% 0;
            grid-template-columns: 0 47.5% 47.5% 0;
            grid-template-areas:
              '.  ............... ............. .'
              '.  numberToSplit   numberToSplit .'
              '.  eggCartonTarget eggTarget     .'
              '.  eggCartonSource eggSource     .'
              '.  trashcan        checkButton   .'
              '. ................ ............. .';
          }
        }

        #numberToSplitArea {
          grid-area: numberToSplit;
        }

        #eggCartonTargetArea {
          grid-area: eggCartonTarget;
        }

        #eggTargetArea {
          grid-area: eggTarget;
        }

        drop-target-egg {
          height: 100%;
          width: 100%;
          border: black 5px dashed;
          box-sizing: border-box;
        }

        #eggCartonSourceArea,
        #eggSourceArea,
        #checkButtonArea,
        #trashcanArea {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        #eggCartonSourceArea {
          grid-area: eggCartonSource;
        }

        #eggSourceArea {
          grid-area: eggSource;
        }

        .wrongTargetArea {
          background-color: var(--wrongBackgroundColor);
        }

        #checkButtonArea {
          grid-area: checkButton;
        }

        button {
          width: 90%;
          height: 90%;
          border: 4px solid black;
          border-radius: 20%;
          background-color: magenta;
        }

        svg {
          width: 100%;
          height: 100%;
          font-size: 80px;
        }

        text {
          dominant-baseline: middle;
          font-size: 80px;
        }

        .middleAligned {
          text-anchor: middle;
        }

        #trashcanArea {
          grid-area: trashcan;
        }

        img {
          object-fit: contain;
          height: 100%;
          width: 100%;
        }

        draggable-element {
          height: 100%;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        draggable-element.egg {
          height: 25%;
          width: 25%;
        }

        draggable-element.eggCarton {
          height: 60%;
          width: 60%;
        }
      `,
    ];
  }

  private renderTrashcanArea(): HTMLTemplateResult {
    /* eslint-disable @typescript-eslint/unbound-method -- For ref, I have to refer to the actual function and not put a arrow function
                                                           in between as otherwise we run into a endless loop. Moreover, inside a html
                                                           string, this will be bound properly 
    */
    return html`
      <drop-target-trashcan
        id="trashcanArea"
        ${ref(this.trashcanTargetChange)}
      ></drop-target-trashcan>
    `;
    /* eslint-enable @typescript-eslint/unbound-method */
  }

  private renderCheckButtonArea(): HTMLTemplateResult {
    return html`
      <div id="checkButtonArea">
        <button @click=${() => this.handleCheckAnswer()}>
          <svg viewbox="-150 -50 300 100">
            <text class="middleAligned" x="0" y="0">Kijk na</text>
          </svg>
        </button>
      </div>
    `;
  }

  private renderNumberToSplitArea(): HTMLTemplateResult {
    return html` <div id="numberToSplitArea">
      <svg viewbox="-50 -50 100 100">
        <text class="middleAligned" x="0" y="0">${this.numberToSplit}</text>
      </svg>
    </div>`;
  }

  private renderEggCartonTargetArea(): HTMLTemplateResult {
    /* eslint-disable @typescript-eslint/unbound-method -- For ref, I have to refer to the actual function and not put a arrow function
                                                           in between as otherwise we run into a endless loop. Moreover, inside a html
                                                           string, this will be bound properly 
    */
    return html` <div id="eggCartonTargetArea">
      <drop-target-egg
        class=${classMap({
          wrongTargetArea: this.eggCartonTargetAreaHighlightWrong,
        })}
        itemType="eggCarton"
        numberItemsToShow=${this.numberVisibleEggCartons}
        maxNumberItemsToShow=${this.maxNumberItemsToShow}
        ${ref(this.eggCartonTargetChange)}
        @itemTrashed=${() => this.eggCartonTrashed()}
        @dragStarted=${() => this.resetWrongHighlights()}
        .trashcanAreas=${this.trashcanTarget}
      ></drop-target-egg>
    </div>`;
    /* eslint-enable @typescript-eslint/unbound-method */
  }

  private renderEggCartonSourceArea(): HTMLTemplateResult {
    return html`
      <div id="eggCartonSourceArea">
        <draggable-element
          class="eggCarton"
          resetDragAfterDrop
          .dropTargetList=${this.eggCartonTarget}
          @dropped=${() => this.eggCartonDrop()}
          @dragStarted=${() => this.resetWrongHighlights()}
        >
          <img
            class="eggCarton"
            draggable="false"
            alt="egg Carton"
            src=${eggCartonUrl.href}
          />
        </draggable-element>
      </div>
    `;
  }

  private renderEggTargetArea(): HTMLTemplateResult {
    /* eslint-disable @typescript-eslint/unbound-method -- For ref, I have to refer to the actual function and not put a arrow function
                                                           in between as otherwise we run into a endless loop. Moreover, inside a html
                                                           string, this will be bound properly 
    */
    return html`
      <div id="eggTargetArea">
        <drop-target-egg
          class=${classMap({
            wrongTargetArea: this.eggTargetAreaHighlightWrong,
          })}
          itemType="egg"
          numberItemsToShow=${this.numberVisibleEggs}
          maxNumberItemsToShow=${this.maxNumberItemsToShow}
          ${ref(this.eggTargetChange)}
          @itemTrashed=${() => this.eggTrashed()}
          @dragStarted=${() => this.resetWrongHighlights()}
          .trashcanAreas=${this.trashcanTarget}
        ></drop-target-egg>
      </div>
    `;
    /* eslint-enable @typescript-eslint/unbound-method */
  }

  private renderEggSourceArea(): HTMLTemplateResult {
    return html`
      <div id="eggSourceArea">
        <draggable-element
          class="egg"
          resetDragAfterDrop
          .dropTargetList=${this.eggTarget}
          @dropped=${() => this.eggDrop()}
          @dragStarted=${() => this.resetWrongHighlights()}
        >
          <img
            class="egg"
            draggable="false"
            alt="egg Carton"
            src=${eggUrl.href}
          />
        </draggable-element>
      </div>
    `;
  }

  renderGameContent(): HTMLTemplateResult {
    return html`
      ${this.renderNumberToSplitArea()} ${this.renderTrashcanArea()}
      ${this.renderCheckButtonArea()} ${this.renderEggCartonTargetArea()}
      ${this.renderEggCartonSourceArea()} ${this.renderEggTargetArea()}
      ${this.renderEggSourceArea()}
    `;
  }
}
