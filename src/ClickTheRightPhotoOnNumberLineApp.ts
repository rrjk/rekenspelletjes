/* eslint-disable   @typescript-eslint/no-unsafe-argument -- legacy, use of CustomEvent details field */
/* eslint-disable   @typescript-eslint/no-unsafe-member-access -- legacy, use of CustomEvent details field */

import { HTMLTemplateResult, LitElement, html } from 'lit';
import { state, property } from 'lit/decorators.js';
import { createRef, ref, Ref } from 'lit/directives/ref.js';

import './NumberLineHangingPhotos';
import type { NumberLineHangingPhotos } from './NumberLineHangingPhotos';

import './ProgressBar';
import type { ProgressBar } from './ProgressBar';

import { randomIntFromRange } from './Randomizer';

import './ScoreBox';
import type { ScoreBox } from './ScoreBox';

import { ChildNotFoundError } from './ChildNotFoundError';
import { GameLogger } from './GameLogger';
import { ParseGametimeFromUrl } from './GametimeParameters';

import './MessageDialogV2';
import type { MessageDialogV2 } from './MessageDialogV2';

import './GameOverDialogV2';
import type {
  GameOverDialogV2,
  GameOverDialogCloseEvent,
} from './GameOverDialogV2';
import { DescribeNumberLineParameters } from './NumberLineParameters';

class ClickTheRightPhotoOnNumberLineApp extends LitElement {
  @property({ type: Number })
  accessor numberToClick: number;
  @property({ type: Number })
  accessor minimum: number;
  @property({ type: Number })
  accessor maximum: number;
  @property({ type: Boolean })
  accessor show10TickMarks: boolean;
  @property({ type: Boolean })
  accessor show5TickMarks: boolean;
  @property({ type: Boolean })
  accessor show1TickMarks: boolean;
  @property({ type: Boolean })
  accessor _showAll10Numbers: boolean;
  @property({ type: Array })
  accessor positions: number[];
  @property({ type: Array })
  accessor disabledPositions: number[];
  @state()
  accessor numberOk: number;
  @state()
  accessor numberNok: number;
  @property({ type: Number })
  accessor gameTime: number;

  welcomeDialogRef: Ref<MessageDialogV2> = createRef();
  gameOverDialogRef: Ref<GameOverDialogV2> = createRef();

  private gameLogger = new GameLogger('T', 'a');

  constructor() {
    super();
    this.minimum = 0;
    this.maximum = 100;

    this.show1TickMarks = false;
    this.show5TickMarks = false;
    this.show10TickMarks = false;
    this._showAll10Numbers = false;

    this.numberToClick = 8;
    this.positions = [];
    this.disabledPositions = [];

    this.numberNok = 0;
    this.numberOk = 0;

    this.gameTime = 60;

    this.parseUrl();

    //        this.startNewGame();
  }

  parseUrl() {
    this.gameTime = ParseGametimeFromUrl(60);
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has('minimum')) {
      const minimum = parseInt(urlParams.get('minimum') || '', 10);
      if (minimum % 10 === 0) {
        this.minimum = minimum;
      }
    }
    if (urlParams.has('maximum')) {
      const maximum = parseInt(urlParams.get('maximum') || '', 10);
      if (maximum % 10 === 0) {
        this.maximum = maximum;
      }
    }
    this.numberToClick = Math.floor((this.maximum + this.minimum) / 2);

