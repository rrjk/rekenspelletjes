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

import { Color, getColorInfo } from './Colors';

@customElement('pixel-art-color-field')
export class PixelArtColorField extends LitElement {
  @property()
  matrix: Color[][] = [
    ['red', 'blue', 'green', 'red'],
    ['green', 'red', 'blue', 'green'],
    ['blue', 'green', 'red', 'blue'],
    ['red', 'blue', 'green', 'red'],
  ];

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
        width: ${PixelArtColorField.blockSize}px;
        height: ${PixelArtColorField.blockSize}px;
      }
    `;
  }

  render(): HTMLTemplateResult {
    const svgMatrix: SVGTemplateResult[] = [];

    for (let row = 0; row < this.matrix.length; row++) {
      for (let column = 0; column < this.matrix[row].length; column++) {
        const blockX = column * PixelArtColorField.blockSize;
        const blockY = row * PixelArtColorField.blockSize;

        svgMatrix.push(
          svg`<rect class="block" x="${blockX}" y="${blockY}" fill="${
            getColorInfo(this.matrix[row][column]).mainColorCode
          }" />
          `
        );
      }
    }

    const fieldWidth = this.matrix[0].length * PixelArtColorField.blockSize;
    const fieldHeight = this.matrix.length * PixelArtColorField.blockSize;

    return html` <svg viewBox="0 0 ${fieldWidth} ${fieldHeight}">
      ${svgMatrix}
    </svg>`;
  }
}
