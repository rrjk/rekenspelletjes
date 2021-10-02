import { LitElement, html, css } from 'lit';

export class TimedScoreBox extends LitElement {
  static get properties() {
    return {
      minutes: { type: Number },
      seconds: { type: Number },
      numberNok: { type: Number },
    };
  }

  static get styles() {
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

    this.interval = setInterval(() => this.increaseTime(), 1000);
  }

  increaseNok() {
    this.numberNok += 1;
  }

  increaseTime() {
    if (!this.paused) {
      this.seconds += 1;
      if (this.seconds === 60) {
        this.seconds = 0;
        this.minutes += 1;
      }
    }
  }

  getTimeAsString() {
    return `${this.minutes}:${this.seconds.toString().padStart(2, 0)}`;
  }

  pause() {
    this.paused = true;
  }

  resume() {
    this.paused = false;
  }

  resetScore() {
    this.numberNok = 0;
    this.minutes = 0;
    this.seconds = 0;
    this.paused = false;
  }

  render() {
    return html`
      <div id="scoreBox">
        <div style="text-align: center;">${this.getTimeAsString()}</div>
        <div><span class="ScoreSign RedText">✗</span> : ${this.numberNok}</div>
      </div>
    `;
  }
}

customElements.define('timed-score-box', TimedScoreBox);
