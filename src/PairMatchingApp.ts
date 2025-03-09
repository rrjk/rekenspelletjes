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
import { randomIntFromRange, shuffleArray } from './Randomizer';

/**
 * The game builds up a simple grid to keep numberOfPairs *2 gridElement. This grid will resize automatically.
 * Grid elements are indexes from 0 upwards, starting in the top left and going first horizontally and subsequently vertically
 * *---*---*---*
 * | 0 | 1 | 2 |
 * | 3 | 4 | 5 |
 * | 6 | 7 | 8 |
 * *---*---*---*
 *
 * Inside the grid elements, cells or Mompitz figures are rendered.
 * Cells we have in two different types see CellType: 'exercise' | 'answer'.
 *
 * To be able to also distinguish this on grid level, we also have GridType: CellType | 'mompitz'
 *
 * To render 'exercise' and 'answer' cells, information is needed,
 * this information is stored in cells, one array for the exercises and one array for the answers.
 *
 * A cell does not fill the entire grid element, it's set to always be square and takeup at most 50% of height or width.
 * In the basicinfo of a cell it stored where in the grid element, the cell is rendered.
 * More detailed info is set in detailedInfo, of type T, which needs to be specified by a child class of PairMatchingApp.
 * This detailed info is passed on to render a cell content via the abstract function this.renderPairElement, which needs to be
 * filled in by a child class
 *
 * Cell information are stored in the cells propert, and during a game never removed.
 * In gridItems, a mapping from a grid element to the proper cell and cell type is kept track of.
 * For 'mompitz' grid items, the mapping is to the set of image URL for the Mompitz figures.
 *
 */

type CellType = 'exercise' | 'answer';
const cellTypes: CellType[] = ['answer', 'exercise'];

function oppositeCellType(cellType: CellType): CellType {
  if (cellType === 'exercise') return 'answer';
  return 'exercise';
}

type GridCellType = CellType | 'mompitz';
// const gridCellTypes: GridCellType[] = ['answer', 'mompitz', 'exercise'];

type DragElementType = 'draggable' | 'target';
const dragElementTypes: DragElementType[] = ['draggable', 'target'];

interface BasicCellInfo {
  left: number; // Left position within the cell as percentage (0-40%)
  top: number; // Top position within the cell as percentage (0-40%)
}

interface CellInfoInterface {
  equal(other: CellInfoInterface): boolean;
}

interface CellElement extends DraggableTargetSlotted {
  gridIndex: number;
}

interface Cell<T> {
  basicInfo: BasicCellInfo;
  detailedInfo: T;
}

interface GridCellMapping {
  cellType: GridCellType;
  cellIndex: number;
  wrongDrops: DraggableTargetSlotted[];
}

export abstract class PairMatchingApp<
  CellInfo extends CellInfoInterface,
