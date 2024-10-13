import { LitElement, html, css } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, property } from 'lit/decorators.js';

type DigitInfo = {
  digit: number | 'comma';
  narrow: 'normal' | 'narrow' | 'comma';
};

@customElement('mompitz-number')
export class MompitzNumber extends LitElement {
  @property({ type: Number })
  accessor number = 23;

  @property({ type: Number })
  accessor divider = 1;

  @property({ type: Number })
  accessor minimumNumberDigitsForSize = 1;

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
    import.meta.url,
  );

  static commaImage: URL = new URL(
    '../images/MompitzComma.png',
    import.meta.url,
  );

  static getUrl(digitInfo: DigitInfo): URL {
    if (digitInfo.digit === 'comma') return MompitzNumber.commaImage;
    if (digitInfo.digit === 1 && digitInfo.narrow === 'narrow')
      return MompitzNumber.digit1NarrowImage;

    return MompitzNumber.digitImagesNormal[digitInfo.digit];
  }

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

      .comma {
        max-width: calc((85% / var(--numberDigits)) / 3);
        transform: translate(-10%, 15%);
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
    const digits: DigitInfo[] = [];
    let currentDigit = 0;

    // if the number equals 0, we only put in a zero
    if (this.number === 0) digits[0] = { digit: 0, narrow: 'normal' };
    else {
      // first we determine all the normal digits
      let toProcess = this.number;
      while (toProcess !== 0) {
        digits.push({ digit: toProcess % 10, narrow: 'normal' });
        toProcess = Math.floor(toProcess / 10);
        currentDigit += 1;
      }

      // then we add zeros to the end that will end up at the beginning
      toProcess = this.number;
      while (toProcess / this.divider < 1) {
        digits.push({ digit: 0, narrow: 'normal' });
        toProcess *= 10;
      }

      // then we reverse, such that the digits are displayed correctly
      digits.reverse();

      // then we add a comma add the right location and remove any trailing zeros and commas
      toProcess = this.divider;
      let commaLocation = 0;
      while (toProcess !== 1) {
        commaLocation -= 1;
        toProcess /= 10;
      }
      if (commaLocation !== 0) {
        digits.splice(commaLocation, 0, { digit: 'comma', narrow: 'comma' });
        while (
          (digits[digits.length - 1].digit === 0 ||
            digits[digits.length - 1].digit === 'comma') &&
          digits.length > 0
        ) {
          digits.splice(-1, 1);
        }
      }

      if (
        currentDigit > this.minimumNumberDigitsForSize &&
        digits[0].digit === 1
      ) {
        digits[0].narrow = 'narrow';
        currentDigit -= 0.5;
      }
    }

    const numberDigits = Math.max(
      currentDigit,
      this.minimumNumberDigitsForSize,
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
              src="${MompitzNumber.getUrl(digitInfo)}"
            />
          `,
        )}
      </div>
    `;
  }
}
