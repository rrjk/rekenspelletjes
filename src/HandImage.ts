import { LitElement, html, css } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';

export type PossibleNumberDots = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

/** Function to convert a string into a PossibleBumberDots.
 * If the provided string is undefined,  5 is selected as the number of dots.
 * If the provided string is not a valid number, 6 is selected as the number of dots.
 * If the provided string is to small, 0 is selected as the number of dots.
 * If the provided string is to large, 10  is selected as the number of dots.
 */
export function numberToPossibleNumberDots(
  attributeValue: string | null,
): PossibleNumberDots {
  if (attributeValue === null) return 5;
  const nmbr = parseInt(attributeValue, 10);
  if (Number.isNaN(nmbr)) {
    return 6;
  }
  if (nmbr < 0) return 0;
  if (nmbr > 10) return 10;
  return <PossibleNumberDots>nmbr; // Due to the if statements above, we can cast to PossibleNumberDots
}

/** Two dimensional array to determine which dots are to be shown for a given number of dots
 * First dimension: number of dots (0-10)
 * Second dimension: per dot (10 in total) whether it's to be shown or not.
 */
const numberDotMapping = [
  [false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, true, false, false, false, false],
  [false, false, false, true, false, false, false, true, false, false],
  [false, true, false, false, false, true, false, false, false, true],
  [false, true, false, true, false, false, false, true, false, true],
  [false, true, false, true, false, true, false, true, false, true],
  [false, true, false, true, true, false, true, true, false, true],
  [false, true, false, true, true, true, true, true, false, true],
  [false, true, false, true, true, true, true, true, true, true],
  [false, true, true, true, true, true, true, true, true, true],
  [true, true, true, true, true, true, true, true, true, true],
];

/** Location of the ten dots that can be shown */
const dotLocations = [
  { cx: 564, cy: 470 },
  { cx: 414, cy: 600 },
  { cx: 564, cy: 600 },
  { cx: 714, cy: 600 },
  { cx: 414, cy: 730 },
  { cx: 564, cy: 730 },
  { cx: 714, cy: 730 },
  { cx: 414, cy: 860 },
  { cx: 564, cy: 860 },
  { cx: 714, cy: 860 },
];

/** Dots (Montessori)  */
const dotsMontessori = [
  [],
  [{ cx: 564, cy: 730 }],
  [
    { cx: 414, cy: 730 },
    { cx: 714, cy: 730 },
  ],
  [
    { cx: 564, cy: 620 },
    { cx: 414, cy: 840 },
    { cx: 714, cy: 840 },
  ],
  [
    { cx: 564, cy: 600 },
    { cx: 414, cy: 730 },
    { cx: 714, cy: 730 },
    { cx: 564, cy: 860 },
  ],
  [
    { cx: 414, cy: 630 },
    { cx: 564, cy: 630 },
    { cx: 714, cy: 630 },
    { cx: 489, cy: 830 },
    { cx: 639, cy: 830 },
  ],
  [
    { cx: 414, cy: 630 },
    { cx: 564, cy: 630 },
    { cx: 714, cy: 630 },
    { cx: 414, cy: 830 },
    { cx: 564, cy: 830 },
    { cx: 714, cy: 830 },
  ],
  [
    { cx: 489, cy: 610 },
    { cx: 639, cy: 610 },
    { cx: 414, cy: 730 },
    { cx: 564, cy: 730 },
    { cx: 714, cy: 730 },
    { cx: 489, cy: 850 },
    { cx: 639, cy: 850 },
  ],
  [
    { cx: 414, cy: 610 },
    { cx: 564, cy: 610 },
    { cx: 714, cy: 610 },
    { cx: 489, cy: 730 },
    { cx: 639, cy: 730 },
    { cx: 414, cy: 850 },
    { cx: 564, cy: 850 },
    { cx: 714, cy: 850 },
  ],
  [
    { cx: 414, cy: 610 },
    { cx: 564, cy: 610 },
    { cx: 714, cy: 610 },
    { cx: 414, cy: 730 },
    { cx: 564, cy: 730 },
    { cx: 714, cy: 730 },
    { cx: 414, cy: 850 },
    { cx: 564, cy: 850 },
    { cx: 714, cy: 850 },
  ],
  [
    { cx: 414, cy: 585 },
    { cx: 564, cy: 585 },
    { cx: 714, cy: 585 },

    { cx: 489, cy: 685 },
    { cx: 639, cy: 685 },

    { cx: 489, cy: 805 },
    { cx: 639, cy: 805 },

    { cx: 414, cy: 905 },
    { cx: 564, cy: 905 },
    { cx: 714, cy: 905 },
  ],
];

