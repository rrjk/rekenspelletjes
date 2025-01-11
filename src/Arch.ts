// Usefull web app about visualizing an svg path
// https://svg-path-visualizer.netlify.app/
// SVG editor
// https://boxy-svg.com/

import { LitElement, html, css, svg } from 'lit';
import type {
  HTMLTemplateResult,
  CSSResultGroup,
  SVGTemplateResult,
} from 'lit';

// eslint-disable-next-line import/extensions
import { customElement, property } from 'lit/decorators.js';

import { Bezier } from 'bezier-js';

export type AboveBelowType = 'above' | 'below';

@customElement('number-line-arch')
export class NumberLineArch extends LitElement {
  static svgLeft = -50;
  static svgTop = -35;
  static svgWidth = 100;
  static svgHeight = 70;

  @property({ type: Number })
  accessor width: number = 1;

  @property({ type: String })
  accessor position: AboveBelowType = 'above';

  static get styles(): CSSResultGroup {
    return css`
      svg {
        width: 100%;
        height: 100%;
      }

      .number {
        text-anchor: middle;
        font-size: 30px;
        fill: blue;
        dominant-baseline: mathematical;
      }

      .archStart,
      .archEnd {
        stroke: blue;
        stroke-width: 2px;
        fill: transparent;
      }

      .archStart {
        marker-end: url(#arrow);
      }
    `;
  }

  renderArch(distance: number, position: AboveBelowType): SVGTemplateResult {
    let distanceLabel = '';
    if (distance > 0) distanceLabel = `+${distance}`;
    else distanceLabel = `${distance}`;

    const midYPosition = position === 'above' ? -60 : 60;
    const textYPosition = position === 'above' ? 18 : -18;

    const from = -5 * distance;
    const to = 5 * distance;

    const curve = new Bezier(
      { x: from, y: 0 },
      { x: 0, y: midYPosition },
      { x: to, y: 0 },
    ).split(0.25);

    return svg`
      <path d="${curve.left.toSVG()}" class="archStart" /> 
      <path d="${curve.right.toSVG()}" class="archEnd" />
      <text x="0" y="${textYPosition}" class="number">${distanceLabel}</text>`;
  }

  renderArrowHeadDef() {
    return svg`
      <defs>
        <!-- A marker to be used as an arrowhead -->
        <marker
          id="arrow"
          viewBox="0 0 20 20"
          refX="20"
          refY="10"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
          stroke="context-stroke"
          stroke-width="2"
          fill="transparent"
        >
          <path d="M 0 0 L 20 10 L 0 20" />
        </marker>
      </defs>
    `;
  }

  render(): HTMLTemplateResult {
    return html`
      <svg
        viewBox="${NumberLineArch.svgLeft} ${NumberLineArch.svgTop} ${NumberLineArch.svgWidth} ${NumberLineArch.svgHeight}"
        xmlns="http://www.w3.org/2000/svg"
      >
        ${this.renderArrowHeadDef()}
        ${this.renderArch(this.width, this.position)}
      </svg>
    `;
  }
}
