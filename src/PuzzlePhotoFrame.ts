import { LitElement, html, css, nothing, unsafeCSS } from 'lit';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
// import { create } from 'mutative';

// import { UnexpectedValueError } from './UnexpectedValueError';
import { shuffleArray } from './Randomizer';
import { PuzzlePhoto } from './PuzzlePhoto';
import { getRange } from './NumberHelperFunctions';

@customElement('puzzle-photo-frame')
export class PuzzlePhotoFrame extends LitElement {
  static numbrSmallPhotos = 16;
  static smallPhotoMultiplicationFactor = 0.75;
  static nmbrSmallPhotoColumns = 8;
  static nmbrSmallPhotoRows = 2;
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

  miniPhotoLocation(smallPhotoIndex: number): number {
    return smallPhotoIndex;
  }

  numberVisibleSmallPhotos(): number {
    if (this.numberVisiblePieces === 0) {
      return 0;
    } else {
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
    this.photosIndexesInOrder = [
      ...getRange(PuzzlePhoto.lowestPhotoIndex, PuzzlePhoto.highestPhotoIndex),
      ...getRange(PuzzlePhoto.lowestPhotoIndex, PuzzlePhoto.highestPhotoIndex),
    ];
    shuffleArray(this.photosIndexesInOrder);
  }

  static get styles(): CSSResultArray {
    const ret: CSSResultArray = [];
    for (const i of getRange(0, 15)) {
      const id = `mini${i}`;
      const gridArea = `mini${i}`;
      ret.push(css`
        #${unsafeCSS(id)} {
          backgound-color: #ffff00;
          grid-area: ${unsafeCSS(gridArea)};
        }
      `);
    }

    ret.push(css`
      :host {
        container-type: size;
        display: grid;
        justify-items: center;
        align-items: center;
      }

      div#frame {
        display: grid;
        grid-template-columns: 100%;
        grid-template-rows: 20% 80%;
        justify-items: center;
        align-items: center;
        grid-template-areas:
          'miniPhotoBox'
          'puzzle';
        aspect-ratio: 6/5;
      }

      @container (aspect-ratio < 6/5) {
        div#frame {
          width: 100%;
        }
      }

      @container (aspect-ratio >= 6/5) {
        div#frame {
          height: 100%;
        }
      }

      #miniPhotoBox {
        width: 100%;
        height: 100%;
        grid-area: miniPhotoBox;
        display: grid;
        grid-template-columns: repeat(8, 1fr);
        grid-template-rows: repeat(2, 1fr);
        justify-items: center;
        align-items: center;
      }

      .miniPhoto {
        width: 80%;
        height: 80%;
      }

      .miniPhotoBox0 {
        grid-template-areas:
          'empty  empty  empty  empty empty  empty empty  empty'
          'empty  empty  empty  empty empty  empty empty  empty';
      }
      .miniPhotoBox1 {
        grid-template-areas:
          'mini0  mini0  empty  empty empty  empty empty  empty'
          'mini0  mini0  empty  empty empty  empty empty  empty';
      }
      .miniPhotoBox2 {
        grid-template-areas:
          'mini1  mini1  mini0  mini0 empty  empty empty  empty'
          'mini1  mini1  mini0  mini0 empty  empty empty  empty';
      }
      .miniPhotoBox3 {
        grid-template-areas:
          'mini2  mini2  mini1  mini1  mini0  mini0 empty  empty'
          'mini2  mini2  mini1  mini1  mini0  mini0 empty  empty';
      }
      .miniPhotoBox4 {
        grid-template-areas:
          'mini3  mini3  mini2  mini2 mini1  mini1 mini0  mini0'
          'mini3  mini3  mini2  mini2 mini1  mini1 mini0  mini0';
      }

      .miniPhotoBox5 {
        grid-template-areas:
          'mini4  mini4  mini3  mini3 mini2  mini2 mini1  empty'
          'mini4  mini4  mini3  mini3 mini2  mini2 mini0  empty';
      }

      .miniPhotoBox6 {
        grid-template-areas:
          'mini5  mini5  mini4  mini4 mini3  mini3 mini2  mini0'
          'mini5  mini5  mini4  mini4 mini3  mini3 mini1  empty';
      }

      .miniPhotoBox7 {
        grid-template-areas:
          'mini6  mini6  mini5  mini5 mini4  mini4 mini3  mini1'
          'mini6  mini6  mini5  mini5 mini4  mini4 mini2  mini0';
      }

      .miniPhotoBox8 {
        grid-template-areas:
          'mini7  mini7  mini6  mini6 mini5  mini3 mini1  empty'
          'mini7  mini7  mini6  mini6 mini4  mini2 mini0  empty';
      }

      .miniPhotoBox9 {
        grid-template-areas:
          'mini8  mini8  mini7  mini7 mini6  mini4 mini2  mini0'
          'mini8  mini8  mini7  mini7 mini5  mini3 mini1  empty';
      }

      .miniPhotoBox10 {
        grid-template-areas:
          'mini9 mini9 mini8  mini8  mini7  mini5 mini3  mini1'
          'mini9 mini9 mini8  mini8  mini6  mini4 mini2  mini0';
      }

      .miniPhotoBox11 {
        grid-template-areas:
          'mini10 mini10 mini9  mini7  mini5  mini3 mini1 empty'
          'mini10 mini10 mini8  mini6  mini4  mini2 mini0 empty';
      }

      .miniPhotoBox12 {
        grid-template-areas:
          'mini11 mini11 mini10  mini8  mini6  mini4 mini2 mini0'
          'mini11 mini11 mini9  mini7  mini5  mini3 mini1 empty';
      }

      .miniPhotoBox13 {
        grid-template-areas:
          'mini12 mini12 mini11  mini9  mini7  mini5 mini3 mini1'
          'mini12 mini12 mini10  mini8  mini6  mini4 mini2 mini0';
      }

      .miniPhotoBox14 {
        grid-template-areas:
          'mini13 mini11 mini9  mini7  mini5 mini3 mini1 empty'
          'mini12 mini10 mini8  mini6  mini4 mini2 mini0 empty';
      }

      .miniPhotoBox15 {
        grid-template-areas:
          'mini14 mini12 mini10 mini8  mini6 mini4 mini2 mini0'
          'mini13 mini11 mini9  mini7  mini5 mini3 mini1 empty';
      }

      .miniPhotoBox16 {
        grid-template-areas:
          'mini15 mini13 mini11 mini9  mini7  mini5 mini3 mini1'
          'mini14 mini12 mini10 mini8  mini6  mini4 mini2 mini0';
      }

      #puzzle {
        width: 100%;
        height: 100%;
        background-color: purple;
        grid-area: puzzle;
      }
    `);
    return ret;
  }

  renderMiniPhoto(miniPhotoIndex: number): HTMLTemplateResult | typeof nothing {
    if (this.miniPhotoVisible(miniPhotoIndex)) {
      return html`
      <img 
        class="miniPhoto" 
        id="mini${miniPhotoIndex}" 
        src=${PuzzlePhoto.getPhotoUrl(this.photosIndexesInOrder[miniPhotoIndex]).href}>
      </img>
    `;
    } else {
      return nothing;
    }
  }

  render(): HTMLTemplateResult {
    const miniPhotos: HTMLTemplateResult[] = [];
    const classes = {
      miniPhotoBox0: this.numberVisibleSmallPhotos() === 0,
      miniPhotoBox1: this.numberVisibleSmallPhotos() === 1,
      miniPhotoBox2: this.numberVisibleSmallPhotos() === 2,
      miniPhotoBox3: this.numberVisibleSmallPhotos() === 3,
      miniPhotoBox4: this.numberVisibleSmallPhotos() === 4,
      miniPhotoBox5: this.numberVisibleSmallPhotos() === 5,
      miniPhotoBox6: this.numberVisibleSmallPhotos() === 6,
      miniPhotoBox7: this.numberVisibleSmallPhotos() === 7,
      miniPhotoBox8: this.numberVisibleSmallPhotos() === 8,
      miniPhotoBox9: this.numberVisibleSmallPhotos() === 9,
      miniPhotoBox10: this.numberVisibleSmallPhotos() === 10,
      miniPhotoBox11: this.numberVisibleSmallPhotos() === 11,
      miniPhotoBox12: this.numberVisibleSmallPhotos() === 12,
      miniPhotoBox13: this.numberVisibleSmallPhotos() === 13,
      miniPhotoBox14: this.numberVisibleSmallPhotos() === 14,
      miniPhotoBox15: this.numberVisibleSmallPhotos() === 15,
      miniPhotoBox16: this.numberVisibleSmallPhotos() === 16,
    };

    for (const i of getRange(0, this.numberVisibleSmallPhotos() - 1))
      miniPhotos.push(html`${this.renderMiniPhoto(i)}`);

    return html`
      <div id="frame">
        <div class=${classMap(classes)} id="miniPhotoBox">${miniPhotos}</div>
        <puzzle-photo
          id="puzzle"
          .numberVisiblePieces=${this.numberVisiblePiecesPuzzle()}
          .photoIndex=${this.photosIndexesInOrder[
            this.numberVisibleSmallPhotos()
          ]}
        ></puzzle-photo>
      </div>
    `;
  }
}
