import { LitElement, html, css, unsafeCSS } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, property } from 'lit/decorators.js';

/** Possible balloon colors */
export type ImageColors =
  | 'red'
  | 'orange'
  | 'yellow'
  | 'lime'
  | 'green'
  | 'cyan'
  | 'blue'
  | 'purple'
  | 'magenta';

@customElement('elli-star-with-text-overlay')
export class BalloonIndex extends LitElement {
  @property()
  imageColor: ImageColors = 'yellow';
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
      .elliStar {
        display: inline-block;
        background-size: 115px 90px;
        width: 115px;
        height: 90px;
        line-height: 90px;
        background-color: transparent;
        border: none;
        outline: none;
        color: black;
        text-align: center;
        margin: 2px;
        padding: 0;
      }

      .image-red {
        background-image: url('${unsafeCSS(
          new URL('../images/Mompitz Elli star-red.png', import.meta.url)
        )}');
      }

      .image-orange {
        background-image: url('${unsafeCSS(
          new URL('../images/Mompitz Elli star-orange.png', import.meta.url)
        )}');
      }

      .image-yellow {
        background-image: url('${unsafeCSS(
          new URL('../images/Mompitz Elli star-yellow.png', import.meta.url)
        )}');
      }

      .image-lime {
        background-image: url('${unsafeCSS(
          new URL('../images/Mompitz Elli star-lime.png', import.meta.url)
        )}');
      }

      .image-green {
        background-image: url('${unsafeCSS(
          new URL('../images/Mompitz Elli star-green.png', import.meta.url)
        )}');
      }

      .image-cyan {
        background-image: url('${unsafeCSS(
          new URL('../images/Mompitz Elli star-cyan.png', import.meta.url)
        )}');
      }

      .image-blue {
        background-image: url('${unsafeCSS(
          new URL('../images/Mompitz Elli star-blue.png', import.meta.url)
        )}');
      }

      .image-purple {
        background-image: url('${unsafeCSS(
          new URL('../images/Mompitz Elli star-purple.png', import.meta.url)
        )}');
      }

      .image-magenta {
        background-image: url('${unsafeCSS(
          new URL('../images/Mompitz Elli star-magenta.png', import.meta.url)
        )}');
      }

      .oneLineFont {
        font-size: 17px;
      }

      .twoLineFont {
        font-size: 13px;
      }

      .threeLineFont {
        font-size: 12px;
      }

      .fourLineFont {
        font-size: 9px;
      }

      .text {
        display: inline-block;
        position: relative;
        left: 12px;
        vertical-align: middle;
        line-height: normal;
        margin: 0;
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

    return html`
      <div class="elliStar ${fontClass} image-${this.imageColor}">
        <span class="text">${text}</span>
      </div>
    `;
  }
}
