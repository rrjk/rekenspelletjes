import { LitElement, html, css } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, state } from 'lit/decorators.js';

import { DropTargetElement, HighlightType } from './DraggableElement';

@customElement('drop-target-trashcan')
export class DropTargetTrashcan
  extends LitElement
  implements DropTargetElement
{
  @state()
  accessor highlighted: HighlightType = 'none';

  highlightForDrop(newState: HighlightType): void {
    console.log(`highlightForDrop (trashcan), newState = ${newState}`);
    this.highlighted = newState;
  }

  /** Get all static styles */
  static get styles(): CSSResultGroup {
    return css`
      :host {
        display: block;
      }

      img.trashcan {
        width: 90%;
        height: 90%;
        object-fit: contain;
      }

      .highlightDroppable {
        background-color: cyan;
      }

      .highlightWrong {
        background-color: red;
      }
    `;
  }

  render(): HTMLTemplateResult {
    let highlightClass = ``;
    if (this.highlighted === 'droppable') highlightClass = `highlightDroppable`;
    else if (this.highlighted === 'wrong') highlightClass = `highlightWrong`;
    console.log(`highlightClass = ${highlightClass}`);

    return html`
      <img alt="trashcan" class="trashcan" src="../images/trashcan.png" />
    `;
  }
}
