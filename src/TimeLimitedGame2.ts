import { html, css } from 'lit';
import type { HTMLTemplateResult, CSSResultArray } from 'lit';

import { state } from 'lit/decorators.js';

import { ProgressBar } from './ProgressBar';

import { ParseGametimeFromUrl } from './GametimeParameters';

import { GameSkeleton } from './GameSkeleton';

import './RealHeight';

export abstract class TimeLimitedGame2 extends GameSkeleton {
  /** Gametime in number of seconds.
   * Number of seconds the game was played, correct at the end of the game.
   */
  @state()
  protected accessor gameTime = 0;

  /** Constructor, parse URL parameters */
  constructor() {
    super();
    this.gameTime = ParseGametimeFromUrl(60);
  }

  /** Get the progress bar. */
  private get progressBar(): ProgressBar {
    return this.getElement<ProgressBar>('#progressBar');
  }

  /** Additional first update actions, can be overriden in child classes */
  additionalFirstUpdatedActions() {
    super.additionalFirstUpdatedActions();
  }

  /** Get the gametime in minutes as string for display */
  protected getGameTimeString() {
    const minutes = Math.floor(this.gameTime / 60);
    const seconds = this.gameTime % 60;

    let ret: string;
    if (seconds === 0)
      ret = `${minutes} ${minutes === 1 ? 'minuut' : 'minuten'}`;
    else ret = `${minutes}:${seconds.toString().padStart(2, '0')} minuten`;

    return ret;
  }

  override async getUpdateComplete(): Promise<boolean> {
    const result = await super.getUpdateComplete();
    await this.progressBar.updateComplete;
    return result;
  }

  static get styles(): CSSResultArray {
    return [
      ...super.styles,
      css`
        .fullGame {
          display: grid;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          box-sizing: border-box;
          grid-template-rows: ${ProgressBar.height}px 1fr;
        }
        .gameContent {
          width: calc(var(--vw) * 100);
          height: calc(var(--vh) * 100 - 20px);
          box-sizing: border-box;
        }
      `,
    ];
  }

  /** Render the actual game content within the game area of the the game
   * Is empty for the TimeLimitedGame, should be overridden in children.
   */
  renderGameContent(): HTMLTemplateResult {
    return html`Placeholder for gamecontent - the be filled by descendents of
    TimeLimitedGame2`;
  }

  /** Render the actual game within the gameskeleton */
  renderGame(): HTMLTemplateResult {
    return html`
      <div class="fullGame">
        <progress-bar
          style="--progress-bar-gametime: ${this
            .gameTime}s; width:calc(100 * var(--vw));"
          id="progressBar"
          @timeUp=${() => this.handleGameOver()}
          integrateScoreBox
          numberOk=${this.numberOk}
          numberNok=${this.numberNok}
        ></progress-bar>
        <div class="gameContent">${this.renderGameContent()}</div>
      </div>
    `;
  }

  /** Start a new game.
   * Overruled from parent to also reset the progress bar.
   */
  startNewGame(): void {
    super.startNewGame();
    this.progressBar.restart();
  }
}
