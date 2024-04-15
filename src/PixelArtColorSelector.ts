import { LitElement, html, css } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, property } from 'lit/decorators.js';

import type { Color, ColorSelectedEvent } from './ColorPicker';
import './ColorPicker';

@customElement('pixel-art-color-selector')
export class PixelArtColorSelector extends LitElement {
  static initialColor = 'red';
  static colorPalette: Color[] = [
    'red',
    'green',
    'blue',
    'orange',
    'yellow',
    'purple',
    'brown',
    'magenta',
    'lime',
    'cyan',
  ];

  @property()
  matrix: Color[][] = [[]];

  selectedColor: Color = PixelArtColorSelector.initialColor;

  static get styles(): CSSResultGroup {
    return css`
      :host {
        display: block;
      }

      .buttonField {
        width: 100%;
        height: 100%;
      }

      button {
        width: calc(100% / var(--numberColumns));
        height: calc(100% / var(--numberRows));
        margin: 0;
        padding: 0;
        border: 1px black solid;
      }
    `;
  }

  handleButtonClick(row: number, column: number) {
    console.log(`clicked row=${row}, column=${column}`);
    this.matrix[row][column] = this.selectedColor;
    this.requestUpdate();
  }

  handeColorSelected(color: Color) {
    console.log(`handleColorSelected in PixelArtColorSelect, color = ${color}`);
    this.selectedColor = color;
  }

  render(): HTMLTemplateResult {
    const buttonArray: HTMLTemplateResult[] = [];
    for (let row = 0; row < this.matrix.length; row++) {
      for (let column = 0; column < this.matrix[row].length; column++) {
        buttonArray.push(
          html`<button
            style="background-color: ${this.matrix[row][column]}"
            @click="${() => this.handleButtonClick(row, column)}"
          ></button>`
        );
      }
    }

    return html`
      <style>
        :host {
          --numberColumns: ${this.matrix.length};
          --numberRows: ${this.matrix[0].length};
        }
      </style>
      <color-picker
        selectedColor="${PixelArtColorSelector.initialColor}"
        .selectableColors=${PixelArtColorSelector.colorPalette}
        @color-selected="${(evt: ColorSelectedEvent) =>
          this.handeColorSelected(evt.color)}"
      ></color-picker>
      <div class="buttonField">${buttonArray}</div>
    `;
  }
}
