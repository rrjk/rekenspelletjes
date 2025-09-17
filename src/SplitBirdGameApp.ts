import { customElement } from 'lit/decorators.js';

import { css, CSSResultArray, html, HTMLTemplateResult } from 'lit';

import {
  AscendingItemsGameApp,
  ItemInfoInterface,
  RoundInfo,
} from './AscendingItemsGameApp';
import { Color, colors } from './Colors';

import './NumberedBird';
import './SimpleSplitWidget';

import {
  numberArrayToRangeText,
  randomFromSet,
  randomFromSetAndSplice,
  randomIntFromRange,
  shuffleArray,
} from './Randomizer';

import { GameLogger } from './GameLogger';

interface ItemInfo extends ItemInfoInterface {
  nmbr: number;
  color: Color;
}

interface ExerciseInfo {
  numberToSplit: number;
  firstSplit: number;
  secondSplit: number;
}

@customElement('split-bird-game-app')
export class SplitBirdGameV2 extends AscendingItemsGameApp<
  ExerciseInfo,
  ItemInfo
> {
  private possibleNumbersToSplit: number[] = [];
  private gameLogger = new GameLogger('R', '');

  private lastNumberToSplitUsed = 0;

  get welcomeMessage(): HTMLTemplateResult {
    return html`<p>Klik op de vogel met het juiste antwoord.</p>`;
  }

  constructor() {
    super();
    this.parseUrl();
  }

  private parseUrl(): void {
    const urlParams = new URLSearchParams(window.location.search);

    const nmbrsFromUrl = urlParams.getAll('number');
    this.possibleNumbersToSplit = [];
    for (const nmbrAsString of nmbrsFromUrl) {
      const nmbr = parseInt(nmbrAsString, 10);
      if (
        !Number.isNaN(nmbr) &&
        nmbr >= 1 &&
        nmbr <= 10 &&
        !this.possibleNumbersToSplit.find(value => value === nmbr)
      ) {
        this.possibleNumbersToSplit.push(nmbr);
      }
    }
    if (this.possibleNumbersToSplit.length === 0)
      this.possibleNumbersToSplit = [9];
  }

  executeGameOverActions(): void {
    this.gameLogger.logGameOver();
  }

  protected getRoundInfo(nmbrItems: number): RoundInfo<ExerciseInfo, ItemInfo> {
    console.assert(nmbrItems === 4);

    const exerciseInfo: ExerciseInfo = {
      numberToSplit: 0,
      firstSplit: 0,
      secondSplit: 0,
    };
    const itemInfo: ItemInfo[] = [];

    const possibleColors = [...colors];

    let allowedNumbersToSplit: number[];
    if (this.possibleNumbersToSplit.length < 2)
      allowedNumbersToSplit = this.possibleNumbersToSplit;
    else
      allowedNumbersToSplit = this.possibleNumbersToSplit.filter(
        elm => elm !== this.lastNumberToSplitUsed,
      );

    exerciseInfo.numberToSplit = randomFromSet(allowedNumbersToSplit);
    exerciseInfo.firstSplit = randomIntFromRange(0, exerciseInfo.numberToSplit);
    exerciseInfo.secondSplit =
      exerciseInfo.numberToSplit - exerciseInfo.firstSplit;

    const colorCorrect = randomFromSetAndSplice(possibleColors);

    itemInfo.push({
      color: colorCorrect,
      disabled: false,
      nmbr: exerciseInfo.secondSplit,
      correct: true,
    });

    const possibleRandomWrongAnswers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(
      elm => elm !== exerciseInfo.secondSplit,
    );
    shuffleArray(possibleRandomWrongAnswers);
    const wrongAnswers = possibleRandomWrongAnswers.splice(nmbrItems - 1);

    for (let i = 0; i < nmbrItems - 1; i++) {
      itemInfo.push({
        color: randomFromSetAndSplice(possibleColors),
        correct: false,
        disabled: false,
        nmbr: wrongAnswers[i],
      });
    }

    shuffleArray(itemInfo);

    return {
      exerciseInfo,
      itemInfo,
    };
  }

  get welcomeDialogTitle(): string {
    return 'Splitsen van getallen';
  }

  get gameOverIntroductionText(): HTMLTemplateResult {
    const numbersText = numberArrayToRangeText(this.possibleNumbersToSplit);

    return html`<p>Je hebt geoefend met hety splitsen van ${numbersText}.</p>`;
  }

  static get styles(): CSSResultArray {
    return [
      ...super.styles,
      css`
        numbered-bird {
          width: 100%;
          height: 100%;
        }

        simple-split-widget {
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
    return html`<simple-split-widget
      numberToSplit=${exerciseInfo.numberToSplit}
      firstSplit=${exerciseInfo.firstSplit}
    ></simple-split-widget> `;
  }

  renderItem(itemInfo: ItemInfo): HTMLTemplateResult {
    return html` <numbered-bird
      .birdColor=${itemInfo.color}
      .nmbrToShow=${itemInfo.nmbr}
      ?disabled=${itemInfo.disabled}
    ></flying-saucer>`;
  }
}
