import {
  LitElement,
  html,
  svg,
  HTMLTemplateResult,
  SVGTemplateResult,
} from 'lit';

// eslint-disable-next-line import/extensions
import { customElement, state } from 'lit/decorators.js';

@customElement('pixel-art-number-field')
export class PixelArtColorField extends LitElement {
  @state()
  matrix: number[][] = [
    [1, 2, 3, 4],
    [2, 3, 4, 1],
    [3, 4, 1, 2],
    [4, 1, 2, 3],
  ];

  render(): HTMLTemplateResult {
    const matrix: SVGTemplateResult[] = [];

    for (let row = 0; row < this.matrix.length; row++) {
      for (let column = 0; column < this.matrix[row].length; column++) {
        matrix.push(
          svg`<rect width="25" height="25" x="${column * 25}" y="${
            row * 25
          }" fill="none" stroke="black" />`
        );
      }
    }

    return html` <svg>${matrix}</svg>`;
  }
}
