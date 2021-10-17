import {
  LitElement,
  html,
  css,
  svg,
  SVGTemplateResult,
  TemplateResult,
  CSSResultGroup,
  PropertyDeclarations,
} from 'lit';

export type TickMarkType = 1 | 5 | 10;

export class NumberLine extends LitElement {
  show1TickMarks: boolean;
  show5TickMarks: boolean;
  show10TickMarks: boolean;
  showAll10Numbers: boolean;
  minimum: number;
  maximum: number;
  margin: number;
  yPosLine: number;

  static get properties(): PropertyDeclarations {
    return {
      show10TickMarks: { type: Boolean },
      show5TickMarks: { type: Boolean },
      show1TickMarks: { type: Boolean },
      showAll10Numbers: { type: Boolean },
      minimum: { type: Number },
      maximum: { type: Number },
    };
  }

  static get styles(): CSSResultGroup {
    return css``;
  }

  constructor() {
    super();
    this.show1TickMarks = false;
    this.show5TickMarks = false;
    this.show10TickMarks = false;
    this.showAll10Numbers = false;

    this.minimum = 0;
    this.maximum = 100;

    this.margin = 15;
    this.yPosLine = 8;
  }

  get viewBoxWidth(): number {
    return 1000 + 2 * this.margin;
  }

  /** Convert a position from numberline units to viewport units
   * @param position - position in numberline units to convert into position in viewport units, has to be between the lowest and the highest number set in the properties.
   * @return - position in viewport units.
   *
   */
  translatePosition(position: number): number {
    // We divide the 1000 pixels by the the range between highest and lowest number to get the number of pixels per unit
    return (
      (1000 / (this.maximum - this.minimum)) * (position - this.minimum) +
      this.margin
    );
  }

  /** Convert a distance from numerline units into viewport units
   * @param distance - distance in numberLine units to convert into unitswport units
   * @return - distance in viewport units
   */
  numberDistanceToViewportDistance(distance: number): number {
    // We divide the 1000 pixels by the the range between highest and lowest number to get the number of pixels per unit
    return (1000 / (this.maximum - this.minimum)) * distance;
  }

  /** Render tickmark on the number line
   * @param type - type of tickMark, can be 1, 5  or 10.
   * @param position - position along the y-axis for the tickmark
   *
   */
  renderTickMark(position: number, type: TickMarkType = 10): SVGTemplateResult {
    const tickMarkInfo = {
      1: { y1: this.yPosLine - 2, y2: this.yPosLine + 2, strokeWidth: 1 },
      5: { y1: this.yPosLine - 5, y2: this.yPosLine + 5, strokeWidth: 1 },
      10: { y1: this.yPosLine - 8, y2: this.yPosLine + 8, strokeWidth: 2 },
    };
    return svg`
        <line 
          x1 = "${position}"
          y1 = "${tickMarkInfo[type].y1}"
          x2 = "${position}"
          y2 = "${tickMarkInfo[type].y2}"
          style="stroke:rgb(0, 26, 255);stroke-width: ${tickMarkInfo[type].strokeWidth}" 
        />`;
  }

  /** Render all multiple of 10 tickmarks
   */
  render10TickMarks(): SVGTemplateResult {
    const positions = [];
    const numberTickMarks = (this.maximum - this.minimum) / 10 + 1;
    for (let i = 0; i < numberTickMarks; i++) {
      positions.push(
        this.translatePosition(this.minimum) +
          i * this.numberDistanceToViewportDistance(10)
      );
    }
    return svg`
        ${positions.map(pos => this.renderTickMark(pos, 10))}
      `;
  }

  /** Render all multiple of 5 tickmarks
   */
  render5TickMarks(): SVGTemplateResult {
    const positions = [];
    for (
      let i = this.translatePosition(this.minimum + 5);
      i < this.translatePosition(this.maximum);
      i += this.numberDistanceToViewportDistance(10)
    ) {
      positions.push(i);
    }
    return svg`
        ${positions.map(pos => this.renderTickMark(pos, 5))}
      `;
  }

  /** Render all single tickmarks
   */
  render1TickMarks(): SVGTemplateResult {
    const positions = [];
    for (
      let i = this.translatePosition(this.minimum + 1);
      i < this.translatePosition(this.maximum);
      i += this.numberDistanceToViewportDistance(1)
    ) {
      positions.push(i);
    }
    return svg`
        ${positions.map(pos => this.renderTickMark(pos, 1))}
      `;
  }

  /** Render the number line itself
   * @return {svg} template for the number line.
   */
  renderNumberLine(): SVGTemplateResult {
    return svg`
        <line
          x1="${this.translatePosition(this.minimum)}"
          y1="${this.yPosLine}"
          x2="${this.translatePosition(this.maximum)}"
          y2="${this.yPosLine}"
          style="stroke:rgb(0, 26, 255);stroke-width: 2"
        />`;
  }

  /** Render the numbers below the number line.
   * @return {svg} template for the numbers below the number line.
   */
  renderNumbers(): SVGTemplateResult {
    const numbers = [];
    if (this.showAll10Numbers) {
      const numberNumbers = (this.maximum - this.minimum) / 10 + 1;
      for (let i = 0; i < numberNumbers; i++) {
        numbers.push(this.minimum + i * 10);
      }
    } else {
      numbers.push(this.minimum, this.maximum);
    }

    return svg`
        ${numbers.map(number => this.renderNumber(number))}
      `;
  }

  renderNumber(number: number): SVGTemplateResult {
    return svg`
        <text x="${this.translatePosition(number)}" y="${
      this.yPosLine + 10
    }" dominant-baseline="hanging" text-anchor="middle">${number}</text>
      `;
  }

  render(): TemplateResult {
    return html` <div>
      <svg width="100%" viewBox="0 0 ${this.viewBoxWidth} 35">
        ${this.renderNumberLine()} ${this.renderNumbers()}
        ${this.show10TickMarks ? this.render10TickMarks() : ''}
        ${this.show5TickMarks ? this.render5TickMarks() : ''}
        ${this.show1TickMarks ? this.render1TickMarks() : ''}
      </svg>
    </div>`;
  }
}

customElements.define('number-line', NumberLine);
