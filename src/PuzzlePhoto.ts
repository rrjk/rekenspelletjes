import { LitElement, html, css, svg } from 'lit';
import type {
  HTMLTemplateResult,
  SVGTemplateResult,
  CSSResultArray,
  PropertyValues,
} from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { create } from 'mutative';

import { UnexpectedValueError } from './UnexpectedValueError';
import { randomFromSet, randomFromSetAndSplice } from './Randomizer';

interface PuzzlePieceInfo {
  x: number;
  y: number;
  pieceType: PieceType;
  topEdge: HorizontalEdge;
  rightEdge: VerticalEdge;
  bottomEdge: HorizontalEdge;
  leftEdge: VerticalEdge;
}

const horizontalBlobEdges = ['bottomBlob', 'topBlob'] as const;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const horizontalStraightEdges = ['straight'] as const;
type HorizontalEdge =
  | (typeof horizontalBlobEdges)[number]
  | (typeof horizontalStraightEdges)[number];

const verticalBlobEdges = ['leftBlob', 'rightBlob'] as const;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const verticalStraightEdges = ['straight'] as const;
type VerticalEdge =
  | (typeof verticalBlobEdges)[number]
  | (typeof verticalStraightEdges)[number];
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const pieceTypes = ['outline', 'filled'] as const;

type PieceType = (typeof pieceTypes)[number];

const numberColumns = 4;
const numberRows = 4;
const pieceWidth = 75;
const pieceHeight = 50;

@customElement('puzzle-photo')
export class PuzzlePhoto extends LitElement {
  static numberColumns = 4;
  static numberRows = 4;
  static pieceWidth = 75;
  static pieceHeight = 50;

  @state()
  accessor puzzlePieceInfo: PuzzlePieceInfo[] = [];

  @property({ type: Number })
  accessor numberVisiblePieces = 0;

  get numberPieces() {
    return PuzzlePhoto.numberColumns * PuzzlePhoto.numberRows;
  }

  initializePuzzlePieceInfo() {
    this.puzzlePieceInfo = [];
    for (let row = 0; row < numberRows; row++) {
      for (let column = 0; column < numberColumns; column++) {
        const puzzlePiece: PuzzlePieceInfo = {
          bottomEdge: 'straight',
          topEdge: 'straight',
          leftEdge: 'straight',
          rightEdge: 'straight',
          pieceType: 'outline',
          x: 0,
          y: 0,
        };
        this.puzzlePieceInfo.push(puzzlePiece);
      }
    }
    console.log(`initializePuzzlePieceInfo`);
    console.log(JSON.stringify(this.puzzlePieceInfo));
  }

  constructor() {
    super();
    this.initializePuzzlePieceInfo();
    this.randomizePuzzlePieceInfo();
    this.updateNumberVisiblePieces();
  }

