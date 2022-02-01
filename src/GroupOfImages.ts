import { LitElement, html, css } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, property } from 'lit/decorators.js';

export type ImageEnum = 'box' | 'balloon';

type ImageInfo = { name: string; url: string; aspectRatio: number };

const imageInfo = new Map<ImageEnum, ImageInfo>([
  [
    'box',
    <ImageInfo>{
      name: 'box',
      url: 'images/red-box.png',
      aspectRatio: 674 / 671,
    },
  ],
  [
    'balloon',
    <ImageInfo>{
      name: 'balloon',
      url: 'images/balloon-blue.png',
      aspectRatio: 110 / 150,
    },
  ],
]);

function getImageInfo(name: ImageEnum) {
  const ret = imageInfo.get(name);
  if (!ret) throw new Error('Non existing image information requested');
  return ret;
}

@customElement('group-of-images')
export class GroupOfImages extends LitElement {
  @property({ type: String })
  image: ImageEnum = 'box';
  @property({ type: Number })
  numberInGroup = 1;

  static get styles(): CSSResultGroup {
    return css`
      #group {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        align-content: space-around;
        width: 100%;
        height: 100%;
      }

      .flexItem {
        flex-basis: var(--flexBasis);
        text-align: center;
      }

      img {
        height: var(--imgHeight);
        width: var(--imgWidth);
      }
    `;
  }

  protected render(): HTMLTemplateResult {
    const width = this.clientWidth;
    const height = this.clientHeight;
    const imageAspectRatio = getImageInfo(this.image).aspectRatio;
    const boxAspectRatio = width / height;

    let desiredImageWidth = 'auto';
    let desiredImageHeight = 'auto';

    const ratioPerRowPerColumn = boxAspectRatio / imageAspectRatio;
    const perColumn = Math.ceil(
      Math.sqrt(this.numberInGroup / ratioPerRowPerColumn)
    );
    const perRow = Math.ceil(this.numberInGroup / perColumn);
    if (boxAspectRatio > imageAspectRatio) {
      desiredImageHeight = `${(height / perColumn) * 0.9}px`;
    } else {
      desiredImageWidth = `${(width / perRow) * 0.9}px`;
    }

    console.log(
      `ratioPerRowPerColumn=${ratioPerRowPerColumn}, numberInGroup = ${this.numberInGroup}, perColumn = ${perColumn}, perRow = ${perRow}, desiredWidth = ${desiredImageWidth}, desiredHeight = ${desiredImageHeight}`
    );

    const images: ImageInfo[] = [];
    for (let i = 0; i < this.numberInGroup; i++)
      images.push(getImageInfo(this.image));

    return html`
      <style>
        :host {
          --flexBasis: ${100 / perRow}%;
          --imgWidth: ${desiredImageWidth};
          --imgHeight: ${desiredImageHeight};
        }
      </style>
      <div id="group">
        ${images.map(
          image =>
            html`<div class="flexItem">
              <img src="${image.url}" alt="${image.name}" />
            </div>`
        )}
      </div>
    `;
  }
}
