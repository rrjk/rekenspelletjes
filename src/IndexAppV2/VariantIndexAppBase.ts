import { css, html, LitElement } from 'lit';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';
import type { ClassInfo } from 'lit/directives/class-map.js';

import type { RenderGameIconFunction } from '../RenderGameIconFunction';
import type { TimeCode } from '../TimeCodes';

/**
 * A titled block on an index page containing multiple playable variants.
 *
 * The actual icon layout for each variant is determined by the app-wide
 * `timeCodes` property on the concrete index app.
 */
export interface VariantSection {
  title: string;
  rows: string[];
}

/** Maps each logical page key to the list of sections rendered on that page. */
export type VariantSections<PageKey extends string> = Record<
  PageKey,
  VariantSection[]
>;

/**
 * Shared base for variant index apps.
 *
 * Child classes provide four pieces of game-specific information:
 * - the selected page key
 * - the section data for each page
 * - the shared time codes for all variants on the page
 * - an icon renderer, usually a `render...HourglassGameIcon` function
 *
 * The parent class handles the common layout, row rendering, and back-link.
 */
export abstract class VariantIndexAppBase<
  PageKey extends string,
> extends LitElement {
  /** Active page key after child-specific URL/attribute conversion. */
  protected abstract get selectedPage(): PageKey;

  /** Full section map for this index component. */
  protected abstract get sectionsByPage(): VariantSections<PageKey>;

  /**
   * Shared time codes used for all variants in this index app.
   *
   * Supported lengths:
   * - 0: untimed icon
   * - 1: single centered timed icon
   * - 2: left/right timed icon pair
   */
  protected get timeCodes(): TimeCode[] {
    return [];
  }

  /** Renderer used to create game icons with optional time-code and classes. */
  protected abstract get iconRenderer(): RenderGameIconFunction;

  /** Set to true when a child wants empty section titles to still render an `h2`. */
  protected get showEmptySectionTitle(): boolean {
    return false;
  }

  /** Text used for the navigation link back to the main menu. */
  protected get backLinkText(): string {
    return 'Terug naar het hoofdmenu';
  }

  /** Href used for the navigation link back to the main menu. */
  protected get backLinkHref(): string {
    return 'index.html';
  }

  static get styles(): CSSResultArray {
    return [
      css`
        :host {
          font-size: x-large;
          --variant-index-table-width: min(400px, 90vw);
        }

        .buttonTable {
          position: relative;
          display: grid;
          row-gap: 10px;
          column-gap: 10px;
          grid-template-columns: repeat(2, 1fr);
          justify-items: center;
          width: var(--variant-index-table-width);
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

  protected renderIcon(
    variant: string,
    position: 'left' | 'right' | 'center',
    timeCode?: TimeCode,
  ): HTMLTemplateResult {
    const classes: ClassInfo = {
      leftGameIcon: position === 'left',
      rightGameIcon: position === 'right',
      centeredGameIcon: position === 'center',
    };
    return this.iconRenderer(variant, classes, timeCode);
  }

  protected renderRow(variant: string): HTMLTemplateResult {
    if (this.timeCodes.length === 2) {
      return html`
        ${this.renderIcon(variant, 'left', this.timeCodes[0])}
        ${this.renderIcon(variant, 'right', this.timeCodes[1])}
      `;
    }

    if (this.timeCodes.length === 1) {
      return html`${this.renderIcon(variant, 'center', this.timeCodes[0])}`;
    }

    if (this.timeCodes.length === 0) {
      return html`${this.renderIcon(variant, 'center')}`;
    }

    throw new Error(
      `Unsupported number of timeCodes in index app: ${this.timeCodes.length}`,
    );
  }

  protected renderSection(section: VariantSection): HTMLTemplateResult {
    return html`
      ${this.showEmptySectionTitle || section.title !== ''
        ? html`<h2>${section.title}</h2>`
        : ''}
      <div class="buttonTable">
        ${section.rows.map(row => this.renderRow(row))}
      </div>
    `;
  }

  render(): HTMLTemplateResult[] {
    const renderItems: HTMLTemplateResult[] = [];
    for (const section of this.sectionsByPage[this.selectedPage]) {
      renderItems.push(this.renderSection(section));
    }
    renderItems.push(
      html`<p><a href=${this.backLinkHref}>${this.backLinkText}</a></p>`,
    );
    return renderItems;
  }
}
