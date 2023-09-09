import { LitElement, html, css } from 'lit';
import type { HTMLTemplateResult, CSSResult } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, property } from 'lit/decorators.js';

import type { Color } from './Colors';

import type { GameIcon } from './GameIcons';
import { getIconStyles } from './GameIcons';

@customElement('game-icon-with-text-overlay')
export class BalloonIndex extends LitElement {
  @property()
  iconcolor: Color = 'yellow';
  @property()
  image: GameIcon = 'balloon';
  @property()
  text1 = '';
  @property()
  text2 = '';
  @property()
  text3 = '';
  @property()
  text4 = '';

  static get styles(): CSSResult[] {
    const styles: CSSResult[] = [
      css`
        .balloon,
        .kite,
        .rocket {
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

        .rocket {
          background-size: 90px 90px;
          width: 90px;
          height: 90px;
          line-height: 90px;
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

        .text {
          display: inline-block;
          vertical-align: middle;
          line-height: normal;
        }

        .rocket .text {
          position: relative;
          top: -0.3em;
        }
      `,
    ];
    return styles
      .concat(getIconStyles('balloon'))
      .concat(getIconStyles('kite'))
      .concat(getIconStyles('rocket'));
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
