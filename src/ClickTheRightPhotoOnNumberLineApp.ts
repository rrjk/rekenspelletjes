/* eslint-disable   @typescript-eslint/no-unsafe-argument -- legacy, use of CustomEvent details field */
/* eslint-disable   @typescript-eslint/no-unsafe-member-access -- legacy, use of CustomEvent details field */
/* eslint-disable   @typescript-eslint/no-misused-promises -- legacy */

import { LitElement, html } from 'lit';
import { state, property } from 'lit/decorators.js';

import './NumberLineHangingPhotos';
import type { NumberLineHangingPhotos } from './NumberLineHangingPhotos';

import './ProgressBar';
import type { ProgressBar } from './ProgressBar';

import { randomIntFromRange } from './Randomizer';

import './ScoreBox';
import type { ScoreBox } from './ScoreBox';

import './MessageDialog';
import type { MessageDialog } from './MessageDialog';

import './GameOverDialog';
import type { GameOverDialog } from './GameOverDialog';

import { ChildNotFoundError } from './ChildNotFoundError';
import { GameLogger } from './GameLogger';
import { ParseGametimeFromUrl } from './GametimeParameters';

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
  accessor _numberOk: number;
  @state()
  accessor _numberNok: number;
  @property({ type: Number })
  accessor time: number;

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

    this._numberNok = 0;
    this._numberOk = 0;

    this.time = 60;

    this.parseUrl();

    //        this.startNewGame();
  }

  parseUrl() {
    this.time = ParseGametimeFromUrl(60);
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
      this._numberNok += 1;
    } else {
      this._numberOk += 1;
      this.startNewRound();
    }
  }

  startNewGame() {
    this._numberNok = 0;
    this._numberOk = 0;
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

  /** Get the messageDialog child
   *  @throws {ChildNotFoundError} Child was not found, probably because app was not rendered yet.
   */
  get _messageDialog(): MessageDialog {
    const ret = this.renderRoot.querySelector<MessageDialog>('#messageDialog');
    if (ret === null) {
      throw new ChildNotFoundError(
        'messageDialog',
        'ClickTheRightPhotoOnNumberLineApp',
      );
    }
    return ret;
  }

  /** Get the gameOverDialog child
   *  @throws {ChildNotFoundError} Child was not found, probably because app was not rendered yet.
   */
  get _gameOverDialog(): GameOverDialog {
    const ret =
      this.renderRoot.querySelector<GameOverDialog>('#gameOverDialog');
    if (ret === null) {
      throw new ChildNotFoundError(
        'gameOverDialog',
        'ClickTheRightPhotoOnNumberLineApp',
      );
    }
    return ret;
  }

  async firstUpdated() {
    await this.updateComplete;
    await this.showWelcomeMessage();
    this._progressBar.restart();
    this.startNewGame();
  }

  override async getUpdateComplete() {
    const result = await super.getUpdateComplete();
    await this._progressBar.updateComplete;
    await this._numberLine.updateComplete;
    await this._scoreBox.updateComplete;
    await this._gameOverDialog.updateComplete;
    await this._messageDialog.updateComplete;
    return result;
  }

  async showWelcomeMessage() {
    return this._messageDialog.show(
      'De juiste foto kiezen',
      html`<p>Kies de juiste foto op de getallenlijn.</p>
        <p>Dit spel kun je op de telefoon het beste horizontaal spelen.</p>`,
    );
  }

  handleTimeUp(): void {
    this.gameLogger.logGameOver();
    this._gameOverDialog
      .show(
        html` <p>
            Je hebt ${this._numberOk === 0 ? 'geen' : this._numberOk}
            ${this._numberOk === 1 ? 'foto' : "foto's"} goed aanklikt in 1
            minuut.
          </p>
          <p>
            Je hebt ${this._numberNok === 0 ? 'geen' : this._numberNok}
            ${this._numberNok === 1 ? 'fout' : 'fouten'} gemaakt.
          </p>
          <p>Je score is ${this._numberOk - this._numberNok}.</p>`,
      )
      .then(result => {
        if (result === 'again') this.startNewGame();
        else window.location.href = 'index.html';
      })
      .catch(() => {
        throw new Error('Game Over Dialog threw an exception');
      });
  }

  render() {
    return html`
      <progress-bar
        style="--progress-bar-gametime: ${this.time}s;"
        id="progressBar"
        @timeUp=${() => this.handleTimeUp()}
      ></progress-bar>
      <score-box
        id="scoreBox"
        numberOk=${this._numberOk}
        numberNok=${this._numberNok}
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
      <message-dialog id="messageDialog"></message-dialog>
      <gameover-dialog id="gameOverDialog"></gameover-dialog>
    `;
  }
}

customElements.define(
  'click-correct-photo-on-numberline-app',
  ClickTheRightPhotoOnNumberLineApp,
);
