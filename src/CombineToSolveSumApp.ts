import { html, css } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, state } from 'lit/decorators.js';
// eslint-disable-next-line import/extensions
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

// eslint-disable-next-line import/extensions
import { MutationController } from '@lit-labs/observers/mutation-controller.js';

import { TimeCountingGame } from './TimeCountingGame';
import './MompitzNumber';
import './DynamicGrid';
import './DraggableElement';
import './DraggableTargetHeart';

import {
  randomFromSetAndSplice,
  randomIntFromRange,
  shuffleArray,
} from './Randomizer';

import { GameLogger } from './GameLogger';

import './RealHeight';
import type { DraggableTargetHeart } from './DraggableTargetHeart';

type CellType = {
  id: string;
  nmbr: number;
};

@customElement('combine-to-solve-sum-app')
export class CombineToSolveSumApp extends TimeCountingGame {
  private gameLogger = new GameLogger('N', '');

  private initialNumberOfPairs = 2;
  private maxNumberOfPairs = 20;
  private currentNumberOfPairs = 0;
  private sum = 10;

  private newHearts: string[] = [];
  private removedHearts: string[] = [];

  private nextHeartId = 0;

  @state()
  cells: (CellType | null)[] = [];

  private mutationObserver = new MutationController(this, {
    config: { attributes: true, childList: true, subtree: true },
    callback: this.mutationObserved,
  });

  constructor() {
    super();
    this.parseUrl();
  }

  private mutationObserved(mutationList: MutationRecord[]) {
    console.log('mutations observed');
    console.log(mutationList);
  }

  private getHeart(query: string): DraggableTargetHeart {
    console.log(`get heart called: ${query}`);
    const ret = this.getElement<DraggableTargetHeart>(query);
    console.log(ret);
    return ret;
  }

