import { LitElement, html, css } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, state } from 'lit/decorators.js';
// eslint-disable-next-line import/extensions
import { classMap } from 'lit/directives/class-map.js';

import { DropTargetElement, HighlightType } from './DraggableElement';

@customElement('drop-target-trashcan')
export class DropTargetTrashcan
  extends LitElement
  implements DropTargetElement
{
  @state()
  accessor highlighted: HighlightType = 'none';

  highlightForDrop(newState: HighlightType): void {
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
        background-color: lightgrey;
      }
    `;
  }

  render(): HTMLTemplateResult {
    return html`
      <img
        draggable="false"
        alt="trashcan"
        class="trashcan ${classMap({
          trashcan: true,
          highlightDroppable: this.highlighted === 'droppable',
        })}"
        src="../images/trashcan.png"
      />
    `;
  }
}
