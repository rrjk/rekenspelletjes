import { html, css } from 'lit';

// eslint-disable-next-line import/extensions
import { state } from 'lit/decorators.js';

// eslint-disable-next-line import/extensions
import { range } from 'lit/directives/range.js';

import { create } from 'mutative';

import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { TimeLimitedGame2 } from './TimeLimitedGame2';

import './DraggableTargetSlotted';
import './DynamicGrid';
import type { DraggableTargetSlotted } from './DraggableTargetSlotted';
import { ChildNotFoundError } from './ChildNotFoundError';
import {
  DraggableElement,
  DropEvent,
  DropTargetElementInterface,
} from './DraggableElement';
import { shuffleArray } from './Randomizer';

interface BasicCellInfo {
  cellId: string;
  nmbr: number; // The cellnumber - use to construct element ids
  left: number; // Left position within the cell as percentage (0-40%)
  top: number; // Top position within the cell as percentage (0-40%)
}

type CellType = 'exercise' | 'answer';

function cellTypeAbreviation(type: CellType) {
  return type === 'exercise' ? 'e' : 'a';
}

interface CellInfoInterface {
  equal(other: CellInfoInterface): boolean;
}

interface CellElement extends HTMLElement {
  gridIndex: number;
}

interface Cell<T> {
  basicInfo: BasicCellInfo;
  detailedInfo: T;
}

interface GridCellMapping {
  cellType: CellType | 'empty';
  cellIndex: number;
}

export abstract class PairMatchingApp<
  CellInfo extends CellInfoInterface,
