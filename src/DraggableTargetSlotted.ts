import { CSSResultArray, css } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement } from 'lit/decorators.js';
import {
  DraggableElement,
  DropTargetElementInterface,
  HighlightType,
} from './DraggableElement';

export interface HighlightableElement extends Element {
  highlightState: HighlightType;
}

@customElement('draggable-target-slotted')
export class DraggableTargetSlotted
  extends DraggableElement
  implements DropTargetElementInterface
{
  /** Get all static styles */
  static get styles(): CSSResultArray {
    return [
      super.styles,
      css`
        :host {
          border: 1px red solid;
        }
      `,
    ];
  }

  highlightForDrop(newState: HighlightType): void {
    const slot = this.renderRoot.querySelector('slot')!;
    console.assert(slot !== null);

    const slottedElements = slot.assignedElements() as HighlightableElement[];
    // We don't check whether the assigned elements are indeed highlightable
    // as we will only set the highlightState attribute, which is also possible
    // if the element is not in fact a highlightable element.
    for (const elm of slottedElements) {
      // We set the highlightState attribute, just in case we have slotted a element that does react on programmatic attribute changes
      elm.setAttribute('highlightState', newState);
      // We set the highlightState property as a lit element will not pick up on a attribute change when this is done outside of lit element
      elm.highlightState = newState;
    }
  }
}
