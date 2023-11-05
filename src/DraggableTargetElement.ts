import { CSSResultArray, LitElement, css } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, property } from 'lit/decorators.js';
import {
  DraggableElement,
  DropTargetElement,
  HighlightType,
} from './DraggableElement';

@customElement('draggable-target-element')
export class DraggableTargetElement
  extends DraggableElement
  implements DropTargetElement
{
  /** Get all static styles */
  static get styles(): CSSResultArray {
    return [
      super.styles,
      css`
        :host {
          background-color: #dddddd;
        }
      `,
    ];
  }

  highlightForDrop(newState: HighlightType): void {
    console.log(`Highlight for Drop: ${newState}`);
  }
}