> extends TimeLimitedGame2 {
  /** Images for the Mompitz grid elements */
  static imagesFormompitzCells: URL[] = [
    new URL('../images/Mompitz Anne.png', import.meta.url),
    new URL('../images/Mompitz Frank.png', import.meta.url),
    new URL('../images/Mompitz Jan-500.png', import.meta.url),
    new URL('../images/Mompitz Johannes.png', import.meta.url),
    new URL('../images/Mompitz Lisa.png', import.meta.url),
    new URL('../images/Mompitz Lisa_Lupe.png', import.meta.url),
    new URL('../images/Mompitz Manfred.png', import.meta.url),
    new URL('../images/Mompitz Rosa_Stifte.png', import.meta.url),
    new URL('../images/Mompitz Willi_Geschenk.png', import.meta.url),
  ];

  /** Cell information */
  @state()
  private accessor cells: {
    exercise: Cell<CellInfo>[];
    answer: Cell<CellInfo>[];
  } = { exercise: [], answer: [] };

  /** Grid to cell mapping */
  @state()
  private accessor gridItems: GridCellMapping[] = [];

  /** Maximum number of pairs to show (set via URL parameter) */
  private maxNumberOfPairs = 10;
  /** Number of pairs currently visible */
  private currentNumberOfPairs = 0;
  /** Next pair number, used as index in cells */
  private nextPairNmbr = 0;
  /** Next image to use for Mompitz grid elements */
  private nextImageFormompitzCellIndex = 0;

  /** Is an update of the drop targets required */
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

  protected abstract getPair(): { exercise: CellInfo; answer: CellInfo };
  protected abstract renderPairElement(info: CellInfo): HTMLTemplateResult;

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
      const mompitzImageIndex =
        i % PairMatchingApp.imagesFormompitzCells.length;
      this.gridItems.push({
        cellIndex: mompitzImageIndex,
        cellType: 'mompitz',
        wrongDrops: [],
      });
    }
  }

  private addNewCells() {
    if (this.currentNumberOfPairs > this.maxNumberOfPairs / 2) return;

    const nmbrPairsToAdd = this.maxNumberOfPairs - this.currentNumberOfPairs;

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
              top: randomIntFromRange(0, 40),
              left: randomIntFromRange(0, 40),
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
        if (gridItem.cellType === 'mompitz') {
          const cellNmbrAndType = addedCellNmbrsAndTypes.pop();
          if (cellNmbrAndType !== undefined) {
            gridItem.cellType = cellNmbrAndType.type;
            gridItem.cellIndex = cellNmbrAndType.nmbr;
            gridItem.wrongDrops = [];
          }
        }
      });
    });
  }

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
        .gridElement {
          border: 1px purple solid;
        }

        draggable-target-slotted {
          width: 50%;
          height: 50%;
          max-width: 50%;
          max-height: 50%;
          display: block;
          position: relative;
        }
        img {
          width: 50%;
          height: 50%;
          top: 25%;
          left: 25%;
          position: relative;
          display: block;
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

  serializeGridId(gridIndex: number) {
    return `grid-${gridIndex}`;
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
      if (gridItem.cellType !== 'mompitz') {
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
    this.updateWrongDrops();
  }

  private updateWrongDrops() {
    this.gridItems.forEach((gridItem, index) => {
      if (gridItem.wrongDrops.length !== 0) {
        for (const wrongTarget of gridItem.wrongDrops) {
          this.getCellElement(index).markAsWrongDrop(wrongTarget);
        }
      }
    });
  }

  private handleDropped(evt: DropEvent): void {
    if (evt.dropType === 'dropWrong') return;

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
        console.error('An mompitz grid element should not be draggable');
      }
    }

    // Given the code above, we now for sure there will be a draggable and a target in cellInfo
    const equal = cellInfo.draggable!.equal(cellInfo.target!);

    if (equal) {
      this.numberOk += 1;

      this.gridItems = create(this.gridItems, draft => {
        for (const dragElemenType of dragElementTypes) {
          draft[involvedGridIndexes[dragElemenType]].cellType = 'mompitz';
          draft[involvedGridIndexes[dragElemenType]].cellIndex =
            this.nextImageFormompitzCellIndex;
          draft[involvedGridIndexes[dragElemenType]].wrongDrops = [];
          this.nextImageFormompitzCellIndex =
            (this.nextImageFormompitzCellIndex + 1) %
            PairMatchingApp.imagesFormompitzCells.length;
        }
      });

      this.currentNumberOfPairs -= 1;
      this.targetUpdateRequired = true;

      this.addNewCells();
    } else {
      // not equal
      this.numberNok += 1;

      this.gridItems[involvedGridIndexes.draggable].wrongDrops.push(
        involvedElements.target,
      );

      this.updateWrongDrops();
    }
  }

  private renderGridElement(gridIndex: number) {
    const { cellIndex, cellType } = this.gridItems[gridIndex];
    if (cellType === 'mompitz')
      return html`<div class="gridElement">
      <img alt="Mompitz figure" src="${PairMatchingApp.imagesFormompitzCells[cellIndex]}"></img>
    </div>`;

    const cell = this.cells[cellType][cellIndex];

    return html` <div class="gridElement">
      <draggable-target-slotted
        id=${this.serializeGridId(gridIndex)}
        .gridIndex="${gridIndex}"
        @dropped="${this.handleDropped}"
        resetDragAfterDrop
        style="top: ${cell.basicInfo.top}%; left: ${cell.basicInfo.left}%;"
      >
        ${this.renderPairElement(cell.detailedInfo)}
      </draggable-target-slotted>
    </div>`;
  }

  /** Render the game content */
  renderGameContent(): HTMLTemplateResult {
    const cellElements: HTMLTemplateResult[] = [];

    this.gridItems.forEach((gridItem, index) => {
      cellElements.push(this.renderGridElement(index));
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
