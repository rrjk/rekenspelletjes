import { LitElement, html, css } from 'lit';
import type { HTMLTemplateResult, CSSResultArray } from 'lit';

// eslint-disable-next-line import/extensions
import { customElement, state } from 'lit/decorators.js';
import { getGameCodes, getGameDescription } from './GameCodes';

type CountPerMonthType = {
  month: number;
  count: number;
};

type GameStatsType = {
  gameCode: string;
  gameDescription: string;
  gameCounts: CountPerMonthType[];
  totalCount: number;
};

type CountInfo = {
  game: string;
  year: number;
  counts: CountPerMonthType[];
};

@customElement('stats-app')
export class StatsApp extends LitElement {
  @state()
  private stats: GameStatsType[] = [];

  @state()
  private totalsPerMonth: CountPerMonthType[] = [
    { month: 1, count: 0 },
    { month: 2, count: 0 },
    { month: 3, count: 0 },
    { month: 4, count: 0 },
    { month: 5, count: 0 },
    { month: 6, count: 0 },
    { month: 7, count: 0 },
    { month: 8, count: 0 },
    { month: 9, count: 0 },
    { month: 10, count: 0 },
    { month: 11, count: 0 },
    { month: 12, count: 0 },
  ];

  constructor() {
    super();
    fetch(
      `https://counter.jufAnkie.nl/getCount.php?game=${getGameCodes().join(
        ','
      )}`
    )
      .then(respons => respons.json())
      .then(json => {
        const countInfoList = json as CountInfo[];
        for (const countInfo of countInfoList) {
          for (const monthlyCount of countInfo.counts) {
            const totalMonthCount = this.totalsPerMonth.find(
              m => m.month === monthlyCount.month
            );
            if (totalMonthCount !== undefined)
              totalMonthCount.count += monthlyCount.count;
          }
          this.stats.push({
            gameCode: countInfo.game,
            gameDescription: getGameDescription(countInfo.game),
            gameCounts: countInfo.counts,
            totalCount: countInfo.counts
              .map(gc => gc.count)
              .reduce((sum, c) => sum + c),
          });
        }
        this.requestUpdate();
      });
  }

  static get styles(): CSSResultArray {
    return [
      css`
        .wholeScreen {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
        }
      `,
    ];
  }

  /** Render the application */
  render(): HTMLTemplateResult {
    return html`
      <table border="1">
        <tr>
          <th rowspan="2">Spelcode</th>
          <th rowspan="2">Beschrijving</th>
          <th colspan="13">Aantal keer gespeeld</th>
        </tr>
        <tr>
          <th>Jan</th>
          <th>Feb</th>
          <th>Mrt</th>
          <th>Apr</th>
          <th>Mei</th>
          <th>Jun</th>
          <th>Jul</th>
          <th>aug</th>
          <th>Sep</th>
          <th>Okt</th>
          <th>Nov</th>
          <th>Dec</th>
          <th>Totaal</th>
        </tr>

        ${this.stats.map(
          stat =>
            html`<tr>
              <td>${stat.gameCode}</td>
              <td>${stat.gameDescription}</td>
              ${stat.gameCounts.map(
                monthlyCount => html`<td>${monthlyCount.count}</td>`
              )}
              <td>${stat.totalCount}</td>
            </tr>`
        )}
        <tr>
          <td>Totaal</td>
          <td>Totaal voor alle spellen</td>
          ${this.totalsPerMonth.map(
            monthlyTotal => html` <td>${monthlyTotal.count}</td>`
          )}
          <td>
            ${this.totalsPerMonth.map(t => t.count).reduce((sum, c) => sum + c)}
          </td>
        </tr>
      </table>
    `;
  }
}
