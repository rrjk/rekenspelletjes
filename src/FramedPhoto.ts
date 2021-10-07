/* eslint-disable class-methods-use-this */
import { LitElement, html } from 'lit';
import type { PropertyDeclarations, TemplateResult } from 'lit';

interface PhotoMetaData {
  fileName: string;
  width: number;
  height: number;
  color: string;
}
export type PhotoId = 'Jan' | 'Anne' | 'Johannes' | 'Frank' | 'Disabled';

const photos: { [key: string]: PhotoMetaData } = {
  Anne: {
    fileName: 'Mompitz Anne.png',
    width: 434,
    height: 449,
    color: '#97cdb4',
  },
  Jan: {
    fileName: 'Mompitz Jan.png',
    width: 1183,
    height: 1133,
    color: '#f6d435',
  },
  Johannes: {
    fileName: 'Mompitz Johannes.png',
    width: 469,
    height: 556,
    color: '#f2444e',
  },
  Frank: {
    fileName: 'Mompitz Frank.png',
    width: 584,
    height: 579,
    color: '#9c6ccf',
  },
  Disabled: {
    fileName: 'cross-out-black.png',
    width: 980,
    height: 900,
    color: '#000000',
  },
};

export class FramedPhoto extends LitElement {
  photoId: PhotoId;
  label: number;
  disabled: boolean;

  static get properties(): PropertyDeclarations {
    return {
      photoId: { type: String },
      label: { type: Number },
      disabled: { type: Boolean },
    };
  }

  static getFrameColor(photo: PhotoId): string {
    return photos[photo].color;
  }

  /** Construct a hanging photo
   */
  constructor() {
    super();
    this.photoId = 'Frank';
    this.label = 10;
    this.disabled = false;
  }

  get photoInfo(): PhotoMetaData {
    if (!this.disabled) {
      return photos[this.photoId];
    }
    // eslint-disable-next-line dot-notation
    return photos['Disabled'];
  }

  /* Determine the width of the custom-element. expressed in vw units.
   * By using vw units, the dimensions that are based on the width of
   * the custom-element nicely scale when the window size is changed.
   */
  get width(): number {
    const widthInPixels = this.getBoundingClientRect().width;
    const viewPortWidthInPixels = window.innerWidth;
    const widthInVw = (widthInPixels / viewPortWidthInPixels) * 100;
    return widthInVw;
  }

  /** Render the photoframe
   * @return Template for the photoframe, including attaching line.
   */
  render(): TemplateResult {
    let photoWidth = 0;
    let photoHeight = 0;
    if (this.photoInfo.width <= this.photoInfo.height) {
      photoWidth = (this.photoInfo.width / this.photoInfo.height) * 38;
      photoHeight = 38;
    } else {
      photoWidth = 38;
      photoHeight = (this.photoInfo.height / this.photoInfo.width) * 38;
    }

    return html`
      <div>
        <svg
          style="position:absolute; width: 100%; height: 1px; padding-bottom: calc(100% - 1px); overflow: visible;"
          viewBox="0 0 44 44"
          preserveAspectRatio="xMidYMin slice"
        >
          <g>
            <rect
              x="1"
              y="1"
              width="42"
              height="42"
              fill="none"
              style="fill: white; stroke: ${this.photoInfo
                .color}; stroke-width: 2"
            />
            <image
              alt="Anne"
              x="${(42 - photoWidth) / 2 + 1}"
              y="${(42 - photoHeight) / 2 + 1}"
              width="${photoWidth}"
              height="${photoHeight}"
              href="images/${this.photoInfo.fileName}"
            />
          </g>
        </svg>
      </div>
    `;
  }
}

customElements.define('framed-photo', FramedPhoto);
