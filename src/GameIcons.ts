import { CSSResult, unsafeCSS, css } from 'lit';
import { lighten } from 'color2k';

import type { Color, ColorInfo } from './Colors';
import { getColorInfo } from './Colors';

import { getRocketAsSvgUrl } from './RocketImage';
import { getZeppelinAsSvgUrl } from './ZeppelinImage';

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

export type GameIcon = 'balloon' | 'kite' | 'rocket' | 'zeppelin';

export function getIconStyles(icon: GameIcon): CSSResult[] {
  const styles: CSSResult[] = [];
  for (const color of iconURLArray) {
    const colorInfo: ColorInfo = getColorInfo(color.iconColor);
    const styleName = `.${icon}${
      color.iconColor.charAt(0).toUpperCase() + color.iconColor.slice(1)
    }`;
    let iconURL;
    let fontColor;
    if (icon === 'balloon') {
      iconURL = color.balloonUrl;
      fontColor = colorInfo.fontColor;
    } else if (icon === 'kite') {
      iconURL = color.kiteUrl;
      fontColor = colorInfo.fontColor;
    } else if (icon === 'rocket') {
      iconURL = `data:image/svg+xml,${unsafeCSS(
        getRocketAsSvgUrl(colorInfo.accentColorCode, colorInfo.mainColorCode)
      )}`;
      fontColor = 'black;';
    } else if (icon === 'zeppelin') {
      iconURL = `data:image/svg+xml,${unsafeCSS(
        getZeppelinAsSvgUrl(
          colorInfo.accentColorCode,
          colorInfo.mainColorCode,
          lighten(colorInfo.mainColorCode, 0.2)
        )
      )}`;
      fontColor = colorInfo.fontColor;
    }

    styles.push(css`
      ${unsafeCSS(styleName)} {
        background-image: url('${unsafeCSS(iconURL)}');
        color: ${unsafeCSS(fontColor)};
      }
    `);
  }
  return styles;
}
