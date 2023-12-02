import { html, css } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, state } from 'lit/decorators.js';
// eslint-disable-next-line import/extensions
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { TimeCountingGame } from './TimeCountingGame';
import './DynamicGrid';
import './DraggableTargetHeart';

import {
  randomFromSetAndSplice,
  randomIntFromRange,
  shuffleArray,
} from './Randomizer';

import { GameLogger } from './GameLogger';

import './RealHeight';
import type { DraggableTargetHeart } from './DraggableTargetHeart';

/* Type for cell information */
type CellType = {
  id: string; // Element id for the heart
  nmbr: number; // Number to show in the heart
  left: number; // Left position within the cell as percentage (0-40%)
  top: number; // Top position within the cell as percentage (0-40%)
};

@customElement('combine-to-solve-sum-app')
export class CombineToSolveSumApp extends TimeCountingGame {
  private gameLogger = new GameLogger('N', '');

  private initialNumberOfPairs = 10;
  private maxNumberOfPairs = 20;
  private currentNumberOfPairs = 0;
  private sum = 10;

  private newHearts: string[] = [];
  private removedHearts: string[] = [];

  private nextHeartId = 0;

  @state()
  cells: (CellType | null)[] = [];

  constructor() {
    super();
    this.parseUrl();
  }

  private getHeart(query: string): DraggableTargetHeart {
    const ret = this.getElement<DraggableTargetHeart>(query);
    return ret;
  }

