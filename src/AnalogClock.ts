import { LitElement, html, css, svg } from 'lit';
import type {
  HTMLTemplateResult,
  CSSResultGroup,
  SVGTemplateResult,
} from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, property } from 'lit/decorators.js';

/** Analog clock.
 *   - Takes the height and width of the surrounding block when used as an inline element.
 *   - Takes set width and height when used as an block element.
 */
@customElement('analog-clock')
export class AnalogClock extends LitElement {
  /** Color permutation to use, index into ballColorPermutations */
  @property({ type: Number })
  hours = 0;
  @property({ type: Number })
  minutes = 0;
  @property({ type: Boolean })
  showAllTickMarks = false;
  @property({ type: Boolean })
  showHourTickMarks = false;
  @property({ type: Boolean })
  showQuarterTickMarks = false;
  @property({ type: Boolean })
  showAllNumbers = false;
  @property({ type: Boolean })
  showQuarterNumbers = false;
  @property({ type: Boolean })
  useRomanNumerals = false;

  static get styles(): CSSResultGroup {
    return css``;
  }

  renderHourTickMark(hour: number): SVGTemplateResult {
    return svg`
      <line 
        x1="${125 + 105 * Math.sin(((hour % 12) / 12) * 2 * Math.PI)}"
        x2="${125 + 115 * Math.sin(((hour % 12) / 12) * 2 * Math.PI)}"
        y1="${125 - 105 * Math.cos(((hour % 12) / 12) * 2 * Math.PI)}"
        y2="${125 - 115 * Math.cos(((hour % 12) / 12) * 2 * Math.PI)}"
        stroke="black"
        stroke-width="5"
    ></line>
    `;
  }

  renderMinuteTickMark(minute: number): SVGTemplateResult {
    return svg`
      <line 
        x1="${125 + 110 * Math.sin(((minute % 60) / 60) * 2 * Math.PI)}"
        x2="${125 + 115 * Math.sin(((minute % 60) / 60) * 2 * Math.PI)}"
        y1="${125 - 110 * Math.cos(((minute % 60) / 60) * 2 * Math.PI)}"
        y2="${125 - 115 * Math.cos(((minute % 60) / 60) * 2 * Math.PI)}"
        stroke="black"
        stroke-width="3"
    ></line>
    `;
  }

  renderHourNumber(hour: number): SVGTemplateResult {
    return svg`
    <text
      x="${125 + 90 * Math.sin(((hour % 12) / 12) * 2 * Math.PI)}"
      y="${125 - 90 * Math.cos(((hour % 12) / 12) * 2 * Math.PI)}"
      dominant-baseline="central" text-anchor="middle" font-size="20"
    >
      ${hour}
    </text>
`;
  }

  renderHourRoman(hour: number): SVGTemplateResult {
    const romanNumerals = [
      'XII',
      'I',
      'II',
      'III',
      'IV',
      'V',
      'VI',
      'VII',
      'VIII',
      'IX',
      'X',
      'XI',
    ];
    return svg`
    <text
      x="${125 + 90 * Math.sin(((hour % 12) / 12) * 2 * Math.PI)}"
      y="${125 - 90 * Math.cos(((hour % 12) / 12) * 2 * Math.PI)}"
      dominant-baseline="central" text-anchor="middle" font-size="20"
      transform="rotate(${((hour % 12) / 12) * 360}, ${
      125 + 90 * Math.sin(((hour % 12) / 12) * 2 * Math.PI)
    }, ${125 - 90 * Math.cos(((hour % 12) / 12) * 2 * Math.PI)})"
    >
      ${romanNumerals[hour % 12]}
    </text>
`;
  }

  render(): HTMLTemplateResult {
    const angleHoursHand =
      ((this.hours % 12) / 12) * 2 * Math.PI +
      ((this.minutes / 60) * 2 * Math.PI) / 12;
    const angleMinutesHand = (this.minutes / 60) * 2 * Math.PI;

    let hourTickMarks: number[] = [];
    if (this.showAllTickMarks || this.showHourTickMarks)
      hourTickMarks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    else if (this.showQuarterTickMarks) hourTickMarks = [3, 6, 9, 12];

    let minuteTickMarks: number[] = [];
    if (this.showAllTickMarks)
      minuteTickMarks = [
        1, 2, 3, 4, 6, 7, 8, 9, 11, 12, 13, 14, 16, 17, 18, 19, 21, 22, 23, 24,
        26, 27, 28, 29, 31, 32, 33, 34, 36, 37, 38, 39, 41, 42, 43, 44, 46, 47,
        48, 49, 51, 52, 53, 54, 56, 57, 58, 59,
      ];

    let hourNumbers: number[] = [];
    if (this.showAllNumbers)
      hourNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    else if (this.showQuarterNumbers) hourNumbers = [3, 6, 9, 12];

    return html`
      <svg
        viewBox="0 0 250 250"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
      >
        <circle
          stroke="black"
          stroke-width="10"
          fill="none"
          cx="125"
          cy="125"
          r="120"
        ></circle>
        ${hourTickMarks.map(hour => this.renderHourTickMark(hour))}
        ${minuteTickMarks.map(minute => this.renderMinuteTickMark(minute))}
        ${hourNumbers.map(hour => this.renderHourNumber(hour))}
        <line
          x1="125"
          y1="125"
          x2="${125 + 100 * Math.sin(angleMinutesHand)}"
          y2="${125 - 100 * Math.cos(angleMinutesHand)}"
          stroke="red"
          stroke-width="5"
        ></line>
        <line
          x1="125"
          y1="125"
          x2="${125 + 75 * Math.sin(angleHoursHand)}"
          y2="${125 - 75 * Math.cos(angleHoursHand)}"
          stroke="grey"
          stroke-width="5"
        ></line>
        <circle fill="black" cx="125" cy="125" r="5"></circle>
      </svg>
    `;
  }
}
