import { LitElement, html, css } from 'lit';
import type { CSSResultGroup, HTMLTemplateResult } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, state } from 'lit/decorators.js';
import {
  addResizeObserverClient,
  removeResizeObserverClient,
  ResizeObserverClientInterface,
} from './ResizeObserver';

// export type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
export type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

@customElement('digit-keyboard')
export class DigitKeyboard
  extends LitElement
  implements ResizeObserverClientInterface
{
  @state()
  wideTallClass = 'WideContainer';
  @state()
  disabled = [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ];

  static get styles(): CSSResultGroup {
    return css`
      :host {
        display: flex;
        justify-content: center;
        align-content: center;
        flex-wrap: wrap;
        padding: 0;
      }

      .KeyboardBox {
        aspect-ratio: 3/4;
        box-sizing: border-box;
      }

      .WideContainer {
        height: 100%;
        width: auto;
      }

      .TallContainer {
        height: auto;
        width: 100%;
      }

      .DigitRow {
        display: flex;
        justify-content: center;
        align-content: center;
        height: calc(100% / 4);
        padding: 0;
      }

      .Digit {
        background-size: contain;
        background-color: transparent;
        background-repeat: no-repeat;
        background-position: center center;
        border: none;
        outline: none;
        width: calc(100% / 3);
        height: calc (100%);
        color: black;
        background-image: url('images/ball-blue.svg');
        padding: 0;
      }

      text {
        font-size: 70px;
      }
    `;
  }

  handleResize() {
    if (this.clientHeight / 4 >= this.clientWidth / 3) {
      this.wideTallClass = 'TallContainer';
    } else {
      this.wideTallClass = 'WideContainer';
    }
  }

  boundHandleKeyDown = this.handleKeyDown.bind(this); // Bound version of the updateViewPortDimensions, to be able to unregister the event handler.
  handleKeyDown(evt: KeyboardEvent) {
    const keyName = evt.key;

    const digitMap: Map<string, Digit> = new Map([
      ['0', 0],
      ['1', 1],
      ['2', 2],
      ['3', 3],
      ['4', 4],
      ['5', 5],
      ['6', 6],
      ['7', 7],
      ['8', 8],
      ['9', 9],
    ]);

    const digit = digitMap.get(keyName);

    if (digit !== undefined) {
      this.handleDigit(digit);
    }
  }

  connectedCallback(): void {
    super.connectedCallback();
    addResizeObserverClient(this);
    document.addEventListener('keydown', this.boundHandleKeyDown);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    removeResizeObserverClient(this);
    document.removeEventListener('keydown', this.boundHandleKeyDown);
  }

  disable(digit: Digit) {
    this.disabled[digit] = true;
    this.requestUpdate();
  }

  enableAllDigits() {
    for (let i = 0; i < 10; i++) this.disabled[i] = false;
    this.requestUpdate();
  }

  // We use SVG to render to digits to ensure the digits scale nicely along with the buttons.
  renderDigitAsSvg(digit: Digit | 'disabled') {
    const symbolToUse = digit === 'disabled' ? 'X' : digit;
    return html`
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <text x="30" y="73">${symbolToUse}</text>
      </svg>
    `;
  }

  handleDigit(digit: Digit) {
    if (!this.disabled[digit]) {
      const event = new CustomEvent<Digit>('digit-entered', {
        detail: digit,
      });
      this.dispatchEvent(event);
    }
  }

  render(): HTMLTemplateResult {
    const rows: HTMLTemplateResult[] = [];
    const digits: Digit[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    for (let row = 0; row < 4; row++) {
      const buttons: HTMLTemplateResult[] = [];
      const firstDigitInRow = row === 3 ? 0 : row * 3 + 1;
      const lastDigitInRow = row === 3 ? 0 : row * 3 + 3;
      for (
        let digitAsNumber = firstDigitInRow;
        digitAsNumber <= lastDigitInRow;
        digitAsNumber++
      ) {
        const digit = digits[digitAsNumber];
        if (firstDigitInRow === undefined || lastDigitInRow === undefined)
          throw new Error('Out of bounds in determining digit');
        buttons.push(html`
          <button
            class="Digit"
            id="Digit${digit}"
            @click="${() => this.handleDigit(digit)}"
          >
            ${this.disabled[digit]
              ? this.renderDigitAsSvg('disabled')
              : this.renderDigitAsSvg(digit)}
          </button>
        `);
      }
      rows.push(html`<div class="DigitRow">${buttons}</div>`);
    }

    return html` <div class="KeyboardBox ${this.wideTallClass}">${rows}</div> `;
  }
}
