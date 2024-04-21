import { LitElement, html, css } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, property } from 'lit/decorators.js';

import type { Color, ColorSelectedEvent } from './ColorPicker';
import './ColorPicker';

type ColumnRowTypes = 'first' | 'middle' | 'last';

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
        display: grid;
        grid-template-columns: repeat(calc(var(--numberColumns) + 1), 1fr);
        grid-template-rows: repeat(calc(var(--numberRows) + 1), 1fr);
      }

      button {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        border: 1px black solid;
      }

      div.deleteSign,
      div.addSign {
        border: 0px;
        color: transparent;
        text-align: center;
      }

      div.deleteSign:hover {
        color: red;
      }

      div.addSign:hover {
        color: green;
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

  renderHorPlusSign(
    column: number,
    columnType: ColumnRowTypes = 'middle'
  ): HTMLTemplateResult {
    const span = columnType === 'middle' ? 2 : 1;
    const gridColumnShift = columnType === 'first' ? 1 : 0;

    return html`<div
      class="addSign"
      style="grid-column-start:${3 * column +
      gridColumnShift}; grid-column-end: span ${span}; grid-row-start: 1; grid-row-end: span 1;"
    >
      +
    </div>`;
  }

  renderVerPlusSign(
    gridColumnOperator: number,
    row: number,
    rowType: ColumnRowTypes = 'middle'
  ): HTMLTemplateResult {
    const span = rowType === 'middle' ? 2 : 1;
    const gridColumnShift = rowType === 'first' ? 2 : 1;
    return html`<div
      class="addSign"
      style="grid-column-start:${gridColumnOperator}; grid-column-end: span 1; grid-row-start: ${3 *
        row +
      gridColumnShift}; grid-row-end: span ${span};"
    >
      +
    </div>`;
  }

  render(): HTMLTemplateResult {
    const numberColumns = this.matrix[0].length;
    const numberRows = this.matrix.length;

    const buttonArray: HTMLTemplateResult[] = [];
    buttonArray.push(this.renderHorPlusSign(0, 'first'));
    for (let column = 1; column < this.matrix[0].length; column++) {
      buttonArray.push(this.renderHorPlusSign(column, 'middle'));
    }
    buttonArray.push(this.renderHorPlusSign(numberColumns, 'last'));

    const gridColumnOperator = 3 * numberColumns + 1;
    const renderVerPlusSign = (
      row: number,
      rowType: ColumnRowTypes = 'middle'
    ) => this.renderVerPlusSign(gridColumnOperator, row, rowType);

    buttonArray.push(renderVerPlusSign(0, 'first'));
    for (let row = 1; row < numberRows; row++) {
      buttonArray.push(renderVerPlusSign(row, 'middle'));
    }
    buttonArray.push(renderVerPlusSign(numberRows, 'last'));

    for (let row = 0; row < numberRows; row++) {
      buttonArray.push(html` <div
        class="deleteSign"
        style="grid-row-start:${3 * row +
        3}; grid-row-end: span 1; grid-column-start: ${gridColumnOperator}; grid-column-end: span 1;"
      >
        ×
      </div>`);
    }

    for (let column = 0; column < numberColumns; column++) {
      buttonArray.push(html` <div
        class="deleteSign"
        style="grid-column-start:${3 * column +
        2}; grid-column-end: span 1; grid-row-start: 1; grid-row-end: span 1;"
      >
        ×
      </div>`);
    }

    for (let row = 0; row < this.matrix.length; row++) {
      for (let column = 0; column < this.matrix[row].length; column++) {
        buttonArray.push(
          html`<button
            style="background-color: ${this.matrix[row][
              column
            ]}; grid-column-start:${3 * column +
            1}; grid-column-end: span 3; grid-row-start:${3 * row +
            2}; grid-row-end: span 3;"
            @click="${() => this.handleButtonClick(row, column)}"
          ></button>`
        );
      }
    }

    return html`
      <style>
        :host {
          --numberColumns: ${3 * this.matrix.length + 1};
          --numberRows: ${3 * this.matrix[0].length + 1};
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