  protected willUpdate(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has('numberVisiblePieces'))
      this.updateNumberVisiblePieces();
  }

  renderPuzzlePiece(puzzlePiece: PuzzlePieceInfo): SVGTemplateResult {
    const topSegment = this.determineHorizontalEdge(puzzlePiece.topEdge);
    const rightSegment = this.determineVerticalEdge(puzzlePiece.rightEdge);
    const bottomSegment = this.determineHorizontalEdge(puzzlePiece.bottomEdge);
    const leftSegment = this.determineVerticalEdge(puzzlePiece.leftEdge);

    if (
      puzzlePiece.pieceType !== 'filled' &&
      puzzlePiece.pieceType !== 'outline'
    )
      throw new UnexpectedValueError(puzzlePiece.pieceType);

    return svg`<path class="${puzzlePiece.pieceType}" d="
      M${puzzlePiece.x * pieceWidth},${puzzlePiece.y * pieceHeight}      
      ${leftSegment}      
      ${bottomSegment}
      M${puzzlePiece.x * pieceWidth},${puzzlePiece.y * pieceHeight} 
      ${topSegment}
      ${rightSegment}
      "></path>
    `;
  }

  determineVerticalEdge(edgeType: VerticalEdge): string {
    switch (edgeType) {
      case 'leftBlob':
        return this.pathSegmentLeftBlob();
      case 'rightBlob':
        return this.pathSegmentRightBlob();
      case 'straight':
        return this.pathSegmentStraightVertical();
      default:
        throw new UnexpectedValueError(edgeType);
    }
  }

  determineHorizontalEdge(edgeType: HorizontalEdge): string {
    switch (edgeType) {
      case 'bottomBlob':
        return this.pathSegmentBottomBlob();
      case 'topBlob':
        return this.pathSegmentTopBlob();
      case 'straight':
        return this.pathSegmentStraightHorizontal();
      default:
        throw new UnexpectedValueError(edgeType);
    }
  }

  updateNumberVisiblePieces() {
    let cappedNumberVisiblePieces = this.numberVisiblePieces;
    if (cappedNumberVisiblePieces < 0) cappedNumberVisiblePieces = 0;
    if (cappedNumberVisiblePieces > numberColumns * numberRows)
      cappedNumberVisiblePieces = numberColumns * numberRows;

    if (cappedNumberVisiblePieces === 0) {
      this.randomizePuzzlePieceInfo();
    } else {
      this.puzzlePieceInfo = create(this.puzzlePieceInfo, draft => {
        const visiblePieces = [...draft.filter(e => e.pieceType === 'outline')];
        const hiddenPieces = [...draft.filter(e => e.pieceType === 'filled')];
        const delta = cappedNumberVisiblePieces - visiblePieces.length;
        if (delta > 0) {
          for (let i = 0; i < delta; i++) {
            randomFromSetAndSplice(hiddenPieces).pieceType = 'outline';
          }
        } else {
          for (let i = 0; i < -delta; i++) {
            randomFromSetAndSplice(visiblePieces).pieceType = 'filled';
          }
        }
      });
    }
  }

  locationToIndex(x: number, y: number) {
    if (x < 0 || !Number.isInteger(x) || y < 0 || !Number.isInteger(y))
      throw new RangeError(`x(${x}) and y(${y}) need to be positive integers`);
    return y * numberColumns + x;
  }

  randomizePuzzlePieceInfo() {
    for (let row = 0; row < numberRows; row++) {
      for (let column = 0; column < numberColumns; column++) {
        this.puzzlePieceInfo[this.locationToIndex(column, row)].y = row;
        this.puzzlePieceInfo[this.locationToIndex(column, row)].x = column;

        if (row === 0)
          this.puzzlePieceInfo[this.locationToIndex(column, row)].topEdge =
            'straight';
        else
          this.puzzlePieceInfo[this.locationToIndex(column, row)].topEdge =
            this.puzzlePieceInfo[
              this.locationToIndex(column, row - 1)
            ].bottomEdge;

        if (row === numberRows - 1)
          this.puzzlePieceInfo[this.locationToIndex(column, row)].bottomEdge =
            'straight';
        else
          this.puzzlePieceInfo[this.locationToIndex(column, row)].bottomEdge =
            randomFromSet(horizontalBlobEdges);

        if (column === 0)
          this.puzzlePieceInfo[this.locationToIndex(column, row)].leftEdge =
            'straight';
        else
          this.puzzlePieceInfo[this.locationToIndex(column, row)].leftEdge =
            this.puzzlePieceInfo[
              this.locationToIndex(column - 1, row)
            ].rightEdge;

        if (column === numberColumns - 1)
          this.puzzlePieceInfo[this.locationToIndex(column, row)].rightEdge =
            'straight';
        else
          this.puzzlePieceInfo[this.locationToIndex(column, row)].rightEdge =
            randomFromSet(verticalBlobEdges);

        this.puzzlePieceInfo[row + numberColumns * column].pieceType = 'filled';
      }
    }
  }

  pathSegmentStraightHorizontal(): string {
    return `l75,0`;
  }

  pathSegmentStraightVertical(): string {
    return `l0,50`;
  }

  pathSegmentTopBlob(): string {
    return `
      c15,-0.65 33.96,3.53 29.34,-6.47 
      c-4.62,-10 25.38,-10 15,0 
      c-10.38, 10 15.66,8.43 30.66, 6.47
    `;
  }

  pathSegmentLeftBlob(): string {
    return `
      c0.62,10 9.11,26.72 -5.89,19.77
      c-15,-6.96 -15,13.04 0,10
      c15,-3.05 3.93,10.23 5.89,20.23
    `;
  }

  pathSegmentRightBlob(): string {
    return `
      c-0.17,10 -7.92,26.02 7.08,19.68
      c15,-6.35 15,13.65 0,10
      c-15,-3.66 -4.72,10.32 -7.08,20.32
    `;
  }

  pathSegmentBottomBlob(): string {
    return `
      c15,1.51 42.09,-6.25 32.19,3.75
      c-9.9,10 20.1,10 15,0
      c-5.1,-10 12.81,-4.04 27.81,-3.75
    `;
  }

  static get styles(): CSSResultArray {
    return [
      css`
        path.filled {
          fill: white;
          stroke: white;
          stroke-width: 1;
        }
        path.outline {
          fill: none;
          stroke: black;
          stroke-width: 1;
        }
      `,
    ];
  }

  render(): HTMLTemplateResult {
    const renderedPuzzlePieces: Record<PieceType, SVGTemplateResult[]> = {
      filled: [],
      outline: [],
    };

    if (this.numberPieces > this.numberVisiblePieces) {
      for (const puzzlePiece of this.puzzlePieceInfo) {
        renderedPuzzlePieces[puzzlePiece.pieceType].push(
          svg`${this.renderPuzzlePiece(puzzlePiece)}`,
        );
      }
    }

    return html`<svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.0"
      width="300px"
      height="200px"
      viewBox="0 0 300 200"
    >
      <image
        href="../images/puzzles/trainComic.png"
        x="0"
        y="0"
        width="300"
        height="200"
      />
      ${renderedPuzzlePieces.filled} ${renderedPuzzlePieces.outline}
    </svg>`;
  }
}
