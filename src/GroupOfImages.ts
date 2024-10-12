import { LitElement, html, css } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, property, state } from 'lit/decorators.js';
import type { ResizeObserverClientInterface } from './ResizeObserver';
import {
  removeResizeObserverClient,
  addResizeObserverClient,
} from './ResizeObserver';

export type ImageEnum = 'box' | 'balloon' | 'star' | 'tractor' | 'strawberry';

type ImageInfo = { name: string; url: URL; aspectRatio: number };

const imageInfo = new Map<ImageEnum, ImageInfo>([
  [
    'box',
    <ImageInfo>{
      name: 'box',
      url: new URL('../images/red-box.png', import.meta.url),
      aspectRatio: 674 / 671,
    },
  ],
  [
    'balloon',
    <ImageInfo>{
      name: 'balloon',
      url: new URL('../images/balloon-blue.png', import.meta.url),
      aspectRatio: 110 / 150,
    },
  ],
  [
    'star',
    <ImageInfo>{
      name: 'star',
      url: new URL('../images/star-green.png', import.meta.url),
      aspectRatio: 213 / 181,
    },
  ],
  [
    'tractor',
    <ImageInfo>{
      name: 'cherries',
      url: new URL('../images/tractor.png', import.meta.url),
      aspectRatio: 250 / 183,
    },
  ],
  [
    'strawberry',
    <ImageInfo>{
      name: 'strawberry',
      url: new URL('../images/strawberry.png', import.meta.url),
      aspectRatio: 227 / 242,
    },
  ],
]);

function getImageInfo(name: ImageEnum) {
  const ret = imageInfo.get(name);
  if (!ret) throw new Error('Non existing image information requested');
  return ret;
}

@customElement('group-of-images')
export class GroupOfImages
  extends LitElement
  implements ResizeObserverClientInterface
{
  @property({ type: String })
  image: ImageEnum = 'box';
  @property({ type: Number })
  numberInGroup = 1;
  @state()
  perRow = 0;
  @state()
  perColumn = 0;
  @state()
  tallWideFlexItem: 'tall' | 'wide' = 'tall';

  static possibleImages: ImageEnum[] = [
    'box',
    'balloon',
    'star',
    'tractor',
    'strawberry',
  ];

  static get styles(): CSSResultGroup {
    return css`
      :host {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        align-content: space-around;
      }

      .flexItem {
        display: flex;
        flex-wrap: wrap;
        width: calc(100% / var(--perRow));
        height: calc(100% / var(--perColumn));
        align-content: center;
        justify-content: center;
        text-align: center;
      }

      img.tall {
        height: auto;
        width: 90%;
        aspect-ratio: var(--aspectRatio);
      }

      img.wide {
        height: 90%;
        width: auto;
        aspect-ratio: var(--aspectRatio);
      }
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();
    addResizeObserverClient(this);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    removeResizeObserverClient(this);
  }

  willUpdate(_changedProperties: Map<string | number | symbol, unknown>): void {
    if (_changedProperties.has('numberInGroup')) {
      this.determineNumberRowsAndColumns();
    }
  }

  handleResize() {
    this.determineNumberRowsAndColumns();
  }

  determineNumberRowsAndColumns() {
    const imageAspectRatio = getImageInfo(this.image).aspectRatio;
    const boxAspectRatio = this.clientWidth / this.clientHeight;

    const ratioPerRowPerColumn = boxAspectRatio / imageAspectRatio;

    const perColumnCeiled = Math.ceil(
      Math.sqrt(this.numberInGroup / ratioPerRowPerColumn),
    );
    const perColumnFloored = Math.floor(
      Math.sqrt(this.numberInGroup / ratioPerRowPerColumn),
    );

    const resultingRatioRowPerColumnCeiled =
      Math.ceil(this.numberInGroup / perColumnCeiled) / perColumnCeiled;
    const resultingRatioRowPerColumnFloored =
      Math.ceil(this.numberInGroup / perColumnFloored) / perColumnFloored;

    if (
      Math.abs(resultingRatioRowPerColumnCeiled - ratioPerRowPerColumn) >
      Math.abs(resultingRatioRowPerColumnFloored - ratioPerRowPerColumn)
    ) {
      this.perColumn = perColumnFloored;
    } else {
      this.perColumn = perColumnCeiled;
    }

    this.perRow = Math.ceil(this.numberInGroup / this.perColumn);

    const flexItemAspectRatio =
      this.clientWidth / this.perRow / (this.clientHeight / this.perColumn);
    if (flexItemAspectRatio > imageAspectRatio) this.tallWideFlexItem = 'wide';
    else this.tallWideFlexItem = 'tall';
  }

  protected render(): HTMLTemplateResult {
    const flexItems: HTMLTemplateResult[] = [];

    /* Some design notes
     * A div is put around the actual image to control the number of items in a row,
     * using flex-basis on the div it's ensured we get the right number of images in a row,
     * in stead of as many as could possibly fit.
     */

    for (let i = 0; i < this.numberInGroup; i++) {
      flexItems.push(
        html`<div class="flexItem">
          <img
            class="${this.tallWideFlexItem}"
            src="${getImageInfo(this.image).url}"
            alt="${getImageInfo(this.image).name}"
          />
        </div>`,
      );
    }

    return html`
      <style>
        :host {
          --perRow: ${this.perRow};
          --perColumn: ${this.perColumn};
          --aspectRatio: ${getImageInfo(this.image).aspectRatio};
        }
      </style>
      ${flexItems}
    `;
  }
}