  private parseUrl(): void {
    const urlParams = new URLSearchParams(window.location.search);

    // Get sum from the url. If no sum is present in the url, use 10.
    this.sum = parseInt(urlParams.get('sum') || '10', 10);
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

  private handleCorrectAnswer(): void {
    this.numberOk += 1;
  }

  private handleWrongAnswer(): void {
    this.numberNok += 1;
  }

  private newRound() {
    // To be filled in
    const possibleCells: (CellType | null)[] = [];
    for (let i = 0; i < this.initialNumberOfPairs; i++) {
      const cellPair = this.createPair();
      possibleCells.push(cellPair[0]);
      possibleCells.push(cellPair[1]);
    }
    for (
      let j = this.initialNumberOfPairs * 2;
      j < this.maxNumberOfPairs * 2;
      j++
    ) {
      possibleCells.push(null);
    }
    console.log(`newRound possibleCells`);
    console.log(possibleCells);

    this.cells.length = 0;
    for (let j = 0; j < this.maxNumberOfPairs * 2; j++) {
      this.cells.push(randomFromSetAndSplice(possibleCells));
    }
    console.log(`new Round cells`);
    console.log(this.cells);

    this.currentNumberOfPairs = this.initialNumberOfPairs;

    this.requestUpdate();
  }

  executeGameOverActions(): void {
    this.gameLogger.logGameOver();
  }

  async updated(): Promise<void> {
    await this.getUpdateComplete();
    console.log('updated');
    this.updateDropTargets();
  }

  /*
  updateDropTargetsOldToBeRemoved(): void {
    // Add all draggable-target-hearts as targets to all draggable-target-hearts;
    console.log('update drop targets');
    this.renderRoot
      .querySelectorAll('draggable-target-heart')
      .forEach(draggable => {
        console.log(draggable);
        (<DraggableTargetHeart>draggable).clearDropElements();
        const draggableHeart = <DraggableTargetHeart>draggable;
        this.renderRoot
          .querySelectorAll('draggable-target-heart')
          .forEach(dropTarget => {
            const dropTargetHeart = <DraggableTargetHeart>dropTarget;
            if (draggable !== dropTarget) {
              (<DraggableTargetHeart>draggable).addDropElement(
                <DraggableTargetHeart>dropTarget
              );
            }
          });
      });
  }
*/

  updateDropTargets(): void {
    this.addNewDropTargets();
    this.removeDropTargets();
    console.log(`all draggable hearts`);
    this.renderRoot
      .querySelectorAll(`draggable-target-heart`)
      .forEach(draggable => {
        console.log(draggable);
      });
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
    console.log(`updateDropTargets`);

    if (this.newHearts.length === 0) return;

    // find the draggable-target-heart elements that correspond to the new hearts.
    const newDraggableHearts: DraggableTargetHeart[] = [];
    this.renderRoot.querySelectorAll('draggable-target-heart').forEach(elm => {
      const draggableTargetHeart = elm as DraggableTargetHeart;
      if (this.newHearts.includes(draggableTargetHeart.id))
        newDraggableHearts.push(draggableTargetHeart);
    });
    console.log(`new DraggableTargetHeart`);
    console.log(newDraggableHearts);

    // Add all new draggable-target-hearts as targets to all existing draggable-target-hearts
    this.renderRoot
      .querySelectorAll('draggable-target-heart')
      .forEach(draggable => {
        if (!this.newHearts.includes(draggable.id)) {
          console.log(draggable);
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
    console.log('dropped in game');
    console.log(evt);
    if (
      parseInt(evt.detail.draggableValue, 10) +
        parseInt(evt.detail.dropTargetValue, 10) ===
      10
    ) {
      console.log('Yes - correct drop');
      this.numberOk += 1;
      this.removePair(evt.detail.draggableId, evt.detail.dropTargetId);
      if (this.currentNumberOfPairs === 0) this.handleGameOver();
    } else {
      console.log('No - wrong drop');
      this.numberNok += 1;
      this.getHeart(`#${evt.detail.draggableId}`).markAsWrongDrop(
        this.getHeart(`#${evt.detail.dropTargetId}`)
      );
      this.addPair();
    }
  }

  removePair(id1: string, id2: string) {
    console.log(`removePair ${id1}, ${id2}`);
    console.log(`cells`);
    console.log(this.cells);
    const cellIndex1 = this.cells.findIndex(
      cell => cell !== null && cell.id === id1
    );
    console.log(`cellIndex1 = ${cellIndex1}`);
    this.cells[cellIndex1] = null;
    const cellIndex2 = this.cells.findIndex(
      cell => cell !== null && cell.id === id2
    );
    console.log(`cellIndex2 = ${cellIndex2}`);
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
      },
      {
        id: id2,
        nmbr: this.sum - randomNumber,
      },
    ];
  }

  addPair() {
    console.log(`addPair`);
    if (this.currentNumberOfPairs < this.maxNumberOfPairs) {
      const potentialSlots: number[] = [];
      for (let i = 0; i < this.cells.length; i++)
        if (this.cells[i] === null) potentialSlots.push(i);
      console.log(`empty slots`);
      console.log(potentialSlots);
      const slot1 = randomFromSetAndSplice(potentialSlots);
      const slot2 = randomFromSetAndSplice(potentialSlots);
      console.log(`${slot1} & ${slot2}`);
      const cellPair = this.createPair();
      console.log(cellPair);
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

  /** Render the game content */
  renderGameContent(): HTMLTemplateResult {
    const cells: HTMLTemplateResult[] = [];

    for (const cell of this.cells) {
      if (cell === null) {
        cells.push(html`<div class="gridElement"></div>`);
      } else {
        cells.push(
          html`<div class="gridElement">
            <draggable-target-heart
              id="${cell.id}"
              value="${cell.nmbr}"
              resetDragAfterDrop
              style="height: 50%; aspect-ratio: 1; display:block; position: relative; left: 10%; top: 10%;"
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
          ${cells}
        </dynamic-grid>
      </button>
    `;
  }
}
