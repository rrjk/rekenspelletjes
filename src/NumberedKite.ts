import { LitElement, html, css, svg } from 'lit';
import type {
  HTMLTemplateResult,
  CSSResultArray,
  SVGTemplateResult,
} from 'lit';

import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { getColorInfo, type Color, stringToColor } from './Colors';
import { saturate, mix } from 'color2k';
import { convertJSON } from './Utils';

type ShortLong = 'short' | 'long';

function stringToShortLong(value: string | null): ShortLong {
  if (value === 'long') return 'long';
  return 'short';
}

@customElement('numbered-kite')
export class NumberedKite extends LitElement {
  /** Number  to show */
  @property({ type: Number })
  accessor nmbrToShow = 3;
  /** Strings to show, each array element will be shown on a separate row.
   * In case both a number and strings are provided, the strings will be shown
   */
  @property({ converter: convertJSON<string[]> })
  accessor stringsToShow: string[] = [];

  /** Color of the kite to use */
  @property({ converter: stringToColor })
  accessor color: Color = 'blue';

  /** Indication whether the kite should show as a disabled kite */
  @property({ type: Boolean })
  accessor disabled = false;

  /** Factor to use for the fontsize in case strings are provided
   *  fontSizeFactor equal to 1 is the size for
   *  putting one row with an M in the kite.
   */
  @property({ type: Number })
  accessor fontSizeFactor = 1;

  /** Indication whether the kite tail should be short or long
   * With a long tail, the aspect ratio of the kite is 2:3
   * With a short tail, the aspect ratio of the kite is 12:17
   */
  @property({ converter: stringToShortLong })
  accessor tailLength: ShortLong = 'long';

  static aspectRatioLongTail = 600 / 900; // Equal to the aspect ratio of the svg used for the kite image
  static aspectRatioShortTail = 600 / 850; // Short tail version

