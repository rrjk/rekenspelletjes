import { LitElement, html, css, unsafeCSS, SVGTemplateResult, svg } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, property, state } from 'lit/decorators.js';
import { FramedPhotoSVG, PhotoId } from './FramedPhotoSVG';

type TickMarkType = 'noTickMark' | 'tickMark1' | 'tickMark5' | 'tickMark10';

@customElement('hanging-photo-icon-with-text-overlay')
export class HangingPhotoIconWithTextOverlay extends LitElement {
  @property({ type: Number })
  numberLeft = 0;
  @property({ type: Number })
  numberMiddle = 10;
  @property({ type: Number })
  numberRight = 20;

  @property({ type: String })
  smallestTickmark: TickMarkType = 'noTickMark';
  @property({ type: Boolean })
  showNumberMiddle = false;
  @property({ type: Boolean })
  brokenLine = false;

  @property({ type: String })
  photoId: PhotoId = 'Frank';

  @state()
  framedPhoto = new FramedPhotoSVG();

  constructor() {
    super();
    this.framedPhoto.photoId = this.photoId;
    this.framedPhoto.photoSize = 35;
    this.framedPhoto.x = 51;
    this.framedPhoto.y = 30;
  }

  static get styles(): CSSResultGroup {
    return css`
      .container {
        display: grid;
        grid-template-columns: 40px 60px;
      }
      .numberline {
        display: inline-block;
        background-size: 55px 90px;
        width: 55px;
        height: 90px;
        background-color: transparent;
        border: none;
        outline: none;
        margin: 2px;
        padding: 0;
        color: black;
        font-size: 20px;
        line-height: 78px;
        text-align: center;
      }

      .numberlineNoTickMark {
        background-image: url('${unsafeCSS(
          new URL('../images/HangingPhotoNoTickMarks.png', import.meta.url)
        )}');
      }
      .numberlineTickMark1 {
        background-image: url('${unsafeCSS(
          new URL('../images/HangingPhoto1TickMarks.png', import.meta.url)
        )}');
      }
      .numberlineTickMark5 {
        background-image: url('${unsafeCSS(
          new URL('../images/HangingPhoto5TickMarks.png', import.meta.url)
        )}');
      }
      .numberlineTickMark10 {
        background-image: url('${unsafeCSS(
          new URL('../images/HangingPhoto10TickMarks.png', import.meta.url)
        )}');
      }

      .text {
        display: inline-block;
        vertical-align: middle;
        line-height: normal;
      }

      .digits {
        font: 10px sans-serif;
      }
    `;
  }

  willUpdate(_changedProperties: Map<string | number | symbol, unknown>): void {
    if (_changedProperties.has('photoId')) {
      this.framedPhoto.photoId = this.photoId;
      this.requestUpdate();
    }
  }

  render10TickMark(pos: number): SVGTemplateResult {
    return svg`
      <line x1="${pos}" x2="${pos}" y1="1" y2="11" width="3" stroke="blue"/>
    `;
  }
  render5TickMark(pos: number): SVGTemplateResult {
    return svg`
      <line x1="${pos}" x2="${pos}" y1="3" y2="9" width="2" stroke="blue"/>
    `;
  }
  render1TickMark(pos: number): SVGTemplateResult {
    return svg`
      <line x1="${pos}" x2="${pos}" y1="4" y2="8" width="1" stroke="blue"/>
    `;
  }

  renderConnectingLine(): SVGTemplateResult {
    return svg`
      <line x1="70" x2="70" y1="6" y2="30" width="1" stroke = "${this.framedPhoto.photoInfo.color}">
    `;
  }

  renderLeftDigit() {
    return svg`
      <text
        x="0"
        y="12"
        dominant-baseline="hanging"
        text-anchor="start"
        class="digits"
      >
        ${this.numberLeft}
      </text>
    `;
  }

  renderRightDigit(): SVGTemplateResult {
    return svg`
      <text
        x="100"
        y="12"
        dominant-baseline="hanging"
        text-anchor="end"
        class="digits"
      >
        ${this.numberRight}
      </text>
    `;
  }

  renderMiddleDigit(): SVGTemplateResult {
    let middleDigitSvg = svg``;
    if (this.showNumberMiddle) {
      middleDigitSvg = svg`
        <text
          x="50"
          y="12"
          dominant-baseline="hanging"
          text-anchor="middle"
          class="digits"
        >
          ${this.numberMiddle}
        </text>
      `;
    }
    return middleDigitSvg;
  }

  renderNumberLine(): SVGTemplateResult {
    let numberline = svg``;
    if (this.brokenLine)
      numberline = svg`
        <line x1="1" x2="12" y1="6" y2="6" stroke="blue" width="3" />
        <line x1="18" x2="22" y1="6" y2="6" stroke="blue" width="3" />
        <line x1="28" x2="32" y1="6" y2="6" stroke="blue" width="3" />
        <line x1="38" x2="99" y1="6" y2="6" stroke="blue" width="3" />
      `;
    else
      numberline = svg`<line x1="1" x2="99" y1="6" y2="6" stroke="blue" width="3" />`;
    return numberline;
  }

  render(): HTMLTemplateResult {
    let tickMarks10Positions: number[] = [];
    let tickMarks5Positions: number[] = [];
    let tickMarks1Positions: number[] = [];

    if (
      this.smallestTickmark === 'tickMark1' ||
      this.smallestTickmark === 'tickMark5' ||
      this.smallestTickmark === 'tickMark10'
    )
      tickMarks10Positions = [1, 50, 99];
    else tickMarks10Positions = [1, 99];

    if (
      this.smallestTickmark === 'tickMark1' ||
      this.smallestTickmark === 'tickMark5'
    ) {
      tickMarks5Positions = [75];
      if (!this.brokenLine) tickMarks5Positions.push(25);
    }

    if (this.smallestTickmark === 'tickMark1') {
      tickMarks1Positions = [5, 10, 40, 45, 55, 60, 65, 70, 80, 85, 90, 95];
      if (!this.brokenLine)
        tickMarks1Positions = tickMarks1Positions.concat([15, 20, 30, 35]);
    }

    return html`
      <div style="width: 110px; height: 70px; position; absolute;">
        <svg viewBox="0 0 110 70">
          ${this.renderNumberLine()}
          ${tickMarks10Positions.map(pos => this.render10TickMark(pos))}
          ${tickMarks5Positions.map(pos => this.render5TickMark(pos))}
          ${tickMarks1Positions.map(pos => this.render1TickMark(pos))}
          ${this.renderLeftDigit()} ${this.renderMiddleDigit()}
          ${this.renderRightDigit()} ${this.renderConnectingLine()}
          ${this.framedPhoto.render()}
        </svg>
      </div>
    `;
  }
}
