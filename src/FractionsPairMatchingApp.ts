import { html, css } from 'lit';

import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { customElement } from 'lit/decorators.js';

import { FractionAndRepresentation, FractionRepresentation } from './Fraction';
import './FractionElement';

import type { Pair } from './PairMatchingApp';
import { PairMatchingApp } from './PairMatchingApp';
import { GameLogger } from './GameLogger';
import { randomFromSet, randomFromSetAndSplice } from './Randomizer';
import { FractionPairMatchingGameType } from './FractionsPairMatchingAppLink';

type DenumeratorFrequecy = { denumerator: number; frequency: number };
type DenumeratorFrequecies = DenumeratorFrequecy[];
type GameToDenumeratorFrequencies = {
  gameType: FractionPairMatchingGameType;
  denumeratorFrequencies: DenumeratorFrequecies;
}[];

type DenumeratorPossibleNumerators = {
  denumerator: number;
  potentialNumerators: number[];
}[];

const gameToDenumeratorFrequencies: GameToDenumeratorFrequencies = [
  {
    gameType: 'fractionToPie',
    denumeratorFrequencies: [
      { denumerator: 2, frequency: 1 },
      { denumerator: 3, frequency: 1 },
      { denumerator: 4, frequency: 2 },
      { denumerator: 5, frequency: 2 },
      { denumerator: 6, frequency: 2 },
      { denumerator: 7, frequency: 3 },
      { denumerator: 8, frequency: 3 },
      { denumerator: 9, frequency: 3 },
      { denumerator: 10, frequency: 3 },
    ],
  },
  {
    gameType: 'equalFractions',
    denumeratorFrequencies: [
      { denumerator: 2, frequency: 1 },
      { denumerator: 3, frequency: 1 },
      { denumerator: 4, frequency: 1 },
      { denumerator: 5, frequency: 1 },
    ],
  },
  {
    gameType: 'fractionToDecimal',
    denumeratorFrequencies: [
      { denumerator: 2, frequency: 1 },
      { denumerator: 3, frequency: 1 },
      { denumerator: 4, frequency: 2 },
      { denumerator: 5, frequency: 2 },
      { denumerator: 8, frequency: 3 },
      { denumerator: 10, frequency: 2 },
    ],
  },
  {
    gameType: 'fractionToPercentage',
    denumeratorFrequencies: [
      { denumerator: 2, frequency: 1 },
      { denumerator: 3, frequency: 1 },
      { denumerator: 4, frequency: 2 },
      { denumerator: 5, frequency: 2 },
      { denumerator: 8, frequency: 3 },
      { denumerator: 10, frequency: 2 },
    ],
  },
  {
    gameType: 'percentageToDecimal',
    denumeratorFrequencies: [
      { denumerator: 2, frequency: 1 },
      { denumerator: 3, frequency: 1 },
      { denumerator: 4, frequency: 2 },
      { denumerator: 5, frequency: 2 },
      { denumerator: 8, frequency: 3 },
      { denumerator: 10, frequency: 2 },
    ],
  },
  {
    gameType: 'percentageToPie',
    denumeratorFrequencies: [
      { denumerator: 2, frequency: 1 },
      { denumerator: 3, frequency: 1 },
      { denumerator: 4, frequency: 2 },
      { denumerator: 5, frequency: 2 },
      { denumerator: 8, frequency: 3 },
      { denumerator: 10, frequency: 2 },
    ],
  },
];

@customElement('fraction-pair-matching-app')
export class FractionMatchingGameApp extends PairMatchingApp<FractionAndRepresentation> {
  potentialDenumerators: number[] = [];
  potentialNumerators: DenumeratorPossibleNumerators = [];

  private gameLogger = new GameLogger('I', '');

  private representations: {
    exercise: FractionRepresentation;
    answer: FractionRepresentation;
  } = { exercise: 'fraction', answer: 'piechart' };

  private fractionPairs: {
    exercise: FractionAndRepresentation;
    answer: FractionAndRepresentation;
  }[] = [];

  gameType: FractionPairMatchingGameType = 'fractionToPie';

  async firstUpdated(): Promise<void> {
    await this.getUpdateComplete();

    /* Workaround for bug found in firefox where draggable=false is ignored in case user-select is set to none.
     * Please note that this expression cannot pierce into webcomponent's shadowroms.
     * The img in slots are found though.
     */
    if (window.navigator.userAgent.toLowerCase().includes('firefox')) {
      this.renderRoot.querySelectorAll('img[draggable=false]').forEach(el => {
        el.addEventListener('mousedown', event => event.preventDefault());
      });
    }

    return super.firstUpdated();
  }

  get welcomeMessage(): HTMLTemplateResult {
    return html`<p>Sleep de breuken die hetzelfde zijn over elkaar.</p>`;
  }

  /** Get the title for the welcome dialog. */
  get welcomeDialogTitle(): string {
    return `Breuken paren spel`;
  }

  startNewGame(): void {
    this.potentialDenumerators = [];
    this.potentialNumerators = [];
    this.fillPotentialDenumerators(true);
    super.startNewGame();
  }

