import { LitElement, html, css } from 'lit';
import { state } from 'lit/decorators.js';
import { createRef, ref, Ref } from 'lit/directives/ref.js';

import type { HTMLTemplateResult, CSSResultArray } from 'lit';

import './MessageDialogV2';
import type { MessageDialogV2 } from './MessageDialogV2';

import './GameOverDialogV2';
import type {
  GameOverDialogV2,
  GameOverDialogCloseEvent,
} from './GameOverDialogV2';

import { ChildNotFoundError } from './ChildNotFoundError';

export abstract class GameSkeleton extends LitElement {
  /** Number correct answers */
  @state()
  protected accessor numberOk = 0;
  /** Number incorrect answers */
  @state()
  protected accessor numberNok = 0;
  /** Image to use for the welcome diaglog, can be overruled in the constructor of children */
  @state()
  protected accessor welcomeDialogImageUrl = new URL(
    '../images/Mompitz Otto.png',
    import.meta.url,
  );
  @state()
  protected accessor dialogVisible = true; // Upon start the welcom dialog is open

  private welcomeDialogRef: Ref<MessageDialogV2> = createRef();
  private gameOverDialogRef: Ref<GameOverDialogV2> = createRef();

  /** Helper function to easily query for an element.
   *  @param query Querystring for the element.
   *  @template T The type of the element.
   *  @throws ChildNotFoundError in case the element can't be found.
   *
   */
  protected getElement<T>(query: string): T {
    const ret = this.renderRoot.querySelector(query) as T | null;
    if (ret === null) {
      throw new ChildNotFoundError(query, 'TimeLimitedGame');
    }
    return ret;
  }

  /** Get the text to show in the welcome dialog */
  abstract get welcomeMessage(): HTMLTemplateResult;

  /** Get the title for the welcome dialog. */
  abstract get welcomeDialogTitle(): string;

  /** Get the gametime in minutes as string for display
   * To be implemented by the children, should contain the time the game was played as mm:ss
   */
  protected abstract getGameTimeString(): string;

  /** Get the gametime in seconds
   * To be implemented by the children, should contain the time the game was played as mm:ss
   */
  protected abstract getGameTime(): number;

  /** Reset the number of correct and incorrect answers. */
  private resetCounters(): void {
    this.numberNok = 0;
    this.numberOk = 0;
  }

  firstUpdated(): void {
    /* Workaround for bug found in firefox where draggable=false is ignored in case user-select is set to none.
     * Please note that this expression cannot pierce into webcomponent's shadowroms.
     * The img in slots are found though.
     */
    if (window.navigator.userAgent.toLowerCase().includes('firefox')) {
      this.renderRoot.querySelectorAll('img[draggable=false]').forEach(el => {
        el.addEventListener('mousedown', event => event.preventDefault());
      });
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

  /** Render the actual game
   * Is empty for this game skeleton, should be overridden in children.
   */
  renderGame(): HTMLTemplateResult {
    return html`Placeholder for gamecontent - the be filled by descendents of
    GameSkeleton`;
  }

  static get styles(): CSSResultArray {
    return [
      css`
        .wholeScreen {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
        }
      `,
    ];
  }

  renderWelcomeDialog(): HTMLTemplateResult {
    return html`
      <message-dialog-v2
        initialOpen
        id="welcomeDialog"
        .title=${this.welcomeDialogTitle}
        .buttonText=${'Start'}
        .imageURL=${this.welcomeDialogImageUrl}
        @close=${() => this.handleCloseWelcomeDialog()}
        ${ref(this.welcomeDialogRef)}
      >
        ${this.welcomeMessage}
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
      .gameTime=${this.getGameTime()}
    >
      ${this.gameOverIntroductionText}
    </game-over-dialog-v2>`;
  }

  /** Render the application */
  render(): HTMLTemplateResult {
    return html`
      ${this.renderWelcomeDialog()} ${this.renderGameOverDialog()}
      <div class="wholeScreen">${this.renderGame()}</div>
    `;
  }

  get timePlayedForGameOverText(): HTMLTemplateResult {
    return html`<p>Je hebt ${this.getGameTimeString()} gespeeld.</p>`;
  }

  get numberOkForGameOverText(): HTMLTemplateResult {
    return html`
      <p>
        Je hebt ${this.numberOk === 0 ? 'geen' : `${this.numberOk}`}
        ${this.numberOk === 1 ? 'goed antwoord' : 'goede antwoorden'} gegeven.
      </p>
    `;
  }

  get numberNokForGameOverText(): HTMLTemplateResult {
    return html` <p>
      Je hebt ${this.numberNok === 0 ? 'geen' : this.numberNok}
      ${this.numberNok === 1 ? 'fout' : 'fouten'} gemaakt.
    </p>`;
  }

  get scoreForGameOverText(): HTMLTemplateResult {
    return html` <p>Je score is ${this.numberOk - this.numberNok}</p> `;
  }

  get resultsForGameOverText(): HTMLTemplateResult {
    return html`${this.timePlayedForGameOverText}
    ${this.numberOkForGameOverText} ${this.numberNokForGameOverText}
    ${this.scoreForGameOverText}`;
  }

  get gameOverIntroductionText(): HTMLTemplateResult {
    return html`<p>Het spel is afgelopen.</p>`;
  }

  /** Start a new game.
   * Action to perform when starting a new game.
   * When overruled by a child, the super needs to be called
   */
  startNewGame(): void {
    this.dialogVisible = false;
    this.resetCounters();
  }

  /** Handle game over */
  handleGameOver(): void {
    this.executeGameOverActions();
    this.dialogVisible = true;

    if (this.gameOverDialogRef.value) this.gameOverDialogRef.value.showModal();
    else throw new Error('Error in showing game over dialog');
  }

  /** Actions to perform before the game over dialog is shown.
   * Need not be overriden in the derived class, in that case nothing is done.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  executeGameOverActions(): void {}
}
