import { LitElement, html, css, svg } from 'lit';
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

@customElement('sentence-clock')
export class SentenceClock extends LitElement {
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

    let clockText = 'onbekend';

    if (minutesBounded === 0) {
      clockText = `${this.numberAsStringOrDigits(hoursNormalized)} uur`;
    } else if (minutesBounded === 15) {
      clockText = `Kwart over ${this.numberAsStringOrDigits(hoursNormalized)}`;
    } else if (minutesBounded === 30) {
      clockText = `Half ${this.numberAsStringOrDigits(nextHour)}`;
    } else if (minutesBounded === 45) {
      clockText = `Kwart voor ${this.numberAsStringOrDigits(nextHour)}`;
    } else if (minutesBounded > 0 && minutesBounded < 15) {
      clockText = `${this.numberAsStringOrDigits(
        minutesBounded
      )} over ${this.numberAsStringOrDigits(hoursNormalized)}`;
    } else if (minutesBounded > 15 && minutesBounded < 30) {
      clockText = `${this.numberAsStringOrDigits(
        30 - minutesBounded
      )} voor half ${this.numberAsStringOrDigits(nextHour)}`;
    } else if (minutesBounded > 30 && minutesBounded < 45) {
      clockText = `${this.numberAsStringOrDigits(
        minutesBounded - 30
      )} over half ${this.numberAsStringOrDigits(nextHour)}`;
    } else if (minutesBounded > 45 && minutesBounded < 60) {
      clockText = `${this.numberAsStringOrDigits(
        60 - minutesBounded
      )} voor half ${this.numberAsStringOrDigits(nextHour)}`;
    }

    clockText = this.capitalize(clockText);

    return html`
      <svg viewBox="0 0 600 100" style="width: 100%">
        <rect
          stroke="black"
          stroke-width="2"
          fill="lightgrey"
          x="10"
          y="10"
          width="580"
          height="80"
        ></rect>
        <text x="20" y="67" font-size="50">${clockText}</text>
      </svg>
    `;
  }
}
