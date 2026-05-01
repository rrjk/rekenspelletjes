import { LitElement, html, css, svg } from 'lit';
import type { CSSResultArray, SVGTemplateResult } from 'lit';

import { customElement, property } from 'lit/decorators.js';

import { getColorInfo, type Color, stringToColor } from './Colors';
import { desaturate, saturate } from 'color2k';
import { convertJSON } from './Utils';

@customElement('mompitz-star')
export class MompitzStar extends LitElement {
  /** Strings to show, each array element will be shown on a separate row */
  @property({ converter: convertJSON<string[]> })
  accessor stringsToShow: string[] = [];

  /** Color of the star to use */
  @property({ converter: stringToColor })
  accessor color: Color = 'yellow';

  /** Factor to use for the fontsize in case strings are provided
   * fontSizeFactor equal to 1 is the size for
   *  putting one row with an M in the star.
   */
  @property({ type: Number })
  accessor fontSizeFactor = 1;

  static baseImage = 'Mompitz Elli star-transparent.png';
  static maskImage = 'Mompitz Elli star-mask.png';

  static aspectRatio = 213 / 181;

  static get styles(): CSSResultArray {
    return [
      css`
        :host {
          aspect-ratio: ${MompitzStar.aspectRatio};
          min-width: 0;
          min-height: 0;
          container-type: size;
          display: grid;
          justify-items: center;
          align-items: center;
          position: relative;
        }

        @container (aspect-ratio < ${MompitzStar.aspectRatio}) {
          svg {
            width: 100cqw;
          }
        }

        @container (aspect-ratio >= ${MompitzStar.aspectRatio}) {
          svg {
            height: 100cqh;
          }
        }

        .number,
        .string {
          font-family: Arial;
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
      `,
    ];
  }

  renderStrings(): SVGTemplateResult {
    const nmbrLines = this.stringsToShow.length;

    const fontSize = this.fontSizeFactor * 57;

    const content: SVGTemplateResult[] = [];

    const firstLineYOffset = -(nmbrLines - 1) / 2;
    const baseY = 104;

    for (let i = 0; i < nmbrLines; i++) {
      const y = baseY + (firstLineYOffset + i) * fontSize * 1.0;
      content.push(
        svg`<tspan class="string" style="font-size:${fontSize}px;" x="128" y="${y}">${this.stringsToShow[i]}</tspan>`,
      );
    }

    return svg`
      <text x="0" y="0">
        ${content}
      </text>
    `;
  }

  render() {
    return html`
      <svg viewBox="0 0 213 181">
        <defs>
          <!-- Use the star image as a mask -->
          <mask id="starMask">
            <image
              href="../images/${MompitzStar.maskImage}"
              x="0"
              y="0"
              width="213"
              height="181"
            />
          </mask>

          <!-- Gradient for the Star -->
          <radialGradient id="starGradient" cx="30%" cy="30%" r="70%">
            <stop
              offset="0%"
              stop-color=${saturate(
                getColorInfo(this.color).mainColorCode,
                0.6,
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
                0.4,
              )}
            />
          </radialGradient>
        </defs>

        <!-- Star with mask applied -->
        <g mask="url(#starMask)">
          <!-- Star Body with Gradient -->
          <rect
            x="30"
            y="0"
            width="183"
            height="181"
            fill="url(#starGradient)"
            stroke=${desaturate(getColorInfo(this.color).mainColorCode, 0.3)}
            stroke-width="2"
          />

          <!-- Strings -->
          ${this.renderStrings()}
        </g>

        <!-- Base image as SVG bitmap -->
        <image
          href="../images/${MompitzStar.baseImage}"
          x="0"
          y="0"
          width="213"
          height="181"
        />
      </svg>
    `;
  }
}
