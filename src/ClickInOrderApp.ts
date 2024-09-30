import { html, css } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, state } from 'lit/decorators.js';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { TimeCountingGame } from './TimeCountingGame';
import './BallFieldEntry';

import { randomFromSet, randomIntFromRange } from './Randomizer';
import { GameLogger } from './GameLogger';
import { BallFieldEntry } from './BallenVeldInvoer';

interface Sum {
  multiplier: number;
  table: number;
}

interface AnswerAndSums {
  answer: number;
  sums: Sum[];
}

type Descending = 'descending' | 'ascending';
type ShowSum = 'showSum' | 'hideSum';
type EvenOdd = 'even' | 'odd' | 'all';
type Start = 'random' | number;

/** Create link for click in order game.
 * @param nmbrBalls - Number of balls  to show
 * @param start - First number to show, or random to randomly select from 20 - 80
 * @param descending - use descending numbers when start is specified
 * @param tableOfMultiplication - create balls from the tableOfMultiplication, if showSum is not active, only the first table is selected.
 * @param showSum: Show sum with the table of multiplication(s), in this case the balls need to be clicked in the order the sums are shown (random), multiple tables are allowed.
 * @param random: Select number from a random start number, increasing by 1.
 * @param even: Only show even numbers. If Start is not an even number, this first higher even number is selected.
 * @param odd: Only show odd numbers. If Start is not an odd number, this first higher odd number is selected.
 * @param time - Game length
 */
export function aanklikkenInVolgordeLink(
  start: Start,
  nmbrBalls: number,
  descending: Descending,
  tableOfMultiplication: number[],
  showSum: ShowSum,
  evenOdd: EvenOdd
) {
  let params = `nmbrBalls=${nmbrBalls}`;
  if (start === 'random') params += '&random';
  else params += `&start=${start}`;
  if (descending === 'descending') params += `&descending`;
  if (showSum === 'showSum') params += `&showSum`;
  if (evenOdd === 'even') params += `&even`;
  else if (evenOdd === 'odd') params += `&odd`;
  for (const n of tableOfMultiplication)
    params += `&tableOfMultiplication=${n}`;
  return `../Rekenspelletjes/AanklikkenInVolgorde.html?${params}`;
}

/** Click in order application
 * @url-parameter nmbrBalls: int - number of balls to show
 * @url-parameter start:int - first number to show, balls will be selected increasing by 1 from the first number, except when also descending is specified.
 * @url-parameter descending - use descending numbers when start is specified
 * @url-parameter tableOfMultiplication: int - create balls from the tableOfMultiplication, if shownSum is not active, only the first table is selected.
 * @url-parameter showSum: Show sum with the table of multiplication(s), in this case the balls need to be clicked in the order the sums are shown (random), multiple tables are allowed.
 * @url-parameter random: Select number from a random start number, increasing by 1.
 * @url-parameter even: Only show even numbers. If Start is not an even number, this first higher even number is selected.
 * @url-parameter odd: Only show odd numbers. If Start is not an odd number, this first higher odd number is selected.
 */
@customElement('click-in-order-app')
export class ClickInOrderApp extends TimeCountingGame {
  @state()
  labelsInOrder: string[] = [];
  @state()
  disabledBallLabels: string[] = [];
  @state()
  invisibleBallLabels: string[] = [];
  @state()
  showSum = false;
  @state()
  tables = [1];
  @state()
  multipliersInOrder: number[] = [];
  @state()
  tablesInOrder: number[] = [];

  nmbrBalls = 10;

  welcomeMessageString = '';

  @state()
  gameElementsDisabled = true;

  private nextBallToClick = 0;
  private gameLogger = new GameLogger('H', '');

  constructor() {
    super();
    this.parseUrl();
  }

  get welcomeMessage(): HTMLTemplateResult {
    return html`<p>${this.welcomeMessageString}</p>`;
  }

