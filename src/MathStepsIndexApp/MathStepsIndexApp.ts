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
import './MathStepSumsIcon';
import { operatorToSymbol } from '../Operator';

interface SumTypeInfo {
  id: string;
  description: string;
  title: string;
  gamesAvailable: boolean;
}

interface SumTypeGroupInfo {
  id: string;
  description: string;
  title: string;
  sumTypes: SumTypeInfo[];
}

const sumTypeGroups: SumTypeGroupInfo[] = [
  {
    id: 'PlusMinusTill10',
    description: 'Plus- en minsommen tot en met 10',
    title: `${operatorToSymbol('plus')} ${operatorToSymbol('minus')} tot 10`,
    sumTypes: [
      {
        id: 'num10',
        description: 'Getalbegrip tot 10',
        title: 'Getalbegrip tot 10',
        gamesAvailable: true,
      },
      {
        id: '3p4',
        description: `Plussommen tot en met 10`,
        title: '3 + 4',
        gamesAvailable: true,
      },
      {
        id: 'split',
        description: `Splitsen van de getallen tot en met 10`,
        title: 'Splitsen',
        gamesAvailable: true,
      },
      {
        id: '7m5',
        description: `Minsommen tot en met 10`,
        title: `7 ${operatorToSymbol('minus')} 5`,
        gamesAvailable: true,
      },
      {
        id: '10m2',
        description: `Minsommen met de eerste term 10`,
        title: `10 ${operatorToSymbol('minus')} 2`,
        gamesAvailable: false,
      },
      {
        id: '6pi10',
        description: `Sommen met aanvullen tot 10 `,
        title: '6 + .. = 10',
        gamesAvailable: false,
      },
    ],
  },
  {
    id: 'PlusMinusTill20',
    description: 'Plus- en minsommen tot en met 20',
    title: `${operatorToSymbol('plus')} ${operatorToSymbol('minus')} tot 20`,
    sumTypes: [
      {
        id: 'num20',
        description: `Getalbegrip tot 20`,
        title: 'Getal begrip tot 20',
        gamesAvailable: true,
      },
      {
        id: '10p4',
        description: `Plussommem met 10 als eerste term en een getal met één cijfer als tweede term`,
        title: '10 + 4',
        gamesAvailable: false,
      },
      {
        id: '13p4',
        description: `Plussommen tussen de 10 en de 20`,
        title: '13 + 4',
        gamesAvailable: true,
      },
      {
        id: '17m5',
        description: `Minsommen tussen de 10 en de 20`,
        title: `17 ${operatorToSymbol('minus')} 5`,
        gamesAvailable: true,
      },
      {
        id: '6p8',
        description: `Plussommen tussen de 1 en en 20, waarbij er over het tiental heen gesprongen wordt`,
        title: '6 + 8',
        gamesAvailable: false,
      },
      {
        id: '16mi10',
        description: `Minsommen tot en met 20, waarbij het antwoord 10 is en de tweede term ingevuld moet worden.`,
        title: `16 ${operatorToSymbol('minus')} ... = 10`,
        gamesAvailable: false,
      },
      {
        id: '16m8',
        description: `Minsommen tussen de 1 en en 20, waarbij er over het tiental heen gesprongen wordt`,
        title: `16 ${operatorToSymbol('minus')} 8`,
        gamesAvailable: false,
      },
    ],
  },
];

@customElement('math-steps-index-app')
export class MathStepsIndexApp extends LitElement {
  static mathStepsSumsIconHeight = 30;
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
          display: flex;
          align-items: center;
          gap: 0.5em;
          list-style: none;
          cursor: pointer;
          font-size: calc(0.7 * ${unsafeCSS(this.mathStepsSumsIconHeight)}px);
          font-weight: bold;
          cursor: pointer;
          background-color: ${unsafeCSS(
            getColorInfo('summaryBar').mainColorCode,
          )};
          border: 3px solid
            ${unsafeCSS(getColorInfo('summaryBar').accentColorCode)};
          border-radius: 10px;
          padding: 5px;
          color: white;
          font-color: white;
        }

        summary::-webkit-details-marker {
          display: none;
        }

        .arrow {
          transition: transform 0.2s;
        }

        details[open] summary .arrow {
          transform: rotate(90deg);
        }

        math-step-sums-icon {
          display: inline-block;
          vertical-align: middle;
          width: 100%;
          height: ${unsafeCSS(this.mathStepsSumsIconHeight)}px;
        }

        details {
          margin-bottom: 1em;
          border-radius: 10px;
          padding: 5px;
          background-color: ${unsafeCSS(
            getColorInfo('menuBackground').mainColorCode,
          )};
          border: 3px solid
            ${unsafeCSS(getColorInfo('menuBackground').accentColorCode)};
        }

        li {
          margin: 0.5em 0;
          border-radius: 10px;
          padding: 0.5em;
          list-style: none;
        }

        li.active {
          background-color: ${unsafeCSS(
            getColorInfo('detailsBar').mainColorCode,
          )};
          border: 3px solid
            ${unsafeCSS(getColorInfo('detailsBar').accentColorCode)};
        }

        li.inactive {
          background-color: ${unsafeCSS(
            getColorInfo('inactiveDetailsBar').mainColorCode,
          )};
          border: 3px solid
            ${unsafeCSS(getColorInfo('inactiveDetailsBar').accentColorCode)};
        }
      `,
    ];
  }

  renderSumType(sumType: SumTypeInfo): HTMLTemplateResult {
    if (sumType.gamesAvailable) {
      return html`
        <li class="active">
          <math-step-sums-icon
            link="../../Rekenspelletjes/SumTypeIndex-${sumType.id}.html"
            description=${sumType.description}
            title=${sumType.title}
          ></math-step-sums-icon>
        </li>
      `;
    } else {
      return html`
        <li class="inactive">
          <math-step-sums-icon
            link=""
            description="${sumType.description} (Wordt nog ontwikkeld)"
            title=${sumType.title}
          ></math-step-sums-icon>
        </li>
      `;
    }
  }

  renderSumTypeGroup(group: SumTypeGroupInfo): HTMLTemplateResult {
    const sumTypesHTML: HTMLTemplateResult[] = group.sumTypes.map(sumType => {
      return this.renderSumType(sumType);
    });
    return html`
      <details name="menu">
        <summary>
          <span class="arrow">▶</span>
          <math-step-sums-icon
            description=${group.description}
            title=${group.title}
          ></math-step-sums-icon>
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
    return [html`<h1>Rekenstappen</h1>`, ...sumTypeGroupsHTML];
  }
}
