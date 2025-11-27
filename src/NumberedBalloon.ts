import { LitElement, html, css, svg } from 'lit';
import type {
  HTMLTemplateResult,
  CSSResultArray,
  SVGTemplateResult,
} from 'lit';

import { customElement, property } from 'lit/decorators.js';

import { getColorInfo, type Color, stringToColor } from './Colors';
import { desaturate, saturate } from 'color2k';

function convertJSON<T>(value: string | null): T {
  if (value !== null) {
    const parsedValue = JSON.parse(value) as T;
    return parsedValue;
  }
  throw new Error(`illegally formatted attribute provided`);
}

type ShortLong = 'short' | 'long';

function stringToShortLong(value: string | null): ShortLong {
  if (value === 'long') return 'long';
  return 'short';
}

@customElement('numbered-balloon')
export class NumberedBalloon extends LitElement {
  /** Number  to show */
  @property({ type: Number })
  accessor nmbrToShow = 3;
  @property({ converter: convertJSON<string[]> })
  accessor stringsToShow: string[] = [];

  /** Color of the balloonto use */
  @property({ converter: stringToColor })
  accessor color: Color = 'blue';

  @property({ type: Boolean })
  accessor disabled = false;

  @property({ type: Number })
  accessor fontSizeFactor = 1;

  @property({ converter: stringToShortLong })
  accessor stringLength: ShortLong = 'long';

  static get styles(): CSSResultArray {
    return [
      css`
        :host {
          display: block;
        }

        .crossOut {
          font-family:
            'Arial Rounded MT Bold', 'Segoe UI', 'Helvetica', 'Arial',
            sans-serif;
          font-weight: 700;
          fill: #555555;
          stroke: #222222;
          stroke-width: 0.15em;
          paint-order: stroke;
          font-size: 115px;
          text-anchor: middle;
          dominant-baseline: middle;
        }

        .number,
        .string {
          font-family: 'Arial';
          font-weight: 700;
          fill: #ffffff;
          stroke: #000000;
          stroke-width: 0.15em;
          paint-order: stroke;
          text-anchor: middle;
          dominant-baseline: middle;
        }

        .string {
          letter-spacing: +0.05em;
        }

        .oneDigit {
          font-size: 140px;
        }

        .twoDigit {
          font-size: 110px;
        }

        .threeDigit {
          font-size: 70px;
        }

        text {
          cursor: default;
          user-select: none;
        }
      `,
    ];
  }

  renderDisabled(): SVGTemplateResult {
    return svg`
      <text
          x="100"
          y="135"
          class="crossOut"
        >
          ✗
       </text>
    `;
  }

  renderNumber(): SVGTemplateResult {
    let classes = '';
    let y = 0;
    if (this.nmbrToShow < 10) {
      y = 135;
      classes = 'number oneDigit';
    } else if (this.nmbrToShow < 100) {
      classes = 'number twoDigit';
      y = 131;
    } else if (this.nmbrToShow < 1000) {
      classes = 'number threeDigit';
      y = 128;
    }

    return svg`
        <!-- Big number  -->
        <text
          x="100"
          y="${y}"
          class="${classes}"
        >
          ${this.nmbrToShow}
        </text>
`;
  }

  renderString(): SVGTemplateResult {
    const nmbrLines = this.stringsToShow.length;
    let lengthLongestLine = 0;
    for (const line of this.stringsToShow) {
      if (line.length > lengthLongestLine) lengthLongestLine = line.length;
    }

    const fontSize = this.fontSizeFactor * 110;

    const content: SVGTemplateResult[] = [];
    const numberLines = this.stringsToShow.length;

    const firstLineYOffset = -(nmbrLines - 1) / 2;

    for (let i = 0; i < numberLines; i++) {
      content.push(
        svg`<tspan class="string"  style="font-size:${fontSize}px;" x="100" y="${120 + (firstLineYOffset + i) * fontSize * 1.1}">${this.stringsToShow[i]}</tspan>`,
      );
    }

    return svg`
      <text
        x="300"
        y="0"
      >
        ${content}
      </text>
    `;
  }

  renderContent() {
    if (this.disabled) return this.renderDisabled();
    else if (this.stringsToShow.length === 0) return this.renderNumber();
    else return this.renderString();
  }

  render(): HTMLTemplateResult {
    let svgHeight = 0;
    if (this.stringLength === 'short') svgHeight = 220;
    else if (this.stringLength === 'long') svgHeight = 280;
    return html`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="20 20 160 ${svgHeight}">
        <!-- Gradient for the Balloon -->
        <defs>
          <linearGradient
            id="balloonGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop
              offset="0%"
              stop-color=${getColorInfo(this.color).mainColorCode /*#9D5CFF*/}
            />
            <stop
              offset="50%"
              stop-color=${
                /* getColorInfo(this.color).accentColorCode */

                saturate(getColorInfo(this.color).mainColorCode, 0.2)
                /*#C77DFF"*/
              }
            />
            <stop
              offset="100%"
              stop-color=${getColorInfo(this.color).mainColorCode /*#9D5CFF*/}
            />
          </linearGradient>
          <radialGradient id="shine" cx="40%" cy="40%" r="50%">
            <stop offset="0%" stop-color="white" stop-opacity="0.7" />
            <stop offset="100%" stop-color="white" stop-opacity="0" />
          </radialGradient>
        </defs>

        <!-- Balloon Body with Gradient -->
        <ellipse
          cx="100"
          cy="120"
          rx="80"
          ry="100"
          fill="url(#balloonGradient)"
        />

        <!-- Shine Effect -->
        <ellipse cx="60" cy="80" rx="30" ry="40" fill="url(#shine)" />

        <!-- Shine Effect -->
        <ellipse cx="150" cy="170" rx="30" ry="50" fill="url(#shine)" />

        <!-- Knot at the Balloon's Bottom -->
        <circle
          cx="100"
          cy="220"
          r="6"
          fill=${desaturate(getColorInfo(this.color).mainColorCode, 0.05)}
        />

        <!-- Meandering String -->
        <path
          d="M100 220 C 105 230, 95 250, 100 260 C 105 270, 95 280, 100 290"
          stroke=${desaturate(getColorInfo(this.color).mainColorCode, 0.05)}
          stroke-width="2"
          fill="none"
        />

        <!-- Big number  -->
        ${this.renderContent()}
      </svg>
    `;
  }
}
