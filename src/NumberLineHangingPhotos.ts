import { LitElement, html, css, svg } from 'lit';
import type {
  PropertyDeclarations,
  CSSResultGroup,
  PropertyValues,
  SVGTemplateResult,
  HTMLTemplateResult,
} from 'lit';

import './NumberLine';

/* import "./FramedPhoto" */
import { FramedPhoto } from './FramedPhoto';
import type { PhotoId } from './FramedPhoto';

import { randomIntFromRange } from './Randomizer';

type verticalDistanceEnum = 'low' | 'high';
interface verticalDisctanceInfoType {
  lineHeight: number;
  viewBoxHeight: number;
}

export class NumberLineHangingPhotos extends LitElement {
  show1TickMarks: boolean;
  show5TickMarks: boolean;
  show10TickMarks: boolean;

  minimum: number;
  maximum: number;

  margin: number;
  lineWidth: number;

  photoPositions: number[];
  disabledPositions: number[];
  photoMetaData: {
    position: number;
    verticalDistance: verticalDistanceEnum;
    photoId: PhotoId;
  }[];
  showAll10Numbers: boolean;

  static get properties(): PropertyDeclarations {
    return {
      show10TickMarks: { type: Boolean },
      show5TickMarks: { type: Boolean },
      show1TickMarks: { type: Boolean },
      showAll10Numbers: { type: Boolean },
      minimum: { type: Number },
      maximum: { type: Number },
      photoPositions: { type: Array },
      disabledPositions: { type: Array },
    };
  }

  static get styles(): CSSResultGroup {
    return css``;
  }

  constructor() {
    super();
    this.minimum = 0;
    this.maximum = 100;

    this.margin = 15;
    this.lineWidth = 1000;

    this.show1TickMarks = false;
    this.show5TickMarks = false;
    this.show10TickMarks = true;

    this.showAll10Numbers = false;

    this.photoPositions = [12, 18, 3, 2, 56, 38];
    this.disabledPositions = [];
    this.calcPhotoMetaData();
  }

