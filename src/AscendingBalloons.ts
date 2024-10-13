import { LitElement, html, css } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, state, property } from 'lit/decorators.js';
import type { CSSResultGroup, HTMLTemplateResult, PropertyValues } from 'lit';
import { darken, lighten } from 'color2k';

import { randomFromSetAndSplice } from './Randomizer';
import { getZeppelinAsSvgUrl } from './ZeppelinImage';
import { getColorInfo } from './Colors';
// import { BalloonIndex } from './BalloonWithTextOverlay';

/** Interface definition for type storing the answers. */
export interface Answers {
  correct: number;
  incorrect: [number, number, number];
}

/** Possible balloon colors */
type BalloonColors = 'blue' | 'green' | 'yellow' | 'purple';
export type ImageType = 'balloon' | 'star' | 'kite' | 'rocket' | 'zeppelin';

/** Interface definition for the ballooninfo */
interface BalloonInfo {
  color: BalloonColors;
  label: number;
  disabled: boolean;
}

/** Ascending balloons custom element.
 * @fires wrong-balloon-clicked - Fired when a wrong balloon has been clicked.
 * @fires correct-balloon-clicked - Fired when a wrong balloon has been clicked.
 * @fires ascension-complete - Fired when balloons have hit the ceiling.
 */
@customElement('ascending-balloons')
export class AscendingBalloons extends LitElement {
  static ascendingImage: Map<ImageType, Map<BalloonColors, URL>> = new Map<
    ImageType,
    Map<BalloonColors, URL>
  >([
    [
      'balloon',
      new Map<BalloonColors, URL>([
        ['blue', new URL('../images/balloon-blue.png', import.meta.url)],
        ['yellow', new URL('../images/balloon-yellow.png', import.meta.url)],
        ['purple', new URL('../images/balloon-purple.png', import.meta.url)],
        ['green', new URL('../images/balloon-green.png', import.meta.url)],
      ]),
    ],
    [
      'star',
      new Map<BalloonColors, URL>([
        ['blue', new URL('../images/star-blue.png', import.meta.url)],
        ['yellow', new URL('../images/star-yellow.png', import.meta.url)],
        ['purple', new URL('../images/star-purple.png', import.meta.url)],
        ['green', new URL('../images/star-green.png', import.meta.url)],
      ]),
    ],
    [
      'kite',
      new Map<BalloonColors, URL>([
        ['blue', new URL('../images/kite-blue.svg', import.meta.url)],
        ['yellow', new URL('../images/kite-yellow.svg', import.meta.url)],
        ['purple', new URL('../images/kite-purple.svg', import.meta.url)],
        ['green', new URL('../images/kite-green.svg', import.meta.url)],
      ]),
    ],
    [
      'rocket',
      new Map<BalloonColors, URL>([
        ['blue', new URL('../images/rocket-blue.svg', import.meta.url)],
        ['yellow', new URL('../images/rocket-yellow.svg', import.meta.url)],
        ['purple', new URL('../images/rocket-purple.svg', import.meta.url)],
        ['green', new URL('../images/rocket-green.svg', import.meta.url)],
      ]),
    ],
    [
      'zeppelin',
      new Map<BalloonColors, URL>([
        [
          'purple',
          new URL(
            `data:image/svg+xml,${getZeppelinAsSvgUrl(
              darken(getColorInfo('purple').mainColorCode, 0.2),
              getColorInfo('purple').mainColorCode,
              lighten(getColorInfo('purple').mainColorCode, 0.1),
            )}`,
          ),
        ],
        [
          'green',
          new URL(
            `data:image/svg+xml,${getZeppelinAsSvgUrl(
              darken(getColorInfo('green').mainColorCode, 0.2),
              getColorInfo('green').mainColorCode,
              lighten(getColorInfo('green').mainColorCode, 0.1),
            )}`,
          ),
        ],
        [
          'yellow',
          new URL(
            `data:image/svg+xml,${getZeppelinAsSvgUrl(
              darken(getColorInfo('orange').mainColorCode, 0.2),
              getColorInfo('orange').mainColorCode,
              lighten(getColorInfo('orange').mainColorCode, 0.2),
            )}`,
          ),
        ],
        [
          'blue',
          new URL(
            `data:image/svg+xml,${getZeppelinAsSvgUrl(
              darken(getColorInfo('blue').mainColorCode, 0.2),
              getColorInfo('blue').mainColorCode,
              lighten(getColorInfo('blue').mainColorCode, 0.1),
            )}`,
          ),
        ],
      ]),
    ],
  ]);

  /** Answers for the balloons, 1 correct answer and 3 incorrect answers. */
  @property({ attribute: false })
  accessor answers: Answers = { correct: 12, incorrect: [1, 3, 74] };

  /** Disabled state of the balloons.
   * If disabled, the balloons do not show their label, do not react to clicks
   * and do not ascend.
   */
  @property({ type: Boolean })
  accessor disabled = false;

