import { html, css } from 'lit';

// eslint-disable-next-line import/extensions
import { state } from 'lit/decorators.js';

// eslint-disable-next-line import/extensions
import { range } from 'lit/directives/range.js';

// import { create } from 'mutative';

import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { TimeLimitedGame2 } from './TimeLimitedGame2';

import './DraggableTargetSlotted';
import './DynamicGrid';
import type { DraggableTargetSlotted } from './DraggableTargetSlotted';
import { ChildNotFoundError } from './ChildNotFoundError';

interface BasicCellInfo {
  nmbr: number; // The cellnumber - use to construct element ids
  left: number; // Left position within the cell as percentage (0-40%)
  top: number; // Top position within the cell as percentage (0-40%)
}

type CellTypeType = 'exercise' | 'answer';

function cellTypeAbreviation(type: CellTypeType) {
  return type === 'exercise' ? 'e' : 'a';
}

export abstract class PairMatchingApp<CellInfo> extends TimeLimitedGame2 {
  @state()
  protected accessor exerciseCells: {
    basicInfo: BasicCellInfo;
    detailedInfo: CellInfo;
    dropTargets: number[];
  }[] = [];

  @state()
  protected accessor answerCells: {
    basicInfo: BasicCellInfo;
    detailedInfo: CellInfo;
    dropTargets: number[];
  }[] = [];

  private numberOfPairs = 10;
  private nextCellId = 0;
  private newlyAddedCells: number[] = [];

  @state()
  private accessor draggableTargets: Map<string, Element> = new Map();

