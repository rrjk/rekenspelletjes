import { html, css, LitElement } from 'lit';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { customElement, state } from 'lit/decorators.js';

import './GoalCardIndexApp/EditableGoalCardSection';
import { SectionInfo } from './GoalCardIndexApp/SectionInfoType';

@customElement('test-app')
export class TestApp extends LitElement {
  @state()
  accessor sectionInfo: SectionInfo = {
    title: 'TestTitel',
    rows: [
      {
        entries: [{ game: 'A', variant: 'aa', timeCode: 'a' }],
      },
      {
        entries: [{ game: 'B', variant: 'aa', timeCode: 'a' }],
      },
      {
        entries: [{ game: 'C', variant: 'aa', timeCode: 'a' }],
      },
    ],
  };

  static get styles(): CSSResultArray {
    return [css``];
  }

  onSectionChanged(updatedSection: SectionInfo) {
    this.sectionInfo = updatedSection;
  }

  protected renderTest(): HTMLTemplateResult {
    return html`
      <editable-goalcard-section
        .section=${this.sectionInfo}
        @section-changed=${(e: CustomEvent<SectionInfo>) =>
          this.onSectionChanged(e.detail)}
        @section-deleted=${() => {
          console.warn('section-deleted');
        }}
      ></editable-goalcard-section>
    `;
  }

  protected render(): HTMLTemplateResult {
    return this.renderTest();
  }
}
