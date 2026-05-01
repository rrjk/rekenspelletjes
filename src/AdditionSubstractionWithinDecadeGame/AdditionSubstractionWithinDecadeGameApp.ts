import { customElement } from 'lit/decorators.js';

import { css, CSSResultArray, html, HTMLTemplateResult } from 'lit';

import {
  AscendingItemsGameApp,
  ItemInfoInterface,
  RoundInfo,
} from '../AscendingItemsGameApp';
import { Color, legacyBalloonColors } from '../Colors';

import '../NumberedKite';

import {
  randomFromSet,
  randomFromSetAndSplice,
  randomIntFromRange,
  shuffleArray,
} from '../Randomizer';

import { GameLogger } from '../GameLogger';
import { Decade } from './AdditionSubstractionWithinDecadeGameAppLink';
import {
  getAdditionSubstractionWithinDecadeGameVariant,
  type AdditionSubstractionWithinDecadeGameExtendedVariantInfo,
} from './AdditionSubstractionWithinDecadeGameVariants';
import { operatorToSymbol, Operator } from '../Operator';

interface ItemInfo extends ItemInfoInterface {
  nmbr: number;
  color: Color;
}

interface ExerciseInfo {
  firstNumber: number;
  secondNumber: number;
  operator: Operator;
}

@customElement('addition-substraction-within-decade-game-app')
export class AdditionSubstractionWithinDecadeGameApp extends AscendingItemsGameApp<
  ExerciseInfo,
  ItemInfo
