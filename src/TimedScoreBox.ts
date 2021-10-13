import { LitElement, html, css } from 'lit';
import type {
  PropertyDeclarations,
  HTMLTemplateResult,
  CSSResultGroup,
} from 'lit';

export class TimedScoreBox extends LitElement {
  paused: boolean;
  numberNok: number;
  minutes: number;
  seconds: number;

  static get properties(): PropertyDeclarations {
    return {
      minutes: { type: Number },
      seconds: { type: Number },
      numberNok: { type: Number },
    };
  }

  static get styles(): CSSResultGroup {
    return css`
      #scoreBox {
        border-style: solid;
        border-color: black;
        padding: 10% 10% 10% 10% 10%;
        display: inline-block;
        width: calc(100% - 6px);
        font-size: calc(0.25 * var(--scoreBoxWidth));
      }

      .ScoreSign {
        display: inline-block;
        width: 1em;
      }

      .RedText {
        color: red;
      }
    `;
  }

  constructor() {
    super();
    this.paused = true;
    this.numberNok = 0;
    this.minutes = 0;
    this.seconds = 0;

    setInterval(() => this.increaseTime(), 1000);
  }

  increaseNok(): void {
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
    this.minutes = 0;
    this.seconds = 0;
    this.paused = false;
  }

  render(): HTMLTemplateResult {
    return html`
      <div id="scoreBox">
        <div style="text-align: center;">${this.getTimeAsString()}</div>
        <div><span class="ScoreSign RedText">✗</span> : ${this.numberNok}</div>
      </div>
    `;
  }
}

customElements.define('timed-score-box', TimedScoreBox);
