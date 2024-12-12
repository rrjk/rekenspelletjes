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
import { customElement, property, state } from 'lit/decorators.js';

import { Bezier } from 'bezier-js';

export type ShowHide = 'show' | 'hide';
export type ActiveEnum = 'active' | 'wrong' | 'notActive';
export interface ArchType {
  from: number;
  to: number;
}

/** Type for the number box.
 *
 * Information to create the numberboxes.
 *
 * @field position - position for the numberbox
 * @field nmbr - number to show in the numberbox, if not present no number is shown
 * @field active -  whether the numberbox should be styles as active, wrong or normal, if not present notActive is assumed
 */
export interface NumberBoxInfo {
  position: number;
  nmbr?: number;
  active?: ActiveEnum;
}

export type TickMarks =
  | 'noTickMarks'
  | 'boundaryOnly'
  | 'upToTens'
  | 'upToFives'
  | 'upToSingles';

/** Customer element to create numberline
 * Possible numberlines range from -100 to 100
 * Numberlines have to start and end at a multiple of 10
 *
 * @property tickMarks - what tickmarks to show
 */

@customElement('number-line-v2')
export class NumberLineV2 extends LitElement {
  static numberBoxSvgWidthMinusSign = 6;
  static numberBoxSvgWidthDigit = 11;
  static numberBoxSvgWidthOverhead = 2;

  @property({ type: String })
  accessor tickMarks: TickMarks = 'boundaryOnly';
  @property({ type: Number })
  accessor min = 0;
  @property({ type: Number })
  accessor max = 100;
  @property({ attribute: false })
  accessor arches: ArchType[] = [];
  @property({ attribute: false })
  accessor numberBoxes: NumberBoxInfo[] = [];
  @property({ attribute: false })
  accessor fixedNumbers: number[] = [];

  @state()
  private accessor sortedNumberBoxesPerLevel: NumberBoxInfo[][] = [[]];
  @state()
  private accessor minusArches = false;

  @state()
  private accessor roundedMin = 0;
  @state()
  private accessor roundedMax = 100;
  @state()
  private accessor boxWidth =
    2 * NumberLineV2.numberBoxSvgWidthDigit +
      NumberLineV2.numberBoxSvgWidthOverhead;

