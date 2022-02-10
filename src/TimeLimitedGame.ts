import { LitElement, html } from 'lit';
// eslint-disable-next-line import/extensions
import { state } from 'lit/decorators.js';
import type { HTMLTemplateResult } from 'lit';

import './ProgressBar';
import type { ProgressBar } from './ProgressBar';

import './ScoreBox';
import type { ScoreBox } from './ScoreBox';

import './MessageDialog';
import type { MessageDialog } from './MessageDialog';

import './GameOverDialog';
import type { GameOverDialog } from './GameOverDialog';

import { ChildNotFoundError } from './ChildNotFoundError';

import { ParseGametimeFromUrl } from './GametimeParameters';

export type ScoreLocationBoxEnum =
  | 'integrateScoreBoxInProgressBar'
  | 'separateScoreBoxInProgressBar';

export abstract class TimeLimitedGame extends LitElement {
  /** Number correct answers */
  @state()
  protected numberOk = 0;
  /** Number incorrect answers */
  @state()
  protected numberNok = 0;
  /** Gametime in number of seconds */
  @state()
  private gameTime: number;
  @state()
  protected welcomeDialogImageUrl = new URL(
    '../images/Mompitz Otto.png',
    import.meta.url
  );
  @state()
  integrateScoreInProgressBar = false;

  /** Constructor, parse URL parameters */
  constructor(
    scoreLocation: ScoreLocationBoxEnum = 'separateScoreBoxInProgressBar'
  ) {
    super();
    this.gameTime = ParseGametimeFromUrl(60);
    if (scoreLocation === 'separateScoreBoxInProgressBar')
      this.integrateScoreInProgressBar = false;
    else this.integrateScoreInProgressBar = true;
  }

  /** Helper function to easily query for an element.
   *  @param query Querystring for the element.
   *  @template T The type of the element.
   *  @throws ChildNotFoundError in case the element can't be found.
   *
   */
  protected getElement<T>(query: string): T {
    const ret = <T | null>this.renderRoot.querySelector(query);
    if (ret === null) {
      throw new ChildNotFoundError(query, 'TimeLimitedGame');
    }
    return ret;
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

  /** Handle the time up, when the game is over. */
  handleTimeUp(): void {
    this.executeGameOverActions();
    this.gameOverDialog.show(this.gameOverText).then(result => {
      if (result === 'again') {
        this.resetTimerAndCounters();
        this.startNewGame();
      } else window.location.href = 'index.html';
    });
  }

  /** Reset the timer and the number of correct and incorrect answers. */
  resetTimerAndCounters(): void {
    this.progressBar.restart();
    this.numberNok = 0;
    this.numberOk = 0;
  }

  /** Actions performed after the first update is complete. */
  async firstUpdated(): Promise<void> {
    await this.updateComplete;
    await this.showWelcomeMessage();
    this.resetTimerAndCounters();
    this.startNewGame();
  }

  override async getUpdateComplete(): Promise<boolean> {
    const result = await super.getUpdateComplete();
    await this.progressBar.updateComplete;
    if (!this.integrateScoreInProgressBar) await this.scoreBox.updateComplete;
    await this.gameOverDialog.updateComplete;
    await this.messageDialog.updateComplete;
    return result;
  }

  /** Show the welcome message */
  async showWelcomeMessage(): Promise<string> {
    return this.messageDialog.show(
      this.welcomeDialogTitle,
      this.welcomeMessage
    );
  }

  /** Render the application */
  renderTimedGameApp(): HTMLTemplateResult {
    return html`
      <progress-bar
        style="--progress-bar-gametime: ${this
          .gameTime}s; width:calc(100 * var(--vw));"
        id="progressBar"
        @timeUp="${() => this.handleTimeUp()}"
        ?integrateScoreBox=${this.integrateScoreInProgressBar}
        numberOk="${this.numberOk}"
        numberNok="${this.numberNok}"
      ></progress-bar>

      ${this.integrateScoreInProgressBar === true
        ? html``
        : html` <score-box
            id="scoreBox"
            numberOk="${this.numberOk}"
            numberNok="${this.numberNok}"
            style="width: 13vmin;--scoreBoxWidth: 13vmin; position: absolute; top: calc(1em + 22px); right: 1em;"
          >
          </score-box>`}

      <message-dialog
        id="messageDialog"
        .imageUrl=${this.welcomeDialogImageUrl}
      ></message-dialog>

      <gameover-dialog id="gameOverDialog"></gameover-dialog>
    `;
  }

  /* Function to be overriden in the extending class */

  /** Get the text to show in the game over dialog
   *  This function may be overriden, but need not to. In the latter case a standard text will be shown.
   */
  get gameOverText(): HTMLTemplateResult {
    return html` <p>
        Je hebt ${this.numberOk === 0 ? 'geen' : `${this.numberOk}`}
        ${this.numberOk === 1 ? 'goed antwoord' : 'goede antwoorden'} gegeven.
      </p>
      <p>
        Je hebt ${this.numberNok === 0 ? 'geen' : this.numberNok}
        ${this.numberNok === 1 ? 'fout' : 'fouten'} gemaakt.
      </p>`;
  }

  /** Start a new game.
   * Progress bar and counters are automatically reset.
   */
  abstract startNewGame(): void;

  /** Get the text to show in the game over dialog */
  abstract get welcomeMessage(): HTMLTemplateResult;

  /** Get the title for the welcome dialog. */
  abstract get welcomeDialogTitle(): string;

  /** Actions to perform before the game over dialog is shown.
   * Need not be overriden in the derived class, in that case nothing is done.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  executeGameOverActions(): void {}
}
