import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';
import { SectionInfo, SectionInfoList } from './SectionInfoType';

import './EditableText';
import './EditableGoalCardSection';

/** Editable goal card widget
 * @event {SectionsChangedEvent} sections-changed  - Fired when the sections change
 */
@customElement('editable-goalcard-widget')
export class EditableGoalCardWidget extends LitElement {
  @property({ type: Array })
  accessor sections: SectionInfoList = [];
  @property({ type: String })
  accessor goalCardTitle = 'Doelenkaart titel';

  static get styles(): CSSResultArray {
    return [
      css`
        :host {
          font-size: x-large;
        }

        div.sectionButton {
          display: flex;
          justify-content: center;
          margin-top: 10px;
          width: min(400px, 90vw);
          padding: 2px;
          margin: 2px;
        }
      `,
    ];
  }

  /** Add a section
   * @param index index in the existing array of sections
   * in front of which the new section is to be added. If index
   * equals the length of the existing array of sections, it will be added at the end.
   */
  addSection(index: number) {
    if (index < 0 || index > this.sections.length) {
      throw new Error(`Invalid index for new section: ${index}`);
    }
    const newSection: SectionInfo = {
      title: `Blok titel`,
      rows: [],
    };

    const updatedSections = [
      ...this.sections.slice(0, index),
      newSection,
      ...this.sections.slice(index),
    ];
    // console.log(updatedSections === this.sections);
    this.dispatchEvent(
      new CustomEvent<SectionInfoList>('sections-changed', {
        detail: updatedSections,
      }),
    );
  }

  onSectionChanged(index: number, updatedSection: SectionInfo) {
    const updatedSections = [
      ...this.sections.slice(0, index),
      updatedSection,
      ...this.sections.slice(index + 1),
    ];

    this.dispatchEvent(
      new CustomEvent<SectionInfoList>('sections-changed', {
        detail: updatedSections,
      }),
    );
  }

  onSectionDeleted(index: number) {
    const updatedSections = [
      ...this.sections.slice(0, index),
      ...this.sections.slice(index + 1),
    ];

    this.dispatchEvent(
      new CustomEvent<SectionInfoList>('sections-changed', {
        detail: updatedSections,
      }),
    );
  }

  onGoalCardTitleChanged(updatedTitle: string) {
    this.dispatchEvent(
      new CustomEvent<string>('goalCardTitle-changed', {
        detail: updatedTitle,
      }),
    );
  }

  render(): HTMLTemplateResult[] {
    const ret: HTMLTemplateResult[] = [];
    //    for (const section of this.sections) {
    ret.push(html`
      <editable-text
        .value=${this.goalCardTitle}
        @value-changed=${(e: CustomEvent<string>) =>
          this.onGoalCardTitleChanged(e.detail)}
      ></editable-text>
    `);
    for (const [index, section] of this.sections.entries()) {
      ret.push(html`
        <div class="sectionButton">
          <button @click=${() => this.addSection(index)}>Nieuw blok</button>
        </div>
        <editable-goalcard-section
          .section=${section}
          @section-changed=${(e: CustomEvent<SectionInfo>) =>
            this.onSectionChanged(index, e.detail)}
          @section-deleted=${() => this.onSectionDeleted(index)}
        ></editable-goalcard-section>
      `);
    }
    ret.push(
      html` <div class="sectionButton">
        <button @click=${() => this.addSection(this.sections.length)}>
          Nieuw blok
        </button>
      </div>`,
    );
    return ret;
  }
}
