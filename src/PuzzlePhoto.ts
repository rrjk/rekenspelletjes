import { LitElement, html, css } from 'lit';
import type {
  HTMLTemplateResult,
  SVGTemplateResult,
  CSSResultArray,
  PropertyValues,
} from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { create } from 'mutative';

import { randomFromSet, randomFromSetAndSplice } from './Randomizer';
import { directions, pathPuzzlePiece, type PuzzleBlob } from './PuzzlePiece';

interface PuzzlePieceInfo {
  x: number;
  y: number;
  pieceType: PieceType;
  topEdge: PuzzleBlob;
  rightEdge: PuzzleBlob;
  bottomEdge: PuzzleBlob;
  leftEdge: PuzzleBlob;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const pieceTypes = ['outline', 'filled'] as const;
type PieceType = (typeof pieceTypes)[number];

const availablePuzzlePhotos = [
  new URL('../images/puzzles/monstersInForest.jpg', import.meta.url),
  new URL('../images/puzzles/monstersInSwimmingPool.jpg', import.meta.url),
  new URL('../images/puzzles/monstersRailwayCrossing.jpg', import.meta.url),
  new URL('../images/puzzles/monstersSportscarCity.jpg', import.meta.url),
  new URL('../images/puzzles/monstersInPark.jpg', import.meta.url),
  new URL('../images/puzzles/monstersWithElephants.jpg', import.meta.url),
  new URL('../images/puzzles/monstersInPlayground.jpg', import.meta.url),
  new URL('../images/puzzles/monstersHideAndSeek.jpg', import.meta.url),
  new URL('../images/puzzles/monsterAtSchool.jpg', import.meta.url),
  new URL('../images/puzzles/monsterRunningAtATrack.jpg', import.meta.url),
  new URL('../images/puzzles/monsterPlayingBoardGame.jpg', import.meta.url),
  new URL('../images/puzzles/monstersDancing.jpg', import.meta.url),
  new URL('../images/puzzles/monsterRocketLaunch.jpg', import.meta.url),
  new URL('../images/puzzles/monstersRollerCoaster.jpg', import.meta.url),
  new URL('../images/puzzles/monstersChoir.jpg', import.meta.url),
  new URL('../images/puzzles/monstersFootball.jpg', import.meta.url),
  new URL('../images/puzzles/monstersOrchestra.jpg', import.meta.url),
] as const;

@customElement('puzzle-photo')
export class PuzzlePhoto extends LitElement {
  static numberColumns = 4;
  static numberRows = 4;
  static pieceWidth = 75;
  static pieceHeight = 50;

  static get highestPhotoIndex(): number {
    return availablePuzzlePhotos.length - 1;
  }

  static get lowestPhotoIndex(): number {
    return 0;
  }

  static get numberPieces() {
    return PuzzlePhoto.numberColumns * PuzzlePhoto.numberRows;
  }

  static getPhotoUrl(index: number): URL {
    if (index >= 0 && index < availablePuzzlePhotos.length)
      return availablePuzzlePhotos[index];
    else
      throw RangeError(`Photo asked for index ${index} that is out of range`);
  }

  @state()
  accessor puzzlePieceInfo: PuzzlePieceInfo[] = [];

  @property({ type: Number })
  accessor numberVisiblePieces = 0;

  @property({ type: Number })
  accessor photoIndex = 0;

  get photoUrl(): URL {
    if (this.photoIndex > 0 && this.photoIndex < availablePuzzlePhotos.length)
      return availablePuzzlePhotos[this.photoIndex];
    else return availablePuzzlePhotos[0];
  }

  initializePuzzlePieceInfo() {
    this.puzzlePieceInfo = [];
    for (let row = 0; row < PuzzlePhoto.numberRows; row++) {
      for (let column = 0; column < PuzzlePhoto.numberColumns; column++) {
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

  updateNumberVisiblePieces() {
    let cappedNumberVisiblePieces = this.numberVisiblePieces;
    if (cappedNumberVisiblePieces < 0) cappedNumberVisiblePieces = 0;
    if (cappedNumberVisiblePieces > PuzzlePhoto.numberPieces)
      cappedNumberVisiblePieces = PuzzlePhoto.numberPieces;

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
    return y * PuzzlePhoto.numberColumns + x;
  }

  randomizePuzzlePieceInfo() {
    for (let row = 0; row < PuzzlePhoto.numberRows; row++) {
      for (let column = 0; column < PuzzlePhoto.numberColumns; column++) {
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

        if (row === PuzzlePhoto.numberRows - 1)
          this.puzzlePieceInfo[this.locationToIndex(column, row)].bottomEdge =
            'straight';
        else
          this.puzzlePieceInfo[this.locationToIndex(column, row)].bottomEdge =
            randomFromSet(directions);

        if (column === 0)
          this.puzzlePieceInfo[this.locationToIndex(column, row)].leftEdge =
            'straight';
        else
          this.puzzlePieceInfo[this.locationToIndex(column, row)].leftEdge =
            this.puzzlePieceInfo[
              this.locationToIndex(column - 1, row)
            ].rightEdge;

        if (column === PuzzlePhoto.numberColumns - 1)
          this.puzzlePieceInfo[this.locationToIndex(column, row)].rightEdge =
            'straight';
        else
          this.puzzlePieceInfo[this.locationToIndex(column, row)].rightEdge =
            randomFromSet(directions);

        this.puzzlePieceInfo[
          row + PuzzlePhoto.numberColumns * column
        ].pieceType = 'filled';
      }
    }
  }

  static get styles(): CSSResultArray {
    return [
      css`
        path.filled {
          fill: var(--piece-absent-color, white);
          stroke: var(--piece-absent-color, white);
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

    if (PuzzlePhoto.numberPieces > this.numberVisiblePieces) {
      for (const puzzlePiece of this.puzzlePieceInfo) {
        renderedPuzzlePieces[puzzlePiece.pieceType].push(
          pathPuzzlePiece(
            puzzlePiece.x * PuzzlePhoto.pieceWidth,
            puzzlePiece.y * PuzzlePhoto.pieceHeight,
            PuzzlePhoto.pieceWidth,
            PuzzlePhoto.pieceHeight,
            {
              left: puzzlePiece.leftEdge,
              right: puzzlePiece.rightEdge,
              bottom: puzzlePiece.bottomEdge,
              top: puzzlePiece.topEdge,
            },
            puzzlePiece.pieceType,
          ),
        );
      }
    }

    return html`<svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.0"
      viewBox="0 0 300 200"
    >
      <image href=${this.photoUrl.href} x="0" y="0" width="300" height="200" />
      ${renderedPuzzlePieces.filled} ${renderedPuzzlePieces.outline}
    </svg>`;
  }
}
