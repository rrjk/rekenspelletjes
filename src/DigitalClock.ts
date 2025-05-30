import { LitElement, html, css, svg } from 'lit';
import type {
  HTMLTemplateResult,
  CSSResultGroup,
  SVGTemplateResult,
} from 'lit';
import { customElement, property } from 'lit/decorators.js';

/** The names of the 7 segments to create digits */
const segmentNames = [
  'lt',
  'lb',
  'rt',
  'rb',
  'top',
  'middle',
  'bottom',
] as const;
/** A type for the segment names */
type SegmentNamesType = (typeof segmentNames)[number];

/** The names of the coordinates for an SVG line */
// const svgLineCoordinates = ['x1', 'x2', 'y1', 'y2'] as const;
/** A type for the names of the coordinates for an SVG line */
// type SvgLineCoordinatesType = (typeof svgLineCoordinates)[number];

type SvgLineCoordinatesType = 'x1' | 'x2' | 'y1' | 'y2';

/** A type to describe the SVG coordinates for the SVG line making up a segment. */
type segmentXYOffsetsType = Record<
  SegmentNamesType,
  Record<SvgLineCoordinatesType, number>
>;

/** A type for an array that maps a digit that whether the different segments should be shown or not.  */
type DigitsToSegmentsType = Record<SegmentNamesType, boolean>[];

/** Table translating digits (position within list) into what segments should be lit. */
const digitsToSegments: Readonly<DigitsToSegmentsType> = [
  {
    lt: true,
    lb: true,
    rt: true,
    rb: true,
    top: true,
    middle: false,
    bottom: true,
  },
  {
    lt: false,
    lb: false,
    rt: true,
    rb: true,
    top: false,
    middle: false,
    bottom: false,
  },
  {
    lt: false,
    lb: true,
    rt: true,
    rb: false,
    top: true,
    middle: true,
    bottom: true,
  },
  {
    lt: false,
    lb: false,
    rt: true,
    rb: true,
    top: true,
    middle: true,
    bottom: true,
  },
  {
    lt: true,
    lb: false,
    rt: true,
    rb: true,
    top: false,
    middle: true,
    bottom: false,
  },
  {
    lt: true,
    lb: false,
    rt: false,
    rb: true,
    top: true,
    middle: true,
    bottom: true,
  },
  {
    lt: true,
    lb: true,
    rt: false,
    rb: true,
    top: true,
    middle: true,
    bottom: true,
  },
  {
    lt: false,
    lb: false,
    rt: true,
    rb: true,
    top: true,
    middle: false,
    bottom: false,
  },
  {
    lt: true,
    lb: true,
    rt: true,
    rb: true,
    top: true,
    middle: true,
    bottom: true,
  },
  {
    lt: true,
    lb: false,
    rt: true,
    rb: true,
    top: true,
    middle: true,
    bottom: true,
  },
] as const;

/** Table providing the x position within the viewport per digit location */
const positionToBasePosition = [
  { x: 25 },
  { x: 65 },
  { x: 125 },
  { x: 165 },
] as const;

/** Analog clock.
 *  - Takes the height and width of the surrounding block when used as an inline element.
 *  - Takes set width and height when used as an block element.
 */
@customElement('digital-clock')
export class DigitalClock extends LitElement {
  @property({ type: Number })
  accessor hours = 0;
  @property({ type: Number })
  accessor minutes = 0;

  /** Table for the relative positions for the segment svg lines */
  static segmentXYOffsets: segmentXYOffsetsType = {
    lt: { x1: 0, x2: 0, y1: 27.5, y2: 47.5 },
    lb: { x1: 0, x2: 0, y1: 52.5, y2: 72.5 },
    rt: { x1: 25, x2: 25, y1: 27.5, y2: 47.5 },
    rb: { x1: 25, x2: 25, y1: 52.5, y2: 72.5 },
    top: { x1: 4, x2: 21, y1: 25, y2: 25 },
    middle: { x1: 4, x2: 21, y1: 50, y2: 50 },
    bottom: { x1: 4, x2: 21, y1: 75, y2: 75 },
  };

  static get styles(): CSSResultGroup {
    return css`
      line.segment {
        stroke: blue;
        stroke-width: 5;
        stroke-linecap: round;
      }
    `;
  }

  renderSegment(segment: SegmentNamesType, baseX: number): SVGTemplateResult {
    return svg`<line
      class="segment"
      x1="${baseX + DigitalClock.segmentXYOffsets[segment].x1}"
      x2="${baseX + DigitalClock.segmentXYOffsets[segment].x2}"
      y1="${DigitalClock.segmentXYOffsets[segment].y1}"
      y2="${DigitalClock.segmentXYOffsets[segment].y2}"
    ></line>`;
  }

  renderDigit(digit: number, position: number): SVGTemplateResult {
    const basePos = positionToBasePosition[position].x;
    const segments: SVGTemplateResult[] = [];

    for (const segmentName of segmentNames) {
      if (digitsToSegments[digit][segmentName])
        segments.push(this.renderSegment(segmentName, basePos));
    }

    return svg`
      ${segments}
    `;
  }

  renderColon(): SVGTemplateResult {
    return svg`
      <line class="segment" x1="108" x2="108" y1="37" y2="37"></line>
      <line class="segment" x1="108" x2="108" y1="63" y2="63"></line>
    `;
  }

  render(): HTMLTemplateResult {
    const hoursBounded = this.hours < 24 ? this.hours : 0; // We do this just in case an error is made in the usage of the
    const minutesBounded = this.minutes < 60 ? this.minutes : 0;

    const hoursTens = Math.floor(hoursBounded / 10);
    const hoursSingles = hoursBounded % 10;

    const minutesTens = Math.floor(minutesBounded / 10);
    const minutesSingle = minutesBounded % 10;

    return html`
      <svg
        viewBox="0 0 220 100"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
      >
        <rect
          stroke="black"
          stroke-width="10"
          fill="white"
          x="10"
          y="10"
          rx="15"
          width="200"
          height="80"
        ></rect>
        ${hoursTens === 0 ? `` : this.renderDigit(hoursTens, 0)}
        ${this.renderDigit(hoursSingles, 1)} ${this.renderColon()}
        ${this.renderDigit(minutesTens, 2)}
        ${this.renderDigit(minutesSingle, 3)}
      </svg>
    `;
  }
}
