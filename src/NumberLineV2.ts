// Usefull web app about visualizing an svg path
// https://svg-path-visualizer.netlify.app/
// SVG editor
// https://boxy-svg.com/

import { LitElement, html, css, svg } from 'lit';
import type {
  HTMLTemplateResult,
  CSSResultGroup,
  SVGTemplateResult,
  PropertyValues,
} from 'lit';

// eslint-disable-next-line import/extensions
import { customElement, property } from 'lit/decorators.js';

import { Bezier } from 'bezier-js';

export type TickMarkType = 1 | 5 | 10;
export type ShowHide = 'show' | 'hide';
export type ShowHideNumbers = 'showAll' | 'showFirstLast';
export type ArchType = { from: number; to: number };

@customElement('number-line-v2')
export class NumberLineV2 extends LitElement {
  @property({ type: String })
  accessor tickMarks1: ShowHide = 'hide';
  @property({ type: String })
  accessor tickMarks5: ShowHide = 'hide';
  @property({ type: String })
  accessor tickMarks10: ShowHide = 'show';
  @property({ type: String })
  accessor numbers: ShowHideNumbers = 'showFirstLast';
  @property({ type: Number })
  accessor min = 0;
  @property({ type: Number })
  accessor max = 100;
  @property({ attribute: false })
  accessor arches: ArchType[] = [];

  private roundedMin = 0;
  private roundedMax = 100;

  static get styles(): CSSResultGroup {
    return css`
      :host {
        display: flex;
        align-items: center;
        justify-items: center;
      }

      svg {
        width: 100%;
        aspect-ratio: 10;
      }

      .number {
        text-anchor: middle;
        dominant-baseline: hanging;
        font-size: 25px;
      }

      .additionNumber,
      .substractionNumber {
        text-anchor: middle;
        font-size: 15px;
        fill: blue;
      }

      .additionNumber {
        dominant-baseline: auto;
      }

      .substractionNumber {
        dominant-baseline: hanging;
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

  protected willUpdate(changedProperties: PropertyValues): void {
    if (changedProperties.has('min'))
      this.roundedMin = Math.floor(this.min / 10) * 10;
    if (changedProperties.has('max'))
      this.roundedMax = Math.ceil(this.max / 10) * 10;
  }

  /** Transform a number into a position in the svg axis.
   * @param nmbr - number to convert
   * @returns - position in svg axis
   */
  numberToPosition(nmbr: number) {
    const numberLineLength = this.roundedMax - this.roundedMin;
    const deltaMinNmbr = nmbr - this.roundedMin;
    return (deltaMinNmbr / numberLineLength) * 1000;
  }

  renderNumberLine(): SVGTemplateResult {
    return svg`
      <line x1="0" y1="0" x2="1000" y2="0" stroke="black" stroke-width="3"/>
    `;
  }

  renderBoundaryNumbers(): SVGTemplateResult {
    return svg`
      <text x="0" y="20" class="number">${this.min}</text>
      <text x="1000" y="20" class="number">${this.max}</text>
    `;
  }

  renderNonBoundaryNumbers(): SVGTemplateResult[] {
    if (this.numbers === 'showFirstLast') return [];
    const ret: SVGTemplateResult[] = [];
    for (let i = this.roundedMin + 10; i < this.max; i += 10) {
      ret.push(
        svg`<text x="${this.numberToPosition(i)}" y="20" class="number">${i}</text>`,
      );
    }
    return ret;
  }

  renderBoundaryTickMarks(): SVGTemplateResult {
    return svg`
      <line x1="0" x2="0" y1="-15" y2="15" stroke="black" stroke-width="2"/>
      <line x1="1000" x2="1000" y1="-15" y2="15" stroke="black" stroke-width="2"/>
    `;
  }

  render10TickMarks(): SVGTemplateResult[] {
    if (this.tickMarks10 === 'hide') return [];
    const ret: SVGTemplateResult[] = [];
    for (let i = this.roundedMin + 10; i < this.max; i += 10) {
      const pos = this.numberToPosition(i);
      ret.push(
        svg`<line x1="${pos}" x2="${pos}" y1="-15" y2="15" stroke="black" stroke-width="2"/>`,
      );
    }
    return ret;
  }

  render5TickMarks(): SVGTemplateResult[] {
    if (this.tickMarks5 === 'hide') return [];
    const ret: SVGTemplateResult[] = [];
    for (let i = this.roundedMin + 5; i < this.max; i += 10) {
      const pos = this.numberToPosition(i);
      ret.push(
        svg`<line x1="${pos}" x2="${pos}" y1="-10" y2="10" stroke="black" stroke-width="2"/>`,
      );
    }
    return ret;
  }

  render1TickMarks(): SVGTemplateResult[] {
    if (this.tickMarks5 === 'hide') return [];
    const ret: SVGTemplateResult[] = [];
    for (let i = this.roundedMin + 1; i < this.max; i += 1) {
      if (i % 5 !== 0) {
        const pos = this.numberToPosition(i);
        ret.push(
          svg`<line x1="${pos}" x2="${pos}" y1="-7" y2="7" stroke="black" stroke-width="1"/>`,
        );
      }
    }
    return ret;
  }

  renderArch(from: number, to: number): SVGTemplateResult {
    const distance = to - from;
    let distanceLabel = '';
    if (distance > 0) distanceLabel = `+${distance}`;
    else distanceLabel = `${distance}`;

    const midYPosition = distance > 0 ? -60 : 60;
    const textYPosition = distance > 0 ? -33 : 33;
    const textClass = distance > 0 ? 'additionNumber' : 'substractionNumber';

    const mid = (to + from) / 2;

    const curve = new Bezier(
      { x: this.numberToPosition(from), y: 0 },
      { x: this.numberToPosition(mid), y: midYPosition },
      { x: this.numberToPosition(to), y: 0 },
    ).split(0.25);

    return svg`
      <path d="${curve.left.toSVG()}" class="archStart" /> 
      <path d="${curve.right.toSVG()}" class="archEnd" />
      <text x="${this.numberToPosition(mid)}" y="${textYPosition}" class="${textClass}">${distanceLabel}</text>`;
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

  renderArches(): SVGTemplateResult[] {
    const ret: SVGTemplateResult[] = [this.renderArrowHeadDef()];
    for (const a of this.arches) {
      ret.push(this.renderArch(a.from, a.to));
    }
    return ret;
  }

  render(): HTMLTemplateResult {
    return html`
      <svg viewBox="-25 -50 1050 100" xmlns="http://www.w3.org/2000/svg">
        ${this.renderNumberLine()}${this.renderBoundaryNumbers()}
        ${this.renderBoundaryTickMarks()} ${this.renderNonBoundaryNumbers()}
        ${this.render10TickMarks()} ${this.render5TickMarks()}
        ${this.render1TickMarks()} ${this.renderArches()}
      </svg>
    `;
  }
}
