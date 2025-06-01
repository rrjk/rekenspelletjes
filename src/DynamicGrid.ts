import { LitElement, html, css } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { ResizeObserverClientInterface } from './ResizeObserver';
import {
  removeResizeObserverClient,
  addResizeObserverClient,
} from './ResizeObserver';

type FillDirection = 'topbottom' | 'bottomtop';

/** A custom element that places it's children in a dynamic grid. Based on the provided
 * contentAspectRatio the optimal number of rows and columns is determined based on the
 * number of children.
 *
 * The children will be sized by the dynamic grid and hence should not have a size set.
 *
 
 * @property contentAspectRatio: the aspect ratio for the grid elements. If different children have a different aspect ratio
 * take the one closest to 1.
 */
@customElement('dynamic-grid')
export class DynamicGrid
  extends LitElement
  implements ResizeObserverClientInterface
{
  /** Padding applied to the children, as percentage of the width of the dynamic grid. */
  @property({ type: Number })
  accessor padding = 2;
  /** The aspect ratio of the elements that are placed inside the grid. */
  @property({ type: Number })
  accessor contentAspectRatio = 1;
  /** Direction to fill grid */
  @property({ type: String })
  accessor fillDirection: FillDirection = 'topbottom';

  /** Number of cells per row, calculated automatically */
  @state()
  accessor perRow = 0;
  /** Number of cells per column, calculated automatically */
  @state()
  accessor perColumn = 0;

  static get styles(): CSSResultGroup {
    return css`
      :host {
        display: flex;
        justify-content: space-around;
        align-content: space-around;
      }

      ::slotted(*) {
        width: calc(100% / var(--perRow));
        height: calc(100% / var(--perColumn));
        box-sizing: border-box;
        padding: var(--padding);
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

  handleResize() {
    this.determineNumberRowsAndColumns();
  }

  handleSlottedElementsChange() {
    this.determineNumberRowsAndColumns();
  }

  determineNumberRowsAndColumns() {
    // const imageAspectRatio = getImageInfo(this.image).aspectRatio;
    const boxAspectRatio = this.clientWidth / this.clientHeight;

    const ratioPerRowPerColumn = boxAspectRatio / this.contentAspectRatio;

    const perColumnCeiled = Math.ceil(
      Math.sqrt(this.numberSlottedChildren / ratioPerRowPerColumn),
    );
    const perColumnFloored = Math.floor(
      Math.sqrt(this.numberSlottedChildren / ratioPerRowPerColumn),
    );

    const resultingRatioRowPerColumnCeiled =
      Math.ceil(this.numberSlottedChildren / perColumnCeiled) / perColumnCeiled;
    const resultingRatioRowPerColumnFloored =
      Math.ceil(this.numberSlottedChildren / perColumnFloored) /
      perColumnFloored;

    if (
      Math.abs(resultingRatioRowPerColumnCeiled - ratioPerRowPerColumn) >
      Math.abs(resultingRatioRowPerColumnFloored - ratioPerRowPerColumn)
    ) {
      this.perColumn = perColumnFloored;
    } else {
      this.perColumn = perColumnCeiled;
    }

    this.perRow = Math.ceil(this.numberSlottedChildren / this.perColumn);
  }

  get numberSlottedChildren() {
    const slot = this.shadowRoot?.querySelector('slot');
    let numberSlottedElements = 0;
    if (slot)
      numberSlottedElements = slot.assignedElements({ flatten: true }).length;
    return numberSlottedElements;
  }

  protected render(): HTMLTemplateResult {
    /* The slotted elements are given a size based on the number of rows and columns calculated.
     * This size is set in the styles static getter.
     * The slotted elements are given a padding based on the padding property.
     * If the slots change, we need to determine the number of rows and columns as the number of slotted elements might have changed.
     */
    return html`
      <style>
        :host {
          --perRow: ${this.perRow};
          --perColumn: ${this.perColumn};
          --padding: ${this.padding}%;
          flex-wrap: ${this.fillDirection === 'topbottom'
            ? `wrap`
            : `wrap-reverse`};
        }
      </style>
      <slot @slotchange=${() => this.handleSlottedElementsChange()}></slot>
    `;
  }
}
