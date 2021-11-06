/* eslint-disable class-methods-use-this */
import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { CSSResultGroup, HTMLTemplateResult } from 'lit';

// import './NumberLine';
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

@customElement('jump-on-numberline-app')
export class JumpOnNumberLineApp extends LitElement {
  /* Properties for the custom element */
  @state()
  private numberOk = 0;
  @state()
  private numberNok = 0;
  @state()
  private numberToSet = 70;
  @state()
  private show10TickMarks = true;
  @state()
  private show5TickMarks = true;
  @state()
  private show1TickMarks = true;
  @state()
  private showAll10Numbers = true;

  @state()
  private minimum = 0;
  @state()
  private maximum = 100;

  @state()
  private hideJan = true;
  @state()
  private janAnimation:
    | 'moveDownCorrect'
    | 'moveDownInCorrect'
    | 'moveDownAlmostCorrectLeftSide'
    | 'moveDownAlmostCorrectRightSide'
    | 'none' = 'none';

  @state()
  private dragDisabled = false;

  private static readonly janLeftOfFootFraction = 80 / 214;
  private static readonly janRightOfFootFraction = 125 / 214;
  private static readonly janFootFraction = (214 - 80 - 125) / 214;
  private static readonly janMiddleOfFootFraction = 102 / 214;

  static get styles(): CSSResultGroup {
    return css`
      :host {
        --numberLineWidth: 100vw;
        --numberLineTop: 60vh;

        --checkButtonTop: 70vh;
        --checkButtonLeft: 70vw;
        --checkButtonWidth: 10vw;
        --checkButtonHeight: 5vw;

        --platformWidthFraction: 0.035;

        /* This is the correct position of the number to set on the numberline, it will be updated in the javascript.*/
        --desiredPosition: 0;

        --janWidthFraction: 0.04;
        --janLeftOfFootFraction: ${JumpOnNumberLineApp.janLeftOfFootFraction};
        --janRightOfFootFraction: ${JumpOnNumberLineApp.janRightOfFootFraction};
        --janMiddleOfFootFraction: ${JumpOnNumberLineApp.janMiddleOfFootFraction};
        --janFootFraction: ${JumpOnNumberLineApp.janFootFraction};

        --janAspectRatio: calc(591 / 214);

        --janWidth: calc(var(--janWidthFraction) * var(--numberLineWidth));
        --janMiddleOfFootWidth: calc(
          var(--janMiddleOfFootFraction) * var(--janWidth)
        );
        --janHeight: calc(var(--janWidth) * var(--janAspectRatio));

        --janLeft: calc(var(--desiredPosition) - var(--janMiddleOfFootWidth));

        --platformTop: calc(
          var(--numberLineTop) - 0.5 * ${NumberLine.heightWidthAspectRatio} *
            var(--numberLineWidth)
        );
        --platformWidth: calc(
          var(--platformWidthFraction) * var(--numberLineWidth)
        );
        --platformLeft: calc(
          ${NumberLine.widthFractionMinimum} * var(--numberLineWidth) - 0.5 *
            var(--platformWidth)
        );
        --platformHeight: calc(
          ${NumberLine.heightWidthAspectRatio} * var(--numberLineWidth)
        );
      }

      #numberLine {
        position: absolute;
        left: 0;
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
        animation: MoveDownCorrect linear 1.6s forwards;
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

  private getElement<T>(query: string): T {
    const ret = <T | null>this.renderRoot.querySelector(query);
    if (ret === null) {
      throw new ChildNotFoundError(query, 'FindOnNumberApp');
    }
    return ret;
  }

  private get jan(): HTMLImageElement {
    return this.getElement<HTMLImageElement>('#jan');
  }

  private get gameOverDialog(): GameOverDialog {
    return this.getElement<GameOverDialog>('#gameOverDialog');
  }

  private get messageDialog(): MessageDialog {
    return this.getElement<MessageDialog>('#messageDialog');
  }

  private get progressBar(): ProgressBar {
    return this.getElement<ProgressBar>('#progressBar');
  }

  private get scoreBox(): ScoreBox {
    return this.getElement<ScoreBox>('#scoreBox');
  }

  private get numberLine(): NumberLine {
    return this.getElement<NumberLine>('#numberLine');
  }

  private get numberLinePlatform(): Platform {
    return this.getElement<Platform>('#numberLinePlatform');
  }

  handleTimeUp(): void {
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
        else window.location.href = '/Rekenspelletjes/index.html';
      });
  }

  startNewGame(): void {
    this.progressBar.restart();
    this.hideJan = true;
    this.janAnimation = 'none';
    this.numberNok = 0;
    this.numberOk = 0;
    this.newRound();
  }

  newRound(): void {
    this.numberToSet = randomIntFromRange(this.minimum, this.maximum);
  }

  async checkAnswer(): Promise<void> {
    this.dragDisabled = true;
    this.style.setProperty(
      '--desiredPosition',
      `${
        this.numberLine.translatePostionToWidthFraction(this.numberToSet) * 100
      }vw`
    );
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

  render(): HTMLTemplateResult {
    return html`
      <progress-bar
        style="--progress-bar-gameTime: 60s;"
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
        ?show10TickMarks=${this.show10TickMarks}
        ?show5TickMarks=${this.show5TickMarks}
        ?show1TickMarks=${this.show1TickMarks}
        ?showAll10Numbers=${this.showAll10Numbers}
        minimum=${this.minimum}
        maximum=${this.maximum}
      >
      </number-line>
      <numberline-platform
        id="numberLinePlatform"
        ?dragDisabled=${this.dragDisabled}
        maxDeltaX=${(NumberLine.lineLength / NumberLine.viewBoxWidth) * 100}
      ></numberline-platform>

      <div style="text-align: center; font-size: 8vw;">${this.numberToSet}</div>

      <img
        id="jan"
        alt="Mompitz"
        src="images/Mompitz Jan_Ballon.png"
        style="display: ${this.hideJan ? 'none' : 'block'};"
        class="${this.renderJanClass()}"
      />
      <button id="spring" @click="${() => this.checkAnswer()}">Spring</button>
      <message-dialog id="messageDialog"></message-dialog>
      <gameover-dialog id="gameOverDialog"></gameover-dialog>
    `;
  }
}
