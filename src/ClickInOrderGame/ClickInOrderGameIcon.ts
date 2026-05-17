import { LitElement, html, css, svg } from 'lit';
import type {
  HTMLTemplateResult,
  CSSResultArray,
  SVGTemplateResult,
} from 'lit';
import { customElement, property } from 'lit/decorators.js';

import {
  getClickInOrderGameVariant,
  type ClickInOrderGameExtendedVariantInfo,
} from './ClickInOrderGameVariants';
import { UnexpectedValueError } from '../UnexpectedValueError';

/** XY vector */
interface XYvector {
  x: number;
  y: number;
}

const yellowBallUrl = new URL('../../images/ball-yellow.svg', import.meta.url);
const blueBallUrl = new URL('../../images/ball-blue.svg', import.meta.url);
const greenBallUrl = new URL('../../images/ball-green.svg', import.meta.url);
const redBallUrl = new URL('../../images/ball-red.svg', import.meta.url);
const dieImageUrl = new URL('../../images/die200.png', import.meta.url);

/** All permutations of four ball colors */
const ballColorPermutations = [
  [yellowBallUrl, blueBallUrl, greenBallUrl, redBallUrl],
  [yellowBallUrl, blueBallUrl, redBallUrl, greenBallUrl],
  [yellowBallUrl, redBallUrl, greenBallUrl, blueBallUrl],
  [yellowBallUrl, redBallUrl, blueBallUrl, greenBallUrl],
  [yellowBallUrl, greenBallUrl, redBallUrl, blueBallUrl],
  [yellowBallUrl, greenBallUrl, blueBallUrl, redBallUrl],

  [blueBallUrl, yellowBallUrl, greenBallUrl, redBallUrl],
  [blueBallUrl, yellowBallUrl, redBallUrl, greenBallUrl],
  [blueBallUrl, redBallUrl, greenBallUrl, yellowBallUrl],
  [blueBallUrl, redBallUrl, yellowBallUrl, greenBallUrl],
  [blueBallUrl, greenBallUrl, redBallUrl, yellowBallUrl],
  [blueBallUrl, greenBallUrl, yellowBallUrl, redBallUrl],

  [greenBallUrl, blueBallUrl, yellowBallUrl, redBallUrl],
  [greenBallUrl, blueBallUrl, redBallUrl, yellowBallUrl],
  [greenBallUrl, redBallUrl, yellowBallUrl, blueBallUrl],
  [greenBallUrl, redBallUrl, blueBallUrl, yellowBallUrl],
  [greenBallUrl, yellowBallUrl, redBallUrl, blueBallUrl],
  [greenBallUrl, yellowBallUrl, blueBallUrl, redBallUrl],

  [redBallUrl, blueBallUrl, greenBallUrl, yellowBallUrl],
  [redBallUrl, blueBallUrl, yellowBallUrl, greenBallUrl],
  [redBallUrl, yellowBallUrl, greenBallUrl, blueBallUrl],
  [redBallUrl, yellowBallUrl, blueBallUrl, greenBallUrl],
  [redBallUrl, greenBallUrl, yellowBallUrl, blueBallUrl],
  [redBallUrl, greenBallUrl, blueBallUrl, yellowBallUrl],
];

@customElement('click-in-order-game-icon')
export class ClickInOrderGameIcon extends LitElement {
  @property({ type: String })
  accessor variant = '';

  static aspectRatio = 250 / 90;

  static get styles(): CSSResultArray {
    return [
      css`
        :host {
          aspect-ratio: ${ClickInOrderGameIcon.aspectRatio};
          min-width: 0;
          min-height: 0;
          container-type: size;
          display: grid;
          justify-items: center;
          align-items: center;
          position: relative;
        }

        @container (aspect-ratio < ${ClickInOrderGameIcon.aspectRatio}) {
          svg {
            width: 100cqw;
          }
        }

        @container (aspect-ratio >= ${ClickInOrderGameIcon.aspectRatio}) {
          svg {
            height: 100cqh;
          }
        }
      `,
    ];
  }

  private renderNumberSequenceContent(
    variantInfo: ClickInOrderGameExtendedVariantInfo,
  ): SVGTemplateResult {
    if (variantInfo.iconShowDie) {
      return svg`<image x="90" y="10" height="70" href="${dieImageUrl}"></image>`;
    }
    return svg`
      <text
        font-size="45px"
        font-style="italic"
        x="50%"
        y="50%"
        dominant-baseline="central"
        text-anchor="middle"
      >
        ${variantInfo.iconText}
      </text>
    `;
  }

  private renderBackground(): SVGTemplateResult {
    return svg`
      <rect
        x="5"
        y="5"
        width="240"
        height="80"
        ry="20"
        rx="20"
        fill="white"
        stroke="purple"
        stroke-width="5"
      ></rect>
    `;
  }

  private renderBallImages(
    variantInfo: ClickInOrderGameExtendedVariantInfo,
  ): SVGTemplateResult[] {
    if (variantInfo.gameType === 'numberSequence') {
      throw new Error(
        `Internal SW Error, unexpected game type in renderBallIcon: ${variantInfo.gameType}`,
      );
    }
    const twoBalls = variantInfo.gameType === 'multiplicationWithSum';

    const colorPermutation =
      variantInfo.multiplicationConfig.iconColorPermutation;
    const positions: XYvector[] = twoBalls
      ? [
          { x: 10, y: 10 },
          { x: 170, y: 10 },
        ]
      : [
          { x: 10, y: 10 },
          { x: 90, y: 10 },
          { x: 170, y: 10 },
        ];
    const ballIndices = twoBalls ? [0, 1] : [0, 1, 2];

    const colors = ballColorPermutations[colorPermutation];
    return ballIndices.map(
      (ballIndex, i) => svg`
        <image
          height="70"
          href="${colors[ballIndex]}"
          x="${positions[i].x}"
          y="${positions[i].y}"
        ></image>
      `,
    );
  }

  private renderBallLabel(
    variantInfo: ClickInOrderGameExtendedVariantInfo,
  ): SVGTemplateResult {
    const fontSize = variantInfo.iconSmallFont ? 40 : 57;
    return svg`
      <text
        font-size="${fontSize}"
        x="50%"
        y="50%"
        dominant-baseline="central"
        text-anchor="middle"
      >
        ${variantInfo.iconText}
      </text>
    `;
  }

  render(): HTMLTemplateResult {
    const variantInfo = getClickInOrderGameVariant(this.variant);

    const content: SVGTemplateResult[] = [];
    content.push(this.renderBackground());

    switch (variantInfo.gameType) {
      case 'numberSequence':
        content.push(this.renderNumberSequenceContent(variantInfo));
        break;
      case 'multiplicationTable':
      case 'multiplicationWithSum':
        content.push(...this.renderBallImages(variantInfo));
        content.push(this.renderBallLabel(variantInfo));
        break;
      default:
        throw new UnexpectedValueError(variantInfo);
    }

    return html`<svg viewBox="0 0 250 90">${content}</svg>`;
  }
}
