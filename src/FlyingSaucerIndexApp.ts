import { html, css, LitElement } from 'lit';

import { customElement } from 'lit/decorators.js';

import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { Color } from './Colors';

import './IconHourglassButton';
import './FlyingSaucer';

interface RowInfoType {
  description: string;
  shortCodes: string[];
  color: Color;
  text: string;
  symbol1: string;
  symbol2: string;
}

interface SectionInfoType {
  title: string;
  rows: RowInfoType[];
}

const sections: SectionInfoType[] = [
  {
    title: 'Delen met de tafels boven de 10',
    rows: [
      {
        description: 'Delen met de tafel van 11',
        shortCodes: ['ql', 'qm'],
        color: 'red',
        text: '11',
        symbol1: '∶',
        symbol2: '',
      },
      {
        description: 'Delen met de tafel van 12',
        shortCodes: ['qn', 'qo'],
        color: 'orange',
        text: '12',
        symbol1: '∶',
        symbol2: '',
      },
      {
        description: 'Delen met de tafel van 13',
        shortCodes: ['qp', 'qq'],
        color: 'yellow',
        text: '13',
        symbol1: '∶',
        symbol2: '',
      },
      {
        description: 'Delen met de tafel van 14',
        shortCodes: ['qr', 'qs'],
        color: 'lime',
        text: '14',
        symbol1: '∶',
        symbol2: '',
      },
      {
        description: 'Delen met de tafels van 11 tot en met 14 door elkaar',
        shortCodes: ['qt', 'qu'],
        color: 'green',
        text: '11-14',
        symbol1: '∶',
        symbol2: '',
      },
      {
        description: 'Delen met de tafel van 15',
        shortCodes: ['qv', 'qw'],
        color: 'cyan',
        text: '15',
        symbol1: '∶',
        symbol2: '',
      },
      {
        description: 'Delen met de tafel van 16',
        shortCodes: ['qx', 'qy'],
        color: 'blue',
        text: '16',
        symbol1: '∶',
        symbol2: '',
      },
      {
        description: 'Delen met de tafel van 17',
        shortCodes: ['qz', 'ra'],
        color: 'purple',
        text: '17',
        symbol1: '∶',
        symbol2: '',
      },
      {
        description: 'Delen met de tafel van 18',
        shortCodes: ['rb', 'rc'],
        color: 'magenta',
        text: '18',
        symbol1: '∶',
        symbol2: '',
      },
      {
        description: 'Delen met de tafel van 19',
        shortCodes: ['rd', 're'],
        color: 'lavender',
        text: '19',
        symbol1: '∶',
        symbol2: '',
      },
      {
        description: 'Delen met de tafel van 11 tot en met 19 door elkaar',
        shortCodes: ['rf', 'rg'],
        color: 'grey',
        text: '11-19',
        symbol1: '∶',
        symbol2: '',
      },
    ],
  },
  {
    title: 'Delen en vermenigvuldigen door elkaar, met de tafels boven de 10',
    rows: [
      {
        description: 'Delen en vermenigvuldigen met de tafel van 11',
        shortCodes: ['rh', 'ri'],
        color: 'maroon',
        text: '11',
        symbol1: '∶',
        symbol2: '×',
      },
      {
        description: 'Delen en vermenigvuldigen met de tafel van 12',
        shortCodes: ['rj', 'rk'],
        color: 'brown',
        text: '12',
        symbol1: '∶',
        symbol2: '×',
      },
      {
        description: 'Delen en vermenigvuldigen met de tafel van 13',
        shortCodes: ['rl', 'rm'],
        color: 'olive',
        text: '13',
        symbol1: '∶',
        symbol2: '×',
      },
      {
        description: 'Delen en vermenigvuldigen met de tafel van 14',
        shortCodes: ['rn', 'ro'],
        color: 'teal',
        text: '14',
        symbol1: '∶',
        symbol2: '×',
      },
      {
        description:
          'Delen en vermenigvuldigen met de tafels van 11 tot en met 14 door elkaar',
        shortCodes: ['rp', 'rq'],
        color: 'navy',
        text: '11-14',
        symbol1: '∶',
        symbol2: '×',
      },
      {
        description: 'Delen en vermenigvuldigen met de tafel van 15',
        shortCodes: ['rr', 'rs'],
        color: 'pink',
        text: '15',
        symbol1: '∶',
        symbol2: '×',
      },
      {
        description: 'Delen en vermenigvuldigen met de tafel van 16',
        shortCodes: ['rt', 'ru'],
        color: 'apricot',
        text: '16',
        symbol1: '∶',
        symbol2: '×',
      },
      {
        description: 'Delen en vermenigvuldigen met de tafel van 17',
        shortCodes: ['rv', 'rw'],
        color: 'beige',
        text: '17',
        symbol1: '∶',
        symbol2: '×',
      },
      {
        description: 'Delen en vermenigvuldigen met de tafel van 18',
        shortCodes: ['rx', 'ry'],
        color: 'mint',
        text: '18',
        symbol1: '∶',
        symbol2: '×',
      },
      {
        description: 'Delen en vermenigvuldigen met de tafel van 19',
        shortCodes: ['rz', 'sa'],
        color: 'black',
        text: '19',
        symbol1: '∶',
        symbol2: '×',
      },
      {
        description:
          'Delen en vermenigvuldigen met de tafel van 11 tot en met 19 door elkaar',
        shortCodes: ['sb', 'sc'],
        color: 'white',
        text: '11-19',
        symbol1: '∶',
        symbol2: '×',
      },
    ],
  },
];

@customElement('flying-saucer-game-index-app')
export class FlyingSaucerGameIndexApp extends LitElement {
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
          width: 100px;
          height: 90px;
          border-radius: 10px;
        }
        flying-saucer {
          width: 90px;
          height: 70px;
        }
      `,
    ];
  }

  renderButton(
    duration: string,
    shortCode: string,
    text: string,
    symbol1: string,
    symbol2: string,
    color: Color,
    description: string,
  ): HTMLTemplateResult {
    return html`
      <icon-hourglass-button
        title=${description}
        time=${duration}
        shortCode=${shortCode}
      >
      <flying-saucer
          color=${color}
          content=${text}
          symbol1=${symbol1}
          symbol2=${symbol2}
        ></flying-saucer>
      </icon-hourglass-button>
    </div>
    `;
  }

  renderRow(
    durations: string[],
    shortCodes: string[],
    text: string,
    symbol1: string,
    symbol2: string,
    color: Color,
    description: string,
  ): HTMLTemplateResult {
    return html`
      ${this.renderButton(
        durations[0],
        shortCodes[0],
        text,
        symbol1,
        symbol2,
        color,
        description,
      )}
      ${this.renderButton(
        durations[1],
        shortCodes[1],
        text,
        symbol1,
        symbol2,
        color,
        description,
      )}
    `;
  }

  render(): HTMLTemplateResult[] {
    const renderItems: HTMLTemplateResult[] = [
      html`<h2>Vliegende schotel spel</h2>`,
    ];
    for (const section of sections) {
      renderItems.push(html`
        <h3>${section.title}</h3>
        <div class="buttonTable">
          ${section.rows.map(row =>
            this.renderRow(
              ['1min', '3min'],
              row.shortCodes,
              row.text,
              row.symbol1,
              row.symbol2,
              row.color,
              row.description,
            ),
          )}
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
