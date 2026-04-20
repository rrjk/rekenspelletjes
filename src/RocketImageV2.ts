import { LitElement, html, css, svg } from 'lit';
import type {
  HTMLTemplateResult,
  CSSResultArray,
  SVGTemplateResult,
} from 'lit';

import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { getColorInfo, type Color, stringToColor } from './Colors';
import { numberDigitsInNumber } from './NumberHelperFunctions';
import { convertJSON } from './Utils';

@customElement('rocket-image')
export class RocketImage extends LitElement {
  /** Number  to show */
  @property({ type: Number })
  accessor nmbrToShow = 3;

  /** Color of the rocket to use */
  @property({ converter: stringToColor })
  accessor color: Color = 'red';

  /** Indication whether the rocket should show as a disabled rocket */
  @property({ type: Boolean })
  accessor disabled = false;

  /** Strings to show, each array element will be shown on a separate row.
   * In case both a number and strings are provided, the strings will be shown
   */
  @property({ converter: convertJSON<string[]> })
  accessor stringsToShow: string[] = [];

  /** Factor to use for the fontsize in case strings are provided
   * fontSizeFactor equal to 1 is the size for
   *  putting one row with an M in the balloon.
   */
  @property({ type: Number })
  accessor fontSizeFactor = 1;

  static aspectRatio = 70 / 128; // Equal to the aspect ratio of the svg used for the rocket image

  static get styles(): CSSResultArray {
    return [
      css`
        :host {
          aspect-ratio: ${RocketImage.aspectRatio};
          min-width: 0;
          min-height: 0;
          container-type: size;
          display: grid;
          justify-items: center;
          align-items: center;
          position: relative;
        }

        @container (aspect-ratio < ${RocketImage.aspectRatio}) {
          svg {
            width: 100cqw;
          }
        }

        @container (aspect-ratio >= ${RocketImage.aspectRatio}) {
          svg {
            height: 100cqh;
          }
        }

        .crossOut {
          font-family: 'Arial';
          font-weight: 700;
          fill: #555555;
          stroke: #222222;
          stroke-width: 1px;
          paint-order: stroke;
          font-size: 40px;
          text-anchor: middle;
          dominant-baseline: middle;
        }

        .number,
        .string {
          font-family: 'Arial';
          stroke: #000000;
          stroke-width: 1px;
          fill: #000000;
          paint-order: stroke;
          text-anchor: middle;
          dominant-baseline: middle;
        }

        .oneDigit {
          font-size: 50px;
        }

        .twoDigits {
          font-size: 35px;
        }

        .threeDigits {
          font-size: 25px;
        }
      `,
    ];
  }

  renderDisabled(): SVGTemplateResult {
    return svg`
      <text
          x="64"
          y="68"
          class="crossOut"
        >
          ✗
       </text>
    `;
  }

  renderNumber(): SVGTemplateResult {
    const classes = {
      number: true,
      oneDigit: numberDigitsInNumber(this.nmbrToShow) === 1,
      twoDigits: numberDigitsInNumber(this.nmbrToShow) === 2,
      threeDigits: numberDigitsInNumber(this.nmbrToShow) === 3,
    };

    return svg`
      <text x="64" y="62 " class=${classMap(classes)}>
        ${this.nmbrToShow}
      </text>`;
  }

  renderStrings(): SVGTemplateResult {
    const nmbrLines = this.stringsToShow.length;
    let lengthLongestLine = 0;
    for (const line of this.stringsToShow) {
      if (line.length > lengthLongestLine) lengthLongestLine = line.length;
    }

    const fontSize = this.fontSizeFactor * 85;

    const content: SVGTemplateResult[] = [];
    const numberLines = this.stringsToShow.length;

    const firstLineYOffset = -(nmbrLines - 1) / 2;

    for (let i = 0; i < numberLines; i++) {
      content.push(
        svg`<tspan class="string"  style="font-size:${fontSize}px;" x="64" y="${60 + (firstLineYOffset + i) * fontSize * 0.9}">${this.stringsToShow[i]}</tspan>`,
      );
    }

    return svg`
      <text
        x="29"
        y="0"
        class="string"
      >
        ${content}
      </text>
    `;
  }

  renderContent(): SVGTemplateResult {
    if (this.disabled) {
      return this.renderDisabled();
    } else if (this.stringsToShow.length > 0) {
      return this.renderStrings();
    } else {
      return this.renderNumber();
    }
  }

  render(): HTMLTemplateResult {
    let lineColor, wingColor: string;
    if (!this.disabled) {
      const colorInfo = getColorInfo(this.color);
      lineColor = colorInfo.accentColorCode;
      wingColor = colorInfo.mainColorCode;
    } else {
      lineColor = '#555555';
      wingColor = '#444444  ';
    }

    return html` <svg xmlns="http://www.w3.org/2000/svg" viewBox="29 0 70 128">
      <path
        d="M 64 3 C 31 33 37 63 43 76 C 51 89 46 81 54 93 H 64 V 85 M 64 93 H 74 C 82 81 77 89 85 76 C 91 63 97 33 64 3"
        stroke=${lineColor}
        stroke-width="2"
        stroke-linecap="round"
        fill="white"
      />
      <path
        d="M 54 93 L 36 102 C 26 92 32.5 89 43 76 C 51 89 46 81 54 93"
        stroke=${lineColor}
        stroke-width="2"
        stroke-linecap="round"
        fill=${wingColor}
      />
      <path
        d="M 74 93 L 92 102 C 102 92 95.5 89 85 76 C 77 89 82 81 74 93"
        stroke=${lineColor}
        stroke-width="2"
        stroke-linecap="round"
        fill=${wingColor}
      />
      <path
        d="M 69 100 L 59 100 C 50 106 51 113 64 125 C 78 113 77 106 69 100"
        stroke=${lineColor}
        stroke-width="2"
        stroke-linecap="round"
        fill="lightgrey"
      />
      <circle
        cx="64"
        cy="25"
        fill="lightgrey"
        r="6.7"
        stroke=${lineColor}
        stroke-width="2"
      />
      ${this.renderContent()}
    </svg>`;
  }
}
