import { LitElement, html, css, unsafeCSS } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, property } from 'lit/decorators.js';

/** Possible balloon colors */
export type IconColors =
  | 'yellow'
  | 'purple'
  | 'yellowPurple'
  | 'green'
  | 'blue';

export type ImageTypes = 'balloon' | 'kite';

@customElement('game-icon-with-text-overlay')
export class BalloonIndex extends LitElement {
  @property()
  iconcolor: IconColors = 'yellow';
  @property()
  image: ImageTypes = 'balloon';
  @property()
  text1 = '';
  @property()
  text2 = '';
  @property()
  text3 = '';
  @property()
  text4 = '';

  static get styles(): CSSResultGroup {
    return css`
      .balloon,
      .kite {
        display: inline-block;
        background-color: transparent;
        border: none;
        outline: none;
        color: black;
        text-align: center;
        margin: 2px;
        padding: 0;
      }

      .balloon {
        background-size: 75px 90px;
        width: 75px;
        height: 90px;
        line-height: 78px;
      }

      .kite {
        background-size: 70px 105px;
        width: 70px;
        height: 105px;
        line-height: 80px;
      }

      .oneLineFont {
        font-size: 23px;
      }

      .twoLineFont {
        font-size: 21px;
      }

      .threeLineFont {
        font-size: 18px;
      }

      .fourLineFont {
        font-size: 15px;
      }

      .kiteBlue {
        background-image: url('${unsafeCSS(
          new URL('../images/kite-blue.svg', import.meta.url)
        )}');
      }

      .kitePurple {
        background-image: url('${unsafeCSS(
          new URL('../images/kite-purple.svg', import.meta.url)
        )}');
      }

      .kiteGreen {
        background-image: url('${unsafeCSS(
          new URL('../images/kite-green.svg', import.meta.url)
        )}');
      }

      .kiteYellow {
        background-image: url('${unsafeCSS(
          new URL('../images/kite-yellow.svg', import.meta.url)
        )}');
      }

      .balloonBlue {
        background-image: url('${unsafeCSS(
          new URL('../images/balloon-blue.png', import.meta.url)
        )}');
      }

      .balloonPurple {
        background-image: url('${unsafeCSS(
          new URL('../images/balloon-purple.png', import.meta.url)
        )}');
      }

      .balloonGreen {
        background-image: url('${unsafeCSS(
          new URL('../images/balloon-green.png', import.meta.url)
        )}');
      }

      .balloonYellow {
        background-image: url('${unsafeCSS(
          new URL('../images/balloon-yellow.png', import.meta.url)
        )}');
      }

      .balloonYellowPurple {
        background-image: url('${unsafeCSS(
          new URL('../images/balloon-yellow-purple.png', import.meta.url)
        )}');
      }

      .text {
        display: inline-block;
        vertical-align: middle;
        line-height: normal;
      }
    `;
  }

  render(): HTMLTemplateResult {
    // Determine the number of texts that are not empty
    const numberTexts =
      +(this.text1 !== '') +
      +(this.text2 !== '') +
      +(this.text3 !== '') +
      +(this.text4 !== '');

    let fontClass = '';
    if (numberTexts <= 1) fontClass = 'oneLineFont';
    else if (numberTexts === 2) fontClass = 'twoLineFont';
    else if (numberTexts === 3) fontClass = 'threeLineFont';
    else if (numberTexts === 4) fontClass = 'fourLineFont';

    // Add linebreak between two non-empty texts.
    let linebreakAfter1 = html``;
    let linebreakAfter2 = html``;
    let linebreakAfter3 = html``;
    if (
      this.text1 !== '' &&
      (this.text2 !== '' || this.text3 !== '' || this.text4 !== '')
    )
      linebreakAfter1 = html`<br />`;
    if (this.text2 !== '' && (this.text3 !== '' || this.text4 !== ''))
      linebreakAfter2 = html`<br />`;
    if (this.text2 !== '' && this.text4 !== '') linebreakAfter3 = html`<br />`;

    const text = html`${this.text1}${linebreakAfter1}${this
      .text2}${linebreakAfter2}${this.text3}${linebreakAfter3}${this.text4}`;

    // Determine balloon color class based on ballooncolor
    const balloonColorClass =
      this.iconcolor.charAt(0).toUpperCase() + this.iconcolor.slice(1);

    return html`
      <div class="${this.image} ${this.image}${balloonColorClass} ${fontClass}">
        <span class="text">${text}</span>
      </div>
    `;
  }
}
