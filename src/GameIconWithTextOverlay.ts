import { LitElement, html, css, unsafeCSS } from 'lit';
import type { HTMLTemplateResult, CSSResult } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, property } from 'lit/decorators.js';

/** Possible balloon colors */
/** Colors taken from https://sashamaps.net/docs/resources/20-colors/ */
export type IconColors =
  | 'yellow'
  | 'purple'
  | 'yellowPurple'
  | 'green'
  | 'blue'
  | 'maroon'
  | 'red'
  | 'pink'
  | 'brown'
  | 'orange'
  | 'apricot'
  | 'olive'
  | 'beige'
  | 'lime'
  | 'mint'
  | 'teal'
  | 'cyan'
  | 'navy'
  | 'lavender'
  | 'magenta'
  | 'grey';

const iconColorArray = [
  { iconColor: 'yellow', fontColor: 'black' },
  { iconColor: 'purple', fontColor: 'white' },
  { iconColor: 'yellowPurple', fontColor: 'black' },
  { iconColor: 'green', fontColor: 'white' },
  { iconColor: 'blue', fontColor: 'white' },
  { iconColor: 'maroon', fontColor: 'white' },
  { iconColor: 'red', fontColor: 'white' },
  { iconColor: 'pink', fontColor: 'black' },
  { iconColor: 'brown', fontColor: 'white' },
  { iconColor: 'orange', fontColor: 'white' },
  { iconColor: 'apricot', fontColor: 'black' },
  { iconColor: 'olive', fontColor: 'white' },
  { iconColor: 'beige', fontColor: 'black' },
  { iconColor: 'lime', fontColor: 'black' },
  { iconColor: 'mint', fontColor: 'black' },
  { iconColor: 'teal', fontColor: 'white' },
  { iconColor: 'cyan', fontColor: 'black' },
  { iconColor: 'navy', fontColor: 'white' },
  { iconColor: 'lavender', fontColor: 'black' },
  { iconColor: 'magenta', fontColor: 'white' },
  { iconColor: 'grey', fontColor: 'white' },
];

export type ImageTypes = 'balloon' | 'kite' | 'rocket';

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

  static getBalloonStyles(): CSSResult[] {
    const styles: CSSResult[] = [];
    for (const color of iconColorArray) {
      const styleName = `.balloon${
        color.iconColor.charAt(0).toUpperCase() + color.iconColor.slice(1)
      }`;
      const iconURL = new URL(
        `../images/balloon-20-color-set-${color.iconColor}.png`,
        import.meta.url
      );
      styles.push(css`
        ${unsafeCSS(styleName)} {
          background-image: url('${unsafeCSS(iconURL)}');
          color: ${unsafeCSS(color.fontColor)};
        }
      `);
    }
    return styles;
  }

  static get styles(): CSSResult[] {
    BalloonIndex.getBalloonStyles();
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

        .rocketBlue {
          background-image: url('${unsafeCSS(
            new URL('../images/rocket-blue.svg', import.meta.url)
          )}');
        }

        .rocketPurple {
          background-image: url('${unsafeCSS(
            new URL('../images/rocket-purple.svg', import.meta.url)
          )}');
        }

        .rocketGreen {
          background-image: url('${unsafeCSS(
            new URL('../images/rocket-green.svg', import.meta.url)
          )}');
        }

        .rocketYellow {
          background-image: url('${unsafeCSS(
            new URL('../images/rocket-yellow.svg', import.meta.url)
          )}');
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
    return styles.concat(BalloonIndex.getBalloonStyles());
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
