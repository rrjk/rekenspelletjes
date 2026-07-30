import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import type { TimeCode } from '../TimeCodes';

import { RenderGameIconFunction } from '../RenderGameIconFunction';
import { ClassInfo } from 'lit/directives/class-map.js';

type IndexPage = 'defaultPage';

export function convertIndexPage(value: string | null): IndexPage {
  switch (value) {
    case 'defaultPage':
      return value;
    default:
      return 'defaultPage';
  }
}

interface RowType<Game> {
  game: Game;
  variant: string;
  timeCodes: TimeCode[];
}

interface SectionInfoType<Game> {
  title: string;
  rows: RowType<Game>[];
}

export interface IndexPageType<Game> {
  defaultPage: SectionInfoType<Game>[];
}

export abstract class SumTypeIndexApp<Game extends string> extends LitElement {
  @property({ converter: convertIndexPage })
  accessor indexPage: IndexPage = 'defaultPage';

  get pageTitle(): string {
    return `To be set by subclass`;
  }

  get sections(): IndexPageType<Game> {
    return {
      defaultPage: [],
    };
  }

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

  abstract iconFunctions: Record<Game, RenderGameIconFunction>;

  renderGameIcon(
    game: Game,
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

  renderRow(row: RowType<Game>): HTMLTemplateResult {
    if (row.timeCodes.length === 2) {
      return html`
        ${this.renderGameIcon(row.game, row.variant, 'left', row.timeCodes[0])}
        ${this.renderGameIcon(row.game, row.variant, 'right', row.timeCodes[1])}
      `;
    }
    if (row.timeCodes.length === 1) {
      return html`${this.renderGameIcon(
        row.game,
        row.variant,
        'center',
        row.timeCodes[0],
      )}`;
    }
    if (row.timeCodes.length === 0) {
      return html`${this.renderGameIcon(row.game, row.variant, 'center')}`;
    }

    throw new Error(
      'Unsupported number of timeCodes in row: ' + row.timeCodes.length,
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
