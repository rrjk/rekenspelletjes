import { html, css } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, state } from 'lit/decorators.js';
// eslint-disable-next-line import/extensions
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

// eslint-disable-next-line import/extensions
import { MutationController } from '@lit-labs/observers/mutation-controller.js';

import { TimeCountingGame } from './TimeCountingGame';
import './MompitzNumber';
import './DynamicGrid';
import './DraggableElement';

import {
  randomFromSet,
  randomFromSetAndSplice,
  randomIntFromRange,
  shuffleArray,
} from './Randomizer';

import { GameLogger } from './GameLogger';

import './RealHeight';
import { getHeartasHTMLTemplateResult } from './HeartImage';
import { DraggableTargetElement } from './DraggableTargetElement';

@customElement('combine-to-solve-sum-app')
export class CombineToSolveSumApp extends TimeCountingGame {
  private gameLogger = new GameLogger('N', '');

  private initialNumberOfPairs = 13;
  private maxNumberOfPairs = 20;
  private sum = 10;

  @state()
  cells: (number | null)[] = [];

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
    const possibleCells: (number | null)[] = [];
    for (let i = 0; i < this.initialNumberOfPairs; i++) {
      const randomNumber = randomIntFromRange(1, this.sum - 1);
      possibleCells.push(randomNumber);
      possibleCells.push(this.sum - randomNumber);
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

    this.requestUpdate();
  }

  executeGameOverActions(): void {
    this.gameLogger.logGameOver();
  }

  async updated(): Promise<void> {
    await this.getUpdateComplete();
    console.log('updated');
    //    this.updateDropTargets();
  }

  updateDropTargets(): void {
    // Add all draggable-target-elements as targets to all draggable-target-elements;
    console.log('update drop targets');
    this.renderRoot
      .querySelectorAll('draggable-target-element')
      .forEach(draggable => {
        (<DraggableTargetElement>draggable).clearDropElements();
        this.renderRoot
          .querySelectorAll('draggable-target-element')
          .forEach(dropTarget => {
            if (draggable !== dropTarget) {
              (<DraggableTargetElement>draggable).addDropElement(
                <DraggableTargetElement>dropTarget
              );
            }
          });

        // draggable.addEventListener('dropped', event =>
        //  this.handleDropped(<CustomEvent>event)
        // );
      });
  }

  async firstUpdated(): Promise<void> {
    await this.getUpdateComplete();
    this.updateDropTargets();

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

  blahClick() {
    console.log('blah click');
    this.numberHearts -= 1;
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
            <draggable-target-element
              resetDragAfterDrop
              style="height: 50%; aspect-ratio: 1; display:block; position: relative; left: 10%; top: 10%;"
              >${getHeartasHTMLTemplateResult(
                'teal',
                `${cell}`
              )}</draggable-target-element
            >
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
