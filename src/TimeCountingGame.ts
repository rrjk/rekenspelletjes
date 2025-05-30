import { html, css } from 'lit';

import type { HTMLTemplateResult, CSSResultArray } from 'lit';

import { TimerBar } from './TimerBar';

import { GameSkeleton } from './GameSkeleton';

export abstract class TimeCountingGame extends GameSkeleton {
  protected timerPaused = true;

  /** Get the progress bar. */
  private get timerBar(): TimerBar {
    return this.getElement<TimerBar>('#timerBar');
  }

  /** Additional first update actions, can be overriden in child classes */
  additionalFirstUpdatedActions() {
    super.additionalFirstUpdatedActions();
  }

  override async getUpdateComplete(): Promise<boolean> {
    const result = await super.getUpdateComplete();
    await this.timerBar.updateComplete;
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
          grid-template-rows: ${TimerBar.height}px 1fr;
        }
        .gameContent {
          width: calc(var(--vw) * 100);
          height: calc(var(--vh) * 100 - 20px);
          box-sizing: border-box;
        }
      `,
    ];
  }

  /** Get the gametime in minutes as string for display
   */
  protected getGameTimeString(): string {
    return `${this.timerBar.getTimeAsString()} minuut`;
  }

  /** Render the actual game content within the game area of the the game
   * Is empty for the TimeCountingGame, should be overridden in children.
   */
  renderGameContent(): HTMLTemplateResult {
    return html``;
  }

  /** Render the actual game within the gameskeleton */
  renderGame(): HTMLTemplateResult {
    return html`
      <div class="fullGame">
        <timer-bar
          width:100%
          id="timerBar"
          numberOk=${this.numberOk}
          numberNok=${this.numberNok}
          ?paused=${this.timerPaused}
        ></timer-bar>
        <div class="gameContent">${this.renderGameContent()}</div>
      </div>
    `;
  }

  executeGameOverActions(): void {
    super.executeGameOverActions();
    this.timerPaused = true;
  }

  /** Start a new game.
   * Overruled from parent to also reset the timer bar.
   */
  startNewGame(): void {
    this.timerBar.resetTime();
    this.timerPaused = false;
    super.startNewGame();
  }
}
