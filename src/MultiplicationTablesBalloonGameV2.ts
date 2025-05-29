import { customElement } from 'lit/decorators.js';

import { css, CSSResultArray, html, HTMLTemplateResult } from 'lit';

import {
  AscendingItemsGameApp,
  ItemInfoInterface,
  RoundInfo,
} from './AscendingItemsGameApp';
import { Color, colors } from './Colors';

import './FlyingSaucer';

import { Operator } from './MultiplicationTablesBalloonGameLinkV2';
import {
  numberArrayToRangeText,
  randomFromSet,
  randomFromSetAndSplice,
  rangeWithGaps,
  shuffleArray,
} from './Randomizer';

import { GameLogger } from './GameLogger';

interface ItemInfo extends ItemInfoInterface {
  nmbr: number;
  color: Color;
}

interface ExerciseInfo {
  firstOperand: number;
  secondOperand: number;
  operator: Operator;
}

type ItemImage = 'flyingSaucer' | 'balloon' | 'zeppelin' | 'rocket';

function operatorToSymbol(operator: Operator) {
  if (operator === 'times') return '×';
  if (operator === 'divide') return '∶';
  throw Error('Internal software error: unexpected operator');
}

@customElement('mutiplication-tables-balloon-game-app-v2')
export class MultiplicationTablesBalloonGameV2 extends AscendingItemsGameApp<
  ExerciseInfo,
  ItemInfo
> {
  private tablesToUse: number[] = [];
  private operatorsToUse: Operator[] = [];
  private itemImage: ItemImage = 'flyingSaucer';
  private gameLogger = new GameLogger('D', '');

  private lastTableUsed: number = 0;
  private lastMultiplierUsed: number = 0;

  get welcomeMessage(): HTMLTemplateResult {
    return html`Klik op de ufo met het juiste antwoord`;
  }

  constructor() {
    super();
    this.parseUrl();
  }

  private parseUrl(): void {
    const urlParams = new URLSearchParams(window.location.search);

    let tableAbove10 = false;
    let divideIncluded = false;

    const tablesFromUrl = urlParams.getAll('table');
    this.tablesToUse = [];
    for (const tableAsString of tablesFromUrl) {
      const table = parseInt(tableAsString, 10);
      if (
        !Number.isNaN(table) &&
        table >= 1 &&
        table <= 100 &&
        !this.tablesToUse.find(value => value === table)
      ) {
        this.tablesToUse.push(table);
        if (table > 10) tableAbove10 = true;
      }
    }
    if (this.tablesToUse.length === 0)
      this.tablesToUse = [2, 3, 4, 5, 6, 7, 8, 9, 10];

    const operatorsFromUrl = urlParams.getAll('operator');
    this.operatorsToUse = [];
    for (const operator of operatorsFromUrl) {
      if (
        (operator === 'times' || operator === 'divide') &&
        !this.operatorsToUse.find(value => value === operator)
      ) {
        this.operatorsToUse.push(operator);
        if (operator === 'divide') divideIncluded = true;
      }
    }
    if (this.operatorsToUse.length === 0) this.operatorsToUse.push('times');

    if (!tableAbove10 && !divideIncluded) {
      this.itemImage = 'balloon';
      this.gameLogger.setMainCode('D');
      throw new Error('balloon game is not yet supported');
    }
    if (!tableAbove10 && divideIncluded) {
      this.itemImage = 'rocket';
      this.gameLogger.setMainCode('C');
      throw new Error('rocket game is not yet supported');
    }
    if (tableAbove10 && !divideIncluded) {
      this.itemImage = 'zeppelin';
      this.gameLogger.setMainCode('K');
      throw new Error('zeppelin game is not yet supported');
    }
    if (tableAbove10 && divideIncluded) {
      this.itemImage = 'flyingSaucer';
      this.gameLogger.setMainCode('M');
    }
  }

  executeGameOverActions(): void {
    this.gameLogger.logGameOver();
  }

  protected getRoundInfo(nmbrItems: number): RoundInfo<ExerciseInfo, ItemInfo> {
    console.assert(nmbrItems === 4);

    let exerciseInfo: ExerciseInfo;
    const itemInfo: ItemInfo[] = [];
    const possibleColors = [...colors];

    let allowedTables: number[];
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

    return html`Je hebt ${operatorText} geoefend met de ${tafelNoun} van
    ${tafelText}.`;
  }

  static get styles(): CSSResultArray {
    return [
      ...super.styles,
      css`
        flying-saucer {
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

  protected renderExercise(exerciseInfo: ExerciseInfo): HTMLTemplateResult {
    return html`<svg viewBox="-100 -25 200 50">
      <text x="0" y="0">
        ${exerciseInfo.firstOperand} ${operatorToSymbol(exerciseInfo.operator)}
        ${exerciseInfo.secondOperand} =
      </text>
    </svg>`;
  }

  renderItem(itemInfo: ItemInfo): HTMLTemplateResult {
    return html` <flying-saucer
      .color=${itemInfo.color}
      .content=${`${itemInfo.nmbr}`}
      ?disabled=${itemInfo.disabled}
    ></flying-saucer>`;
  }
}