  static get styles(): CSSResultGroup {
    return css`
      :host {
        display: flex;
        align-items: center;
        justify-items: center;
      }

      svg {
        width: 100%;
        aspect-ratio: 5;
      }

      .number {
        text-anchor: middle;
        dominant-baseline: hanging;
        font-size: 20px;
      }

      .boxNumberText {
        text-anchor: middle;
        dominant-baseline: mathematical;
        font-size: 20px;
        fill: black;
      }

      .boxActive,
      .boxWrong,
      .boxNotActive {
        stroke: purple;
      }

      .boxActive {
        fill: lightblue;
      }

      .boxWrong {
        fill: red;
      }

      .boxNotActive {
        fill: white;
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
    if (changedProperties.has('min') || changedProperties.has('max')) {
      if (changedProperties.has('min')) {
        this.roundedMin = Math.floor(this.min / 10) * 10;
      }
      if (changedProperties.has('max')) {
        this.roundedMax = Math.ceil(this.max / 10) * 10;
      }
      const maxNumberDigits = Math.ceil(
        Math.max(
          Math.log10(Math.abs(this.roundedMin + 1)),
          Math.log10(Math.abs(this.roundedMax - 1)),
        ),
      );
      let minusSignPossible = false;
      if (this.roundedMin < 0 || this.roundedMax < 0) minusSignPossible = true;

      this.boxWidth =
        maxNumberDigits * NumberLineV2.numberBoxSvgWidthDigit +
        NumberLineV2.numberBoxSvgWidthOverhead +
        (minusSignPossible ? NumberLineV2.numberBoxSvgWidthMinusSign : 0);
    }
    if (
      changedProperties.has('numberBoxes') ||
      changedProperties.has('fixedNumber')
    )
      this.sortAndProcessNumberBoxes();
    if (changedProperties.has('arches')) {
      this.checkForMinusArches();
    }
  }

  checkForMinusArches() {
    this.minusArches = false;
    for (const arch of this.arches) {
      if (arch.from > arch.to) this.minusArches = true;
    }
  }

  sortAndProcessNumberBoxes() {
    /* We need to sort the numberBoxes to ensure that comparing with just the last 
       numberbox in a level is sufficient to check whether the level can be used
     */
    const sortedNumberBoxes = this.numberBoxes.sort(
      (a: NumberBoxInfo, b: NumberBoxInfo) => a.position - b.position,
    );

    for (const nb of sortedNumberBoxes) {
      // First determine minimal distance to a fixed number
      let possDiffToFixed = 1000;
      for (const fixedNumber of this.fixedNumbers) {
        possDiffToFixed = Math.min(
          possDiffToFixed,
          this.numberDiffToPositionDiff(Math.abs(nb.position - fixedNumber)),
        );
      }
      const minDepth = possDiffToFixed < this.boxWidth ? 1 : 0;

      let depthFound = false;
      let depthToInvestigate = minDepth;
      while (!depthFound) {
        if (this.sortedNumberBoxesPerLevel.length < depthToInvestigate + 1)
          this.sortedNumberBoxesPerLevel.push([]);
        const levelLength =
          this.sortedNumberBoxesPerLevel[depthToInvestigate].length;
        if (
          levelLength === 0 ||
          this.numberDiffToPositionDiff(
            nb.position -
              this.sortedNumberBoxesPerLevel[depthToInvestigate][
                levelLength - 1
              ].position,
          ) > this.boxWidth
        ) {
          depthFound = true;
          this.sortedNumberBoxesPerLevel[depthToInvestigate].push(nb);
        } else {
          depthToInvestigate += 1;
        }
      }
    }
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

  numberDiffToPositionDiff(nmbrDiff: number) {
    const numberLineLength = this.roundedMax - this.roundedMin;
    return (nmbrDiff / numberLineLength) * 1000;
  }

  renderNumberLine(): SVGTemplateResult {
    return svg`
      <line x1="0" y1="0" x2="1000" y2="0" stroke="black" stroke-width="3"/>
    `;
  }

  renderNumbers(): SVGTemplateResult[] {
    const ret: SVGTemplateResult[] = [];
    for (const fixedNumber of this.fixedNumbers) {
      ret.push(
        svg`<text x="${this.numberToPosition(fixedNumber)}" y="17" class="number">${fixedNumber}</text>`,
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

  renderTickMarks(): SVGTemplateResult[] {
    const ret: SVGTemplateResult[] = [];
    const boundaryTickMarks: TickMarks[] = [
      'boundaryOnly',
      'upToTens',
      'upToFives',
      'upToSingles',
    ];
    const tenTickMarks: TickMarks[] = ['upToTens', 'upToFives', 'upToSingles'];
    const fiveTickMarks: TickMarks[] = ['upToFives', 'upToSingles'];
    const singleTickMarks: TickMarks[] = ['upToSingles'];
    if (boundaryTickMarks.includes(this.tickMarks))
      ret.push(this.renderBoundaryTickMarks());
    if (tenTickMarks.includes(this.tickMarks))
      ret.push(...this.render10TickMarks());
    if (fiveTickMarks.includes(this.tickMarks))
      ret.push(...this.render5TickMarks());
    if (singleTickMarks.includes(this.tickMarks))
      ret.push(...this.render1TickMarks());
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

  renderNumberBox(nb: NumberBoxInfo, depth: number): SVGTemplateResult {
    const basicDepth = this.minusArches ? 45 : 18; // 45 suffices for arches below the number line, otherwise 18 suffices

    const additionDepths = 22;
    const boxHeight = 20;
    const numberBaselineOffset = 8;
    const lineLength = basicDepth + depth * additionDepths;

    console.log(`active = ${nb.active}`);

    let classes = '';

    if (nb.active === 'active') classes = 'boxActive';
    else if (nb.active === 'wrong') classes = 'boxWrong';
    else classes = 'boxNotActive';

    return svg`
      <line x1="${this.numberToPosition(nb.position)}" x2="${this.numberToPosition(nb.position)}" y1="0" y2="${lineLength}" stroke="red"/>
      <rect x="${this.numberToPosition(nb.position) - this.boxWidth / 2}" y="${lineLength}" width="${this.boxWidth}" height="${boxHeight}" class="${classes}"/>
      <text x="${this.numberToPosition(nb.position)}" y="${lineLength + numberBaselineOffset}" class="boxNumberText">${nb.nmbr}</text>`;
  }

  renderNumberBoxes(): SVGTemplateResult[] {
    const ret: SVGTemplateResult[] = [];

    // Per level we will render the number boxes
    // We start with the deepest level, to ensure that the less deper levels are rendered on top
    for (
      let level = this.sortedNumberBoxesPerLevel.length - 1;
      level >= 0;
      level--
    ) {
      for (const nb of this.sortedNumberBoxesPerLevel[level]) {
        ret.push(this.renderNumberBox(nb, level));
      }
    }
    return ret;
  }

  render(): HTMLTemplateResult {
    return html`
      <svg viewBox="-25 -50 1050 200" xmlns="http://www.w3.org/2000/svg">
        ${this.renderNumberLine()} ${this.renderTickMarks()}
        ${this.renderNumberBoxes()} ${this.renderArches()}
        ${this.renderNumbers()}
      </svg>
    `;
  }
}
