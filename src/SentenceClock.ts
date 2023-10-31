import { LitElement, html, css } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, property } from 'lit/decorators.js';

const numbersasWords = [
  'nul',
  'een',
  'twee',
  'drie',
  'vier',
  'vijf',
  'zes',
  'zeven',
  'acht',
  'negen',
  'tien',
  'elf',
  'twaalf',
  'dertien',
  'veertien',
] as const;

/** Analog clock.
 *   - Takes the height and width of the surrounding block when used as an inline element.
 *   - Takes set width and height when used as an block element.
 */
@customElement('sentence-clock')
export class SentenceClock extends LitElement {
  static widthHeightRatio = 1.5;

  @property({ type: Number })
  hours = 0;
  @property({ type: Number })
  minutes = 0;
  @property({ type: Boolean })
  useWords = false;

  static get styles(): CSSResultGroup {
    return css`
      line.segment {
        stroke: blue;
        stroke-width: 5;
        stroke-linecap: round;
      }
    `;
  }

  numberAsStringOrDigits(n: number): string {
    let ret = '';
    if (this.useWords) ret = numbersasWords[n];
    else ret = `${n}`;
    return ret;
  }

  capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  render(): HTMLTemplateResult {
    const hoursBounded = this.hours < 24 ? this.hours : 12; // We do this just in case an error is made in the usage of the
    let hoursNormalized = hoursBounded % 12;
    if (hoursNormalized === 0) hoursNormalized = 12;
    const minutesBounded = this.minutes < 60 ? this.minutes : 0;

    let nextHour = (hoursNormalized + 1) % 12;
    if (nextHour === 0) nextHour = 12;

    let clockTextLine1 = 'onbekend';
    let clockTextLine2 = '';

    if (minutesBounded === 0) {
      clockTextLine1 = `${this.numberAsStringOrDigits(hoursNormalized)} uur`;
    } else if (minutesBounded === 15) {
      clockTextLine1 = `Kwart over`;
      clockTextLine2 = `${this.numberAsStringOrDigits(hoursNormalized)}`;
    } else if (minutesBounded === 30) {
      clockTextLine1 = `Half ${this.numberAsStringOrDigits(nextHour)}`;
    } else if (minutesBounded === 45) {
      clockTextLine1 = `Kwart voor`;
      clockTextLine2 = `${this.numberAsStringOrDigits(nextHour)}`;
    } else if (minutesBounded > 0 && minutesBounded < 15) {
      clockTextLine1 = `${this.numberAsStringOrDigits(minutesBounded)} over`;
      clockTextLine2 = `${this.numberAsStringOrDigits(hoursNormalized)}`;
    } else if (minutesBounded > 15 && minutesBounded < 30) {
      clockTextLine1 = `${this.numberAsStringOrDigits(
        30 - minutesBounded
      )} voor`;
      clockTextLine2 = `half ${this.numberAsStringOrDigits(nextHour)}`;
    } else if (minutesBounded > 30 && minutesBounded < 45) {
      clockTextLine1 = `${this.numberAsStringOrDigits(
        minutesBounded - 30
      )} over`;
      clockTextLine2 = `half ${this.numberAsStringOrDigits(nextHour)}`;
    } else if (minutesBounded > 45 && minutesBounded < 60) {
      clockTextLine1 = `${this.numberAsStringOrDigits(
        60 - minutesBounded
      )} voor`;
      clockTextLine2 = `${this.numberAsStringOrDigits(nextHour)}`;
    }

    clockTextLine1 = this.capitalize(clockTextLine1);

    return html`
      <svg
        viewBox="0 0 ${200 * SentenceClock.widthHeightRatio} 200"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
      >
        <rect
          stroke="grey"
          stroke-width="1"
          fill="white"
          x="10"
          y="10"
          width="280"
          height="140"
        ></rect>
        <text x="20" y="67" font-size="40">
          <tspan x="20" dy="0">${clockTextLine1}<tspan>
          <tspan x="20" dy="50">${clockTextLine2}<tspan>
        </text>
      </svg>
    `;
  }
}
