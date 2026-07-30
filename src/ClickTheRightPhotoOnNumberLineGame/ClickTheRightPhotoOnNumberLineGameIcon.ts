import { LitElement, css, html, svg } from 'lit';
import type {
  CSSResultArray,
  HTMLTemplateResult,
  SVGTemplateResult,
} from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import {
  getClickTheRightPhotoOnNumberLineVariant,
  type ClickTheRightPhotoOnNumberLineExtendedVariantInfo,
} from './ClickTheRightPhotoOnNumberLineVariants';
import { FramedPhotoSVG, type PhotoId } from '../FramedPhotoSVG';
import { getColorInfo } from '../Colors';

type TickMarkType = 'noTickMark' | 'tickMark1' | 'tickMark5' | 'tickMark10';

@customElement('click-the-right-photo-on-number-line-game-icon')
export class ClickTheRightPhotoOnNumberLineGameIcon extends LitElement {
  @property({ type: String })
  accessor variant = '';

  @state()
  accessor framedPhoto = new FramedPhotoSVG();

  static aspectRatio = 110 / 70;

  constructor() {
    super();
    this.framedPhoto.photoSize = 35;
    this.framedPhoto.x = 51;
    this.framedPhoto.y = 30;
  }

  static get styles(): CSSResultArray {
    return [
      css`
        :host {
          display: grid;
          justify-items: center;
          align-items: center;
          min-width: 0;
          min-height: 0;
          container-type: size;
        }

        @container (aspect-ratio < ${ClickTheRightPhotoOnNumberLineGameIcon.aspectRatio}) {
          svg {
            min-width: 0;
            min-height: 0;
            width: 100%;
            height: auto;
          }
        }

        @container (aspect-ratio >= ${ClickTheRightPhotoOnNumberLineGameIcon.aspectRatio}) {
          svg {
            min-width: 0;
            min-height: 0;
            width: auto;
            height: 100%;
          }
        }

        .digits {
          font: 10px sans-serif;
          fill: var(--line-color);
        }

        .numberline,
        .tickMark10,
        .tickMark5,
        .tickMark1 {
          stroke: var(--line-color);
        }
      `,
    ];
  }

  render10TickMark(pos: number): SVGTemplateResult {
    return svg`
      <line class='tickMark10' x1="${pos}" x2="${pos}" y1="1" y2="11" />
    `;
  }

  render5TickMark(pos: number): SVGTemplateResult {
    return svg`
      <line class='tickMark5' x1="${pos}" x2="${pos}" y1="3" y2="9"  />
    `;
  }

  render1TickMark(pos: number): SVGTemplateResult {
    return svg`
      <line class='tickMark1' x1="${pos}" x2="${pos}" y1="4" y2="8"  />
    `;
  }

  renderConnectingLine(photoColor: string): SVGTemplateResult {
    return svg`
      <line x1="70" x2="70" y1="6" y2="30" width="1" stroke = "${photoColor}">
    `;
  }

  renderLeftDigit(numberLeft: number): SVGTemplateResult {
    return svg`
      <text
        x="0"
        y="12"
        dominant-baseline="hanging"
        text-anchor="start"
        class="digits"
      >
        ${numberLeft}
      </text>
    `;
  }

  renderRightDigit(numberRight: number): SVGTemplateResult {
    return svg`
      <text
        x="100"
        y="12"
        dominant-baseline="hanging"
        text-anchor="end"
        class="digits"
      >
        ${numberRight}
      </text>
    `;
  }

  renderMiddleDigit(
    numberLeft: number,
    numberRight: number,
    numberMiddle: number,
    showNumberMiddle: boolean,
  ): SVGTemplateResult {
    let middleDigitSvg = svg``;
    if (showNumberMiddle && numberRight - numberLeft > 10) {
      middleDigitSvg = svg`
        <text
          x="50"
          y="12"
          dominant-baseline="hanging"
          text-anchor="middle"
          class="digits"
        >
          ${numberMiddle}
        </text>
      `;
    }
    return middleDigitSvg;
  }

