import { LitElement, html, css } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, property, state } from 'lit/decorators.js';
import type { ResizeObserverClientInterface } from './ResizeObserver';
import {
  removeResizeObserverClient,
  addResizeObserverClient,
} from './ResizeObserver';

@customElement('dynamic-grid')
export class DynamicGrid
  extends LitElement
  implements ResizeObserverClientInterface
{
  @property({ type: Number })
  numberInGroup = 1;

  /** The aspect ratio of the elements that are placed inside the grid. */
  @property({ type: Number })
  contentAspectRatio = 1;
  @state()
  perRow = 0;
  @state()
  perColumn = 0;

  static get styles(): CSSResultGroup {
    return css`
      :host {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        align-content: space-around;
      }

      .flexItem {
        display: flex;
        flex-wrap: wrap;
        width: calc(90% / var(--perRow));
        height: calc(90% / var(--perColumn));
        align-content: center;
        justify-content: center;
        text-align: center;
      }
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();
    addResizeObserverClient(this);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    removeResizeObserverClient(this);
  }

  willUpdate(_changedProperties: Map<string | number | symbol, unknown>): void {
    if (_changedProperties.has('numberInGroup')) {
      this.determineNumberRowsAndColumns();
    }
  }

  handleResize() {
    this.determineNumberRowsAndColumns();
  }

  determineNumberRowsAndColumns() {
    // const imageAspectRatio = getImageInfo(this.image).aspectRatio;
    const boxAspectRatio = this.clientWidth / this.clientHeight;

    const ratioPerRowPerColumn = boxAspectRatio / this.contentAspectRatio;

    const perColumnCeiled = Math.ceil(
      Math.sqrt(this.numberInGroup / ratioPerRowPerColumn)
    );
    const perColumnFloored = Math.floor(
      Math.sqrt(this.numberInGroup / ratioPerRowPerColumn)
    );

    const resultingRatioRowPerColumnCeiled =
      Math.ceil(this.numberInGroup / perColumnCeiled) / perColumnCeiled;
    const resultingRatioRowPerColumnFloored =
      Math.ceil(this.numberInGroup / perColumnFloored) / perColumnFloored;

    if (
      Math.abs(resultingRatioRowPerColumnCeiled - ratioPerRowPerColumn) >
      Math.abs(resultingRatioRowPerColumnFloored - ratioPerRowPerColumn)
    ) {
      this.perColumn = perColumnFloored;
    } else {
      this.perColumn = perColumnCeiled;
    }

    this.perRow = Math.ceil(this.numberInGroup / this.perColumn);
  }

  get _slottedChildren() {
    const slot = this.shadowRoot?.querySelector('slot');

    return slot?.assignedElements({ flatten: true });
  }

  protected render(): HTMLTemplateResult {
    /* Some design notes
     * A div is put around the actual content to control the number of items in a row,
     * using flex-basis on the div it's ensured we get the right number of images in a row,
     * in stead of as many as could possibly fit.
     */

    return html`
      <style>
        :host {
          --perRow: ${this.perRow};
          --perColumn: ${this.perColumn};
          --aspectRatio: ${this.contentAspectRatio};
        }
      </style>
      <slot></slot>
      ${this._slottedChildren?.map(
        slotElm => html`<div class="flexItem">${slotElm}</div>`
      )}
      ${Array.from(this.children).map(
        slotElm => html`<div class="flexItem">${slotElm}</div>`
      )}
    `;
  }
}
