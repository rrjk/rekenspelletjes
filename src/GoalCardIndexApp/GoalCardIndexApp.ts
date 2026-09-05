import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import type { SectionInfoList } from './SectionInfoType';

import './GoalCardWidget';

export interface IndexPage {
  defaultPage: SectionInfoList;
}

export abstract class GoalCardIndexApp extends LitElement {
  get pageTitle(): string {
    return `To be set by subclass`;
  }

  @property({ type: Array })
  protected accessor sections: SectionInfoList = [];

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
      <goal-card-widget .sections=${this.sections}></goal-card-widget>
      <p>
        <a href="index.html">Terug naar het hoofdmenu</a>
      </p>
    `;
  }
}
