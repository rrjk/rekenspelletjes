import { html, css } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, state } from 'lit/decorators.js';
import type { CSSResultGroup, HTMLTemplateResult } from 'lit';

import { TimeLimitedGame } from './TimeLimitedGame';
import {
  randomFromSet,
  randomFromSetAndSplice,
  randomIntFromRange,
} from './Randomizer';
import './AscendingBalloons';
import type { Answers, AscendingBalloons } from './AscendingBalloons';
import { GameLogger } from './GameLogger';

@customElement('mutiplication-tables-balloon-game-app')
export class MultiplicationTablesBalloonGameApp extends TimeLimitedGame {
  @state()
  private firstNumber = 1;
  @state()
  private secondNumber = 1;
  @state()
  private answers: Answers = { correct: 1, incorrect: [2, 3, 4] };
  @state()
  private gameElementsDisabled = true;

  private tablesToUse: number[] = [];
  private gameLogger = new GameLogger('C', '');

  constructor() {
    super();
    this.parseUrl();
  }

  private parseUrl(): void {
    const urlParams = new URLSearchParams(window.location.search);

    const tablesFromUrl = urlParams.getAll('table');

    tablesFromUrl.forEach(tableAsString => {
      const table = parseInt(tableAsString, 10);
      if (
        !Number.isNaN(table) &&
        table >= 1 &&
        table <= 10 &&
        !this.tablesToUse.find(value => value === table)
      ) {
        this.tablesToUse.push(table);
      }
    });
    if (this.tablesToUse.length === 0)
      this.tablesToUse = [2, 3, 4, 5, 6, 7, 8, 9, 10];
  }

  /** Get the ascending balloons child */
  private get ascendingBalloons(): AscendingBalloons {
    return this.getElement('#ascendingBalloons');
  }

  /** Get all static styles */
  static get styles(): CSSResultGroup {
    return css`
      .exercise {
        font-size: calc(1em + 4vmin);
      }
    `;
  }

  override async getUpdateComplete(): Promise<boolean> {
    const result = await super.getUpdateComplete();
    await this.ascendingBalloons.updateComplete;
    return result;
  }

  /** Start a new game.
   * Progress bar and counters are automatically reset.
   */
  startNewGame(): void {
    this.newRound();
  }

  /** Get the text to show in the game over dialog */
  get welcomeMessage(): HTMLTemplateResult {
    let tablesAsScentence = '';

    this.tablesToUse.forEach((value, index) => {
      let suffix = ``;
      if (index === this.tablesToUse.length - 2) suffix = ` en `;
      else if (index < this.tablesToUse.length - 2) suffix = `, `;
      tablesAsScentence = tablesAsScentence.concat(`${value}${suffix}`);
    });
    tablesAsScentence = tablesAsScentence.concat('.');

    return html`<p>
        De tafel${this.tablesToUse.length === 1 ? '' : 's'} van
        ${tablesAsScentence}
      </p>
      <p>Klik op de ballon met het juiste antwoord.</p> `;
  }

  /** Get the title for the welcome dialog. */
  get welcomeDialogTitle(): string {
    return `Tafeltjes oefenen`;
  }

  private handleCorrectAnswer(): void {
    this.numberOk += 1;
    this.newRound();
  }

  private handleWrongAnswer(): void {
    this.numberNok += 1;
  }

  private handleAscensionComplete(): void {
    this.numberNok += 1;
    this.newRound();
  }

  private newRound() {
    let proposedFirstNumber = randomIntFromRange(1, 10);
    while (proposedFirstNumber === this.firstNumber)
      proposedFirstNumber = randomIntFromRange(1, 10);
    this.firstNumber = proposedFirstNumber;

    this.secondNumber = randomFromSet(this.tablesToUse);
    const answer = this.firstNumber * this.secondNumber;

    const possibleAnswers = [];
    for (let i = 1; i <= 10; i++) {
      if (i * this.secondNumber !== answer)
        possibleAnswers.push(i * this.secondNumber);
    }
    this.answers = {
      correct: answer,
      incorrect: [
        randomFromSetAndSplice(possibleAnswers),
        randomFromSetAndSplice(possibleAnswers),
        randomFromSetAndSplice(possibleAnswers),
      ],
    };
    this.ascendingBalloons.restartAscension();
    this.gameElementsDisabled = false;
  }

  executeGameOverActions(): void {
    this.gameElementsDisabled = true;
    this.gameLogger.logGameOver();
  }

  /** Render the application */
  render(): HTMLTemplateResult {
    return html`
      ${this.renderTimedGameApp()}
      <ascending-balloons
        id="ascendingBalloons"
        style="position: absolute; top: 0; left: 0; height: 100%; width:100%;"
        @correct-balloon-clicked="${() => this.handleCorrectAnswer()}"
        @wrong-balloon-clicked="${() => this.handleWrongAnswer()}"
        @ascension-complete="${() => this.handleAscensionComplete()}"
        .answers=${this.answers}
        ?disabled=${this.gameElementsDisabled}
      ></ascending-balloons>
      <div
        class="exercise"
        style="display: ${this.gameElementsDisabled
          ? 'none'
          : 'block'}; position: absolute; top: 20%; width: 100%; text-align: center;"
      >
        ${this.firstNumber} × ${this.secondNumber} = ?
      </div>
    `;
  }
}
