import { html, css, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { encodeGoalCardInfo, type SectionInfoList } from './SectionInfoType';

import './EditableGoalCardWidget';

const baseUrl = new URL('./Rekenspelletjes/', window.location.origin);

@customElement('create-goalcard-app')
export class CreateGoalCardApp extends LitElement {
  get pageTitle(): string {
    return `Maak een doelenkaart`;
  }

  @property({ type: Array })
  accessor sections: SectionInfoList = [];

  @state()
  accessor goalCardTitle = 'Testtitel';

  static get styles(): CSSResultArray {
    return [
      css`
        :host {
          font-size: x-large;
        }
      `,
    ];
  }

  log() {
    this.requestUpdate();
  }

  onSectionsChanged(sections: SectionInfoList) {
    this.sections = sections;
  }

  onGoalCardTitleChanged(updatedGoalCardTitle: string) {
    this.goalCardTitle = updatedGoalCardTitle;
  }

  render(): HTMLTemplateResult {
    const link = new URL(
      `./CustomIndex.html?d=${encodeGoalCardInfo({ goalCardTitle: this.goalCardTitle, sections: this.sections })}`,
      baseUrl,
    );
    return html`
      <h1>${this.pageTitle}</h1>
      <editable-goalcard-widget
        @sections-changed=${(e: CustomEvent<SectionInfoList>) =>
          this.onSectionsChanged(e.detail)}
        @goalCardTitle-changed=${(e: CustomEvent<string>) =>
          this.onGoalCardTitleChanged(e.detail)}
        .sections=${this.sections}
        .goalCardTitle=${this.goalCardTitle}
      ></editable-goalcard-widget>
      <h3>Link</h3>
      <a href=${link.href}>${link.href}</a>
      <p>
        <a href="index.html">Terug naar het hoofdmenu</a>
      </p>
    `;
  }
}
