import { html, css, LitElement } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, property, state } from 'lit/decorators.js';
import type { CSSResultGroup, HTMLTemplateResult } from 'lit';

import type { Digit } from './DigitKeyboard';

type ProcessInputResultEnum = 'fillinComplete' | 'inputOk' | 'inputNok';

@customElement('digit-fillin')
export class DigitFillin extends LitElement {
  /** Desired number to show */
  @property({ type: Number })
  accessor desiredNumber = 0;
  /** Number of digits to show */
  @property({ type: Number })
  accessor numberDigits = 1;
  /** Should the fillin be shown as active (if not all numbers shown yet) */
  @property({ type: Boolean })
  accessor fillinActive = false;

  /** Digit up and until the digitVisible number will be visible. Counting starts at 0, -1 means no digit is visible */
  @state()
  accessor digitVisible = -1;
  /** The actual digits */
  @state()
  accessor digits: number[] = [];

  /** First digit that can actually be made visibe, the trailing zeros can't be made visible */
  private firstPossibleVisible = 0;

  static get styles(): CSSResultGroup {
    return css`
      .fillinDigit {
        box-sizing: border-box;
        display: inline-block;
        margin-top: auto;
        margin-bottom: auto;
        text-align: center;
        height: 2ex;
        width: 1em;
      }

      .fillinSingleDigit {
        border: 2px solid black;
        margin-left: 0.2em;
        margin-right: 0.2em;
      }

      .fillinMultiDigitMid {
        border-bottom: 2px solid black;
        border-top: 2px solid black;
        border-right: 0.5px solid lightgrey;
        border-left: 0.5px solid lightgrey;
        margin-left: 0;
        margin-right: 0;
      }

      .fillinMultiDigitLeft {
        border-left: 2px solid black;
        border-bottom: 2px solid black;
        border-top: 2px solid black;
        border-right: 0.5px solid lightgrey;
        margin-left: 0.2em;
        margin-right: 0;
      }

      .fillinMultiDigitRight {
        border-right: 2px solid black;
        border-bottom: 2px solid black;
        border-top: 2px solid black;
        border-left: 0.5px solid lightgrey;
        margin-left: 0;
        margin-right: 0.2em;
      }

      .fillinActive {
        border-color: blue;
      }
    `;
  }

  processInput(input: Digit) {
    let ret: ProcessInputResultEnum;

    if (this.fillinActive) {
      if (input === this.digits[this.digitVisible + 1]) {
        this.digitVisible += 1;
        if (this.digitVisible === this.numberDigits - 1) {
          ret = 'fillinComplete';
        } else {
          ret = 'inputOk';
        }
      } else {
        ret = 'inputNok';
      }
    } else {
      throw Error('DigitFillin: processInput called while fillin not active');
    }

    return ret;
  }

  resetVisible() {
    this.digitVisible = this.firstPossibleVisible - 1;
  }

  willUpdate(_changedProperties: Map<string | number | symbol, unknown>): void {
    if (_changedProperties.has('desiredNumber')) {
      this.splitIntoDigits();
    }
  }

  splitIntoDigits() {
    this.digits = [];
    let remainder = this.desiredNumber;

    while (remainder !== 0) {
      this.digits.push(remainder % 10);
      remainder -= this.digits[this.digits.length - 1];
      remainder /= 10;
    }
    if (this.digits.length > this.numberDigits) {
      this.numberDigits = this.digits.length;
    }

    this.firstPossibleVisible = this.numberDigits - this.digits.length;

    // Fill with NaN up to number of digits
    for (let i = this.digits.length; i < this.numberDigits; i++) {
      this.digits[i] = NaN;
    }

    // Reverse the array as the singles should be the last digit.
    this.digits.reverse();

    this.resetVisible();
  }

  protected render(): HTMLTemplateResult {
    const digitsHtml: HTMLTemplateResult[] = [];

    this.digits.forEach((digit, index) => {
      let fillInType: string;
      if (this.numberDigits === 1) fillInType = 'fillinSingleDigit';
      else if (index === 0) fillInType = 'fillinMultiDigitLeft';
      else if (index === this.numberDigits - 1)
        fillInType = 'fillinMultiDigitRight';
      else fillInType = 'fillinMultiDigitMid';
      digitsHtml.push(
        html`<div
          class="fillinDigit ${fillInType} ${index === this.digitVisible + 1 &&
          this.fillinActive
            ? 'fillinActive'
            : ''}"
        >
          ${index <= this.digitVisible && !Number.isNaN(digit)
            ? digit
            : html`&nbsp;`}
        </div>`,
      );
    });

    return html`${digitsHtml}`;
  }
}
