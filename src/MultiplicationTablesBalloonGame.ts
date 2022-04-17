import { html, css } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, state } from 'lit/decorators.js';
import type { CSSResultGroup, HTMLTemplateResult } from 'lit';

import { TimeLimitedGame2 } from './TimeLimitedGame2';
import {
  randomFromSet,
  randomFromSetAndSplice,
  randomIntFromRange,
} from './Randomizer';
import './AscendingBalloons';
import type {
  Answers,
  AscendingBalloons,
  ImageType,
} from './AscendingBalloons';
import { GameLogger } from './GameLogger';

type Operator = '×' | ':';

@customElement('mutiplication-tables-balloon-game-app')
export class MultiplicationTablesBalloonGameApp extends TimeLimitedGame2 {
  @state()
  private firstNumber = 1;
  @state()
  private secondNumber = 1;
  @state()
  private answers: Answers = { correct: 1, incorrect: [2, 3, 4] };
  @state()
  private gameElementsDisabled = true;
  @state()
  private operator: Operator = '×';
  @state()
  private image: ImageType = 'balloon';

  private operators: Operator[] = [];
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

    const operatorsFromUrl = urlParams.getAll('operator');
    operatorsFromUrl.forEach(operator => {
      if (operator === 'times' && !this.operators.find(value => value === '×'))
        this.operators.push('×');
      else if (
        operator === 'divide' &&
        !this.operators.find(value => value === ':')
      )
        this.operators.push(':');
    });
    if (this.operators.length === 0) this.operators.push('×');

    const imageInUrl = urlParams.get('image');
    if (imageInUrl === 'rocket') {
      this.image = 'rocket';
      this.welcomeDialogImageUrl = new URL(
        '../images/rocket-blue.svg',
        import.meta.url
      );
    } else if (imageInUrl === 'balloon') this.image = 'balloon';
    else this.image = 'balloon';

    if (
      this.operators.length === 1 &&
      this.operators[0] === '×' &&
      this.image === 'balloon'
    )
      this.gameLogger.setSubCode('a');
    else if (
      this.operators.length === 1 &&
      this.operators[0] === '×' &&
      this.image === 'rocket'
    )
      this.gameLogger.setSubCode('b');
    else if (
      this.operators.length === 1 &&
      this.operators[0] === ':' &&
      this.image === 'rocket'
    )
      this.gameLogger.setSubCode('c');
    else if (this.operators.length === 2 && this.image === 'rocket')
      this.gameLogger.setSubCode('d');
    else this.gameLogger.setSubCode('z');
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
   */
  startNewGame(): void {
    super.startNewGame();
    this.newRound();
  }

  get tablesAsScentence(): HTMLTemplateResult {
    let tablesAsScentence = '';

    this.tablesToUse.forEach((value, index) => {
      let suffix = ``;
      if (index === this.tablesToUse.length - 2) suffix = ` en `;
      else if (index < this.tablesToUse.length - 2) suffix = `, `;
      tablesAsScentence = tablesAsScentence.concat(`${value}${suffix}`);
    });
    tablesAsScentence = tablesAsScentence.concat('.');

    let operatorText = '';
    if (this.operators.length === 1 && this.operators[0] === '×')
      operatorText = '';
    else if (this.operators.length === 1 && this.operators[0] === ':')
      operatorText = 'deelsommen van de';
    else if (this.operators.length === 2)
      operatorText = 'deel- en keersommen van de';

    return html`${operatorText} tafel${this.tablesToUse.length === 1 ? '' : 's'}
    van ${tablesAsScentence}`;
  }

  /** Get the text to show in the game over dialog */
  get welcomeMessage(): HTMLTemplateResult {
    return html`
      <p>Oefenen met de ${this.tablesAsScentence}</p>
      <p>
        Klik op de ${this.image === 'balloon' ? 'ballon' : 'raket'} met het
        juiste antwoord.
      </p>
    `;
  }

  /** Get the title for the welcome dialog. */
  get welcomeDialogTitle(): string {
    let title = '';
    if (this.operators.length === 1 && this.operators[0] === '×')
      title = `Tafeltjes oefenen`;
    else if (this.operators.length === 1 && this.operators[0] === ':')
      title = `Deelsommen met de tafeltjes`;
    else if (this.operators.length === 2)
      title = `Deel- en keersommen met de tafeltjes`;
    else
      throw new Error(
        'Wrong number of operators, there is a problem in de software'
      );

    return title;
  }

  /** Get the text to show in the game over dialog
   */
  get gameOverText(): HTMLTemplateResult {
    return html`
      <p>
        Je hebt ${this.getGameTimeString()} gespeeld met de
        ${this.tablesAsScentence}
      </p>
      ${this.numberOkForGameOverText} ${this.numberNokForGameOverText}
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

  private createExcerciseDivide() {
    let proposedAnswer = randomIntFromRange(1, 10);
    while (proposedAnswer === this.answers.correct)
      proposedAnswer = randomIntFromRange(1, 10);

    this.secondNumber = randomFromSet(this.tablesToUse);
    this.firstNumber = proposedAnswer * this.secondNumber;

    const possibleAnswers = [];
    for (let i = 1; i <= 10; i++) {
      if (i * this.secondNumber !== this.firstNumber) possibleAnswers.push(i);
    }
    this.answers = {
      correct: proposedAnswer,
      incorrect: [
        randomFromSetAndSplice(possibleAnswers),
        randomFromSetAndSplice(possibleAnswers),
        randomFromSetAndSplice(possibleAnswers),
      ],
    };
  }

  private createExcerciseTimes() {
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
  }

  private newRound() {
    this.operator = randomFromSet(this.operators);

    if (this.operator === '×') this.createExcerciseTimes();
    else if (this.operator === ':') this.createExcerciseDivide();
    else throw new Error('A invalid operator was selected for this excercise');

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
        imageType=${this.image}
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
