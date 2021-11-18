import { LitElement, html, css } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';
import type { CSSResultGroup, HTMLTemplateResult } from 'lit';
import { randomFromSetAndSplice } from './Randomizer';

interface Answers {
  correct: number;
  incorrect: number[];
}

type BalloonColors = 'blue' | 'green' | 'yellow' | 'purple';

interface BalloonInfo {
  color: BalloonColors;
  label: number;
}

@customElement('ascending-balloons')
export class AscendingBalloons extends LitElement {
  @state()
  ascension = false;
  @property({ attribute: false })
  answers: Answers = { correct: 12, incorrect: [1, 3, 74] };
  @state()
  balloonInfo: BalloonInfo[] = [];

  constructor() {
    super();
    this.updateBalloonInfo();
  }

  updateBalloonInfo(): void {
    this.balloonInfo = [];
    const availableColors: BalloonColors[] = [
      'blue',
      'green',
      'yellow',
      'purple',
    ];
    const availableAnswers: number[] = [
      this.answers.correct,
      ...this.answers.incorrect,
    ];

    while (availableAnswers.length > 0) {
      this.balloonInfo.push({
        color: randomFromSetAndSplice(availableColors),
        label: randomFromSetAndSplice(availableAnswers),
      });
    }

    this.requestUpdate();
  }

  static get styles(): CSSResultGroup {
    return css`
      .MoveUp {
        animation: MoveUp linear 10s;
        animation-fill-mode: forwards;
      }
      @keyframes MoveUp {
        from {
          transform: translate(0px, -0px);
        }
        to {
          transform: translate(0px, -86vh);
        }
      }

      .Balloon {
        background-size: 1.76em 2em;
        background-color: Transparent;
        font-size: calc(1em + 4vmin);
        border: none;
        outline: none;
        width: 1.76em;
        height: 2em;
        color: black;
        text-align: center;
        padding: 0;
      }

      #balloons {
        position: absolute;
        width: 100%;
        border: 1px red solid;
        display: flex;
        justify-content: space-around;
        bottom: 0px;
      }
    `;
  }

  async reset(): Promise<void> {
    this.ascension = false;
    await this.performUpdate();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const dummy = this.offsetWidth; // This is a dummy command to force a reflow such that the animation is reset.
    this.ascension = true;
  }

  startAscension(): void {
    this.ascension = true;
  }

  render(): HTMLTemplateResult {
    return html`
      <div id="balloons" class="${this.ascension ? 'MoveUp' : ''}">
        <button
          type="button"
          class="Balloon"
          id="Balloon0"
          style="background-image: url('images/balloon-blue.png');"
        >
          1
        </button>
        <button
          type="button"
          class="Balloon"
          id="Balloon1"
          style="background-image: url('images/balloon-green.png');"
        >
          12
        </button>
        <button
          type="button"
          class="Balloon"
          id="Balloon2"
          style="background-image: url('images/balloon-yellow.png');"
        >
          3
        </button>
        <button
          type="button"
          class="Balloon"
          id="Balloon3"
          style="background-image: url('images/balloon-purple.png');"
        >
          74
        </button>
      </div>
    `;
  }
}
