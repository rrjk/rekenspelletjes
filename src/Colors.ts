/** Possible colors used the the games.
 * Colors taken from https://sashamaps.net/docs/resources/20-colors/
 * Other interesting side for more colors: http://phrogz.net/css/distinct-colors.html/
 * Get variations of colors via https://convertingcolors.com/hex-color-f032e6.html
 * Info about how to do all this: https://www.svgbackgrounds.com/how-to-add-svgs-with-css-background-image/
 */

import { saturate } from 'color2k';

export const neonFusionColors = [
  'malachite',
  'amberFlame',
  'fuchsiaFlame',
  'brilliantAzure',
  'limeFlash',
] as const;

export const setOf20Colors = [
  'apricot',
  'beige',
  'blue',
  'brown',
  'cyan',
  'green',
  'lavender',
  'lime',
  'magenta',
  'maroon',
  'mint',
  'navy',
  'olive',
  'orange',
  'pink',
  'purple',
  'red',
  'teal',
  'yellow',
] as const;

export const colors = setOf20Colors; // Included for backward compatibility

export const legacyBalloonColors = [
  'legacyYellow',
  'legacyPurple',
  'legacyBlue',
  'legacyGreen',
] as const;

export const blackWhiteColors = ['black', 'grey', 'white'] as const;

export type NeonFusionColor = (typeof neonFusionColors)[number];
export type SetOf20Color = (typeof setOf20Colors)[number];
export type LegacyBalloonColors = (typeof legacyBalloonColors)[number];
export type BlackWhiteColors = (typeof blackWhiteColors)[number];

export type Color =
  | NeonFusionColor
  | SetOf20Color
  | LegacyBalloonColors
  | BlackWhiteColors;

export type ColorInfo = {
  colorName: Color;
  fontColor: string;
  mainColorCode: string;
  subAccentColorCode?: string;
  accentColorCode: string;
};

export const colorArray: ColorInfo[] = [
  {
    colorName: 'black',
    fontColor: 'white',
    mainColorCode: '#000000',
    accentColorCode: '#5E5E5E',
  },
  {
    colorName: 'white',
    fontColor: 'black',
    mainColorCode: '#FFFFFF',
    accentColorCode: '#ABABAB',
  },
  {
    colorName: 'yellow',
    fontColor: 'black',
    mainColorCode: '#FFE119',
    subAccentColorCode: '#E0C500',
    accentColorCode: '#C1AA00',
  },
  {
    colorName: 'purple',
    fontColor: 'white',
    mainColorCode: '#911EB4',
    subAccentColorCode: '#750099',
    accentColorCode: '#59007E',
  },
  {
    colorName: 'green',
    fontColor: 'white',
    mainColorCode: '#3CB44B',
    subAccentColorCode: '#750099',
    accentColorCode: '#007E17',
  },
  {
    colorName: 'blue',
    fontColor: 'white',
    mainColorCode: '#4363D8',
    accentColorCode: '#0035A0',
  },
  {
    colorName: 'maroon',
    fontColor: 'white',
    mainColorCode: '#800000',
    accentColorCode: '#BD422E',
  },
  {
    colorName: 'red',
    fontColor: 'white',
    mainColorCode: '#E6194B',
    accentColorCode: '#A60020',
  },
  {
    colorName: 'pink',
    fontColor: 'black',
    mainColorCode: '#FABED4',
    accentColorCode: '#C1889D',
  },
  {
    colorName: 'brown',
    fontColor: 'white',
    mainColorCode: '#9A6324',
    accentColorCode: '#D49655',
  },
  {
    colorName: 'orange',
    fontColor: 'white',
    mainColorCode: '#F58231',
    accentColorCode: '#B64E00',
  },
  {
    colorName: 'apricot',
    fontColor: 'black',
    mainColorCode: '#FFD8B1',
    accentColorCode: '#C5A17C',
  },
  {
    colorName: 'olive',
    fontColor: 'white',
    mainColorCode: '#808000',
    accentColorCode: '#B8B542',
  },
  {
    colorName: 'beige',
    fontColor: 'black',
    mainColorCode: '#FFFAC8',
    accentColorCode: '#C6C292',
  },
  {
    colorName: 'lime',
    fontColor: 'black',
    mainColorCode: '#BFEF45',
    accentColorCode: '#85B700',
  },
  {
    colorName: 'mint',
    fontColor: 'black',
    mainColorCode: '#AAFFC3',
    accentColorCode: '#73C68D',
  },
  {
    colorName: 'teal',
    fontColor: 'white',
    mainColorCode: '#469990',
    accentColorCode: '#7DD0C6',
  },
  {
    colorName: 'cyan',
    fontColor: 'black',
    mainColorCode: '#42D4F4',
    accentColorCode: '#009DBC',
  },
  {
    colorName: 'navy',
    fontColor: 'white',
    mainColorCode: '#000075',
    accentColorCode: '#6C49C6',
  },
  {
    colorName: 'lavender',
    fontColor: 'black',
    mainColorCode: '#DCBEFF',
    accentColorCode: '#A488C6',
  },
  {
    colorName: 'magenta',
    fontColor: 'white',
    mainColorCode: '#F032E6',
    accentColorCode: '#B300AE',
  },
  {
    colorName: 'grey',
    fontColor: 'white',
    mainColorCode: '#A9A9A9',
    accentColorCode: '#757575',
  },
  {
    colorName: 'legacyBlue',
    fontColor: 'black',
    mainColorCode: '#0174c5',
    accentColorCode: '#80C3FF',
  },
  {
    colorName: 'legacyGreen',
    fontColor: 'white',
    mainColorCode: '#398f30',
    accentColorCode: '#004300',
  },
  {
    colorName: 'legacyPurple',
    fontColor: 'white',
    mainColorCode: '#af6da9',
    accentColorCode: saturate('#af6da9', 0.2),
  },
  {
    colorName: 'legacyYellow',
    fontColor: 'black',
    mainColorCode: '#b1a23b',
    accentColorCode: '#FFF58A',
  },
  {
    colorName: 'malachite',
    fontColor: 'black',
    mainColorCode: '#04e762',
    accentColorCode: saturate('#04e762', 0.2),
  },
  {
    colorName: 'amberFlame',
    fontColor: 'black',
    mainColorCode: '#f5b700',
    accentColorCode: saturate('#f5b700', 0.2),
  },
  {
    colorName: 'fuchsiaFlame',
    fontColor: 'white',
    mainColorCode: '#dc0073',
    accentColorCode: saturate('#dc0073', 0.2),
  },
  {
    colorName: 'brilliantAzure',
    fontColor: 'white',
    mainColorCode: '#008bf8',
    accentColorCode: saturate('#008bf8', 0.2),
  },
  {
    colorName: 'limeFlash',
    fontColor: 'white',
    mainColorCode: '#89fc00',
    accentColorCode: saturate('#89fc00', 0.2),
  },
];

/** Function to convert a string into a Color.
 * If the provided string is not a valid color, grey is selected as color.
 */
export function stringToColor(color: string | null): Color {
  const colorInfo = colorArray.find(ci => ci.colorName === color);
  if (colorInfo !== undefined) return color as Color;
  return 'grey';
}

export function getColorInfo(color: Color): ColorInfo {
  const colorInfo = colorArray.find(ci => ci.colorName === color);
  if (colorInfo === undefined) {
    /* color is safeguarded using the Color type and we have ensured that all colors
     * in the ColorType are mentioned in the colorArray.
     * This implies we should always find the colorInfo for the color
     */
    throw new Error(
      `Internal software bug - colorinfo requested for a non existing color ${color}`,
    );
  }
  return colorInfo;
}
