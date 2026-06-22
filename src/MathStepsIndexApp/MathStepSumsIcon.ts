import { LitElement, html, css } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { operatorToSymbol } from '../Operator';

/* The following import are only used to store the iButton reference. Once the source property of
 * the ToggleEvent gets widescale support, these imports can be removed and the button can
 * be obtained from the event.
 * See https://caniuse.com/mdn-api_toggleevent_source for more details on the support of the source property.
 */
import { createRef, Ref, ref } from 'lit/directives/ref.js';

type MathStep =
  | 'PlusMinusTill10'
  | 'PlusMinusTill20'
  | 'PlusMinusTill100'
  | 'MultiplicationTill10'
  | 'MultiplicationDivisionTill10'
  | 'Alltill100'
  | 'Alltill1000';

@customElement('math-step-sums-icon')
export class MathStepSumsIcon extends LitElement {
  static aspectRatio = 212 / 12;

  /* The iButton reference is used to keep track of the information button event. Once the source property of
   * the ToggleEvent gets widescale support, we no longer need this reference and the button can
   * be obtained from the event.
   * See https://caniuse.com/mdn-api_toggleevent_source for more details on the support of the source property.
   */
  iButton: Ref<HTMLButtonElement> = createRef();

  @property()
  accessor mathStep: MathStep = 'PlusMinusTill10';
  static get styles(): CSSResultGroup {
    return [
      css`
        :host {
          display: block;
          position: relative;
          container-type: size;
          background-color: violet;
        }

        div.card {
          aspect-ratio: ${this.aspectRatio};
          min-width: 0;
          min-height: 0;
          display: grid;
          grid-template-columns: ${(20 / 21) * 100}% ${(1 / 20) * 100}%;
          grid-template-rows: 100%;
          grid-template-areas: 'title info';
          justify-items: center;
          align-items: center;
          box-sizing: border-box;
          background-color: blue;
        }

        @container (aspect-ratio > ${this.aspectRatio}) {
          div.card {
            height: 100cqh;
            border: ${(1 / 12) * 100}cqh solid black;
            border-radius: ${(3 / 12) * 100}cqh;
          }
        }
        @container (aspect-ratio <= ${this.aspectRatio}) {
          div.card {
            width: 100cqw;
            border: ${(1 / 212) * 100}cqw solid black;
            border-radius: ${(3 / 212) * 100}cqw;
          }
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

        button#infoButton {
          min-width: 0;
          min-height: 0;
          aspect-ratio: 1;
          width: 80%;
          grid-area: info;
          border: none;
          margin: 0;
          padding: 0;
          background-color: transparent;
          z-index: 2;
        }

        svg#infoIcon {
          display: block;
          width: 100%;
          height: 100%;
          font-size: 70px;
          dominant-baseline: middle;
          text-anchor: middle;
          font-family: 'Georgia';
          fill: grey;
        }
      `,
    ];
  }

  renderInfo(): HTMLTemplateResult {
    return html` <button
      id="infoButton"
      popovertarget="description"
      ${ref(this.iButton)}
    >
      <svg id="infoIcon" viewBox="-50 -50 100 100">
        <circle
          cx="0"
          cy="0"
          r="45"
          fill="none"
          stroke="grey"
          stroke-width="5px"
        />
        <text x="0" y="7">i</text>
      </svg>
    </button>`;
  }

  renderTitle(): HTMLTemplateResult {
    return html`
      <svg id="title" viewBox="0 0 200 10">
        <text x="2" y="8" font-size="8px">
          ${operatorToSymbol('plus')} ${operatorToSymbol('minus')} tot 10
        </text>
      </svg>
    `;
  }

  render(): HTMLTemplateResult {
    return html`
      <div class="card">${this.renderTitle()} ${this.renderInfo()}</div>
    `;
  }
}
