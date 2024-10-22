import { LitElement, html, css } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, property, state } from 'lit/decorators.js';

import { DropTargetElement, HighlightType } from './DraggableElement';

type ItemType = 'egg' | 'eggCarton';

@customElement('drop-target-egg')
export class DropTargetEgg extends LitElement implements DropTargetElement {
  @property({ type: Number })
  accessor numberItemsToShow: number = 8;

  @property({ type: String })
  accessor itemType: ItemType = 'eggCarton';

  @state()
  accessor highlighted: HighlightType = 'none';

  highlightForDrop(newState: HighlightType): void {
    console.log(`highlightForDrop, newState = ${newState}`);
    this.highlighted = newState;
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
        background-color: orange;
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
        background-color: cyan;
      }

      .highlightWrong {
        background-color: red;
      }

      dynamic-grid {
        height: 100%;
        width: 100%;
        box-sizing: border-box;
      }
    `;
  }

  render(): HTMLTemplateResult {
    const eggElements: HTMLTemplateResult[] = [];
    for (let i = 0; i < 10; i++) {
      eggElements.push(
        html` <div class="eggElement">
          ${i < this.numberItemsToShow
            ? html`<img
                draggable="false"
                class="${this.itemType}"
                alt="${this.itemType}"
                src="../images/${this.itemType}.png"
              />`
            : html``}
        </div>`,
      );
    }

    let highlightClass = ``;
    if (this.highlighted === 'droppable') highlightClass = `highlightDroppable`;
    else if (this.highlighted === 'wrong') highlightClass = `highlightWrong`;
    console.log(`highlightClass = ${highlightClass}`);

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
