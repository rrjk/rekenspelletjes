import { customElement, state } from 'lit/decorators.js';

import { css, CSSResultArray, html, HTMLTemplateResult } from 'lit';

import {
  AscendingItemsGameApp,
  ItemInfoInterface,
  RoundInfo,
} from '../AscendingItemsGameApp';
import { Color, legacyBalloonColors, setOf20Colors } from '../Colors';

import '../FlyingSaucer';
import '../NumberedBalloon';
import '../RocketImageV2';
import '../ZeppelinImageV2';

import { Operator } from './MultiplicationTablesBalloonGameLinkV2';
import {
  numberArrayToRangeText,
  randomFromSet,
  randomFromSetAndSplice,
  rangeWithGaps,
  shuffleArray,
} from '../Randomizer';

import { GameLogger } from '../GameLogger';
import {
  AscendingImage,
  getGameVariant,
} from './MultiplicationTablesBalloonGameVariants';
import { UnexpectedValueError } from '../UnexpectedValueError';
import { operatorToSymbol } from '../Operator';

interface ItemInfo extends ItemInfoInterface {
  nmbr: number;
  color: Color;
}

interface ExerciseInfo {
  firstOperand: number;
  secondOperand: number;
  operator: Operator;
}

@customElement('mutiplication-tables-balloon-game-app-v2')
export class MultiplicationTablesBalloonGameV2 extends AscendingItemsGameApp<
  ExerciseInfo,
  ItemInfo
