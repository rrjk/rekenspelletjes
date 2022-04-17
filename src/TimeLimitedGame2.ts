import { html } from 'lit';

// eslint-disable-next-line import/extensions
import type { HTMLTemplateResult } from 'lit';

import './ProgressBar';
import type { ProgressBar } from './ProgressBar';

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

  /** Handle the time up, when the game is over. */
  handleTimeUp(): void {
    this.executeGameOverActions();
    this.gameOverDialog.show(this.gameOverText).then(result => {
      if (result === 'again') {
        this.startNewGame();
      } else window.location.href = 'index.html';
    });
  }

  /** Additional first update actions, can be overriden in child classes */
  additionalFirstUpdatedActions() {
    super.additionalFirstUpdatedActions();
  }

  /*
   Actions performed after the first update is complete. 
  async firstUpdated(): Promise<void> {
    await this.updateComplete;
    this.additionalFirstUpdatedActions();
    await this.showWelcomeMessage();
    this.startNewGame();
  }
*/
  override async getUpdateComplete(): Promise<boolean> {
    const result = await super.getUpdateComplete();
    await this.progressBar.updateComplete;
    return result;
  }

  /** Render the application */
  renderTimedGameApp(): HTMLTemplateResult {
    return html`
      ${this.renderGameSkeleton()}
      <progress-bar
        style="--progress-bar-gametime: ${this
          .gameTime}s; width:calc(100 * var(--vw));"
        id="progressBar"
        @timeUp="${() => this.handleTimeUp()}"
        integrateScoreBox
        numberOk="${this.numberOk}"
        numberNok="${this.numberNok}"
      ></progress-bar>
    `;
  }

  /** Start a new game.
   * Overruled from parent to also reset the progress bar.
   */
  startNewGame(): void {
    console.log('TimeLimitedGame2 - startNewGame');
    super.startNewGame();
    this.progressBar.restart();
  }
}
