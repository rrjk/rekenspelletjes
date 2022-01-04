import { LitElement, html, css } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, property } from 'lit/decorators.js';

/** Possible balloon colors */
export type BalloonColors =
  | 'yellow'
  | 'purple'
  | 'yellowPurple'
  | 'green'
  | 'blue';

@customElement('balloon-with-text-overlay')
export class BalloonIndex extends LitElement {
  @property()
  ballooncolor: BalloonColors = 'yellow';
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
      .balloon {
        display: inline-block;
        background-size: 75px 90px;
        width: 75px;
        height: 90px;
        line-height: 78px;
        background-color: transparent;
        border: none;
        outline: none;
        color: black;
        text-align: center;
        margin: 2px;
        padding: 0;
      }

      .oneLineFont {
        font-size: 23px;
      }

      .twoLineFont {
        font-size: 23px;
      }

      .threeLineFont {
        font-size: 18px;
      }

      .fourLineFont {
        font-size: 15px;
      }

      .balloonBlue {
        background-image: url('images/balloon-blue.png');
      }

      .balloonPurple {
        background-image: url('images/balloon-purple.png');
      }

      .balloonGreen {
        background-image: url('images/balloon-green.png');
      }

      .balloonYellow {
        background-image: url('images/balloon-yellow.png');
      }

      .balloonYellowPurple {
        background-image: url('images/balloon-yellow-purple.png');
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
      this.ballooncolor.charAt(0).toUpperCase() + this.ballooncolor.slice(1);

    return html`
      <div class="balloon balloon${balloonColorClass} ${fontClass}">
        <span class="text">${text}</span>
      </div>
    `;
  }
}
