import { html, HTMLTemplateResult } from 'lit';
import { ClassInfo } from 'lit/directives/class-map.js';
import { TimeCode } from './TimeCodes';

/** Helper function to render the addition/subtraction within decade game hourglass game icon
 * @param variant The variant of the game to use for the icon
 * @param classes Optional classes to add to the icon
 * @param timeCode The time code to use for the icon (optional in case no hourglass is needed)
 * @returns The HTML template result for the icon
 */
export type RenderGameIconFunction = (
  variant: string,
  classes: ClassInfo,
  timeCode?: TimeCode,
) => HTMLTemplateResult;

export const renderNotImplemented: RenderGameIconFunction = (
  variant,
  classes,
) => {
  return html`<div class=${classes}>Not Implemented</div>`;
};
