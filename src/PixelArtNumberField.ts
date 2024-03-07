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
import { customElement, property, state } from 'lit/decorators.js';

@customElement('pixel-art-number-field')
export class PixelArtNumberField extends LitElement {
  @property({ type: Number })
  pixelSize = 35;

  @state()
  matrix: number[][] = [
    [1, 2, 3, 4],
    [2, 3, 4, 5],
    [3, 4, 1, 6],
    [4, 1, 2, 7],
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
      .heavy {
        font: calc(var(--pixel-size, 25px) * 0.6) sans-serif;
        fill: black;
        text-anchor: middle;
        alignment-baseline: central;
      }
    `;
  }

  render(): HTMLTemplateResult {
    const matrix: SVGTemplateResult[] = [];

    for (let row = 0; row < this.matrix.length; row++) {
      for (let column = 0; column < this.matrix[row].length; column++) {
        matrix.push(
          svg`<rect width="${this.pixelSize}" height=${this.pixelSize} x="${
            column * this.pixelSize
          }" y="${row * this.pixelSize}" fill="none" stroke="black" />
          <text class="heavy" x="${(column + 0.5) * this.pixelSize}" y="${
            (row + 0.5) * this.pixelSize
          }" >
            ${this.matrix[row][column]}
          </text>
          `
        );
      }
    }

    return html` <style>
        :host {
          --pixel-size: ${this.pixelSize}px;
        }
      </style>
      <svg
        viewBox="0 0 ${this.matrix[0].length * this.pixelSize} ${this.matrix
          .length * this.pixelSize}"
      >
        ${matrix}
      </svg>`;
  }
}
