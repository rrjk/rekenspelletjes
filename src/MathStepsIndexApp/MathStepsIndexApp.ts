import {
  LitElement,
  HTMLTemplateResult,
  html,
  CSSResultArray,
  css,
  unsafeCSS,
} from 'lit';
import { customElement } from 'lit/decorators.js';
import { getColorInfo } from '../Colors';
import { type MathStep } from './MathStepSumsIcon';
import './MathStepSumsIcon';

interface SumTypeInfo {
  id: string;
  content: HTMLTemplateResult;
}

interface SumTypeGroupInfo {
  id: MathStep;
  sumTypes: SumTypeInfo[];
}

const sumTypeGroups: SumTypeGroupInfo[] = [
  {
    id: 'PlusMinusTill10',
    sumTypes: [
      {
        id: 'num10',
        content: html`Getalbegrip tot 10`,
      },
      {
        id: 's5p2',
        content: html`Sommen als 5 + 2`,
      },
      {
        id: 'split',
        content: html`Splitsen`,
      },
      {
        id: 's7m2',
        content: html`Sommen als 7 - 2`,
      },
      {
        id: 's10m2',
        content: html`Sommen als 10 - 2`,
      },
      {
        id: 's6pi10',
        content: html`Sommen als 6 + .. = 10`,
      },
    ],
  },
  {
    id: 'PlusMinusTill20',
    sumTypes: [
      {
        id: 'num20',
        content: html`Getalbegrip tot 20`,
      },
      {
        id: 's10p4',
        content: html`Sommen als 10 + 4`,
      },
      {
        id: 's15p2',
        content: html`Sommen als 15 + 2`,
      },
      {
        id: 's17m2',
        content: html`Sommen als 17 - 2`,
      },
      {
        id: 's6p8',
        content: html`Sommen als 6 + 8`,
      },
      {
        id: 's16mi10',
        content: html`Sommen als 16 - ... = 10`,
      },
      {
        id: 's16m8',
        content: html`Sommen als 16 - 8`,
      },
    ],
  },
];

@customElement('math-steps-index-app')
export class MathStepsIndexApp extends LitElement {
  static get styles(): CSSResultArray {
    return [
      css`
        :host {
          display: block;
          margin: 5%;
        }

        a.stretched-link {
          text-decoration: none;
          position: absolute;
          inset: 0; /* top:0; right:0; bottom:0; left:0 */
          z-index: 1;
        }

        summary {
          font-size: 1.5em;
          font-weight: bold;
          cursor: pointer;
          background-color: blue;
          border: 3px solid darkblue;
          border-radius: 10px;
          padding: 0.5em;
          color: white;
          font-color: white;
        }

        math-step-sums-icon {
          display: inline-block;
          vertical-align: middle;
          width: 90%;
          height: 40px;
        }

        details {
          margin-bottom: 1em;
          background-color: lightblue;
          border: 3px solid blue;
          border-radius: 10px;
          padding: 0.5em;
        }

        li {
          margin: 0.5em 0;
          background-color: ${unsafeCSS(
            getColorInfo('lavender').mainColorCode,
          )};
          border: 3px solid
            ${unsafeCSS(getColorInfo('lavender').accentColorCode)};
          border-radius: 10px;
          padding: 0.5em;
          list-style: none;
        }
      `,
    ];
  }

  renderSumTypeGroup(group: SumTypeGroupInfo): HTMLTemplateResult {
    const sumTypesHTML: HTMLTemplateResult[] = group.sumTypes.map(sumType => {
      return html`
        <li>
          <a href="../rekenspelletjes/${sumType.id}-index.html"
            >${sumType.content}</a
          >
        </li>
      `;
    });
    //<math-step-sums-icon math-step=${group.id}></math-step-sums-icon>
    return html`
      <details name="menu">
        <summary>
          <math-step-sums-icon mathStep=${group.id}></math-step-sums-icon>
        </summary>
        <ul>
          ${sumTypesHTML}
        </ul>
      </details>
    `;
  }

  render(): HTMLTemplateResult[] {
    const sumTypeGroupsHTML: HTMLTemplateResult[] = sumTypeGroups.map(group =>
      this.renderSumTypeGroup(group),
    );
    return sumTypeGroupsHTML;
  }
}