  /** Ascension state */
  @state()
  private accessor ascension = false;
  /** Balloon info for each of 4 balloons.
   * Is refreshed each time new answers are set.
   */
  @state()
  accessor balloonInfoList: BalloonInfo[] = [];

  @property()
  accessor imageType: ImageType = 'balloon';

  constructor() {
    super();
    this.updateBalloonInfo();
  }

  /** Update the ballooninfo.
   * Also shufles the balloons and colors.
   */
  private updateBalloonInfo(): void {
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

  /** Called whenever a property is updated.
   * Checks whether the updated property is answers and updates the balloon info in that case.
   */
  willUpdate(changedProperties: PropertyValues): void {
    if (changedProperties.has('answers')) {
      this.updateBalloonInfo();
    }
  }

  /** Get the styles for this custom element. */
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

      .star,
      .kite,
      .balloon,
      .rocket,
      .zeppelin {
        border: none;
        outline: none;
        color: black;
        text-align: center;
        padding: 0;
      }

      .star {
        background-size: 3.5em 3.5em;
        background-color: Transparent;
        font-size: calc(0.9em + 2vmin);
        width: 3.5em;
        height: 3.5em;
        line-height: 3.8em;
      }

      .kite {
        display: inline-block;
        background-size: 2em 3em;
        background-color: Transparent;
        font-size: calc(0.9em + 4vmin);
        width: 2em;
        height: 3em;
      }

      .kite span {
        position: relative;
        top: -0.4em;
      }

      .rocket {
        display: inline-block;
        background-size: 3.5em 3.5em;
        background-color: Transparent;
        font-size: calc(0.9em + 3vmin);
        width: 3.5em;
        height: 3.5em;
      }

      .rocket span {
        position: relative;
        top: -0.2em;
      }

      .balloon {
        background-size: 1.76em 2em;
        background-color: Transparent;
        font-size: calc(1em + 4vmin);
        width: 1.76em;
        height: 2em;
      }

      .balloon span {
        position: relative;
        top: -0.15em;
      }

      .zeppelin {
        background-size: 3.5em 2.5em;
        background-color: Transparent;
        font-size: calc(1em + 4vmin);
        width: 3.5em;
        height: 2.5em;
        color: white;
      }

      .zeppelin span {
        position: relative;
        top: 0em;
        left: 0.2em;
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

  /* Restart the balloon ascension from the bottom.
   */
  async restartAscension(): Promise<void> {
    await this.reset();
    this.startAscension();
  }

  /** Reset the balloons to the bottom and stop movement.
   * Wait until the promise resolves before starting ascension again as
   * otherwise the reset might be missed by the browser.
   */
  async reset(): Promise<void> {
    this.updateBalloonInfo();
    this.ascension = false;
    await this.performUpdate();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const dummy = this.offsetWidth; // This is a dummy command to force a reflow such that the animation is reset.
  }

  /** Start ascension of the balloons.
   * If the balloons are already ascending this action has no effect.
   */
  startAscension(): void {
    this.ascension = true;
  }

  /** Event handler for when a balloon is clicked
   * @param label - label of the clicked balloon.
   */
  private balloonClicked(label: number): void {
    if (label !== this.answers.correct) {
      const balloonInfo = this.balloonInfoList.find(b => b.label === label);
      if (balloonInfo != null) {
        balloonInfo.disabled = true;
      } else {
        throw Error(
          'Balloon label not found in balloonInfoList, this should not happen',
        );
      }
      this.requestUpdate();
      const event = new Event('wrong-balloon-clicked');
      this.dispatchEvent(event);
    } else {
      const event = new Event('correct-balloon-clicked');
      this.dispatchEvent(event);
    }
  }

  private ascensionComplete(): void {
    const event = new Event('ascension-complete');
    this.dispatchEvent(event);
  }

  /** Render the text on the balloon, taking disabledness into account. */
  private renderTextBalloon(balloonInfo: BalloonInfo): string {
    let ret: string;
    if (this.disabled) ret = '';
    else if (balloonInfo.disabled) ret = '✗';
    else ret = `${balloonInfo.label}`;
    return ret;
  }

  /** Render the ascending balloons custom element. */
  render(): HTMLTemplateResult {
    return html`
      <div
        id="balloons"
        class="${this.ascension && !this.disabled ? 'MoveUp' : ''}"
        @animationend=${() => this.ascensionComplete()}
      >
        ${this.balloonInfoList.map(
          balloonInfo => html`
            <button
              type="button"
              class="${this.imageType}"
              style="background-image: url('${AscendingBalloons.ascendingImage
                .get(this.imageType)
                ?.get(balloonInfo.color)}');"
              @click="${() => this.balloonClicked(balloonInfo.label)}"
              ?disabled="${balloonInfo.disabled || this.disabled}"
            >
              <span>${this.renderTextBalloon(balloonInfo)}</span>
            </button>
          `,
        )}
      </div>
    `;
  }
}
