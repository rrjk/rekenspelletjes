import { customElement } from 'lit/decorators.js';

import { css, CSSResultArray, html, HTMLTemplateResult } from 'lit';

import {
  AscendingItemsGameApp,
  ItemInfoInterface,
  RoundInfo,
} from '../AscendingItemsGameApp';
import { Color, legacyBalloonColors } from '../Colors';

import '../NumberedBalloon';

import '../SimpleSplitWidget';

import {
  numberArrayToRangeText,
  randomFromSet,
  randomFromSetAndSplice,
  shuffleArray,
} from '../Randomizer';

import { GameLogger } from '../GameLogger';
import { getRange } from '../NumberHelperFunctions';

import { getSplitBalloonGameVariant } from './SplitBalloonGameVariants';

interface ItemInfo extends ItemInfoInterface {
  nmbr: number;
  color: Color;
}

interface ExerciseInfo {
  numberToSplit: number;
  firstSplit: number;
  secondSplit: number;
}

/** Custom element for a game to exercise is splitting numbers
 * The player has to click the proper balloon.
 *
 * The following url parameters are supported
 * - variant - Variant code (e.g., sl, br, bt, etc.) - uses predefined configurations
 * - time - Time to play in seconds
 * - number* - Number that have to split. May be one number, may be multiple numbers. Allowed numbers 3-10 (legacy mode)
 */
@customElement('split-balloon-game-app')
export class SplitBalloonGameApp extends AscendingItemsGameApp<
  ExerciseInfo,
  ItemInfo
> {
  private possibleNumbersToSplit: number[] = [];
  private gameLogger = new GameLogger('R', '');

  private lastNumberToSplitUsed = 0;
  private lastSecondSplitUsed = 0;

  private possibleColors: Color[] = [];

  get welcomeMessage(): HTMLTemplateResult {
    return html`<p>Klik op de ballon met het juiste antwoord.</p>`;
  }

  constructor() {
    super();
    this.parseUrl();
  }

  /** Parse URL with variant parameter */
  private parseUrlWithVariant(urlParams: URLSearchParams): void {
    const variant = urlParams.get('variant');
    if (variant === null)
      throw Error(
        'Internal SW Error, parseUrlWithVariant called while there is no variant in the URL',
      );
    // Empty string is handled by getSplitBalloonGameVariant's fallback to defaultVariant
    const extendedVariantInfo = getSplitBalloonGameVariant(variant);

    this.possibleNumbersToSplit = [...extendedVariantInfo.numbersToSplit];

    // All variants use legacyBalloonColors
    this.possibleColors = [...legacyBalloonColors];

    this.gameLogger.setMainCode(extendedVariantInfo.mainCode);
    this.gameLogger.setSubCode(variant);
  }

  /** Parse URL with explicit parameters (legacy support) */
  private parseUrlWithoutVariant(urlParams: URLSearchParams): void {
    const nmbrsFromUrl = urlParams.getAll('number');
    this.possibleNumbersToSplit = [];
    for (const nmbrAsString of nmbrsFromUrl) {
      const nmbr = parseInt(nmbrAsString, 10);
      if (
        !Number.isNaN(nmbr) &&
        nmbr >= 3 &&
        nmbr <= 10 &&
        !this.possibleNumbersToSplit.find(value => value === nmbr)
      ) {
        this.possibleNumbersToSplit.push(nmbr);
      }
    }
    if (this.possibleNumbersToSplit.length === 0)
      this.possibleNumbersToSplit = [9];

    // All variants use legacyBalloonColors
    this.possibleColors = [...legacyBalloonColors];

    // Determine mainCode based on parsed parameters
    this.gameLogger.setMainCode(this.determineMainCodeFromParams());
  }

  /** Main URL parsing function */
  private parseUrl(): void {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('variant')) this.parseUrlWithVariant(urlParams);
    else this.parseUrlWithoutVariant(urlParams);
  }

  /** Determine mainCode from explicit parameters */
  private determineMainCodeFromParams(): string {
    return 'R';
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

    let allowedNumbersToSplit: number[];
    if (this.possibleNumbersToSplit.length < 2)
      allowedNumbersToSplit = this.possibleNumbersToSplit;
    else
      allowedNumbersToSplit = this.possibleNumbersToSplit.filter(
        elm => elm !== this.lastNumberToSplitUsed,
      );

    exerciseInfo.numberToSplit = randomFromSet(allowedNumbersToSplit);
    this.lastNumberToSplitUsed = exerciseInfo.numberToSplit;

    let possibleSecondSplitNumbers: number[];
    possibleSecondSplitNumbers = getRange(0, exerciseInfo.numberToSplit);

    possibleSecondSplitNumbers = possibleSecondSplitNumbers.filter(
      elm => elm !== this.lastSecondSplitUsed,
    );

    exerciseInfo.secondSplit = randomFromSet(possibleSecondSplitNumbers);
    this.lastSecondSplitUsed = exerciseInfo.secondSplit;

    exerciseInfo.firstSplit =
      exerciseInfo.numberToSplit - exerciseInfo.secondSplit;

    const possibleColors: Color[] = [...this.possibleColors];
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

    return html`<p>Je hebt geoefend met het splitsen van ${numbersText}.</p>`;
  }

  static get styles(): CSSResultArray {
    return [
      ...super.styles,
      css`
        numbered-balloon {
          width: 100%;
          height: 100%;
        }

        simple-split-widget {
          width: 100%;
          height: 100%;
        }

        text {
          user-select: none;
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
    return html` <numbered-balloon
      .color=${itemInfo.color}
      .nmbrToShow=${itemInfo.nmbr}
      ?disabled=${itemInfo.disabled}
    ></numbered-balloon>`;
  }
}