> {
  private decades: Decade[] = [];
  private operators: Operator[] = [];
  private gameLogger = new GameLogger('A', '');
  private possibleColors: Color[] = [...legacyBalloonColors];
  private variantInfo: AdditionSubstractionWithinDecadeGameExtendedVariantInfo | null =
    null;

  constructor() {
    super();
    this.parseUrl();
  }

  private parseUrlWithVariant(urlParams: URLSearchParams): void {
    const variant = urlParams.get('variant');
    if (variant === null) throw Error('Internal SW Error: no variant in URL');
    const extendedVariantInfo =
      getAdditionSubstractionWithinDecadeGameVariant(variant);

    this.decades = extendedVariantInfo.decades;
    this.operators = extendedVariantInfo.operators;
    this.gameLogger.setMainCode(extendedVariantInfo.mainCode);
    this.gameLogger.setSubCode(variant);
    this.variantInfo = extendedVariantInfo;
  }

  private parseUrlWithoutVariant(urlParams: URLSearchParams): void {
    const decadesFromUrl = urlParams.getAll('decade');
    decadesFromUrl.forEach(decadeAsString => {
      const decade = parseInt(decadeAsString, 10);
      if (
        !Number.isNaN(decade) &&
        decade >= 0 &&
        decade % 10 === 0 &&
        decade < 100 &&
        !this.decades.find(value => value === decade)
      ) {
        this.decades.push(decade as Decade);
      }
    });
    if (this.decades.length === 0) this.decades.push(0);

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

    if (this.operators.length === 2) this.gameLogger.setSubCode('c');
    else if (this.operators.length === 1 && this.operators[0] === 'plus')
      this.gameLogger.setSubCode('a');
    else if (this.operators.length === 1 && this.operators[0] === 'minus')
      this.gameLogger.setSubCode('b');
  }

  private parseUrl(): void {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('variant')) this.parseUrlWithVariant(urlParams);
    else this.parseUrlWithoutVariant(urlParams);
  }

  /** Get the game description as a text string */
  get exerciseExamplesAsScentence(): string {
    if (this.variantInfo) {
      const { text1, text2 } = this.variantInfo.exampleSums;
      if (text2 === '') {
        return `${text1}.`;
      } else {
        return `${text1} en ${text2}.`;
      }
    }

    // Fallback for legacy URL parameters without variant
    const exerciseExamples: string[] = [];

    let exerciseExamplesAsScentence = '';

    if (this.operators.find(value => value === 'plus')) {
      this.decades.forEach(decade => exerciseExamples.push(`${decade + 3}+4`));
    }
    if (this.operators.find(value => value === 'minus')) {
      this.decades.forEach(decade => exerciseExamples.push(`${decade + 7}-5`));
    }

    if (exerciseExamples.length <= 0) throw new Error('Internal error');
    else if (exerciseExamples.length === 1)
      exerciseExamplesAsScentence = exerciseExamplesAsScentence.concat(
        `${exerciseExamples[0]}.`,
      );
    else {
      exerciseExamples.forEach((value, index) => {
        if (index === 0) {
          exerciseExamplesAsScentence =
            exerciseExamplesAsScentence.concat(value);
        } else if (index === exerciseExamples.length - 1) {
          exerciseExamplesAsScentence = exerciseExamplesAsScentence.concat(
            ` en ${value}.`,
          );
        } else {
          exerciseExamplesAsScentence = exerciseExamplesAsScentence.concat(
            `, ${value}`,
          );
        }
      });
    }

    return exerciseExamplesAsScentence;
  }

  /** Get the text to show in the game over dialog */
  get welcomeMessage(): HTMLTemplateResult {
    return html`<p>Sommen als ${this.exerciseExamplesAsScentence}</p>
      <p>Klik op de vlieger met het juiste antwoord.</p> `;
  }

  /** Get the text to show in the game over dialog
   */
  get gameOverIntroductionText(): HTMLTemplateResult {
    return html`
      <p>
        Je hebt het <i>vliegerspel</i> gespeeld met sommen als
        ${this.exerciseExamplesAsScentence}.
      </p>
    `;
  }

  /** Get the title for the welcome dialog. */
  get welcomeDialogTitle(): string {
    return `Sommen binnen het tiental`;
  }

  executeGameOverActions(): void {
    this.gameLogger.logGameOver();
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
    const decade = randomFromSet(this.decades);
    let answer: number;

    if (operator === 'plus') {
      exerciseInfo.firstNumber = randomIntFromRange(0 + decade, 9 + decade);
      exerciseInfo.secondNumber = randomIntFromRange(
        0,
        10 - (exerciseInfo.firstNumber - decade),
      );
      answer = exerciseInfo.firstNumber + exerciseInfo.secondNumber;
    } else if (operator === 'minus') {
      exerciseInfo.firstNumber = randomIntFromRange(1 + decade, 10 + decade);
      exerciseInfo.secondNumber = randomIntFromRange(
        0,
        exerciseInfo.firstNumber - decade,
      );
      answer = exerciseInfo.firstNumber - exerciseInfo.secondNumber;
    } else {
      throw new Error('Unsupported operator found');
    }
    exerciseInfo.operator = operator;

    const possibleColors: Color[] = [...this.possibleColors];
    const colorCorrect = randomFromSetAndSplice(possibleColors);

    itemInfo.push({
      color: colorCorrect,
      disabled: false,
      nmbr: answer,
      correct: true,
    });

    const possibleAnswers = [];
    for (let i = 0 + decade; i <= 10 + decade; i++) {
      if (i !== answer) possibleAnswers.push(i);
    }

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

  protected renderExercise(exerciseInfo: ExerciseInfo): HTMLTemplateResult {
    return html`<svg viewBox="-100 -25 200 50">
      <text x="0" y="0">
        ${exerciseInfo.firstNumber} ${operatorToSymbol(exerciseInfo.operator)}
        ${exerciseInfo.secondNumber} =
      </text>
    </svg>`;
  }

  renderItem(itemInfo: ItemInfo): HTMLTemplateResult {
    return html`<numbered-kite
      .nmbrToShow=${itemInfo.nmbr}
      .color=${itemInfo.color}
      ?disabled=${itemInfo.disabled}
      tailLength="long"
    ></numbered-kite>`;
  }

  static get styles(): CSSResultArray {
    return [
      ...super.styles,
      css`
        numbered-kite {
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
}