  renderNumberLine(brokenLine: boolean): SVGTemplateResult {
    let numberline = svg``;
    if (brokenLine)
      numberline = svg`
        <line class="numberline" x1="1" x2="12" y1="6" y2="6"  />
        <line class="numberline" x1="18" x2="22" y1="6" y2="6" />
        <line class="numberline" x1="28" x2="32" y1="6" y2="6" />
        <line class="numberline" x1="38" x2="99" y1="6" y2="6" />
      `;
    else
      numberline = svg`<line class="numberline" x1="1" x2="99" y1="6" y2="6" />`;
    return numberline;
  }

  renderPhotoIcon(
    variantInfo: ClickTheRightPhotoOnNumberLineExtendedVariantInfo,
  ): HTMLTemplateResult {
    this.framedPhoto.photoId = variantInfo.photoId as PhotoId;
    const smallestTickmark: TickMarkType = variantInfo.show1TickMarks
      ? 'tickMark1'
      : variantInfo.show5TickMarks
        ? 'tickMark5'
        : 'tickMark10';
    const brokenLine = variantInfo.maximum > 20;
    const numberLineLength = variantInfo.maximum - variantInfo.minimum;

    let tickMarks10Positions: number[] = [];
    let tickMarks5Positions: number[] = [];
    let tickMarks1Positions: number[] = [];

    if (
      numberLineLength > 10 &&
      (smallestTickmark === 'tickMark1' ||
        smallestTickmark === 'tickMark5' ||
        smallestTickmark === 'tickMark10')
    )
      tickMarks10Positions = [1, 50, 99];
    else tickMarks10Positions = [1, 99];

    if (smallestTickmark === 'tickMark1' || smallestTickmark === 'tickMark5') {
      if (numberLineLength > 10) {
        tickMarks5Positions = [75];
        if (!brokenLine) tickMarks5Positions.push(25);
      } else {
        tickMarks5Positions = [50];
      }
    }

    if (smallestTickmark === 'tickMark1') {
      if (numberLineLength > 10) {
        tickMarks1Positions = [5, 10, 40, 45, 55, 60, 65, 70, 80, 85, 90, 95];
        if (!brokenLine)
          tickMarks1Positions = tickMarks1Positions.concat([15, 20, 30, 35]);
      } else {
        tickMarks1Positions = [10, 20, 30, 40, 60, 70, 80, 90];
      }
    }

    const colorInfo = getColorInfo(variantInfo.iconColor);

    return html`
      <style>
        :host {
          --line-color: ${colorInfo.fontColor};
        }
      </style>
      <svg viewBox="-7 -7 124 84">
        <rect
          x="-7"
          y="-7"
          rx="15"
          width="120"
          height="80"
          fill=${colorInfo.mainColorCode}
        />
        ${this.renderNumberLine(brokenLine)}
        ${tickMarks10Positions.map(pos => this.render10TickMark(pos))}
        ${tickMarks5Positions.map(pos => this.render5TickMark(pos))}
        ${tickMarks1Positions.map(pos => this.render1TickMark(pos))}
        ${this.renderLeftDigit(variantInfo.minimum)}
        ${this.renderMiddleDigit(
          variantInfo.minimum,
          variantInfo.maximum,
          variantInfo.mid,
          variantInfo.showAll10Numbers,
        )}
        ${this.renderRightDigit(variantInfo.maximum)}
        ${this.renderConnectingLine(this.framedPhoto.photoInfo.color)}
        ${this.framedPhoto.render()}
      </svg>
    `;
  }

  render(): HTMLTemplateResult {
    const variantInfo: ClickTheRightPhotoOnNumberLineExtendedVariantInfo =
      getClickTheRightPhotoOnNumberLineVariant(this.variant);
    return this.renderPhotoIcon(variantInfo);
  }
}
