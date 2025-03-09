import { html, css } from 'lit';

// eslint-disable-next-line import/extensions
import { state } from 'lit/decorators.js';

// eslint-disable-next-line import/extensions
import { range } from 'lit/directives/range.js';

import { castDraft, create } from 'mutative';

import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { TimeLimitedGame2 } from './TimeLimitedGame2';

import './DraggableTargetSlotted';
import './DynamicGrid';
import type { DraggableTargetSlotted } from './DraggableTargetSlotted';
import { ChildNotFoundError } from './ChildNotFoundError';
import { DropEvent } from './DraggableElement';
import { shuffleArray } from './Randomizer';

interface BasicCellInfo {
  cellId: string;
  nmbr: number; // The cellnumber - use to construct element ids
  left: number; // Left position within the cell as percentage (0-40%)
  top: number; // Top position within the cell as percentage (0-40%)
}

type CellType = 'exercise' | 'answer';
const cellTypes: CellType[] = ['answer', 'exercise'];

function oppositeCellType(cellType: CellType): CellType {
  if (cellType === 'exercise') return 'answer';
  return 'exercise';
}

type GridCellType = CellType | 'empty';
// const gridCellTypes: GridCellType[] = ['answer', 'empty', 'exercise'];

type DragElementType = 'draggable' | 'target';
const dragElementTypes: DragElementType[] = ['draggable', 'target'];

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
  cellType: GridCellType;
  cellIndex: number;
}

export abstract class PairMatchingApp<
  CellInfo extends CellInfoInterface,
