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
import { numberDigitsInNumber } from './NumberHelperFunctions';

import {
  addResizeObserverClient,
  removeResizeObserverClient,
  ResizeObserverClientInterface,
} from './ResizeObserver';

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

type AboveBelowType = 'above' | 'below';

/** Customer element to create numberline
 * Possible numberlines range from -100 to 100
 * Numberlines have to start and end at a multiple of 10
 *
 * @property tickMarks - what tickmarks to show
 * @property numberBoxes - Numberboxes to show below the numberline. If left out, no vertical space is
 *  allocated for numberBoxes, if it's set to an empty list, vertical space is allocated for the numberBoxes,
 *  such that they can be added later.
 * @property fixedNumbers - Fixed numbers to show below the numberline. If left out, no vertical space is
 *  allocated for fixed numbers, if it's set to an empty list, vertical space is allocated for the fixed numbers,
 *  such that they can be added later.
 */

@customElement('number-line-v2')
export class NumberLineV2
  extends LitElement
  implements ResizeObserverClientInterface
{
  static numberBoxSvgWidthMinusSign = 6;
  static numberBoxSvgWidthDigit = 11;
  static numberBoxSvgWidthOverhead = 2;
  static numberBoxHeight = 20;
  static minSvgYTickmarks = -20;
  static maxSvgYTickmarks = +20;

  @property({ type: String })
  accessor tickMarks: TickMarks = 'boundaryOnly';
  @property({ type: Number })
  accessor min = 0;
  @property({ type: Number })
  accessor max = 100;
  @property({ attribute: false })
  accessor aboveArches: ArchType[] | null = null;
  @property({ attribute: false })
  accessor belowArches: ArchType[] | null = null;
  @property({ attribute: false })
  accessor numberBoxes: NumberBoxInfo[] | null = null;
  @property({ type: Number })
  accessor maxNumberBoxDepth = 2;

  @state()
  private accessor sortedNumberBoxesPerLevel: NumberBoxInfo[][] = [[]];
  @property({ attribute: false })
  accessor fixedNumbers: number[] | null = null;
  @state()
  private accessor processedFixedNumbers: number[] = [];
  @state()
  accessor aspectRatio = 20;

  @state()
  private accessor roundedMin = 0;
  @state()
  private accessor roundedMax = 100;
  @state()
  private accessor boxWidth =
    2 * NumberLineV2.numberBoxSvgWidthDigit +
      NumberLineV2.numberBoxSvgWidthOverhead;

  maxNumberDigits: number = 0;
  minusSignPossible: boolean = false;

  static get styles(): CSSResultGroup {
    return css`
      :host {
        display: flex;
        align-items: center;
        justify-items: center;
      }

      svg {
        width: 100%;
        height: 100%;
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

      .aboveArchNumber,
      .belowArchNumber {
        text-anchor: middle;
        font-size: 15px;
        fill: blue;
      }

      .aboveArchNumber {
        dominant-baseline: auto;
      }

      .belowArchNumber {
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

  handleResize() {
    const clientAspectRatio = this.clientWidth / this.clientHeight;
    this.aspectRatio = Math.max(3, clientAspectRatio);
  }

  connectedCallback(): void {
    super.connectedCallback();
    addResizeObserverClient(this);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    removeResizeObserverClient(this);
  }

  protected willUpdate(changedProperties: PropertyValues): void {
    if (changedProperties.has('min') || changedProperties.has('max')) {
      if (changedProperties.has('min')) {
        this.roundedMin = Math.floor(this.min / 10) * 10;
      }
      if (changedProperties.has('max')) {
        this.roundedMax = Math.ceil(this.max / 10) * 10;
      }
      if (this.roundedMin > this.roundedMax) {
        throw new Error(
          `minimum for numberline (${this.roundedMin}) is larger than the maximum (${this.roundedMax})`,
        );
      }
      this.maxNumberDigits = Math.max(
        numberDigitsInNumber(this.roundedMin + 1),
        numberDigitsInNumber(this.roundedMax - 1),
      );
      this.minusSignPossible = false;
      if (this.roundedMin < 0 || this.roundedMax < 0)
        this.minusSignPossible = true;

      this.boxWidth =
        this.maxNumberDigits * NumberLineV2.numberBoxSvgWidthDigit +
        NumberLineV2.numberBoxSvgWidthOverhead +
        (this.minusSignPossible ? NumberLineV2.numberBoxSvgWidthMinusSign : 0);
    }
    if (
      changedProperties.has('numberBoxes') ||
      changedProperties.has('fixedNumber')
    ) {
      if (this.fixedNumbers === null) this.processedFixedNumbers = [];
      else this.processedFixedNumbers = this.fixedNumbers;
      this.sortAndProcessNumberBoxes();
    }
  }

  sortAndProcessNumberBoxes() {
    /* We need to sort the numberBoxes to ensure that comparing with just the last 
       numberbox in a level is sufficient to check whether the level can be used
     */
    let sortedNumberBoxes: NumberBoxInfo[] = [];
    if (this.numberBoxes !== null) {
      sortedNumberBoxes = this.numberBoxes.sort(
        (a: NumberBoxInfo, b: NumberBoxInfo) => a.position - b.position,
      );
    }

    for (const nb of sortedNumberBoxes) {
      if (nb.position < this.roundedMin || nb.position > this.roundedMax) {
        throw new Error(
          `Position ${nb.position} is outside numberline range, reset to ${this.roundedMin}`,
        );
      }
      if (
        nb.nmbr &&
        (numberDigitsInNumber(nb.nmbr) > this.maxNumberDigits ||
          (!this.minusSignPossible && nb.nmbr < 0))
      ) {
        throw new Error(
          `${nb.nmbr} doesn't fit in numberbox, reset to position (${nb.position})`,
        );
      }
    }

    this.sortedNumberBoxesPerLevel = [[]];

    for (const nb of sortedNumberBoxes) {
      // First determine minimal distance to a fixed number
      let possDiffToFixed = 1000;
      for (const fixedNumber of this.processedFixedNumbers) {
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

  /** Get processed below arches. Will return the below arches when they are not null,
   * return an empty list otherwise
   */
  get processedBelowArches(): ArchType[] {
    if (this.belowArches === null) return [];
    return this.belowArches;
  }

  /** Get processed above  arches. Will return the above arches when they are not null,
   * return an empty list otherwise
   */
  get processedAboveArches(): ArchType[] {
    if (this.aboveArches === null) return [];
    return this.aboveArches;
  }

  /** Determine the numberline width in SVG units
   *  This is based on the provided aspect ratio
   */
  get basicNumberlineWidth(): number {
    return this.aspectRatio * this.svgHeight;
  }

  /** Determine the gap on the left side of the numberline in SVG units
   *  This is based on the provided aspect ratio
   */
  get leftGap(): number {
    const digitsInLeftNumber = numberDigitsInNumber(this.min);
    let ret =
      2 + 0.5 * digitsInLeftNumber * NumberLineV2.numberBoxSvgWidthDigit;
    if (this.min < 0) ret += NumberLineV2.numberBoxSvgWidthMinusSign;
    return ret;
  }

  /** Determine the gap on the left side of the numberline in SVG units
   *  This is based on the provided aspect ratio
   */
  get rightGap(): number {
    const digitsInRightNumber = numberDigitsInNumber(this.max);
    let ret =
      2 + 0.5 * digitsInRightNumber * NumberLineV2.numberBoxSvgWidthDigit;
    if (this.max < 0) ret += NumberLineV2.numberBoxSvgWidthMinusSign;

    return ret;
  }

  get svgWidth() {
    return this.basicNumberlineWidth + this.leftGap + this.rightGap;
  }

  /** Determine minimum y-value in SVG units
   *
   */
  get minSvgY() {
    if (this.aboveArches !== null) return -50;
    return NumberLineV2.minSvgYTickmarks;
  }

  /** Determine maximum y-value in SVG units */
  get maxSvgY() {
    if (this.numberBoxes !== null)
      return (
        this.getNumberNumberBoxTop(this.maxNumberBoxDepth) +
        NumberLineV2.numberBoxHeight +
        5
      );
    if (this.belowArches !== null) return 50;
    if (this.fixedNumbers !== null) return 40;
    return NumberLineV2.maxSvgYTickmarks;
  }

  get svgHeight() {
    return this.maxSvgY - this.minSvgY;
  }
  /** Transform a number into a position in the svg axis.
   * @param nmbr - number to convert
   * @returns - position in svg axis
   */
  numberToPosition(nmbr: number) {
    if (nmbr < this.roundedMin || nmbr > this.roundedMax) {
      throw new Error(
        `A number (${nmbr}) outside the numberline range is asked to be translated into a position`,
      );
    }
    const numberLineLength = this.roundedMax - this.roundedMin;
    const deltaMinNmbr = nmbr - this.roundedMin;
    return (deltaMinNmbr / numberLineLength) * this.basicNumberlineWidth;
  }

  numberDiffToPositionDiff(nmbrDiff: number) {
    const numberLineLength = this.roundedMax - this.roundedMin;
    return (nmbrDiff / numberLineLength) * this.basicNumberlineWidth;
  }

  renderNumberLine(): SVGTemplateResult {
    return svg`
      <line x1="0" y1="0" x2="${this.basicNumberlineWidth}" y2="0" stroke="black" stroke-width="3"/>
    `;
  }

  renderNumbers(): SVGTemplateResult[] {
    const ret: SVGTemplateResult[] = [];
    for (const fixedNumber of this.processedFixedNumbers) {
      ret.push(
        svg`<text x="${this.numberToPosition(fixedNumber)}" y="17" class="number">${fixedNumber}</text>`,
      );
    }
    return ret;
  }
  renderBoundaryTickMarks(): SVGTemplateResult {
    return svg`
      <line x1="0" x2="0" y1="-15" y2="15" stroke="black" stroke-width="2"/>
      <line x1="${this.basicNumberlineWidth}" x2="${this.basicNumberlineWidth}" y1="-15" y2="15" stroke="black" stroke-width="2"/>
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

  renderArch(
    from: number,
    to: number,
    position: AboveBelowType,
  ): SVGTemplateResult {
    const distance = to - from;
    let distanceLabel = '';
    if (distance > 0) distanceLabel = `+${distance}`;
    else distanceLabel = `${distance}`;

    const midYPosition = position === 'above' ? -60 : 60;
    const textYPosition = position === 'above' ? -33 : 33;
    const textClass =
      position === 'above' ? 'aboveArchNumber' : 'belowArchNumber';

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
    for (const a of this.processedAboveArches) {
      ret.push(this.renderArch(a.from, a.to, 'above'));
    }
    for (const a of this.processedBelowArches) {
      ret.push(this.renderArch(a.from, a.to, 'below'));
    }
    return ret;
  }

  getNumberNumberBoxTop(depth: number) {
    const basicDepth = this.belowArches !== null ? 45 : 18; // 45 suffices for arches below the number line, otherwise 18 suffices
    const additionDepths = 22;
    return basicDepth + depth * additionDepths;
  }

  renderNumberBox(nb: NumberBoxInfo, depth: number): SVGTemplateResult {
    const numberBaselineOffset = 8;

    let cappedDepth = depth;

    if (depth > this.maxNumberBoxDepth) {
      console.warn(
        `Numberbox depth (${depth}) capped to max depth (${this.maxNumberBoxDepth})`,
      );
      cappedDepth = this.maxNumberBoxDepth;
    }

    let classes = '';

    if (nb.active === 'active') classes = 'boxActive';
    else if (nb.active === 'wrong') classes = 'boxWrong';
    else classes = 'boxNotActive';

    return svg`
      <line x1="${this.numberToPosition(nb.position)}" 
            x2="${this.numberToPosition(nb.position)}" 
            y1="0" 
            y2="${this.getNumberNumberBoxTop(cappedDepth)}" 
            stroke="red"/>
      <rect x="${this.numberToPosition(nb.position) - this.boxWidth / 2}" 
            y="${this.getNumberNumberBoxTop(cappedDepth)}" 
            width="${this.boxWidth}" 
            height="${NumberLineV2.numberBoxHeight}" 
            class="${classes}"/>
      <text x="${this.numberToPosition(nb.position)}" 
            y="${this.getNumberNumberBoxTop(cappedDepth) + numberBaselineOffset}" 
            class="boxNumberText">
        ${nb.nmbr}
      </text>`;
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
      <style>
        svg {
          aspect-ratio: ${this.svgWidth / this.svgHeight};
        }
      </style>
      <svg
        viewBox="-${this.leftGap} ${this.minSvgY} ${this.svgWidth} ${this
          .svgHeight} "
        xmlns="http://www.w3.org/2000/svg"
      >
        ${this.renderNumberLine()} ${this.renderTickMarks()}
        ${this.renderNumberBoxes()} ${this.renderArches()}
        ${this.renderNumbers()}
      </svg>
    `;
  }
}
