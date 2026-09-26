import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';
import { Row, SectionInfo } from './SectionInfoType';

import './EditableText';
import './EditableGoalCardRow';
import { GameInfo } from '../URLshortener2';
import { renderPlusIcon, renderTranscanIcon } from '../Icons';

/** Editable goal card widget
 * @event section-changed  - Fired when the content of the section changes
 */
@customElement('editable-goalcard-section')
export class EditableGoalCardSection extends LitElement {
  @property({ type: Object, attribute: false })
  accessor section: SectionInfo = { title: 'Blok titel', rows: [] };

  static get styles(): CSSResultArray {
    return [
      css`
        :host {
          display: block;
          font-size: x-large;
          border: 2px black solid;
          width: min(400px, 90vw);
          padding: 2px;
          margin: 2px;
          border-radius: 5px;
        }
        .sectionDelete {
          display: grid;
          columns: 100%;
          justify-items: center;
          width: 100%;
        }
        .sectionHeader {
          display: flex;
          column-gap: 10px;
          width: 100%;
        }
        .buttonTable {
          position: relative;
          display: grid;
          row-gap: 10px;
          column-gap: 10px;
          grid-template-columns: 100%;
          justify-content: space-around;
          justify-items: center;
          width: 100%;
        }
        button {
          aspect-ratio: 1;
          width: 8%;
          min-height: 0;
          margin: 0;
          padding: 0;
        }
      `,
    ];
  }

  onGamesChanged(rowIndex: number, updatedGames: GameInfo[]) {
    const updatedSection = {
      title: this.section.title,
      rows: [
        ...this.section.rows.slice(0, rowIndex),
        { entries: updatedGames },
        ...this.section.rows.slice(rowIndex + 1, this.section.rows.length),
      ],
    };
    this.dispatchEvent(
      new CustomEvent<SectionInfo>('section-changed', {
        detail: updatedSection,
      }),
    );
  }

  onRowDeleted(rowIndex: number) {
    const updatedSection = {
      title: this.section.title,
      rows: [
        ...this.section.rows.slice(0, rowIndex),
        ...this.section.rows.slice(rowIndex + 1, this.section.rows.length),
      ],
    };
    this.dispatchEvent(
      new CustomEvent<SectionInfo>('section-changed', {
        detail: updatedSection,
      }),
    );
  }

  onTitleChange(updatedTitle: string) {
    const updatedSection: SectionInfo = {
      ...this.section,
      title: updatedTitle,
    };
    this.dispatchEvent(
      new CustomEvent<SectionInfo>('section-changed', {
        detail: updatedSection,
      }),
    );
  }
  /** Add a new row before the row indicated by the rowIndex
   * @param rowIndex - Index before which a row is to be added. If rowIndex equals the number of rows, the row is added to the end.
   */
  onAddRow(rowIndex: number) {
    const newRow: Row = {
      entries: [{ game: 'A', variant: 'aa', timeCode: 'a' }],
    };
    const updatedSection = {
      ...this.section,
      rows: [
        ...this.section.rows.slice(0, rowIndex),
        newRow,
        ...this.section.rows.slice(rowIndex, this.section.rows.length),
      ],
    };
    this.dispatchEvent(
      new CustomEvent<SectionInfo>('section-changed', {
        detail: updatedSection,
      }),
    );
  }

  /** Delete the entire section
   * Send a selection-deleted event.
   */
  onDeleteSection() {
    this.dispatchEvent(new Event('section-deleted'));
  }

  renderRow(rowIndex: number): HTMLTemplateResult {
    const row = this.section.rows[rowIndex].entries;
    return html`
      <button class="plusButton" @click=${() => this.onAddRow(rowIndex)}>
        ${renderPlusIcon()}
      </button>
      <editable-goalcard-row
        .games=${row}
        @games-changed=${(e: CustomEvent<GameInfo[]>) =>
          this.onGamesChanged(rowIndex, e.detail)}
        @row-deleted=${() => this.onRowDeleted(rowIndex)}
      ></editable-goalcard-row>
    `;
  }

  render(): HTMLTemplateResult {
    return html`
      <div class="sectionDelete">
        <button @click=${() => this.onDeleteSection()}>
          ${renderTranscanIcon()}
        </button>
      </div>
      <editable-text
        value=${this.section.title}
        @value-changed=${(e: CustomEvent<string>) =>
          this.onTitleChange(e.detail)}
      >
      </editable-text>
      <div class="buttonTable">
        ${this.section.rows.map((row, index) => this.renderRow(index))}
        <button
          class="plusButton"
          @click=${() => this.onAddRow(this.section.rows.length)}
        >
          ${renderPlusIcon()}
        </button>
      </div>
    `;
  }
}
