import { customElement } from 'lit/decorators.js';

import { css, CSSResultArray, html, HTMLTemplateResult } from 'lit';

import {
  AscendingItemsGameApp,
  ItemInfoInterface,
  RoundInfo,
} from '../AscendingItemsGameApp';
import { Color, setOf20Colors } from '../Colors';

import '../NumberedStar';

import {
  randomFromSet,
  randomFromSetAndSplice,
  randomIntFromRange,
  shuffleArray,
} from '../Randomizer';

import { GameLogger } from '../GameLogger';
import { operatorToSymbol, AdditionOperator } from '../Operator';
import { UnexpectedValueError } from '../UnexpectedValueError';

interface ItemInfo extends ItemInfoInterface {
  nmbr: number;
  color: Color;
}

interface ExerciseInfo {
  firstNumber: number;
  secondNumber: number;
  operator: AdditionOperator;
}

@customElement('addition-substraction-whole-decade-game-app')
export class AdditionSubstractionWholeDecadeGameApp extends AscendingItemsGameApp<
  ExerciseInfo,
  ItemInfo
> {
  private operators: AdditionOperator[] = [];
  private decadeFirst = false;

  private gameLogger = new GameLogger('B', '');

  constructor() {
    super();
    this.welcomeDialogImageUrl = new URL(
      '../../images/Mompitz Elli star-yellow.png',
      import.meta.url,
    );
    this.parseUrl();
  }

  private parseUrl(): void {
    const urlParams = new URLSearchParams(window.location.search);

    const operatorsFromUrl = urlParams.getAll('operator');
    operatorsFromUrl.forEach(operator => {
      if (
        operator === 'plus' &&
        !this.operators.find(value => value === 'plus')
      )
        this.operators.push('plus');
      else if (
        operator === 'minus' &&
        !this.operators.find(value => value === 'minus')
      )
        this.operators.push('minus');
    });
    if (this.operators.length === 0) this.operators.push('plus');

    if (urlParams.has('decadeFirst')) this.decadeFirst = true;
    else this.decadeFirst = false;

    if (!this.decadeFirst) {
      if (this.operators.length === 2) {
        this.gameLogger.setSubCode('c');
      } else if (this.operators[0] === 'plus') {
        this.gameLogger.setSubCode('a');
      } else if (this.operators[0] === 'minus') {
        this.gameLogger.setSubCode('b');
      }
    } else if (this.decadeFirst) {
      if (this.operators.length === 2) {
        this.gameLogger.setSubCode('f');
      } else if (this.operators[0] === 'plus') {
        this.gameLogger.setSubCode('d');
      } else if (this.operators[0] === 'minus') {
        this.gameLogger.setSubCode('e');
      }
    }
  }

  /** Get all static styles */
  static get styles(): CSSResultArray {
    return [
      ...super.styles,
      css`
        numbered-star {
          width: 100%;
          height: 100%;
        }

        svg {
          text-anchor: middle;
          dominant-baseline: middle;
          font-size: 30px;
          height: 100%;
        }
      `,
    ];
  }

  get welcomeMessage(): HTMLTemplateResult {
    const exerciseExamples: string[] = [];
    let exerciseExamplesAsScentence = '';

    if (!this.decadeFirst) {
      if (this.operators.find(value => value === 'plus')) {
        exerciseExamples.push('33+20');
      }
      if (this.operators.find(value => value === 'minus')) {
        exerciseExamples.push(`56-30`);
      }
    } else if (this.decadeFirst) {
      if (this.operators.find(value => value === 'plus')) {
        exerciseExamples.push('50+8');
      }
      if (this.operators.find(value => value === 'minus')) {
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
      <p>Klik op de ster met het juiste antwoord.</p> `;
  }

  /** Get the title for the welcome dialog. */
  get welcomeDialogTitle(): string {
    return `Sommen met hele tientallen`;
  }

  protected getRoundInfo(nmbrItems: number): RoundInfo<ExerciseInfo, ItemInfo> {
    console.assert(nmbrItems === 4);

    const exerciseInfo: ExerciseInfo = {
      firstNumber: 0,
      secondNumber: 0,
      operator: 'plus',
    };
    const itemInfo: ItemInfo[] = [];

    const operator = randomFromSet(this.operators);
    let answer: number;

    if (!this.decadeFirst) {
      if (operator === 'plus') {
        exerciseInfo.firstNumber = randomIntFromRange(1, 89);
        exerciseInfo.secondNumber =
          10 *
          randomIntFromRange(1, 9 - Math.floor(exerciseInfo.firstNumber / 10));
        answer = exerciseInfo.firstNumber + exerciseInfo.secondNumber;
      } else if (operator === 'minus') {
        exerciseInfo.firstNumber = randomIntFromRange(11, 99);
        exerciseInfo.secondNumber =
          10 * randomIntFromRange(1, Math.floor(exerciseInfo.firstNumber / 10));
        answer = exerciseInfo.firstNumber - exerciseInfo.secondNumber;
      } else {
        throw new Error('Unsupported operator found');
      }
    } else {
      exerciseInfo.firstNumber = randomIntFromRange(1, 9) * 10;
      exerciseInfo.secondNumber = randomIntFromRange(1, 9);
      if (operator === 'plus') {
        answer = exerciseInfo.firstNumber + exerciseInfo.secondNumber;
      } else if (operator === 'minus') {
        answer = exerciseInfo.firstNumber - exerciseInfo.secondNumber;
      } else {
        throw new UnexpectedValueError(operator);
      }
    }
    exerciseInfo.operator = operator;

    const possibleColors: Color[] = [...setOf20Colors];
    const colorCorrect = randomFromSetAndSplice(possibleColors);

    itemInfo.push({
      color: colorCorrect,
      disabled: false,
      nmbr: answer,
      correct: true,
    });

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

    for (let i = 0; i < nmbrItems - 1; i++) {
      itemInfo.push({
        color: randomFromSetAndSplice(possibleColors),
        correct: false,
        disabled: false,
        nmbr: randomFromSetAndSplice(possibleAnswers),
      });
    }

    shuffleArray(itemInfo);

    return {
      exerciseInfo,
      itemInfo,
    };
  }

  executeGameOverActions(): void {
    this.gameLogger.logGameOver();
  }

  protected renderExercise(exerciseInfo: ExerciseInfo): HTMLTemplateResult {
    return html`<svg viewBox="-100 -25 200 50">
      <text x="0" y="0">
        ${exerciseInfo.firstNumber} ${operatorToSymbol(exerciseInfo.operator)}
        ${exerciseInfo.secondNumber} =
      </text>
    </svg>`;
  }

  renderItem(itemInfo: ItemInfo): HTMLTemplateResult {
    return html`<numbered-star
      .nmbrToShow=${itemInfo.nmbr}
      .color=${itemInfo.color}
      ?disabled=${itemInfo.disabled}
    ></numbered-star>`;
  }
}