  fillPotentialDenumerators(refillNumerators = false): void {
    const denumeratorFrequencies = gameToDenumeratorFrequencies.find(
      elm => elm.gameType === this.gameType,
    )?.denumeratorFrequencies;

    if (denumeratorFrequencies === undefined)
      throw new Error(
        `no denumerator frequencies avaialble for gameType ${this.gameType}`,
      );

    for (const denumeratorFrequency of denumeratorFrequencies) {
      if (refillNumerators)
        this.fillPotentialNumerators(denumeratorFrequency.denumerator);
      for (let i = 0; i < denumeratorFrequency.frequency; i++) {
        this.potentialDenumerators.push(denumeratorFrequency.denumerator);
      }
    }
  }

  fillPotentialNumerators(denumerator: number): void {
    let potentialNumerators = this.potentialNumerators.find(
      elm => elm.denumerator === denumerator,
    )?.potentialNumerators;

    if (potentialNumerators === undefined) {
      potentialNumerators = [];
      this.potentialNumerators.push({ denumerator, potentialNumerators });
    }
    for (let numerator = 1; numerator < denumerator; numerator++) {
      potentialNumerators.push(numerator);
    }
  }

  executeGameOverActions(): void {
    this.gameLogger.logGameOver();
  }

  protected parseFractionMatchingFromUrl(): void {
    this.dropAllowed = 'opositeElements';

    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has('gameType')) {
      const gameType = urlParams.get('gameType');
      if (gameType === 'equalFractions') {
        this.gameType = 'equalFractions';
        this.representations.exercise = 'fraction';
        this.representations.answer = 'fraction';
        this.dropAllowed = 'allElements';
      } else if (gameType === 'fractionToDecimal') {
        this.gameType = 'fractionToDecimal';
        this.representations.exercise = 'fraction';
        this.representations.answer = 'decimal';
        this.dropAllowed = 'opositeElements';
      } else if (gameType === 'fractionToPercentage') {
        this.gameType = 'fractionToPercentage';
        this.representations.exercise = 'fraction';
        this.representations.answer = 'percentage';
        this.dropAllowed = 'opositeElements';
      } else if (gameType === 'percentageToDecimal') {
        this.gameType = 'percentageToDecimal';
        this.representations.exercise = 'percentage';
        this.representations.answer = 'decimal';
        this.dropAllowed = 'opositeElements';
      } else if (gameType === 'percentageToPie') {
        this.gameType = 'percentageToPie';
        this.representations.exercise = 'percentage';
        this.representations.answer = 'piechart';
        this.dropAllowed = 'opositeElements';
      } else {
        /* includes gameType === 'fractionToPie', which is default */
        this.gameType = 'fractionToPie';
        this.representations.exercise = 'fraction';
        this.representations.answer = 'piechart';
        this.dropAllowed = 'opositeElements';
      }
    }
  }

  constructor() {
    super();
    this.parseFractionMatchingFromUrl();
  }

  static get styles(): CSSResultArray {
    return [
      ...super.styles,
      css`
        fraction-element {
          width: 100%;
          aspect-ratio: 1;
        }
      `,
    ];
  }

  renderPairElement(info: FractionAndRepresentation): HTMLTemplateResult {
    return html`
      <fraction-element
        .fraction=${info.fraction}
        .representation=${info.representation}
      ></fraction-element>
    `;
  }

  getPair(): Pair<FractionAndRepresentation> {
    let denumerator = 1;
    let numerator = 0;
    let ret: Pair<FractionAndRepresentation> = {
      exercise: new FractionAndRepresentation(),
      answer: new FractionAndRepresentation(),
    };

    denumerator = randomFromSetAndSplice(this.potentialDenumerators);
    if (this.potentialDenumerators.length < 2) this.fillPotentialDenumerators();

    const potentialNumerators = this.potentialNumerators.find(
      elm => elm.denumerator === denumerator,
    )?.potentialNumerators;

    if (potentialNumerators === undefined)
      throw new Error(`No numerators found for denumerator ${denumerator}`);

    numerator = randomFromSetAndSplice(potentialNumerators);
    if (potentialNumerators.length < 1)
      this.fillPotentialNumerators(denumerator);

    if (this.gameType === 'equalFractions') {
      const possibleMultipliers = [];
      let i = 2;
      while (denumerator * i <= 10) {
        possibleMultipliers.push(i);
        i += 1;
      }
      const multiplier = randomFromSet(possibleMultipliers);
      ret = {
        exercise: new FractionAndRepresentation(
          numerator,
          denumerator,
          this.representations.exercise,
        ),
        answer: new FractionAndRepresentation(
          multiplier * numerator,
          multiplier * denumerator,
          this.representations.answer,
        ),
      };
    } else {
      ret = {
        exercise: new FractionAndRepresentation(
          numerator,
          denumerator,
          this.representations.exercise,
        ),
        answer: new FractionAndRepresentation(
          numerator,
          denumerator,
          this.representations.answer,
        ),
      };
    }

    return ret;
  }

  pairEqual(
    fraction1: FractionAndRepresentation,
    fraction2: FractionAndRepresentation,
  ) {
    return fraction1.fraction.equal(fraction2.fraction);
  }
}
