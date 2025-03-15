import { html, css, LitElement } from 'lit';

// eslint-disable-next-line import/extensions
import { customElement } from 'lit/decorators.js';

import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { Color, getColorInfo } from './Colors';

import './IconHourglassButton';
import './FractionElement';
import { FractionPairMatchingGameType } from './FractionsPairMatchingAppLink';
import { Fraction, FractionRepresentation } from './Fraction';

interface RowInfoType {
  description: string;
  shortCodes: string[];
  color: Color;
  gameType: FractionPairMatchingGameType;
}

interface SectionInfoType {
  title: string;
  rows: RowInfoType[];
}

const sections: SectionInfoType[] = [
  {
    title: 'Sleep dezelfde breuken over elkaar heen',
    rows: [
      {
        description: 'Sleep een breuk over het juiste cirkeldiagram',
        shortCodes: ['ph', 'pi'],
        color: 'teal',
        gameType: 'fractionToPie',
      },
      {
        description:
          'Sleep twee breuken die vereenvoudigd hetzelfde zijn over elkaar heen',
        shortCodes: ['pj', 'pk'],
        color: 'cyan',
        gameType: 'equalFractions',
      },
      {
        description: 'Sleep een breuk over het juiste cirkeldiagram',
        shortCodes: ['pl', 'pm'],
        color: 'blue',
        gameType: 'fractionToDecimal',
      },
      {
        description: 'Sleep een breuk over het juiste cirkeldiagram',
        shortCodes: ['pn', 'po'],
        color: 'purple',
        gameType: 'fractionToPercentage',
      },
      {
        description: 'Sleep een breuk over het juiste cirkeldiagram',
        shortCodes: ['pp', 'pq'],
        color: 'lavender',
        gameType: 'percentageToDecimal',
      },
      {
        description: 'Sleep een breuk over het juiste cirkeldiagram',
        shortCodes: ['pr', 'ps'],
        color: 'magenta',
        gameType: 'percentageToPie',
      },
    ],
  },
];

@customElement('fractions-pair-matching-game-index-app')
export class FractionsPairMatchingGameIndexApp extends LitElement {
  static get styles(): CSSResultArray {
    return [
      css`
        :host {
          font-size: x-large;
        }
        .buttonTable {
          position: relative;
          display: flex;
          gap: 10px 10px;
          flex-wrap: wrap;
          width: 410px;
        }
        div.button {
          display: grid;
          grid-template-columns: 45% 45%;
          justify-items: center;
          width: 100px;
          height: 90px;
          border-radius: 10px;
        }
      `,
    ];
  }

  renderButton(
    duration: string,
    shortCode: string,
    gameType: FractionPairMatchingGameType,
    color: Color,
    description: string,
  ): HTMLTemplateResult {
    let leftRepresentation: FractionRepresentation = 'fraction';
    let leftFraction: Fraction = new Fraction();
    let rightRepresentation: FractionRepresentation = 'piechart';
    let rightFraction: Fraction = new Fraction();

    if (gameType === 'equalFractions') {
      leftRepresentation = 'fraction';
      leftFraction = new Fraction(3, 4);
      rightRepresentation = 'fraction';
      rightFraction = new Fraction(6, 8);
    } else if (gameType === 'fractionToDecimal') {
      leftRepresentation = 'fraction';
      leftFraction = new Fraction(3, 5);
      rightRepresentation = 'decimal';
      rightFraction = new Fraction(3, 5);
    } else if (gameType === 'fractionToPercentage') {
      leftRepresentation = 'fraction';
      leftFraction = new Fraction(7, 10);
      rightRepresentation = 'percentage';
      rightFraction = new Fraction(7, 10);
    } else if (gameType === 'fractionToPie') {
      leftRepresentation = 'fraction';
      leftFraction = new Fraction(2, 3);
      rightRepresentation = 'piechart';
      rightFraction = new Fraction(2, 3);
    } else if (gameType === 'percentageToDecimal') {
      leftRepresentation = 'percentage';
      leftFraction = new Fraction(1, 4);
      rightRepresentation = 'decimal';
      rightFraction = new Fraction(1, 4);
    } else if (gameType === 'percentageToPie') {
      leftRepresentation = 'percentage';
      leftFraction = new Fraction(2, 5);
      rightRepresentation = 'piechart';
      rightFraction = new Fraction(2, 5);
    }

    return html`
      <icon-hourglass-button
        title="${description}"
        time="${duration}"
        shortCode="${shortCode}"
      >
        <div style="background-color:${getColorInfo(color).mainColorCode}" class="button">
           <fraction-element .fraction=${leftFraction} .representation=${leftRepresentation}></fraction-element>
           <fraction-element .fraction=${rightFraction} .representation=${rightRepresentation}></fraction-element>
        </div>
      </icon-hourglass-button>
    </div>
    `;
  }

  renderRow(
    durations: string[],
    shortCodes: string[],
    gameType: FractionPairMatchingGameType,
    color: Color,
    description: string,
  ): HTMLTemplateResult {
    return html`
      ${this.renderButton(
        durations[0],
        shortCodes[0],
        gameType,
        color,
        description,
      )}
      ${this.renderButton(
        durations[1],
        shortCodes[1],
        gameType,
        color,
        description,
      )}
    `;
  }

  render(): HTMLTemplateResult[] {
    const renderItems: HTMLTemplateResult[] = [
      html`<h2>Breukenspelletjes</h2>`,
    ];
    for (const section of sections) {
      renderItems.push(html`${section.title}`);
      renderItems.push(
        html`<div class="buttonTable">
          ${section.rows.map(row =>
            this.renderRow(
              ['1min', '3min'],
              row.shortCodes,
              row.gameType,
              row.color,
              row.description,
            ),
          )}
        </div>`,
      );
    }
    return renderItems;
  }
}
