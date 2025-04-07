// eslint-disable-next-line import/extensions
import { customElement } from 'lit/decorators.js';

import { css, CSSResultArray, html, HTMLTemplateResult } from 'lit';

// eslint-disable-next-line import/extensions
import { range } from 'lit/directives/range.js';

import {
  AscendingItemsGameApp,
  ItemInfoInterface,
  RoundInfo,
} from './AscendingItemsGameApp';
import { Color, colors } from './Colors';

import './FlyingSaucer';

import { Operator } from './MultiplicationTablesBalloonGameLinkV2';
import {
  randomFromSet,
  randomFromSetAndSplice,
  shuffleArray,
} from './Randomizer';

interface ItemInfo extends ItemInfoInterface {
  nmbr: number;
  color: Color;
}

interface ExerciseInfo {
  firstOperand: number;
  secondOperand: number;
  operator: Operator;
}

function operatorToSymbol(operator: Operator) {
  if (operator === 'times') return '×';
  if (operator === 'divide') return ':';
  throw Error('Internal software error: unexpected operator');
}

@customElement('mutiplication-tables-balloon-game-app-v2')
export class MultiplicationTablesBalloonGameV2 extends AscendingItemsGameApp<
  ExerciseInfo,
  ItemInfo
> {
  private tablesToUse: number[] = [12];
  private operatorsToUse: Operator[] = ['times', 'divide'];

  get welcomeMessage(): HTMLTemplateResult {
    return html`Klik op de ufo met het juiste antwoord`;
  }

  protected getRoundInfo(nmbrItems: number): RoundInfo<ExerciseInfo, ItemInfo> {
    console.assert(nmbrItems === 4);

    let exerciseInfo: ExerciseInfo;
    const itemInfo: ItemInfo[] = [];
    const possibleColors = [...colors];

    const table = randomFromSet(this.tablesToUse);
    const operator = randomFromSet(this.operatorsToUse);

    const possibleMultipliers = [...range(2, 10)];

    const multiplier = randomFromSetAndSplice(possibleMultipliers);
    const answer = multiplier * table;
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

    console.log(JSON.stringify(itemInfo));
    shuffleArray(itemInfo);
    console.log(JSON.stringify(itemInfo));

    return {
      exerciseInfo,
      itemInfo,
    };
  }

  get welcomeDialogTitle(): string {
    return 'Tafeltjes oefenen';
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
    console.log(`renderItem - itemInfo = ${JSON.stringify(itemInfo)}`);
    return html` <flying-saucer
      .color=${itemInfo.color}
      .content=${itemInfo.nmbr}
      ?disabled=${itemInfo.disabled}
    ></flying-saucer>`;
  }
}
