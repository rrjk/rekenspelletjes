// Todo: Let PixelSize be in html units
// Determine based on PixelSize size of box
// Then I don't need PixelSize within the svg, there I can use a fixed number.
// Or don't use PixelSize at all, as it's actually all about the size of the box.

import {
  LitElement,
  html,
  svg,
  css,
  HTMLTemplateResult,
  SVGTemplateResult,
  CSSResultGroup,
} from 'lit';

// eslint-disable-next-line import/extensions
import { customElement, property } from 'lit/decorators.js';

@customElement('pixel-art-number-field')
export class PixelArtNumberField extends LitElement {
  @property()
  matrix: number[][] = [[]];
  /*
    [1, 2, 3, 4],
    [2, 3, 4, 5],
    [3, 4, 1, 6],
    [4, 1, 2, 7],
  ];
*/

  static blockSize = 100;

  // For the .heavy style we specifiy alignment-baseline for most browsers, donimant-baseline for Firefox
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
      .block {
        width: ${PixelArtNumberField.blockSize}px;
        height: ${PixelArtNumberField.blockSize}px;
        fill: none;
        stroke: black;
        stroke-width: 5px;
      }
      .heavy {
        font: ${PixelArtNumberField.blockSize * 0.6}px sans-serif;
        fill: black;
        text-anchor: middle;
        alignment-baseline: central;
        dominant-baseline: central;
      }
    `;
  }

  render(): HTMLTemplateResult {
    const svgMatrix: SVGTemplateResult[] = [];

    for (let row = 0; row < this.matrix.length; row++) {
      for (let column = 0; column < this.matrix[row].length; column++) {
        const blockX = column * PixelArtNumberField.blockSize;
        const blockY = row * PixelArtNumberField.blockSize;
        const textX = (column + 0.5) * PixelArtNumberField.blockSize;
        const textY = (row + 0.5) * PixelArtNumberField.blockSize;

        svgMatrix.push(
          svg`<rect class="block" x="${blockX}" y="${blockY}" />
          <text class="heavy" x="${textX}" y="${textY}" >
            ${this.matrix[row][column]}
          </text>
          `
        );
      }
    }

    const fieldWidth = this.matrix[0].length * PixelArtNumberField.blockSize;
    const fieldHeight = this.matrix.length * PixelArtNumberField.blockSize;

    return html` <svg viewBox="0 0 ${fieldWidth} ${fieldHeight}">
      ${svgMatrix}
    </svg>`;
  }
}
