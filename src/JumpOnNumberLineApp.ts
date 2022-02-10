/* eslint-disable class-methods-use-this */
import { LitElement, html, css } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, state } from 'lit/decorators.js';
import type { CSSResultGroup, HTMLTemplateResult } from 'lit';

import { NumberLine } from './NumberLine';

import './ProgressBar';
import type { ProgressBar } from './ProgressBar';

import { randomIntFromRange } from './Randomizer';

import './ScoreBox';
import type { ScoreBox } from './ScoreBox';

import './MessageDialog';
import type { MessageDialog } from './MessageDialog';

import './GameOverDialog';
import type { GameOverDialog } from './GameOverDialog';

import './Platform';
import type { Platform } from './Platform';

import { ChildNotFoundError } from './ChildNotFoundError';

import { ParseNumberLineParameters } from './NumberLineParameters';
import type { NumberLineParameters } from './NumberLineParameters';

import { ParseGametimeFromUrl } from './GametimeParameters';

@customElement('jump-on-numberline-app')
export class JumpOnNumberLineApp extends LitElement {
  static janImage = new URL(
    '../images/Mompitz Jan_Ballon.png',
    import.meta.url
  );

  /** Number correct answers */
  @state()
  private numberOk = 0;
  /** Number incorrect answers */
  @state()
  private numberNok = 0;

  /** Number to set by student */
  @state()
  private numberToSet = 0;
  /** Show the number or not, useful in the beginning and end of the game. */
  @state()
  private showNumber = false;

  /** The desired position of Jan in vw units. */
  @state()
  private desiredPosition = 0;

  /** Numberline properties */
  @state()
  private numberLineProperties: NumberLineParameters;

  /** Hide Jan or not. Jan is hidden when the student is setting the platform correctly. */
  @state()
  private hideJan = true;

  /** Animation to apply to Jan, depends on whether the student put the platform correctly or not. */
  @state()
  private janAnimation:
    | 'moveDownCorrect'
    | 'moveDownInCorrect'
    | 'moveDownAlmostCorrectLeftSide'
    | 'moveDownAlmostCorrectRightSide'
    | 'none' = 'none';

  /** Is dragging the platform disabled/ */
  @state()
  private dragDisabled = false;

  /** Gametime in number of seconds */
  @state()
  private gameTime: number;

  /** Width of the number line in vw units */
  private static readonly numberLineWidth = 94;
  /** Top of the number line in vh units */
  private static readonly numberLineTop = 60;
  /** Left of the number line in vw units */
  private static readonly numberLineLeft = 3;
  /** Top of the check button in vh units */
  private static readonly checkButtonTop = 70;
  /** Left of the check button in vw units */
  private static readonly checkButtonLeft = 70;
  /** Width of the check button in vw units */
  private static readonly checkButtonWidth = 10;
  /** Height of the check button in vw units */
  private static readonly checkButtonHeight = 5;

  /** Width of the platform as a fraction of the width of the numberline */
  private static readonly platformWidthFraction = 0.035;
  /** Width of Jan as a fraction of the width of the numberline */
  private static readonly janWidthFraction = 0.04;

  /** Aspect ration of Jan added here to prevent having to calculate it run-time */
  private static readonly janAspectRatio = 591 / 214;
  /** Left border location of the foot of Jan as fraction of total width of Jan */
  private static readonly janLeftOfFootFraction = 80 / 214;
  /** Width of the foot as fraction of the width of Jan */
  private static readonly janFootFraction = (214 - 80 - 125) / 214;
  /** Middle of the foot location as fraction of the width of Jan */
  private static readonly janMiddleOfFootFraction = 102 / 214;

  /** Constructor, parse URL parameters */
  constructor() {
    super();
    this.numberLineProperties = ParseNumberLineParameters();
    this.gameTime = ParseGametimeFromUrl(60);
  }

