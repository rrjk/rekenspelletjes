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
  {
    iconColor: 'yellow',
    fontColor: 'black',
    balloonUrl: new URL(
      '../images/balloon-20-color-set-yellow.png',
      import.meta.url
    ),
    kiteUrl: new URL('../images/kite-20-color-set-yellow.png', import.meta.url),
  },
  {
    iconColor: 'purple',
    fontColor: 'white',
    balloonUrl: new URL(
      '../images/balloon-20-color-set-purple.png',
      import.meta.url
    ),
    kiteUrl: new URL('../images/kite-20-color-set-purple.png', import.meta.url),
  },
  {
    iconColor: 'yellowPurple',
    fontColor: 'black',
    balloonUrl: new URL(
      '../images/balloon-20-color-set-yellowPurple.png',
      import.meta.url
    ),
    kiteUrl: new URL(
      '../images/kite-20-color-set-yellowPurple.png',
      import.meta.url
    ),
  },
  {
    iconColor: 'green',
    fontColor: 'white',
    balloonUrl: new URL(
      '../images/balloon-20-color-set-green.png',
      import.meta.url
    ),
    kiteUrl: new URL('../images/kite-20-color-set-green.png', import.meta.url),
  },
  {
    iconColor: 'blue',
    fontColor: 'white',
    balloonUrl: new URL(
      '../images/balloon-20-color-set-blue.png',
      import.meta.url
    ),
    kiteUrl: new URL('../images/kite-20-color-set-blue.png', import.meta.url),
  },
  {
    iconColor: 'maroon',
    fontColor: 'white',
    balloonUrl: new URL(
      '../images/balloon-20-color-set-maroon.png',
      import.meta.url
    ),
    kiteUrl: new URL('../images/kite-20-color-set-maroon.png', import.meta.url),
  },
  {
    iconColor: 'red',
    fontColor: 'white',
    balloonUrl: new URL(
      '../images/balloon-20-color-set-red.png',
      import.meta.url
    ),
    kiteUrl: new URL('../images/kite-20-color-set-red.png', import.meta.url),
  },
  {
    iconColor: 'pink',
    fontColor: 'black',
    balloonUrl: new URL(
      '../images/balloon-20-color-set-pink.png',
      import.meta.url
    ),
    kiteUrl: new URL('../images/kite-20-color-set-pink.png', import.meta.url),
  },
  {
    iconColor: 'brown',
    fontColor: 'white',
    balloonUrl: new URL(
      '../images/balloon-20-color-set-brown.png',
      import.meta.url
    ),
    kiteUrl: new URL('../images/kite-20-color-set-brown.png', import.meta.url),
  },
  {
    iconColor: 'orange',
    fontColor: 'white',
    balloonUrl: new URL(
      '../images/balloon-20-color-set-orange.png',
      import.meta.url
    ),
    kiteUrl: new URL('../images/kite-20-color-set-orange.png', import.meta.url),
  },
  {
    iconColor: 'apricot',
    fontColor: 'black',
    balloonUrl: new URL(
      '../images/balloon-20-color-set-apricot.png',
      import.meta.url
    ),
    kiteUrl: new URL(
      '../images/kite-20-color-set-apricot.png',
      import.meta.url
    ),
  },
  {
    iconColor: 'olive',
    fontColor: 'white',
    balloonUrl: new URL(
      '../images/balloon-20-color-set-olive.png',
      import.meta.url
    ),
    kiteUrl: new URL('../images/kite-20-color-set-olive.png', import.meta.url),
  },
  {
    iconColor: 'beige',
    fontColor: 'black',
    balloonUrl: new URL(
      '../images/balloon-20-color-set-beige.png',
      import.meta.url
    ),
    kiteUrl: new URL('../images/kite-20-color-set-beige.png', import.meta.url),
  },
  {
    iconColor: 'lime',
    fontColor: 'black',
    balloonUrl: new URL(
      '../images/balloon-20-color-set-lime.png',
      import.meta.url
    ),
    kiteUrl: new URL('../images/kite-20-color-set-lime.png', import.meta.url),
  },
  {
    iconColor: 'mint',
    fontColor: 'black',
    balloonUrl: new URL(
      '../images/balloon-20-color-set-mint.png',
      import.meta.url
    ),
    kiteUrl: new URL('../images/kite-20-color-set-mint.png', import.meta.url),
  },
  {
    iconColor: 'teal',
    fontColor: 'white',
    balloonUrl: new URL(
      '../images/balloon-20-color-set-teal.png',
      import.meta.url
    ),
    kiteUrl: new URL('../images/kite-20-color-set-teal.png', import.meta.url),
  },
  {
    iconColor: 'cyan',
    fontColor: 'black',
    balloonUrl: new URL(
      '../images/balloon-20-color-set-cyan.png',
      import.meta.url
    ),
    kiteUrl: new URL('../images/kite-20-color-set-cyan.png', import.meta.url),
  },
  {
    iconColor: 'navy',
    fontColor: 'white',
    balloonUrl: new URL(
      '../images/balloon-20-color-set-navy.png',
      import.meta.url
    ),
    kiteUrl: new URL('../images/kite-20-color-set-navy.png', import.meta.url),
  },
  {
    iconColor: 'lavender',
    fontColor: 'black',
    balloonUrl: new URL(
      '../images/balloon-20-color-set-lavender.png',
      import.meta.url
    ),
    kiteUrl: new URL(
      '../images/kite-20-color-set-lavender.png',
      import.meta.url
    ),
  },
  {
    iconColor: 'magenta',
    fontColor: 'white',
    balloonUrl: new URL(
      '../images/balloon-20-color-set-magenta.png',
      import.meta.url
    ),
    kiteUrl: new URL(
      '../images/kite-20-color-set-magenta.png',
      import.meta.url
    ),
  },
  {
    iconColor: 'grey',
    fontColor: 'white',
    balloonUrl: new URL(
      '../images/balloon-20-color-set-grey.png',
      import.meta.url
    ),
    kiteUrl: new URL('../images/kite-20-color-set-grey.png', import.meta.url),
  },
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

  static getIconStyles(icon: ImageTypes): CSSResult[] {
    const styles: CSSResult[] = [];
    for (const color of iconColorArray) {
      const styleName = `.${icon}${
        color.iconColor.charAt(0).toUpperCase() + color.iconColor.slice(1)
      }`;
      let iconURL;
      if (icon === 'balloon') iconURL = color.balloonUrl;
      else if (icon === 'kite') iconURL = color.kiteUrl;
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
    return styles
      .concat(BalloonIndex.getIconStyles('balloon'))
      .concat(BalloonIndex.getIconStyles('kite'));
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
