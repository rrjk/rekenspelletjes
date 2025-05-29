import { LitElement, html, css } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { DropTargetElementInterface, HighlightType } from './DraggableElement';

type ItemType = 'egg' | 'eggCarton';

const imageURLs: Record<ItemType, URL> = {
  egg: new URL('../images/egg.png', import.meta.url),
  eggCarton: new URL('../images/eggCarton.png', import.meta.url),
};

@customElement('drop-target-egg')
export class DropTargetEgg
  extends LitElement
  implements DropTargetElementInterface
{
  @property({ type: Number })
  accessor numberItemsToShow = 8;

  @property({ type: Number })
  accessor maxNumberItemsToShow = 12;

  @property({ type: String })
  accessor itemType: ItemType = 'eggCarton';

  @property({ attribute: false })
  accessor trashcanAreas: DropTargetElementInterface[] = [];

  @state()
  accessor highlighted: HighlightType = 'none';

  highlightForDrop(newState: HighlightType): void {
    this.highlighted = newState;
  }

  dropInTrashcan(): void {
    const event = new Event('itemTrashed');
    this.dispatchEvent(event);
  }

  handleDragStarted(): void {
    const event = new Event('dragStarted');
    this.dispatchEvent(event);
  }

  /** Get all static styles */
  static get styles(): CSSResultGroup {
    return css`
      :host {
        display: block;
      }

      .eggElement {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .hidden {
        visibility: hidden;
      }

      img.eggCarton {
        width: 90%;
        height: 90%;
        object-fit: contain;
      }

      img.egg {
        width: 50%;
        height: 50%;
        object-fit: contain;
      }

      .highlightDroppable {
        background-color: var(--highlightBackgroundColor, lightgrey);
      }

      .highlightWrong {
        background-color: red;
      }

      dynamic-grid {
        height: 100%;
        width: 100%;
        box-sizing: border-box;
      }

      draggable-element {
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    `;
  }

  render(): HTMLTemplateResult {
    const eggElements: HTMLTemplateResult[] = [];
    for (let i = 0; i < this.maxNumberItemsToShow; i++) {
      let hiddenClass = '';
      if (i >= this.numberItemsToShow) hiddenClass = 'hidden';
      eggElements.push(
        html` <div class="eggElement ${hiddenClass}">
          <draggable-element
            resetDragAfterDrop
            .dropTargetList="${this.trashcanAreas}"
            @dropped="${this.dropInTrashcan}"
            @dragStarted="${this.handleDragStarted}"
          >
            <img
              draggable="false"
              class="${this.itemType}"
              alt="${this.itemType}"
              src="${imageURLs[this.itemType]}"
            />
          </draggable-element>
        </div>`,
      );
    }

    let highlightClass = ``;
    if (this.highlighted === 'droppable') highlightClass = `highlightDroppable`;
    else if (this.highlighted === 'wrong') highlightClass = `highlightWrong`;

    return html`
      <dynamic-grid
        class="${highlightClass}"
        fillDirection="bottomtop"
        contentAspectRatio=${230 / 100}
      >
        ${eggElements}
      </dynamic-grid>
    `;
  }
}
