import {
  LitElement,
  html,
  svg,
  HTMLTemplateResult,
  SVGTemplateResult,
  css,
  CSSResultGroup,
} from 'lit';

// eslint-disable-next-line import/extensions
import { customElement, property, state } from 'lit/decorators.js';

import { Color, getColorInfo } from './Colors';

@customElement('pixel-art-color-field')
export class PixelArtColorField extends LitElement {
  @property({ type: Number })
  pixelSize = 35;

  @state()
  matrix: Color[][] = [
    ['red', 'blue', 'green', 'red'],
    ['green', 'red', 'blue', 'green'],
    ['blue', 'green', 'red', 'blue'],
    ['red', 'blue', 'green', 'red'],
  ];

  static get styles(): CSSResultGroup {
    return css`
      :host {
        display: block;
      }
      svg {
        height: 100%;
        width: 100%;
        max-height: 100%;
        max-width: 100%;
      }
    `;
  }

  render(): HTMLTemplateResult {
    const matrix: SVGTemplateResult[] = [];

    for (let row = 0; row < this.matrix.length; row++) {
      for (let column = 0; column < this.matrix[row].length; column++) {
        matrix.push(
          svg`<rect width="${this.pixelSize}" height="${this.pixelSize}" x="${
            column * this.pixelSize
          }" y="${row * this.pixelSize}" fill="${
            getColorInfo(this.matrix[row][column]).mainColorCode
          }"/>`
        );
      }
    }

    return html` <svg
      viewBox="0 0 ${this.matrix[0].length * this.pixelSize} ${this.matrix
        .length * this.pixelSize}"
    >
      ${matrix}
    </svg>`;
  }
}