  minDistance(): number {
    return ((this.maximum - this.minimum) / 95) * 4;
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

  connectedCallback(): void {
    super.connectedCallback();
    this.calcPhotoMetaData();
  }

  // This is a bit cheating, as this function is not meant to update derived properties.
  // The new Lit has willUpdate for that, but I don't have Lit, which includes lit-element v3, yet Hence I'm using lit-element v2.4.0.
  shouldUpdate(changedProperties: PropertyValues): boolean {
    if (changedProperties.has('photoPositions')) {
      this.calcPhotoMetaData();
    }
    return true;
  }

  calcPhotoMetaData(): void {
    let possiblePhotoIds: PhotoId[] = ['Frank', 'Anne', 'Johannes', 'Jan'];
    this.photoMetaData = [];
    this.photoPositions.sort((a, b) => a - b);
    this.photoPositions.forEach((position, index) => {
      const photo = randomIntFromRange(0, possiblePhotoIds.length - 1);
      if (index === 0) {
        this.photoMetaData.push({
          position,
          verticalDistance: 'low',
          photoId: possiblePhotoIds[photo],
        });
      } else if (
        position - this.photoPositions[index - 1] >
        this.minDistance()
      ) {
        this.photoMetaData.push({
          position,
          verticalDistance: 'low',
          photoId: possiblePhotoIds[photo],
        });
      } else if (this.photoMetaData[index - 1].verticalDistance === 'low') {
        this.photoMetaData.push({
          position,
          verticalDistance: 'high',
          photoId: possiblePhotoIds[photo],
        });
      } else {
        this.photoMetaData.push({
          position,
          verticalDistance: 'low',
          photoId: possiblePhotoIds[photo],
        });
      }

      possiblePhotoIds.splice(photo, 1);
      /** If we have more than 4 photos, we'll run out of photos. Here we add new photos whenever the set of
       * possible photos becomes empty. This way we also ensure that the photos are randomized in groups and we won't get all
       * equal photos at one side and other equal photos at the other side.
       */
      if (possiblePhotoIds.length === 0)
        possiblePhotoIds = ['Frank', 'Anne', 'Johannes', 'Jan'];
    });
  }

  /** Translate a position on the numberline in number units into a position inside this NumberLineHangingPhotos element in vw units */
  translatePosition(position: number): number {
    const relativePositionInNumberLineUnits =
      (position - this.minimum) / (this.maximum - this.minimum);
    const positionInSvgUnits =
      relativePositionInNumberLineUnits * this.lineWidth + this.margin - 1; // 1 substracted as we have lines of 2 wide.
    const relativePositionInSvgUnits =
      positionInSvgUnits / (this.lineWidth + 2 * this.margin);
    const positionInVwUnits =
      relativePositionInSvgUnits * 0.95 * this.width + 0.025 * this.width;
    return positionInVwUnits;
  }

  handlePhotoClicked(position: number): void {
    if (!this.disabledPositions.some(value => value === position)) {
      const event = new CustomEvent('photo-clicked', { detail: { position } });
      this.dispatchEvent(event);
    }
  }

  translateVerticalDistance(
    verticalDistance: verticalDistanceEnum
  ): verticalDisctanceInfoType {
    const verticalDistanceInfo: verticalDisctanceInfoType = {
      lineHeight: 0,
      viewBoxHeight: 0,
    };
    if (verticalDistance === 'low') {
      verticalDistanceInfo.lineHeight = this.width * 0.08;
      verticalDistanceInfo.viewBoxHeight = (0.08 / 0.05) * 51;
    } else {
      verticalDistanceInfo.lineHeight = this.width * 0.03;
      verticalDistanceInfo.viewBoxHeight = (0.03 / 0.05) * 51;
    }
    return verticalDistanceInfo;
  }

  renderLine(
    position: number,
    verticalDistance: verticalDistanceEnum,
    lineColor: string
  ): SVGTemplateResult {
    return svg`
            <svg style="position:absolute; 
                        width: ${this.width * 0.05}vw; 
                        height: ${
                          this.translateVerticalDistance(verticalDistance)
                            .lineHeight
                        }vw; 
                        left: ${this.translatePosition(position)}vw; 
                        top: 0;" 
                viewBox="0 0 51 ${
                  this.translateVerticalDistance(verticalDistance).viewBoxHeight
                }">
                <line
                x1 = "1"
                x2 = "1"
                y1 = "0"
                y2 = "${
                  this.translateVerticalDistance(verticalDistance).viewBoxHeight
                }"
                style="stroke: ${lineColor}; stroke-width: 2"
                />
            </svg>
        `;
  }

  renderFramedPhoto(
    position: number,
    verticalDistance: verticalDistanceEnum,
    photoId: PhotoId
  ): HTMLTemplateResult {
    return html`
      <framed-photo
        style="position: absolute; 
                                         width: ${this.width * 0.04}vw; 
                                         height: ${this.width * 0.04}vw; 
                                         left:${this.translatePosition(
          position
        ) -
        this.width * 0.02}vw; 
                                         top: ${this.translateVerticalDistance(
          verticalDistance
        ).lineHeight}vw;"
        photoId="${photoId}"
        ?disabled="${this.disabledPositions.some(value => value === position)}"
        @click="${() => {
          this.handlePhotoClicked(position);
        }}"
      >
      </framed-photo>
    `;
  }

  /** Render the number line
   * @return template for the number line.
   */
  render(): HTMLTemplateResult {
    return html`
      <number-line
        ?showAll10Numbers=${this.showAll10Numbers}
        ?show10TickMarks=${this.show10TickMarks}
        ?show5TickMarks=${this.show5TickMarks}
        ?show1TickMarks=${this.show1TickMarks}
        minimum=${this.minimum}
        maximum=${this.maximum}
        style="position:absolute; left: ${0.025 *
        this.width}vw; top: 0; width:${0.95 * this.width}vw;"
      ></number-line>
      ${this.photoMetaData.map(metaData =>
        this.renderLine(
          metaData.position,
          metaData.verticalDistance,
          FramedPhoto.getFrameColor(metaData.photoId)
        )
      )}
      ${this.photoMetaData.map(metaData =>
        this.renderFramedPhoto(
          metaData.position,
          metaData.verticalDistance,
          metaData.photoId
        )
      )}
    `;
  }
}

customElements.define('number-line-hanging-photos', NumberLineHangingPhotos);
