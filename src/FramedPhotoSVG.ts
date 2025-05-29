import { svg } from 'lit';
import type { SVGTemplateResult } from 'lit';

interface PhotoMetaData {
  url: URL;
  width: number;
  height: number;
  color: string;
}

export type PhotoId = 'Jan' | 'Anne' | 'Johannes' | 'Frank' | 'Disabled';

const photos: { [key: string]: PhotoMetaData } = {
  Anne: {
    url: new URL('../images/Mompitz Anne.png', import.meta.url),
    width: 434,
    height: 449,
    color: '#97cdb4',
  },
  Jan: {
    url: new URL('../images/Mompitz Jan-500.png', import.meta.url),
    width: 500,
    height: 479,
    color: '#f6d435',
  },
  Johannes: {
    url: new URL('../images/Mompitz Johannes.png', import.meta.url),
    width: 469,
    height: 556,
    color: '#f2444e',
  },
  Frank: {
    url: new URL('../images/Mompitz Frank.png', import.meta.url),
    width: 584,
    height: 579,
    color: '#9c6ccf',
  },
  Disabled: {
    url: new URL('../images/cross-out-black-500.png', import.meta.url),
    width: 500,
    height: 459,
    color: '#000000',
  },
};

export class FramedPhotoSVG {
  photoId: PhotoId;
  photoSize = 38;
  x = 1;
  y = 1;
  disabled: boolean;

  static getFrameColor(photoId: PhotoId): string {
    return photos[photoId].color;
  }

  /** Construct a hanging photo
   */
  constructor() {
    this.photoId = 'Frank';
    this.disabled = false;
  }

  get photoInfo(): PhotoMetaData {
    if (!this.disabled) {
      return photos[this.photoId];
    }
    // eslint-disable-next-line dot-notation
    return photos['Disabled'];
  }

  /** Render the photoframe
   * @return Template for the photoframe, including attaching line.
   */
  render(): SVGTemplateResult {
    let photoWidth = 0;
    let photoHeight = 0;
    if (this.photoInfo.width <= this.photoInfo.height) {
      photoWidth =
        (this.photoInfo.width / this.photoInfo.height) * this.photoSize;
      photoHeight = this.photoSize;
    } else {
      photoWidth = this.photoSize;
      photoHeight =
        (this.photoInfo.height / this.photoInfo.width) * this.photoSize;
    }

    return svg`
          <g>
            <rect
              x="${this.x}"
              y="${this.y}"
              width="${this.photoSize + 4}"
              height="${this.photoSize + 4}"
              fill="none"
              style="fill: white; stroke: ${
                this.photoInfo.color
              }; stroke-width: 2"
            />
            <image
              alt="Anne"
              x="${(this.photoSize + 4 - photoWidth) / 2 + this.x}"
              y="${(this.photoSize + 4 - photoHeight) / 2 + this.y}"
              width="${photoWidth}"
              height="${photoHeight}"
              href="${this.photoInfo.url}"
            />
          </g>
    `;
  }
}