  private parseUrl(): void {
    const urlParams = new URLSearchParams(window.location.search);
    this.labelsInOrder = [];

    this.nmbrBalls = parseInt(urlParams.get('nmbrBalls') || '', 10);
    if (Number.isNaN(this.nmbrBalls)) this.nmbrBalls = 10;

    if (urlParams.has('start')) {
      let startAsInt = parseInt(urlParams.get('start') || '', 10);
      let stepSize = 1;
      let subCodeInitial = ``;

      if (Number.isNaN(startAsInt)) startAsInt = 1;
      if (urlParams.has('even')) {
        stepSize = 2;
        if (startAsInt % 2 === 1) startAsInt += 1; // We have to start at an even number, so we increase until the next even number.
        this.welcomeMessageString = `Klik de even getallen aan`;
        subCodeInitial = subCodeInitial.concat('f');
      } else if (urlParams.has('odd')) {
        stepSize = 2;
        if (startAsInt % 2 === 0) startAsInt += 1; // We have to start at an odd number, so we increase until the next odd number.
        this.welcomeMessageString = `Klik de oneven getallen aan`;
        subCodeInitial = subCodeInitial.concat('g');
      } else {
        stepSize = 1;
        this.welcomeMessageString = `Klik de getallen aan`;
        subCodeInitial = subCodeInitial.concat('b');
      }

      if (urlParams.has('descending')) {
        this.welcomeMessageString = this.welcomeMessageString.concat(
          `, van groot naar klein, begin bij ${startAsInt}.`
        );
        this.gameLogger.setSubCode(`${subCodeInitial}d`);
        for (
          let i = startAsInt;
          i > startAsInt - this.nmbrBalls * stepSize;
          i -= stepSize
        ) {
          this.labelsInOrder.push(`${i}`);
        }
      } else {
        this.welcomeMessageString = this.welcomeMessageString.concat(
          `, van klein naar groot, begin bij ${startAsInt}.`
        );
        this.gameLogger.setSubCode(`${subCodeInitial}a`);
        for (
          let i = startAsInt;
          i < startAsInt + this.nmbrBalls * stepSize;
          i += stepSize
        ) {
          this.labelsInOrder.push(`${i}`);
        }
      }
    } else if (urlParams.has('tableOfMultiplication')) {
      this.tables = [];
      const tablesFromUrl = urlParams.getAll('tableOfMultiplication');
      for (const table of tablesFromUrl) {
        const tableAsInt = parseInt(table, 10);
        if (!Number.isNaN(tableAsInt)) this.tables.push(tableAsInt);
      }
      if (this.tables.length === 0) this.tables.push(10);
      if (urlParams.has('showSum')) {
        // this.labelsInOrder will be set in StartNewGame
        this.showSum = true;
        this.welcomeMessageString = `Kies het juiste getal bij de keersommen.`;
        this.gameLogger.setMainCode('Q');
        this.gameLogger.setSubCode('a');
      } else {
        for (let i = 1; i <= this.nmbrBalls; i++) {
          this.labelsInOrder.push(`${i * this.tables[0]}`);
        }
        this.welcomeMessageString = `Klik de getallen aan, van klein naar groot,
          met sprongen van ${this.tables[0]}.`;
        this.gameLogger.setMainCode('P');
        this.gameLogger.setSubCode('a');
      }
    } else if (urlParams.has('random')) {
      const startNumber = randomIntFromRange(20, 80);

      for (let i = startNumber; i < startNumber + this.nmbrBalls; i++) {
        this.labelsInOrder.push(`${i}`);
      }
      this.welcomeMessageString = `Klik de getallen aan, van klein naar groot,
      begin bij ${startNumber}.`;
      this.gameLogger.setSubCode('c');
    }
  }

  /** Get all static styles */
  static get styles(): CSSResultArray {
    return [
      ...super.styles,
      css`
        #ballFieldEntry {
          height: 100%;
          width: 100%;
        }
      `,
    ];
  }