  /** Get all static styles */
  static get styles(): CSSResultGroup {
    return css`
      :host {
        --numberLineWidth: ${JumpOnNumberLineApp.numberLineWidth}vw;
        --numberLineTop: ${JumpOnNumberLineApp.numberLineTop}vh;
        --numberLineLeft: ${JumpOnNumberLineApp.numberLineLeft}vw;

        --checkButtonTop: ${JumpOnNumberLineApp.checkButtonTop}vh;
        --checkButtonLeft: ${JumpOnNumberLineApp.checkButtonLeft}vw;
        --checkButtonWidth: ${JumpOnNumberLineApp.checkButtonWidth}vw;
        --checkButtonHeight: ${JumpOnNumberLineApp.checkButtonHeight}vw;

        --platformWidthFraction: ${JumpOnNumberLineApp.platformWidthFraction};

        --janWidthFraction: ${JumpOnNumberLineApp.janWidthFraction};
        --janLeftOfFootFraction: ${JumpOnNumberLineApp.janLeftOfFootFraction};
        --janMiddleOfFootFraction: ${JumpOnNumberLineApp.janMiddleOfFootFraction};
        --janFootFraction: ${JumpOnNumberLineApp.janFootFraction};

        --janAspectRatio: ${JumpOnNumberLineApp.janAspectRatio};

        --janWidth: calc(var(--janWidthFraction) * var(--numberLineWidth));
        --janMiddleOfFootWidth: calc(
          var(--janMiddleOfFootFraction) * var(--janWidth)
        );
        --janHeight: calc(var(--janWidth) * var(--janAspectRatio));

        /* desiredPosition is set in javaScript based on where number to set */
        --janLeft: calc(var(--desiredPosition) - var(--janMiddleOfFootWidth));

        --platformTop: calc(
          var(--numberLineTop) - 0.5 * ${NumberLine.heightWidthAspectRatio} *
            var(--numberLineWidth)
        );
        --platformWidth: calc(
          var(--platformWidthFraction) * var(--numberLineWidth)
        );
        --platformLeft: calc(
          var(--numberLineLeft) + ${NumberLine.widthFractionMinimum} *
            var(--numberLineWidth) - 0.5 * var(--platformWidth)
        );
        --platformHeight: calc(
          ${NumberLine.heightWidthAspectRatio} * var(--numberLineWidth)
        );
      }

      #numberLine {
        position: absolute;
        left: var(--numberLineLeft);
        top: var(--numberLineTop);
        width: var(--numberLineWidth);
      }

      #numberLinePlatform {
        position: absolute;
        top: var(--platformTop);
        left: var(--platformLeft);
        width: var(--platformWidth);
        height: var(--platformHeight);
        display: block;
        border: none;
        padding: 0;
      }

      #jan {
        position: absolute;
        width: var(--janWidth);
        top: 0;
        left: var(--janLeft);
      }

      #spring {
        position: absolute;
        top: var(--checkButtonTop);
        left: var(--checkButtonLeft);
        width: var(--checkButtonWidth);
        height: var(--checkButtonHeight);
        font-size: 2vw;
        background-color: #0f0;
      }

      .moveDownAlmostCorrectRightSide {
        animation: MoveDownAlmostCorrectRightSide linear 3s forwards;
      }

      @keyframes MoveDownAlmostCorrectRightSide {
        0% {
          transform: translate(0px, 0px);
        }
        55% {
          transform: translate(
            0px,
            calc(var(--platformTop) - 0.7 * var(--janHeight))
          );
        }
        65% {
          transform: translate(calc(0.7 * var(--janWidth)), var(--platformTop));
        }
        100% {
          transform: translate(calc(0.5 * var(--janWidth)), 99vh);
        }
      }

      .moveDownAlmostCorrectLeftSide {
        animation: MoveDownAlmostCorrectLeftSide linear 3s forwards;
      }

      @keyframes MoveDownAlmostCorrectLeftSide {
        0% {
          transform: translate(0px, 0px);
        }
        55% {
          transform: translate(
            0px,
            calc(var(--platformTop) - 0.75 * var(--janHeight))
          );
        }
        65% {
          transform: translate(
            calc(-0.6 * var(--janWidth)),
            var(--platformTop)
          );
        }
        100% {
          transform: translate(calc(0.5 * var(--janWidth)), 99vh);
        }
      }

      .moveDownCorrect {
        animation: MoveDownCorrect linear 1.4s forwards;
      }

      @keyframes MoveDownCorrect {
        from {
          transform: translate(0, 0);
        }
        to {
          transform: translate(0, calc(var(--platformTop) - var(--janHeight)));
        }
      }

      .moveDownInCorrect {
        animation: MoveDownInCorrect linear 3s forwards;
      }

      @keyframes MoveDownInCorrect {
        from {
          transform: translate(0px, 0px);
        }
        to {
          transform: translate(0px, 99vh);
        }
      }
    `;
  }

