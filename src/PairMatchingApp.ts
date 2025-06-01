import { html, css } from 'lit';

import { state } from 'lit/decorators.js';

import { range } from 'lit/directives/range.js';
import { classMap } from 'lit/directives/class-map.js';

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

type GridCellType = CellType | 'mompitz' | 'empty';
// const gridCellTypes: GridCellType[] = ['answer', 'mompitz', 'exercise'];

type DragElementType = 'draggable' | 'target';
const dragElementTypes: DragElementType[] = ['draggable', 'target'];

interface BasicCellInfo {
  left: number; // Left position within the cell as percentage (5-45%)
  top: number; // Top position within the cell as percentage (5-45%)
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
  smallMompitzIndexes: number[];
  nmbrVisibleMompitz: number;
  animateMomptiz: number;
}

export interface Pair<T> {
  exercise: T;
  answer: T;
}

export abstract class PairMatchingApp<
  CellInfo extends CellInfoInterface,
> extends TimeLimitedGame2 {
  /** Images for the Mompitz grid elements */
  static imagesForMompitzCells: URL[] = [
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

  /** Has the animation for one grid item ended
   * Used to ensure we only fill new cells after both animation have ended
   */
  private firstGridItemAnimationEnded = false;

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

  protected abstract getPair(): Pair<CellInfo>;
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
      this.gridItems.push({
        cellIndex: -1,
        cellType: 'empty',
        wrongDrops: [],
        smallMompitzIndexes: [
          randomIntFromRange(
            0,
            PairMatchingApp.imagesForMompitzCells.length - 1,
          ),
          randomIntFromRange(
            0,
            PairMatchingApp.imagesForMompitzCells.length - 1,
          ),
          randomIntFromRange(
            0,
            PairMatchingApp.imagesForMompitzCells.length - 1,
          ),
        ],
        nmbrVisibleMompitz: 0,
        animateMomptiz: -1,
      });
    }
  }

  private addNewCells() {
    if (this.currentNumberOfPairs > this.maxNumberOfPairs / 2) return;

    const nmbrPairsToAdd = Math.floor(
      this.gridItems.reduce(
        (n, val) => n + (val.cellType === 'empty' ? 1 : 0),
        0,
      ) / 2,
    );

    const toBeAddedPairNmbrs = [
      ...range(this.nextPairNmbr, this.nextPairNmbr + nmbrPairsToAdd),
    ];
    this.nextPairNmbr += nmbrPairsToAdd;
    this.targetUpdateRequired = true;
    this.currentNumberOfPairs += nmbrPairsToAdd;

    const addedCellNmbrsAndTypes: { nmbr: number; type: CellType }[] = [];

    for (const i of toBeAddedPairNmbrs) {
      const pair = this.getPair();
      this.cells = create(this.cells, draft => {
        for (const cellType of cellTypes) {
          draft[cellType].push({
            basicInfo: {
              top: randomIntFromRange(5, 45),
              left: randomIntFromRange(5, 45),
            },
            detailedInfo: castDraft(pair[cellType]),
          });
          addedCellNmbrsAndTypes.push({ nmbr: i, type: cellType });
        }
      });
    }

    shuffleArray(addedCellNmbrsAndTypes);

    this.gridItems = create(this.gridItems, base => {
      for (const gridItem of base) {
        if (gridItem.cellType === 'empty') {
          const cellNmbrAndType = addedCellNmbrsAndTypes.pop();
          if (cellNmbrAndType !== undefined) {
            gridItem.cellType = cellNmbrAndType.type;
            gridItem.cellIndex = cellNmbrAndType.nmbr;
            gridItem.wrongDrops = [];
          }
        }
      }
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
      if (gridItem.cellType !== 'mompitz' && gridItem.cellType !== 'empty') {
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
      draggable: evt.draggableElement as CellElement,
      target: evt.dropTargetElement as CellElement,
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

    // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion -- Given the code above, we now for sure there will be a draggable and a target in cellInfo
    const equal = cellInfo.draggable!.equal(cellInfo.target!);

    if (equal) {
      this.numberOk += 1;

      this.gridItems = create(this.gridItems, draft => {
        for (const dragElemenType of dragElementTypes) {
          draft[involvedGridIndexes[dragElemenType]].cellType = 'empty';
          draft[involvedGridIndexes[dragElemenType]].cellIndex = -1;
          draft[involvedGridIndexes[dragElemenType]].wrongDrops = [];
          draft[involvedGridIndexes[dragElemenType]].nmbrVisibleMompitz += 1;
          draft[involvedGridIndexes[dragElemenType]].animateMomptiz =
            (draft[involvedGridIndexes[dragElemenType]].nmbrVisibleMompitz -
              1) %
            3;
        }
      });

      this.currentNumberOfPairs -= 1;
      this.targetUpdateRequired = true;
    } else {
      // not equal
      this.numberNok += 1;

      this.gridItems[involvedGridIndexes.draggable].wrongDrops.push(
        involvedElements.target,
      );

      this.updateWrongDrops();
    }
  }

  static get styles(): CSSResultArray {
    return [
      ...super.styles,
      css`
        .gridElement {
          display: grid;
          grid-template-rows: 32% 68%;
          grid-template-columns: 100%;
          grid-template-areas:
            'miniMompitzes'
            'content';
          box-sizing: border-box;
        }

        div.miniMompitzes {
          grid-area: miniMompitzes;
          display: flex;
          justify-content: space-around;
          align-items: center;
          flex-wrap: wrap;
        }

        div.content {
          grid-area: content;
          container-type: size;
          container-name: draggable;
        }

        draggable-target-slotted {
          aspect-ratio: 1/1;
          display: block;
          position: relative;
        }

        @container draggable (aspect-ratio <= 1) {
          draggable-target-slotted {
            width: 50%;
          }
        }

        @container draggable (aspect-ratio > 1) {
          draggable-target-slotted {
            height: 50%;
          }
        }

        img.miniMompitz {
          object-fit: contain;
          aspect-ratio: 1;
          height: 80%;
        }

        img.moveShrink0,
        img.moveShrink1,
        img.moveShrink2 {
          animation-duration: 1.5s;
          animation-timing-function: linear;
        }

        img.moveShrink0 {
          animation-name: moveShrink0;
        }

        img.moveShrink1 {
          animation-name: moveShrink1;
        }

        img.moveShrink2 {
          animation-name: moveShrink2;
        }

        .hidden {
          visibility: hidden;
        }

        @keyframes moveShrink0 {
          0% {
            scale: 300%;
            translate: 160% 200%;
            opacity: 0;
          }
          25% {
            scale: 250%;
            translate: 120% 150%;
            opacity: 0.5;
          }
          100% {
            scale: 100%;
            translate: 0 0;
            opacity: 1;
          }
        }

        @keyframes moveShrink1 {
          from {
            scale: 300%;
            translate: 0% 200%;
            opacity: 0;
          }
          25% {
            scale: 250%;
            translate: 0% 150%;
            opacity: 0.5;
          }
          to {
            scale: 100%;
            translate: 0 0;
            opacity: 1;
          }
        }

        @keyframes moveShrink2 {
          from {
            scale: 300%;
            translate: -160% 200%;
            opacity: 0;
          }
          25% {
            scale: 250%;
            translate: -120% 150%;
            opacity: 0.5;
          }
          to {
            scale: 100%;
            translate: 0 0;
            opacity: 1;
          }
        }
      `,
    ];
  }

  private renderMiniMompitz(
    indexes: number[],
    nmbrVisible: number,
    animateMomptiz: number,
    gridIndex: number,
  ): HTMLTemplateResult[] {
    const ret: HTMLTemplateResult[] = [];

    for (let i = 0; i < indexes.length; i++) {
      const imgClass = {
        hidden: i > nmbrVisible - 1,
        moveShrink0: animateMomptiz === i && i === 0,
        moveShrink1: animateMomptiz === i && i === 1,
        moveShrink2: animateMomptiz === i && i === 2,
      };

      ret.push(
        html`<img class="miniMompitz ${classMap(imgClass)}" 
              alt="Mompitz figure" src=${PairMatchingApp.imagesForMompitzCells[indexes[i]]}
              @animationend=${() => this.animationend(gridIndex)}></img>`,
      );
    }
    return ret;
  }

  animationend(gridIndex: number) {
    this.gridItems[gridIndex].animateMomptiz = -1;
    if (this.firstGridItemAnimationEnded === true) {
      this.addNewCells();
      this.firstGridItemAnimationEnded = false;
    } else this.firstGridItemAnimationEnded = true;
  }

  private renderGridElement(gridIndex: number): HTMLTemplateResult {
    const {
      cellIndex,
      cellType,
      smallMompitzIndexes,
      nmbrVisibleMompitz,
      animateMomptiz,
    } = this.gridItems[gridIndex];

    const miniMompitz = html` <div class="miniMompitzes">
      ${this.renderMiniMompitz(
        smallMompitzIndexes,
        nmbrVisibleMompitz,
        animateMomptiz,
        gridIndex,
      )}
    </div>`;

    if (cellType === 'mompitz' || cellType === 'empty')
      return html`<div class="gridElement">
        ${miniMompitz}
        <div class="content"></div>
      </div>`;

    const cell = this.cells[cellType][cellIndex];

    return html` <div class="gridElement">
        ${miniMompitz}
        <div class="content">
          <draggable-target-slotted
            id=${this.serializeGridId(gridIndex)}
            .gridIndex=${gridIndex}
            @dropped=${(evt: DropEvent) => this.handleDropped(evt)}
            resetDragAfterDrop
            style="top: ${cell.basicInfo.top}%; left: ${cell.basicInfo.left}%;"
          >
            ${this.renderPairElement(cell.detailedInfo)}
          </draggable-target-slotted>
        </div>
      </div>
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
          contentAspectRatio="0.8"
          padding="0"
          style="width: 100%; height: 100%; top: 0;"
        >
          ${cellElements}
        </dynamic-grid>
      </button>
    `;
  }
}