  override async getUpdateComplete(): Promise<boolean> {
    const result = await super.getUpdateComplete();
    return result;
  }

  /** Start a new game.
   */
  startNewGame(): void {
    super.startNewGame();
    if (this.showSum) {
      let possibleAnswersAndSums: AnswerAndSums[] = [];

      for (
        let multiplier = 1;
        multiplier < 10 || possibleAnswersAndSums.length < this.nmbrBalls;
        multiplier++
      ) {
        for (const table of this.tables) {
          const answer = table * multiplier;
          const answerAndSums = possibleAnswersAndSums.find(
            answerAndSum => answerAndSum.answer === answer
          );
          if (answerAndSums === undefined)
            possibleAnswersAndSums.push({
              answer,
              sums: [{ table, multiplier }],
            });
          else answerAndSums.sums.push({ table, multiplier });
        }
      }

      this.multipliersInOrder = [];
      this.tablesInOrder = [];
      this.labelsInOrder = [];

      for (let i = 0; i < this.nmbrBalls; i++) {
        const answerAndSum = randomFromSet(possibleAnswersAndSums);
        const sum = randomFromSet(answerAndSum.sums);
        this.multipliersInOrder.push(sum.multiplier);
        this.tablesInOrder.push(sum.table);
        this.labelsInOrder.push(`${answerAndSum.answer}`);

        possibleAnswersAndSums = possibleAnswersAndSums.filter(
          item => item.answer !== answerAndSum.answer
        );
      }
    } else {
      this.labelsInOrder = [...this.labelsInOrder]; // We create a new array with labels in order, such that a shuffle is triggered in ball-field entry
    }
    this.disabledBallLabels = [];
    this.invisibleBallLabels = [];
    this.nextBallToClick = 0;
    this.gameElementsDisabled = false;
  }

  /** Get the title for the welcome dialog. */
  get welcomeDialogTitle(): string {
    return 'Klik aan in de juiste volgorde';
  }

  handleBallClick(label: string) {
    if (label === this.labelsInOrder[this.nextBallToClick]) {
      this.handleCorrectAnswer(label);
    } else {
      this.handleWrongAnswer(label);
    }
  }

  get ballFieldEntry(): BallFieldEntry {
    return this.getElement<BallFieldEntry>('ball-field-entry');
  }

  private handleCorrectAnswer(label: string): void {
    this.numberOk += 1;
    this.invisibleBallLabels = this.invisibleBallLabels.concat(label); // We don't use push as that doesn't trigger an update of the ball-field-entry
    this.disabledBallLabels = [];
    this.nextBallToClick += 1;
    if (this.nextBallToClick === this.labelsInOrder.length)
      this.handleGameOver();
  }

  private handleWrongAnswer(label: string): void {
    this.numberNok += 1;
    this.disabledBallLabels = this.disabledBallLabels.concat(label); // // We don't use push as that doesn't trigger an update of the ball-field-entry
  }

  executeGameOverActions(): void {
    super.executeGameOverActions();
    this.gameElementsDisabled = true;
    this.gameLogger.logGameOver();
  }

  renderGameContent(): HTMLTemplateResult {
    let excercise = '';
    if (this.showSum) {
      excercise = `${this.multipliersInOrder[this.nextBallToClick]}×${
        this.tablesInOrder[this.nextBallToClick]
      }`;
    }

    return html`
      <ball-field-entry
          id="ballFieldEntry"
          ?disabled=${this.gameElementsDisabled}
          .ballLabels=${this.labelsInOrder}
          .disabledBallLabels=${this.disabledBallLabels}
          .invisibleBallLabels=${this.invisibleBallLabels}
          exercise="${excercise}"
          @ball-clicked=${(evt: CustomEvent) =>
            this.handleBallClick(evt.detail.label)}
        ></ball-field-entry>
      </button>
    `;
  }
}
