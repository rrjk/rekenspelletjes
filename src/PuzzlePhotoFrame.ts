import { LitElement, html, css } from 'lit';
import type { CSSResultArray } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

// import { create } from 'mutative';

// import { UnexpectedValueError } from './UnexpectedValueError';
import { shuffleArray } from './Randomizer';
import { availablePuzzlePhotos, PuzzlePhoto } from './PuzzlePhoto';

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

  @property({ type: Number })
  accessor numberVisiblePieces = 0;

  @state()
  accessor photosIndexesInOrder: number[] = [];

  constructor() {
    super();
    this.randomizePhotos();
  }

  randomizePhotos(): void {
    this.photosIndexesInOrder = [0, 1, 2, 3, 4];
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
            'mini1  mini2  mini3  mini4'
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
        #mini1 {
          grid-area: mini1;
          background-color: red;
        }
        #mini2 {
          grid-area: mini2;
          background-color: blue;
        }
        #mini3 {
          background-color: green;
          grid-area: mini3;
        }
        #mini4 {
          background-color: yellow;
          grid-area: mini4;
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

  render() {
    return html`
      <img class="miniPhoto" id="mini1" src=${availablePuzzlePhotos[this.photosIndexesInOrder[1]].href}></div>
      <div class="miniPhoto" id="mini2"></div>
      <div class="miniPhoto" id="mini3"></div>
      <div class="miniPhoto" id="mini4"></div>
      <puzzle-photo id="puzzle" .numberVisiblePieces=${this.numberVisiblePieces} .photoIndex=${this.photosIndexesInOrder[0]}></div>
    `;
  }
}
