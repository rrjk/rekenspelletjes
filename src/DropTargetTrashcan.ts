import { LitElement, html, css } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { DropTargetElementInterface, HighlightType } from './DraggableElement';

const trashcanUrl = new URL('../images/trashcan.png', import.meta.url);

@customElement('drop-target-trashcan')
export class DropTargetTrashcan
  extends LitElement
  implements DropTargetElementInterface
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
        background-color: var(--highlightBackgroundColor, lightgrey);
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
        src=${trashcanUrl.href}
      />
    `;
  }
}
