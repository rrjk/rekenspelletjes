/* eslint-disable class-methods-use-this */
import { LitElement, html } from 'lit';

import './NumberLine';
import type { NumberLine } from './NumberLineHangingPhotos';

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

class FindOnNumberLineApp extends LitElement {
  private numberOk = 0;
  private numberNok = 0;
  private numberToClick = 45;
  private show10TickMarks = true;
  private show5TickMarks = false;
  private show1TickMarks = false;
  private showAll10Numbers = true;
  private minimum = 0;
  private maximum = 100;

  private getElement<T>(query: string): T {
    const ret = <T | null>this.renderRoot.querySelector(query);
    if (ret === null) {
      throw new ChildNotFoundError(query, 'FindOnNumberApp');
    }
    return ret;
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

  handleTimeUp(): void {
    this.gameOverDialog
      .show(
        html` <p>
            Je hebt ${this.numberOk === 0 ? 'geen' : this.numberOk}
            ${this.numberOk === 1 ? 'foto' : "foto's"} goed op de getallenlijn
            geprikt.
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

  startNewGame() {
    console.log('startNewGame');
  }

  async firstUpdated() {
    await this.updateComplete;
    await this.showWelcomeMessage();
    this.progressBar.restart();
    this.startNewGame();
  }

  override async getUpdateComplete() {
    const result = await super.getUpdateComplete();
    await this.progressBar.updateComplete;
    await this.numberLine.updateComplete;
    await this.scoreBox.updateComplete;
    await this.gameOverDialog.updateComplete;
    await this.messageDialog.updateComplete;
    return result;
  }

  async showWelcomeMessage() {
    return this.messageDialog.show(
      'Vind op de getallenlijn',
      html`<p>Zet het platteau op de juiste plek op de getallenlijn</p>
        <p>Dit spel kun je op de telefoon het beste horizontaal spelen.</p>`
    );
  }

  render() {
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

      <div style="text-align: center; font-size: 8vw;">
        ${this.numberToClick}
      </div>
      <number-line
        id="numberLine"
        ?show10TickMarks=${this.show10TickMarks}
        ?show5TickMarks=${this.show5TickMarks}
        ?show1TickMarks=${this.show1TickMarks}
        ?showAll10Numbers=${this.showAll10Numbers}
        minimum=${this.minimum}
        maximum=${this.maximum}
        width="95vw"
        style="position:absolute; 
                    left: 2.5vw; 
                    top: 60vh; 
                    width:95vw;"
      >
      </number-line>
      <message-dialog id="messageDialog"></message-dialog>
      <gameover-dialog id="gameOverDialog"></gameover-dialog>
    `;
  }
}

customElements.define('find-on-numberline-app', FindOnNumberLineApp);
