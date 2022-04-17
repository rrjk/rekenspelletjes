import { LitElement, html, css } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, state } from 'lit/decorators.js';

import type { CSSResultGroup, HTMLTemplateResult } from 'lit';

/** Progressbar element
 * This is a bar taking the full width with timer and counter of errors.
 *
 */
@customElement('timer-bar')
export class TimerBar extends LitElement {
  @state()
  numberOk = 0;
  @state()
  numberNok = 0;
  @state()
  paused = false;
  @state()
  minutes = 0;
  @state()
  seconds = 0;

  constructor() {
    super();
    setInterval(() => this.increaseTime(), 1000);
  }

  increaseNok(): void {
    this.numberNok += 1;
  }

  increaseOk(): void {
    this.numberNok += 1;
  }

  increaseTime(): void {
    if (!this.paused) {
      this.seconds += 1;
      if (this.seconds === 60) {
        this.seconds = 0;
        this.minutes += 1;
      }
    }
  }

  getTimeAsString(): string {
    return `${this.minutes}:${this.seconds.toString().padStart(2, '0')}`;
  }

  pause(): void {
    this.paused = true;
  }

  resume(): void {
    this.paused = false;
  }

  resetScore(): void {
    this.numberNok = 0;
    this.numberOk = 0;
    this.minutes = 0;
    this.seconds = 0;
    this.paused = false;
  }

  static get styles(): CSSResultGroup {
    return css`
      .RedText {
        color: red;
      }

      .GreenText {
        color: green;
      }

      #ProgressBarOutline {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 20px;
        border-style: none;
        background-color: lightgrey;
        text-align: right;
      }

      #ScoreBox {
        position: absolute;
        top: 0;
        right: 0;
        margin-right: 1em;
        margin-top: auto;
        margin-bottom: auto;
      }
    `;
  }

  /*
  constructor() {
    super();
  }
*/

  render(): HTMLTemplateResult {
    return html` <div id="ProgressBarOutline">
      <div id="ScoreBox">
        Speeltijd ${this.getTimeAsString()}
        <span class="GreenText">✓</span> : ${this.numberOk}
        <span class="RedText">✗</span> : ${this.numberNok}
      </div>
    </div>`;
  }
}
