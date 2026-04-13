import { html, css, LitElement } from 'lit';

import { customElement } from 'lit/decorators.js';

import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import './MultiplicationTablesBalloonHourglassGameIcon';

interface SectionInfoType {
  title: string;
  rows: string[];
}

const sections: SectionInfoType[] = [
  {
    title: 'Balonnenspel: tafeltjes oefenen',
    rows: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'],
  },
];

const durations = ['a', 'b'];

@customElement('balloon-multiplication-game-index-app-v2')
export class BalloonMultiplicationGameIndexApp extends LitElement {
  static get styles(): CSSResultArray {
    return [
      css`
        :host {
          font-size: x-large;
        }
        .buttonTable {
          position: relative;
          display: flex;
          row-gap: 10px;
          flex-wrap: wrap;
          justify-content: space-around;
          width: min(400px, 90vw);
        }
        multiplication-tables-balloon-hourglass-game-icon {
          width: 47%;
        }
      `,
    ];
  }

  renderRow(variant: string): HTMLTemplateResult {
    return html`
      <multiplication-tables-balloon-hourglass-game-icon
        variant=${variant}
        timeCode=${durations[0]}
      ></multiplication-tables-balloon-hourglass-game-icon>
      <multiplication-tables-balloon-hourglass-game-icon
        variant=${variant}
        timeCode=${durations[1]}
      ></multiplication-tables-balloon-hourglass-game-icon>
    `;
  }

  render(): HTMLTemplateResult[] {
    const renderItems: HTMLTemplateResult[] = [];
    for (const section of sections) {
      renderItems.push(html`
        <h2>${section.title}</h2>
        <div class="buttonTable">
          ${section.rows.map(row => this.renderRow(row))}
        </div>
      `);
    }
    renderItems.push(
      html` <p>
        <a href="index.html">Terug naar het hoofdmenu</a>
      </p>`,
    );
    return renderItems;
  }
}
