/* eslint-disable max-classes-per-file */
import { LitElement, html, css } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, property } from 'lit/decorators.js';

import { darken, getLuminance } from 'color2k';

export type Color = string;

export class ColorSelectedEvent extends Event {
  color = '';

  constructor(color: Color) {
    super('color-selected');
    this.color = color;
  }
}

@customElement('color-picker')
export class ColorPicker extends LitElement {
  @property()
  nmbrRow = 3;

  @property()
  nmbrColumn = 4;

  @property()
  selectableColors: Color[] = [
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
  selectedColor: Color = 'red';

  static get styles(): CSSResultGroup {
    return css`
      :host {
        display: block;
        background-color: #cccccc;
        border-radius: 10%;
        border: 0px;
      }

      button {
        width: 80%;
        height: 80%;
        border-radius: 50%;
        border: 3px solid;
        padding: 0px;
        margin: 0px;
      }

      button.selected {
        border: 3px solid;
      }

      div.circle {
        width: 70%;
        height: 70%;
        background-color: transparent;
        border-radius: 50%;
        margin-left: auto;
        margin-right: auto;
      }

      div.circle.white {
        border: 3px white solid;
      }

      div.circle.black {
        border: 3px black solid;
      }

      .buttonField {
        display: grid;
        grid-template-columns: repeat(var(--nmbrColumn), 1fr);
        grid-template-rows: repeat(var(--nmbrRow), 1fr);
        justify-items: center;
        align-items: center;
        width: calc(var(--nmbrColumn) * 3rem + 1rem);
        aspect-ratio: var(--nmbrColumn) / var(--nmbrRow);
        max-width: 100%;
      }
    `;
  }

  handleButtonClick(color: Color) {
    if (this.selectedColor !== color) {
      this.selectedColor = color;
      const event = new ColorSelectedEvent(color);
      this.dispatchEvent(event);
    }
  }

  render(): HTMLTemplateResult {
    const buttonArray: HTMLTemplateResult[] = [];
    for (let i = 0; i < this.selectableColors.length; i++) {
      const whiteCircle =
        this.selectableColors[i] === this.selectedColor
          ? html` <div
              class="circle ${getLuminance(this.selectableColors[i]) > 0.7
                ? 'black'
                : 'white'}"
            ></div>`
          : html``;

      buttonArray.push(
        html`<button
          class="${this.selectableColors[i] === this.selectedColor
            ? 'selected'
            : ''}"
          style="background-color: ${this.selectableColors[
            i
          ]}; border-color: ${darken(this.selectableColors[i], 0.1)};"
          @click="${() => this.handleButtonClick(this.selectableColors[i])}"
        >
          ${whiteCircle}
        </button> `
      );
    }
    return html`
      <style>
        :host {
          --nmbrColumn: ${this.nmbrColumn};
          --nmbrRow: ${this.nmbrRow};
        }
      </style>
      <div class="buttonField">${buttonArray}</div>
    `;
  }
}
