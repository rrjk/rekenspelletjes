import {
  LitElement,
  html,
  svg,
  HTMLTemplateResult,
  SVGTemplateResult,
} from 'lit';

// eslint-disable-next-line import/extensions
import { customElement, state } from 'lit/decorators.js';

import { Color, getColorInfo } from './Colors';

@customElement('pixel-art-color-field')
export class PixelArtColorField extends LitElement {
  @state()
  matrix: Color[][] = [
    ['red', 'blue', 'green', 'red'],
    ['green', 'red', 'blue', 'green'],
    ['blue', 'green', 'red', 'blue'],
    ['red', 'blue', 'green', 'red'],
  ];

  render(): HTMLTemplateResult {
    const matrix: SVGTemplateResult[] = [];

    for (let row = 0; row < this.matrix.length; row++) {
      for (let column = 0; column < this.matrix[row].length; column++) {
        matrix.push(
          svg`<rect width="25" height="25" x="${column * 25}" y="${
            row * 25
          }" fill="${getColorInfo(this.matrix[row][column]).mainColorCode}"/>`
        );
      }
    }

    return html` <svg>${matrix}</svg>`;
  }
}
