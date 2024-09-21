import { LitElement, html, css, unsafeCSS } from 'lit';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, property, state } from 'lit/decorators.js';

import {
  addResizeObserverClient,
  removeResizeObserverClient,
  ResizeObserverClientInterface,
} from './ResizeObserver';

import { Digit } from './DigitKeyboard';
import type { DigitFillin } from './DigitFillin';
import './DigitFillin';
import { ChildNotFoundError } from './ChildNotFoundError';

@customElement('tens-split-widget')
export class TensSplitWidget
  extends LitElement
  implements ResizeObserverClientInterface
{
  @property({ type: Number })
  numberToSplit = 28;

  @state()
  private activeFillIn = 0;
  @state()
  private usedFillIns = ['splitTensLeft', 'splitTensRight', 'splitSingles'];

  @state()
  wideTallClass = 'WideContainer';

  static get styles(): CSSResultArray {
    return [
      css`
        :host {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .tenSplitWidgetBox {
          aspect-ratio: 4/3;
          box-sizing: border-box;
          display: grid;
          grid-template-rows: 60% 40%;
        }

        .WideContainer {
          height: 100%;
          width: auto;
        }

        .TallContainer {
          height: auto;
          width: 100%;
        }

        text {
          dominant-baseline: mathematical;
          text-anchor: middle;
          font-size: 80px;
        }

        line {
          stroke: black;
          stroke-width: 3px;
        }

        .upperRow,
        .bottomRow {
          display: flex;
          justify-content: center;
        }

        .bottomRow {
          container: lowerRow / size;
        }

        digit-fillin {
          font-size: 80cqh;
        }
      `,
    ];
  }

  connectedCallback(): void {
    super.connectedCallback();
    addResizeObserverClient(this);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    removeResizeObserverClient(this);
  }

  /** Helper function to easily query for an element.
   *  @param query Querystring for the element.
   *  @template T The type of the element.
   *  @throws ChildNotFoundError in case the element can't be found.
   *
   */
  protected getElement<T>(query: string): T {
    const ret = <T | null>this.renderRoot.querySelector(query);
    if (ret === null) {
      throw new ChildNotFoundError(query, 'TimeLimitedGame');
    }
    return ret;
  }

  handleResize() {
    if (this.clientHeight / 3 >= this.clientWidth / 4) {
      this.wideTallClass = 'TallContainer';
    } else {
      this.wideTallClass = 'WideContainer';
    }
  }

  getActiveFillin(): DigitFillin {
    return this.getElement<DigitFillin>(
      `#${this.usedFillIns[this.activeFillIn]}`
    );
  }

  /*

  handleDigit(digit: Digit) {
    if (this.gameEnabled) {
      const processResult = this.getActiveFillin().processInput(digit);

      if (processResult === 'inputNok') {
        this.getElement<DigitKeyboard>('digit-keyboard').disable(digit);
        this.handleWrongAnswer();
      } else if (processResult === 'inputOk') {
        this.getElement<DigitKeyboard>('digit-keyboard').enableAllDigits();
      } else if (processResult === 'fillinComplete') {
        if (this.activeFillIn === this.usedFillIns.length - 1) {
          this.handleCorrectAnswer();
        } else {
          this.getElement<DigitKeyboard>('digit-keyboard').enableAllDigits();
          this.activeFillIn += 1;
        }
      }
    }
  }
*/
  render(): HTMLTemplateResult {
    return html`
      <div class="tenSplitWidgetBox ${this.wideTallClass}">
        <div class="upperRow" style="background-color:orange;">
          <svg viewbox="-100 -50 200 200" style="height: 100%;">
            <text>${this.numberToSplit}</text>
            <line x1="-20" y1="50" x2="-60" y2="140" />
            <line x1="20" y1="50" x2="60" y2="140" />
          </svg>
        </div>
        <div class="bottomRow" style="background-color:pink;">
          <digit-fillin
            desiredNumber="50"
            numberDigits="2"
            fillinActive
          ></digit-fillin>
          <digit-fillin desiredNumber="6" numberDigits="1"></digit-fillin>
        </div>
      </div>
    `;
  }
}