    if (urlParams.has('show10TickMarks')) {
      this.show10TickMarks = true;
    } else if (urlParams.has('hide10TickMarks')) {
      this.show10TickMarks = false;
    }
    if (urlParams.has('show5TickMarks')) {
      this.show5TickMarks = true;
    } else if (urlParams.has('hide5TickMarks')) {
      this.show5TickMarks = false;
    }
    if (urlParams.has('show1TickMarks')) {
      this.show1TickMarks = true;
    } else if (urlParams.has('hide1TickMarks')) {
      this.show1TickMarks = false;
    }
    if (urlParams.has('showAll10Numbers')) {
      this._showAll10Numbers = true;
    } else if (urlParams.has('hideAll10Numbers')) {
      this._showAll10Numbers = false;
    }
  }

  handlePhotoClicked(event: CustomEvent) {
    if (event.detail.position !== this.numberToClick) {
      this.disabledPositions = this.disabledPositions.concat(
        event.detail.position,
      );
      this.numberNok += 1;
    } else {
      this.numberOk += 1;
      this.startNewRound();
    }
  }

  handleGameOverDialogClose(evt: GameOverDialogCloseEvent) {
    if (evt.action === 'NewGame') window.location.href = 'index.html';
    else if (evt.action === 'PlayAgain') this.startNewGame();
    else throw new Error(`Game over dialog exited with an unknown action`);
  }

  handleCloseWelcomeDialog() {
    this.startNewGame();
  }

  startNewGame() {
    this.numberNok = 0;
    this.numberOk = 0;
    this._progressBar.restart();
    this.startNewRound();
  }

  startNewRound() {
    this.disabledPositions = [];
    this.numberToClick = randomIntFromRange(this.minimum, this.maximum);
    this.positions = [this.numberToClick];
    while (this.positions.length < 4) {
      const position = randomIntFromRange(this.minimum, this.maximum);
      if (!this.positions.some(element => element === position))
        this.positions.push(position);
    }
  }

  /** Get the scoreBox child
   *  @throws {ChildNotFoundError} Child was not found, probably because app was not rendered yet.
   */
  get _scoreBox(): ScoreBox {
    const ret = this.renderRoot.querySelector<ScoreBox>('#scoreBox');
    if (ret === null) {
      throw new ChildNotFoundError(
        'scoreBox',
        'ClickTheRightPhotoOnNumberLineApp',
      );
    }
    return ret;
  }

  /** Get the progressBar child
   *  @throws {ChildNotFoundError} Child was not found, probably because app was not rendered yet.
   */
  get _progressBar(): ProgressBar {
    const ret = this.renderRoot.querySelector<ProgressBar>('#progressBar');
    if (ret === null) {
      throw new ChildNotFoundError(
        'progressBar',
        'ClickTheRightPhotoOnNumberLineApp',
      );
    }
    return ret;
  }

  /** Get the numberLine child
   *  @throws {ChildNotFoundError} Child was not found, probably because app was not rendered yet.
   */
  get _numberLine(): NumberLineHangingPhotos {
    const ret =
      this.renderRoot.querySelector<NumberLineHangingPhotos>('#numberLine');
    if (ret === null) {
      throw new ChildNotFoundError(
        'numberLine',
        'ClickTheRightPhotoOnNumberLineApp',
      );
    }
    return ret;
  }

  handleTimeUp(): void {
    this.gameLogger.logGameOver();
    if (this.gameOverDialogRef.value) this.gameOverDialogRef.value.showModal();
    else
      throw new Error(
        `Game over dialog has not been rendered during game over`,
      );
  }

  renderWelcomeDialog(): HTMLTemplateResult {
    return html`
      <message-dialog-v2
        initialOpen
        id="welcomeDialog"
        .title=${'Kies de juiste foto'}
        .buttonText=${'Start'}
        @close=${() => this.handleCloseWelcomeDialog()}
        ${ref(this.welcomeDialogRef)}
      >
        <p>Kies de juiste foto op de getallenlijn.</p>
        <p>Dit spel kun je op de telefoon het beste horizontaal spelen.</p>
      </message-dialog-v2>
    `;
  }

  renderGameOverDialog(): HTMLTemplateResult {
    return html` <game-over-dialog-v2
      ${ref(this.gameOverDialogRef)}
      id="gameOverDialog"
      @close=${(evt: GameOverDialogCloseEvent) =>
        this.handleGameOverDialogClose(evt)}
      .numberOk=${this.numberOk}
      .numberNok=${this.numberNok}
      .gameTime=${this.gameTime}
    >
      <p>Je hebt het <i>Kies de juiste foto</i> spel gespeeld</p>
      <p>
        De getallenlijn liep van
        ${DescribeNumberLineParameters({
          minimum: this.minimum,
          maximum: this.maximum,
          show10TickMarks: this.show10TickMarks,
          show1TickMarks: this.show1TickMarks,
          show5TickMarks: this.show5TickMarks,
          showAll10Numbers: this._showAll10Numbers,
        })}
      </p>
    </game-over-dialog-v2>`;
  }

  render() {
    return html`
      <progress-bar
        style="--progress-bar-gametime: ${this.gameTime}s;"
        id="progressBar"
        @timeUp=${() => this.handleTimeUp()}
      ></progress-bar>
      <score-box
        id="scoreBox"
        numberOk=${this.numberOk}
        numberNok=${this.numberNok}
        style="width: 12vmin;
                              --scoreBoxWidth: 12vmin; 
                              position: absolute; 
                              top: calc(1em + 22px); 
                              right: 1em;"
      >
      </score-box>
      <div style="text-align: center; font-size: 8vw;">
        ${this.numberToClick}
      </div>
      <number-line-hanging-photos
        id="numberLine"
        ?show10TickMarks=${this.show10TickMarks}
        ?show5TickMarks=${this.show5TickMarks}
        ?show1TickMarks=${this.show1TickMarks}
        ?showAll10Numbers=${this._showAll10Numbers}
        minimum=${this.minimum}
        maximum=${this.maximum}
        width="95vw"
        .photoPositions=${this.positions}
        .disabledPositions=${this.disabledPositions}
        @photo-clicked=${(evt: CustomEvent) => this.handlePhotoClicked(evt)}
        style="position:absolute; 
                    left: 2.5vw; 
                    top: 30vh; 
                    width:95vw;"
      >
      </number-line-hanging-photos>

      ${this.renderWelcomeDialog()} ${this.renderGameOverDialog()}
    `;
  }
}

customElements.define(
  'click-correct-photo-on-numberline-app',
  ClickTheRightPhotoOnNumberLineApp,
);
