import '../IconInfoButton';
import { LitElement, html, css } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { operatorToSymbol } from '../Operator';

export const mathSteps = [
  'PlusMinusTill10',
  'PlusMinusTill20',
  'PlusMinusTill100',
  'MultiplicationTill10',
  'MultiplicationDivisionTill10',
  'Alltill100',
  'Alltill1000',
] as const;

export type MathStep = (typeof mathSteps)[number];

type TitleDescription = {
  title: string;
  description: string;
};

const mathStepTitles: Record<MathStep, TitleDescription> = {
  PlusMinusTill10: {
    title: `${operatorToSymbol('plus')} ${operatorToSymbol('minus')} tot 10`,
    description: 'Plus- en minsommen tot en met 10',
  },
  PlusMinusTill20: {
    title: `${operatorToSymbol('plus')} ${operatorToSymbol('minus')} tot 20`,
    description: 'Plus- en minsommen tot en met 20',
  },
  PlusMinusTill100: {
    title: `${operatorToSymbol('plus')} ${operatorToSymbol('minus')} tot 100`,
    description: 'Plus- en minsommen tot en met 100',
  },
  MultiplicationTill10: {
    title: `${operatorToSymbol('times')} tot 10`,
    description: 'Keersommen met de tafeltjes tot en met 10',
  },
  MultiplicationDivisionTill10: {
    title: `${operatorToSymbol('times')} ${operatorToSymbol('divide')} tot 10`,
    description: 'Keer- en deelsommen met de tafeltjes tot en met 10',
  },
  Alltill100: {
    title: `${operatorToSymbol('plus')} ${operatorToSymbol('minus')} ${operatorToSymbol('times')} ${operatorToSymbol('divide')} tot 100`,
    description: 'Alle sommen door elkaar met antwoorden tot en met 100',
  },
  Alltill1000: {
    title: `${operatorToSymbol('plus')} ${operatorToSymbol('minus')} ${operatorToSymbol('times')} ${operatorToSymbol('divide')} tot 1000`,
    description: 'Alle sommen door elkaar met antwoorden tot en met 1000',
  },
};

@customElement('math-step-sums-icon')
export class MathStepSumsIcon extends LitElement {
  @property()
  accessor mathStep: MathStep = 'PlusMinusTill20';

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
          background-color: blue;
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
      `,
    ];
  }

  renderInfo(): HTMLTemplateResult {
    return html`<icon-info-button
      description=${mathStepTitles[this.mathStep].description}
    ></icon-info-button>`;
  }

  renderTitleAsSVG(): HTMLTemplateResult {
    return html`
      <svg id="title" viewBox="0 0 200 10">
        <text x="2" y="8" font-size="8px">
          ${mathStepTitles[this.mathStep].title}
        </text>
      </svg>
    `;
  }

  renderTitle(): HTMLTemplateResult {
    return html`<span id="title">${mathStepTitles[this.mathStep].title}</span>`;
  }

  render(): HTMLTemplateResult {
    return html`
      <div class="card">${this.renderTitle()} ${this.renderInfo()}</div>
    `;
  }
}
