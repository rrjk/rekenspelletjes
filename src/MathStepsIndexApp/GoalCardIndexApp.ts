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

interface EntryType<Game> {
  game: Game;
  variant: string;
  timeCode: TimeCode;
}

interface SectionInfoType<Game> {
  title: string;
  rows: EntryType<Game>[];
}

export interface IndexPageType<Game> {
  defaultPage: SectionInfoType<Game>[];
}

export abstract class GoalCardIndexApp<Game extends string> extends LitElement {
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
          display: flex;
          row-gap: 10px;
          column-gap: 10px;
          flex-wrap: wrap;
          justify-content: space-around;
          width: min(850px, 90vw);
        }

        .gameIcon {
          width: 200px;
          grid-column-start: 1;
          grid-column-end: span 1;
        }
      `,
    ];
  }

  abstract iconFunctions: Record<Game, RenderGameIconFunction>;

  renderGameIcon(
    game: Game,
    variant: string,

    timeCode?: TimeCode,
  ): HTMLTemplateResult {
    const classes: ClassInfo = {
      gameIcon: true,
    };
    return this.iconFunctions[game](variant, classes, timeCode);
  }

  renderEntry(row: EntryType<Game>): HTMLTemplateResult {
    if (row.timeCode) {
      return html`${this.renderGameIcon(row.game, row.variant, row.timeCode)}`;
    }
    return html`${this.renderGameIcon(row.game, row.variant)}`;
  }

  render(): HTMLTemplateResult[] {
    const renderItems: HTMLTemplateResult[] = [];
    renderItems.push(html`<h1>${this.pageTitle}</h1> `);
    for (const section of this.sections[this.indexPage]) {
      renderItems.push(html`
        <h2>${section.title}</h2>
        <div class="buttonTable">
          ${section.rows.map(row => this.renderEntry(row))}
        </div>
      `);
    }
    renderItems.push(
      html` <p>
        <a href="RekenStappenOverzicht.html">Terug naar het hoofdmenu</a>
      </p>`,
    );
    return renderItems;
  }
}
