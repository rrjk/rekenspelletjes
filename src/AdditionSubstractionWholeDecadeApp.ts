import { html, css } from 'lit';
// eslint-disable-next-line import/extensions
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

type Operator = '+' | '-';

@customElement('addition-substraction-whole-decade-app')
export class AdditionSubstractionWholeDecadeApp extends TimeLimitedGame2 {
  @state()
  private firstNumber = 1;
  @state()
  private secondNumber = 10;
  @state()
  private operator: Operator = '+';
  @state()
  private answers: Answers = { correct: 21, incorrect: [22, 23, 41] };
  @state()
  private gameElementsDisabled = true;

  private operators: Operator[] = [];
  private decadeFirst = false;

  private gameLogger = new GameLogger('B', '');

  constructor() {
    super();
    this.welcomeDialogImageUrl = new URL(
      '../images/Mompitz Elli star-yellow.png',
      import.meta.url
    );
    this.parseUrl();
  }

  private parseUrl(): void {
    const urlParams = new URLSearchParams(window.location.search);

    const operatorsFromUrl = urlParams.getAll('operator');
    operatorsFromUrl.forEach(operator => {
      if (operator === 'plus' && !this.operators.find(value => value === '+'))
        this.operators.push('+');
      else if (
        operator === 'minus' &&
        !this.operators.find(value => value === '-')
      )
        this.operators.push('-');
    });
    if (this.operators.length === 0) this.operators.push('+');

    if (urlParams.has('decadeFirst')) this.decadeFirst = true;
    else this.decadeFirst = false;

    if (!this.decadeFirst) {
      if (this.operators.length === 2) {
        this.gameLogger.setSubCode('c');
      } else if (this.operators[0] === '+') {
        this.gameLogger.setSubCode('a');
      } else if (this.operators[1] === '-') {
        this.gameLogger.setSubCode('b');
      }
    } else if (this.decadeFirst) {
      if (this.operators.length === 2) {
        this.gameLogger.setSubCode('f');
      } else if (this.operators[0] === '+') {
        this.gameLogger.setSubCode('d');
      } else if (this.operators[1] === '-') {
        this.gameLogger.setSubCode('e');
      }
    }
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
   * Progress bar and counters are automatically reset.
   */
  startNewGame(): void {
    super.startNewGame();
    this.newRound();
  }

  /** Get the text to show in the game over dialog */
  get welcomeMessage(): HTMLTemplateResult {
    const exerciseExamples: string[] = [];
    let exerciseExamplesAsScentence = '';

    if (!this.decadeFirst) {
      if (this.operators.find(value => value === '+')) {
        exerciseExamples.push('33+20');
      }
      if (this.operators.find(value => value === '-')) {
        exerciseExamples.push(`56-30`);
      }
    } else if (this.decadeFirst) {
      if (this.operators.find(value => value === '+')) {
        exerciseExamples.push('50+8');
      }
      if (this.operators.find(value => value === '-')) {
        exerciseExamples.push(`70-5`);
      }
    }

    if (exerciseExamples.length <= 0 || exerciseExamples.length > 2)
      throw new Error('Internal error');
    else if (exerciseExamples.length === 1)
      exerciseExamplesAsScentence = `${exerciseExamples[0]}.`;
    else if (exerciseExamples.length === 2)
      exerciseExamplesAsScentence = `${exerciseExamples[0]} en ${exerciseExamples[1]}.`;

    return html`<p>Sommen als ${exerciseExamplesAsScentence}</p>
      <p>Klik op de ballon met het juiste antwoord.</p> `;
  }

  /** Get the title for the welcome dialog. */
  get welcomeDialogTitle(): string {
    return `Sommen met hele tientallen`;
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
    this.operator = randomFromSet(this.operators);
    let answer: number;

    if (!this.decadeFirst) {
      if (this.operator === '+') {
        this.firstNumber = randomIntFromRange(1, 89);
        this.secondNumber =
          10 * randomIntFromRange(1, 9 - Math.floor(this.firstNumber / 10));
        answer = this.firstNumber + this.secondNumber;
      } else if (this.operator === '-') {
        this.firstNumber = randomIntFromRange(11, 99);
        this.secondNumber =
          10 * randomIntFromRange(1, Math.floor(this.firstNumber / 10));
        answer = this.firstNumber - this.secondNumber;
      } else {
        throw new Error('Unsupported operator found');
      }
    } else {
      this.firstNumber = randomIntFromRange(1, 9) * 10;
      this.secondNumber = randomIntFromRange(1, 9);
      if (this.operator === '+') {
        answer = this.firstNumber + this.secondNumber;
      } else if (this.operator === '-') {
        answer = this.firstNumber - this.secondNumber;
      } else {
        throw new Error('Unsupported operator found');
      }
    }

    let fullyRandomAnswer = randomIntFromRange(1, 99);
    while (fullyRandomAnswer === answer)
      fullyRandomAnswer = randomIntFromRange(1, 99);

    let singleNumber = randomIntFromRange(0, 9);
    while (singleNumber === answer % 10)
      singleNumber = randomIntFromRange(0, 9);
    const sameDecadeAnswer = 10 * Math.floor(answer / 10) + singleNumber;

    let decadeNumber = randomIntFromRange(1, 9);
    while (decadeNumber === Math.floor(answer / 10))
      decadeNumber = randomIntFromRange(1, 9);
    const sameSinglesNumber = 10 * decadeNumber + (answer % 10);

    const possibleAnswers = [
      fullyRandomAnswer,
      sameDecadeAnswer,
      sameSinglesNumber,
    ];

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
    fetch('asdflog.php?game=B', {
      method: 'POST',
    });
  }

  /** Render the game content */
  renderGameContent(): HTMLTemplateResult {
    return html`
      <ascending-balloons
        id="ascendingBalloons"
        style="position: absolute; top: 0; left: 0; height: 100%; width:100%;"
        @correct-balloon-clicked="${() => this.handleCorrectAnswer()}"
        @wrong-balloon-clicked="${() => this.handleWrongAnswer()}"
        @ascension-complete="${() => this.handleAscensionComplete()}"
        .answers=${this.answers}
        ?disabled=${this.gameElementsDisabled}
        imageType="star"
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
