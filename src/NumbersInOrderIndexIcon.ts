import { LitElement, html, css, svg } from 'lit';
import type {
  HTMLTemplateResult,
  CSSResultGroup,
  SVGTemplateResult,
} from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, property } from 'lit/decorators.js';

@customElement('numbers-in-order-index-icon')
export class NumbersInOrderIndexIcon extends LitElement {
  @property({ type: String })
  text = '';
  @property({ type: Boolean })
  die = false;

  dieImage = new URL('../images/die200.png', import.meta.url);

  static get styles(): CSSResultGroup {
    return css``;
  }

  render(): HTMLTemplateResult {
    let content: SVGTemplateResult;

    if (!this.die) {
      content = svg`
        <text
          font-size="45px"
          font-style="italic"
          x="50%"
          y="50%"
          dominant-baseline="central"
          text-anchor="middle"
        >
          ${this.text}
        </text>
`;
    } else {
      content = svg`<image x="90" y="10" height="70" href="${this.dieImage}"></image>`;
    }
    return html` <svg viewBox="0 0 250 90" style="width: 300px">
      <rect
        x="12"
        y="5"
        width="225"
        height="80"
        ry="20"
        rx="20"
        fill="white"
        stroke="purple"
        stroke-width="5"
      ></rect>
      ${content}
    </svg>`;
  }
}
