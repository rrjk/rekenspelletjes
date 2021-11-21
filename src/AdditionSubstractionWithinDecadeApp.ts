import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { CSSResultGroup, HTMLTemplateResult } from 'lit';

/*
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

import { ParseGametimeFromUrl } from './GametimeParameters';
*/

export class AdditionSubstractionWithinDecadeApp extends LitElement {
  /** Number correct answers */
  @state()
  private numberOk = 0;
  /** Number incorrect answers */
  @state()
  private numberNok = 0;
  @state()
  private gameTime;

  dummy = 0;

  /** Constructor, parse URL parameters */
  constructor() {
    super();
    this.gameTime = ParseGametimeFromUrl(60);
  }

  /** Get all static styles */
  static get styles(): CSSResultGroup {
    return css`
      :host {
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
    this.gameOverDialog
      .show(
        html` <p>
            Je hebt ${this.numberOk === 0 ? 'geen' : `${this.numberOk}`}
            ${this.numberOk === 1 ? 'som' : 'sommen'} goed gemaakt.
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

  /** Start a new game, resets the timer and the number of correct and incorrect answer. */
  startNewGame(): void {
    this.progressBar.restart();
    /** Todo: rest */
    this.newRound();
  }

  /** Start a new round, a new number the student should jump to is set. */
  newRound(): void {
    this.dummy = 0;
    /** Todo: rest */
  }

  /** Ceck the answer the student has selected and make Jan jump. */
  async checkAnswer(): Promise<void> {
    this.dummy = 0;
    /** Todo: rest */
  }

  /** Actions performed after the first update is complete. */
  async firstUpdated(): Promise<void> {
    await this.updateComplete;
    await this.showWelcomeMessage();
    this.startNewGame();
  }

  override async getUpdateComplete(): Promise<boolean> {
    const result = await super.getUpdateComplete();
    // await this.progressBar.updateComplete;
    // await this.scoreBox.updateComplete;
    // await this.gameOverDialog.updateComplete;
    // await this.messageDialog.updateComplete;
    return result;
  }

  /** Show the welcome message */
  async showWelcomeMessage(): Promise<string> {
    return this.messageDialog.show(
      'Plus en minsommen binnen het tiental',
      html`<p>Klik op de juiste ballon om de sommen op te lossen.</p> `
    );
  }

  /** Render the application */
  render(): HTMLTemplateResult {
    return html`
      <!---
      <progress-bar
        style="--progress-bar-gametime: {this.gameTime}s;"
        id="progressBar"
        @timeUp="{() => this.handleTimeUp()}"
      ></progress-bar>

      <score-box
        id="scoreBox"
        numberOk="{this.numberOk}"
        numberNok="{this.numberNok}"
        style="width: 12vmin;--scoreBoxWidth: 12vmin; position: absolute; top: calc(1em + 22px); right: 1em;"
      >
      </score-box>
      <message-dialog id="messageDialog"></message-dialog>
      <gameover-dialog id="gameOverDialog"></gameover-dialog>
      --->
    `;
  }
}
