import { html, css } from 'lit';

// eslint-disable-next-line import/extensions
import { customElement, state } from 'lit/decorators.js';
// eslint-disable-next-line import/extensions
import { ref } from 'lit/directives/ref.js';

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
  accessor trashcanTarget: readonly DropTarget[] = [];

  @state()
  accessor eggTarget: readonly DropTarget[] = [];

  eggCartonSource: DraggableElement | null = null;

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

  eggCartonDrop() {
    if (this.numberVisibleEggCartons < 10) this.numberVisibleEggCartons += 1;
  }
  eggCartonTrashed() {
    if (this.numberVisibleEggCartons > 0) this.numberVisibleEggCartons -= 1;
  }

  eggDrop() {
    if (this.numberVisibleEggs < 10) this.numberVisibleEggs += 1;
  }
  eggTrashed() {
    if (this.numberVisibleEggs > 0) this.numberVisibleEggs -= 1;
  }

  constructor() {
    super();
    for (let tens = 1; tens < 10; tens++)
      for (let units = 1; units < 10; units++)
        this.eligibleNumbersToSplit.push(tens * 10 + units);
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
      Sleep de juiste hoeveelheid eierdozen en eieren op hun plek.
    </p>`;
  }

  /** Get the title for the welcome dialog. */
  get welcomeDialogTitle(): string {
    return `Eierdoos tellen`;
  }

  executeGameOverActions(): void {
    this.gameLogger.logGameOver();
  }

  handleCheckAnswer(): void {
    console.log('handleCheckAnswer');
  }

  static get styles(): CSSResultArray {
    return [
      ...super.styles,
      css`
        .gameContent {
          background-color: grey;
          display: grid;
          grid-template-rows: 0 18% 53% 25% 0;
          grid-template-columns: 0 23% 24% 24% 24% 0;
          grid-template-areas:
            '. ............... ............... ............. ............. .'
            '. numberToSplit   numberToSplit   numberToSplit numberToSplit .'
            '. eggCartonTarget eggCartonTarget eggTarget     eggTarget     .'
            '. trashcan        eggCartonSource eggSource     checkButton    .'
            '. ............... ............... ............. ............. .';
          row-gap: 1%;
          column-gap: 1%;
        }

        .numberToSplitArea {
          height: 100%;
          width: 100%;
          grid-area: numberToSplit;
          background-color: red;
        }

        .eggCartonTargetArea {
          grid-area: eggCartonTarget;
          background-color: blue;
          display: flex;
          justify-content: flex-end;
          align-items: center;
        }

        .eggElement {
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: orange;
        }

        drop-target-egg {
          height: 100%;
          width: 100%;
          border: black 5px dashed;
          box-sizing: border-box;
        }

        .eggTargetArea {
          grid-area: eggTarget;
          background-color: blue;
        }

        .eggCartonSourceArea {
          height: 100%;
          width: 100%;
          grid-area: eggCartonSource;
          background-color: green;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .eggSourceArea {
          height: 100%;
          width: 100%;
          grid-area: eggSource;
          background-color: yellow;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .checkButtonArea {
          grid-area: checkButton;
          background-color: purple;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 80%;
        }

        svg {
          width: 90%;
          aspect-ratio: 3;
          font-size: 80;
          border: 4px solid black;
          border-radius: 20%;
          background-color: magenta;
        }

        text {
          dominant-baseline: middle;
          font-size: 80px;
        }

        .middleAligned {
          text-anchor: middle;
        }

        .trashcanArea {
          grid-area: trashcan;
          background-color: pink;
        }

        img {
          object-fit: contain;
        }

        img.eggTarget {
          height: 50%;
          width: 50%;
        }

        img.eggCartonTarget {
          height: 90%;
          width: 90%;
        }

        img.egg {
          height: 25%;
          width: 25%;
        }
        img.eggCarton {
          height: 60%;
          width: 60%;
        }

        draggable-element {
          height: 100%;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `,
    ];
  }

  newRound() {
    this.numberToSplit = randomFromSet(this.eligibleNumbersToSplit);
  }

  renderGameContent(): HTMLTemplateResult {
    return html`
      <div class="numberToSplitArea"></div>
      <div class="eggCartonTargetArea">
        <drop-target-egg
          itemType="eggCarton"
          numberItemsToShow="${this.numberVisibleEggCartons}"
          ${ref(this.eggCartonTargetChange)}
          @itemTrashed="${this.eggCartonTrashed}"
          .trashcanAreas="${this.trashcanTarget}"
        ></drop-target-egg>
      </div>
      <div class="eggTargetArea">
        <drop-target-egg
          itemType="egg"
          numberItemsToShow="${this.numberVisibleEggs}"
          ${ref(this.eggTargetChange)}
          @itemTrashed="${this.eggTrashed}"
          .trashcanAreas="${this.trashcanTarget}"
        ></drop-target-egg>
      </div>
      <div class="eggCartonSourceArea">
        <draggable-element
          resetDragAfterDrop
          .dropTargetList="${this.eggCartonTarget}"
          @dropped="${this.eggCartonDrop}"
        >
          <img
            class="eggCarton"
            draggable="false"
            alt="egg Carton"
            src="../images/eggCarton.png"
          />
        </draggable-element>
      </div>
      <div class="eggSourceArea">
        <draggable-element
          resetDragAfterDrop
          .dropTargetList="${this.eggTarget}"
          @dropped="${this.eggDrop}"
        >
          <img
            class="egg"
            draggable="false"
            alt="egg Carton"
            src="../images/egg.png"
          />
        </draggable-element>
      </div>
      <div class="checkButtonArea">
        <svg viewbox="-150 -50 300 100">
          <text class="middleAligned" x="0" y="0">Kijk na</text>
        </svg>
      </div>
      <drop-target-trashcan
        class="trashcanArea"
        ${ref(this.trashcanTargetChange)}
      ></drop-target-trashcan>
    `;
  }
}