  private parseUrl(): void {
    const urlParams = new URLSearchParams(window.location.search);

    // Get sum from the url. If no sum is present in the url, use 10.

    this.sum = parseInt(urlParams.get('sum') || '10', 10);
    if (Number.isNaN(this.sum)) this.sum = 10;

    this.initialNumberOfPairs = parseInt(
      urlParams.get('initialNumberOfPairs') || '10',
      10
    );
    if (Number.isNaN(this.initialNumberOfPairs)) this.initialNumberOfPairs = 10;

    this.maxNumberOfPairs = parseInt(
      urlParams.get('maxNumberOfPairs') || '20',
      10
    );
    if (Number.isNaN(this.maxNumberOfPairs)) this.initialNumberOfPairs = 10;

    if (this.maxNumberOfPairs < this.initialNumberOfPairs)
      this.maxNumberOfPairs = this.initialNumberOfPairs + 2;
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
      Sleep twee harten over elkaar heen die samen ${this.sum} maken
    </p>`;
  }

  /** Get the title for the welcome dialog. */
  get welcomeDialogTitle(): string {
    return `Verliefde harten`;
  }

  private newRound() {
    // We clear the old cells
    this.cells.length = 0;

    // We fill all the cells with the correct number of pairs
    for (let i = 0; i < this.initialNumberOfPairs; i++) {
      const cellPair = this.createPair();
      this.cells.push(cellPair[0]);
      this.cells.push(cellPair[1]);
    }
    for (
      let j = this.initialNumberOfPairs * 2;
      j < this.maxNumberOfPairs * 2;
      j++
    ) {
      this.cells.push(null);
    }

    // We shuffle the cells
    shuffleArray(this.cells);

    this.currentNumberOfPairs = this.initialNumberOfPairs;
    this.requestUpdate();
  }

  executeGameOverActions(): void {
    this.gameLogger.logGameOver();
  }

  async updated(): Promise<void> {
    await this.getUpdateComplete();
    // Whenever an update was done, we need to update the drop targets.
    this.updateDropTargets();
  }

  updateDropTargets(): void {
    this.addNewDropTargets();
    this.removeDropTargets();
  }

  removeDropTargets(): void {
    if (this.removedHearts.length === 0) return;

    // Iterate over all visible draggable-target-hearts and remove the removed hearts from the drop target list
    this.renderRoot
      .querySelectorAll(`draggable-target-heart`)
      .forEach(draggable => {
        const draggableHeart = draggable as DraggableTargetHeart;
        draggableHeart.removeDropElements(this.removedHearts);
      });

    this.removedHearts.length = 0;
  }

  addNewDropTargets(): void {
    if (this.newHearts.length === 0) return;

    // find the draggable-target-heart elements that correspond to the new hearts.
    const newDraggableHearts: DraggableTargetHeart[] = [];
    this.renderRoot.querySelectorAll('draggable-target-heart').forEach(elm => {
      const draggableTargetHeart = elm as DraggableTargetHeart;
      if (this.newHearts.includes(draggableTargetHeart.id))
        newDraggableHearts.push(draggableTargetHeart);
    });

    // Add all new draggable-target-hearts as targets to all existing draggable-target-hearts
    this.renderRoot
      .querySelectorAll('draggable-target-heart')
      .forEach(draggable => {
        if (!this.newHearts.includes(draggable.id)) {
          const draggableHeart = draggable as DraggableTargetHeart;
          newDraggableHearts.forEach(newDraggableHeart => {
            if (draggableHeart !== newDraggableHeart) {
              draggableHeart.addDropElement(newDraggableHeart);
            }
          });
        }
      });

    // Add all draggable-target-hearts as targets to all new draggable-target-hearts
    newDraggableHearts.forEach(newDraggableHeart => {
      this.renderRoot
        .querySelectorAll('draggable-target-heart')
        .forEach(draggable => {
          const draggableHeart = draggable as DraggableTargetHeart;
          if (newDraggableHeart.id !== draggableHeart.id)
            newDraggableHeart.addDropElement(draggableHeart);
        });
    });

    this.newHearts.length = 0;
  }

  handleDropped(evt: CustomEvent) {
    if (
      parseInt(evt.detail.draggableValue, 10) +
        parseInt(evt.detail.dropTargetValue, 10) ===
      this.sum
    ) {
      this.numberOk += 1;
      this.removePair(evt.detail.draggableId, evt.detail.dropTargetId);
      if (this.currentNumberOfPairs === 0) this.handleGameOver();
    } else if (evt.detail.dropType === 'dropOk') {
      this.numberNok += 1;
      this.getHeart(`#${evt.detail.draggableId}`).markAsWrongDrop(
        this.getHeart(`#${evt.detail.dropTargetId}`)
      );
      this.addPair();
    }
  }

  removePair(id1: string, id2: string) {
    const cellIndex1 = this.cells.findIndex(
      cell => cell !== null && cell.id === id1
    );
    this.cells[cellIndex1] = null;
    const cellIndex2 = this.cells.findIndex(
      cell => cell !== null && cell.id === id2
    );
    this.cells[cellIndex2] = null;
    this.currentNumberOfPairs -= 1;
    this.removedHearts.push(id1);
    this.removedHearts.push(id2);
    this.requestUpdate();
  }

  createPair(): CellType[] {
    const randomNumber = randomIntFromRange(1, this.sum - 1);
    const id1 = `h${this.nextHeartId}`;
    const id2 = `h${this.nextHeartId + 1}`;
    this.newHearts.push(`h${this.nextHeartId}`);
    this.newHearts.push(`h${this.nextHeartId + 1}`);
    this.nextHeartId += 2;

    return [
      {
        id: id1,
        nmbr: randomNumber,
        left: randomIntFromRange(0, 45),
        top: randomIntFromRange(0, 45),
      },
      {
        id: id2,
        nmbr: this.sum - randomNumber,
        left: randomIntFromRange(0, 45),
        top: randomIntFromRange(0, 45),
      },
    ];
  }

  addPair() {
    if (this.currentNumberOfPairs < this.maxNumberOfPairs) {
      const potentialSlots: number[] = [];
      for (let i = 0; i < this.cells.length; i++)
        if (this.cells[i] === null) potentialSlots.push(i);
      const slot1 = randomFromSetAndSplice(potentialSlots);
      const slot2 = randomFromSetAndSplice(potentialSlots);
      const cellPair = this.createPair();
      [this.cells[slot1], this.cells[slot2]] = [cellPair[0], cellPair[1]];
      this.currentNumberOfPairs += 1;
      this.requestUpdate();
    }
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
    return [...super.styles];
  }

  /** Render the game content */
  renderGameContent(): HTMLTemplateResult {
    const cellElements: HTMLTemplateResult[] = [];

    for (const cell of this.cells) {
      if (cell === null) {
        cellElements.push(html`<div class="gridElement"></div>`);
      } else {
        cellElements.push(
          html`<div class="gridElement">
            <draggable-target-heart
              id="${cell.id}"
              value="${cell.nmbr}"
              resetDragAfterDrop
              style="height: 50%; aspect-ratio: 1; display:block; position: relative; left: ${cell.left}%; top: ${cell.top}%;"
              @dropped="${this.handleDropped}"
            ></draggable-target-heart>
          </div>`
        );
      }
    }

    return html`
        <dynamic-grid
          contentAspectRatio="1"
          padding="0"
          style="width: 100%; height: 100%; top: 0;"
        >
          ${cellElements}
        </dynamic-grid>
      </button>
    `;
  }
}
