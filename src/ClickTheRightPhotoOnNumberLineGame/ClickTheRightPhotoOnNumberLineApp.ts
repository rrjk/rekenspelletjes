/* eslint-disable   @typescript-eslint/no-unsafe-argument -- legacy, use of CustomEvent details field */
/* eslint-disable   @typescript-eslint/no-unsafe-member-access -- legacy, use of CustomEvent details field */

import { HTMLTemplateResult, html } from 'lit';
import { state } from 'lit/decorators.js';

import { TimeLimitedGame2 } from '../TimeLimitedGame2';
import '../NumberLineHangingPhotos';

import { randomIntFromRange } from '../Randomizer';

import { GameLogger } from '../GameLogger';
import {
  getClickTheRightPhotoOnNumberLineVariant,
  type ClickTheRightPhotoOnNumberLineExtendedVariantInfo,
} from './ClickTheRightPhotoOnNumberLineVariants';

import '../MessageDialogV2';
import '../GameOverDialogV2';
import {
  DescribeNumberLineParameters,
  type NumberLineParameters,
} from '../NumberLineParameters';

class ClickTheRightPhotoOnNumberLineApp extends TimeLimitedGame2 {
  @state()
  accessor numberToClick = 8;

  @state()
  accessor numberLineParameters: NumberLineParameters = {
    minimum: 0,
    maximum: 100,
    show10TickMarks: false,
    show5TickMarks: false,
    show1TickMarks: false,
    showAll10Numbers: false,
  };

  @state()
  accessor positions: number[] = [];

  @state()
  accessor disabledPositions: number[] = [];

  private gameLogger = new GameLogger('T', 'a');

  constructor() {
    super();
    this.parseUrl();
  }

  private parseUrl(): void {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('variant')) this.parseUrlWithVariant(urlParams);
    else this.parseUrlWithoutVariant(urlParams);
  }

  private parseUrlWithVariant(urlParams: URLSearchParams): void {
    const variant = urlParams.get('variant');
    if (variant === null)
      throw new Error(
        'Internal SW Error, parseUrlWithVariant called while there is no variant in the URL',
      );

    const extendedVariantInfo: ClickTheRightPhotoOnNumberLineExtendedVariantInfo =
      getClickTheRightPhotoOnNumberLineVariant(variant);
    this.numberLineParameters = extendedVariantInfo.numberLineParameters;
    this.numberToClick = extendedVariantInfo.mid;

    this.gameLogger.setMainCode(extendedVariantInfo.mainCode);
    this.gameLogger.setSubCode(variant);
  }

  private parseUrlWithoutVariant(urlParams: URLSearchParams): void {
    let minimum = 0;
    let maximum = 100;
    let show10TickMarks = false;
    let show5TickMarks = false;
    let show1TickMarks = false;
    let showAll10Numbers = false;

    const minimumAsString = urlParams.get('minimum');
    if (minimumAsString !== null) {
      const parsedMinimum = parseInt(minimumAsString, 10);
      if (!Number.isNaN(parsedMinimum) && parsedMinimum % 10 === 0) {
        minimum = parsedMinimum;
      }
    }

    const maximumAsString = urlParams.get('maximum');
    if (maximumAsString !== null) {
      const parsedMaximum = parseInt(maximumAsString, 10);
      if (!Number.isNaN(parsedMaximum) && parsedMaximum % 10 === 0) {
        maximum = parsedMaximum;
      }
    }

    this.numberToClick = Math.floor((maximum + minimum) / 2);

    if (urlParams.has('show10TickMarks')) {
      show10TickMarks = true;
    } else if (urlParams.has('hide10TickMarks')) {
      show10TickMarks = false;
    }
    if (urlParams.has('show5TickMarks')) {
      show5TickMarks = true;
    } else if (urlParams.has('hide5TickMarks')) {
      show5TickMarks = false;
    }
    if (urlParams.has('show1TickMarks')) {
      show1TickMarks = true;
    } else if (urlParams.has('hide1TickMarks')) {
      show1TickMarks = false;
    }
    if (urlParams.has('showAll10Numbers')) {
      showAll10Numbers = true;
    } else if (urlParams.has('hideAll10Numbers')) {
      showAll10Numbers = false;
    }

    this.numberLineParameters = {
      minimum,
      maximum,
      show10TickMarks,
      show5TickMarks,
      show1TickMarks,
      showAll10Numbers,
    };

    this.gameLogger.setMainCode('T');
    this.gameLogger.setSubCode('a');
  }

  handlePhotoClicked(event: CustomEvent) {
    if (event.detail.position !== this.numberToClick) {
      this.disabledPositions = this.disabledPositions.concat(
        event.detail.position,
      );
      this.numberNok += 1;
    } else {
      this.numberOk += 1;
      this.newRound();
    }
  }

  startNewGame(): void {
    super.startNewGame();
    this.newRound();
  }

  newRound(): void {
    this.disabledPositions = [];
    this.numberToClick = randomIntFromRange(
      this.numberLineParameters.minimum,
      this.numberLineParameters.maximum,
    );
    this.positions = [this.numberToClick];
    while (this.positions.length < 4) {
      const position = randomIntFromRange(
        this.numberLineParameters.minimum,
        this.numberLineParameters.maximum,
      );
      if (!this.positions.some(element => element === position))
        this.positions.push(position);
    }
  }

  executeGameOverActions(): void {
    this.gameLogger.logGameOver();
  }

  get welcomeMessage(): HTMLTemplateResult {
    return html`
      <p>Kies de juiste foto op de getallenlijn.</p>
      <p>Dit spel kun je op de telefoon het beste horizontaal spelen.</p>
      <p>
        We spelen op een getallenlijn van
        ${DescribeNumberLineParameters(this.numberLineParameters, 'present')}
      </p>
    `;
  }

  get welcomeDialogTitle(): string {
    return 'Kies de juiste foto';
  }

  get gameOverIntroductionText(): HTMLTemplateResult {
    return html`
      <p>Je hebt het <i>Kies de juiste foto</i> spel gespeeld</p>
      <p>
        De getallenlijn liep van
        ${DescribeNumberLineParameters(this.numberLineParameters, 'past')}
      </p>
    `;
  }

  renderGameContent(): HTMLTemplateResult {
    return html`
      <div style="text-align: center; font-size: 8vw;">
        ${this.numberToClick}
      </div>
      <number-line-hanging-photos
        id="numberLine"
        ?show10TickMarks=${this.numberLineParameters.show10TickMarks}
        ?show5TickMarks=${this.numberLineParameters.show5TickMarks}
        ?show1TickMarks=${this.numberLineParameters.show1TickMarks}
        ?showAll10Numbers=${this.numberLineParameters.showAll10Numbers}
        minimum=${this.numberLineParameters.minimum}
        maximum=${this.numberLineParameters.maximum}
        width="95vw"
        .photoPositions=${this.positions}
        .disabledPositions=${this.disabledPositions}
        @photo-clicked=${(evt: CustomEvent) => this.handlePhotoClicked(evt)}
        style="position:absolute; left: 2.5vw; top: 30vh; width:95vw;"
      ></number-line-hanging-photos>
    `;
  }
}

customElements.define(
  'click-correct-photo-on-numberline-app',
  ClickTheRightPhotoOnNumberLineApp,
);
