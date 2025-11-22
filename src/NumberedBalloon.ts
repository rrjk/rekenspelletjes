import { LitElement, html, css, svg } from 'lit';
import type {
  HTMLTemplateResult,
  CSSResultArray,
  SVGTemplateResult,
} from 'lit';

import { customElement, property } from 'lit/decorators.js';

import { getColorInfo, type Color, stringToColor } from './Colors';
import { desaturate } from 'color2k';

@customElement('numbered-balloon')
export class NumberedBalloon extends LitElement {
  /** Number  to show */
  @property({ type: Number })
  accessor nmbrToShow = 3;
  /** Color of the balloonto use */
  @property({ converter: stringToColor })
  accessor color: Color = 'blue';
  @property({ type: Boolean })
  accessor disabled = false;

  static get styles(): CSSResultArray {
    return [
      css`
        :host {
          display: block;
        }

        .balloon {
          stroke: #000;
          stroke-width: 12;
          stroke-linejoin: round;
        }
        .crossOut {
          font-family:
            'Arial Rounded MT Bold', 'Segoe UI', 'Helvetica', 'Arial',
            sans-serif;
          font-weight: 700;
          fill: #555555;
          stroke: #000000;
          stroke-width: 40px;
          paint-order: stroke;
          font-size: 300px;
          text-anchor: middle;
          dominant-baseline: middle;
        }

        .number {
          font-family:
            'Arial Rounded MT Bold', 'Segoe UI', 'Helvetica', 'Arial',
            sans-serif;
          font-weight: 700;
          fill: #ffffff;
          stroke: #000000;
          stroke-width: 40px;
          paint-order: stroke;
          text-anchor: middle;
          dominant-baseline: middle;
        }

        .oneDigit {
          font-size: 500px;
        }

        .twoDigit {
          font-size: 380px;
        }

        .threeDigit {
          font-size: 250px;
        }

        .knot {
          stroke: #000;
          stroke-width: 8;
          fill: #ff8a2b;
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
          x="512"
          y="475"
          class="crossOut"
        >
          ✗
       </text>
    `;
  }

  renderNumber(): SVGTemplateResult {
    let classes = '';
    if (this.nmbrToShow < 10) classes = 'number oneDigit';
    else if (this.nmbrToShow < 100) classes = 'number twoDigit';
    else if (this.nmbrToShow < 1000) classes = 'number threeDigit';

    return svg`
        <!-- Big number  -->
        <text
          x="512"
          y="490"
          class="${classes}"
        >
          ${this.nmbrToShow}
        </text>
`;
  }

  render(): HTMLTemplateResult {
    return html`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="200 100 615 900">
        <defs>
          <radialGradient id="g1" cx="40%" cy="25%" r="70%">
            <stop
              offset="0%"
              stop-color=${getColorInfo(this.color).mainColorCode}
            />
            <stop
              offset="45%"
              stop-color=${desaturate(
                getColorInfo(this.color).mainColorCode,
                0.25,
              )}
            />
            <stop
              offset="100%"
              stop-color=${desaturate(
                getColorInfo(this.color).mainColorCode,
                0.5,
              )}
            />
          </radialGradient>
          <linearGradient id="shine" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9" />
            <stop offset="35%" stop-color="#ffffff" stop-opacity="0.35" />
            <stop offset="100%" stop-color="#ffffff" stop-opacity="0.0" />
          </linearGradient>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow
              dx="0"
              dy="8"
              stdDeviation="18"
              flood-color="#000"
              flood-opacity="0.25"
            />
          </filter>
        </defs>

        <!-- Main balloon shape -->
        <g filter="url(#shadow)">
          <path
            class="balloon"
            d="M512 120
                C680 120 780 260 780 420
                C780 620 640 740 512 812
                C384 740 244 620 244 420
                C244 260 344 120 512 120
                Z"
            fill="url(#g1)"
          />
        </g>

        <!-- Internal subtle shading -->
        <path
          d="M512 140
              C660 140 744 250 744 420
              C744 600 620 712 512 770
              C404 712 280 600 280 420
              C280 250 364 140 512 140
              Z"
          fill="rgba(0,0,0,0.06)"
        />

        <!-- Shine highlight -->
        <path
          d="M420 180 C460 140 560 120 610 150 C592 140 540 120 480 150 C440 170 430 190 420 180 Z"
          fill="url(#shine)"
        />

        <!-- Balloon knot (moved below balloon bottom at y≈812) -->
        <path class="knot" d="M500 800 L524 800 L512 820 Z" />

        <!-- String (starts at bottom center of the knot) -->
        <path
          d="M512 820 C512 900 496 940 504 980 C512 1020 492 1020 492 1020"
          stroke="#f6d88a"
          stroke-width="14"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
        />
        <path
          d="M512 820 C512 900 496 940 504 980 C512 1020 492 1020 492 1020"
          stroke="#c77d12"
          stroke-width="6"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          stroke-dasharray="12 8"
          opacity="0.6"
        />

        <!-- Big number  -->
          ${this.disabled ? this.renderDisabled() : this.renderNumber()}
        </text>
      </svg>
    `;
  }
}
