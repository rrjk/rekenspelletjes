import { html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { CSSResultGroup, HTMLTemplateResult } from 'lit';

import { TimeLimitedGame } from './TimeLimitedGame';
import { randomFromSetAndSplice, randomIntFromRange } from './Randomizer';
import './AscendingBalloons';
import type { Answers, AscendingBalloons } from './AscendingBalloons';

@customElement('addition-substraction-within-decade-app')
export class AdditionSubstractionWithinDecadeApp extends TimeLimitedGame {
  @state()
  private firstNumber = 1;
  @state()
  private secondNumber = 1;
  @state()
  private operator: '+' | '-' = '+';
  @state()
  private answers: Answers = { correct: 1, incorrect: [2, 3, 4] };
  @state()
  private gameElementsDisabled = true;

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
    return html`<p>Klik op de ballon met het juiste antwoord</p> `;
  }

  /** Get the title for the welcome dialog. */
  get welcomeDialogTitle(): string {
    return `Sommen zoals 3+4`;
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
    this.firstNumber = randomIntFromRange(1, 9);
    this.secondNumber = randomIntFromRange(1, 10 - this.firstNumber);
    this.operator = '+';
    const answer = this.firstNumber + this.secondNumber;
    const possibleAnswers = [];
    for (let i = 1; i <= 10; i++) {
      if (i !== answer) possibleAnswers.push(i);
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
        ${this.firstNumber} ${this.operator} ${this.secondNumber} = ?
      </div>
    `;
  }
}
