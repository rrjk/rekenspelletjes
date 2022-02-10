import { LitElement, html, css } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, property } from 'lit/decorators.js';

@customElement('mompitz-number')
export class MompitzNumber extends LitElement {
  @property({ type: Number })
  number = 23;

  @property({ type: Number })
  minimumNumberDigitsForSize = 1;

  static digitImagesNormal: URL[] = [
    new URL('../images/Mompitz0.png', import.meta.url),
    new URL('../images/Mompitz1.png', import.meta.url),
    new URL('../images/Mompitz2.png', import.meta.url),
    new URL('../images/Mompitz3.png', import.meta.url),
    new URL('../images/Mompitz4.png', import.meta.url),
    new URL('../images/Mompitz5.png', import.meta.url),
    new URL('../images/Mompitz6.png', import.meta.url),
    new URL('../images/Mompitz7.png', import.meta.url),
    new URL('../images/Mompitz8.png', import.meta.url),
    new URL('../images/Mompitz9.png', import.meta.url),
  ];

  static digit1NarrowImage: URL = new URL(
    '../images/Mompitz1narrow.png',
    import.meta.url
  );

  static get styles(): CSSResultGroup {
    return css`
      .digit {
        display: inline;
        max-height: 100%;
      }

      .normal {
        max-width: calc(85% / var(--numberDigits));
      }

      .narrow {
        max-width: calc((85% / var(--numberDigits)) / 2);
      }
      .numberDiv {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
      }
    `;
  }

  protected updated(): void {
    /* Workaround for bug found in firefox where draggable=false is ignored in case user-select is set to none.
     * Please note that this expression cannot pierce into webcomponent's shadowdoms.
     * The img in slots are found though.
     */
    if (window.navigator.userAgent.toLowerCase().includes('firefox')) {
      this.renderRoot.querySelectorAll('img[draggable=false]').forEach(el => {
        el.addEventListener('mousedown', event => event.preventDefault());
      });
    }
  }

  render(): HTMLTemplateResult {
    type DigitInfo = {
      digit: number;
      narrow: 'normal' | 'narrow';
    };

    const digits: DigitInfo[] = [];

    let currentDigit = 0;
    let toProcess = this.number;

    if (this.number === 0) digits[0] = { digit: 0, narrow: 'normal' };

    while (toProcess !== 0) {
      digits.push({ digit: toProcess % 10, narrow: 'normal' });
      toProcess = Math.floor(toProcess / 10);
      currentDigit += 1;
    }

    digits.reverse();

    if (
      currentDigit > this.minimumNumberDigitsForSize &&
      digits[0].digit === 1
    ) {
      digits[0].narrow = 'narrow';
      currentDigit -= 0.5;
    }

    const numberDigits = Math.max(
      currentDigit,
      this.minimumNumberDigitsForSize
    );

    return html`
      <style>
        :host {
          --numberDigits: ${numberDigits};
        }
      </style>

      <div class="numberDiv">
        ${digits.map(
          digitInfo => html`
            <img
              draggable="false"
              alt="${digitInfo.digit}"
              class="digit ${digitInfo.narrow}"
              src="${digitInfo.narrow === 'narrow'
                ? MompitzNumber.digit1NarrowImage
                : MompitzNumber.digitImagesNormal[digitInfo.digit]}"
            />
          `
        )}
      </div>
    `;
  }
}
