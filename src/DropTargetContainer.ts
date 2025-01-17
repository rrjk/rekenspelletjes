import { LitElement, html, css } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, state } from 'lit/decorators.js';

import { DropTargetElementInterface, HighlightType } from './DraggableElement';

@customElement('drop-target-container')
export class DropTargetContainer
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
      div {
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .highlightDroppable {
        background-color: lightgrey;
      }

      .highlightWrong {
        background-color: red;
      }
    `;
  }

  render(): HTMLTemplateResult {
    console.log(`highlight = ${this.highlighted}`);
    return html`
      <div
        class="${this.highlighted === 'droppable'
          ? 'highlightDroppable'
          : ''} ${this.highlighted === 'wrong' ? 'highlightWrong' : ''}"
      >
        <slot></slot>
      </div>
    `;
  }
}
