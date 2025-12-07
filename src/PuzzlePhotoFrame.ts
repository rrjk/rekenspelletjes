import { LitElement, html, css, nothing } from 'lit';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

// import { create } from 'mutative';

// import { UnexpectedValueError } from './UnexpectedValueError';
import { shuffleArray } from './Randomizer';
import { PuzzlePhoto } from './PuzzlePhoto';
import { getRange } from './NumberHelperFunctions';

@customElement('puzzle-photo-frame')
export class PuzzlePhotoFrame extends LitElement {
  static numbrSmallPhotos = 4;
  static smallPhotoMultiplicationFactor = 0.75;
  static nmbrSmallPhotoColumns = 4;
  static nmbrSmallPhotoRows = 1;
  static smallPhotoWidth =
    PuzzlePhoto.pieceWidth * PuzzlePhotoFrame.smallPhotoMultiplicationFactor;
  static smallPhotoHeight =
    PuzzlePhoto.pieceHeight * PuzzlePhotoFrame.smallPhotoMultiplicationFactor;

  static get maxNmbrPieces(): number {
    return (PuzzlePhotoFrame.numbrSmallPhotos + 1) * PuzzlePhoto.numberPieces;
  }

  @property({ type: Number })
  accessor numberVisiblePieces = 0;

  @state()
  accessor photosIndexesInOrder: number[] = [];

  constructor() {
    super();
    this.randomizePhotos();
  }

  miniPhotoVisible(smallPhotoIndex: number): boolean {
    if (smallPhotoIndex < this.numberVisibleSmallPhotos()) return true;
    else return false;
  }

  numberVisibleSmallPhotos(): number {
    console.log(`numberVisiblePieces = ${this.numberVisiblePieces}`);
    if (this.numberVisiblePieces === 0) {
      console.log(`numberVisibleSmallPhotos return 0`);
      return 0;
    } else {
      console.log(
        `numberVisibleSmallPhotos return ${Math.floor(
          (this.numberVisiblePieces - 1) / PuzzlePhoto.numberPieces,
        )}`,
      );
      return Math.floor(
        (this.numberVisiblePieces - 1) / PuzzlePhoto.numberPieces,
      );
    }
  }

  numberVisiblePiecesPuzzle(): number {
    return (
      this.numberVisiblePieces -
      this.numberVisibleSmallPhotos() * PuzzlePhoto.numberPieces
    );
  }

  randomizePhotos(): void {
    this.photosIndexesInOrder = getRange(
      PuzzlePhoto.lowestPhotoIndex,
      PuzzlePhoto.highestPhotoIndex,
    );
    shuffleArray(this.photosIndexesInOrder);
  }

  static get styles(): CSSResultArray {
    return [
      css`
        :host {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-template-rows: repeat(5, 1fr);
          grid-template-areas:
            'mini0  mini1  mini2  mini3'
            'puzzle puzzle puzzle puzzle'
            'puzzle puzzle puzzle puzzle'
            'puzzle puzzle puzzle puzzle'
            'puzzle puzzle puzzle puzzle';
          justify-items: center;
          align-items: center;
          background-color: white;
        }

        .miniPhoto {
          width: 80%;
          height: 80%;
        }
        #mini0 {
          grid-area: mini0;
          background-color: red;
        }
        #mini1 {
          grid-area: mini1;
          background-color: blue;
        }
        #mini2 {
          background-color: green;
          grid-area: mini2;
        }
        #mini3 {
          background-color: yellow;
          grid-area: mini3;
        }
        #puzzle {
          width: 100%;
          height: 100%;
          background-color: purple;
          grid-area: puzzle;
        }
      `,
    ];
  }

  renderMiniPhoto(miniPhotoIndex: number): HTMLTemplateResult | typeof nothing {
    if (this.miniPhotoVisible(miniPhotoIndex)) {
      return html`
      <img 
        class="miniPhoto" 
        id="mini${miniPhotoIndex}" 
        src=${PuzzlePhoto.getPhotoUrl(this.photosIndexesInOrder[miniPhotoIndex + 1]).href}>
      </img>
    `;
    } else {
      return nothing;
    }
  }

  render(): HTMLTemplateResult {
    return html`
      ${this.renderMiniPhoto(0)}
      ${this.renderMiniPhoto(1)}
      ${this.renderMiniPhoto(2)}
      ${this.renderMiniPhoto(3)}
      <puzzle-photo id="puzzle" .numberVisiblePieces=${this.numberVisiblePiecesPuzzle()} .photoIndex=${this.photosIndexesInOrder[0]}></div>
    `;
  }
}
