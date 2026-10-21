import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';
import { GoalCardInfo, SectionInfo } from './SectionInfoType';

import './EditableText';
import './EditableGoalCardSection';

/** Editable goal card widget
 * @event goalCardInfo-changed  - Fired when the goal card information changes
 */
@customElement('editable-goalcard-widget')
export class EditableGoalCardWidget extends LitElement {
  /** Content for the goalcard */
  @property({ type: Object, attribute: false })
  accessor goalCardInfo: GoalCardInfo = { title: '', sections: [] };

  static get styles(): CSSResultArray {
    return [
      css`
        :host {
          font-size: x-large;
        }

        editable-text {
          --font-size: 1.5em;
          --font-weight: bold;
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
    if (index < 0 || index > this.goalCardInfo.sections.length) {
      throw new Error(`Invalid index for new section: ${index}`);
    }
    const newSection: SectionInfo = {
      title: `Blok titel`,
      rows: [],
    };

    const updatedGoalCardInfo = {
      title: this.goalCardInfo.title,
      sections: [
        ...this.goalCardInfo.sections.slice(0, index),
        newSection,
        ...this.goalCardInfo.sections.slice(index),
      ],
    };

    this.dispatchEvent(
      new CustomEvent<GoalCardInfo>('goalCardInfo-changed', {
        detail: updatedGoalCardInfo,
      }),
    );
  }

  onSectionChanged(index: number, updatedSection: SectionInfo) {
    const updatedGoalCardInfo = {
      title: this.goalCardInfo.title,
      sections: [
        ...this.goalCardInfo.sections.slice(0, index),
        updatedSection,
        ...this.goalCardInfo.sections.slice(index + 1),
      ],
    };

    this.dispatchEvent(
      new CustomEvent<GoalCardInfo>('goalCardInfo-changed', {
        detail: updatedGoalCardInfo,
      }),
    );
  }

  onSectionDeleted(index: number) {
    const updatedGoalCardInfo = {
      title: this.goalCardInfo.title,
      sections: [
        ...this.goalCardInfo.sections.slice(0, index),
        ...this.goalCardInfo.sections.slice(index + 1),
      ],
    };

    this.dispatchEvent(
      new CustomEvent<GoalCardInfo>('goalCardInfo-changed', {
        detail: updatedGoalCardInfo,
      }),
    );
  }

  onGoalCardTitleChanged(updatedTitle: string) {
    const updatedGoalCardInfo = {
      title: updatedTitle,
      sections: this.goalCardInfo.sections,
    };

    this.dispatchEvent(
      new CustomEvent<GoalCardInfo>('goalCardInfo-changed', {
        detail: updatedGoalCardInfo,
      }),
    );
  }

  render(): HTMLTemplateResult[] {
    const ret: HTMLTemplateResult[] = [];
    ret.push(html`
      <editable-text
        .value=${this.goalCardInfo.title}
        @value-changed=${(e: CustomEvent<string>) =>
          this.onGoalCardTitleChanged(e.detail)}
      ></editable-text>
    `);
    for (const [index, section] of this.goalCardInfo.sections.entries()) {
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
        <button
          @click=${() => this.addSection(this.goalCardInfo.sections.length)}
        >
          Nieuw blok
        </button>
      </div>`,
    );
    return ret;
  }
}
