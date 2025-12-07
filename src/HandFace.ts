import { LitElement, html, css } from 'lit';
import type { HTMLTemplateResult, CSSResultArray } from 'lit';

import { customElement, property } from 'lit/decorators.js';

const possibleSingleHandNumberFingers = [1, 2, 3, 4, 5] as const;
type PossibleSingleHandNumberFingers =
  (typeof possibleSingleHandNumberFingers)[number];

const possibleDoubleHandNumberFingers = [6, 7, 8, 8, 10] as const;
type PossibleDoubleHandNumberFingers =
  (typeof possibleDoubleHandNumberFingers)[number];

export const possibleNumberFingers = [
  ...possibleSingleHandNumberFingers,
  ...possibleDoubleHandNumberFingers,
] as const;
export type PossibleNumberFingers =
  | PossibleSingleHandNumberFingers
  | PossibleDoubleHandNumberFingers;

type SingleHandImages = Map<PossibleSingleHandNumberFingers, URL>;

const leftHandImages: SingleHandImages = new Map([
  [1, new URL('../images/Hands/Hand-1-left.png', import.meta.url)],
  [2, new URL('../images/Hands/Hand-2-left.png', import.meta.url)],
  [3, new URL('../images/Hands/Hand-3-left.png', import.meta.url)],
  [4, new URL('../images/Hands/Hand-4-left.png', import.meta.url)],
  [5, new URL('../images/Hands/Hand-5-left.png', import.meta.url)],
]);

const rightHandImages: SingleHandImages = new Map([
  [1, new URL('../images/Hands/Hand-1-right.png', import.meta.url)],
  [2, new URL('../images/Hands/Hand-2-right.png', import.meta.url)],
  [3, new URL('../images/Hands/Hand-3-right.png', import.meta.url)],
  [4, new URL('../images/Hands/Hand-4-right.png', import.meta.url)],
  [5, new URL('../images/Hands/Hand-5-right.png', import.meta.url)],
]);

/** Function to convert a string into a PossibleNumberFingers.
 * If the provided string is undefined, 5 is selected as the number of dots.
 * If the provided string is not a valid number, 6 is selected as the number of dots.
 * If the provided string is to small, 1 is selected as the number of dots.
 * If the provided string is to large, 10  is selected as the number of dots.
 */
function numberToPossibleNumberFingers(
  attributeValue: string | null,
): PossibleNumberFingers {
  if (attributeValue === null) return 5;
  const nmbr = parseInt(attributeValue, 10);
  if (Number.isNaN(nmbr)) {
    return 6;
  }
  if (nmbr < 1) return 1;
  if (nmbr > 10) return 10;
  return nmbr as PossibleNumberFingers; // Due to the if statements above, we can cast to PossibleNumberDots
}

/** Custom element for a hand face showing numbers
 * Best aspect ration (h:w) 1.3
 * @property nmbrToShow - Number of fingers to shown between 1 and 10
 */
@customElement('hand-face')
export class HandFace extends LitElement {
  /** Number of fingers to show */
  @property({ converter: numberToPossibleNumberFingers })
  accessor nmbrToShow: PossibleNumberFingers = 3;

  static get styles(): CSSResultArray {
    return [
      css`
        :host {
          display: grid;
          justify-items: center;
          align-items: center;
          grid-template-columns: 50% 50%;
          grid-template-rows: 100%;
          padding: 5px;
        }
        .oneHand {
          grid-column: 1 / span 2;
        }
        img {
          height: 100%;
          width: 100%;
          object-fit: contain;
        }
      `,
    ];
  }

  renderOneHand(numberFingers: PossibleSingleHandNumberFingers) {
    return html`<img class="oneHand" src=${leftHandImages.get(numberFingers)?.href}></img>`;
  }

  renderTwoHands(numberFingers: PossibleDoubleHandNumberFingers) {
    const numberFingersPerHand: PossibleSingleHandNumberFingers[] = [
      5,
      (numberFingers - 5) as PossibleSingleHandNumberFingers, // As numberFingers is between 6 and 10, numberFinger-5 must be between 1 and 5
    ];
    return html`
      <img src=${leftHandImages.get(numberFingersPerHand[0])}></img>
      <img src=${rightHandImages.get(numberFingersPerHand[1])}></img>
    `;
  }

  render(): HTMLTemplateResult {
    if (this.nmbrToShow <= 5) {
      const singleHandNumberFingers = this
        .nmbrToShow as PossibleSingleHandNumberFingers;
      return this.renderOneHand(singleHandNumberFingers);
    } else {
      const doubleHandNumberFingers = this
        .nmbrToShow as PossibleDoubleHandNumberFingers;
      return this.renderTwoHands(doubleHandNumberFingers);
    }
  }
}
