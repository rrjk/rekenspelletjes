// Usefull web app about visualizing an svg path
// https://svg-path-visualizer.netlify.app/

import { HTMLTemplateResult, html } from 'lit';
// eslint-disable-next-line import/extensions
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import { Color, colorArray } from './Colors';

/** Create Svg string for an heart
 * @param color: fill color for the heart, other colors are derived from the color.
 * @param text: text to show in the heart, max 4 characters. (Text will be centered in the heart).
 */
export function getHeartAsSvgString(color: Color, text: string): string {
  const colorInfo = colorArray.find(clr => clr.colorName === color);

  return (
    `<svg style="width: 100%; height: 100%;" version="1.1" viewBox="0 0 467 433" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">` +
    `<path style="fill:${colorInfo?.mainColorCode}; stroke:${colorInfo?.accentColorCode}; stroke-width: 10;" d="M125 5C58 5 5 59 5 125c0 135 136 170 228 303 88-132 229-173 229-303 0-66-54-120-120-120-48 0-90 28-109 69-19-41-60-69-108-69z"/>` +
    `<text x=234 y=217 font-size="200px" text-anchor="middle" fill="${colorInfo?.fontColor}" dominant-baseline="middle">${text}</text>` +
    `</svg>`
  );
}

/** Create url-encoded Svg string for an heart
 * @param color: fill color for the heart, other colors are derived from the color.
 * @param text: text to show in the heart, max 2 characters. (Text will be centered in the heart)
 */
export function getHeartAsSvgUrl(color: Color, text: string): string {
  return encodeURIComponent(getHeartAsSvgString(color, text));
}

/** Create heart as HTMLTemplateResult
 * @param color: fill color for the heart, other colors are derived from the color.
 * @param text: text to show in the heart, max 2 characters. (Text will be centered in the heart)
 */
export function getHeartasHTMLTemplateResult(
  color: Color,
  text: string
): HTMLTemplateResult {
  return html`${unsafeHTML(getHeartAsSvgString(`${color}`, `${text}`))}`;
}

// M140 20C73 20 20 74 20 140c0 135 136 170 228 303 88-132 229-173 229-303 0-66-54-120-120-120-48 0-90 28-109 69-19-41-60-69-108-69z
// m140 58 c30 -60, 110 -60, 130 0 s -110 150, -130 210 m 0 -210 c -30 -60, -110 -60, -130 0 s 110 150, 130 210
