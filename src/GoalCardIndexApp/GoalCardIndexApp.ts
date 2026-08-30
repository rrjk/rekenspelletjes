import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';
import type { GameCode } from '../GameCodes';

import type { TimeCode } from '../TimeCodes';

import { RenderGameIconFunction } from '../RenderGameIconFunction';
import { ClassInfo } from 'lit/directives/class-map.js';
import { Row, SectionInfoList } from './SectionInfoType';

type PageName = 'defaultPage';

export function convertIndexPage(value: string | null): PageName {
  switch (value) {
    case 'defaultPage':
      return value;
    default:
      return 'defaultPage';
  }
}

export interface IndexPage {
  defaultPage: SectionInfoList;
}

export abstract class GoalCardIndexApp extends LitElement {
  @property({ converter: convertIndexPage })
  accessor indexPage: PageName = 'defaultPage';

  get pageTitle(): string {
    return `To be set by subclass`;
  }

  protected sections: IndexPage = { defaultPage: [] };

  static get styles(): CSSResultArray {
    return [
      css`
        :host {
          font-size: x-large;
        }
        .buttonTable {
          position: relative;
          display: grid;
          row-gap: 10px;
          column-gap: 10px;
          grid-template-columns: repeat(2, 1fr);
          justify-content: space-around;
          justify-items: center;
          width: min(400px, 90vw);
        }

        .centeredGameIcon {
          width: calc(50% - 5px);
          grid-column-start: 1;
          grid-column-end: span 2;
        }

        .leftGameIcon {
          width: 100%;
          grid-column-start: 1;
          grid-column-end: span 1;
        }

        .rightGameIcon {
          width: 100%;
          grid-column-start: 2;
          grid-column-end: span 1;
        }
      `,
    ];
  }

  abstract iconFunctions: Record<GameCode, RenderGameIconFunction>;

  renderGameIcon(
    game: GameCode,
    variant: string,
    position: 'left' | 'right' | 'center' = 'center',
    timeCode?: TimeCode,
  ): HTMLTemplateResult {
    const classes: ClassInfo = {
      leftGameIcon: position === 'left',
      rightGameIcon: position === 'right',
      centeredGameIcon: position === 'center',
    };

    return this.iconFunctions[game](variant, classes, timeCode);
  }

  renderRow(row: Row): HTMLTemplateResult {
    if (row.entries.length === 2) {
      return html`
        ${this.renderGameIcon(
          row.entries[0].game,
          row.entries[0].variant,
          'left',
          row.entries[0].timeCode,
        )}
        ${this.renderGameIcon(
          row.entries[1].game,
          row.entries[1].variant,
          'right',
          row.entries[1].timeCode,
        )}
      `;
    }
    if (row.entries.length === 1) {
      return html`${this.renderGameIcon(
        row.entries[0].game,
        row.entries[0].variant,
        'center',
        row.entries[0].timeCode,
      )}`;
    }
    throw new Error(
      'Unsupported number of entries in row: ' + row.entries.length,
    );
  }

  render(): HTMLTemplateResult[] {
    const renderItems: HTMLTemplateResult[] = [];
    renderItems.push(html`<h1>${this.pageTitle}</h1> `);
    for (const section of this.sections[this.indexPage]) {
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