  /* Control drop behavior - for child classes to override behavior
     allElements - All elements can be dropped on all other elements
     opositeElements - Answers can be dropped on exercises, exercises can be dropped on answers
     answerOnExercises - Answers can be dropped on exercises, exercises cannot be dragged at all - not yet implement
     exerciseOnAnswers - Exercises can be dropped on answers, answers cannot be dragged at all  - not yet implement
  */
  protected dropAllowed:
    | 'allElements'
    | 'opositeElements'
    | 'answerOnExercise'
    | 'exerciseOnAnswer' = 'allElements';

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
    console.assert(
      this.dropAllowed !== 'exerciseOnAnswer' &&
        this.dropAllowed !== 'answerOnExercise',
      'Dropallowed exerciseOnAnswer and answerOnExercise are not yet implemented',
    );
    super.startNewGame();
    this.newRound();
  }

  constructor() {
    super();
    this.parseUrl();
  }

  private addNewCells(nmbrCells: number) {
    const toBeAddedCellsNmbrs = [
      ...range(this.nextCellId, this.nextCellId + nmbrCells),
    ];
    const existingCellNmbrs = this.exerciseCells.map(
      cell => cell.basicInfo.nmbr,
    ); // Pairs are added and removed in pairs, so checking the exerciseCells is sufficient.

    const dropTargets = [...toBeAddedCellsNmbrs, ...existingCellNmbrs];

    console.log(JSON.stringify(toBeAddedCellsNmbrs));

    for (const i of toBeAddedCellsNmbrs) {
      this.newlyAddedCells.push(i);
      const pair = this.getPair();
      this.exerciseCells.push({
        basicInfo: { nmbr: i, top: 0, left: 0 },
        detailedInfo: pair.exercise,
        dropTargets,
      });
      this.answerCells.push({
        basicInfo: { nmbr: i, top: 0, left: 0 },
        detailedInfo: pair.answer,
        dropTargets,
      });
    }

    console.log(`addNewCells`);
    console.log(JSON.stringify(this.exerciseCells));
  }

  private newRound(): void {
    console.log(`newRound`);
    this.exerciseCells = [];
    this.answerCells = [];
    this.nextCellId = 0;
    this.addNewCells(this.numberOfPairs);
    console.log(`exerciseCells = ${JSON.stringify(this.exerciseCells)}`);
    console.log(`answerCells = ${JSON.stringify(this.answerCells)}`);
  }

  protected abstract getPair(): { exercise: CellInfo; answer: CellInfo };
  protected abstract renderPairElement(info: CellInfo): HTMLTemplateResult;

  protected parseUrl(): void {
    console.log(`PairMatchingApp.parseUrl called`);
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('numberOfPairs')) {
      this.numberOfPairs = parseInt(urlParams.get('numberOfPairs') || '10', 10);
      if (Number.isNaN(this.numberOfPairs)) this.numberOfPairs = 10;
    }
  }

  static get styles(): CSSResultArray {
    return [
      ...super.styles,
      css`
        draggable-target-slotted {
          width: 50%;
          height: 50%;
        }
      `,
    ];
  }

  private getCellElement(
    nmbr: number,
    type: CellTypeType,
  ): DraggableTargetSlotted {
    const elementName = `cell${nmbr}${cellTypeAbreviation(type)}`;
    const cellElement = this.renderRoot.querySelector(
      `draggable-target-slotted#${elementName}`,
    );
    if (cellElement === null) {
      throw new ChildNotFoundError(elementName, 'PairMatchingApp');
    } else return cellElement as DraggableTargetSlotted;
  }

  protected updated(): void {
    console.log(`newlyAddedCells = ${this.newlyAddedCells}`);
    if (this.newlyAddedCells.length !== 0) this.addTargetsForNewCells();
  }

  /** Add all targets as drop targets to all recipients
   *  This function prevents adding x as a target for x, targets and recipients may have overlap
   */
  private addTargets(
    targets: DraggableTargetSlotted[],
    recipients: DraggableTargetSlotted[],
  ) {
    console.log('addTargets');
    console.log(targets);
    console.log(recipients);
    for (const target of targets) {
      for (const recipient of recipients) {
        if (target !== recipient) recipient.addDropElement(target);
      }
    }
  }

  private addTargetsForNewCells() {
    // First we make arrays of all existing and new cell elements.
    const newExerciseCellElms: DraggableTargetSlotted[] = [];
    const newAnswerCellElms: DraggableTargetSlotted[] = [];
    const existingExerciseCellElms: DraggableTargetSlotted[] = [];
    const existingAnswerCellElms: DraggableTargetSlotted[] = [];

    for (const cellNmbr of this.newlyAddedCells) {
      newExerciseCellElms.push(this.getCellElement(cellNmbr, 'exercise'));
      newAnswerCellElms.push(this.getCellElement(cellNmbr, 'answer'));
    }

    for (const cell of this.exerciseCells) {
      if (!this.newlyAddedCells.includes(cell.basicInfo.nmbr)) {
        existingExerciseCellElms.push(
          this.getCellElement(cell.basicInfo.nmbr, 'exercise'),
        );
      }
    }

    for (const cell of this.answerCells) {
      if (!this.newlyAddedCells.includes(cell.basicInfo.nmbr)) {
        existingAnswerCellElms.push(
          this.getCellElement(cell.basicInfo.nmbr, 'answer'),
        );
      }
    }

    if (this.dropAllowed === 'opositeElements') {
      // First we add all new cells elements as targets to all existing oposite cell elements
      this.addTargets(newExerciseCellElms, existingAnswerCellElms);
      this.addTargets(newAnswerCellElms, existingExerciseCellElms);
      // Then we add all new and exising cell elements to all new oposite cell elements
      this.addTargets(
        [...newExerciseCellElms, ...existingExerciseCellElms],
        newAnswerCellElms,
      );
      this.addTargets(
        [...newAnswerCellElms, ...existingAnswerCellElms],
        existingExerciseCellElms,
      );
    } else if (this.dropAllowed === 'allElements') {
      // First we add all new cells elements as targets to all existing cell elements
      this.addTargets(
        [...newExerciseCellElms, ...newAnswerCellElms],
        [...existingAnswerCellElms, ...existingExerciseCellElms],
      );
      // Then we add all new and existing cell elements to all new cell elements
      this.addTargets(
        [
          ...newExerciseCellElms,
          ...newAnswerCellElms,
          ...existingExerciseCellElms,
          ...existingAnswerCellElms,
        ],
        [...newAnswerCellElms, ...newExerciseCellElms],
      );
    } else {
      throw Error(
        `dropAllowed = ${this.dropAllowed} is not supported for PairMatchingApp yet`,
      );
    }
  }

  /** Render the game content */
  renderGameContent(): HTMLTemplateResult {
    const cellElements: HTMLTemplateResult[] = [];

    console.log(`renderGameContent`);
    console.log(`exerciseCells = ${JSON.stringify(this.exerciseCells)}`);
    console.log(`answerCells = ${JSON.stringify(this.answerCells)}`);

    for (const cell of this.exerciseCells) {
      if (cell === null) {
        cellElements.push(html`<div class="gridElement"></div>`);
      } else {
        cellElements.push(
          html` <div class="gridElement">
            <draggable-target-slotted id="cell${cell.basicInfo.nmbr}e">
              ${this.renderPairElement(cell.detailedInfo)}
            </draggable-target-slotted>
          </div>`,
        );
      }
    }

    for (const cell of this.answerCells) {
      if (cell === null) {
        cellElements.push(html`<div class="gridElement"></div>`);
      } else {
        cellElements.push(
          html` <div class="gridElement">
            <draggable-target-slotted id="cell${cell.basicInfo.nmbr}a">
              ${this.renderPairElement(cell.detailedInfo)}
            </draggable-target-slotted>
          </div>`,
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
