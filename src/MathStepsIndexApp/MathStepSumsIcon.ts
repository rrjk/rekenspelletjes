import '../IconInfoButton';
import { LitElement, html, css } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { operatorToSymbol } from '../Operator';

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

        icon-info-button {
          width: 80%;
          grid-area: info;
          z-index: 2;
          stroke: white;
          fill: white;
        }
      `,
    ];
  }

  renderInfo(): HTMLTemplateResult {
    return html`<icon-info-button
      description="Nog te maken uit de soort"
    ></icon-info-button>`;
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
