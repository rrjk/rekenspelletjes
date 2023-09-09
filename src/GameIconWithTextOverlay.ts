import { LitElement, html, css, unsafeCSS } from 'lit';
import type { HTMLTemplateResult, CSSResult } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, property } from 'lit/decorators.js';

import type { Color, ColorInfo } from './Colors';
import { getColorInfo } from './Colors';
import { getRocketAsSvgUrl } from './RocketImage';

const iconURLArray: { iconColor: Color; balloonUrl: URL; kiteUrl: URL }[] = [
  {
    iconColor: 'yellow',
    balloonUrl: new URL(
      '../images/balloon-20-color-set-yellow.png',
      import.meta.url
    ),
    kiteUrl: new URL('../images/kite-20-color-set-yellow.png', import.meta.url),
  },
  {
    iconColor: 'purple',
    balloonUrl: new URL(
      '../images/balloon-20-color-set-purple.png',
      import.meta.url
    ),
    kiteUrl: new URL('../images/kite-20-color-set-purple.png', import.meta.url),
  },
  {
    iconColor: 'green',
    balloonUrl: new URL(
      '../images/balloon-20-color-set-green.png',
      import.meta.url
    ),
    kiteUrl: new URL('../images/kite-20-color-set-green.png', import.meta.url),
  },
  {
    iconColor: 'blue',
    balloonUrl: new URL(
      '../images/balloon-20-color-set-blue.png',
      import.meta.url
    ),
    kiteUrl: new URL('../images/kite-20-color-set-blue.png', import.meta.url),
  },
  {
    iconColor: 'maroon',
    balloonUrl: new URL(
      '../images/balloon-20-color-set-maroon.png',
      import.meta.url
    ),
    kiteUrl: new URL('../images/kite-20-color-set-maroon.png', import.meta.url),
  },
  {
    iconColor: 'red',
    balloonUrl: new URL(
      '../images/balloon-20-color-set-red.png',
      import.meta.url
    ),
    kiteUrl: new URL('../images/kite-20-color-set-red.png', import.meta.url),
  },
  {
    iconColor: 'pink',
    balloonUrl: new URL(
      '../images/balloon-20-color-set-pink.png',
      import.meta.url
    ),
    kiteUrl: new URL('../images/kite-20-color-set-pink.png', import.meta.url),
  },
  {
    iconColor: 'brown',
    balloonUrl: new URL(
      '../images/balloon-20-color-set-brown.png',
      import.meta.url
    ),
    kiteUrl: new URL('../images/kite-20-color-set-brown.png', import.meta.url),
  },
  {
    iconColor: 'orange',
    balloonUrl: new URL(
      '../images/balloon-20-color-set-orange.png',
      import.meta.url
    ),
    kiteUrl: new URL('../images/kite-20-color-set-orange.png', import.meta.url),
  },
  {
    iconColor: 'apricot',
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
    balloonUrl: new URL(
      '../images/balloon-20-color-set-olive.png',
      import.meta.url
    ),
    kiteUrl: new URL('../images/kite-20-color-set-olive.png', import.meta.url),
  },
  {
    iconColor: 'beige',
    balloonUrl: new URL(
      '../images/balloon-20-color-set-beige.png',
      import.meta.url
    ),
    kiteUrl: new URL('../images/kite-20-color-set-beige.png', import.meta.url),
  },
  {
    iconColor: 'lime',
    balloonUrl: new URL(
      '../images/balloon-20-color-set-lime.png',
      import.meta.url
    ),
    kiteUrl: new URL('../images/kite-20-color-set-lime.png', import.meta.url),
  },
  {
    iconColor: 'mint',
    balloonUrl: new URL(
      '../images/balloon-20-color-set-mint.png',
      import.meta.url
    ),
    kiteUrl: new URL('../images/kite-20-color-set-mint.png', import.meta.url),
  },
  {
    iconColor: 'teal',
    balloonUrl: new URL(
      '../images/balloon-20-color-set-teal.png',
      import.meta.url
    ),
    kiteUrl: new URL('../images/kite-20-color-set-teal.png', import.meta.url),
  },
  {
    iconColor: 'cyan',
    balloonUrl: new URL(
      '../images/balloon-20-color-set-cyan.png',
      import.meta.url
    ),
    kiteUrl: new URL('../images/kite-20-color-set-cyan.png', import.meta.url),
  },
  {
    iconColor: 'navy',
    balloonUrl: new URL(
      '../images/balloon-20-color-set-navy.png',
      import.meta.url
    ),
    kiteUrl: new URL('../images/kite-20-color-set-navy.png', import.meta.url),
  },
  {
    iconColor: 'lavender',
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
  iconcolor: Color = 'yellow';
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
    for (const color of iconURLArray) {
      const colorInfo: ColorInfo = getColorInfo(color.iconColor);
      const styleName = `.${icon}${
        color.iconColor.charAt(0).toUpperCase() + color.iconColor.slice(1)
      }`;
      let iconURL;
      if (icon === 'balloon') iconURL = color.balloonUrl;
      else if (icon === 'kite') iconURL = color.kiteUrl;
      else if (icon === 'rocket')
        iconURL = `data:image/svg+xml,${unsafeCSS(
          getRocketAsSvgUrl(colorInfo.accentColorCode, colorInfo.mainColorCode)
        )}`;
      styles.push(css`
        ${unsafeCSS(styleName)} {
          background-image: url('${unsafeCSS(iconURL)}');
          color: ${unsafeCSS(colorInfo.fontColor)};
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

        .rocketBlue {
          background-image: url('data:image/svg+xml,<path d="M 64 3 C 31 33 37 63 43 76 C 51 89 46 81 54 93 H 64 V 85 M 64 93 H 74 C 82 81 77 89 85 76 C 91 63 97 33 64 3" stroke="%23fffac8" stroke-width="2" stroke-linecap="round" fill="white"/><path d="M 54 93 L 36 102 C 26 92 32.5 89 43 76 C 51 89 46 81 54 93" stroke="%23fffac8" stroke-width="2" stroke-linecap="round" fill="%23fffac8"/><path d="M 74 93 L 92 102 C 102 92 95.5 89 85 76 C 77 89 82 81 74 93" stroke="%23fffac8" stroke-width="2" stroke-linecap="round" fill="%23fffac8"/><path d="M 69 100 L 59 100 C 50 106 51 113 64 125 C 78 113 77 106 69 100" stroke="%23fffac8" stroke-width="2" stroke-linecap="round" fill="lightgrey"/><circle cx="64" cy="31.6" fill="lightgrey" r="6.7" stroke="%23fffac8" stroke-width="2"/>');
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
      .concat(BalloonIndex.getIconStyles('kite'))
      .concat(BalloonIndex.getIconStyles('rocket'));
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