  static get styles(): CSSResultArray {
    return [
      css`
        :host {
          aspect-ratio: var(
            --aspect-ratio,
            ${NumberedKite.aspectRatioLongTail}
          );
          min-width: 0;
          min-height: 0;
          container-type: size;
          display: grid;
          justify-items: center;
          align-items: center;
          position: relative;
        }

        @container (aspect-ratio < ${NumberedKite.aspectRatioLongTail}) {
          svg.longTail {
            width: 100cqw;
          }
        }

        @container (aspect-ratio >= ${NumberedKite.aspectRatioLongTail}) {
          svg.longTail {
            height: 100cqh;
          }
        }

        @container (aspect-ratio < ${NumberedKite.aspectRatioShortTail}) {
          svg.shortTail {
            width: 100cqw;
          }
        }

        @container (aspect-ratio >= ${NumberedKite.aspectRatioShortTail}) {
          svg.shortTail {
            height: 100cqh;
          }
        }

        .crossOut {
          font-family: 'Arial';
          font-weight: 700;
          fill: #555555;
          stroke: #222222;
          stroke-width: 0.15em;
          paint-order: stroke;
          font-size: 200px;
          text-anchor: middle;
          dominant-baseline: middle;
        }

        .number,
        .string {
          font-family: 'Arial', sans-serif;
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
          font-size: 280px;
        }

        .twoDigit {
          font-size: 220px;
        }

        .threeDigit {
          font-size: 180px;
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
          x="300"
          y="300"
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
      y = 340;
      classes = 'number oneDigit';
    } else if (this.nmbrToShow < 100) {
      classes = 'number twoDigit';
      y = 315;
    } else if (this.nmbrToShow < 1000) {
      classes = 'number threeDigit';
      y = 310;
    }

    return svg`
        <!-- Big number  -->
        <text
          x="300"
          y="${y}"
          class="${classes}"
        >
          ${this.nmbrToShow}
        </text>
`;
  }

  renderString(): SVGTemplateResult {
    const nmbrLines = this.stringsToShow.length;

    const fontSize = this.fontSizeFactor * 300;

    const content: SVGTemplateResult[] = [];
    const numberLines = this.stringsToShow.length;

    const firstLineYOffset = -(nmbrLines - 1) / 2;
    const baseY = numberLines === 1 ? 320 : 360;

    for (let i = 0; i < numberLines; i++) {
      const y = baseY + (firstLineYOffset + i) * fontSize * 1.0;
      content.push(
        svg`<tspan class="string"  style="font-size:${fontSize}px;" x="300" y="${y}">${this.stringsToShow[i]}</tspan>`,
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
    let classes = {};
    let tailEndY = 0;

    if (this.tailLength === 'short') {
      classes = { shortTail: true, longTail: false };
      svgHeight = 850;
      tailEndY = 850;
    } else if (this.tailLength === 'long') {
      classes = { shortTail: false, longTail: true };
      svgHeight = 900;
      tailEndY = 900;
    }

    const mainColor = getColorInfo(this.color).mainColorCode;
    const lightColor = mix(mainColor, '#ffffff', 0.7);
    const mediumColor = saturate(mainColor, 0.2);

    return html`
      <style>
        :root {
          --aspect-ratio: ${this.tailLength === 'short'
            ? NumberedKite.aspectRatioShortTail
            : NumberedKite.aspectRatioLongTail};
        }
      </style>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 600 ${svgHeight}"
        class=${classMap(classes)}
      >
        <!-- Gradients for the Kite -->
        <defs>
          <g id="triangle">
            <polygon
              points="0,0 -10,-20 10,-20"
              style="stroke:grey;stroke-width:1"
            />
            <polygon
              points="0,0 -10,20 10,20"
              style="stroke:grey;stroke-width:1"
            />
          </g>
          <radialGradient id="GradientLT" cx="1" cy="1" r="1">
            <stop offset="0%" stop-color=${lightColor} />
            <stop offset="40%" stop-color=${mediumColor} />
            <stop offset="100%" stop-color=${mainColor} />
          </radialGradient>
          <radialGradient id="GradientLB" cx="1" cy="0" r="1">
            <stop offset="0%" stop-color=${lightColor} />
            <stop offset="40%" stop-color=${mediumColor} />
            <stop offset="100%" stop-color=${mainColor} />
          </radialGradient>
          <radialGradient id="GradientRT" cx="0" cy="1" r="1">
            <stop offset="0%" stop-color=${lightColor} />
            <stop offset="40%" stop-color=${mediumColor} />
            <stop offset="100%" stop-color=${mainColor} />
          </radialGradient>
          <radialGradient id="GradientRB" cx="0" cy="0" r="1">
            <stop offset="0%" stop-color=${lightColor} />
            <stop offset="40%" stop-color=${mediumColor} />
            <stop offset="100%" stop-color=${mainColor} />
          </radialGradient>
        </defs>

        <!-- Kite Body - Four triangular sections -->
        <polygon
          points="300,0 300,280 0,280"
          style="fill:url(#GradientLT);stroke:black;stroke-width:1"
        />
        <polygon
          points="300,0 300,280 600,280"
          style="fill:url(#GradientRT);stroke:black;stroke-width:1"
        />
        <polygon
          points="300,800 300,280 0,280"
          style="fill:url(#GradientLB);stroke:black;stroke-width:1"
        />
        <polygon
          points="300,800 300,280 600,280"
          style="fill:url(#GradientRB);stroke:black;stroke-width:1"
        />

        ${this.tailLength === 'long'
          ? svg`
              <!-- Tail triangles -->
              <use
                href="#triangle"
                x="350"
                y=${svgHeight - 50}
                transform="rotate(35, 350, ${svgHeight - 50})"
                style="fill:#fff333"
              />
              <use
                href="#triangle"
                x="400"
                y=${svgHeight - 25}
                transform="rotate(30, 400, ${svgHeight - 25})"
                style="fill:#ff1a1a"
              />

              <!-- Tail string -->
              <path
                d="M300,800 C300,820 340,843 350,${svgHeight - 50} 360,${svgHeight - 43} 390,${svgHeight - 31} 400,${svgHeight - 25} 410,${svgHeight - 19} 447,${svgHeight - 13} 450,${tailEndY}"
                style="stroke:black; stroke-width:3;fill:none"
              />
            `
          : svg`
              <!-- Smooth short tail -->
              <path
                d="M300,800 C320,810 360,815 390,815 420,815 440,818 450,${tailEndY}"
                style="stroke:black; stroke-width:3;fill:none"
              />
            `}

        <!-- Content (number or strings) -->
        ${this.renderContent()}
      </svg>
    `;
  }
}
