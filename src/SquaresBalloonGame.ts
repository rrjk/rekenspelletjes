import { html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { TimeLimitedGame2 } from './TimeLimitedGame2';
import {
  randomFromSet,
  randomFromSetAndSplice,
  randomIntFromRange,
} from './Randomizer';
import './AscendingBalloons';
import type { Answers, AscendingBalloons } from './AscendingBalloons';
import { GameLogger } from './GameLogger';
import { getHexagonAsSvgUrl } from './HexagonImage';
import { Operator } from './SquaresBalloonGameLink';

@customElement('squares-balloon-game-app')
export class SquaresBalloonGameApp extends TimeLimitedGame2 {
  @state()
  private accessor number = 1;
  @state()
  private accessor answers: Answers = { correct: 1, incorrect: [2, 3, 4] };
  @state()
  private accessor gameElementsDisabled = true;
  @state()
  private accessor operator: Operator = 'square';

  private operators: Operator[] = [];
  private maxBase: number = 10;
  private gameLogger = new GameLogger('Y', '');

  constructor() {
    super();
    this.parseUrl();
  }

  private parseUrl(): void {
    const urlParams = new URLSearchParams(window.location.search);

    const operatorsFromUrl = urlParams.getAll('operator');
    operatorsFromUrl.forEach(operator => {
      if (
        operator === 'square' &&
        !this.operators.find(value => value === 'square')
      )
        this.operators.push('square');
      else if (
        operator === 'root' &&
        !this.operators.find(value => value === 'root')
      )
        this.operators.push('root');
    });
    if (this.operators.length === 0) this.operators.push('square');

    const maxBaseFromUrl = urlParams.getAll('maxBase');
    if (maxBaseFromUrl.length === 0) this.maxBase = 10;
    else {
      const maxBase = parseInt(maxBaseFromUrl[0], 10);
      if (!Number.isNaN(maxBase) && maxBase >= 2 && maxBase <= 30)
        this.maxBase = maxBase;
    }

    this.welcomeDialogImageUrl = new URL(
      `data:image/svg+xml,${getHexagonAsSvgUrl('black', 'green')}`,
    );
  }

  /** Get the ascending balloons child */
  private get ascendingBalloons(): AscendingBalloons {
    return this.getElement('#ascendingBalloons');
  }

  /** Get all static styles */
  static get styles(): CSSResultArray {
    return [
      ...super.styles,
      css`
        .exercise {
          font-size: calc(1em + 4vmin);
        }
      `,
    ];
  }

  override async getUpdateComplete(): Promise<boolean> {
    const result = await super.getUpdateComplete();
    await this.ascendingBalloons.updateComplete;
    return result;
  }

  /** Start a new game.
   */
  startNewGame(): void {
    super.startNewGame();
    this.newRound();
  }

  get operatorsAsScentence(): HTMLTemplateResult {
    let operatorsAsScentence = '';

    if (this.operators.includes('square')) operatorsAsScentence = `kwadraten`;
    if (this.operators.length === 2)
      operatorsAsScentence = operatorsAsScentence.concat(` en `);
    if (this.operators.includes('root'))
      operatorsAsScentence = operatorsAsScentence.concat('worteltrekken');

    return html`${operatorsAsScentence}`;
  }

  get welcomeMessage(): HTMLTemplateResult {
    return html`
      <p>Oefenen met ${this.operatorsAsScentence}</p>
      <p>Klik op de hexagon met het juiste antwoord.</p>
    `;
  }

  /** Get the title for the welcome dialog. */
  get welcomeDialogTitle(): string {
    return `Oefenen met kwadraten en worteltrekken`;
  }

  /** Get the text to show in the game over dialog
   */
  get gameOverText(): HTMLTemplateResult {
    return html`
      <p>
        Je hebt ${this.getGameTimeString()} gespeeld met
        ${this.operatorsAsScentence}
      </p>
      ${this.numberOkForGameOverText} ${this.numberNokForGameOverText}
      ${this.scoreForGameOverText}
    `;
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

  private createExerciseSquare() {
    this.number = randomIntFromRange(2, this.maxBase);

    const answer = this.number * this.number;

    const possibleAnswers = [
      (this.number - 1) * (this.number - 1),
      (this.number + 1) * (this.number + 1),
      Math.floor(answer * 0.9),
      Math.ceil(answer * 1.1),
      Math.floor(answer * 0.8),
      Math.ceil(answer * 1.2),
    ];

    this.answers = {
      correct: answer,
      incorrect: [
        randomFromSetAndSplice(possibleAnswers),
        randomFromSetAndSplice(possibleAnswers),
        randomFromSetAndSplice(possibleAnswers),
      ],
    };
  }

  private createExerciseRoot() {
    const answer = randomIntFromRange(2, this.maxBase);

    this.number = answer * answer;

    const possibleAnswers = [answer + 1, answer + 2, answer + 3, answer - 1];
    if (answer > 2) possibleAnswers.push(answer - 2);
    if (answer > 3) possibleAnswers.push(answer - 3);

    this.answers = {
      correct: answer,
      incorrect: [
        randomFromSetAndSplice(possibleAnswers),
        randomFromSetAndSplice(possibleAnswers),
        randomFromSetAndSplice(possibleAnswers),
      ],
    };
  }

  private newRound() {
    this.operator = randomFromSet(this.operators);

    if (this.operator === 'square') this.createExerciseSquare();
    else if (this.operator === 'root') this.createExerciseRoot();
    else throw new Error('A invalid operator was selected for this excercise');

    this.ascendingBalloons.restartAscension();
    this.gameElementsDisabled = false;
  }

  executeGameOverActions(): void {
    this.gameElementsDisabled = true;
    this.gameLogger.logGameOver();
  }

  renderGameContent(): HTMLTemplateResult {
    let exercise = html``;
    if (this.operator === 'square') exercise = html`${this.number}² = ?`;
    else exercise = html`√${this.number}`;
    return html`
      <ascending-balloons
        id="ascendingBalloons"
        style="position: absolute; top: 0; left: 0; height: 100%; width:100%;"
        @correct-balloon-clicked=${() => this.handleCorrectAnswer()}
        @wrong-balloon-clicked=${() => this.handleWrongAnswer()}
        @ascension-complete=${() => this.handleAscensionComplete()}
        .answers=${this.answers}
        ?disabled=${this.gameElementsDisabled}
        imageType="hexagon"
      ></ascending-balloons>
      <div
        class="exercise"
        style="display: ${this.gameElementsDisabled
          ? 'none'
          : 'block'}; position: absolute; top: 20%; width: 100%; text-align: center;"
      >
        ${exercise}
      </div>
    `;
  }
}
