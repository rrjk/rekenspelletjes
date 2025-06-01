import { LitElement, html, css, svg } from 'lit';
import type {
  HTMLTemplateResult,
  CSSResultGroup,
  SVGTemplateResult,
} from 'lit';
import { customElement, property } from 'lit/decorators.js';

/** XY vector  */
interface XYvector {
  x: number;
  y: number;
}

const yellowBallUrl = new URL('../images/ball-yellow.svg', import.meta.url);
const blueBallUrl = new URL('../images/ball-blue.svg', import.meta.url);
const greenBallUrl = new URL('../images/ball-green.svg', import.meta.url);
const redBallUrl = new URL('../images/ball-red.svg', import.meta.url);

/** All permutations of four ball color */
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

@customElement('ballgame-icon')
export class BalloonIndex extends LitElement {
  /** Color permutation to use, index into ballColorPermutations */
  @property({ type: Number })
  accessor colorPermutation = 0;
  @property({ type: String })
  accessor alt = '';
  @property({ type: String })
  accessor text = '';
  @property({ type: Boolean })
  accessor twoBalls = false;
  @property({ type: Boolean })
  accessor smallFont = false;

  static get styles(): CSSResultGroup {
    return css``;
  }

  render(): HTMLTemplateResult {
    const ballTemplates: SVGTemplateResult[] = [];

    let positions: XYvector[];

    if (!this.twoBalls) {
      positions = [
        { x: 5, y: 5 },
        { x: 86, y: 5 },
        { x: 167, y: 5 },
      ];
    } else {
      positions = [
        { x: 5, y: 5 },
        { x: 167, y: 5 },
      ];
    }

    for (let i = 0; i < positions.length; i++) {
      const ballTemplate = svg`
        <image
          height="78"
          href="${ballColorPermutations[this.colorPermutation][i]}"
          x="${positions[i].x}"
          y="${positions[i].y}"
        ></image>`;
      ballTemplates.push(ballTemplate);
    }
    const textTemplate = svg`
        <text
          font-size = "${this.smallFont ? 40 : 57}"
          x="50%"
          y="50%"
          dominant-baseline="central"
          text-anchor="middle"    
        >${this.text}</text>`;

    return html`
      <svg viewBox="0 0 250 88" style="width: 100%">
        <title>${this.alt}</title>
        <rect
          x="0"
          y="0"
          width="250"
          height="88"
          rx="10"
          ry="10"
          fill="none"
          stroke="black"
          stroke-width="3"
        ></rect>
        ${ballTemplates}${textTemplate}
      </svg>
    `;
  }
}