> extends TimeLimitedGame2 {
  @state()
  protected accessor exerciseCells: Cell<CellInfo>[] = [];

  @state()
  protected accessor answerCells: Cell<CellInfo>[] = [];

  @state()
  protected accessor cells: {
    exerciseCells: Cell<CellInfo>[];
    answerCells: Cell<CellInfo>[];
  } = { exerciseCells: [], answerCells: [] };

  @state()
  protected accessor gridItems: GridCellMapping[] = [];

  private numberOfPairs = 10;
  private nextPairNmbr = 0;
  private newlyAddedPairs: number[] = [];

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
    this.clearGridItems();
    this.exerciseCells = [];
    this.answerCells = [];
    this.nextPairNmbr = 0;
    this.addNewCells(this.numberOfPairs / 2);
    this.addNewCells(this.numberOfPairs / 2);
    console.log(`exerciseCells = ${JSON.stringify(this.exerciseCells)}`);
    console.log(`answerCells = ${JSON.stringify(this.answerCells)}`);
  }

  constructor() {
    super();
    this.parseUrl();
  }

  private clearGridItems() {
    this.gridItems = [];
    for (let i = 0; i < this.numberOfPairs * 2; i++) {
      this.gridItems.push({ cellIndex: 0, cellType: 'empty' });
    }
  }

  private addNewCells(nmbrPairs: number) {
    const toBeAddedPairNmbrs = [
      ...range(this.nextPairNmbr, this.nextPairNmbr + nmbrPairs),
    ];
    this.nextPairNmbr += nmbrPairs;

    const addedCellNmbrsAndTypes: { nmbr: number; type: CellType }[] = [];

    console.log(`addNewCells`);
    console.log(JSON.stringify(toBeAddedPairNmbrs));

    for (const i of toBeAddedPairNmbrs) {
      this.newlyAddedPairs.push(i);
      const pair = this.getPair();
      console.log(`pair = ${JSON.stringify(pair)}`);
      this.exerciseCells.push({
        basicInfo: {
          cellId: this.serializeCellId(i, 'exercise'),
          nmbr: i,
          top: 0,
          left: 0,
        },
        detailedInfo: pair.exercise,
      });
      this.answerCells.push({
        basicInfo: {
          cellId: this.serializeCellId(i, 'answer'),
          nmbr: i,
          top: 0,
          left: 0,
        },
        detailedInfo: pair.answer,
      });
      addedCellNmbrsAndTypes.push({ nmbr: i, type: 'exercise' });
      addedCellNmbrsAndTypes.push({ nmbr: i, type: 'answer' });
    }

    shuffleArray(addedCellNmbrsAndTypes);

    this.gridItems = create(this.gridItems, base => {
      for (const gridItem of base) {
        if (gridItem.cellType === 'empty') {
          const cellNmbrAndType = addedCellNmbrsAndTypes.pop();
          if (cellNmbrAndType !== undefined) {
            gridItem.cellType = cellNmbrAndType.type;
            gridItem.cellIndex = cellNmbrAndType.nmbr;
          }
        }
      }
    });

    console.log(
      `addedCellNmbrsAndType : ${JSON.stringify(addedCellNmbrsAndTypes)}`,
    );

    /*
    this.gridItems.push({ cellIndex: i, cellType: 'exercise' });
    this.gridItems.push({ cellIndex: i, cellType: 'answer' });
*/

    console.log(`addNewCells`);
    console.log(JSON.stringify(this.exerciseCells));
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

  private getCellElement(nmbr: number, type: CellType): DraggableTargetSlotted {
    const elementName = this.serializeCellId(nmbr, type);
    const cellElement = this.renderRoot.querySelector(
      `draggable-target-slotted#${elementName}`,
    );
    if (cellElement === null) {
      throw new ChildNotFoundError(elementName, 'PairMatchingApp');
    } else return cellElement as DraggableTargetSlotted;
  }

  serializeCellId(nmbr: number, type: CellType) {
    return `cell-${nmbr}-${cellTypeAbreviation(type)}`;
  }

  private parseCellId(id: string): { nmbr: number; type: CellType } {
    const splittedId = id.split('-');
    if (splittedId.length !== 3 || splittedId[0] !== 'cell')
      throw new Error('Non valid cell id encountered for parsing');
    const nmbr = parseInt(splittedId[1], 10);
    if (Number.isNaN(nmbr))
      throw new Error('Non valid cell id encountered for parsing');
    let type: CellType = 'answer';
    if (splittedId[2] === 'a') type = 'answer';
    else if (splittedId[2] === 'e') type = 'exercise';
    else throw new Error('Non valid cell id encountered for parsing');
    return { nmbr, type };
  }

  private getDetailedCellInfo(nmbr: number, type: CellType): CellInfo {
    let ret: CellInfo | undefined;
    console.log(`getDetailedCellInfo nmbr=${nmbr}, type=${type}`);
    if (type === 'exercise') {
      ret = this.exerciseCells.find(
        elm => elm.basicInfo.nmbr === nmbr,
      )?.detailedInfo;
    }
    if (type === 'answer') {
      ret = this.answerCells.find(
        elm => elm.basicInfo.nmbr === nmbr,
      )?.detailedInfo;
    }
    if (ret === undefined) {
      throw new Error('Information for a non-existing cell requested');
    }
    return ret;
  }

  protected updated(): void {
    console.log(`newlyAddedCells = ${this.newlyAddedPairs}`);
    if (this.newlyAddedPairs.length !== 0) this.addTargetsForNewCells();
  }

  /** Add all targets as drop targets to all recipients
   *  This function prevents adding x as a target for x, targets and recipients may have overlap
   */
  private addTargets(
    targets: DropTargetElementInterface[],
    recipients: DraggableElement[],
  ) {
    console.log('addTargets');
    console.log(targets);
    console.log(recipients);
    for (const target of targets) {
      for (const recipient of recipients) {
        if (<Element>target !== <Element>recipient)
          recipient.addDropElement(target);
      }
    }
  }

  private addTargetsForNewCells() {
    // First we make arrays of all existing and new cell elements.
    const newExerciseCellElms: DraggableTargetSlotted[] = [];
    const newAnswerCellElms: DraggableTargetSlotted[] = [];
    const existingExerciseCellElms: DraggableTargetSlotted[] = [];
    const existingAnswerCellElms: DraggableTargetSlotted[] = [];

    for (const cellNmbr of this.newlyAddedPairs) {
      newExerciseCellElms.push(this.getCellElement(cellNmbr, 'exercise'));
      newAnswerCellElms.push(this.getCellElement(cellNmbr, 'answer'));
    }

    for (const gridItem of this.gridItems) {
      if (!this.newlyAddedPairs.includes(gridItem.cellIndex)) {
        if (gridItem.cellType === 'exercise') {
          existingExerciseCellElms.push(
            this.getCellElement(gridItem.cellIndex, 'exercise'),
          );
        } else if (gridItem.cellType === 'answer') {
          existingAnswerCellElms.push(
            this.getCellElement(gridItem.cellIndex, 'answer'),
          );
        }
      }
    }
    /*
    for (const cell of this.exerciseCells) {
      if (!this.newlyAddedPairs.includes(cell.basicInfo.nmbr)) {
        existingExerciseCellElms.push(
          this.getCellElement(cell.basicInfo.nmbr, 'exercise'),
        );
      }
    }
*/

    for (const cell of this.answerCells) {
      if (!this.newlyAddedPairs.includes(cell.basicInfo.nmbr)) {
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
    this.newlyAddedPairs = [];
  }

  handleDropped(evt: DropEvent): void {
    console.log('handleExerciseDropped');
    console.log(evt);
    console.log(
      `draggableId = ${evt.draggableId}, dropTargetId = ${evt.dropTargetId}`,
    );

    const draggableElement = <CellElement>evt.draggableElement;
    const targetElement = <CellElement>evt.dropTargetElement;

    const gridIndexDraggable = draggableElement.gridIndex;
    const gridIndexTarget = targetElement.gridIndex;

    let cellInfoDraggable: CellInfo;
    const draggableCellType = this.gridItems[gridIndexDraggable].cellType;
    console.assert(
      draggableCellType === 'answer' || draggableCellType === 'exercise',
      'An empty grid element should not be draggable',
    );
    if (draggableCellType === 'exercise') {
      cellInfoDraggable =
        this.exerciseCells[this.gridItems[gridIndexDraggable].cellIndex]
          .detailedInfo;
    } else {
      cellInfoDraggable =
        this.answerCells[this.gridItems[gridIndexDraggable].cellIndex]
          .detailedInfo;
    }

    let cellInfoTarget: CellInfo;
    const targetCellType = this.gridItems[gridIndexTarget].cellType;
    console.assert(
      targetCellType === 'answer' || targetCellType === 'exercise',
      'An empty grid element should not be targettable',
    );
    if (targetCellType === 'exercise') {
      cellInfoTarget =
        this.exerciseCells[this.gridItems[gridIndexTarget].cellIndex]
          .detailedInfo;
    } else {
      cellInfoTarget =
        this.answerCells[this.gridItems[gridIndexTarget].cellIndex]
          .detailedInfo;
    }

    const equal = cellInfoDraggable.equal(cellInfoTarget);

    if (equal) {
      console.log(`TODO: we should remove the pair`);
    }

    console.log(
      `cellInfo draggable=${JSON.stringify(cellInfoDraggable)}, target=${JSON.stringify(cellInfoTarget)}, equal=${cellInfoDraggable.equal(cellInfoTarget)}`,
    );

    if (equal) {
      this.gridItems = create(this.gridItems, draft => {
        draft[gridIndexDraggable].cellType = 'empty';
        draft[gridIndexTarget].cellType = 'empty';
      });
    }
  }

  renderCellElement(
    cell?: Cell<CellInfo>,
    cellType?: CellType,
    gridIndex?: number,
  ) {
    if (cell === undefined || cellType === undefined || gridIndex === undefined)
      return html`<div class="gridElement"></div>`;

    return html` <div class="gridElement">
      <draggable-target-slotted
        id="${this.serializeCellId(cell.basicInfo.nmbr, cellType)}"
        .gridIndex="${gridIndex}"
        @dropped="${this.handleDropped}"
      >
        ${this.renderPairElement(cell.detailedInfo)}
      </draggable-target-slotted>
    </div>`;
  }

  /** Render the game content */
  renderGameContent(): HTMLTemplateResult {
    const cellElements: HTMLTemplateResult[] = [];

    console.log(`renderGameContent`);
    console.log(`exerciseCells = ${JSON.stringify(this.exerciseCells)}`);
    console.log(`answerCells = ${JSON.stringify(this.answerCells)}`);

    this.gridItems.forEach((gridItem, index) => {
      let cell: Cell<CellInfo>;
      if (gridItem.cellType === 'answer') {
        cell = this.exerciseCells[gridItem.cellIndex];
        cellElements.push(
          this.renderCellElement(cell, gridItem.cellType, index),
        );
      } else if (gridItem.cellType === 'exercise') {
        cell = this.answerCells[gridItem.cellIndex];
        cellElements.push(
          this.renderCellElement(cell, gridItem.cellType, index),
        );
      } else {
        cellElements.push(this.renderCellElement());
      }
    });

    /*
    for (const gridItem of this.gridItems) {
      let cell: Cell<CellInfo>;
      if (gridItem.cellType === 'answer')
        cell = this.exerciseCells[gridItem.cellIndex];
      else cell = this.answerCells[gridItem.cellIndex];
      cellElements.push(this.renderCellElement(cell, gridItem.cellType));
    }
*/
    /*
    for (const cell of this.exerciseCells) {
      cellElements.push(this.renderCellElement(cell, 'exercise'));
    }

    for (const cell of this.answerCells) {
      cellElements.push(this.renderCellElement(cell, 'answer'));
    }
*/
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
