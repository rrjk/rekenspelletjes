import { LitElement, html, css } from 'lit';
import type { HTMLTemplateResult, CSSResultArray } from 'lit';

import { customElement, state } from 'lit/decorators.js';
import { getGameCodes, getGameDescription } from './GameCodes';
import { getRange } from './NumberHelperFunctions';

type TimeUnitType = 'monthly' | 'weekly';

type CountPerTimeUnitType = {
  timeUnitNmbr: number;
  count: number;
};

type GameStatsType = {
  gameCode: string;
  gameDescription: string;
  gameCounts: CountPerTimeUnitType[];
  totalCount: number;
};

type CountInfo = {
  game: string;
  year: number;
  counts: CountPerTimeUnitType[];
};

const monthMapping = [
  '', // We have an empty string at position zero, as we don't have a month 0.
  'Jan',
  'Feb',
  'Mrt',
  'Apr',
  'Mei',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Okt',
  'Nov',
  'Dec',
];

@customElement('stats-app')
export class StatsApp extends LitElement {
  @state()
  private accessor stats: GameStatsType[] = [];

  @state()
  private accessor nmbrTimeUnits = 1;

  @state()
  private accessor timeUnitType: TimeUnitType = 'monthly';

  @state()
  private accessor totalsPerTimeUnit: CountPerTimeUnitType[] = [];

  @state()
  private accessor grandTotal = 0;

  @state()
  private accessor year = 2020;

  private parseUrl(): void {
    const urlParams = new URLSearchParams(window.location.search);

    const currentDate = new Date();
    this.year = currentDate.getFullYear();

    if (urlParams.has('year')) {
      const yearAsString = urlParams.get('year');
      if (yearAsString) {
        const year = parseInt(yearAsString);
        if (year >= 2000 && year < 2100) {
          this.year = year;
        }
      }
    }

    this.timeUnitType = 'monthly';
    if (urlParams.get('type') === 'weekly') this.timeUnitType = 'weekly';
  }

  constructor() {
    super();
    this.parseUrl();
    this.refreshStatistics();
  }

  private fillTotalsPerTimeUnit() {
    this.totalsPerTimeUnit = [];
    let nmbrTimeUnits = 12;
    if (this.timeUnitType === 'weekly') nmbrTimeUnits = 13;
    for (let i = 1; i <= nmbrTimeUnits; i++)
      this.totalsPerTimeUnit.push({ timeUnitNmbr: i, count: 0 });
  }

  refreshStatistics() {
    this.stats = [];
    this.totalsPerTimeUnit = [];
    fetch(
      `https://counter.jufAnkie.nl/getCount.php?year=${this.year}&type=${this.timeUnitType}&game=${getGameCodes().join(
        ',',
      )}`,
    )
      .then(respons => respons.json())
      .then(json => {
        const countInfoList = json as CountInfo[];
        for (const countInfo of countInfoList) {
          for (const timeUnitCount of countInfo.counts) {
            const totalTimeUnitCount = this.totalsPerTimeUnit.find(
              m => m.timeUnitNmbr === timeUnitCount.timeUnitNmbr,
            );
            if (totalTimeUnitCount !== undefined)
              totalTimeUnitCount.count += timeUnitCount.count;
            else
              this.totalsPerTimeUnit.push({
                timeUnitNmbr: timeUnitCount.timeUnitNmbr,
                count: timeUnitCount.count,
              });
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
        this.grandTotal = this.totalsPerTimeUnit
          .map(t => t.count)
          .reduce((sum, c) => sum + c, 0);
      })
      .catch(() => {
        throw new Error("Can't fetch statistics information");
      });
  }

  handleYearSelection(evt: Event): void {
    console.assert(
      evt.target instanceof HTMLSelectElement,
      'In handleYearSelection, target is not an HTMLSelectElement',
    );
    const newValue = parseInt((evt.target as HTMLSelectElement).value, 10);
    if (!Number.isNaN(newValue) && newValue !== this.year) {
      this.year = newValue;
      this.refreshStatistics();
    }
  }

  handleTimeUnitSelection(evt: Event): void {
    console.assert(
      evt.target instanceof HTMLSelectElement,
      'In handleTimeUnitSelection, target is not an HTMLSelectElement',
    );
    const newValue = (evt.target as HTMLSelectElement).value;
    if (
      newValue !== this.timeUnitType &&
      (newValue === 'monthly' || newValue === 'weekly')
    ) {
      this.timeUnitType = newValue;
      this.refreshStatistics();
    }
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

  renderTimeUnitRowHeaders(): HTMLTemplateResult[] {
    const ret: HTMLTemplateResult[] = [];
    if (this.stats.length > 0) {
      // If there are no stats available yet, ad no column headers
      for (const timeUnitNumber of this.stats[0].gameCounts.map(
        v => v.timeUnitNmbr,
      )) {
        if (this.timeUnitType === 'monthly') {
          ret.push(html`<th>${monthMapping[timeUnitNumber]}</th>`);
        } else if (this.timeUnitType === 'weekly') {
          ret.push(html`<th>Wk${timeUnitNumber}</th>`);
        }
      }
      ret.push(html`<th>Totaal</th>`);
    }
    return ret;
  }

  renderUnitType(): HTMLTemplateResult {
    if (this.timeUnitType === 'monthly') return html`Per maand`;
    else if (this.timeUnitType === 'weekly') return html`Per week`;
    return html`Fout`;
  }

  renderYearSelect(): HTMLTemplateResult {
    const firstYear = 2024;
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const years = getRange(firstYear, currentYear);
    const options = years.map(
      year =>
        html`<option value=${year} ?selected=${year === currentYear}>
          ${year}
        </option>`,
    );
    return html`
      <select
        name="year"
        id="nameSelect"
        @change=${(evt: Event) => this.handleYearSelection(evt)}
      >
        ${options}
      </select>
    `;
  }

  renderTimeUnitSelect(): HTMLTemplateResult {
    return html` <select
      name="timeUnit"
      id="timeUnitSelect"
      @change=${(evt: Event) => this.handleTimeUnitSelection(evt)}
    >
      <option value="monthly" selected>Per maand</option>
      <option value="weekly">Per week</option>
    </select>`;
  }

  /** Render the application */
  render(): HTMLTemplateResult {
    const timeUnitRowHeaders = this.renderTimeUnitRowHeaders();
    return html`
        <b>Jaar: </b>${this.renderYearSelect()}
        <b>Granulariteit: </b>${this.renderTimeUnitSelect()}

        <h1>${this.year} - ${this.renderUnitType()}</h1>

        <table border="1">
          <tr>
            <th rowspan="2">Spelcode</th>
            <th rowspan="2">Beschrijving</th>
            <th colspan=${timeUnitRowHeaders.length}>Aantal keer gespeeld</th>
          </tr>
          <tr>
            ${timeUnitRowHeaders}
          </tr>

          ${this.stats.map(
            stat =>
              html`<tr>
                <td>${stat.gameCode}</td>
                <td>${stat.gameDescription}</td>
                ${stat.gameCounts.map(
                  timeUnitCount => html`<td>${timeUnitCount.count}</td>`,
                )}
                <td>${stat.totalCount}</td>
              </tr>`,
          )}
          <tr>
            <td>Totaal</td>
            <td>Totaal voor alle spellen</td>
            ${this.totalsPerTimeUnit.map(
              timeUnitTotal => html` <td>${timeUnitTotal.count}</td>`,
            )}
            <td>
              ${this.grandTotal}
            </td>
          </tr>
        </table>
      </select>
    `;
  }
}
