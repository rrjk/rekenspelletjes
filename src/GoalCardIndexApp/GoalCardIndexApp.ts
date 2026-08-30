import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import type { SectionInfoList } from './SectionInfoType';

import './GoalCardWidget';

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
      `,
    ];
  }

  render(): HTMLTemplateResult {
    return html`
      <h1>${this.pageTitle}</h1>
      <goal-card-widget
        .sections=${this.sections[this.indexPage]}
      ></goal-card-widget>
      <p>
        <a href="index.html">Terug naar het hoofdmenu</a>
      </p>
    `;
  }
}
