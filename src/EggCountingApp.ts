import { html, css } from 'lit';

// eslint-disable-next-line import/extensions
import { customElement, state } from 'lit/decorators.js';
// eslint-disable-next-line import/extensions
import { ref } from 'lit/directives/ref.js';
// eslint-disable-next-line import/extensions
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
  DropTargetElement,
  DropTarget,
} from './DraggableElement';
// import type { DropTargetEgg } from './DropTargetEgg';

type ItemType = 'egg' | 'eggCarton';
type NumberVisibleItems = Record<ItemType, number>;

@customElement('eggcarton-counting-app')
export class EggCountingApp extends TimeLimitedGame2 {
  @state()
  accessor numberToSplit = 96;

  @state()
  accessor numberVisibleItems: NumberVisibleItems = { egg: 0, eggCarton: 0 };

  @state()
  accessor targetAreaHighlightWrong: Record<ItemType, boolean> = {
    egg: false,
    eggCarton: false,
  };

  @state()
  accessor eggCartonTarget: readonly DropTarget[] = [];

  @state()
  accessor trashcanTarget: readonly DropTarget[] = [];

  @state()
  accessor eggTarget: readonly DropTarget[] = [];

  eggCartonSource: DraggableElement | null = null;

  maxNumberItemsToShow = 12; // Maximum number of eggs / eggCartons to show in the target area.

  private gameLogger = new GameLogger('J', 'a');
  private eligibleNumbersToSplit: number[] = [];

  eggTargetChange(eggTarget: Element | undefined) {
    if (eggTarget) {
      this.eggTarget = [
        { element: <DropTargetElement>eggTarget, dropType: 'dropOk' },
      ];
    } else this.eggTarget = [];
  }

  eggCartonTargetChange(eggCartonTarget: Element | undefined) {
    if (eggCartonTarget) {
      this.eggCartonTarget = [
        { element: <DropTargetElement>eggCartonTarget, dropType: 'dropOk' },
      ];
    } else this.eggCartonTarget = [];
  }

  trashcanTargetChange(trashcanTarget: Element | undefined) {
    if (trashcanTarget) {
      this.trashcanTarget = [
        { element: <DropTargetElement>trashcanTarget, dropType: 'dropOk' },
      ];
    } else this.trashcanTarget = [];
  }

  itemDrop(itemType: ItemType);

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
          background-color: #ffff8f;
        }

        @media (min-aspect-ratio: 0.7) {
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

        @media (max-aspect-ratio: 0.7) {
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
          display: flex;
          justify-content: flex-end;
          align-items: center;
        }

        #eggElement {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        drop-target-egg {
          height: 100%;
          width: 100%;
          border: black 5px dashed;
          box-sizing: border-box;
        }

        #eggTargetArea {
          grid-area: eggTarget;
        }

        #eggCartonSourceArea {
          grid-area: eggCartonSource;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        #eggSourceArea {
          grid-area: eggSource;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .wrongTargetArea {
          background-color: red;
        }

        #checkButtonArea {
          grid-area: checkButton;
          display: flex;
          justify-content: center;
          align-items: center;
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
          display: flex;
          justify-content: center;
          align-items: center;
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
    return html`
      <drop-target-trashcan
        id="trashcanArea"
        ${ref(this.trashcanTargetChange)}
      ></drop-target-trashcan>
    `;
  }

  private renderCheckButtonArea(): HTMLTemplateResult {
    return html`
      <div id="checkButtonArea">
        <button @click=${this.handleCheckAnswer}>
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

  private renderTargetArea(itemType: ItemType): HTMLTemplateResult {
    return html`
      <div id="eggCartonTargetArea">
        <drop-target-egg
          class="${classMap({
            wrongTargetArea: this.targetAreaHighlightWrong[itemType],
          })}"
          itemType="eggCarton"
          numberItemsToShow="${this.numberVisibleItems[itemType]}"
          maxNumberItemsToShow="${this.maxNumberItemsToShow}"
          ${ref(this.eggCartonTargetChange)}
          @itemTrashed="${this.eggCartonTrashed}"
          @dragStarted="${this.resetWrongHighlights}"
          .trashcanAreas="${this.trashcanTarget}"
        ></drop-target-egg>
      </div>
    `;
  }

  renderGameContent(): HTMLTemplateResult {
    return html`
      ${this.renderNumberToSplitArea()} ${this.renderTrashcanArea()}
      ${this.renderCheckButtonArea()} ${this.renderEggCartonTargetArea()}

      <div id="eggTargetArea">
        <drop-target-egg
          class="${classMap({
            wrongTargetArea: this.eggTargetAreaHighlightWrong,
          })}"
          itemType="egg"
          numberItemsToShow="${this.numberVisibleEggs}"
          maxNumberItemsToShow="${this.maxNumberItemsToShow}"
          ${ref(this.eggTargetChange)}
          @itemTrashed="${this.eggTrashed}"
          @dragStarted="${this.resetWrongHighlights}"
          .trashcanAreas="${this.trashcanTarget}"
        ></drop-target-egg>
      </div>
      <div id="eggCartonSourceArea">
        <draggable-element
          class="eggCarton"
          resetDragAfterDrop
          .dropTargetList="${this.eggCartonTarget}"
          @dropped="${this.eggCartonDrop}"
          @dragStarted="${this.resetWrongHighlights}"
        >
          <img
            class="eggCarton"
            draggable="false"
            alt="egg Carton"
            src="../images/eggCarton.png"
          />
        </draggable-element>
      </div>
      <div id="eggSourceArea">
        <draggable-element
          class="egg"
          resetDragAfterDrop
          .dropTargetList="${this.eggTarget}"
          @dropped="${this.eggDrop}"
          @dragStarted="${this.resetWrongHighlights}"
        >
          <img
            class="egg"
            draggable="false"
            alt="egg Carton"
            src="../images/egg.png"
          />
        </draggable-element>
      </div>
    `;
  }
}