/** Horizontal viewbox size of the hand */
const horSize = 1024;
/** Vertical viewbox size of the hand */
const verSize = 1024;

/** Hand as Svg string. Fill needs to be set on the hand class to select color.
 */

const handPathSvgString =
  '<path class="hand" d="M870.4 204.8c-18.6368 0-36.1472 5.0176-51.2 13.7728V153.6a102.5024 102.5024 0 0 0-159.3856-85.0432C645.7856 28.672 607.7952 0 563.2 0S480.5632 28.672 466.5856 68.5568A102.5024 102.5024 0 0 0 307.2 153.6v377.4976L238.2848 411.648a99.6864 99.6864 0 0 0-61.3888-48.7936 95.5392 95.5392 0 0 0-74.8544 10.3424c-46.4384 27.8528-64.1536 90.8288-39.424 140.3904 1.536 3.1232 34.2016 70.0416 136.192 273.92 48.0256 96 100.7104 164.6592 156.6208 203.9808 43.8784 30.8736 74.1888 32.4608 79.8208 32.4608h256c43.5712 0 84.0704-14.1824 120.4224-42.0864 34.1504-26.2656 63.7952-64.256 88.064-112.8448 47.8208-95.6416 73.1136-227.9424 73.1136-382.6688v-179.2c0-56.4736-45.9264-102.4-102.4-102.4z m51.2 281.6c0 146.7904-23.3984 271.1552-67.6864 359.7312C825.0368 903.8848 773.3248 972.8 691.2 972.8H435.712c-1.9968-0.1536-23.552-2.56-56.064-26.88-32.4096-24.2688-82.176-75.3664-135.0656-181.248-103.7824-207.5648-135.68-272.9472-135.9872-273.5616l-0.1024-0.2048c-12.8512-25.7536-3.7376-59.4944 19.9168-73.6768a44.8512 44.8512 0 0 1 35.072-4.864 48.9472 48.9472 0 0 1 30.0544 24.1664l0.3072 0.512 79.9232 138.496c16.3328 29.8496 34.7136 42.3936 54.6304 37.3248 19.968-5.0688 30.0544-25.0368 30.0544-59.2384V153.6c0-28.2112 22.9888-51.2 51.2-51.2s51.2 22.9888 51.2 51.2v332.8a25.6 25.6 0 0 0 51.2 0V102.4c0-28.2112 22.9888-51.2 51.2-51.2s51.2 22.9888 51.2 51.2v384a25.6 25.6 0 0 0 51.2 0V153.6c0-28.2112 22.9888-51.2 51.2-51.2s51.2 22.9888 51.2 51.2v384a25.6 25.6 0 0 0 51.2 0V307.2c0-28.2112 22.9888-51.2 51.2-51.2s51.2 22.9888 51.2 51.2v179.2z" />' +
  '<path class="innerhand" d="M870.4 204.8m51.2 281.6c0 146.7904-23.3984 271.1552-67.6864 359.7312C825.0368 903.8848 773.3248 972.8 691.2 972.8H435.712c-1.9968-0.1536-23.552-2.56-56.064-26.88-32.4096-24.2688-82.176-75.3664-135.0656-181.248-103.7824-207.5648-135.68-272.9472-135.9872-273.5616l-0.1024-0.2048c-12.8512-25.7536-3.7376-59.4944 19.9168-73.6768a44.8512 44.8512 0 0 1 35.072-4.864 48.9472 48.9472 0 0 1 30.0544 24.1664l0.3072 0.512 79.9232 138.496c16.3328 29.8496 34.7136 42.3936 54.6304 37.3248 19.968-5.0688 30.0544-25.0368 30.0544-59.2384V153.6c0-28.2112 22.9888-51.2 51.2-51.2s51.2 22.9888 51.2 51.2v332.8a25.6 25.6 0 0 0 51.2 0V102.4c0-28.2112 22.9888-51.2 51.2-51.2s51.2 22.9888 51.2 51.2v384a25.6 25.6 0 0 0 51.2 0V153.6c0-28.2112 22.9888-51.2 51.2-51.2s51.2 22.9888 51.2 51.2v384a25.6 25.6 0 0 0 51.2 0V307.2c0-28.2112 22.9888-51.2 51.2-51.2s51.2 22.9888 51.2 51.2v179.2z" />';
