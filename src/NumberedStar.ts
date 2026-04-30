import { LitElement, html, css, svg } from 'lit';
import type {
  HTMLTemplateResult,
  CSSResultArray,
  SVGTemplateResult,
} from 'lit';

import { customElement, property } from 'lit/decorators.js';

import { getColorInfo, type Color, stringToColor } from './Colors';
import { desaturate, saturate } from 'color2k';
import { convertJSON } from './Utils';

@customElement('numbered-star')
export class NumberedStar extends LitElement {
  /** Number  to show */
  @property({ type: Number })
  accessor nmbrToShow = 3;
  /** Strings to show, each array element will be shown on a separate row.
   * In case both a number and strings are provided, the strings will be shown
   */
  @property({ converter: convertJSON<string[]> })
  accessor stringsToShow: string[] = [];

  /** Color of the star to use */
  @property({ converter: stringToColor })
  accessor color: Color = 'yellow';

  /** Indication whether the star should show as a disabled star */
  @property({ type: Boolean })
  accessor disabled = false;

  /** Factor to use for the fontsize in case strings are provided
   * fontSizeFactor equal to 1 is the size for
   *  putting one row with an M in the star.
   */
  @property({ type: Number })
  accessor fontSizeFactor = 1;

  static aspectRatio = 213 / 181; // Equal to the aspect ratio of the star SVG

  static get styles(): CSSResultArray {
    return [
      css`
        :host {
          aspect-ratio: var(--aspect-ratio, ${NumberedStar.aspectRatio});
          min-width: 0;
          min-height: 0;
          container-type: size;
          display: grid;
          justify-items: center;
          align-items: center;
          position: relative;
        }

        @container (aspect-ratio < ${NumberedStar.aspectRatio}) {
          svg {
            width: 100cqw;
          }
        }

        @container (aspect-ratio >= ${NumberedStar.aspectRatio}) {
          svg {
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
          font-size: 55px;
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
          font-size: 65px;
        }

        .twoDigit {
          font-size: 60px;
        }

        .threeDigit {
          font-size: 53px;
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
          x="110"
          y="105"
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
      y = 105;
      classes = 'number oneDigit';
    } else if (this.nmbrToShow < 100) {
      classes = 'number twoDigit';
      y = 105;
    } else if (this.nmbrToShow < 1000) {
      classes = 'number threeDigit';
      y = 105;
    }

    return svg`
        <!-- Big number  -->
        <text
          x="110"
          y="${y}"
          class="${classes}"
        >
          ${this.nmbrToShow}
        </text>
`;
  }

  renderString(): SVGTemplateResult {
    const nmbrLines = this.stringsToShow.length;

    const fontSize = this.fontSizeFactor * 65;

    const content: SVGTemplateResult[] = [];

    const firstLineYOffset = -(nmbrLines - 1) / 2;
    const baseY = 105;

    for (let i = 0; i < nmbrLines; i++) {
      const y = baseY + (firstLineYOffset + i) * fontSize * 1.0;
      content.push(
        svg`<tspan class="string"  style="font-size:${fontSize}px;" x="115" y="${y}">${this.stringsToShow[i]}</tspan>`,
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
    return html`
      <style>
        :root {
          --aspect-ratio: ${NumberedStar.aspectRatio};
        }
      </style>

      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 213 181">
        <!-- Gradient for the Star -->
        <defs>
          <radialGradient id="starGradient" cx="30%" cy="30%" r="70%">
            <stop
              offset="0%"
              stop-color=${saturate(
                getColorInfo(this.color).mainColorCode,
                0.3,
              )}
            />
            <stop
              offset="50%"
              stop-color=${getColorInfo(this.color).mainColorCode}
            />
            <stop
              offset="100%"
              stop-color=${desaturate(
                getColorInfo(this.color).mainColorCode,
                0.2,
              )}
            />
          </radialGradient>
        </defs>

        <!-- Star Body with Gradient -->
        <polygon
          points="1,56 69,114 50,180 121,135 180,180 153,108 212,71 138,71 119,1 93,74"
          fill="url(#starGradient)"
          stroke=${desaturate(getColorInfo(this.color).mainColorCode, 0.3)}
          stroke-width="2"
        />

        <!-- Content (number or strings) -->
        ${this.renderContent()}
      </svg>
    `;
  }
}
