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

  static get styles(): CSSResultArray {
    return [
      css`
        :host {
          display: block;
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
      <text x="64" y="68" class=${classMap(classes)}>
        ${this.nmbrToShow}
      </text>`;
  }

  renderContent(): SVGTemplateResult {
    if (this.disabled) {
      return this.renderDisabled();
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
        cy="31.6"
        fill="lightgrey"
        r="6.7"
        stroke=${lineColor}
        stroke-width="2"
      />
      ${this.renderContent()}
    </svg>`;
  }
}
