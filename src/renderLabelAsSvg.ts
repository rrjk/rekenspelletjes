import { html } from 'lit';
import type { HTMLTemplateResult } from 'lit';

/** Render a text a SVG
 * By rendering it as SVG it will automatically scale along with the size of the bounding box
 * The text will be centered in the middle of the bounding box, both horizontally and vertically
 * @param label - Label to render
 * @param aspectRatio - Aspect ratio of the bounding box, used to determined the viewBox size
 */
export function renderLabelAsSvg(
  label: string,
  aspectRatio = 1,
  /** Fontsize as percentage of height */
  fontsize = 50
): HTMLTemplateResult {
  return html`
    <svg
      viewBox="0 0 ${100 * aspectRatio} 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <text
        style="font-size: ${fontsize}px"
        x="50%"
        y="50%"
        dominant-baseline="central"
        text-anchor="middle"
      >
        ${label}
      </text>
    </svg>
  `;
}
