import '../IconInfoButton';
import { LitElement, html, css, nothing } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('math-step-sums-icon')
export class MathStepSumsIcon extends LitElement {
  @property()
  accessor description = ``;

  @property()
  accessor title = ``;

  @property()
  accessor link: URL | undefined = undefined;

  static get styles(): CSSResultGroup {
    return [
      css`
        :host {
          display: inline-block;
          position: relative;
          container-type: size;
        }

        div.card {
          width: 100cqw;
          height: 100cqh;
          display: grid;
          grid-template-columns: 50cqh 1fr 100cqh;
          grid-template-rows: 100%;
          grid-template-areas: 'blank title info';
          justify-items: left;
          align-items: center;
          box-sizing: border-box;
          background-color: transparent;
        }

        svg#title {
          grid-area: title;
          height: 100%;
          width: 100%;
          font-family: 'Arial';
          font-weight: 700;
          fill: #ffffff;
          stroke: #000000;
          paint-order: stroke;
          text-anchor: left;
          dominant-baseline: auto;
        }

        span#title {
          grid-area: title;
          font-size: 80cqh;
          -webkit-text-stroke: black 10cqh;
          color: white;
          font-family: 'Arial';
          font-weight: 700;
          paint-order: stroke fill;
        }

        icon-info-button {
          width: 80%;
          grid-area: info;
          z-index: 2;
          stroke: white;
          fill: white;
        }

        a.stretched-link {
          text-decoration: none;
          position: absolute;
          inset: 0; /* top:0; right:0; bottom:0; left:0 */
          z-index: 1;
        }
      `,
    ];
  }

  renderInfo(): HTMLTemplateResult {
    return html`<icon-info-button
      description=${this.description}
    ></icon-info-button>`;
  }

  renderTitle(): HTMLTemplateResult {
    return html`<span id="title">${this.title}</span>`;
  }

  renderLink(): HTMLTemplateResult | typeof nothing {
    if (this.link) {
      return html`<a class="stretched-link" href=${this.link}></a>`;
    }
    return nothing;
  }

  render(): HTMLTemplateResult {
    return html`
      <div class="card">
        ${this.renderLink()} ${this.renderTitle()} ${this.renderInfo()}
      </div>
    `;
  }
}