> {
  private tablesToUse: readonly number[] = [];
  private operatorsToUse: readonly Operator[] = [];
  private colorsetToUse: readonly Color[] = [];
  @state()
  private accessor ascendingImageToUse: AscendingImage = 'balloon';
  private gameLogger = new GameLogger('D', '');
  private lastTableUsed = 0;
  private lastMultiplierUsed = 0;

  get imageName(): string {
    switch (this.ascendingImageToUse) {
      case 'balloon':
        return 'ballon';
      case 'ufo':
        return 'ufo';
      case 'rocket':
        return 'raket';
      case 'zeppelin':
        return 'zeppelin';
      default:
        throw new UnexpectedValueError(this.ascendingImageToUse);
    }
  }

  /** Provides a fresh color set array based on the itemImage that can be used and changed etc. */
  getColorSet(): Color[] {
    return [...this.colorsetToUse];
  }

  get welcomeMessage(): HTMLTemplateResult {
    return html`<p>Klik op de ${this.imageName} met het juiste antwoord.</p>`;
  }

  constructor() {
    super();
    this.parseUrl();
  }

  private parseUrlWithVariant(urlParams: URLSearchParams): void {
    const variant = urlParams.get('variant');
    if (variant === null)
      throw Error(
        'Internal SW Error, parseUrlWithVariant called while there is no variant in the URL',
      );
    // Empty string is handled by getGameVariant's fallback to defaultVariant
    const extendedVariantInfo = getGameVariant(variant);
    this.tablesToUse = extendedVariantInfo.tables;
    this.operatorsToUse = extendedVariantInfo.operators;
    this.colorsetToUse = extendedVariantInfo.colorSet;
    this.ascendingImageToUse = extendedVariantInfo.image;
    this.gameLogger.setMainCode(extendedVariantInfo.mainCode);
    this.gameLogger.setSubCode(variant);
  }

  private parseUrl(): void {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('variant')) this.parseUrlWithVariant(urlParams);
    else this.parseUrlWithoutVariant(urlParams);
  }

  private parseUrlWithoutVariant(urlParams: URLSearchParams): void {
    let tableAbove10 = false;
    let divideIncluded = false;

    const tablesFromUrl = urlParams.getAll('table');
    const tables: number[] = [];
    for (const tableAsString of tablesFromUrl) {
      const table = parseInt(tableAsString, 10);
      if (
        !Number.isNaN(table) &&
        table >= 1 &&
        table <= 100 &&
        !tables.find(value => value === table)
      ) {
        tables.push(table);
        if (table > 10) tableAbove10 = true;
      }
    }
    if (tables.length === 0) this.tablesToUse = [2, 3, 4, 5, 6, 7, 8, 9, 10];
    else this.tablesToUse = tables;

    const operatorsFromUrl = urlParams.getAll('operator');
    const operators: Operator[] = [];
    for (const operator of operatorsFromUrl) {
      if (
        (operator === 'times' || operator === 'divide') &&
        !operators.find(value => value === operator)
      ) {
        operators.push(operator);
        if (operator === 'divide') divideIncluded = true;
      }
    }
    if (operators.length === 0) operators.push('times');
    this.operatorsToUse = operators;

    if (!tableAbove10 && !divideIncluded) {
      this.gameLogger.setMainCode('D');
      this.ascendingImageToUse = 'balloon';
      this.colorsetToUse = legacyBalloonColors;
    }
    if (!tableAbove10 && divideIncluded) {
      this.gameLogger.setMainCode('C');
      this.colorsetToUse = setOf20Colors;
      this.ascendingImageToUse = 'rocket';
    }
    if (tableAbove10 && !divideIncluded) {
      this.gameLogger.setMainCode('K');
      this.colorsetToUse = setOf20Colors;
      this.ascendingImageToUse = 'zeppelin';
      throw new Error('zeppelin game is not yet supported');
    }
    if (tableAbove10 && divideIncluded) {
      this.colorsetToUse = setOf20Colors;
      this.gameLogger.setMainCode('M');
      this.ascendingImageToUse = 'ufo';
    }
  }

  executeGameOverActions(): void {
    this.gameLogger.logGameOver();
  }

  protected getRoundInfo(nmbrItems: number): RoundInfo<ExerciseInfo, ItemInfo> {
    console.assert(nmbrItems === 4);

    let exerciseInfo: ExerciseInfo;
    const itemInfo: ItemInfo[] = [];
    const possibleColors = this.getColorSet();

    let allowedTables: readonly number[];
    if (this.tablesToUse.length < 2) allowedTables = this.tablesToUse;
    else
      allowedTables = this.tablesToUse.filter(
        elm => elm !== this.lastTableUsed,
      );

    const table = randomFromSet(allowedTables);
    const operator = randomFromSet(this.operatorsToUse);

    const possibleMultipliers = [
      ...rangeWithGaps(1, 11, [this.lastMultiplierUsed]),
    ];

    const multiplier = randomFromSetAndSplice(possibleMultipliers);
    const answer = multiplier * table;
    this.lastMultiplierUsed = multiplier;
    this.lastTableUsed = table;
    const colorCorrect = randomFromSetAndSplice(possibleColors);

    if (operator === 'times') {
      exerciseInfo = {
        firstOperand: multiplier,
        secondOperand: table,
        operator,
      };
      itemInfo.push({
        color: colorCorrect,
        disabled: false,
        nmbr: answer,
        correct: true,
      });
    } else {
      exerciseInfo = {
        firstOperand: answer,
        secondOperand: table,
        operator,
      };
      itemInfo.push({
        color: colorCorrect,
        disabled: false,
        nmbr: multiplier,
        correct: true,
      });
    }

    for (let i = 0; i < nmbrItems - 1; i++) {
      if (operator === 'times') {
        itemInfo.push({
          color: randomFromSetAndSplice(possibleColors),
          correct: false,
          disabled: false,
          nmbr: table * randomFromSetAndSplice(possibleMultipliers),
        });
      } else {
        // operator === 'divide'
        itemInfo.push({
          color: randomFromSetAndSplice(possibleColors),
          correct: false,
          disabled: false,
          nmbr: randomFromSetAndSplice(possibleMultipliers),
        });
      }
    }

    shuffleArray(itemInfo);

    return {
      exerciseInfo,
      itemInfo,
    };
  }

  get welcomeDialogTitle(): string {
    return 'Tafeltjes oefenen';
  }

  get gameOverIntroductionText(): HTMLTemplateResult {
    let operatorText = ``;

    if (this.operatorsToUse.length === 2) {
      operatorText = `keer- en deelsommen`;
    } else if (
      this.operatorsToUse.length === 1 &&
      this.operatorsToUse[0] === 'divide'
    ) {
      operatorText = `deelsommen`;
    } else if (
      this.operatorsToUse.length === 1 &&
      this.operatorsToUse[0] === 'times'
    ) {
      operatorText = `keersommen`;
    }

    const tafelText = numberArrayToRangeText(this.tablesToUse);

    const tafelNoun = this.tablesToUse.length === 1 ? 'tafel' : 'tafels';

    return html`<p>
      Je hebt ${operatorText} geoefend met de ${tafelNoun} van ${tafelText}.
    </p>`;
  }

  static get styles(): CSSResultArray {
    return [
      ...super.styles,
      css`
        flying-saucer {
          width: 80%;
          height: 80%;
        }

        numbered-balloon {
          width: 100%;
          height: 100%;
        }

        rocket-image {
          width: 90%;
          height: 90%;
        }

        zeppelin-image {
          width: 90%;
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

  protected renderExercise(exerciseInfo: ExerciseInfo): HTMLTemplateResult {
    return html`<svg viewBox="-100 -25 200 50">
      <text x="0" y="0">
        ${exerciseInfo.firstOperand} ${operatorToSymbol(exerciseInfo.operator)}
        ${exerciseInfo.secondOperand} =
      </text>
    </svg>`;
  }

  renderFlyingSaucer(itemInfo: ItemInfo): HTMLTemplateResult {
    return html` <flying-saucer
      .color=${itemInfo.color}
      .content=${`${itemInfo.nmbr}`}
      ?disabled=${itemInfo.disabled}
    ></flying-saucer>`;
  }

  renderBalloon(itemInfo: ItemInfo): HTMLTemplateResult {
    return html`
      <numbered-balloon
        .color=${itemInfo.color}
        .nmbrToShow=${itemInfo.nmbr}
        ?disabled=${itemInfo.disabled}
      ></numbered-balloon>
    `;
  }

  renderRocket(itemInfo: ItemInfo): HTMLTemplateResult {
    return html` <rocket-image
      .color=${itemInfo.color}
      .nmbrToShow=${itemInfo.nmbr}
      ?disabled=${itemInfo.disabled}
    ></rocket-image>`;
  }

  renderZeppelin(itemInfo: ItemInfo): HTMLTemplateResult {
    return html` <zeppelin-image
      .color=${itemInfo.color}
      .nmbrToShow=${itemInfo.nmbr}
      ?disabled=${itemInfo.disabled}
    ></zeppelin-image>`;
  }

  renderItem(itemInfo: ItemInfo): HTMLTemplateResult {
    switch (this.ascendingImageToUse) {
      case 'balloon':
        return this.renderBalloon(itemInfo);
      case 'ufo':
        return this.renderFlyingSaucer(itemInfo);
      case 'rocket':
        return this.renderRocket(itemInfo);
      case 'zeppelin':
        return this.renderZeppelin(itemInfo);
      default:
        throw new UnexpectedValueError(this.ascendingImageToUse);
    }
  }
}
