import { html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { CSSResultGroup, HTMLTemplateResult } from 'lit';

import { TimeLimitedGame } from './TimeLimitedGame';
import { randomFromSet, randomFromSetAndSplice } from './Randomizer';

import './AscendingBalloons';
import type { Answers, AscendingBalloons } from './AscendingBalloons';

import './SplitDigit';
import type { SplittableNumber } from './SplitDigit';

@customElement('split-app')
export class SplitApp extends TimeLimitedGame {
  numbersToSplit: SplittableNumber[] = [];
  @state()
  private numberToSplit: SplittableNumber = 7;
  @state()
  private firstNumber: SplittableNumber = 3;
  @state()
  private answers: Answers = { correct: 1, incorrect: [2, 3, 4] };
  @state()
  private gameElementsDisabled = true;

  constructor() {
    super();
    this.parseUrl();
  }

  private parseUrl(): void {
    const urlParams = new URLSearchParams(window.location.search);

    const numbersFromUrl = urlParams.getAll('number');
    numbersFromUrl.forEach(nmbrAsString => {
      const nmbr = parseInt(nmbrAsString, 10);
      if (
        !Number.isNaN(nmbr) &&
        (nmbr === 2 ||
          nmbr === 3 ||
          nmbr === 4 ||
          nmbr === 5 ||
          nmbr === 6 ||
          nmbr === 7 ||
          nmbr === 8 ||
          nmbr === 9 ||
          nmbr === 10) &&
        !this.numbersToSplit.find(value => value === nmbr)
      ) {
        this.numbersToSplit.push(nmbr);
      }
    });
    if (this.numbersToSplit.length === 0) this.numbersToSplit.push(10);
  }

  /** Get the ascending balloons child */
  private get ascendingBalloons(): AscendingBalloons {
    return this.getElement('#ascendingBalloons');
  }

  /** Get all static styles */
  static get styles(): CSSResultGroup {
    return css``;
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

  /** Get the text to show in the start game dialog */
  get welcomeMessage(): HTMLTemplateResult {
    let numbersToSplitAsScentence = '';

    if (this.numbersToSplit.length <= 0) throw new Error('Internal error');
    else if (this.numbersToSplit.length === 1)
      numbersToSplitAsScentence = numbersToSplitAsScentence.concat(
        `${this.numbersToSplit[0]}.`
      );
    else {
      this.numbersToSplit.forEach((value, index) => {
        if (index === 0) {
          numbersToSplitAsScentence = numbersToSplitAsScentence.concat(
            `${value}`
          );
        } else if (index === this.numbersToSplit.length - 1) {
          numbersToSplitAsScentence = numbersToSplitAsScentence.concat(
            ` en ${value}.`
          );
        } else {
          numbersToSplitAsScentence = numbersToSplitAsScentence.concat(
            `, ${value}`
          );
        }
      });
    }

    return html`<p>Splitsen van ${numbersToSplitAsScentence}</p>
      <p>Klik op de ballon met het juiste antwoord.</p> `;
  }

  /** Get the title for the welcome dialog. */
  get welcomeDialogTitle(): string {
    return `Splitsen van getallen`;
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
    const possibleNumbers: SplittableNumber[] = [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    ];

    this.numberToSplit = randomFromSet(this.numbersToSplit);

    const possibleFirstNumbers = possibleNumbers.slice(
      0,
      possibleNumbers.findIndex(elm => elm === this.numberToSplit) + 1
    );
    this.firstNumber = randomFromSet(possibleFirstNumbers);

    const answer = this.numberToSplit - this.firstNumber;

    const possibleAnswers: SplittableNumber[] = [];
    possibleNumbers.forEach(elm => {
      if (elm !== answer) possibleAnswers.push(elm);
    });

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
      <split-digit
        ?disabled=${this.gameElementsDisabled}
        .firstNumber=${this.firstNumber}
        .numberToSplit=${this.numberToSplit}
      ></split-digit>
    `;
  }
}
