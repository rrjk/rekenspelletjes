import { LitElement, html, css, svg } from 'lit';
import type {
  HTMLTemplateResult,
  CSSResultGroup,
  SVGTemplateResult,
} from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, property } from 'lit/decorators.js';

import type { Color, ColorSelectedEvent } from './ColorPicker';
import './ColorPicker';

type ColumnRowTypes = 'first' | 'middle' | 'last';

@customElement('pixel-art-color-selector')
export class PixelArtColorSelector extends LitElement {
  @property()
  matrix: Color[][] = [
    ['white', 'white', 'white', 'white'],
    ['white', 'white', 'white', 'white'],
    ['white', 'white', 'white', 'white'],
    ['white', 'white', 'white', 'white'],
  ];

  @property()
  selectedColor: Color = PixelArtColorSelector.initialColor;

  static get styles(): CSSResultGroup {
    return css`
      :host {
        display: block;
        --numberGridColumns: calc((var(--numberColumns) * 3) + 1);
        --numberGridRows: calc((var(--numberRows) * 3) + 1);
      }

      .buttonField {
        max-width: 100%;
        width: calc((var(--numberGridColumns) * 1rem));
        aspect-ratio: var(--numberGridColumns) / var(--numberGridRows);
        display: grid;
        grid-template-columns: repeat(
          var(--numberGridColumns),
          calc(100% / var(--numberGridColumns))
        );
        grid-template-rows: repeat(
          var(--numberGridRows),
          calc(100% / var(--numberGridRows))
        );
      }

      button.coloredField {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        border: 1px black solid;
      }

      button.deleteSign,
      button.addSign {
        container-type: size;
        width: 100%;
        height: 100%;
        border: 0;
        padding: 0;
        margin: 0;
        stroke: transparent;
        background-color: transparent;
      }

      button.deleteSign:hover {
        stroke: red;
      }

      button.addSign:hover {
        stroke: green;
        fill: transparent;
      }
    `;
  }

  handleButtonClick(row: number, column: number) {
    console.log(`clicked row=${row}, column=${column}`);
    this.matrix[row][column] = this.selectedColor;
    this.requestUpdate();
  }

  handleDeleteColumn(column: number) {
    for (let row = 0; row < this.matrix.length; row++) {
      this.matrix[row].splice(column, 1);
    }
    this.requestUpdate();
  }

  handleDeleteRow(row: number) {
    this.matrix.splice(row, 1);
    this.requestUpdate();
  }

  handleAddColumn(column: number) {
    for (let row = 0; row < this.matrix.length; row++) {
      this.matrix[row].splice(column, 0, 'white');
    }
    this.requestUpdate();
  }

  handleAddRow(row: number) {
    const rowToAdd: string[] = [];
    rowToAdd.length = this.matrix[0].length;
    rowToAdd.fill('white', 0, this.matrix[0].length);
    this.matrix.splice(row, 0, rowToAdd);
    this.requestUpdate();
  }

  svgPlusSign(horSpan: number, verSpan: number): HTMLTemplateResult {
    if ((horSpan !== 1 && horSpan !== 2) || (verSpan !== 1 && verSpan !== 2))
      throw new RangeError(
        `horSpan (${horSpan}) and verSpan(${verSpan}) have to be either 1 or 2`
      );

    const horSize = horSpan === 1 ? 100 : 200;
    const horStart = horSpan === 1 ? 0 : -50;

    const verSize = verSpan === 1 ? 100 : 200;
    const verStart = verSpan === 1 ? 0 : -50;

    return html`
      <svg
        viewBox="${horStart} ${verStart} ${horSize} ${verSize}"
        style="width: 100%; height: 100%"
      >
        <line x1="20" y1="50" x2="80" y2="50" stroke-width="10" />
        <line x1="50" y1="20" x2="50" y2="80" stroke-width="10" />
      </svg>
    `;
  }

  svgCrossSign(): HTMLTemplateResult {
    return html`
      <svg viewBox="0 0 100 100" style="width: 100%; height: 100%">
        <line x1="25" y1="25" x2="75" y2="75" stroke-width="10" />
        <line x1="25" y1="75" x2="75" y2="25" stroke-width="10" />
      </svg>
    `;
  }

  renderHorPlusSign(
    column: number,
    columnType: ColumnRowTypes = 'middle'
  ): HTMLTemplateResult {
    const span = columnType === 'middle' ? 2 : 1;
    const gridColumnShift = columnType === 'first' ? 1 : 0;

    return html`<button
      class="addSign"
      style="grid-column-start:${3 * column +
      gridColumnShift}; grid-column-end: span ${span}; grid-row-start: 1; grid-row-end: span 1;"
      @click="${() => this.handleAddColumn(column)}"
    >
      ${this.svgPlusSign(span, 1)}
    </button>`;
  }

  renderVerPlusSign(
    gridColumnOperator: number,
    row: number,
    rowType: ColumnRowTypes = 'middle'
  ): HTMLTemplateResult {
    const span = rowType === 'middle' ? 2 : 1;
    const gridColumnShift = rowType === 'first' ? 2 : 1;
    return html`<button
      class="addSign"
      style="grid-column-start:${gridColumnOperator}; grid-column-end: span 1; grid-row-start: ${3 *
        row +
      gridColumnShift}; grid-row-end: span ${span};"
      @click="${() => this.handleAddRow(row)}"
    >
      ${this.svgPlusSign(1, span)}
    </button>`;
  }

  renderHorDeleteSign(column: number): HTMLTemplateResult {
    return html` <button
      class="deleteSign"
      style="grid-column-start:${3 * column +
      2}; grid-column-end: span 1; grid-row-start: 1; grid-row-end: span 1;"
      @click="${() => this.handleDeleteColumn(column)}"
    >
      ${this.svgCrossSign()}
    </button>`;
  }

  renderVerDeleteSign(
    gridColumnOperator: number,
    row: number
  ): HTMLTemplateResult {
    return html` <button
      class="deleteSign"
      style="grid-row-start:${3 * row +
      3}; grid-row-end: span 1; grid-column-start: ${gridColumnOperator}; grid-column-end: span 1;"
      @click="${() => this.handleDeleteRow(row)}"
    >
      ${this.svgCrossSign()}
    </button>`;
  }

  render(): HTMLTemplateResult {
    const numberColumns = this.matrix[0].length;
    const numberRows = this.matrix.length;

    const buttonArray: HTMLTemplateResult[] = [];
    buttonArray.push(this.renderHorPlusSign(0, 'first'));
    for (let column = 1; column < numberColumns; column++) {
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
      buttonArray.push(this.renderVerDeleteSign(gridColumnOperator, row));
    }

    for (let column = 0; column < numberColumns; column++) {
      buttonArray.push(this.renderHorDeleteSign(column));
    }

    for (let row = 0; row < numberRows; row++) {
      for (let column = 0; column < numberColumns; column++) {
        buttonArray.push(
          html`<button
            class="coloredField"
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
          --numberColumns: ${numberColumns};
          --numberRows: ${numberRows};
        }
      </style>
      <div class="buttonField">${buttonArray}</div>
    `;
  }
}