> extends TimeLimitedGame2 {
  @state()
  protected accessor cells: {
    exercise: Cell<CellInfo>[];
    answer: Cell<CellInfo>[];
  } = { exercise: [], answer: [] };

  @state()
  protected accessor gridItems: GridCellMapping[] = [];

  private maxNumberOfPairs = 10;
  private currentNumberOfPairs = 0;
  private nextPairNmbr = 0;

  private targetUpdateRequired = false;

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
    this.cells = { exercise: [], answer: [] };
    this.nextPairNmbr = 0;
    this.currentNumberOfPairs = 0;
    this.addNewCells();
  }

  constructor() {
    super();
    this.parseUrl();
  }

  private clearGridItems() {
    this.gridItems = [];
    for (let i = 0; i < this.maxNumberOfPairs * 2; i++) {
      this.gridItems.push({ cellIndex: 0, cellType: 'empty' });
    }
  }

  private addNewCells() {
    console.log(`addNewCells`);
    if (this.currentNumberOfPairs > this.maxNumberOfPairs / 2) return;

    const nmbrPairsToAdd = this.maxNumberOfPairs - this.currentNumberOfPairs;
    console.log(`addNewCells - nmbrPairsToAdd = ${nmbrPairsToAdd}`);

    const toBeAddedPairNmbrs = [
      ...range(this.nextPairNmbr, this.nextPairNmbr + nmbrPairsToAdd),
    ];
    this.nextPairNmbr += nmbrPairsToAdd;
    this.targetUpdateRequired = true;
    this.currentNumberOfPairs = this.maxNumberOfPairs;

    const addedCellNmbrsAndTypes: { nmbr: number; type: CellType }[] = [];

    for (const i of toBeAddedPairNmbrs) {
      const pair = this.getPair();
      this.cells = create(this.cells, draft => {
        for (const cellType of cellTypes) {
          draft[cellType].push({
            basicInfo: {
              cellId: this.serializeCellId(i, cellType),
              nmbr: i,
              top: 0,
              left: 0,
            },
            detailedInfo: castDraft(pair[cellType]),
          });
          addedCellNmbrsAndTypes.push({ nmbr: i, type: cellType });
        }
      });
    }

    shuffleArray(addedCellNmbrsAndTypes);

    this.gridItems = create(this.gridItems, base => {
      base.forEach(gridItem => {
        if (gridItem.cellType === 'empty') {
          const cellNmbrAndType = addedCellNmbrsAndTypes.pop();
          if (cellNmbrAndType !== undefined) {
            gridItem.cellType = cellNmbrAndType.type;
            gridItem.cellIndex = cellNmbrAndType.nmbr;
          }
        }
      });
    });
  }

  protected abstract getPair(): { exercise: CellInfo; answer: CellInfo };
  protected abstract renderPairElement(info: CellInfo): HTMLTemplateResult;

  protected parseUrl(): void {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('numberOfPairs')) {
      this.maxNumberOfPairs = parseInt(
        urlParams.get('numberOfPairs') || '10',
        10,
      );
      if (Number.isNaN(this.maxNumberOfPairs)) this.maxNumberOfPairs = 10;
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

  private getCellElement(index: number): DraggableTargetSlotted {
    const elementName = this.serializeGridId(index);
    const cellElement = this.renderRoot.querySelector(
      `draggable-target-slotted#${elementName}`,
    );
    if (cellElement === null) {
      throw new ChildNotFoundError(elementName, 'PairMatchingApp');
    }
    return cellElement as DraggableTargetSlotted;
  }

  private getCellElementOld(
    nmbr: number,
    type: CellType,
  ): DraggableTargetSlotted {
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

  serializeGridId(gridIndex: number) {
    return `grid-${gridIndex}`;
  }

  private getDetailedCellInfo(nmbr: number, type: CellType): CellInfo {
    const ret = this.cells[type].find(
      elm => elm.basicInfo.nmbr === nmbr,
    )?.detailedInfo;
    if (ret === undefined) {
      throw new Error('Information for a non-existing cell requested');
    }
    return ret;
  }

  protected updated(): void {
    if (this.targetUpdateRequired) {
      this.setTargetsForCells();
      this.targetUpdateRequired = false;
    }
  }

  private setTargetsForCells() {
    const cellElements: {
      exercise: DraggableTargetSlotted[];
      answer: DraggableTargetSlotted[];
    } = { exercise: [], answer: [] };

    this.gridItems.forEach((gridItem, index) => {
      if (gridItem.cellType !== 'empty') {
        cellElements[gridItem.cellType].push(this.getCellElement(index));
      }
    });

    for (const cellType of cellTypes) {
      for (const cellElement of cellElements[cellType]) {
        cellElement.clearDropElements();
        for (const oppositeCellElement of cellElements[
          oppositeCellType(cellType)
        ]) {
          cellElement.addDropElement(oppositeCellElement);
        }
        if (this.dropAllowed === 'allElements') {
          for (const otherSameTypeCellElement of cellElements[cellType]) {
            if (cellElement !== otherSameTypeCellElement) {
              cellElement.addDropElement(otherSameTypeCellElement);
            }
          }
        }
      }
    }
  }

  handleDropped(evt: DropEvent): void {
    const involvedElements = {
      draggable: <CellElement>evt.draggableElement,
      target: <CellElement>evt.dropTargetElement,
    };
    const involvedGridIndexes = {
      draggable: involvedElements.draggable.gridIndex,
      target: involvedElements.target.gridIndex,
    };

    const cellInfo: {
      draggable?: CellInfo;
      target?: CellInfo;
    } = {};

    for (const elementType of dragElementTypes) {
      const { cellType, cellIndex } =
        this.gridItems[involvedGridIndexes[elementType]];

      if (cellType === 'answer' || cellType === 'exercise') {
        cellInfo[elementType] = this.cells[cellType][cellIndex].detailedInfo;
      } else {
        console.error('An empty grid element should not be draggable');
      }
    }

    // Given the code above, we now for sure there will be a draggable and a target in cellInfo
    const equal = cellInfo.draggable!.equal(cellInfo.target!);

    if (equal) {
      this.numberOk += 1;

      this.gridItems = create(this.gridItems, draft => {
        for (const dragElemenType of dragElementTypes) {
          draft[involvedGridIndexes[dragElemenType]].cellType = 'empty';
        }
      });

      this.currentNumberOfPairs -= 1;
      this.targetUpdateRequired = true;

      this.addNewCells();
    }
  }

  renderCellElement(gridIndex: number) {
    const { cellIndex, cellType } = this.gridItems[gridIndex];
    if (cellType === 'empty') return html`<div class="gridElement"></div>`;

    const cell = this.cells[cellType][cellIndex];

    return html` <div class="gridElement">
      <draggable-target-slotted
        cellId="${this.serializeCellId(cellIndex, cellType)}"
        id=${this.serializeGridId(gridIndex)}
        .gridIndex="${gridIndex}"
        @dropped="${this.handleDropped}"
        resetDragAfterDrop
      >
        ${this.renderPairElement(cell.detailedInfo)}
      </draggable-target-slotted>
    </div>`;
  }

  /** Render the game content */
  renderGameContent(): HTMLTemplateResult {
    const cellElements: HTMLTemplateResult[] = [];

    this.gridItems.forEach((gridItem, index) => {
      if (gridItem.cellType === 'answer') {
        cellElements.push(this.renderCellElement(index));
      } else if (gridItem.cellType === 'exercise') {
        cellElements.push(this.renderCellElement(index));
      } else {
        cellElements.push(this.renderCellElement(index));
      }
    });

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
