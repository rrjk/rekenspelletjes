import { html, css } from 'lit';

// eslint-disable-next-line import/extensions
import type { HTMLTemplateResult, CSSResultArray } from 'lit';

import { ProgressBar } from './ProgressBar';

import { ParseGametimeFromUrl } from './GametimeParameters';

import { GameSkeleton } from './GameSkeleton';

export abstract class TimeLimitedGame2 extends GameSkeleton {
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
      `,
    ];
  }

  /** Render the actual game content within the game area of the the game
   * Is empty for the TimeLimitedGame, should be overridden in children.
   */
  renderGameContent(): HTMLTemplateResult {
    return html``;
  }

  /** Render the actual game within the gameskeleton */
  renderGame(): HTMLTemplateResult {
    return html`
      <div class="fullGame">
        <progress-bar
          style="--progress-bar-gametime: ${this
            .gameTime}s; width:calc(100 * var(--vw));"
          id="progressBar"
          @timeUp="${() => this.handleGameOver()}"
          integrateScoreBox
          numberOk="${this.numberOk}"
          numberNok="${this.numberNok}"
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
