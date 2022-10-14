import { LitElement, html, css, svg } from 'lit';
import type {
  HTMLTemplateResult,
  CSSResultGroup,
  SVGTemplateResult,
} from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, property } from 'lit/decorators.js';

type segmentLocation = 'lt' | 'lb' | 'rt' | 'rb' | 'top' | 'middle' | 'bottom';
type svgLinePositions = 'x1' | 'x2' | 'y1' | 'y2';
type segmentXYOffsetsType = {
  [location in segmentLocation]: { [positions in svgLinePositions]: number };
};
type digitsToSegments = { [location in segmentLocation]: boolean }[];

@customElement('digital-clock')
export class DigitalClock extends LitElement {
  @property({ type: Number })
  hours = 0;
  @property({ type: Number })
  minutes = 0;

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

  /** Table translating digits (position within list) into what segments shoudl be lit. */
  static digitToSegments: digitsToSegments = [
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
  ];

  /** Table providing the x position within the viewport per digit location */
  static positionToBasePosition = [
    { x: 25 },
    { x: 65 },
    { x: 125 },
    { x: 165 },
  ];

  static get styles(): CSSResultGroup {
    return css`
      line.segment {
        stroke: blue;
        stroke-width: 5;
        stroke-linecap: round;
      }
    `;
  }

  renderSegment(segment: segmentLocation, baseX: number): SVGTemplateResult {
    return svg`<line
      class="segment"
      x1="${baseX + DigitalClock.segmentXYOffsets[segment].x1}"
      x2="${baseX + DigitalClock.segmentXYOffsets[segment].x2}"
      y1="${DigitalClock.segmentXYOffsets[segment].y1}"
      y2="${DigitalClock.segmentXYOffsets[segment].y2}"
    ></line>`;
  }

  renderDigit(digit: number, position: number): SVGTemplateResult {
    const basePos = DigitalClock.positionToBasePosition[position].x;
    const segments: SVGTemplateResult[] = [];

    if (DigitalClock.digitToSegments[digit].lt)
      segments.push(this.renderSegment('lt', basePos));
    if (DigitalClock.digitToSegments[digit].lb)
      segments.push(this.renderSegment('lb', basePos));
    if (DigitalClock.digitToSegments[digit].rt)
      segments.push(this.renderSegment('rt', basePos));
    if (DigitalClock.digitToSegments[digit].rb)
      segments.push(this.renderSegment('rb', basePos));
    if (DigitalClock.digitToSegments[digit].top)
      segments.push(this.renderSegment('top', basePos));
    if (DigitalClock.digitToSegments[digit].middle)
      segments.push(this.renderSegment('middle', basePos));
    if (DigitalClock.digitToSegments[digit].bottom)
      segments.push(this.renderSegment('bottom', basePos));

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
      <svg viewBox="0 0 220 100" style="width: 100%">
        <rect
          stroke="black"
          stroke-width="10"
          fill="none"
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
