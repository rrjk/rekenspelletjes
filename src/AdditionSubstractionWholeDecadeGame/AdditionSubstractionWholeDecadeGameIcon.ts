import { LitElement, html, css, svg } from 'lit';
import type { CSSResultArray, SVGTemplateResult } from 'lit';

import { customElement, property } from 'lit/decorators.js';

import { getColorInfo, type Color } from '../Colors';
import { desaturate, saturate } from 'color2k';
import { getAdditionSubstractionWholeDecadeGameVariant } from './AdditionSubstractionWholeDecadeGameVariants';
import { classMap } from 'lit/directives/class-map.js';

@customElement('addition-substraction-whole-decade-game-icon')
export class AdditionSubstractionWholeDecadeGameIcon extends LitElement {
  /** Game variant code (e.g., 'aa', 'ab', 'ac', 'ba', 'bb', 'bc').
   * Empty string shows default '+' and '−' symbols.
   */
  @property({ type: String })
  accessor variant = '';

  static baseImage = new URL(
    '../../images/Mompitz Elli star-transparent.png',
    import.meta.url,
  );
  static maskImage = new URL(
    '../../images/Mompitz Elli star-mask.png',
    import.meta.url,
  );

  static aspectRatio = 213 / 181;

  static get styles(): CSSResultArray {
    return [
      css`
        :host {
          aspect-ratio: ${AdditionSubstractionWholeDecadeGameIcon.aspectRatio};
          min-width: 0;
          min-height: 0;
          container-type: size;
          display: grid;
          justify-items: center;
          align-items: center;
          position: relative;
        }

        @container (aspect-ratio < ${AdditionSubstractionWholeDecadeGameIcon.aspectRatio}) {
          svg {
            width: 100cqw;
          }
        }

        @container (aspect-ratio >= ${AdditionSubstractionWholeDecadeGameIcon.aspectRatio}) {
          svg {
            height: 100cqh;
          }
        }

        .string {
          font-family: Arial;
          font-weight: 700;
          fill: #ffffff;
          stroke: #000000;
          stroke-width: 0.15em;
          paint-order: stroke;
          text-anchor: middle;
          dominant-baseline: middle;
          letter-spacing: +0.05em;
        }

        .genericVariant {
          font-size: 50px;
        }

        .gameVariant {
          font-size: 25px;
        }
      `,
    ];
  }

  private getStrings(): string[] {
    if (this.variant === '') {
      return ['+', '−'];
    }

    const variantInfo = getAdditionSubstractionWholeDecadeGameVariant(
      this.variant,
    );
    return variantInfo.exampleSums;
  }

  private getColor(): Color {
    if (this.variant === '') {
      return 'yellow';
    }

    const variantInfo = getAdditionSubstractionWholeDecadeGameVariant(
      this.variant,
    );
    return variantInfo.iconColor;
  }

  private renderStrings(strings: string[]): SVGTemplateResult {
    if (strings.length > 2) {
      throw new Error('Too many strings to render');
    }

    const classes = {
      string: true,
      genericVariant: this.variant === '',
      gameVariant: this.variant !== '',
    };

    const content: SVGTemplateResult[] = [];

    let y: number[] = [];
    if (classes.genericVariant) {
      y = [90, 120];
    } else {
      y = [86, 120];
    }

    const x = 128;

    for (let i = 0; i < strings.length; i++) {
      content.push(
        svg`<tspan class="${classMap(classes)}" x=${x} y=${y[i]}>${strings[i]}</tspan>`,
      );
    }

    return svg`
      <text x="0" y="0">      
          ${content}
      </text>
    `;
  }

  private renderDefs(color: Color): SVGTemplateResult {
    return svg`
      <defs>
        <mask id="starMask">
          <image
            href=${AdditionSubstractionWholeDecadeGameIcon.maskImage.href}
            x="0"
            y="0"
            width="213"
            height="181"
          />
        </mask>

        <radialGradient id="starGradient" cx="30%" cy="30%" r="70%">
          <stop
            offset="0%"
            stop-color=${saturate(getColorInfo(color).mainColorCode, 0.6)}
          />
          <stop
            offset="50%"
            stop-color=${getColorInfo(color).mainColorCode}
          />
          <stop
            offset="100%"
            stop-color=${desaturate(getColorInfo(color).mainColorCode, 0.4)}
          />
        </radialGradient>
      </defs>
    `;
  }

  private renderStarBody(color: Color): SVGTemplateResult {
    return svg`
      <rect
        x="30"
        y="0"
        width="183"
        height="181"
        fill="url(#starGradient)"
        stroke=${desaturate(getColorInfo(color).mainColorCode, 0.3)}
        stroke-width="2"
      />
    `;
  }

  private renderBaseImage(): SVGTemplateResult {
    return svg`
      <image
        href=${AdditionSubstractionWholeDecadeGameIcon.baseImage.href}
        x="0"
        y="0"
        width="213"
        height="181"
      />
    `;
  }

  render() {
    const strings = this.getStrings();
    const color = this.getColor();

    return html`
      <svg viewBox="0 0 213 181">
        ${this.renderDefs(color)}
        <g mask="url(#starMask)">
          ${this.renderStarBody(color)} ${this.renderStrings(strings)}
        </g>
        ${this.renderBaseImage()}
      </svg>
    `;
  }
}