  /** Helper function to easily query for an element.
   *  @param query Querystring for the element.
   *  @template T The type of the element.
   *  @throws ChildNotFoundError in case the element can't be found.
   *
   */
  private getElement<T>(query: string): T {
    const ret = <T | null>this.renderRoot.querySelector(query);
    if (ret === null) {
      throw new ChildNotFoundError(query, 'FindOnNumberApp');
    }
    return ret;
  }

  /** Get Jan */
  private get jan(): HTMLImageElement {
    return this.getElement<HTMLImageElement>('#jan');
  }

  /** Get the game over dialog */
  private get gameOverDialog(): GameOverDialog {
    return this.getElement<GameOverDialog>('#gameOverDialog');
  }

  /** Get the message dialog. */
  private get messageDialog(): MessageDialog {
    return this.getElement<MessageDialog>('#messageDialog');
  }

  /** Get the progress bar. */
  private get progressBar(): ProgressBar {
    return this.getElement<ProgressBar>('#progressBar');
  }

  /** Get the scorebox */
  private get scoreBox(): ScoreBox {
    return this.getElement<ScoreBox>('#scoreBox');
  }

  /** Get the numberline */
  private get numberLine(): NumberLine {
    return this.getElement<NumberLine>('#numberLine');
  }

  /** Get the numberline platform */
  private get numberLinePlatform(): Platform {
    return this.getElement<Platform>('#numberLinePlatform');
  }

  /** Handle the time up, when the game is over. */
  handleTimeUp(): void {
    this.showNumber = false;
    this.gameOverDialog
      .show(
        html` <p>
            Jan is ${this.numberOk === 0 ? 'nooit' : `${this.numberOk} keer`} op
            het platform geland.
          </p>
          <p>
            Je hebt ${this.numberNok === 0 ? 'geen' : this.numberNok}
            ${this.numberNok === 1 ? 'fout' : 'fouten'} gemaakt.
          </p>`
      )
      .then(result => {
        if (result === 'again') this.startNewGame();
        else window.location.href = 'index.html';
      });
  }

  /** Start a new game, resets the timer and the number of correct and incorrect answer. */
  startNewGame(): void {
    this.progressBar.restart();
    this.showNumber = true;
    this.hideJan = true;
    this.janAnimation = 'none';
    this.numberNok = 0;
    this.numberOk = 0;
    this.newRound();
  }

  /** Start a new round, a new number the student should jump to is set. */
  newRound(): void {
    this.numberToSet = randomIntFromRange(
      this.numberLineProperties.minimum,
      this.numberLineProperties.maximum
    );
  }

  /** Ceck the answer the student has selected and make Jan jump. */
  async checkAnswer(): Promise<void> {
    this.dragDisabled = true;
    this.desiredPosition =
      JumpOnNumberLineApp.numberLineLeft +
      this.numberLine.translatePostionToWidthFraction(this.numberToSet) *
        JumpOnNumberLineApp.numberLineWidth;
    this.hideJan = false;

    /* We now need to process the update, to ensure Jan is at the right location, so we can get it's position on the screen */
    await this.performUpdate();

    const platformBoundRect = this.numberLinePlatform.getBoundingClientRect();
    const janBoundingRect = this.jan.getBoundingClientRect();

    const janLeft = janBoundingRect.x;
    const janRight = janBoundingRect.x + janBoundingRect.width;
    const janFootLeft =
      janBoundingRect.x +
      janBoundingRect.width * JumpOnNumberLineApp.janLeftOfFootFraction;
    const janFootRight =
      janFootLeft + janBoundingRect.width * JumpOnNumberLineApp.janFootFraction;
    const platformLeft = platformBoundRect.x;
    const platformRight = platformBoundRect.x + platformBoundRect.width;

    let timeOut = 0;

    this.jan.addEventListener(
      'animationend',
      () => {
        if (this.janAnimation === 'moveDownCorrect') this.numberOk += 1;
        else this.numberNok += 1;
        setTimeout(() => {
          this.hideJan = true;
          this.dragDisabled = false;
          this.janAnimation = 'none';
          this.newRound();
        }, timeOut);
      },
      { once: true }
    );

    if (janFootRight > platformLeft && janFootLeft < platformRight) {
      this.janAnimation = 'moveDownCorrect';
      timeOut = 500;
    } else if (janFootRight < platformLeft && janRight > platformLeft) {
      this.janAnimation = 'moveDownAlmostCorrectLeftSide';
    } else if (janFootLeft > platformRight && janLeft < platformRight) {
      this.janAnimation = 'moveDownAlmostCorrectRightSide';
    } else {
      this.janAnimation = 'moveDownInCorrect';
    }
  }