/** Get the correct dots as an SVG string.
 *
 * @param numberDots - number of dots to show
 */
function getDotsAsSvgString(numberDots: PossibleNumberDots) {
  let circles = '';
  for (let i = 0; i < 10; i++) {
    if (numberDotMapping[numberDots][i]) {
      circles = `${circles} <circle class="dot" cx="${dotLocations[i].cx}" cy="${dotLocations[i].cy}" r="50"/>`;
    }
  }
  return circles;
}

/** Get the correct dots in Montessori style as an SVG string
 *
 * @param numberDots - number of dots to show
 */
function getDotsMontessoriAsSvgString(numberDots: PossibleNumberDots) {
  let circles = '';
  for (const dot of dotsMontessori[numberDots]) {
    circles = `${circles} <circle class="dot" cx="${dot.cx}" cy="${dot.cy}" r="50"/>`;
  }
  return circles;
}

/** Get the hand as an SVG string with given colors and number of dots.
 *
 * @param handColor - the color of the hand
 * @param dotColor - the color of the dots
 * @param numberDots - the number of dots to show
 */
export function getHandAsSvgString(
  handColor: string,
  dotColor: string,
  numberDots: PossibleNumberDots,
): string {
  const style = `
    <style>
      .hand {
        fill: ${handColor};
      }
      .dot {
        fill: ${dotColor};
      }
    </style>
  `;

  return (
    `<svg version="1.1" viewBox="0 0 ${horSize} ${verSize}" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">` +
    `${style} ${handPathSvgString} ${getDotsAsSvgString(numberDots)} </svg>`
  );
}

/** Get the hand as an URL-encoded SVG string with given colors and number of dots.
 *
 * @param handColor - the color of the hand
 * @param dotColor - the color of the dots
 * @param numberDots - the number of dots to show
 */
export function getHandAsSvgUrl(
  handColor: string,
  dotColor: string,
  numberDots: PossibleNumberDots,
): string {
  return encodeURIComponent(
    getHandAsSvgString(handColor, dotColor, numberDots),
  );
}

/** Hand with dots
 *
 * @cssproperty hand-color - Color for the hand
 * @cssproperty dot-color - Color for the dots
 *
 * @attribute numberDots - number of dots in the hand
 */
@customElement('hand-with-dots')
export class HandWithDots extends LitElement {
  /** Number of dots to show */
  @property({ type: Number, converter: numberToPossibleNumberDots })
  accessor numberDots: PossibleNumberDots = 5;

  static get styles(): CSSResultGroup {
    return css`
      :host {
        display: block;
      }
      svg {
        height: 100%;
        width: 100%;
        max-height: 100%;
        max-width: 100%;
      }
      .hand {
        fill: var(--hand-stroke-color, black);
      }
      .innerhand {
        fill: var(--hand-fill-color, transparent);
      }
      .dot {
        fill: var(--dot-color, black);
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
    return html`<svg
      version="1.1"
      viewBox="0 0 ${horSize} ${verSize}"
      xml:space="preserve"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
    >
      ${unsafeSVG(handPathSvgString)}
      ${unsafeSVG(getDotsMontessoriAsSvgString(this.numberDots))}
    </svg>`;
  }
}
