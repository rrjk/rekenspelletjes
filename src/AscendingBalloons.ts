import { LitElement, html, css } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';
import type { CSSResultGroup, HTMLTemplateResult, PropertyValues } from 'lit';
import { randomFromSetAndSplice } from './Randomizer';

interface Answers {
  correct: number;
  incorrect: number[];
}

type BalloonColors = 'blue' | 'green' | 'yellow' | 'purple';

interface BalloonInfo {
  color: BalloonColors;
  label: number;
  disabled: boolean;
}

@customElement('ascending-balloons')
export class AscendingBalloons extends LitElement {
  @state()
  ascension = false;
  @property({ attribute: false })
  answers: Answers = { correct: 12, incorrect: [1, 3, 74] };
  @state()
  balloonInfoList: BalloonInfo[] = [];

  constructor() {
    super();
    this.updateBalloonInfo();
  }

  updateBalloonInfo(): void {
    this.balloonInfoList = [];
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
      this.balloonInfoList.push({
        color: randomFromSetAndSplice(availableColors),
        label: randomFromSetAndSplice(availableAnswers),
        disabled: false,
      });
    }

    this.requestUpdate();
  }

  willUpdate(changedProperties: PropertyValues): void {
    if (changedProperties.has('answers')) {
      this.updateBalloonInfo();
    }
  }

  static get styles(): CSSResultGroup {
    return css`
      .MoveUp {
        animation-name: MoveUp;
        animation-duration: 10s;
        animation-delay: 0.05s; /* Needed to ensure iOS safari has sufficient time to process restarts of the animation */
        animation-timing-function: linear;
        animation-fill-mode: forwards;
      }
      @keyframes MoveUp {
        from {
          transform: translate(0px, -0px);
        }
        to {
          transform: translate(0px, calc(-100vh + 2em));
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
        border: none;
        display: flex;
        justify-content: space-around;
        bottom: 0px;
      }
    `;
  }

  async reset(): Promise<void> {
    this.updateBalloonInfo();
    this.ascension = false;
    await this.performUpdate();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const dummy = this.offsetWidth; // This is a dummy command to force a reflow such that the animation is reset.
    this.ascension = true;
  }

  startAscension(): void {
    this.ascension = true;
  }

  balloonClicked(label: number): void {
    if (label !== this.answers.correct) {
      const balloonInfo = this.balloonInfoList.find(b => b.label === label);
      if (balloonInfo != null) {
        balloonInfo.disabled = true;
      } else {
        throw Error(
          'Balloon label not found in balloonInfoList, this should not happen'
        );
      }
      this.requestUpdate();
      const event = new CustomEvent('wrong-balloon-clicked');
      this.dispatchEvent(event);
    } else {
      const event = new CustomEvent('correct-balloon-clicked');
      this.dispatchEvent(event);
    }
  }

  render(): HTMLTemplateResult {
    return html`
      <div id="balloons" class="${this.ascension ? 'MoveUp' : ''}">
        ${this.balloonInfoList.map(
          balloonInfo =>
            html`
              <button
                type="button"
                class="Balloon"
                style="background-image: url('images/balloon-${balloonInfo.color}.png');"
                @click="${() => this.balloonClicked(balloonInfo.label)}"
                ?disabled="${balloonInfo.disabled}"
              >
                ${balloonInfo.disabled ? '✗' : balloonInfo.label}
              </button>
            `
        )}
      </div>
    `;
  }
}