  /** Actions performed after the first update is complete. */
  async firstUpdated(): Promise<void> {
    await this.updateComplete;
    await this.showWelcomeMessage();
    this.startNewGame();
  }

  override async getUpdateComplete(): Promise<boolean> {
    const result = await super.getUpdateComplete();
    await this.progressBar.updateComplete;
    await this.numberLine.updateComplete;
    await this.numberLinePlatform.updateComplete;
    await this.scoreBox.updateComplete;
    await this.gameOverDialog.updateComplete;
    await this.messageDialog.updateComplete;
    return result;
  }

  /** Show the welcome message */
  async showWelcomeMessage(): Promise<string> {
    return this.messageDialog.show(
      'Spring op de getallenlijn',
      html`<p>
          Zet het platform op de juiste plek op de getallenlijn, zodat Jan erop
          kan springen.
        </p>
        <p>Dit spel kun je op de telefoon het beste horizontaal spelen.</p>`
    );
  }

  /** Render the class property of jan, the image that moves down */
  renderJanClass(): string {
    let ret;
    if (this.janAnimation === 'none') ret = '';
    else ret = this.janAnimation;
    return ret;
  }

  /** Render the application */
  render(): HTMLTemplateResult {
    return html`
      <style>
        :host {
          --desiredPosition: ${this.desiredPosition}vw;
        }
      </style>

      <progress-bar
        style="--progress-bar-gametime: ${this.gameTime}s;"
        id="progressBar"
        @timeUp="${() => this.handleTimeUp()}"
      ></progress-bar>
      <score-box
        id="scoreBox"
        numberOk="${this.numberOk}"
        numberNok="${this.numberNok}"
        style="width: 12vmin;--scoreBoxWidth: 12vmin; position: absolute; top: calc(1em + 22px); right: 1em;"
      >
      </score-box>

      <number-line
        id="numberLine"
        ?show10TickMarks=${this.numberLineProperties.show10TickMarks}
        ?show5TickMarks=${this.numberLineProperties.show5TickMarks}
        ?show1TickMarks=${this.numberLineProperties.show1TickMarks}
        ?showAll10Numbers=${this.numberLineProperties.showAll10Numbers}
        minimum=${this.numberLineProperties.minimum}
        maximum=${this.numberLineProperties.maximum}
      >
      </number-line>
      <numberline-platform
        id="numberLinePlatform"
        ?dragDisabled=${this.dragDisabled}
        maxDeltaX=${(NumberLine.lineLength / NumberLine.viewBoxWidth) * 100}
      ></numberline-platform>

      <div style="text-align: center; font-size: 8vw;">
        ${this.showNumber ? this.numberToSet : ''}
      </div>

      <img
        id="jan"
        alt="Mompitz"
        src="${JumpOnNumberLineApp.janImage}"
        style="display: ${this.hideJan ? 'none' : 'block'};"
        class="${this.renderJanClass()}"
      />
      <button id="spring" @click="${() => this.checkAnswer()}">Spring</button>
      <message-dialog id="messageDialog"></message-dialog>
      <gameover-dialog id="gameOverDialog"></gameover-dialog>
    `;
  }
}
