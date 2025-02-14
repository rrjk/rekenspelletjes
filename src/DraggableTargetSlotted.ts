import { CSSResultArray, css } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, state } from 'lit/decorators.js';
import type { PropertyValues } from 'lit';
import {
  DraggableElement,
  DropTargetElementInterface,
  HighlightType,
} from './DraggableElement';

@customElement('draggable-target-slotted')
export class DraggableTargetFraction
  extends DraggableElement
  implements DropTargetElementInterface
{
  @state()
  private accessor hightlighState: HighlightType = 'none';

  /** Get all static styles */
  static get styles(): CSSResultArray {
    return [super.styles, css``];
  }

  protected updated(_changedProperties: PropertyValues): void {
    if (_changedProperties.has('hightlighState')) {
      const slot = this.renderRoot.querySelector('slot')!;
      console.assert(slot !== null);

      const slottedElements = slot.assignedElements();
      console.log(`updated`);
      console.log(slottedElements);

      for (const elm of slottedElements) {
        // ToDo: This does not work when there are text nodes in between, so I need to filter out the text nodes
        elm.setAttribute('highlightState', this.hightlighState);
      }
    }
  }

  highlightForDrop(newState: HighlightType): void {
    this.hightlighState = newState;
  }
}
